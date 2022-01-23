import messageView from "./messageView.js";
import * as Load from "./load.js";
export default function initGetExtract() {
    const form = document.getElementById("extract");
    const btnform = document.getElementById("extractBtn");
    const tbody = document.getElementById("tbody");
    const totalExtract = document.getElementById("totalExtract");

    if (form) {
        function get(e) {
            e.preventDefault();

            const data = new FormData(form);

            if (!data.get("date1")) {
                messageView("Falta preencher a data inicial", "error");
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
            Load.loadInit();
            fetch("/extrato-filter", dataInit)
                .then((r) => {
                    Load.loadfinish();
                    return r.json();
                })
                .then((data) => {
                    tbody.innerHTML = "";
                    totalExtract.innerHTML = "";
                    let bodyTable = "";
                    let statusPay = "";
                    data.result.forEach((item) => {
                        if (item.status === true) {
                            statusPay = ` <p data-pay="unpaid" 
                                            data-type="expense" 
                                            data-idpay="${item.id}"
                                            class="pay-action"> 
                                                <i class="fas fa-check-circle"></i>
                                          </p>`;
                        } else {
                            statusPay = ` <p data-pay="paid" 
                                            data-type="expense" 
                                            data-idpay="${item.id}"
                                            class="pay-action"> 
                                                <i class="fas fa-times-circle"></i>
                                        </p>`;
                        }

                        bodyTable += `<tr>
                                        <td>${item.date}</td>
                                        <td>${item.description}</td>
                                        <td ${
                                            item.type == "expense"
                                                ? "style='color:red'"
                                                : ""
                                        }>${item.value}</td>
                                        <td>${statusPay}</td>
                                        <td>
                                            <a href="/${item.router}?id=${
                            item.id
                        }">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                        </td>
                                    </tr>`;
                    });
                    tbody.innerHTML = bodyTable;
                    totalExtract.innerHTML = data.total.toLocaleString(
                        "pt-br",
                        {
                            style: "currency",
                            currency: "BRL",
                        }
                    );
                    if (data.total < 0) {
                        totalExtract.style.color = "red";
                    } else {
                        totalExtract.style.color = "blue";
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        btnform.addEventListener("click", get);
    }
}
