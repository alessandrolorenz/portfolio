let apiResponse = null;
let chatHistory = [];
document.addEventListener("DOMContentLoaded", () => {
  const userInput = document.getElementById("userInput");
  apiResponse = document.getElementById("apiResponse");

  userInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
});

async function sendMessage() {
  const userInput = document.getElementById("userInput");
  const userInputValue = userInput.value.trim();
  userInput.innerHTML = "";
  userInput.value = "";
  if (userInputValue === "") {
    alert("Por favor, digite uma mensagem antes de enviar.");
    return;
  }
  const questionLi = document.createElement("li");
  questionLi.classList.add("chatbot__chat");
  questionLi.classList.add("outgoing");
  const question = document.createElement("p");

  question.innerHTML = userInputValue;
  questionLi.appendChild(question);

  const chatBox = document.querySelector(".chatbot__box");
  chatBox.appendChild(questionLi);
  // questionLi.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const paragraphTagWaiting = document.createElement("p");
  const answerWaiting = document.createElement("li");

  answerWaiting.classList.add("chatbot__chat");
  answerWaiting.classList.add("incoming");
  answerWaiting.classList.add("waiting");
  paragraphTagWaiting.innerHTML = "...";
  answerWaiting.appendChild(paragraphTagWaiting);

  chatBox.appendChild(answerWaiting);
  scrollChatBoxToBottom(chatBox, answerWaiting);

  chatHistory.push({ role: "USER", message: userInputValue });

  try {
    const response = await fetch("https://alessandro-chatbot.vercel.app/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: chatHistory }),
    });

    const data = await response.json();

    if (data.reply) {
      chatHistory.push({ role: "CHATBOT", message: data.reply });
      const paragraphs = data.reply.split("\n");
      const chatbotChatWaiting = document.querySelector(".waiting");
      chatbotChatWaiting.remove();
      const paragraphTag = document.createElement("p");
      const answer = document.createElement("li");
      answer.classList.add("chatbot__chat");
      answer.classList.add("incoming");

      paragraphs.forEach((paragraph) => {
        if (paragraph === "") {
          return;
        }
        paragraphTag.innerHTML =
          paragraphTag.innerHTML + paragraph + "<br><br>";
      });

      answer.appendChild(paragraphTag);
      chatBox.appendChild(answer);
      scrollChatBoxToBottom(chatBox, answer);
    } else {
      const chatbotChatWaiting = document.querySelector(".waiting");
      chatbotChatWaiting.remove();
      const paragraphTag = document.createElement("p");
      paragraphTag.classList.add("error");
      const answer = document.createElement("li");
      answer.classList.add("chatbot__chat");
      answer.classList.add("incoming");

      paragraphTag.innerHTML = "Something went wrong. Please try again later.";
      chatHistory.pop();
      answer.appendChild(paragraphTag);
      chatBox.appendChild(answer);
      scrollChatBoxToBottom(chatBox, answer);
    }
  } catch (error) {
    const chatbotChatWaiting = document.querySelector(".waiting");
    chatbotChatWaiting.remove();
    const paragraphTag = document.createElement("p");
    paragraphTag.classList.add("error");
    const answer = document.createElement("li");
    answer.classList.add("chatbot__chat");
    answer.classList.add("incoming");

    paragraphTag.innerHTML =
      "Something went wrong. Please try again later";
    chatHistory.pop();
    answer.appendChild(paragraphTag);
    chatBox.appendChild(answer);
    scrollChatBoxToBottom(chatBox, answer);
    console.error(error);
  }
}

function scrollChatBoxToBottom(chatBox, answer) {
  var answerPosition = answer.offsetTop - 100;
  chatBox.scrollTop = answerPosition;
}
