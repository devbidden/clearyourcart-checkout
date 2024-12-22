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
    });
  
    // Add the remove button to the result container
    resultContainer.appendChild(removeButton);
  
    // Append the result container to the results section
    const resultsSection = document.getElementById("results");
    resultsSection.appendChild(resultContainer);
  
    // Clear the input fields
    document.getElementById("productname").value = "";
    document.getElementById("qty").value = "";
  });