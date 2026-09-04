//part-one get-product
async function getProducts() {
  try {
    const response = await fetch("https://dummyjson.com/products");      // sends GET request, returns a Promise
    if (!response.ok) {                                // response.ok is false for 4xx/5xx status codes
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();                // parsing the body is ALSO async
    return data.products;                               // DummyJSON nests the array under "products"
  } catch (error) {
    console.error("Error message:", error);
    return [];
  }
}
async function main() {
  const products = await getProducts();
  console.log(`Fetched ${products.length} products.`);
  console.log(products[0]);

  console.log("\nProduct information:");
   displayProducts(products);

  const simplifiedProducts = transformProducts(products);
  console.log("\nSimplified product data:");
  console.log(simplifiedProducts);

  const searchResults = searchProducts(products, "phone");
  console.log("\nSearch results for 'phone':");
  console.log(searchResults);

  const singleProduct = findProduct(products, 5);
  console.log("\nProduct with ID 5:");
  console.log(singleProduct);

  const affordable = getAffordableProducts(products, 50);
  console.log("\nProducts priced $50 or less:");
  console.log(affordable);

  const totalValue = calculateTotalValue(products);
  console.log("\nTotal value of all products: $" + totalValue.toFixed(3));

  console.log("\nObject methods  on product 1:");
  demonstrateMethods(products[0]);

  console.log("\nDestructuring demo:");
  demonstrateDestructuring(products);

  console.log("\nSpread operator demo:");
  const original = products[5];
  const updated = updateProductPrice(original, 100.99);
  console.log("Original product price:", original.price);
  console.log("Updated product price:", updated.price);

  console.log("\nStock check (.then/.catch) demo:");
  checkStockWithThen(products[9].id, products);

  console.log("\nStock check (async/await) demo:");
  await checkStockWithAsync(products[10].id, products);

  console.log("\nCreate product demo:");
  await createProduct({
    title: "Wireless Mouse",
    price: 25.99,
    category: "electronics",
  });

  console.log("\nUpdate product demo:");
  await updateProduct(products[1].id, { price: 15.99 });

  console.log("\nDelete product demo:");
  await deleteProduct(products[15].id);


}

main();
 
// part-two display product information
function displayProducts(products) {
  products.forEach((product) => {
    console.log(
      `ID: ${product.id} | ${product.title} | $${product.price} | ${product.category} | Rating: ${product.rating} | Stock: ${product.stock}`
    );
  });
}

//part-three Transform product data
function transformProducts(products) {
  return products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
    };
  });
}

// Part-Four Search Products
function searchProducts(products, keyword) {
  const lowerKeyword = keyword.toLowerCase();

  return products.filter((product) =>
    product.title.toLowerCase().includes(lowerKeyword)
  );
}

// Part-five Find a Specific Product
function findProduct(products, productId) {
  return products.find((product) => product.id === productId);
}

//part-six Filter by Price
function getAffordableProducts(products, maxPrice) {
  return products.filter((product) => product.price <= maxPrice);
}

//part-seven calculate Total value
function calculateTotalValue(products) {
  return products.reduce((total, product) => {
    if (product.quantity !== undefined) {
      return total + product.price * product.quantity;
    } else {
      return total + product.price;
    }
  }, 0);
}

//part-eight object methods
function demonstrateMethods(product) {
  console.log("Object.keys()");
  console.log(Object.keys(product));

  console.log("\nObject.values()");
  console.log(Object.values(product));

  console.log("\nObject.entries()");
  console.log(Object.entries(product));
}

//part-nine Destructuring
function demonstrateDestructuring(products) {
  const { title, price, category } = products[0];
  console.log("Object destructuring on product 1:");
  console.log(`Title: ${title}, Price: $${price}, Category: ${category}`);

  const [firstProduct, secondProduct] = products;
  console.log("\nArray destructuring  first two products:");
  console.log(firstProduct);
  console.log(secondProduct);
}

//part-ten spread operator
function updateProductPrice(product, newPrice) {
  const updatedProduct = { ...product, price: newPrice };
  return updatedProduct;
}

// Part-Eleven Create a Promise
function checkStock(productId, products) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = products.find((p) => p.id === productId);

      if (!product) {
        reject(`Product with ID ${productId} not found.`);
      } else if (product.stock > 0) {
        resolve(`${product.title} is in stock. (${product.stock} available)`);
      } else {
        reject(`${product.title} is out of stock.`);
      }
    }, 5000); 
  });
}

function checkStockWithThen(productId, products) {
  checkStock(productId, products)
    .then((message) => {
      console.log("Stock check success:", message);
    })
    .catch((error) => {
      console.log("Stock check failed:", error);
    });
}

// Part-Twelve Convert to Async/Await
async function checkStockWithAsync(productId, products) {
  try {
    const message = await checkStock(productId, products);
    console.log("Stock check success:", message);
  } catch (error) {
    console.log("Stock check failed:", error);
  }
}

// PartThirteen Create a Product
async function createProduct(productData) {
  try {
    const response = await fetch(`${"https://dummyjson.com/products"}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newProduct = await response.json();
    console.log("Product created successfully:", newProduct);
    return newProduct;
  } catch (error) {
    console.error("Failed to create product:", error.message);
  }
}

// Part-Fourteen Update a Product
async function updateProduct(productId, updatedData) {
  try {
    const response = await fetch(`${"https://dummyjson.com/products"}/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedProduct = await response.json();
    console.log("Product updated successfully:", updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error("Failed to update product:", error.message);
  }
}

// Part-Fifteen Delete a Product
async function deleteProduct(productId) {
  try {
    const response = await fetch(`${"https://dummyjson.com/products"}/${productId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const deletedProduct = await response.json();
    console.log("Product deleted successfully:", deletedProduct);
    return deletedProduct;
  } catch (error) {
    console.error("Failed to delete product:", error.message);
  }
}