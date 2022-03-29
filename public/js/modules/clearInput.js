export const clearInput = () => {
    const input = document.querySelectorAll("input");
    const select = document.querySelectorAll("select");

    input.forEach((item) => {
        item.value = "";
    });
    select.forEach((item) => {
        item.value = "";
    });
};
