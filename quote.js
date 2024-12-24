document.querySelector(".add").addEventListener("click", function (event) {
  event.preventDefault(); // Prevent default form behavior

  // Get the values from the inputs
  const productLink = document.getElementById("productname").value;
  const quantity = document.getElementById("qty").value;

  // Check if both fields are filled
  if (productLink.trim() === "" || quantity.trim() === "") {
      alert("Please fill in both fields!");
      return;
  }

  // Create a container div for the result
  const resultContainer = document.createElement("div");
  resultContainer.className = "result-item";
  resultContainer.style.display = "flex";
  resultContainer.style.justifyContent = "space-between";
  resultContainer.style.alignItems = "center";
  resultContainer.style.marginBottom = "10px";
  resultContainer.style.border = "1px solid #ddd";
  resultContainer.style.padding = "10px";
  resultContainer.style.backgroundColor = "#f9f9f9";

  // Create a container for text
  const textContainer = document.createElement("div");

  // Create a paragraph for the product link
  const productText = document.createElement("p");
  productText.innerHTML = `<strong>Product Link:</strong> ${productLink}`;
  textContainer.appendChild(productText);

  // Create a paragraph for the quantity
  const quantityText = document.createElement("p");
  quantityText.innerHTML = `<strong>Quantity:</strong> ${quantity}`;
  textContainer.appendChild(quantityText);

  // Add text container to the result container
  resultContainer.appendChild(textContainer);

  // Create the "X" button
  const removeButton = document.createElement("button");
  removeButton.textContent = "X";
  removeButton.style.backgroundColor = "red";
  removeButton.style.color = "white";
  removeButton.style.border = "none";
  removeButton.style.padding = "5px 10px";
  removeButton.style.cursor = "pointer";
  removeButton.style.borderRadius = "5px";

  // Add event listener to the "X" button to remove the item
  removeButton.addEventListener("click", function () {
      resultContainer.remove();
      adjustCheckoutPosition();
  });

  // Add the remove button to the result container
  resultContainer.appendChild(removeButton);

  // Append the result container to the results section
  const resultsSection = document.getElementById("results");
  resultsSection.appendChild(resultContainer);

  // Clear the input fields
  document.getElementById("productname").value = "";
  document.getElementById("qty").value = "";

  // Add or move the "Checkout" button to the bottom
  adjustCheckoutPosition();
});

function adjustCheckoutPosition() {
  const resultsSection = document.getElementById("results");

  // Check if the "Checkout" button already exists
  let checkoutButton = document.querySelector(".checkout-btn");
  if (!checkoutButton) {
      checkoutButton = document.createElement("button");
      checkoutButton.className = "checkout-btn";
      checkoutButton.textContent = "Checkout";
      checkoutButton.style.backgroundColor = "green";
      checkoutButton.style.color = "white";
      checkoutButton.style.border = "none";
      checkoutButton.style.padding = "10px 20px";
      checkoutButton.style.cursor = "pointer";
      checkoutButton.style.borderRadius = "5px";
      checkoutButton.style.marginTop = "20px";

      // Add event listener to the "Checkout" button
      checkoutButton.addEventListener("click", function () {
          processCheckout();
      });

      resultsSection.appendChild(checkoutButton);
  }

  // Move the "Checkout" button to the end of the results section
  resultsSection.appendChild(checkoutButton); // Ensures it's at the very bottom
}

// Function to handle checkout
function processCheckout() {
  const productContainers = document.querySelectorAll(".result-item");
  if (productContainers.length === 0) {
      alert("No products to checkout!");
      return;
  }

  // Generate a unique order ID
  const orderId = makeid(10);

  // Collect product data
  const products = [];
  productContainers.forEach((container) => {
      const productLink = container.querySelector("p:nth-child(1)").textContent.replace("Product Link:", "").trim();
      const quantity = container.querySelector("p:nth-child(2)").textContent.replace("Quantity:", "").trim();
      products.push({ productLink, quantity });
  });

  // Save data to Firebase
  saveOrderToFirebase(orderId, products);

  // Display the order ID to the user
  alert(`Checkout successful! Your Order ID is ${orderId}`);
}

function saveOrderToFirebase(orderId, products) {
  const config = {
      apiKey: "AIzaSyCcOI3QcZ2d063xYMw3PBHG_fx-ch2HS9Q",
      authDomain: "clearyourcart-809c5.firebaseapp.com",
      databaseURL: "https://clearyourcart-809c5-default-rtdb.firebaseio.com",
      projectId: "clearyourcart-809c5",
      storageBucket: "clearyourcart-809c5.firebasestorage.app",
      messagingSenderId: "133379148838",
  };
  firebase.initializeApp(config);

  const postData = {
      orderId: orderId,
      products: products,
      timestamp: new Date().toISOString(),
  };

  const newPostKey = firebase.database().ref().push().key;

  const updates = {};
  updates[`/orders/${newPostKey}`] = postData;
  firebase.database().ref().update(updates);
}

// Function to generate a unique ID
function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
