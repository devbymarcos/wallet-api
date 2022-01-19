import messageView from "./messageView.js";
export default function initGetExtract() {
    const form = document.getElementById("extract");
    const btnform = document.getElementById("extractBtn");

    if (form) {
        function get(e) {
            e.preventDefault();

            const data = new FormData(form);
            console.log(data.get("wallet"));
            if (!data.get("date1")) {
                messageView("falta preencher a data inicial", "error");
                return;
            }
            if (!data.get("date2")) {
                messageView("falta preencher a data Final", "error");
                return;
            }
            if (!data.get("wallet")) {
                messageView("Escolha uma carteira", "error");
                return;
            }

            const dataInit = {
                method: "POST",
                body: data,
            };

            fetch("/extrato-filter", dataInit)
                .then((r) => {
                    return r.json();
                })
                .then((data) => {
                    console.log(data);
                });
        }

        btnform.addEventListener("click", get);
    }
}
