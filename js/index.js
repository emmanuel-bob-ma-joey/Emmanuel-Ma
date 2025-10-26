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

// Strava Widget Functionality
document.addEventListener("DOMContentLoaded", () => {
  const timeButtons = document.querySelectorAll(".time-btn");
  const stravaWidget = document.querySelector(".strava-summary-widget");

  if (!stravaWidget) return;

  // Time period toggle functionality
  timeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      timeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const period = btn.dataset.period;
      loadStravaData(period);
    });
  });

  // Load initial data (week)
  loadStravaData("week");
});

async function loadStravaData(period) {
  try {
    console.log("Loading Strava data for period:", period);

    // Show loading state
    showStravaLoading();

    // Determine the API URL based on environment
    const apiUrl =
      window.location.hostname === "localhost"
        ? "http://localhost:3000/strava-api"
        : "https://emmanuelma.com/strava-api";

    if (period === "bestefforts") {
      // Load best efforts data
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: "athlete/activities",
          period: "all", // Get all activities for PB calculation
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);

        if (response.status === 401) {
          console.log("401 error - invalid or missing Strava tokens");
          showStravaError();
          return;
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const activities = await response.json();
      console.log("Received activities for PB calculation:", activities.length);

      const processedData = processBestEffortsData(activities);
      console.log("Processed best efforts data:", processedData);

      updateStravaWidget(processedData);
    } else {
      // Load regular period data
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          endpoint: "athlete/activities",
          period: period,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);

        if (response.status === 401) {
          console.log("401 error - invalid or missing Strava tokens");
          showStravaError();
          return;
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const activities = await response.json();
      console.log("Received activities:", activities.length);
      console.log("First activity:", activities[0]);

      const processedData = processStravaData(activities, period);
      console.log("Processed data:", processedData);

      updateStravaWidget(processedData);
    }
  } catch (error) {
    console.error("Error loading Strava data:", error);
    showStravaError();
  }
}

function updateStravaWidget(data) {
  console.log("Updating Strava widget with data:", data);

  if (data.isBestEfforts) {
    // Update header for best efforts
    document.querySelector(".strava-header h3").textContent =
      "Personal Records";

    // Hide stats cards for best efforts (not applicable)
    document.querySelector(".strava-stats").style.display = "none";

    // Update activities list with PB format
    const activitiesList = document.getElementById("activities-list");
    activitiesList.innerHTML = "";

    console.log("Adding PBs to list:", data.activities.length);

    data.activities.forEach((pb) => {
      const pbElement = document.createElement("div");
      pbElement.className = "activity-item";
      pbElement.innerHTML = `
        <div class="activity-name">${pb.distance}</div>
        <div class="activity-stats">${pb.time} • ${pb.pace} • ${pb.date}</div>
      `;
      activitiesList.appendChild(pbElement);
    });
  } else {
    // Regular stats display
    document.querySelector(".strava-header h3").textContent =
      "Recent Activity Summary";
    document.querySelector(".strava-stats").style.display = "grid";

    // Update stats
    document.getElementById("total-activities").textContent =
      data.totalActivities;
    document.getElementById("total-distance").textContent =
      data.totalDistance.toFixed(1);
    document.getElementById("total-time").textContent = data.totalTime;
    document.getElementById("total-pace").textContent = data.avgPace;

    // Update activities list
    const activitiesList = document.getElementById("activities-list");
    activitiesList.innerHTML = "";

    console.log("Adding activities to list:", data.activities.length);

    data.activities.forEach((activity) => {
      const activityElement = document.createElement("div");
      activityElement.className = "activity-item";
      activityElement.innerHTML = `
        <div class="activity-name">${activity.name}</div>
        <div class="activity-stats">${activity.distance} • ${activity.time} • ${activity.pace}</div>
      `;
      activitiesList.appendChild(activityElement);
    });
  }

  console.log("Strava widget updated successfully");
}

