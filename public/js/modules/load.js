export function loadInit() {
    const load = document.querySelector(".ajax_load");
    load.classList.add("ajax_load_flex");
}
export function loadfinish() {
    const load = document.querySelector(".ajax_load");
    load.classList.remove("ajax_load_flex");
}
