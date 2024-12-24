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
  productText.innerHTML = shortenLink(`<strong>Product Link:</strong> ${productLink}`);
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
      checkoutButton.style.backgroundColor = " #3b7dd8";
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

  // Show a custom dialog with the order ID
  showOrderIdDialog(orderId, function () {
    // Save the order to Firebase
    saveOrderToFirebase(orderId, products);

    // Redirect to the desired URL
  //  window.location.href = "http://www.w3schools.com";
});
}

function showOrderIdDialog(orderId, callback) {
  // Create the overlay
  const overlay = document.createElement("div");
  overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
  `;

  // Create the dialog box
  const dialogBox = document.createElement("div");
  dialogBox.style.cssText = `
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      max-width: 400px;
      width: 80%;
  `;

  // Add the order ID message
  const messageText = document.createElement("p");
  messageText.innerHTML = `Your Order ID is <strong>${orderId}</strong>. \n\nCopy the ID and send to any of our social handles below`;
  dialogBox.appendChild(messageText);

  // Add the "Copy" button
  const copyButton = document.createElement("button");
  copyButton.textContent = "Copy Order ID";
  copyButton.style.cssText = `
      background-color: #3b7dd8;
      color: white;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 5px;
      margin-top: 10px;
      margin-right: 10px;
  `;
  copyButton.addEventListener("click", function () {
      navigator.clipboard.writeText(orderId).then(() => {
         alert("Order ID copied to clipboard!");
      });
  });
  dialogBox.appendChild(copyButton);

  // Add the "OK" button
  const okButton = document.createElement("button");
  okButton.textContent = "OK";
  okButton.style.cssText = `
      background-color: #195276;
      color: white;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 5px;
      margin-top: 10px;
  `;
  okButton.addEventListener("click", function () {
    window.location.href = "http://127.0.0.1:5500/GetQuote/getquote.html?";

      document.body.removeChild(overlay); // Remove the overlay
      if (callback) callback(); // Execute the callback function
  });
  dialogBox.appendChild(okButton);

  // Add social media icons
  const socialMediaContainer = document.createElement("div");
  socialMediaContainer.style.cssText = `
      display: flex;
      justify-content: center;
      margin-top: 20px;
  `;

  // Create WhatsApp icon
  const whatsappIcon = document.createElement("a");
  whatsappIcon.href = "https://wa.me/your_number"; // Replace with your WhatsApp link
  whatsappIcon.target = "_blank";
  whatsappIcon.innerHTML = `<img src="https://img.icons8.com/195276/48/000000/whatsapp.png" alt="WhatsApp" style="margin: 0 10px; cursor: pointer;">`;
  socialMediaContainer.appendChild(whatsappIcon);

  // Create Twitter icon
  const twitterIcon = document.createElement("a");
  twitterIcon.href = "https://twitter.com/your_profile"; // Replace with your Twitter profile link
  twitterIcon.target = "_blank";
  twitterIcon.innerHTML = `<img src="https://img.icons8.com/195276/48/000000/twitter.png" alt="Twitter" style="margin: 0 10px; cursor: pointer;">`;
  socialMediaContainer.appendChild(twitterIcon);

  // Create Instagram icon
  const instagramIcon = document.createElement("a");
  instagramIcon.href = "https://www.instagram.com/your_profile"; // Replace with your Instagram profile link
  instagramIcon.target = "_blank";
  instagramIcon.innerHTML = `<img src="https://img.icons8.com/195276/48/000000/instagram-new.png" alt="Instagram" style="margin: 0 10px; cursor: pointer;">`;
  socialMediaContainer.appendChild(instagramIcon);

  // Add the social media container to the dialog box
  dialogBox.appendChild(socialMediaContainer);

  // Add the dialog box to the overlay
  overlay.appendChild(dialogBox);

  // Add the overlay to the body
  document.body.appendChild(overlay);
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
function shortenLink(text) {
  // Ensure the text starts with http or https
  let url = text.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
      const httpIndex = url.indexOf('http://');
      const httpsIndex = url.indexOf('https://');
      if (httpIndex !== -1) {
          url = url.substring(httpIndex);
      } else if (httpsIndex !== -1) {
          url = url.substring(httpsIndex);
      } else {
          return ''; // Return empty if no valid link found
      }
  }

  // Shorten the text to end at .html or .com
  const htmlIndex = url.indexOf('.html');
  const queryindex = url.indexOf('?');
  let endIndex = -1;

  if (htmlIndex !== -1 ) {
      endIndex = htmlIndex + 5; // Include '.html'
  } 
  if (queryindex !== -1 ) {
    endIndex = queryindex; // stop at ?
} 
  if (endIndex !== -1) {
      url = url.substring(0, endIndex);
  }

  return url;
}
