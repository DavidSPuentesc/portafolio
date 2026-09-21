import {readFileSync} from 'node:fs';import {expect,it} from 'vitest';
it('keeps secrets server-side and exposes a no-store JSON endpoint',()=>{const source=readFileSync('api/contact.ts','utf8');expect(source).toContain('CONTACT_WEBHOOK_URL');expect(source).toContain('no-store');expect(source).toContain('validateContact');expect(source).not.toContain('console.log');});
