import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  company: { type: mongoose.Schema.Types.ObjectId, ref: "companies" },
  price: Number,
  colors: [{ type: String }],
  image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
  isFeatured: Boolean,
  CreatedAt: { type: Date, default: Date.now() },
});
productSchema.index({ name: 1 }, { name: "productName_index" });

export const products = mongoose.model("products", productSchema);
