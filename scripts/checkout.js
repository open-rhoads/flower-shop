//
(function () {
  const itemsEl = document.getElementById('summary-items');
  const subtotalEl = document.getElementById('summary-subtotal');
  const shippingEl = document.getElementById('summary-shipping');
  const taxEl = document.getElementById('summary-tax');
  const totalEl = document.getElementById('summary-total');
  const form = document.getElementById('checkout-form');

  let cart = [];
  const SHIPPING = { standard: 5, express: 15 };
  const TAX_RATE = 0.0; // keep simple for now

  function format(n) { return `$${Number(n || 0).toFixed(2)}`; }

  function renderSummary() {
    itemsEl.innerHTML = '';
    let subtotal = 0;
    cart.forEach(item => {
      const line = (item.price || 0) * (item.quantity || 0);
      subtotal += line;
      const row = document.createElement('div');
      row.className = 'd-flex justify-content-between mb-1';
      row.innerHTML = `<span>${item.name} × ${item.quantity}</span><span>${format(line)}</span>`;
      itemsEl.appendChild(row);
    });

    const shippingMethod = (form.elements['shipping'].value || 'standard');
    const shipping = SHIPPING[shippingMethod] ?? 0;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + shipping + tax;

    subtotalEl.textContent = format(subtotal);
    shippingEl.textContent = format(shipping);
    taxEl.textContent = format(tax);
    totalEl.textContent = format(total);
  }

  // Load cart & render summary
  fetch(`${API_BASE}/cart`)
    .then(r => r.json())
    .then(items => { cart = Array.isArray(items) ? items : []; renderSummary(); })
    .catch(err => {
      console.error('Failed to load cart', err);
      itemsEl.innerHTML = '<div class="text-danger">Unable to load cart.</div>';
    });

  // Recompute totals when shipping method changes
  form.addEventListener('change', (e) => {
    if (e.target.name === 'shipping') renderSummary();
  });

  // Submit order
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic HTML5 validation gate
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

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

    fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(r => r.json())
      .then(order => {
        if (!order || !order.id) {
          throw new Error('Invalid order response');
        }
        // Make it immediately available to the confirmation page
        sessionStorage.setItem('lastOrder', JSON.stringify(order));
        window.location.href = `confirmation.html?orderId=${encodeURIComponent(order.id)}`;
      })
      .catch(err => {
        console.error('Checkout failed', err);
        alert('Sorry—something went wrong placing your order.');
      });
  });
})();