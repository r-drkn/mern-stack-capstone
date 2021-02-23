const express = require("express");
let router = express.Router();
const auth = require("../../middleware/auth");
const {
  addItem,
  addItems,
  getMongoCatalog,
  getSquareCatalog,
  getDiscogsCatalog,
  listItems,
  listItem,
  deleteItem,
  deleteItems,
  getStockCount,
  setStockCount,
} = require("../../controller/shop");

router.route("/add").post(auth.admin, addItem);

router.route("/add-multi").post(auth.admin, addItems);

router.route("/list").get(getMongoCatalog);

router.route("/list-subset").get(listItems);

router.route("/list-one").get(listItem);

router.route("/list-square").get(getSquareCatalog);

router.route("/list-discogs").get(getDiscogsCatalog);

router.route("/delete").delete(auth.admin, deleteItem);

router.route("/delete-multi").delete(auth.admin, deleteItems);

router.route("/item-count").get(auth.admin, getStockCount);

router.route("/item-stock-in").post(auth.admin, setStockCount);

module.exports = router;
