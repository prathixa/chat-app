const socket = io();

// Ask for name
const myName = prompt("Enter your name to join the chat:") || "Anonymous";
socket.emit('new-user', myName);

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
// Function to get current time in HH:MM format
function getCurrentTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ":" + 
           now.getMinutes().toString().padStart(2, '0');
}

// Updated function to add styled messages with timing
function addMessage(text, className) {
    const item = document.createElement('li');
    item.classList.add(className);

    // Create a span for the text content
    const content = document.createElement('div');
    content.textContent = text;

    // Create a span for the timing
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('msg-time');
    timeSpan.textContent = getCurrentTime();

    // Append both to the list item
    item.appendChild(content);
    item.appendChild(timeSpan);
    
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        const msg = input.value;
        // 1. Send to server
        socket.emit('chat message', msg);
        
        // 2. Add to my own screen immediately with 'message-me' style
        addMessage(` ${msg}`, 'message-me');
        
        input.value = '';
    }
});

// Listen for messages from others
socket.on('chat message', (data) => {
    // Only show if it's NOT from me (since I already added mine locally)
    if (data.username !== myName) {
        addMessage(`${data.username}: ${data.message}`, 'message-other');
    }
});

// System notifications
socket.on('user-connected', (user) => {
    addMessage(`${user} joined the room`, 'system-msg');
});

socket.on('user-disconnected', (user) => {
    addMessage(`${user} left the room`, 'system-msg');
});