import mongoose from "mongoose";
const companySchema = new mongoose.Schema({
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

export const companies = mongoose.model("companies", companySchema);
