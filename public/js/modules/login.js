export default function initLogin() {
    const form = document.querySelector("[data-form]");
    const btnForm = document.querySelector("[data-submit]");
    const load = document.querySelector(".ajax_load");
    const router = form.getAttribute("action");

    let dataForm = "";

    function sendForm(e) {
        e.preventDefault();

        dataForm = new FormData(form);
        let dados = { email: dataForm.get("email"), remember: true };

        //lembrar user no storage
        if (dataForm.get("remember")) {
            localStorage.setItem("login", JSON.stringify(dados));
        } else {
            localStorage.removeItem("login");
        }

        // fazer a requisição fetch
        fetch(router, {
            method: "POST",
            body: dataForm,
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                //window.location.href = data.redirect;
                console.log(data);
            });
    }

    if (form) {
        btnForm.addEventListener("click", sendForm);
    }
}
