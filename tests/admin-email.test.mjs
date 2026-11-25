import { test } from "node:test";
import assert from "node:assert/strict";
import { isAllowedAdminEmail } from "../lib/admin-email.ts";

test("both the original and additional authorized addresses can request authentication",()=>{
  const env={NOBREDNA_ADMIN_EMAIL:"original@example.invalid",NOBREDNA_ADMIN_EMAILS:" additional@example.invalid, third@example.invalid "};
  assert.equal(isAllowedAdminEmail("original@example.invalid",env),true);
  assert.equal(isAllowedAdminEmail(" ADDITIONAL@EXAMPLE.INVALID ",env),true);
  assert.equal(isAllowedAdminEmail("third@example.invalid",env),true);
  assert.equal(isAllowedAdminEmail("other@example.invalid",env),false);
  assert.equal(isAllowedAdminEmail("",env),false);
  assert.equal(isAllowedAdminEmail("original@example.invalid",{}),false);
});
