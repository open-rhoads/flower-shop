/* Wrap everything in an IIFE (Immediately Invoked Function Expression).
 * This creates a local scope so our variables/functions don't leak into the global window,
 * preventing accidental name collisions across pages and scripts. 
 * Also ensures the script executes as soon as it's loaded, which matches current pattern.
 */
(function (){
  /* Cache key DOM references once at the top to avoid repeated DOM queries - slightly more efficient and keeps code tidy. */
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  
  /* CHANGE: Add a tiny currency helper.
   * centralizing calls to toFixed, reduces duplication and
   * avoids subtle inconsistencies (e.g., missing $ or different rounding).
  */
  function formatCurrency(n) {
    return `$${Number(n || 0).toFixed(2)}`;
  }

  /* rendering into a pure `render(cartItems)` function
   * Separates concerns (fetch vs. render), makes it trivial to re-render after
   * deletes or other updates without duplicating markup logic.
   * &  render a "Remove" button with a `data-id`, matching the event handler 
   */
  
  function render(cartItems) {
    container.innerHTML = '';
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      container.innerHTML = '<p class="text-muted">Your cart is empty.</p>';
      totalEl.textContent = 'Total: $0.00';
      return;
    }

    let total = 0;
    cartItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'cart-item card p-3 col-12 col-md-5 col-lg-3 m-3';
      const line = (item.price || 0) * (item.quantity || 0);
      total += line;

      card.innerHTML = `
        <h4 class="h6 mb-2">${item.name}</h4>
        <div class="small text-muted mb-2">Quantity: ${item.quantity}</div>
        <div class="mb-3">Price: <strong>${formatCurrency(item.price)}</strong></div>
        <!-- CHANGE: Add a real remove button with data-id so the handler can find it -->
        <button class="btn btn-sm btn-outline-danger remove-btn" data-id="${item.id}">Remove</button>
      `;
      container.appendChild(card);
    });

    totalEl.textContent = `Total: ${formatCurrency(total)}`;

    // Also update the badge here - IRL, different tabs/sessions etc. could alter the cart
    // this gets the real cart items sent again without re-fetching
    // check to see if chart items are an array (don't need to check for empty, we handle that case later)
    const count = Array.isArray(cartItems) //if it is, then we reduce (sum) the items
      // reduce accepts a function to combine and an initial value for the sum. 
      // The function is passed 2 params: the sum and each item (it's a loop)
      ? cartItems.reduce((s, it) => s + Number(it?.quantity ?? 0), 0) 
      : 0; // if it's not an array, count is 0
    const badge = document.getElementById('cart-count');  // grab badge element
    if (badge) { // if it exists
      badge.textContent = count; // set the textContent equal to count value
      badge.style.display = count > 0 ? 'inline-block' : 'none'; // if count is 0, hide the badge
    }
  }

  // Fetch cart items from backend and display or handle errors/empty cart
  fetch(`${API_BASE}/cart`)
    .then(response => response.json())
    .then(cartItems => {
      render(cartItems);
    })
    .catch(error => {
      console.error('Error loading cart:', error);
      container.innerHTML = '<p class="text-danger">Failed to load cart.</p>';
    });
  
  /* Use event delegation on the container for Remove clicks (trickles down).
   * We generate item elements dynamically, so binding once on the parent is more reliable 
   * and avoids adding a separate listener for every button.
   * Use `encodeURIComponent` on the id to be safe for any id format.
   * POST-DELETE: If the API returns the updated cart array, we render that directly;
   * otherwise we fall back to a quick re-fetch. This prevents an extra
   * roundtrip when your API already returns the next state. 
  */
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.remove-btn');
    if (!btn) return;

    const itemId = btn.getAttribute('data-id');
    if (!itemId) return;

    fetch(`${API_BASE}/cart/${encodeURIComponent(itemId)}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(next => {
        // Prefer server's authoritative cart if provided
        if (Array.isArray(next)) {
          render(next);
        } else {
          return fetch(`${API_BASE}/cart`).then(r => r.json()).then(render);
        }
        // Keep the badge in sync across the site 
        updateCartCount();
      })
      .catch(err => {
        console.error('Error removing item:', err);
        alert('Failed to remove item.');
      });
  });

  // Checkout button handler - Guard with a null check so the file can be loaded on other pages without errors.
  if (checkoutBtn){
    checkoutBtn.addEventListener('click', () => {
      const url = new URL('checkout.html', window.location.href);
      window.location.href = url.href; // -> /flower-shop/checkout.html
    });
  }
})();