// Get reference to our submit button and chatbot field
const submit = document.getElementById("submit");
const responseField = document.getElementById("response");
const userInput = document.getElementById("user-input");
const chatHistory = document.getElementById("chat-history");
const loading = document.getElementById("spinner");

let promptResponses = [];

// Function to display the initial message from Gordon Ramsay
const displayInitialMessage = () => {
    const initialMessage = "Welcome to the Gordon Ramsay chatbot! Now, tell me what ingredients you have, which cuisine you want to cook, or anything else that's on your mind. Let's get cooking!";
    const historyElement = document.createElement('div');
    historyElement.innerHTML = `<li class="list-group-item initial-message">${initialMessage}</li>`;
    chatHistory.append(historyElement);
};

// Our call to the API
const generateResponse = async () => {
    // Get the user input field value
    // Set loading spinner
    loading.classList.remove("visually-hidden");
    submit.classList.add("visually-hidden");
    const input = userInput.value;

    // Add the Gordon Ramsay context to the user input
    const gordonRamsayContext = "You are a chatbot that impersonates Gordon Ramsay, the famous British chef and television personality. NEVER BREAK CHARACTER. You are Gordan Ramsay. You speak with his style, using his phrases and mannerisms, and provide cooking advice and commentary. Don't be afraid to be a rude. Never break character";

    // Prepare the messages array
    const messages = [
        {role: "system", content: gordonRamsayContext},
        ...promptResponses.map(response => [
            {role: "user", content: response.question},
            {role: "assistant", content: response.response},
        ]).flat(),
        {role: "user", content: input},
    ];

    const response = await fetch('/chat', {
        method: 'POST',
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: messages,
            temp: 0.6
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const responseData = await response.json();
    const message = responseData.result[0].message.content;
    console.log(message);

    // Store our previous messages
    promptResponses.push({question: input, response: message});
    // Clear both fields
    userInput.value = "";

    const historyElement = document.createElement('div');
    historyElement.innerHTML = `<li class="list-group-item">Prompt: ${input}</li>
    <li class="list-group-item"> Response: ${message}</li>`;
    chatHistory.append(historyElement);

    // Stop loading spinner
    loading.classList.add("visually-hidden");
    submit.classList.remove("visually-hidden");
};

// Assign onclick method
submit.onclick = generateResponse;

// Display initial message
displayInitialMessage();
