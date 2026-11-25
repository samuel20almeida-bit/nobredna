// Run against a local, credential-free preview build. No external purchase or message.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE ?? "playwright");
const base = process.env.BASE_URL ?? "http://127.0.0.1:3017";
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_EXECUTABLE ? { executablePath: process.env.CHROMIUM_EXECUTABLE } : {}) });
try {
  for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
    const context = await browser.newContext({ viewport, reducedMotion:"reduce" });
    const page = await context.newPage();
    const uncaught = [];
    page.on("pageerror", error => uncaught.push(error.message));
    await page.goto(base + "/livros");
    await page.getByRole("searchbox").fill("Ave");
    const add = page.getByRole("button",{name:"Adicionar à sacola"}).first();
    await add.click();
    await page.getByRole("link",{name:/Revisar pedido/}).click();
    await page.getByRole("heading",{name:"Livros na sacola"}).waitFor();
    assert.ok(await page.getByText("Você não paga agora.",{exact:true}).isVisible());
    await page.getByRole("button",{name:"Continuar para contato"}).click();
    await page.getByLabel("Nome completo").fill("QA Fluxo");
    await page.getByRole("button",{name:"Revisar solicitação"}).click();
    await page.getByRole("alert").waitFor();
    await page.getByLabel("E-mail",{exact:true}).fill("qa@example.invalid");
    await page.getByRole("button",{name:"Revisar solicitação"}).click();
    await page.getByRole("heading",{name:"Revise sua solicitação de compra"}).waitFor();
    await page.getByRole("checkbox").check();
    // Simulated API in local-only browser test: never contacts production.
    await page.route("**/api/contato", route=>route.fulfill({status:201,contentType:"application/json",body:JSON.stringify({ok:true,protocolo:"ND-"+"A".repeat(32)})}));
    await page.getByRole("button",{name:"Solicitar compra"}).click();
    await page.getByRole("heading",{name:"Solicitação de compra recebida!"}).waitFor();
    assert.ok(await page.getByRole("heading",{name:"O que acontece agora?"}).isVisible());
    await page.reload();
    await page.getByRole("heading",{name:"Solicitação de compra recebida!"}).waitFor();
    await page.goto(base + "/checkout/demonstracao");
    await page.getByRole("button",{name:"Aumentar quantidade"}).click();
    await page.getByLabel(/Expresso/).check();
    await page.getByLabel("Cartão de crédito").check();
    await page.getByRole("button",{name:"Simular finalização"}).click();
    await page.getByRole("heading",{name:"Simulação concluída."}).waitFor();
    assert.ok(await page.getByText("R$ 162,90",{exact:true}).isVisible());
    await page.goto(base + "/checkout/retorno?status=aprovado&pedido=NDNA-"+"A".repeat(32));
    await page.getByRole("heading",{name:"Aguardando confirmação."}).waitFor();
    await page.goto(base + "/admin");
    await page.getByText("Configuração em andamento",{exact:true}).waitFor();
    const layout = await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth}));
    assert.ok(layout.scroll <= layout.viewport + 1, "admin preview has horizontal overflow");
    for (const route of ["/api/checkout/preferencia","/api/frete/cotacao","/api/checkout/webhook"]) {
      const response = await context.request.post(base+route,{data:{}});
      assert.equal(response.status(),503,route + " must remain disabled in preview");
    }
    assert.deepEqual(uncaught,[]);
    console.log(`PASS ${viewport.width}×${viewport.height}: catálogo, sacola, demonstração, retorno, painel e bloqueios HTTP.`);
    await context.close();
  }
} finally { await browser.close(); }
