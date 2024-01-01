import mongoose from "mongoose";
const categorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  slug: String,
  CreatedAt: { type: Date, default: Date.now() },
});

categorySchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.name);
  }
  next();
});
// Function to create a slug from a given string
export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export const categories = mongoose.model("categories", categorySchema);

// slugify("ansns & Asjs");
