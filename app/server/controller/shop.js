const square = require("../utils/shopController/squareUtils");
const Discogs = require("../utils/shopController/discogsUtils");
const Vinyl = require("../models/vinyl");
const cloudinaryConfig = require("../utils/cloudinaryConfig");

//HELPER FUNCTIONS
const parsePrice = (price) => {
  if (typeof price === "number") return price;
  const parsedPrice = parseInt(price.replace(".", ""));
  return isNaN(parsedPrice) ? "NaN" : parsedPrice;
};

//EXPORTS

const addItem = async (req, res) => {
  const {
    release_id, // from Discogs
    price, // manual entry
    description, // manual entry, long form review
    review, // manual entry, summary review
    preloved = false,
  } = req.body;
  let response, data, item, newVinyl;

  try {
    response = await Discogs.getReleaseInfo(release_id);
    //check for error response from discogs
    if (response.message) {
      throw response;
    } else {
      data = response;
    }

    const {
      id,
      year,
      artists,
      artists_sort,
      release_title,
      released: release_date,
      genres,
      styles,
      tracklist,
      images,
      labels,
    } = data;

    //parsePrice fixes decimal currency string in AU dollar to be in cents
    // assuming the string has two trailing digits. will be incorrect if
    // given a number like 30.7 (converts to 307 instead of 3070)
    const fixedPrice = parsePrice(price);

    response = await square.addItem(
      release_title,
      artists[0].name,
      genres,
      styles,
      fixedPrice,
      year
    );

    if (response.errors) {
      throw response.errors[0];
    } else {
      item = response;
    }

    newVinyl = await Vinyl.create({
      discogs_id: id,
      square_id: item.catalog_object.id,
      release_title,
      artists_sort,
      artists: artists.map((a) => a.name),
      tracklist,
      genres,
      styles,
      image: images[0].uri,
      variations: {
        stock: {
          variation_id: item.catalog_object.item_data.variations[0].id,
          price,
        },
      },
      release_date,
      year,
      description,
      review,
      preloved,
      labels,
    });
    res.status(201).json(newVinyl);
  } catch (e) {
    // console.log({ e });
    res.status(400).json(e);
  }
};

const addItems = async (req, res) => {
  const { upload_items: batchArray } = req.body;
  try {
    const processedByDiscogs = await Discogs.batchGetInfo(batchArray);
    //TODO: make sure labels field is coming through
    const uploadedItems = await square.addItems(processedByDiscogs);

    // bind square_id to items processed by discogs and make data fit model
    const completedBatch = [...processedByDiscogs];
    completedBatch.map((item, i) => {
      item.square_id = uploadedItems.objects[i].id;
      item.discogs_id = item.id;
      item.image = item.images[0].uri;
      item.variations = {
        stock: {
          variation_id: uploadedItems.objects[i].item_data.variations[0].id,
          price: item.price,
        },
      };
    });

    const newVinyls = await Vinyl.insertMany(completedBatch);

    res.status(201).json(newVinyls);
  } catch (e) {
    res.status(400).json(e.message);
  }
};



const editItem = async (req, res, next) => {
  const { _id, description, review, discogs_id,  } = req.body;
  const blogObj = { title, byline, body };

  try {
    if (imageStr) {
      const imgResp = await cloudinary.uploader.upload(imageStr, {
        upload_preset: "dogolat",
      });
      blogObj.image_url = imgResp.secure_url;
    }

    const updatedBlog = await Blog.findOneAndUpdate({ _id }, { $set: blogObj });
    res.status(200).json(updatedBlog);
  } catch (e) {
    res.status(400).json(e.message);
  }
};

const getMongoCatalog = async (req, res) => {
  try {
    const catalogList = await Vinyl.find();
    const ids = [];
    catalogList.forEach((item) =>
      ids.push({
        _id: item._id,
        square_id: item.square_id,
        discogs_id: item.discogs_id,
      })
    );

    res.status(200).json({ ids: ids, detailed: catalogList });
  } catch (e) {
    res.status(400).json(e.message);
  }
};

const listItem = async (req, res) => {
  const { square_id } = req.body;
  try {
    const item = await Vinyl.findOne({ square_id });
    res.status(200).json(item);
  } catch (e) {
    res.status(400).json(e.message);
  }
};

const listItems = async (req, res) => {
  const { square_ids } = req.body;
  try {
    const items = await Vinyl.find({ square_id: { $in: square_ids } });
    const ids = [];
    items.forEach((item) =>
      ids.push({
        _id: item._id,
        square_id: item.square_id,
        discogs_id: item.discogs_id,
      })
    );
    res.status(200).json({ ids: ids, detailed: items });
  } catch (e) {
    res.status(400).json(e.message);
  }
};

const deleteItem = async (req, res) => {
  console.log(req);
  try {
    const deleted = await square.deleteItem(req.body.item);
    const deletedVinyl = await Vinyl.findOneAndDelete({
      square_id: req.body.item,
    });
    res.status(200).json({ deleted, deletedVinyl });
  } catch (e) {
    console.log("Something");
    res.status(400).json(e.message);
  }
};

const deleteItems = async (req, res) => {
  try {
    const deleted = await square.deleteItems(req.body.items);
    const deletedVinyls = await Vinyl.deleteMany({
      square_id: {
        $in: req.body.items,
      },
    });
    res.status(200).json({ deleted, deletedVinyls });
  } catch (e) {
    res.status(400).json(e.message);
  }
};

const getStockCount = async (req, res) => {
  const { square_id } = req.body;
  try {
    const item = await Vinyl.findOne({ square_id });
    const stock = await square.getStockCount(
      item.variations.stock.variation_id
    );
    res.status(200).json({ stock });
  } catch (e) {
    res.status(400).json(e.message);
  }
};

const setStockCount = async (req, res) => {
  const { counts } = req.body;
  const ids = [...counts].map((item) => item.square_id);

  try {
    const items = await Vinyl.find({ square_id: { $in: ids } });
    counts.map((item, i) => {
      item.variation_id = items[i].variations.stock.variation_id;
    });
    console.log({ counts });

    const stock = await square.setStockCount(counts);
    res.status(200).json({ stock });
  } catch (e) {
    res.status(400).json(e.message);
  }
};

//DEPRECATED
// const getSquareCatalog = async (req, res) => {
//   const type = "item";
//   try {
//     const catalogList = await square.getCatalog(type);

//     res.status(200).json(catalogList);
//   } catch (e) {
//     res.status(400).json(e.message);
//   }
// };

module.exports = {
  addItem,
  addItems,
  getMongoCatalog,
  listItem,
  listItems,
  deleteItem,
  deleteItems,
  getStockCount,
  setStockCount,
};
