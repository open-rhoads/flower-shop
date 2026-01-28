// 
(function () {
  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId');

  const emailEl = document.getElementById('conf-email');
  const idEl = document.getElementById('conf-order-id');
  const totalEl = document.getElementById('conf-total');
  const itemsEl = document.getElementById('conf-items');
  const addressEl = document.getElementById('conf-address');

  function fmt(n) { return `$${Number(n || 0).toFixed(2)}`; }

  // Try to load from sessionStorage first
  const local = sessionStorage.getItem('lastOrder');
  if (local) {
    try {
      const order = JSON.parse(local);
      if (order && (!orderId || order.id === orderId)) {
        render(order);
        return;
      }
    } catch {
      // ignore parse errors and fall through to fetch
    }
  }

  // Fallback: fetch from the API
  if (orderId) {
    fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}`)
      .then(r => r.json())
      .then(render)
      .catch(err => {
        console.error('Could not load order', err);
        document.querySelector('.container')?.insertAdjacentHTML(
          'beforeend',
          '<div class="alert alert-danger mt-3">Unable to load order details.</div>'
        );
      });
  }

  function render(order) {
    idEl.textContent = order.id || '';
    emailEl.textContent = order.customer?.email || '';
    totalEl.textContent = fmt(order.totals?.grandTotal);

    itemsEl.innerHTML = '';
    (order.items || []).forEach(it => {
      const line = document.createElement('div');
      line.className = 'd-flex justify-content-between mb-1';
      line.innerHTML = `<span>${it.name} × ${it.quantity}</span><span>${fmt(it.price * it.quantity)}</span>`;
      itemsEl.appendChild(line);
    });

    const addr = order.shippingAddress || {};
    addressEl.textContent =
      `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} ${addr.zip || ''}`.trim();
  }
})();