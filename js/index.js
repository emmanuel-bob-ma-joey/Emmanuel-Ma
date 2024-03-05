document.getElementById("toggleButton").addEventListener("click", function () {
  var sidebar = document.getElementById("sidebar");
  if (sidebar.style.width === "250px") {
    sidebar.style.width = "0"; // Close sidebar
  } else {
    sidebar.style.width = "250px"; // Open sidebar
  }
});
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

anime({
  targets: ".animate-me",
  opacity: [0, 1], // Fade in from opacity 0 to 1
  translateY: [100, 0], // Move from 100px below to original position
  easing: "easeOutExpo", // Use an exponential easing function for a smooth effect
  duration: 1500, // Animation duration in milliseconds
  delay: anime.stagger(200), // Delay each <p> animation by 200ms
});
