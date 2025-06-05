// store needed DOM Elements - the product-list section and all buttons in the category selector
const productList = document.getElementById("product-list");
const categoryButtons = document.querySelectorAll("#category-selector button");

// Render products
function renderProducts(category) { // accepts a category param
  // filter and store products whose category matches the one passed
  const filtered = products.filter(p => p.category === category);  
  productList.innerHTML = ""; // clear the innerHTML of the product list (from any previously displayed elements)
  // if the length of the products in the filtered variable is 0, display message
  if (filtered.length === 0) {
    productList.innerHTML = "<p>No products found in this category.</p>";
    return;
  }
  filtered.forEach(product => { // loop through the filtered products
    const card = document.createElement("div"); // create div element for the card
    card.className = "col-sm-6 col-md-4 mt-3"; // add classes to the card and set innerHTML with all attributes from product data
    card.innerHTML = `
      <div class="thumbnail">
        <img src="${product.img}" alt="${product.alt}" width="377" height="251" class="img-fluid">
        <div class="caption">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p><a href="product-detail.html?id=${product.id}" class="btn btn-primary" role="button">View Details</a></p>
        </div>
      </div>
    `;
    productList.appendChild(card); // append the card to the product list
  });
}

// Event listeners
categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");
    
    // Remove active class from all buttons
    categoryButtons.forEach(btn => btn.classList.remove("active"));

    // Add active class to clicked button
    button.classList.add("active");

    renderProducts(category);
  });
});

// render products with default category
if (document.getElementById("product-list")) {
  renderProducts("Flowers");
}

