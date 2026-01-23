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

/* ================= DOM ================= */

const htmlCode = document.getElementById("htmlCode");
const cssCode = document.getElementById("cssCode");
const jsCode = document.getElementById("jsCode");
const output = document.getElementById("output");
const consoleBox = document.getElementById("console");

/* ================= MULTIPLAYER ================= */

function joinRoom() {
  const roomId = room.value;
  if (!roomId) return alert("Enter room ID");

  roomRef = db.ref("rooms/" + roomId);

  roomRef.on("value", snap => {
    if (!snap.val() || syncing) return;
    htmlCode.value = snap.val().html || "";
    cssCode.value = snap.val().css || "";
    jsCode.value = snap.val().js || "";
  });

  alert("Joined room " + roomId);
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

[htmlCode, cssCode, jsCode].forEach(el =>
  el.addEventListener("input", syncCode)
);

/* ================= RUN ================= */

function runCode() {
  consoleBox.textContent = "";
  output.srcdoc =
    htmlCode.value +
    `<style>${cssCode.value}</style>` +
    `<script>
      console.log = (...a)=>parent.logToConsole(a.join(" "));
      ${jsCode.value}
    <\/script>`;
}

function logToConsole(msg) {
  consoleBox.textContent += msg + "\n";
}

/* ================= LOCAL SAVE ================= */

function saveLocal() {
  localStorage.setItem("html", htmlCode.value);
  localStorage.setItem("css", cssCode.value);
  localStorage.setItem("js", jsCode.value);
  alert("Saved 🚀");
}

function loadLocal() {
  htmlCode.value = localStorage.getItem("html") || "";
  cssCode.value = localStorage.getItem("css") || "";
  jsCode.value = localStorage.getItem("js") || "";
}

/* ================= FULLSCREEN ================= */

function toggleFullscreen() {
  const el = document.getElementById("editor");
  document.fullscreenElement ? document.exitFullscreen() : el.requestFullscreen();
}

/* ================= CHAT ================= */

const CHAT_API = "https://696fdb3ca06046ce61880d4c.mockapi.io/Galaxia-messages";
const messagesDiv = document.getElementById("messages");

async function loadMessages() {
  const res = await fetch(CHAT_API);
  const data = await res.json();
  messagesDiv.innerHTML = "";
  data.slice(-50).forEach(m => {
    messagesDiv.innerHTML += `<div><b>${m.user}:</b> ${m.text}</div>`;
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
  const user = username.value || "Anon";
  const text = chatInput.value;
  if (!text) return;

  await fetch(CHAT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, text })
  });

  chatInput.value = "";
  loadMessages();
}

setInterval(loadMessages, 2000);
loadMessages();

/* ================= STARS ================= */

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

(function animate() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#00ffff";
  stars.forEach(s => {
    s.y += 0.4;
    if (s.y > canvas.height) s.y = 0;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });
  requestAnimationFrame(animate);
})();
