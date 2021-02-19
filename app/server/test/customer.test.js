const chai = require("chai");
const chaiHttp = require("chai-http");
const bcrypt = require("bcrypt");
const { app } = require("../server");
const fakeData = require("./data.json");
const { sample } = require("./helpers");
const testRoute = "/api/customer";

// Configures Chai
chai.use(chaiHttp);

// Assertion type of use
const { expect } = chai;

// Able to hold sessions
const user = chai.request.agent(app);

before(async () => {
  // --- log user agent in ---
  await user.post(`${authRoute}/login`).type("form").send(fakeData.user);
});

//closes session created by chai agent
after(() => {
  user.close();
});

//hold the id gotten from the api
let customer_id = "";

describe("POST / | create customer record in square.", () => {
  it("should add a SQUARE CUSTOMER record to the SQUARE API.", async () => {
    const customer = { ...fakeData.shipping };
    delete customer.updated;
    // console.log({ customer });
    const res = await user.post(`${testRoute}/`).type("form").send(customer);

    //capture customer id
    customer_id = res.body.customer.id;

    // --- assertions ---
    expect(res).to.have.status(201);
    expect(res.body).to.have.property("customer");
    expect(res.body.customer).to.have.property("given_name");
    expect(res.body.customer.given_name).to.equal(fakeData.shipping.given_name);
    expect(res.body.customer).to.have.property("family_name");
    expect(res.body.customer.family_name).to.equal(
      fakeData.shipping.family_name
    );
    expect(res.body.customer).to.have.property("email_address");
    expect(res.body.customer.email_address).to.equal(
      fakeData.shipping.email_address
    );
    expect(res.body.customer).to.have.property("phone_number");
    expect(res.body.customer.phone_number).to.equal(
      fakeData.shipping.phone_number
    );
  }).timeout(5000);

  it("should return a 400 code if sent malformed data.", async () => {
    const res = await user
      .post(`${testRoute}/`)
      .type("form")
      .send({ wrong: true });

    // --- assertions ---
    expect(res).to.have.status(400);
    expect(res.body).to.have.property("message");
    expect(res.body.message).to.equal("data malformed.");
  });

  it("should return a 400 code if sent an empty object.", async () => {
    const res = await user.post(`${testRoute}/`).type("form").send({});

    // --- assertions ---
    expect(res).to.have.status(400);
    expect(res.body).to.have.property("message");
    expect(res.body.message).to.equal("data malformed.");
  });
});

describe("PUT / | edit customer record in square.", () => {
  it("should edit a SQUARE CUSTOMER record in the SQUARE API.", async () => {
    const res = await user
      .put(`${testRoute}/${customer_id}`)
      .type("form")
      .send(fakeData.shipping.updated);

    // --- assertions ---
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("customer");
    expect(res.body.customer).to.have.property("id");
    expect(res.body.customer.id).to.equal(customer_id);
    expect(res.body.customer).to.have.property("given_name");
    expect(res.body.customer.given_name).to.equal(
      fakeData.shipping.updated.given_name
    );
    expect(res.body.customer).to.have.property("family_name");
    expect(res.body.customer.family_name).to.equal(
      fakeData.shipping.updated.family_name
    );
    expect(res.body.customer).to.have.property("email_address");
    expect(res.body.customer.email_address).to.equal(
      fakeData.shipping.updated.email_address
    );
    expect(res.body.customer).to.have.property("phone_number");
    expect(res.body.customer.phone_number).to.equal(
      fakeData.shipping.updated.phone_number
    );
  });

  it("should return a 400 code if sent malformed data.", async () => {
    const res = await user
      .put(`${testRoute}/${customer_id}`)
      .type("form")
      .send({ wrong: true });

    // --- assertions ---
    expect(res).to.have.status(400);
    expect(res.body).to.have.property("message");
    expect(res.body.message).to.equal("data malformed.");
  });

  it("should return a 400 code if sent an empty object.", async () => {
    const res = await user
      .put(`${testRoute}/${customer_id}`)
      .type("form")
      .send({});

    // --- assertions ---
    expect(res).to.have.status(400);
    expect(res.body).to.have.property("message");
    expect(res.body.message).to.equal("data malformed.");
  });

  it("should return a 404 code if sent no params.", async () => {
    const res = await user
      .put(`${testRoute}/`)
      .type("form")
      .send(fakeData.shipping.updated);

    // --- assertions ---
    expect(res).to.have.status(404);
  });
});

describe("GET /:id | retrieve customer record in square using square's id.", () => {
  it("should retrieve a SQUARE CUSTOMER record in the SQUARE API.", async () => {
    const res = await user.get(`${testRoute}/${customer_id}`);

    // --- assertions ---
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("customer");
    expect(res.body.customer).to.have.property("id");
    expect(res.body.customer.id).to.equal(customer_id);
    expect(res.body.customer).to.have.property("given_name");
    expect(res.body.customer.given_name).to.equal(
      fakeData.shipping.updated.given_name
    );
    expect(res.body.customer).to.have.property("family_name");
    expect(res.body.customer.family_name).to.equal(
      fakeData.shipping.updated.family_name
    );
    expect(res.body.customer).to.have.property("email_address");
    expect(res.body.customer.email_address).to.equal(
      fakeData.shipping.updated.email_address
    );
    expect(res.body.customer).to.have.property("phone_number");
    expect(res.body.customer.phone_number).to.equal(
      fakeData.shipping.updated.phone_number
    );
  });

  it("should return a 404 code if sent no params.", async () => {
    const res = await user.get(`${testRoute}/`);

    // --- assertions ---
    expect(res).to.have.status(404);
  });
});

describe("DELETE / | delete customer record in square.", () => {
  it("should delete a SQUARE CUSTOMER record in the SQUARE API.", async () => {
    const res = await user.get(`${testRoute}/${customer_id}`);

    // --- assertions ---
    expect(res).to.have.status(200);
    expect(res.body).to.have.property("customer");
    expect(res.body.customer).to.have.property("id");
    expect(res.body.customer.id).to.equal(customer_id);
    expect(res.body.customer).to.have.property("given_name");
    expect(res.body.customer.given_name).to.equal(
      fakeData.shipping.updated.given_name
    );
    expect(res.body.customer).to.have.property("family_name");
    expect(res.body.customer.family_name).to.equal(
      fakeData.shipping.updated.family_name
    );
    expect(res.body.customer).to.have.property("email_address");
    expect(res.body.customer.email_address).to.equal(
      fakeData.shipping.updated.email_address
    );
    expect(res.body.customer).to.have.property("phone_number");
    expect(res.body.customer.phone_number).to.equal(
      fakeData.shipping.updated.phone_number
    );
  });
});

// describe("POST /card| create saved card payment option in square.", () => {});

// describe("DELETE /card | delete saved card payment option in square.", () => {});
