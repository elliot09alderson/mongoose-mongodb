import express from "express";
import mongoose from "mongoose";
const app = express();
import { productData } from "./data/productData.js";
import { categoriesData } from "./data/categoriesData.js";
import { products } from "./models/products.js";
import { categories } from "./models/categories.js";
import { slugify } from "./models/categories.js";
import { commentData } from "./data/commentData.js";
import { comments } from "./models/comments.js";
// console.log(productData);
mongoose
  .connect(
    "mongodb+srv://pratikverma9691:admin@cluster0.3xsmmud.mongodb.net/?retryWrites=true&w=majority",
    { dbName: "mongoose" }
  )
  .then(() => console.log("db-connected"));
app.get("/", (req, res) => res.send("working"));
// ----------------------INSERT QUERY  ----------------------------
app.get("/insertAllProduct", async (req, res) => {
  const createdData = await products.insertMany(productData);
  res.send(createdData);
});
app.get("/insertComments", async (req, res) => {
  const createdData = await comments.insertMany(commentData);
  res.send(createdData);
});
app.get("/insertAllCategory", async (req, res) => {
  const documentWithSlug = categoriesData.map((data) => ({
    ...data,
    slug: slugify(data.name),
  }));
  const createdData = await categories.insertMany(documentWithSlug);
  res.send(createdData);
});

// --------------------------Operations --------------------------
app.get("/doquery", async (req, res) => {
  // returns the document which matches the condition
  // const docs = await comments.find({ comments: { $size: 2 } });
  // ----------------------------------------------------------
  // does not show the _id and display only the comments operates with flag 0 and 1
  // const docs = await comments.find(
  //   { comments: { $size: 2 } },
  //   { comments: 1, _id: 0 }
  // );
  // ------------------------------------------------
  //if the condition matches return the document
  // const docs = await comments.find({ "comments.user": "Grace" });
  //
  // const docs = await comments.find({
  //   $and: [{ "comments.user": "Henry" }, { "metadata.likes": { $gt: 50 } }],
  // });
  // -------------------------------------------------
  //delete metadata field
  // const docs = await comments.updateOne(
  //   { _id: 3 },
  //   { $unset: { metadata: 1 } }
  // );
  // -----------------------------------------------------
  // const docs = await comments.find({});
  // ----------------------------------------------------
  // const docs = await products.find({ price: { $gt: 100 } }).count();
  // console.log(docs);
  // --------------------------------------------------
  //logs the details time of execution etc.
  // const docs = await products
  //   .find({ price: { $gt: 100 } })
  //   .explain("executionStats");
  // --------------------------------------
  // indexing
  // const docs = await products
  //   .find({ price: { $gt: 100 } })
  //   .explain("executionStats");
  // Aggregate Similar to find but it is chanining
  // const docs = await products.aggregate([{ $match: { name: "Air Fryer" } }]);
  // ------------------------------------------------------------------
  // using Aggregate find how many times same companies occurs
  // const docs = await products.aggregate([
  //   {
  //     $match: { price: { $gt: 200 } },
  //   },
  //   {
  //     $group: {
  //       _id: "$company",
  //       totalOccurence: { $sum: 1 },
  //     },
  //   },
  // ]);
  // --------------------------------------------
  // matching and making the group based upon companyId then calculating the sum of their prices and average
  // const docs = await products.aggregate([
  //   {
  //     $match: { price: 129 },
  //   },
  // {
  //   $group: {
  //     _id: "$company",
  //     sumOfPrice: { $sum: "$price" },
  //     avg: { $avg: "$price" },
  //   },
  // },
  // ]);
  // -----------------------------------------------
  //mathing and sorting on the basis of name
  // const docs = await products.aggregate([
  //   {
  //     $match: { price: 129 },
  //   },
  //   { $sort: { name: 1 } },
  // ]);
  // -------------------------------------------------
  //projection in
  // const docs = await products.aggregate([
  //   {
  //     $match: { price: 129 },
  //   },
  //   { $sort: { name: 1 } },
  // ]);
  // -------------------------------------------------
  // projection in aggregate we r creating the dicount for product which having the price greater than 400
  // const docs = await products.aggregate([
  //   { $match: { price: { $gt: 400 } } },
  //   {
  //     $project: {
  //       // _id: 0,
  //       price: 1, //because we have to only show the prices
  //       discountedPrice: { $multiply: ["$price", 0.8] },
  //     },
  //   },
  //   { $sort: { price: 1 } },
  // ]);
  //--------------------------------------------------------
  // make an array of colors having the same prices [duplicate allow]
  // const docs = await products.aggregate([
  //   { $match: { price: { $gt: 400 } } },
  //   {
  //     $unwind: "$colors", //unwind means it will create a new document for each single array item
  //   },
  //   {
  //     $group: {
  //       _id: "$price",

  //       allColors: { $push: "$colors" }, //pushes the array,  inside the array [[],[],[]]
  //     },
  //   },
  //   { $sort: { price: 1 } },
  // ]);
  //--------------------------------------------------------
  // make an array of colors having the same prices [no duplicates colors!!!]
  // Note we cannot use $size under group
  // const docs = await products.aggregate([
  //   { $match: { price: { $gt: 400 } } }, // filter the data
  //   {
  //     $unwind: "$colors", //unwind means it will create a new document for each single array item
  //   },
  //   {
  //     $group: {
  //       _id: "$price", //makes the froup using price

  //       allColors: { $addToSet: "$colors" }, //pushes the items into a set [be unique]
  //     },
  //   },
  //   { $sort: { price: 1 } },

  //   {
  //     $project: {
  //       _id: 0, //hides the id using projection
  //       allColors: 1,
  //       size: { $size: "$allColors" }, //shows the size
  //     },
  //   },
  // ]);
  // filters the array and return documnet on the basis of condition | shows only limited field
  // Note we cannot use $size under group
  const docs = await products.aggregate([
    {
      $project: {
        name: 1,
        filteredData: {
          $filter: {
            input: "$colors",
            as: "color", //callback value of filter
            cond: { $eq: ["$$color", "#333333"] }, //accessable  through double $$
          },
        },
      },
    },
    {
      $match: {
        filteredData: { $ne: [] }, // Exclude documents with empty filteredData array
      },
    },
  ]);
  res.send(docs);
});
app.listen(5000, () => console.log("app is running"));
