const API_BASE = "http://127.0.0.1:3000"; // Change to your hosted URL later

/* Add a tiny currency helper.
   * centralizing calls to toFixed, reduces duplication and
   * avoids subtle inconsistencies (e.g., missing $ or different rounding).
*/
function formatCurrency(n) {
    return `$${Number(n || 0).toFixed(2)}`;
}

// footer year helper
function getYear() {
    document.getElementById('year').textContent = new Date().getFullYear();
}
    
// optional URL utils?
// function go(relativePath, base = window.location.href) {
//   window.location.href = new URL(relativePath, base).href;
// }

// // Examples:
// go('checkout.html'); // current folder → checkout.html
// go('confirmation.html?orderId=123'); // auto-encodes and resolves correctly

// function goFromOrigin(pathFromRoot) {
//   const base = `${location.origin}/`; // e.g., "http://127.0.0.1:5500/"
//   window.location.href = new URL(pathFromRoot.replace(/^\//, ''), base).href;
// }

// // Example (be careful: path must include your subfolder if needed)
// goFromOrigin('flower-shop/checkout.html');