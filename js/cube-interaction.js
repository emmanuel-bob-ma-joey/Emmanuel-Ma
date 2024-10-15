let cube = document.querySelector(".outer-cube");
let isHovering = false;
let previousMousePosition = {
  x: 0,
  y: 0,
};
let rotationSpeed = 0.5;
let currentRotation = { x: 0, y: 0 };
let autoRotationSpeed = { x: 0.5, y: 0.3 };
let lastTime = 0;
let isAutoRotating = true;
let momentum = { x: 0, y: 0 };
let isAnimating = false;

function animate(time) {
  if (lastTime != 0) {
    const deltaTime = time - lastTime;
    if (isAutoRotating && !isHovering && !isAnimating) {
      currentRotation.x += autoRotationSpeed.x * (deltaTime / 16);
      currentRotation.y += autoRotationSpeed.y * (deltaTime / 16);
      updateCubeRotation();
    }
  }
  lastTime = time;
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

cube.addEventListener("mouseenter", (e) => {
  isHovering = true;
  isAutoRotating = false;
  const rect = cube.getBoundingClientRect();
  previousMousePosition = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
});

cube.addEventListener("mouseleave", () => {
  isHovering = false;
  isAnimating = true;
  applyMomentum();
});

cube.addEventListener("mousemove", (e) => {
  if (!isHovering) return;

  const rect = cube.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const deltaMove = {
    x: x - previousMousePosition.x,
    y: y - previousMousePosition.y,
  };

  currentRotation.x -= deltaMove.y * rotationSpeed;
  currentRotation.y += deltaMove.x * rotationSpeed;

  momentum = {
    x: deltaMove.x * rotationSpeed * 0.05,
    y: -deltaMove.y * rotationSpeed * 0.05,
  };

  updateCubeRotation();

  previousMousePosition = { x, y };
});

function applyMomentum() {
  if (!isAnimating) return;

  currentRotation.x += momentum.y;
  currentRotation.y += momentum.x;

  momentum.x *= 0.95;
  momentum.y *= 0.95;

  updateCubeRotation();

  if (Math.abs(momentum.x) > 0.01 || Math.abs(momentum.y) > 0.01) {
    requestAnimationFrame(applyMomentum);
  } else {
    isAnimating = false;
    isAutoRotating = true; // Resume auto-rotation after momentum ends
  }
}

function updateCubeRotation() {
  cube.style.transform = `rotateX(${currentRotation.x}deg) rotateY(${currentRotation.y}deg)`;
}

// Initialize cube position
updateCubeRotation();

// Add touch support
cube.addEventListener("touchstart", (e) => {
  isHovering = true;
  isAutoRotating = false;
  const touch = e.touches[0];
  const rect = cube.getBoundingClientRect();
  previousMousePosition = {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
});

document.addEventListener("touchmove", (e) => {
  if (!isHovering) return;

  const touch = e.touches[0];
  const rect = cube.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;

  const deltaMove = {
    x: x - previousMousePosition.x,
    y: y - previousMousePosition.y,
  };

  currentRotation.x -= deltaMove.y * rotationSpeed;
  currentRotation.y += deltaMove.x * rotationSpeed;

  momentum = {
    x: deltaMove.x * rotationSpeed * 0.05,
    y: -deltaMove.y * rotationSpeed * 0.05,
  };

  updateCubeRotation();

  previousMousePosition = { x, y };
});

document.addEventListener("touchend", () => {
  isHovering = false;
  isAnimating = true;
  applyMomentum();
});
