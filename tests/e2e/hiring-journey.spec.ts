import { test, expect } from '@playwright/test';

test('English hiring visitor reaches the matching CV, public evidence and contact actions', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.getByRole('link', { name: /^51K\+/ })).toHaveAttribute('href', '/en/projects/smartsense/');
  await page.getByRole('link', { name: /hire david/i }).click();
  await expect(page).toHaveURL(/\/en\/profile\//);
  await expect(page.getByRole('link', { name: /download cv/i })).toHaveAttribute('href', '/cv/david-puentes-cv-en.pdf');
  await expect(page.getByRole('link', { name: /email me/i })).toHaveAttribute('href', /^mailto:/);
  await expect(page.getByText(/human validation/i).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: /how i work/i })).toBeVisible();
  await expect(page.getByText(/confidentiality obligations/i).first()).toBeVisible();
  await expect(page.getByText(/patent granted/i).first()).toBeVisible();

  await page.goto('/en/projects/sensor-dashboard/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/sensor dashboard/i);
  await expect(page.getByRole('heading', { name: /^decisions$/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /view repository/i })).toHaveCount(1);
});
