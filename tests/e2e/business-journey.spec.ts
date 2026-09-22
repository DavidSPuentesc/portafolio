import { test, expect } from '@playwright/test';

test('Spanish business visitor reaches proof, sectors, the SmartSense evidence and contact', async ({ page }) => {
  await page.goto('/es/');
  await page.getByRole('link', { name: /construir una solución/i }).click();
  await expect(page).toHaveURL(/\/es\/solutions\//);
  await expect(page.getByRole('heading', { name: /monitoreo iot industrial/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /ya construido/i }).first()).toBeVisible();
  await expect(page.getByText('Manufactura de alimentos', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: /enviar mensaje/i })).toBeVisible();

  await page.getByRole('link', { name: /ver el caso de referencia/i }).first().click();
  await expect(page).toHaveURL(/\/es\/projects\/smartsense\//);
  await expect(page.getByText(/51\.338 muestras/).first()).toBeVisible();
  await expect(page.getByText(/cota inferior/i).first()).toBeVisible();
  const figure = page.getByRole('img', { name: /réplica neutra del dashboard/i });
  await figure.scrollIntoViewIfNeeded();
  await expect(figure).toBeVisible();
  await expect(page.getByRole('link', { name: /ver repositorio del equipo/i })).toHaveAttribute('href', 'https://github.com/jesusabojacal-commits/SmartSense-Monitoring');
});
