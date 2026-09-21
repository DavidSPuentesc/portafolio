import {test,expect} from '@playwright/test';
test('reduced motion disables the animated canvas',async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/es/');await expect(page.locator('[data-space-animation]')).toHaveAttribute('data-running','false');});
