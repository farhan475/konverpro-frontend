import { expect, test, type Page } from '@playwright/test';

const accounts = [
  {
    role: 'superadmin',
    email: 'admin@unsia.ac.id',
    routes: [
      '/superadmin',
      '/superadmin/users',
      '/superadmin/prodi',
      '/superadmin/kamus-sinonim',
      '/superadmin/equivalencies',
      '/superadmin/config',
      '/superadmin/audit',
      '/superadmin/laporan',
    ],
  },
  {
    role: 'admin',
    email: 'admin-konversi@unsia.ac.id',
    routes: ['/admin', '/admin/pendaftar', '/admin/pendaftar/upload'],
  },
  {
    role: 'akademik',
    email: 'akademik@unsia.ac.id',
    routes: ['/akademik', '/akademik/antrean', '/akademik/kurikulum', '/akademik/kamus-sinonim', '/akademik/appeals'],
  },
  {
    role: 'kaprodi',
    email: 'syahidabdullah@lecturer.unsia.ac.id',
    routes: ['/kaprodi', '/kaprodi/validasi', '/kaprodi/laporan'],
  },
] as const;

const kaprodiAccounts = [
  ['syahidabdullah@lecturer.unsia.ac.id', 'PJJ Informatika'],
  ['vikamuliati@lecturer.unsia.ac.id', 'PJJ Sistem Informasi'],
  ['wahyupurbo@lecturer.unsia.ac.id', 'PJJ Manajemen'],
  ['nurhayatisiregar@lecturer.unsia.ac.id', 'PJJ Akuntansi'],
  ['rosanah@lecturer.unsia.ac.id', 'PJJ Komunikasi'],
  ['ahmadchusyairi@lecturer.unsia.ac.id', 'PJJ Teknologi Informasi'],
] as const;

async function login(page: Page, role: string, email: string) {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill('password');
  const loginResponsePromise = page.waitForResponse(
    (response) =>
      response.url().endsWith('/api/auth/login') &&
      response.request().method() === 'POST',
  );
  await page.locator('button[type="submit"]').click();
  const loginResponse = await loginResponsePromise;
  expect(loginResponse.status()).toBe(200);
  await expect(page).toHaveURL(new RegExp(`/${role}$`));
}

for (const account of accounts) {
  test(`${account.role} can login and open primary pages`, async ({ page }) => {
    await login(page, account.role, account.email);

    for (const route of account.routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL(new RegExp(`${route.replace('/', '\\/')}$`));
      await expect(page.locator('body')).not.toContainText('Application error');
    }
  });
}

test('all official kaprodi accounts open the dashboard for their own program', async ({ page }) => {
  for (const [email, prodi] of kaprodiAccounts) {
    await page.context().clearCookies();
    const loginResponse = await page.request.post('http://localhost:8000/api/auth/login', {
      data: { email, password: 'password' },
    });
    expect(loginResponse.status()).toBe(200);
    await page.goto('/kaprodi');
    await expect(page.getByText(`Dashboard Kaprodi - ${prodi}`)).toBeVisible();
    await expect(page.getByText(prodi).last()).toBeVisible();
  }
});

test('logout clears the authenticated cookie', async ({ page }) => {
  await login(page, 'admin', 'admin-konversi@unsia.ac.id');
  await page.locator('button[title="Keluar"]').click();

  await expect(page).toHaveURL('/');
  await expect(page.locator('input[type="email"]')).toBeVisible();

  const response = await page.request.get('http://localhost:8000/api/auth/me');
  expect(response.status()).toBe(401);
});

test('role filters and synonym editing controls are interactive', async ({ page }) => {
  await login(page, 'superadmin', 'admin@unsia.ac.id');
  await page.goto('/superadmin/users');
  await page.getByRole('combobox', { name: 'Filter role pengguna' }).selectOption('admin');
  await expect(page.getByRole('combobox', { name: 'Filter role pengguna' })).toHaveValue('admin');

  await page.goto('/superadmin/kamus-sinonim');
  const editButton = page.getByTitle('Edit sinonim').first();
  if (await editButton.count()) {
    await editButton.click();
    await expect(page.getByText('Edit Pasangan Sinonim')).toBeVisible();
    await page.getByRole('button', { name: 'Batal' }).click();
  }

  await page.context().clearCookies();
  await login(page, 'akademik', 'akademik@unsia.ac.id');
  await page.goto('/akademik/antrean');
  await page.getByRole('combobox', { name: 'Filter status antrean' }).selectOption('Baru');
  await expect(page.getByRole('combobox', { name: 'Filter status antrean' })).toHaveValue('Baru');

  await page.context().clearCookies();
  await login(page, 'kaprodi', 'syahidabdullah@lecturer.unsia.ac.id');
  await page.goto('/kaprodi/validasi');
  await page.getByRole('combobox', { name: 'Filter status validasi' }).selectOption('Pending Kaprodi');
  await expect(page.getByRole('combobox', { name: 'Filter status validasi' })).toHaveValue('Pending Kaprodi');
});

test('protected Excel and CSV downloads complete', async ({ page }) => {
  await login(page, 'admin', 'admin-konversi@unsia.ac.id');
  await page.goto('/admin');
  const templateDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Unduh Template Excel' }).click();
  await expect((await templateDownload).suggestedFilename()).toBe('Template_Konversi_UNSIA.xlsx');

  await page.context().clearCookies();
  await login(page, 'superadmin', 'admin@unsia.ac.id');
  await page.goto('/superadmin/laporan');
  const reportDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  await expect((await reportDownload).suggestedFilename()).toBe('laporan_global_konverpro.csv');
});

test('notification center shows unread items and marks them as read', async ({ page }) => {
  await login(page, 'superadmin', 'admin@unsia.ac.id');

  const configResponse = await page.request.get('http://localhost:8000/api/superadmin/config');
  expect(configResponse.status()).toBe(200);
  const config = await configResponse.json();
  const updateResponse = await page.request.put('http://localhost:8000/api/superadmin/config', {
    data: {
      settings: {
        fuzzy_threshold_auto: config.data.fuzzy_threshold_auto,
        fuzzy_threshold_sumopod: config.data.fuzzy_threshold_sumopod,
      },
    },
  });
  expect(updateResponse.status()).toBe(200);

  await page.reload();
  await page.getByRole('button', { name: 'Buka notifikasi' }).click();
  await expect(page.getByText('Konfigurasi diperbarui').first()).toBeVisible();
  await page.getByRole('button', { name: 'Tandai semua dibaca' }).click();
  await expect(page.getByText('0 belum dibaca')).toBeVisible();
});
