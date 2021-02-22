const mongoose = require("mongoose");

const vinylSchema = new mongoose.Schema(
  {
    discogs_id: { type: Number, required: true },
    square_id: { type: String, required: true },
    release_title: { type: String, required: true },
    artists_sort: { type: String, required: true },
    artists: { type: Array, required: true },
    tracklist: { type: Array, required: true },
    genres: { type: Array, required: true },
    styles: { type: Array, required: true },
    image: { type: String, required: true },
    preloved: { type: Boolean, required: true, default: false },
    variations: {
      stock: {
        variation_id: { type: String, required: true },
        price: { type: Number, required: true },
      },
    },
    catalog_number: { type: String, required: false },
    format: { type: String, required: false },
    labels: { type: Array, required: false },
    release_date: { type: String, required: false },
    year: { type: String, required: false },
    description: { type: String, required: false },
    review: { type: String, required: false },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("Vinyl", vinylSchema);
