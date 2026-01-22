// ===== RUN CODE =====
function runCode() {
  const html = htmlCode.value;
  const css = `<style>${cssCode.value}</style>`;
  const js = `
    <script>
      const consoleLog = [];
      console.log = (...args) => parent.logToConsole(args.join(" "));
      ${jsCode.value}
    <\/script>
  `;

  output.srcdoc = html + css + js;
}

// ===== CONSOLE =====
function logToConsole(msg) {
  console.textContent += msg + "\n";
}

// ===== SAVE / LOAD =====
function saveCode() {
  localStorage.setItem("html", htmlCode.value);
  localStorage.setItem("css", cssCode.value);
  localStorage.setItem("js", jsCode.value);
  alert("Code saved!");
}

function loadCode() {
  htmlCode.value = localStorage.getItem("html") || "";
  cssCode.value = localStorage.getItem("css") || "";
  jsCode.value = localStorage.getItem("js") || "";
}

loadCode();

// ===== THEME SWITCH =====
function toggleTheme() {
  document.body.classList.toggle("space");
}

// ===== STARFIELD =====
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const stars = Array.from({ length: 120 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2
}));

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ffff";

  stars.forEach(s => {
    s.y += 0.3;
    if (s.y > canvas.height) s.y = 0;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animateStars);
}

animateStars();

window.addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
});
