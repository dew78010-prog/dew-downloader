
let currentMode = "MP4";

const urlInput = document.getElementById("mediaUrl");
const statusBox = document.getElementById("status");
const historyList = document.getElementById("historyList");

document.querySelectorAll(".tab").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(tab =>
      tab.classList.remove("active")
    );

    button.classList.add("active");
    currentMode = button.dataset.mode;

    statusBox.textContent =
      currentMode === "MP4"
      ? "Direct video files only."
      : "Direct audio files only.";
  });
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  const url = urlInput.value.trim();

  if (!url) {
    statusBox.textContent = "Please paste a media link first.";
    return;
  }

  let parsed;

  try {
    parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error();
    }
  } catch {
    statusBox.textContent = "Please enter a valid URL.";
    return;
  }

  const extension = parsed.pathname.split(".").pop().toLowerCase();

  const videoFormats = ["mp4", "webm", "mov", "m4v"];
  const audioFormats = ["mp3", "wav", "ogg", "m4a"];

  const allowed = currentMode === "MP4"
    ? videoFormats
    : audioFormats;

  if (!allowed.includes(extension)) {
    statusBox.textContent =
      "This is not a supported direct " + currentMode + " file.";
    return;
  }

  saveHistory(url, currentMode);

  const link = document.createElement("a");
  link.href = url;
  link.download = "dew-download." + extension;
  link.target = "_blank";
  link.rel = "noopener";

  document.body.appendChild(link);
  link.click();
  link.remove();

  statusBox.textContent =
    "Download requested. Browser restrictions may affect the result.";
});

function saveHistory(url, type) {
  let history = JSON.parse(
    localStorage.getItem("dewHistory") || "[]"
  );

  history.unshift({
    url: url,
    type: type,
    date: new Date().toLocaleString()
  });

  history = history.slice(0, 10);

  localStorage.setItem("dewHistory", JSON.stringify(history));
  showHistory();
}

function showHistory() {
  const history = JSON.parse(
    localStorage.getItem("dewHistory") || "[]"
  );

  historyList.replaceChildren();

  if (history.length === 0) {
    historyList.textContent = "No downloads yet.";
    historyList.style.color = "#8998ad";
    return;
  }

  history.forEach(item => {
    const box = document.createElement("div");
    box.className = "history-item";

    const heading = document.createElement("strong");
    heading.textContent = item.type + " · " + item.date;

    const link = document.createElement("a");
    link.href = item.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = item.url;

    box.append(heading, document.createElement("br"), link);
    historyList.appendChild(box);
  });
}

document.getElementById("clearHistory").addEventListener("click", () => {
  localStorage.removeItem("dewHistory");
  showHistory();
});

showHistory();
                          
