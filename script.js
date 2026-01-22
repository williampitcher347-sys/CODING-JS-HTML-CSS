/* ================= FIREBASE ================= */

const firebaseConfig = {
  apiKey: "AIzaSyCtgD_PlrPHwtdMnKVK8fSRnH6BGzag9aA",
  authDomain: "multiplayer-fa20e.firebaseapp.com",
  databaseURL: "https://multiplayer-fa20e-default-rtdb.firebaseio.com",
  projectId: "multiplayer-fa20e",
  storageBucket: "multiplayer-fa20e.appspot.com",
  messagingSenderId: "693674994683",
  appId: "1:693674994683:web:f65b2f698bbe5ca413795e"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let roomRef = null;
let syncing = false;

/* ================= MULTIPLAYER ================= */

function joinRoom() {
  const roomId = document.getElementById("room").value;
  if (!roomId) {
    alert("Enter a room ID");
    return;
  }

  roomRef = db.ref("rooms/" + roomId);

  roomRef.on("value", snapshot => {
    const data = snapshot.val();
    if (!data || syncing) return;

    htmlCode.value = data.html || "";
    cssCode.value = data.css || "";
    jsCode.value = data.js || "";
  });

  alert("Joined room: " + roomId);
}

function syncCode() {
  if (!roomRef) return;

  syncing = true;
  roomRef.set({
    html: htmlCode.value,
    css: cssCode.value,
    js: jsCode.value
  });
  syncing = false;
}

["htmlCode", "cssCode", "jsCode"].forEach(id => {
  document.getElementById(id).addEventListener("input", syncCode);
});

/* ================= RUN CODE ================= */

function runCode() {
  consoleBox.textContent = "";

  const html = htmlCode.value;
  const css = `<style>${cssCode.value}</style>`;
  const js = `
    <script>
      console.log = (...a) => parent.logToConsole(a.join(" "));
      ${jsCode.value}
    <\/script>
  `;

  output.srcdoc = html + css + js;
}

function logToConsole(msg) {
  consoleBox.textContent += msg + "\n";
}

/* ================= FULLSCREEN ================= */

function toggleFullscreen() {
  const el = document.getElementById("editor");
  if (!document.fullscreenElement) {
    el.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

/* ================= STARFIELD ================= */

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
window.onresize = resize;

const stars = Array.from({ length: 120 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 2
}));

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#00ffff";

  stars.forEach(s => {
    s.y += 0.4;
    if (s.y > canvas.height) s.y = 0;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

animate();

/* ================= DOM SHORTCUTS ================= */
const htmlCode = document.getElementById("htmlCode");
const cssCode = document.getElementById("cssCode");
const jsCode = document.getElementById("jsCode");
const output = document.getElementById("output");
const consoleBox = document.getElementById("console");