function processBestEffortsData(activities) {
  console.log("Processing best efforts from activities:", activities.length);

  // Filter runs only
  const runs = activities.filter((activity) => activity.type === "Run");
  console.log("Runs found for PB calculation:", runs.length);

  // Define target distances in meters
  const targetDistances = [
    { name: "5K", distance: 5000 },
    { name: "10K", distance: 10000 },
    { name: "Half Marathon", distance: 21100 },
    { name: "Marathon", distance: 42195 },
  ];

  const bestEfforts = [];

  targetDistances.forEach((target) => {
    let bestTime = null;
    let bestActivity = null;

    runs.forEach((activity) => {
      const activityDistance = activity.distance;
      const activityTime = activity.moving_time;

      // Check if this activity is close to the target distance (±5% tolerance)
      const tolerance = target.distance * 0.05;
      if (Math.abs(activityDistance - target.distance) <= tolerance) {
        if (!bestTime || activityTime < bestTime) {
          bestTime = activityTime;
          bestActivity = activity;
        }
      }
    });

    if (bestActivity) {
      const paceMinutes = bestTime / 60 / (bestActivity.distance / 1000);
      const paceFormatted = `${Math.floor(paceMinutes)}:${Math.floor(
        (paceMinutes % 1) * 60
      )
        .toString()
        .padStart(2, "0")}/km`;

      bestEfforts.push({
        distance: target.name,
        time: formatActivityTime(bestTime),
        pace: paceFormatted,
        date: new Date(bestActivity.start_date).toLocaleDateString(),
        activityName: bestActivity.name,
      });
    }
  });

  return {
    totalActivities: bestEfforts.length,
    totalDistance: 0, // Not applicable for PBs
    totalTime: "0m", // Not applicable for PBs
    avgPace: "0:00/km", // Not applicable for PBs
    activities: bestEfforts,
    isBestEfforts: true,
  };
}

function processStravaData(activities, period) {
  console.log("Processing activities:", activities.length);

  // Filter activities by type (runs for now)
  const runs = activities.filter((activity) => activity.type === "Run");
  console.log("Runs found:", runs.length);

  // Calculate totals
  const totalActivities = runs.length;
  const totalDistance = runs.reduce(
    (sum, activity) => sum + activity.distance / 1000,
    0
  );
  const totalTime = runs.reduce(
    (sum, activity) => sum + activity.moving_time,
    0
  );
  const totalElevation = runs.reduce(
    (sum, activity) => sum + activity.total_elevation_gain,
    0
  );

  // Calculate average pace (minutes per kilometer)
  const totalDistanceKm = totalDistance;
  const totalTimeMinutes = totalTime / 60;
  const avgPaceMinutes =
    totalDistanceKm > 0 ? totalTimeMinutes / totalDistanceKm : 0;
  const avgPaceFormatted =
    avgPaceMinutes > 0
      ? `${Math.floor(avgPaceMinutes)}:${Math.floor((avgPaceMinutes % 1) * 60)
          .toString()
          .padStart(2, "0")}/km`
      : "0:00/km";

  // Format time
  const hours = Math.floor(totalTime / 3600);
  const minutes = Math.floor((totalTime % 3600) / 60);
  const formattedTime = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  // Format recent activities
  const recentActivities = runs.slice(0, 5).map((activity) => {
    const distanceKm = activity.distance / 1000;
    const timeMinutes = activity.moving_time / 60;
    const paceMinutes = distanceKm > 0 ? timeMinutes / distanceKm : 0;
    const paceFormatted =
      paceMinutes > 0
        ? `${Math.floor(paceMinutes)}:${Math.floor((paceMinutes % 1) * 60)
            .toString()
            .padStart(2, "0")}/km`
        : "0:00/km";

    return {
      name: activity.name,
      distance: `${distanceKm.toFixed(1)} km`,
      time: formatActivityTime(activity.moving_time),
      pace: paceFormatted,
      type: activity.type,
    };
  });

  const result = {
    totalActivities,
    totalDistance,
    totalTime: formattedTime,
    avgPace: avgPaceFormatted,
    activities: recentActivities,
  };

  console.log("Processed result:", result);
  return result;
}

function formatActivityTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function showStravaLoading() {
  // Hide stats temporarily
  const statsCards = document.querySelectorAll(".stat-number");
  statsCards.forEach((card) => {
    card.textContent = "-";
  });

  // Show loading in activities list
  const activitiesList = document.getElementById("activities-list");
  activitiesList.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>Loading activities...</p>
    </div>
  `;
}

function showStravaError() {
  const activitiesList = document.getElementById("activities-list");
  activitiesList.innerHTML =
    '<div class="loading">Unable to load activities</div>';
}
