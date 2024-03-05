anime({
  targets: ".animate-me",
  opacity: [0, 1], // Fade in from opacity 0 to 1
  translateY: [100, 0], // Move from 100px below to original position
  easing: "easeOutElastic", // Use an exponential easing function for a smooth effect
  duration: 1500, // Animation duration in milliseconds
  delay: anime.stagger(200), // Delay each <p> animation by 200ms
});
anime({
  targets: "#navbar",
  translateY: [-200, 0], // Start from -200px to 0px

  easing: "easeOutElastic",
  elasticity: 500,
  duration: 1500, // Adjust duration as needed
});

document.addEventListener("DOMContentLoaded", () => {
  const aboutSection = document.querySelector("#about");
  const aboutElements = aboutSection.querySelectorAll(".animate-me");

  window.addEventListener("scroll", () => {
    const sectionBottom = aboutSection.getBoundingClientRect().bottom;

    // Calculate opacity based on how much of the section is visible
    let opacity = 1;
    if (sectionBottom < window.innerHeight) {
      opacity = sectionBottom / window.innerHeight;
    }

    // Apply the opacity to elements in the About section
    aboutElements.forEach((el) => {
      anime({
        targets: el,
        opacity: opacity,
        easing: "linear",
        duration: 1, // Apply changes instantly
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Select all navbar links
  const navLinks = document.querySelectorAll('#navbar a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent the default anchor link behavior
      const targetId = this.getAttribute("href"); // Get the href attribute
      const targetSection = document.querySelector(targetId); // Select the target section

      if (targetSection) {
        // Scroll to the target section smoothly
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});
