// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));

// Find the product
// const product = products.find(p => p.id === productId);

// Target the container
const container = document.getElementById("product-detail");


// Fetch product data from backend
fetch(`http://localhost:3000/products`)
  .then(response => response.json())
  .then(products => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      container.innerHTML = "<p>Product not found.</p>";
    } else {
      container.innerHTML = `
        <section class="row">
          <div class="col-md-6">
            <img src="${product.img}" alt="${product.alt}" class="img-fluid mb-3" />
            <!-- Placeholder for additional images -->
            <div class="row">
              <div class="col-4"><img src="${product.img}" alt="${product.alt}" class="img-thumbnail" /></div>
              <div class="col-4"><img src="${product.img}" alt="${product.alt}" class="img-thumbnail" /></div>
              <div class="col-4"><img src="${product.img}" alt="${product.alt}" class="img-thumbnail" /></div>
            </div>
          </div>
          <div class="col-md-6">
            <h1>${product.name}</h1>
            <p class="lead">${product.longDescription}</p>
            <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
            <a href="products.html" class="btn btn-secondary mt-3">Back to Products</a>
          </div>
        </section>
      `;
    }
  })
  .catch(error => {
    console.error("Error fetching product:", error);
    container.innerHTML = "<p>Failed to load product details.</p>";
  });


// if (document.getElementById("product-detail")) {
//   productDetail();
// }

