const { v4: uuidv4 } = require("uuid");
const axios = require("axios").default;
const { SQUARE_API_CONFIG } = require("../utils/squareConfig");
const User = require("../models/user");

const dataChecker = (obj) => {
  let valid = true;
  // console.log({ obj });

  Object.values(obj).forEach((val) => {
    // console.log("obj.val=", val);

    !val && (valid = false);
  });
  return valid;
};

const createCx = async (req, res) => {
  const {
    address,
    email_address,
    family_name,
    given_name,
    phone_number,
  } = req.body;

  // const reference_id = req.user._id;
  const payload = {
    address,
    family_name,
    given_name,
    phone_number,
    // reference_id,
    idempotency_key: uuidv4(),
  };

  if (email_address) payload.email_address = email_address;

  try {
    if (!dataChecker(payload)) {
      console.log({ message: "data malformed.", received: payload });

      res.status(400).json({ message: "data malformed.", received: payload });
    } else {
      const { data } = await axios.post(
        "/customers",
        payload,
        SQUARE_API_CONFIG
      );

      // //bind square id to user record in mongo
      // await User.findByIdAndUpdate(req.user._id, { square_id: data.customer.id });

      res.status(201).json(data);
      if (process.env.NODE_ENV !== "test") {
        console.log(`CUSTOMER :: Created: ${data.customer.id}`);
      }
    }
  } catch (e) {
    res.status(400).json(e.message);
  }
};

const updateCx = async (req, res) => {
  const {
    address,
    email_address,
    family_name,
    given_name,
    phone_number,
  } = req.body;

  const { id } = req.params;

  const payload = {
    address,
    email_address,
    family_name,
    given_name,
    phone_number,
    // reference_id,
    idempotency_key: uuidv4(),
  };

  if (email_address) payload.email_address = email_address;

  // const reference_id = req.user._id;

  try {
    if (!dataChecker(payload)) {
      res.status(400).json({ message: "data malformed." });
    } else {
      const { data } = await axios.put(
        `/customers/${id}`,
        payload,
        SQUARE_API_CONFIG
      );

      // //bind square id to user record in mongo
      // await User.findByIdAndUpdate(req.user._id, { square_id: data.customer.id });

      res.status(200).json(data);
      if (process.env.NODE_ENV !== "test")
        console.log(`CUSTOMER :: Updated: ${data.customer.id}`);
    }
  } catch (e) {
    res.status(400).json(e.message);
  }
};

const deleteCx = async (req, res) => {
  const { id } = req.params;
  try {
    const { data } = await axios.delete(`/customers/${id}`, SQUARE_API_CONFIG);

    //remove square id from user record in mongo
    // await User.findByIdAndUpdate(req.user._id, { square_id: null });

    res.status(200).json(data);
    if (process.env.NODE_ENV !== "test")
      console.log(`CUSTOMER :: Deleted: ${data.customer.id}`);
  } catch (e) {
    res.status(400).json(e.message);
  }
};

const retrieveCx = async (req, res) => {
  const { id } = req.params;
  try {
    const { data } = await axios.get(`/customers/${id}`, SQUARE_API_CONFIG);
    res.status(200).json(data);
    if (process.env.NODE_ENV !== "test")
      console.log(`CUSTOMER :: Retrieved: ${data.customer.id}`);
  } catch (e) {
    res.status(400).json(e.message);
  }
};

const addCardPayment = async (req, res) => {
  const { card_nonce } = req.body;
  const { square_id: customer_id } = req.user;

  try {
    const { data } = await axios.post(
      `/customers/${customer_id}/cards`,
      { card_nonce },
      SQUARE_API_CONFIG
    );
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json(e.message);
  }
};

const removeCardPayment = async (req, res) => {
  const { card_id } = req.body;
  const { square_id: customer_id } = req.user;

  try {
    const { data } = await axios.delete(
      `/customers/${customer_id}/cards/${card_id}`,
      SQUARE_API_CONFIG
    );
    res.status(200).json(data);
  } catch (e) {
    res.status(400).json(e.message);
  }
};

module.exports = {
  createCx,
  updateCx,
  deleteCx,
  retrieveCx,
  addCardPayment,
  removeCardPayment,
};
