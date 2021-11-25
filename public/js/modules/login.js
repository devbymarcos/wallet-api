export default function initLogin() {
    const form = document.querySelector("[data-form]");
    const btnForm = document.querySelector("[data-submit]");
    const load = document.querySelector(".ajax_load");
    const divMessage = document.querySelector(".alert");

    let dataForm = "";

    function sendForm(e) {
        e.preventDefault();
        const router = form.getAttribute("action");
        dataForm = new FormData(form);
        let dados = { email: dataForm.get("email"), remember: true };

        //lembrar user no storage
        if (dataForm.get("remember")) {
            localStorage.setItem("login", JSON.stringify(dados));
        } else {
            localStorage.removeItem("login");
        }

        // fazer a requisição fetch
        load.classList.add("ajax_load_flex");
        fetch(router, {
            method: "POST",
            body: dataForm,
        })
            .then((response) => {
                load.classList.remove("ajax_load_flex");
                return response.json();
            })
            .then((data) => {
                if (data.redirect) {
                    window.location.href = data.redirect;
                    return;
                } else {
                    messageView(data.message, data.type);
                }
            });
    }

    function messageView(msg, type) {
        let message = document.createElement("div");
        message.classList.add("message_login", type);
        message.innerText = msg;
        divMessage.appendChild(message);

        setTimeout(() => {
            message.style.display = "none";
        }, 3000);
    }
    if (btnForm) {
        btnForm.addEventListener("click", sendForm);
    }
}
