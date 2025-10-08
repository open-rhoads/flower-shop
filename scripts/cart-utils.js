function createCartControls(productId) {
  const wrapper = document.createElement("div");
  wrapper.className = "cart-controls d-flex align-items-center ms-2";

  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.min = "1";
  quantityInput.value = "1";
  quantityInput.className = "form-control form-control-sm w-auto mx-2";

  const addToCartBtn = document.createElement("button");
  addToCartBtn.textContent = "Add to Cart";
  addToCartBtn.className = "btn btn-outline-secondary btn-sm";

  addToCartBtn.addEventListener("click", () => {
    const quantity = parseInt(quantityInput.value);
    addToCart(productId, quantity);
  });

  wrapper.appendChild(quantityInput);
  wrapper.appendChild(addToCartBtn);

  return wrapper;
}

function addToCart(productId, quantity = 1) {
  fetch("http://localhost:3000/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ product_id: productId, quantity })
  })
  .then(res => res.json())
  .then(data => {
    alert("Product added to cart!");
  })
  .catch(err => {
    console.error("Error adding to cart:", err);
    alert("Failed to add product to cart.");
  });
}
