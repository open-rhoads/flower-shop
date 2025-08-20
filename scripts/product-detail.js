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
        <section class="row mt-3">
          <div class="prod-images col-md-6">
            <img src="${product.img}" alt="${product.alt}" class="img-fluid mb-3" />
            <!-- Placeholder for additional images -->
            <div class="row">
              <div class="col-4"><img src="${product.img}" alt="${product.alt}" class="img-thumbnail" /></div>
              <div class="col-4"><img src="${product.img}" alt="${product.alt}" class="img-thumbnail" /></div>
              <div class="col-4"><img src="${product.img}" alt="${product.alt}" class="img-thumbnail" /></div>
            </div>
          </div>
          <div class="col-md-6" id="prod-details">
            <h1>${product.name}</h1>
            <p class="lead">${product.longDescription}</p>
            <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
            <a href="products.html" class="btn btn-secondary mt-3">Back to Products</a>
          </div>
        </section>
      `;
      
      const addToCartBtn = document.createElement("button");
      addToCartBtn.textContent = "Add to Cart";
      addToCartBtn.className = "btn btn-primary mt-3";

      addToCartBtn.addEventListener("click", () => {
        // This sends a POST request to your backend’s /cart route and adds the product with a quantity of 1.
        // NEED TO MODIFY after hosting
        fetch("http://localhost:3000/cart", { 
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity: 1
          })
        })
        .then(res => res.json())
        .then(data => {
          alert("Product added to cart!");
        })
        .catch(err => {
          console.error("Error adding to cart:", err);
          alert("Failed to add product to cart.");
        });
      });

      const prodDetails = document.getElementById('prod-details');
      prodDetails.appendChild(addToCartBtn);

    }
  })
  .catch(error => {
    console.error("Error fetching product:", error);
    container.innerHTML = "<p>Failed to load product details.</p>";
  });


// if (document.getElementById("product-detail")) {
//   productDetail();
// }

