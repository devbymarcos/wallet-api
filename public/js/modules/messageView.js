export default function messageView(msg, type) {
    const divMessage = document.querySelector(".alert");

    let message = document.createElement("div");
    message.classList.add("messageView", type);
    message.innerText = msg;
    divMessage.appendChild(message);

    setTimeout(() => {
        message.style.display = "none";
    }, 3000);
}
