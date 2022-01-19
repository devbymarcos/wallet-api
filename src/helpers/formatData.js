export function format(data) {
    let dataArr = [];
    data.forEach((item) => {
        //formata data
        let dateArr2 = item.due_at.split("-");
        let [year, month, day] = dateArr2.map(Number);

        let date = new Date(year, month - 1, day);
        let dateFormat =
            date.getDate() +
            "/" +
            (date.getMonth() + 1) +
            "/" +
            date.getFullYear();

        let price = item.price.toLocaleString("pt-br", {
            style: "currency",
            currency: "BRL",
        });
        //formata status
        let statusPay = "";
        if (item.pay === "paid") {
            statusPay = true;
        } else {
            statusPay = false;
        }

        let router = "";
        if (item.type === "expense") {
            router = "despesa-edit";
        } else {
            router = "receita-edit";
        }
        //cria novo objeto com dados formatado
        dataArr.push({
            id: item.id,
            date: dateFormat,
            description: item.description,
            status: statusPay,
            value: price,
            type: item.type,
            router,
        });
    });
    return dataArr;
}
