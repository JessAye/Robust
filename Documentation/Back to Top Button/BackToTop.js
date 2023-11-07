// Reference to the button
const backToTopBtn = document.getElementById("backToTopBtn");

// Function to check if the page is scrolled and show/hide the button
function toggleBackToTopButton() {
    if (window.scrollY > 100) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
}

// Function to scroll back to the top of the page
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth" // You can use "auto" for instant scrolling
    });
}

// Attach event listeners
window.addEventListener("scroll", toggleBackToTopButton);
backToTopBtn.addEventListener("click", scrollToTop);
