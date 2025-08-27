# Flower Shop
This project uses the Bootstrap CSS framework for a flower shop eCommerce website. This project started out as a hard-coded front-end using SCSS. 

## Updated Color Theme
One of my greatest flaws as an early web developer was loving color a bit too much. This site previously had a lively and arguably distarcting bright pink and purple theme that I have scaled back significantly. This was a great way to review SCSS. A lot of the other styling too needed to be modernized.

## Dynamic Content
This project also suffered from bloated HTML. It had a Products page in particular that desperately needed to be re-factored to be dynamic. I started by using a simple JSON object for product data and using it to display the Products list page and a product detail page based on the selected category or individual product. The list page includes a default category.

## Adding the Backend with Express.js & SQLite
Possibly the best enhancement I am working on with this one is to actually hook it up to a database of products and make it function by implementing Express.js with SQLLite database. I am teaching myself how to use these technologies for the first time. 

First, I've used the command line to setup the environment dependencies in a directory. Then, I created the main server file to import required modules/ middleware, then start the app and middleware. This also creates the SQLite database file. Finally, it starts the server port.

From there, I added more files to connect to the database and create, then populate starter tables. I learned how to troubleshoot the tables with the command line using sqlite3. 

With the basic database in place, I set up some basic routes in another file to serve as API endpoints that will work with the database records. 

Finally, I modified both the products.js and product-detail.js files to pull the data from this backend instead of the hard coded JSON file I started with.

## Adding the Cart Functionality
Now that the products are being loaded from a database dynamically, I am working on implementing the cart, checkout, and confirmation pages and functionality. 

First, I needed to add more route endpoints to the server file so I could fetch get and post requests from the database/cart. Then, I added a minimal Cart HTML page and a cart.js file to dynamically populate the cart with products; once they exist. 

Next, I need to add a View Cart button that will display the total number of items and buttons to Add to Cart on the Products page, and put the Add to Cart buttons on the Product list page too. I would also like to enhance the cart to be able to work with a quantity value. Then, I'll add the Checkout functionality.

## Adding a Working Search
Another great enhancement for this project would be a functional search. I will add this once the database and cart checkout are set up.
