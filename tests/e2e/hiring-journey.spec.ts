import { test, expect } from '@playwright/test';

test('English hiring visitor reaches the matching CV, the delivery process and a private case', async ({ page }) => {
  await page.goto('/en/');
  await expect(page.getByRole('link', { name: /^987/ })).toHaveAttribute('href', '/en/projects/securapp/');
  await page.getByRole('link', { name: /hire david/i }).click();
  await expect(page).toHaveURL(/\/en\/profile\//);
  await expect(page.getByRole('link', { name: /download cv/i })).toHaveAttribute('href', '/cv/david-puentes-cv-en.pdf');
  await expect(page.getByRole('link', { name: /email me/i })).toHaveAttribute('href', /^mailto:/);
  await expect(page.getByText(/human validation/i).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: /how i ship to production/i })).toBeVisible();
  await expect(page.getByText(/next step, not implemented yet/i).first()).toBeVisible();
  await expect(page.getByText(/patent granted/i).first()).toBeVisible();

  await page.goto('/en/projects/ptw-digital-signatures/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/work permits/i);
  await expect(page.getByText(/summary without private data/i).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: /^decisions$/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /view repository/i })).toHaveCount(0);
});
