export function colorRegister() {
    const data = document.querySelectorAll("[data-register='expense']");

    data.forEach((item) => {
        item.style.color = "red";
    });
}

export function sumInvestment() {
    const dataIncome = document.querySelectorAll("[data-register='income']");
    const dataExpense = document.querySelectorAll("[data-register='expense']");
    const total = document.querySelector("[data-result]");
    let resultIncome = 0;
    let resultExpense = 0;

    dataIncome.forEach((item) => {
        let value = item.innerText.replace("R$", "");
        let valueN = value.replace(".", "");
        resultIncome += parseFloat(valueN.replace(",", "."));
    });

    dataExpense.forEach((item) => {
        let value = item.innerText.replace("R$", "");
        let valueN = value.replace(".", "");
        resultExpense += parseFloat(valueN.replace(",", "."));
    });

    const subTotal = resultIncome - resultExpense;

    if (total)
        total.innerText = subTotal.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
        });
    console.log(resultExpense);
}
