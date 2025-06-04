// products array is storing the product data for now - will use database later
const products = [
  {
    id: 1,
    category: "Flowers",
    name: "Daisies",
    img: `./images/daisy.jpg`,
    alt: "White daisies in bloom",
    description: "Bright and cheerful white daisies.",
    longDescription: "Daisies are a timeless symbol of innocence and purity. Their simple beauty and long-lasting blooms make them a favorite for bouquets and garden beds alike.",
    price: 12.99
  },
  {
    id: 2,
    category: "Flowers",
    name: "Lilies",
    img: `./images/lily.jpg`,
    alt: "Elegant white lilies",
    description: "Elegant lilies with a sweet fragrance.",
    longDescription: "Lilies are known for their graceful petals and rich fragrance. Perfect for formal arrangements or serene garden corners.",
    price: 18.99
  },
  {
    id: 3,
    category: "Flowers",
    name: "Hibiscus",
    img: `./images/hibiscus.jpg`,
    alt: "Vibrant red hibiscus flower",
    description: "Tropical hibiscus with bold color.",
    longDescription: "Hibiscus flowers bring a tropical flair to any space. Their large, colorful blooms attract pollinators and attention alike.",
    price: 14.99
  },
  {
    id: 4,
    category: "Flowers",
    name: "Poppies",
    img: `./images/poppies.jpg`,
    alt: "Red poppies in a field",
    description: "Delicate poppies with vivid petals.",
    longDescription: "Poppies are known for their paper-thin petals and vibrant hues. They symbolize remembrance and beauty in simplicity.",
    price: 11.99
  },
  {
    id: 5,
    category: "Flowers",
    name: "Sunflowers",
    img: `./images/sunflowers.jpg`,
    alt: "Tall sunflowers facing the sun",
    description: "Tall sunflowers that follow the sun.",
    longDescription: "Sunflowers are cheerful giants that bring warmth and brightness. Their large heads and golden petals make them a garden favorite.",
    price: 16.99
  },
  {
    id: 6,
    category: "Flowers",
    name: "Bird of Paradise",
    img: `./images/bird-paradise.jpg`,
    alt: "Exotic bird of paradise flower",
    description: "Exotic and striking tropical flower.",
    longDescription: "Bird of Paradise flowers resemble a bird in flight. Their bold structure and vivid colors make them a showstopper in any arrangement.",
    price: 24.99
  },
  {
    id: 7,
    category: "Succulents",
    name: "Jade Plant",
    img: `./images/jade-plant.jpg`,
    alt: "Glossy green jade plant",
    description: "A hardy succulent with thick leaves.",
    longDescription: "Jade plants are symbols of prosperity and are easy to care for. Their thick, glossy leaves store water and thrive in bright light.",
    price: 9.99
  },
  {
    id: 8,
    category: "Succulents",
    name: "Cacti Varietals",
    img: `./images/cacti.jpg`,
    alt: "Assorted small cacti",
    description: "A mix of low-maintenance cacti.",
    longDescription: "This collection of cacti offers a variety of shapes and textures. Perfect for sunny windowsills and minimal watering routines.",
    price: 13.99
  },
  {
    id: 9,
    category: "Succulents",
    name: "Crown of Thorns",
    img: `./images/corwn-thorns.jpg`,
    alt: "Crown of thorns succulent with red flowers",
    description: "Spiky succulent with vibrant blooms.",
    longDescription: "The Crown of Thorns is a unique succulent with thorny stems and bright flowers. It thrives in dry conditions and adds character to any space.",
    price: 10.99
  },
  {
    id: 10,
    category: "Succulents",
    name: "Zebra Haworthia",
    img: `./images/zebra-haworthia.jpg`,
    alt: "Striped zebra haworthia plant",
    description: "Striped succulent with a compact shape.",
    longDescription: "Zebra Haworthia is a small, striking succulent with white stripes. It's ideal for desks, shelves, and small containers.",
    price: 8.99
  },
  {
    id: 11,
    category: "Succulents",
    name: "Agave",
    img: `./images/agave.jpg`,
    alt: "Agave plant with thick pointed leaves",
    description: "Bold succulent with architectural form.",
    longDescription: "Agave plants are known for their dramatic rosettes and drought tolerance. They make a bold statement in xeriscapes and containers.",
    price: 15.99
  },
  {
    id: 12,
    category: "Succulents",
    name: "Burro's Tail",
    img: `./images/burro-tail.jpg`,
    alt: "Trailing burro's tail succulent",
    description: "Trailing succulent with plump leaves.",
    longDescription: "Burro's Tail is a trailing succulent with cascading stems of plump, pale green leaves. It's perfect for hanging baskets and sunny spots.",
    price: 12.49
  },
  {
    id: 13,
    category: "Tools",
    name: "Axe",
    alt: "Wood-handled axe",
    img: `./images/axe.jpg`,
    description: "Durable axe for chopping and clearing.",
    longDescription: "This sturdy axe is ideal for chopping wood and clearing brush. Its ergonomic handle and sharp blade make tough jobs easier.",
    price: 29.99
  },
  {
    id: 14,
    category: "Tools",
    name: "Lawn Mower",
    img: `./images/mower.jpg`,
    alt: "Push lawn mower on grass",
    description: "Manual push mower for small lawns.",
    longDescription: "A classic push mower that’s quiet, eco-friendly, and perfect for small yards. Easy to maneuver and maintain.",
    price: 89.99
  },
  {
    id: 15,
    category: "Tools",
    name: "Planting Pots",
    img: `./images/pots.jpg`,
    alt: "Assorted ceramic planting pots",
    description: "Set of decorative planting pots.",
    longDescription: "These ceramic pots come in various sizes and colors, perfect for indoor or outdoor use. Great for succulents, herbs, and flowers.",
    price: 19.99
  },
  {
    id: 16,
    category: "Tools",
    name: "Rakes and Pitchforks",
    img: `./images/rake-hoe.jpg`,
    alt: "Garden rake and pitchfork leaning on a shed",
    description: "Essential tools for soil and compost.",
    longDescription: "This combo set includes a rake and pitchfork for turning soil, spreading mulch, and managing compost. Built to last with wooden handles.",
    price: 34.99
  },
  {
    id: 17,
    category: "Tools",
    name: "Shovels",
    img: `./images/shovel.jpg`,
    alt: "Garden shovel in soil",
    description: "Heavy-duty shovel for digging and planting.",
    longDescription: "A versatile garden shovel with a steel blade and comfortable grip. Ideal for digging holes, moving soil, and planting trees.",
    price: 22.99
  },
  {
    id: 18,
    category: "Tools",
    name: "Wheelbarrows",
    img: `./images/wheelbarrels.jpg`,
    alt: "Metal wheelbarrow in a garden",
    description: "Sturdy wheelbarrow for hauling materials.",
    longDescription: "This durable wheelbarrow makes transporting soil, plants, and tools easy. Its balanced design and large wheel ensure smooth movement.",
    price: 59.99
  }
];

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

  filtered.forEach(product => {
    const card = document.createElement("div");
    card.className = "col-sm-6 col-md-4";
    card.innerHTML = `
      <div class="thumbnail">
        <img src="${product.img}" alt="${product.alt}" width="377" height="251" class="img-fluid">
        <div class="caption">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p><a href="product.html?id=${product.id}" class="btn btn-primary" role="button">View Details</a></p>
        </div>
      </div>
    `;
    productList.appendChild(card);
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

// Optional: Load a default category
renderProducts("Flowers");
