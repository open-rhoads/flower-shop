document.querySelector(".contact").addEventListener("submit", function (e) {
  e.preventDefault();

  // Collect form data
  const name = document.getElementById("text1").value.trim();
  const message = document.getElementById("message").value.trim();
  const email = document.getElementById("email1").value.trim();
  const phone = document.getElementById("phone1").value.trim();
  const fileInput = document.getElementById("InputFile");
  const subscribe = document.querySelector('input[type="checkbox"]').checked;

  // Build FormData for file upload
  const formData = new FormData();
  formData.append("name", name);
  formData.append("message", message);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("subscribe", subscribe);
  if (fileInput.files.length > 0) {
    formData.append("attachment", fileInput.files[0]);
  }

  // Send to Express backend
  fetch(`${API_BASE}/contact`, {
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