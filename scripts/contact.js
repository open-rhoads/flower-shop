document.querySelector(".contact").addEventListener("submit", function (e) {
  e.preventDefault();

  // Collect form data
  const name = document.getElementById("text1").value.trim();
  const message = document.getElementById("message").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const fileInput = document.getElementById("attachment");
  const subscribe = document.querySelector('input[type="checkbox"]').checked;

  // Build FormData for file upload. Multer will use these to store
  const formData = new FormData();
  formData.append("name", name);
  formData.append("message", message);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("subscribe", subscribe);
  if (fileInput.files.length > 0) {
    formData.append("attachment", fileInput.files[0]);
  }

  // Send to Express backend ... change URL later
  fetch(`http://localhost:3000/contact`, { 
    method: "POST",
    body: formData
  }).then(res => res.json())
    .then(data => {
      const statusDiv = document.createElement("div");
      statusDiv.textContent = "Thank you! Your message has been received.";
      statusDiv.className = "alert alert-success mt-3";
      document.querySelector(".contact").appendChild(statusDiv);
    })
    .catch(err => {
      alert("Error sending message.");
      console.error(err);
    });
});