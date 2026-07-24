const { faker } = require('@faker-js/faker');

/**
 * Generates a unique user per call — critical for test isolation
 * when running in parallel workers against a shared environment.
 */
function generateUser() {
  return {
    name: faker.person.fullName(),
    email: `qa.${Date.now()}.${faker.string.alphanumeric(6)}@example.com`,
    password: faker.internet.password({ length: 10 }),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    day: String(faker.number.int({ min: 1, max: 28 })),
    month: String(faker.number.int({ min: 1, max: 12 })),
    year: String(faker.number.int({ min: 1980, max: 2005 })),
    address1: faker.location.streetAddress(),
    country: 'United States',
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode(),
    mobileNumber: faker.string.numeric(10),
  };
}

module.exports = { generateUser };
