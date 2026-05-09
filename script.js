const canvas = document.querySelector("#liquid-canvas");
const context = canvas.getContext("2d");

let width = 0;
let height = 0;
let frame = 0;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function drawLiquidShape(time) {
  const centerX = width / 2;
  const centerY = height * 0.42;
  const radius = Math.min(width, height) * 0.33;
  const points = 150;

  context.clearRect(0, 0, width, height);

  const backdrop = context.createLinearGradient(0, 0, 0, height);
  backdrop.addColorStop(0, "#020202");
  backdrop.addColorStop(0.6, "#171717");
  backdrop.addColorStop(1, "#050505");
  context.fillStyle = backdrop;
  context.fillRect(0, 0, width, height);

  context.save();
  context.beginPath();
  for (let index = 0; index <= points; index += 1) {
    const angle = (Math.PI * 2 * index) / points;
    const wave =
      Math.sin(angle * 3 + time * 0.0011) * 0.1 +
      Math.cos(angle * 5 - time * 0.0008) * 0.06 +
      Math.sin(angle * 9 + time * 0.00045) * 0.035;
    const x = centerX + Math.cos(angle) * radius * (1 + wave) * 1.62;
    const y = centerY + Math.sin(angle) * radius * (1 + wave) * 0.82;
    if (index === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  }
  context.closePath();

  const fill = context.createRadialGradient(centerX * 0.84, centerY * 0.58, 30, centerX, centerY, radius * 1.8);
  fill.addColorStop(0, "rgba(255,255,255,0.16)");
  fill.addColorStop(0.22, "rgba(60,60,66,0.54)");
  fill.addColorStop(0.58, "rgba(10,10,12,0.78)");
  fill.addColorStop(1, "rgba(0,0,0,0.1)");
  context.fillStyle = fill;
  context.fill();

  context.lineWidth = 1.2;
  context.strokeStyle = "rgba(255,255,255,0.1)";
  context.stroke();

  context.globalCompositeOperation = "screen";
  context.lineWidth = 16;
  context.strokeStyle = "rgba(255,255,255,0.07)";
  for (let strip = 0; strip < 5; strip += 1) {
    context.beginPath();
    for (let index = 0; index <= points; index += 1) {
      const angle = (Math.PI * 2 * index) / points;
      const offset = Math.sin(angle * 4 + time * 0.001 + strip) * radius * 0.06;
      const x = centerX + Math.cos(angle) * (radius * (1.05 + strip * 0.03) + offset) * 1.36;
      const y = centerY + Math.sin(angle) * (radius * (0.56 + strip * 0.02) + offset) + strip * 14;
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    }
    context.stroke();
  }

  context.globalCompositeOperation = "source-over";
  context.restore();

  frame = requestAnimationFrame(drawLiquidShape);
}

resizeCanvas();
drawLiquidShape(0);
window.addEventListener("resize", resizeCanvas);
window.addEventListener("beforeunload", () => cancelAnimationFrame(frame));


// Premium hover spotlight + scroll reveal
document.addEventListener("DOMContentLoaded", () => {
  const hoverCards = document.querySelectorAll(".reel-card, .motion-card, .portfolio-card, .work-card, .video-card");

  hoverCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    });
  });

  const revealItems = document.querySelectorAll(".reel-card, .motion-card, .portfolio-card, .work-card, .video-card, .price-card, section h2, section p");
  revealItems.forEach((el) => el.classList.add("reveal-on-scroll"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index * 35, 280)}ms`;
    observer.observe(el);
  });
});
