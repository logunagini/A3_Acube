const startButton = document.getElementById("start-btn");
const output = document.getElementById("output");

// Check if browser supports Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    startButton.addEventListener("click", () => {
        output.textContent = "Listening...";
        recognition.start();
    });

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.toLowerCase();
        output.textContent = `You said: "${speechResult}"`;

        // Example: Use the speech result to search for a recipe
        searchRecipe(speechResult);
    };

    recognition.onerror = (event) => {
        output.textContent = "Error occurred: " + event.error;
    };
} else {
    output.textContent = "Sorry, your browser doesn't support speech recognition.";
}

function searchRecipe(query) {
    // Mock function to simulate searching for recipes
    output.textContent = `You said:"${query}"...`;
    // You can integrate with a real API like Spoonacular or your own recipe database
}
