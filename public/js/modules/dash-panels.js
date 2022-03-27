export default function initPanels() {
    const balance = document.querySelector("[data-balance]");
    const received = document.querySelector("[data-received]");
    const paid = document.querySelector("[data-paid]");
    const wallet = document.getElementById("wallet-panels");
    let walletValue = "";

    if (balance) {
        walletValue = new FormData(wallet);

        fetch("/panels", {
            method: "POST",
            body: walletValue,
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (!data.balance) {
                    balance.innerHTML = "R$ 0,00";
                } else {
                    balance.innerHTML = data.balance.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                    });
                }
                if (!data.received) {
                    received.innerHTML = "R$ 0,00";
                } else {
                    received.innerHTML = data.received.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                    });
                }
                if (!data.paid) {
                    paid.innerHTML = "R$ 0,00";
                } else {
                    paid.innerHTML = data.paid.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                    });
                }
            });
    }
}
