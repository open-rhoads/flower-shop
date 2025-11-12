function createCartControls(productId) {
  const wrapper = document.createElement("div");
  wrapper.className = "cart-controls d-flex align-items-center mt-2";

  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.min = "1";
  quantityInput.value = "1";
  quantityInput.className = "form-control form-control-sm w-50 mx-2";

  const addToCartBtn = document.createElement("button");
  addToCartBtn.textContent = "Add to Cart";
  addToCartBtn.className = "btn btn-outline-secondary add-to-cart w-50";

  addToCartBtn.addEventListener("click", () => {
    const quantity = parseInt(quantityInput.value);
    addToCart(productId, quantity);
  });

  wrapper.appendChild(quantityInput);
  wrapper.appendChild(addToCartBtn);

  return wrapper;
}

function addToCart(productId, quantity = 1) {
  fetch(`${API_BASE}/cart`, { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId, quantity })
  })
  .then(res => res.json())
  .then(data => {
    updateCartCount();
    alert("Product added to cart!");
  })
  .catch(err => {
    console.error("Error adding to cart:", err);
    alert("Failed to add product to cart.");
  });
}

function updateCartCount() {
  fetch(`${API_BASE}/cart`) 
    .then(response => response.json())
    .then(cartItems => {
        // Calculate total quantity - reduce expects callback and initial value
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const badge = document.getElementById("cart-count");
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? "inline-block" : "none";
        }
    })
    .catch(error => console.error("Error updating cart count:", error));
}

// Run on page load
document.addEventListener("DOMContentLoaded", updateCartCount);

