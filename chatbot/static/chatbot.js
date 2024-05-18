function sendMessage() {
    var input = document.getElementById('user-input');
    var message = input.value.trim();
    if (message) {
        $.ajax({
            url: '/send_message',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({message: message}),
            success: function(data) {
                var chatBox = document.getElementById('chat-box');
                chatBox.innerHTML += '<div class="message user-message">' + message + '</div>';
                chatBox.innerHTML += '<div class="message bot-response">' + data.response + '</div>';
                chatBox.scrollTop = chatBox.scrollHeight;
                input.value = '';
            },
            error: function(xhr, status, error) {
                console.error("Error when sending/receiving message: ", error);
                chatBox.innerHTML += '<div class="message error-message">Error: Unable to send message. Please try again later.</div>';
            }
        });
    }
}

document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();  // Prevent the default action to avoid submitting the form
        sendMessage();
    }
});
document.getElementById('send-btn').addEventListener('click', function() {
    sendMessage();
});

document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();  // Prevent the default action to avoid submitting the form
        sendMessage();
    }
});

function sendMessage() {
    var input = document.getElementById('user-input');
    var message = input.value.trim();
    var chatBox = document.getElementById('chat-box');

    if (message) {
        $.ajax({
            url: '/send_message',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({message: message}),
            success: function(data) {
                chatBox.innerHTML += '<div class="message user-message">' + message + '</div>';
                chatBox.innerHTML += '<div class="message bot-response">' + data.response + '</div>';
                chatBox.scrollTop = chatBox.scrollHeight;
                input.value = '';
            },
            error: function(xhr, status, error) {
                console.error("Error when sending/receiving message: ", error);
                chatBox.innerHTML += '<div class="message error-message">Error: Unable to send message. Please try again later.</div>';
            }
        });
    }
}
