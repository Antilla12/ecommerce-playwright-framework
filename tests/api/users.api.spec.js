const { test, expect } = require('@playwright/test');
const { apiBaseUrl } = require('../../config/env');
const { generateUser } = require('../../utils/testDataGenerator');

test.describe('User Account API — full CRUD @api', () => {
  let user;

  test.beforeEach(() => {
    user = generateUser();
  });

  test('CREATE — user account is created successfully', async ({ request }) => {
    const res = await request.post(`${apiBaseUrl}/createAccount`, {
      form: {
        name: user.name,
        email: user.email,
        password: user.password,
        title: 'Mr',
        birth_date: user.day,
        birth_month: user.month,
        birth_year: user.year,
        firstname: user.firstName,
        lastname: user.lastName,
        address1: '123 Test St',
        country: user.country,
        zipcode: '10001',
        state: 'NY',
        city: 'New York',
        mobile_number: '5555555555',
      },
    });
    const body = await res.json();
    expect(body.responseCode).toBe(201);
    expect(body.message).toBe('User created!');
  });

  test('READ (verify) — GET account detail confirms created user exists', async ({ request }) => {
    await request.post(`${apiBaseUrl}/createAccount`, {
      form: {
        name: user.name,
        email: user.email,
        password: user.password,
        title: 'Mr',
        birth_date: user.day,
        birth_month: user.month,
        birth_year: user.year,
        firstname: user.firstName,
        lastname: user.lastName,
        address1: '123 Test St',
        country: user.country,
        zipcode: '10001',
        state: 'NY',
        city: 'New York',
        mobile_number: '5555555555',
      },
    });

    const verifyRes = await request.post(`${apiBaseUrl}/verifyLogin`, {
      form: { email: user.email, password: user.password },
    });
    const verifyBody = await verifyRes.json();
    expect(verifyBody.responseCode).toBe(200);
    expect(verifyBody.message).toBe('User exists!');
  });

  test('DELETE — account can be deleted after creation', async ({ request }) => {
    await request.post(`${apiBaseUrl}/createAccount`, {
      form: {
        name: user.name,
        email: user.email,
        password: user.password,
        title: 'Mr',
        birth_date: user.day,
        birth_month: user.month,
        birth_year: user.year,
        firstname: user.firstName,
        lastname: user.lastName,
        address1: '123 Test St',
        country: user.country,
        zipcode: '10001',
        state: 'NY',
        city: 'New York',
        mobile_number: '5555555555',
      },
    });

    const deleteRes = await request.delete(`${apiBaseUrl}/deleteAccount`, {
      form: { email: user.email, password: user.password },
    });
    const deleteBody = await deleteRes.json();
    expect(deleteBody.responseCode).toBe(200);
    expect(deleteBody.message).toBe('Account deleted!');
  });

  test('negative — verifyLogin with wrong password fails', async ({ request }) => {
    await request.post(`${apiBaseUrl}/createAccount`, {
      form: {
        name: user.name,
        email: user.email,
        password: user.password,
        title: 'Mr',
        birth_date: user.day,
        birth_month: user.month,
        birth_year: user.year,
        firstname: user.firstName,
        lastname: user.lastName,
        address1: '123 Test St',
        country: user.country,
        zipcode: '10001',
        state: 'NY',
        city: 'New York',
        mobile_number: '5555555555',
      },
    });

    const res = await request.post(`${apiBaseUrl}/verifyLogin`, {
      form: { email: user.email, password: 'wrongpassword' },
    });
    const body = await res.json();
    expect(body.responseCode).toBe(404);
  });
});
