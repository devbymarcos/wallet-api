export default function initUserLogin() {
    const checkbox = document.querySelector("[data-form] input[type=checkbox]");
    const inputUser = document.querySelector("[data-form] input[name=email]");
    let user = localStorage.getItem("login");
    let userObj = JSON.parse(user);

    if (inputUser != undefined && userObj != undefined) {
        inputUser.value = userObj.email;
        checkbox.checked = true;
    }
}
