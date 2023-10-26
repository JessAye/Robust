const sidePanel = document.getElementById('side-panel');
const panelWidth = 250; // Adjust this value as needed
const openThreshold = 20; // Adjust this value as needed

document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;

    if (mouseX <= openThreshold) {
        sidePanel.style.left = '0';
    } else if (mouseX >= panelWidth) {
        sidePanel.style.left = `-${panelWidth}px`;
    }
});

// Initially, set the panel to be hidden
sidePanel.style.left = `-${panelWidth}px`;
