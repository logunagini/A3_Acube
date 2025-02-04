// Get DOM elements for voice and text output 
const startButton = document.getElementById("start-btn");
const output = document.getElementById("output");
const inputField = document.getElementById("inputName");
const itemsContainer = document.getElementById("items");
const msgContainer = document.getElementById("msg");

// Check if browser supports the Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // When the voice button is clicked, start listening
    startButton.addEventListener("click", () => {
        output.textContent = "Listening...";
        recognition.start();
    });

    // When a voice result is obtained, show it and search for the recipe
    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.toLowerCase();
        output.textContent = `You said: "${speechResult}"`;
        inputField.value = speechResult; // Set input field with spoken text
        searchMeal(speechResult);
    };

    recognition.onerror = (event) => {
        output.textContent = "Error occurred: " + event.error;
    };
} else {
    output.textContent = "Sorry, your browser doesn't support speech recognition.";
}

// Manual text search button event listener
document.getElementById("button").addEventListener('click', () => {
    let query = inputField.value.trim();
    searchMeal(query);
});

// Function to search for meals (shows default meals if input is empty)
function searchMeal(query) {
    itemsContainer.innerHTML = ""; // Clear previous results
    msgContainer.innerHTML = ""; // Clear messages

    // If input is empty, fetch default recipes
    let apiURL = query ? 
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}` : 
        `https://www.themealdb.com/api/json/v1/1/search.php?s=`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                displayMeals(data.meals);
            } else {
                msgContainer.innerHTML = "<h3>No recipes found. Try another search!</h3>";
            }
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
            msgContainer.innerHTML = "<h3>Something went wrong. Please try again.</h3>";
        });
}

// Function to display meals
function displayMeals(meals) {
    itemsContainer.innerHTML = meals.map(meal => `
        <div class="card m-2" style="width: 12rem;" onclick="showDetails('${meal.idMeal}')">
            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
            <div class="card-body text-center">
                <h5 class="card-text">${meal.strMeal}</h5>
            </div>
        </div>
    `).join("");
}

// Function to show meal details
function showDetails(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.meals) {
                const meal = data.meals[0];
                document.getElementById("details").innerHTML = `
                    <div class="card" style="width: 19rem;">
                        <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                        <div class="card-body">
                            <h3 class="card-text">${meal.strMeal}</h3>
                            <h6>Category: ${meal.strCategory}</h6>
                            <h6>Area: ${meal.strArea}</h6>
                            <h6>Ingredients:</h6>
                            <ul>${getIngredients(meal)}</ul>
                        </div>
                    </div>
                `;
            }
        })
        .catch(error => console.error("Error fetching meal details: ", error));
}

// Helper function to generate the ingredient list
function getIngredients(meal) {
    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
        let ingredient = meal[`strIngredient${i}`];
        let measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
            ingredients += `<li>${measure} ${ingredient}</li>`;
        }
    }
    return ingredients;
}

// Fetch and show default recipes when the page loads
document.addEventListener("DOMContentLoaded", () => {
    searchMeal(""); 
});
