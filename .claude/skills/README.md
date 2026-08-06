# Skills instaladas neste projeto

## ui-ux-pro-max (e skills irmãs)

Origem: <https://github.com/nextlevelbuilder/ui-ux-pro-max-skill>
Versão: 2.13.0 · Licença: MIT (ver `LICENSE` nesta pasta)
Instalado em: agosto de 2026, a partir do commit `abb7f2f`.

Sete skills vieram no pacote: `ui-ux-pro-max`, `design`, `design-system`,
`ui-styling`, `brand`, `banner-design` e `slides`.

### Como chamar a busca

O `SKILL.md` original assume a variável `${CLAUDE_PLUGIN_ROOT}`, que só existe
quando o pacote é instalado como plugin. Aqui as skills estão versionadas
dentro do projeto, então use o caminho relativo à raiz do repositório:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<consulta>" --domain <domínio>
```

Sem dependências externas — Python 3 e nada mais.

### Duas ressalvas para este projeto

1. `ui-styling/canvas-fonts/` são 5,8 MB de TTF para renderização em canvas,
   dos 8,4 MB do pacote. Nada no site da Nobre DNA usa isso; a pasta pode ser
   removida sem afetar as outras skills.

2. `design-system/scripts/fetch-background.py` baixa fotos de banco de imagem
   (Pexels) para fundos de slide. O brief da casa proíbe foto de banco no
   site — se essa skill for usada aqui, é para tokens, não para imagem.

### Precedência

Estas skills são referência de terceiros. Onde elas conflitarem com o brief da
Nobre DNA ou com os tokens em `app/globals.css`, o projeto vence.
