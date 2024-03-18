// anime({
//   targets: ".animate-me",
//   opacity: [0, 1], // Fade in from opacity 0 to 1
//   translateY: [100, 0], // Move from 100px below to original position
//   easing: "easeOutElastic", // Use an exponential easing function for a smooth effect
//   duration: 1500, // Animation duration in milliseconds
//   delay: anime.stagger(200), // Delay each <p> animation by 200ms
// });
anime({
  targets: "#navbar",
  translateY: [-200, 0], // Start from -200px to 0px

  easing: "easeOutElastic",
  elasticity: 500,
  duration: 1500, // Adjust duration as needed
});

document.addEventListener("DOMContentLoaded", () => {
  // Define the callback function
  const animateOnScroll = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        anime({
          targets: entry.target,
          opacity: [0, 1],
          translateY: [100, 0],
          easing: "easeOutElastic",
          duration: 1500,
          //   duration: 1500, // Animation duration in milliseconds
          delay: anime.stagger(200), // Delay each <p> animation by 200ms
        });
        // Optional: Unobserve the element after animating
        observer.unobserve(entry.target);
      }
    });
  };

  // Create the observer
  const observer = new IntersectionObserver(animateOnScroll, {
    root: null, // Use the viewport as the root
    rootMargin: "0px",
    threshold: 0.5, // Adjust if needed
  });

  // Observe elements with the class 'animate-me'
  document.querySelectorAll(".animate-me").forEach((el) => {
    observer.observe(el);
  });
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
        delay: anime.stagger(200), // Delay each <p> animation by 200ms
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

// document.addEventListener('DOMContentLoaded', () => {
//     // Function to check if an element is in the viewport
//     function isInViewport(element) {
//       const rect = element.getBoundingClientRect();
//       return (
//         rect.top >= 0 &&
//         rect.left >= 0 &&
//         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
//         rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//       );
//     }

// Function to animate elements
//     function animateElements() {
//       const timelineItems = document.querySelectorAll('.timeline ul li:not(.hide)');

//       timelineItems.forEach((item) => {
//         if (isInViewport(item) && !item.classList.contains('animated')) {
//           anime({
//             targets: item,
//             opacity: [0, 1],
//             translateY: [50, 0], // Adjust for desired "slide" effect
//             easing: 'easeOutExpo',
//             duration: 800,
//             begin: function() {
//               item.classList.add('animated'); // Mark as animated
//             }
//           });
//         }
//       });
//     }

//     // Listen for scroll events
//     window.addEventListener('scroll', animateElements);

//     // Initial check in case elements are already in view on load
//     animateElements();
//   });

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".minimal-navbar a");

  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", (e) => {
      anime({
        targets: e.target,
        backgroundColor: "#f08c27", // Target background color on hover
        duration: 300, // Duration of the animation
        easing: "linear", // Easing function
      });
    });

    link.addEventListener("mouseleave", (e) => {
      anime({
        targets: e.target,
        backgroundColor: "#fff", // Revert to original background color
        duration: 300, // Duration of the animation
        easing: "linear", // Easing function
      });
    });
  });
});

fetch("http://localhost:3000/spotify-api", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    endpoint: "me/tracks",
    accessToken: "dummy", // Ideally, this should be obtained securely through OAuth flow
  }),
}).then((response) => response.json());
// .then((data) => {
//   console.log(data); // Process and display your data here
//   const tracksContainer = document.getElementById("tracks");
//   data.items.forEach((item) => {
//     const trackElement = document.createElement("div");
//     trackElement.textContent = `${item.track.name} by ${item.track.artists
//       .map((artist) => artist.name)
//       .join(", ")}`;
//     tracksContainer.appendChild(trackElement);
//   });
// });
