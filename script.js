const WEBHOOK_URL = "https://ansarulislamfahad123.app.n8n.cloud/webhook-test/chat";

const chatIcon = document.getElementById("chat-icon");
const chatContainer = document.getElementById("chat-container");
const closeChatBtn = document.getElementById("close-chat");
const chatBox = document.getElementById("chat-box");
const typingIndicator = document.getElementById("typing-indicator");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// Toggle chat open/close
chatIcon.addEventListener("click", () => {
  chatContainer.classList.remove("hidden");
  chatIcon.style.display = "none";
});

closeChatBtn.addEventListener("click", () => {
  chatContainer.classList.add("hidden");
  chatIcon.style.display = "block";
});

// Add message to chat window
function addMessageToChat(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.className = sender === "user" ? "user-message" : "bot-message";
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Show or hide typing indicator
function showTypingIndicator(show) {
  if (show) typingIndicator.classList.remove("hidden");
  else typingIndicator.classList.add("hidden");
}

// Send message to n8n webhook and get reply
async function sendMessage(message) {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    const data = await res.json();

    return data.reply || "Sorry, I cannot understand that.";
  } catch (error) {
    console.error("Error sending message:", error);
    return "Sorry, something went wrong.";
  }
}

// Handle form submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  addMessageToChat("user", message);
  userInput.value = "";

  showTypingIndicator(true);
  const botReply = await sendMessage(message);
  showTypingIndicator(false);

  addMessageToChat("bot", botReply);
});
