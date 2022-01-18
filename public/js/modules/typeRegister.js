export function colorRegister() {
    const data = document.querySelectorAll("[data-register='expense']");

    data.forEach((item) => {
        item.style.color = "red";
    });
}
