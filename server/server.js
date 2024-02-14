const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const products = require('./db');
const { v4: uuidv4 } = require('uuid');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

http.createServer(app).listen(3001, () => {
  console.log('Listen on 0.0.0.0:3001');
});

app.post('/products', (req, res) => {
  const { name, category, price } = req.body;
  createProduct(name, category, price);
  res.send({ status: 200 });
});

const PAGE_SIZE = 2;
app.get('/products', (req, res) => {
  const { category, maxPrice, minPrice, page = 1 } = req.query;

  let queriedProducts = queryProducts(category, maxPrice, minPrice);
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const pageProducts = queriedProducts.slice(start, end);
  res.send(pageProducts);
});

const N = 2;
app.get('/products/:id/related', (req, res) => {
  const { id } = req.params;
  const relatedProducts = findNRelatedProducts(id, N);
  res.send(relatedProducts);
});

process.on('SIGINT', function () {
  process.exit();
});

// Helper functions

function createProduct(name, category, price) {
  const id = uuidv4();
  products.push({ id, name, category, price });
}

function queryProducts(category, maxPrice, minPrice) {
  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category
    );
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price <= maxPrice
    );
  }
  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      (product) => product.price >= minPrice
    );
  }

  return filteredProducts;
}

function findNRelatedProducts(id, n) {
  const { category, price } = products.find((product) => product.id === id);

  const relatedProducts = products
    .filter((product) => product.category === category) // Filter by category
    .filter((product) => product.id !== id) // Exclude the product itself
    .sort((a, b) => Math.abs(a.price - price) - Math.abs(b.price - price)) // Sort by the difference in price
    .slice(0, n); // Take the first n products

  return relatedProducts;
}
