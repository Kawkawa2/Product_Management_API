const express = require("express");
var app = express();
var router = express.Router();
var dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

let PORT = process.env.PORT;
let URI = process.env.URI;

app.use("/products", router);

app.listen(PORT, URI, () => {
  console.log(`Server is running on port ${PORT} at ${URI}`);
});
