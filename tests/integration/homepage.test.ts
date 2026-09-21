import { readFileSync } from 'node:fs'; import { expect,it } from 'vitest';
it('declares evidence and both audience destinations',()=>{const source=readFileSync('src/pages/[lang]/index.astro','utf8');expect(source).toContain('MetricStrip');expect(source).toContain('AudienceGateway');expect(source).toContain('SpaceHero');});
