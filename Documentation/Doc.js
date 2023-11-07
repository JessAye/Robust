const panelButton = document.getElementById('panel-button');
const sidePanel = document.getElementById('side-panel');
const currentYear = new Date().getFullYear();
const backToTopBtn = document.getElementById("backToTopBtn");

document.getElementById('current-year').textContent = currentYear; // Get the current year to display in the footer

function loadPDF(pdfURL) {
    const pdfContainer = document.getElementById('pdf-container');
    pdfContainer.innerHTML = `<iframe src="${pdfURL}" width="100%" height="500"></iframe>`;
}

panelButton.addEventListener('click', () => {
    if (sidePanel.classList.contains('collapsed')) {
        sidePanel.classList.remove('collapsed');
        sidePanel.classList.add('expanded');
    } else {
        sidePanel.classList.remove('expanded');
        sidePanel.classList.add('collapsed');
    }
});