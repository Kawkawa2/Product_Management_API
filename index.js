const express = require("express");
var app = express();
var router = express.Router();
var products = require("./products.json");
var dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

let PORT = process.env.PORT;
let URI = process.env.URI;
// using the express.json  and urlencoded to get request of these data types
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products", router);

//Crud operations

// 1-display products
router.get("/", (req, res) => {
  res.status(200).json(products);
});

// 2-Show a specific product using id
router.get("/:id([0-9]{1,2})", (req, res) => {
  let id = req.params.id;
  let findProduct = products.products.find((item) => {
    return item.id == id;
  });
  if (!findProduct) {
    res.status(404).json({ error: "product not found!" });
  } else {
    res.status(200).json(findProduct);
  }
});

// 3-searching for a product using query string parameters
router.get("/Search", (req, res) => {
  let { keyword, minPrice, maxPrice } = req.query;

  if (!keyword || !minPrice || !maxPrice) {
    res.status(400).json({
      error: "Bad request, missing parameters keyword, min et max price!",
    });
  } else {
    let filterProducts = products.products.filter((items) => {
      return (
        items.title.includes(keyword) &&
        (items.price >= parseInt(minPrice) || items.price <= parseInt(maxPrice))
      );
    });
    if (filterProducts.length < 0) {
      res.status(404).json({ error: "product not found!" });
    } else {
      res.status(200).json(filterProducts);
    }
  }
});

router.post("/", (req, res) => {
  const {
    title,
    description,
    price,
    discountPercentage,
    rating,
    stock,
    brand,
    category,
    thumbnail,
    images,
  } = req.body;
  if (
    !title ||
    !description ||
    !price ||
    !stock ||
    !brand ||
    !category ||
    !thumbnail
  ) {
    res.status(400).json({ error: "Bad Request!" });
  }
  let newProduct = {
    id: products.products.length + 1,
    title: title,
    description: description,
    discountPercentage: discountPercentage ? discountPercentage : 0,
    rating: rating ? rating : 0,
    stock: stock,
    brand: brand,
    category: category,
    thumbnail: thumbnail,
    images: images ? images : [],
  };
  products.products.push(newProduct);
  res.status(201).json(products.products);
});

router.put("/:id([0-9]{1,2})", (req, res) => {
  const {
    title,
    description,
    price,
    discountPercentage,
    rating,
    stock,
    brand,
    category,
    thumbnail,
    images,
  } = req.body;
  let id = req.params.id;
  let findProduct = products.products.find((item) => {
    return item.id == id;
  });
  if (!findProduct) {
    res.status(404).json({ error: "product not found!" });
  } else {
    findProduct.title = title ? title : findProduct.title;
    findProduct.description = description
      ? description
      : findProduct.description;
    findProduct.price = price ? price : findProduct.price;
    findProduct.discountPercentage = discountPercentage
      ? discountPercentage
      : findProduct.discountPercentage;
    findProduct.rating = rating ? rating : findProduct.rating;
    findProduct.stock = stock ? stock : findProduct.stock;
    findProduct.brand = brand ? brand : findProduct.brand;
    findProduct.category = category ? category : findProduct.category;
    findProduct.thumbnail = thumbnail ? thumbnail : findProduct.thumbnail;
    findProduct.images = images ? images : findProduct.images;
    res.status(200).json(findProduct);
  }
});

router.delete("/:id([0-9]{1,2})", (req, res) => {
  const id = req.params.id;
  let productIndex = products.products.findIndex(
    (item) => item.id == parseInt(id)
  );
  try {
    products.products.splice(productIndex, 1);
    res.status(200).send(products.products);
  } catch (err) {
    return res.status(404).json({ error: `product not found!: ${err}` });
  }
});

app.listen(PORT, URI, () => {
  console.log(`Server is running on port ${PORT} at ${URI}`);
});
