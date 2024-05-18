// static/chatbot.js
import { db } from './firebase-config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('get-started-btn').addEventListener('click', function() {
        var chatBox = document.getElementById('chat-box');
        var messageBox = document.getElementById('message-box');
        
        chatBox.innerHTML += '<div class="message bot-response">Great! Please tell me what ingredients you have or ask me anything related to cooking.</div>';
        chatBox.scrollTop = chatBox.scrollHeight;
        messageBox.style.display = 'block';
        this.style.display = 'none';  // Hide the Get Started button
    });

    document.getElementById('user-input').addEventListener('keypress', function(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    document.getElementById('send-btn').addEventListener('click', function() {
        sendMessage();
    });

    document.getElementById('recommend-another-btn').addEventListener('click', function() {
        sendButtonMessage('Recommend another recipe');
    });
});

function sendMessage() {
    var input = document.getElementById('user-input');
    var message = input.value.trim();
    sendMessageToServer(message);
}

function sendButtonMessage(message) {
    sendMessageToServer(message);
}

function sendMessageToServer(message) {
    var chatBox = document.getElementById('chat-box');
    var buttonOptions = document.getElementById('button-options');

    if (message) {
        $.ajax({
            url: '/send_message',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ message: message }),
            success: function(data) {
                console.log("Server Response: ", data);  // Log server response for debugging
                chatBox.innerHTML += '<div class="message user-message">' + message + '</div>';
                chatBox.innerHTML += '<div class="message bot-response">' + data.response + '</div>';
                chatBox.scrollTop = chatBox.scrollHeight;
                document.getElementById('user-input').value = '';

                if (data.show_buttons) {
                    buttonOptions.style.display = 'block';
                } else {
                    buttonOptions.style.display = 'none';
                }

                // Store the recipe name in a data attribute
                chatBox.setAttribute('data-recipe-name', data.recipe_name);
                console.log("Recipe Name: ", data.recipe_name);  // Log the recipe name for debugging
            },
            error: function(xhr, status, error) {
                console.error("Error when sending/receiving message: ", error);
                chatBox.innerHTML += '<div class="message error-message">Error: Unable to send message. Please try again later.</div>';
            }
        });
    }
}

async function saveRecipe() {
    const chatBox = document.getElementById('chat-box');
    const recipeName = chatBox.getAttribute('data-recipe-name');
    console.log("Saving Recipe: ", recipeName);  // Log the recipe name being saved

    if (recipeName === "Unknown Recipe") {
        chatBox.innerHTML += '<div class="message bot-response">Failed to save recipe. No recipe name found.</div>';
        return;
    }

    const recipe = { name: recipeName, savedAt: new Date() };

    try {
        await setDoc(doc(db, "recipes", "recipe_" + Date.now()), recipe);
        chatBox.innerHTML += '<div class="message bot-response">Recipe saved successfully!</div>';
    } catch (error) {
        console.error("Error saving recipe:", error);
        chatBox.innerHTML += '<div class="message bot-response">Failed to save recipe. Please try again.</div>';
    }
}

export { saveRecipe };
