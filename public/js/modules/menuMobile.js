export default function initMenuMobile() {
    const btnSidebar = document.querySelector('[data-btn="sidebar"]');
    const appContent = document.querySelector('[data-app="content"]');
    const sideBar = document.querySelector("[data-sidebar]");
    const spanEfect = document.querySelector('[data-btn="sidebar"] span');

    function openSidebar() {
        appContent.classList.toggle("active");
        sideBar.classList.toggle("active");
        spanEfect.classList.toggle("active");
    }

    btnSidebar.addEventListener("click", openSidebar);
}
