import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('login page has no serious accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''));
  expect(serious).toEqual([]);
});

test('authenticated dashboard has no serious accessibility violations', async ({ page }) => {
  const login = await page.request.post('http://localhost:8000/api/auth/login', {
    data: { email: 'admin@unsia.ac.id', password: 'password' },
  });
  expect(login.ok()).toBeTruthy();
  await page.goto('/superadmin');
  await page.getByText('Dashboard Superadmin').waitFor();
  const results = await new AxeBuilder({ page }).analyze();
  const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''));
  expect(serious).toEqual([]);
});
