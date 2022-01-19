import initPanels from "./dash-panels.js";
import initChart from "./highchart.js";

export default function initChooseWallet() {
    const select = document.querySelector("#wallet-panels select");
    if (select) {
        function updatepanels() {
            initPanels();
            initChart();
        }

        select.addEventListener("change", updatepanels);
    }
}
