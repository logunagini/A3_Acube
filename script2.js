// Get DOM elements for voice and text output
const startButton = document.getElementById("start-btn");
const output = document.getElementById("output");

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
    let inputValue = document.getElementById('inputName').value;
    searchMeal(inputValue);
});

// This function uses the TheMealDB API to search for recipes based on the query
function searchMeal(query) {
    // Clear any previous details
    document.getElementById("details").innerHTML = "";

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(response => response.json())
        .then(data => {
            const items = document.getElementById("items");
            items.innerHTML = "";
            if (data.meals === null) {
                // If no meals found, display a message (make sure the element with id "msg" exists)
                document.getElementById("msg").style.display = "block";
            } else {
                document.getElementById("msg").style.display = "none";
                data.meals.forEach(meal => {
                    let itemDiv = document.createElement("div");
                    itemDiv.className = "m-2 singleItem";
                    // When clicking the card, show detailed information for that meal
                    itemDiv.setAttribute('onclick', `details('${meal.idMeal}')`);
                    let itemInfo = `
                        <div class="card" style="width: 12rem;">
                            <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                            <div class="card-body text-center">
                                <h5 class="card-text">${meal.strMeal}</h5>
                            </div>
                        </div>
                    `;
                    itemDiv.innerHTML = itemInfo;
                    items.appendChild(itemDiv);
                });
            }
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        });
}

// This function fetches and displays detailed information about a selected meal
function details(id) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(detail => {
            let meal = detail.meals[0];
            let detailsContainer = document.getElementById("details");
            detailsContainer.innerHTML = "";
            let detailsDiv = document.createElement("div");
            let detailsInfo = `
                <div class="card" style="width: 19rem;">
                    <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                    <div class="card-body">
                        <h3 class="card-text">${meal.strMeal}</h3>
                        <h6>Ingredients</h6>
                        <ul>
                            <li>Area: ${meal.strArea}</li>
                            <li>Category: ${meal.strCategory}</li>
                            <li>${meal.strIngredient1}</li>
                            <li>${meal.strIngredient2}</li>
                            <li>${meal.strIngredient3}</li>
                            <li>${meal.strIngredient4}</li>
                            <li>${meal.strIngredient5}</li>
                        </ul>
                    </div>
                </div>
            `;
            detailsDiv.innerHTML = detailsInfo;
            detailsContainer.appendChild(detailsDiv);
        })
        .catch(error => {
            console.error("Error fetching meal details: ", error);
        });
}
