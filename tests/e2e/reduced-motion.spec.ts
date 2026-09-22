import {test,expect} from '@playwright/test';

test('reduced motion disables the animated canvas and keeps every section visible',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/es/');
  await expect(page.locator('[data-space-animation]')).toHaveAttribute('data-running','false');
  for(const selector of ['h1','.metric-strip > div','.audience-grid > a','.project-card']){
    const element=page.locator(selector).first();
    await expect(element).toHaveCSS('opacity','1');
    await expect(element).not.toHaveClass(/reveal/);
  }
  await expect(page.locator('.scroll-cue')).toBeHidden();
});

test('normal motion runs the canvas and reveals content on scroll',async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.goto('/es/');
  await expect(page.locator('[data-space-animation]')).toHaveAttribute('data-running','true');
  const card=page.locator('.project-card').first();
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveClass(/is-visible/);
  await expect(card).toHaveCSS('opacity','1');
});

test.describe('without JavaScript',()=>{
  test.use({javaScriptEnabled:false});
  test('content stays visible and static',async({page})=>{
    await page.goto('/es/');
    await expect(page.locator('html')).not.toHaveClass(/js-motion/);
    for(const selector of ['h1','.metric-strip strong','.audience-grid > a','.project-card']) await expect(page.locator(selector).first()).toHaveCSS('opacity','1');
  });
});
