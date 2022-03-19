export default function initMenuMobile() {
    const btnSidebar = document.querySelector('[data-btn="sidebar"]');
    const appContent = document.querySelector('[data-app="content"]');
    const sideBar = document.querySelector("[data-sidebar]");

    if (btnSidebar) {
        function openSidebar() {
            appContent.classList.toggle("active");
            sideBar.classList.toggle("active");
        }

        btnSidebar.addEventListener("click", openSidebar);
    }
}
