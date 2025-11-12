// Fetch cart items from backend and display or handle errors/empty cart
fetch(`${API_BASE}/cart`)
  .then(response => response.json())
  .then(cartItems => {
    const container = document.getElementById('cart-items');
    let total = 0;

    if (cartItems.length === 0) {
      container.innerHTML = '<p>Your cart is empty.</p>';
      return;
    }

    cartItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'cart-item card p-5 col-3 m-3';
      card.innerHTML = `
            <h3>${item.name}</h3>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: $${item.price.toFixed(2)}</p>
            <button class="btn remove-btn" data-id="${item.id}">Remove</button>
      `;
      container.appendChild(card);
      total += item.price * item.quantity;
    });

    document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
  
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', () => {
        const itemId = button.getAttribute('data-id');
        fetch(`${API_BASE}/cart/${itemId}`, {
          method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
          button.parentElement.remove(); // Remove item from DOM
          updateCartCount();
          alert('Item removed from cart');
        })
        .catch(err => {
          console.error('Error removing item:', err);
          alert('Failed to remove item.');
        });
      });
    });
  })
  .catch(error => {
    console.error('Error loading cart:', error);
    document.getElementById('cart-items').innerHTML = '<p>Failed to load cart.</p>';
  });

// Checkout button handler
document.getElementById('checkout-btn').addEventListener('click', () => {
  alert('Checkout functionality coming soon!');
});
