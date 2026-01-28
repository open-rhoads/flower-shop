/* Wrap everything in an IIFE (Immediately Invoked Function Expression).
 * This creates a local scope so our variables/functions don't leak into the global window,
 * preventing accidental name collisions across pages and scripts. 
 * Also ensures the script executes as soon as it's loaded, which matches current pattern.
 */
(function () {
  // get and store needed items from DOM
  const itemsEl = document.getElementById('summary-items');
  const subtotalEl = document.getElementById('summary-subtotal');
  const shippingEl = document.getElementById('summary-shipping');
  const taxEl = document.getElementById('summary-tax');
  const totalEl = document.getElementById('summary-total');
  const form = document.getElementById('checkout-form');
  // empty array for cart (why), object for shipping with associated prices, define tx rate
  let cart = []; // make sure the cart is an array by default
  const SHIPPING = { standard: 5, express: 15 };
  const TAX_RATE = 0.0; // keep simple for now

  function renderSummary() {
    itemsEl.innerHTML = ''; // set items element inner HTML blank
    let subtotal = 0; // define subtotal and initialize to 0
    cart.forEach(item => { // loop through each item in cart 
      const line = (item.price || 0) * (item.quantity || 0); // calculate quantity x price for each item, zero used if falsy/not there...
      subtotal += line; // add each line result to the subtotal
      const row = document.createElement('div'); // create a new div row
      row.className = 'd-flex justify-content-between mb-1'; // add styling classes to it
      row.innerHTML = `<span>${item.name} × ${item.quantity}</span><span>${formatCurrency(line)}</span>`; // put the name, quantity, and formatted subtotal for each line
      itemsEl.appendChild(row); // append the row for each line inside the items summary
    });
    // get shipping method from form element value or default to standard
    const shippingMethod = (form.elements['shipping'].value || 'standard');
    const shipping = SHIPPING[shippingMethod] ?? 0; // check for the selected form value shipping method in SHIPPING object, if not there, set shipping to 0
    const tax = subtotal * TAX_RATE; // calculate tax
    const total = subtotal + shipping + tax; // calculate total
    // attach applicable variables to their textContent places in DOM, formatting all with currency util
    subtotalEl.textContent = formatCurrency(subtotal);
    shippingEl.textContent = formatCurrency(shipping);
    taxEl.textContent = formatCurrency(tax);
    totalEl.textContent = formatCurrency(total);
  }

  // Fetch to load cart & render summary
  fetch(`${API_BASE}/cart`)
    .then(r => r.json()) // set cart equal to the JSON form response, if an array, or make empty array
    .then(items => { 
      cart = Array.isArray(items) ? items : []; 
      renderSummary();
    })
    .catch(err => { // catch any errors and display message
      console.error('Failed to load cart', err);
      itemsEl.innerHTML = '<div class="text-danger">Unable to load cart.</div>';
    });

  // Re-render summary to recompute totals when user changes shipping method 
  form.addEventListener('change', (e) => {
    if (e.target.name === 'shipping') renderSummary();
  });

  // Submit order event
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic HTML5 validation API - will return false if any control is invalid
    if (!form.checkValidity()) {
      form.classList.add('was-validated'); // and then add this class
      return; // and end the function
    }
    // build form data object with submitted values, trimmed
    const data = {
      customer: {
        fullName: form.elements['fullName'].value.trim(),
        email: form.elements['email'].value.trim(),
      },
      shippingAddress: {
        street: form.elements['street'].value.trim(),
        city: form.elements['city'].value.trim(),
        state: form.elements['state'].value.trim(),
        zip: form.elements['zip'].value.trim(),
      },
      shippingMethod: form.elements['shipping'].value,
    };

    // fetch the checkout endpoint and post the data object with the values from the form
    fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(r => r.json()) // turn the response to JSON
      .then(order => {
        if (!order || !order.id) { // if there is no order or order ID
          throw new Error('Invalid order response'); // throw error
        }
        // Make it available to the confirmation page - session storage
        sessionStorage.setItem('lastOrder', JSON.stringify(order));
        // change URL to the confirmation page with the contextual order ID
        window.location.href = `confirmation.html?orderId=${encodeURIComponent(order.id)}`;
      })
      .catch(err => { // catch any errors upon fetch
        console.error('Checkout failed', err);
        alert('Sorry — something went wrong placing your order.');
      });
  });
})();