const chatIcon = document.getElementById("chat-icon");
const chatContainer = document.getElementById("chat-container");
const closeChat = document.getElementById("close-chat");
const chatBox = document.getElementById("chat-box");
const form = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const typingIndicator = document.getElementById("typing-indicator");

const WEBHOOK_URL = "https://ansarulislamfahad123.app.n8n.cloud/webhook/ffcf29b6-19e9-40fd-81a6-132910560043/chat"; // Replace with actual n8n URL

chatIcon.onclick = () => chatContainer.classList.remove("hidden");
closeChat.onclick = () => chatContainer.classList.add("hidden");

window.onload = () => {
  const saved = JSON.parse(localStorage.getItem("chatHistory")) || [];
  saved.forEach(msg => addMessage(msg.text, msg.sender, msg.timestamp));
};

form.onsubmit = async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  const timestamp = new Date().toLocaleTimeString();
  addMessage(message, "user", timestamp);
  saveToLocal(message, "user", timestamp);
  userInput.value = "";

  typingIndicator.classList.remove("hidden");

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await res.json();
    const botReply = data.reply || "Sorry, I didn't understand that.";
    const botTime = new Date().toLocaleTimeString();
    addMessage(botReply, "bot", botTime);
    saveToLocal(botReply, "bot", botTime);
  } catch (err) {
    addMessage("Error connecting to bot.", "bot", new Date().toLocaleTimeString());
  }

  typingIndicator.classList.add("hidden");
};

function addMessage(text, sender, time) {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.innerHTML = `${text} <span class="timestamp">${time}</span>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function saveToLocal(text, sender, timestamp) {
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  chatHistory.push({ text, sender, timestamp });
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}
