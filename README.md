# Flower Shop
This project uses the Bootstrap CSS framework for a flower shop eCommerce website. This project started out as a hard-coded front-end using SCSS. 

## Updated Color Theme
One of my greatest flaws as an early web developer was loving color a bit too much. This site previously had a lively and arguably distarcting bright pink and purple theme that I have scaled back significantly. This was a great way to review SCSS. A lot of the other styling too needed to be modernized.

## Dynamic Content
This project also suffers from bloated HTML. It has a Products page in particular that was begging me to re-factor it to be dynamic. I started by using a simple JSON object for product data and using it to display the Products list page and a product detail page dynamically based on the selected category or individual product. The list page includes a default category.

## Adding a Functional Cart Back End
Possibly the best enhancement I am working on with this one is to actually hook it up to a database of products and make it function by implementing Express.js with SQLLite database. I am teaching myself how to use these technologies for the first time. 

First, I've used the command line to setup the environment dependencies in a directory. Then, I created the main server file to import required modules/ middleware, then start the app and middleware. This also creates the SQLite database file. Finally, it starts the server port.

## Adding Functional Search
Another great enhancement for this project would be a functional search. I will add this once the database is set up.
