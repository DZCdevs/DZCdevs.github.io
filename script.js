const TYPING_PHRASES = [
  "Building the Future",
  "Coding Solutions",
  "Open Source Enthusiasts",
];

const cursor = document.querySelector(".cursor");
const typingEl = document.getElementById("typing");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeLoop() {
  let phraseIndex = 0;

  while (true) {
    const phrase = TYPING_PHRASES[phraseIndex];
    for (let i = 0; i <= phrase.length; i++) {
      typingEl.textContent = phrase.slice(0, i);
      await sleep(70 + Math.random() * 40);
    }

    await sleep(900);

    for (let i = phrase.length; i >= 0; i--) {
      typingEl.textContent = phrase.slice(0, i);
      await sleep(30 + Math.random() * 25);
    }

    phraseIndex = (phraseIndex + 1) % TYPING_PHRASES.length;
  }
}

async function fetchRepos() {
  const container = document.getElementById("projectsGrid");
  if (!container) return;

  container.innerHTML = "<p class=\"loading\">Projeler yükleniyor...</p>";

  try {
    const response = await fetch(
      "https://api.github.com/orgs/DZCdevs/repos?per_page=15&type=public"
    );
    if (!response.ok) throw new Error("GitHub API hatası");

    const repos = await response.json();
    const sorted = repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    container.innerHTML = "";

    sorted.slice(0, 8).forEach((repo) => {
      const card = document.createElement("article");
      card.className = "card";

      const title = document.createElement("h3");
      title.textContent = repo.name;

      const desc = document.createElement("p");
      desc.textContent = repo.description || "Açıklama bulunmuyor.";

      const badgeGroup = document.createElement("div");
      badgeGroup.className = "badge-group";
      badgeGroup.appendChild(getLanguageBadge(repo.language));

      const meta = document.createElement("div");
      meta.className = "card-meta";

      const stars = document.createElement("span");
      stars.className = "chip";
      stars.innerHTML = `<span></span>★ ${repo.stargazers_count}`;
      meta.appendChild(stars);

      const link = document.createElement("a");
      link.href = repo.html_url;
      link.target = "_blank";
      link.rel = "noopener";
      link.className = "btn";
      link.textContent = "Görüntüle";

      card.append(title, badgeGroup, desc, meta, link);
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML =
      "<p class=\"loading\">Projeler yüklenemedi. Daha sonra tekrar deneyin.</p>";
    console.error(error);
  }
}

function getLanguageBadge(language) {
  const normalized = (language || "Diğer").trim();
  const map = {
    JavaScript: "#f7df1e",
    TypeScript: "#3178c6",
    Python: "#3776ab",
    HTML: "#e34f26",
    CSS: "#2965f1",
    Java: "#f89820",
    Go: "#00add8",
    Rust: "#dea584",
    PHP: "#787cb5",
    Shell: "#89e051",
    Ruby: "#cc342d",
  };

  const color = map[normalized] || "rgba(255, 255, 255, 0.12)";
  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = normalized;
  badge.style.background = color;
  badge.style.color = "#0b0b0e";
  badge.style.borderColor = "rgba(0, 0, 0, 0.12)";
  return badge;
}

function initTerminal() {
  const output = document.getElementById("terminalBody");
  const input = document.getElementById("terminalInput");

  const commands = {
    "/help": "Kullanılabilir komutlar: /help, /members, /projects, /about",
    "/members": "Ekibimiz: Ayşe, Mehmet, Elif (örnek).",
    "/projects": "Projeler bölümüne bakın, burada en popüler repolar listeleniyor.",
    "/about": "DZCdevs: Açık kaynak ve modern yazılım çözümleri üreten topluluk.",
  };

  const print = (text) => {
    const line = document.createElement("p");
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
  };

  print("DZCdevs terminaline hoş geldiniz! Yazmak için /help yazın.");

  input.addEventListener("keydown", (evt) => {
    if (evt.key !== "Enter") return;
    const value = input.value.trim();
    if (!value) return;

    print(`> ${value}`);
    const response = commands[value.toLowerCase()] || "Bilinmeyen komut. /help yazın.";
    print(response);
    input.value = "";
  });
}

function initCursor() {
  const cursorEl = document.querySelector(".cursor");
  if (!cursorEl) return;

  window.addEventListener("mousemove", (event) => {
    cursorEl.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
  });

  window.addEventListener("mousedown", () => {
    cursorEl.style.transform += " scale(0.8)";
  });

  window.addEventListener("mouseup", () => {
    cursorEl.style.transform = cursorEl.style.transform.replace(" scale(0.8)", "");
  });
}

function initLastUpdate() {
  const el = document.getElementById("lastUpdate");
  if (!el) return;

  fetch("https://api.github.com/repos/DZCdevs/DZCdevs.github.io/commits?per_page=1")
    .then((res) => {
      if (!res.ok) throw new Error("API hatası");
      return res.json();
    })
    .then((data) => {
      const date = data[0]?.commit?.author?.date;
      if (!date) throw new Error("Tarih bulunamadı");
      const d = new Date(date);
      el.textContent = `Son güncelleme: ${d.toLocaleDateString("tr-TR", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      })}`;
    })
    .catch(() => {
      el.textContent = "Son güncelleme: alınamadı";
    });
}

function initThemeToggle() {
  const root = document.documentElement;
  const stored = localStorage.getItem("theme");
  const theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  const setTheme = (mode) => {
    root.dataset.theme = mode;
    localStorage.setItem("theme", mode);
  };

  setTheme(theme);
}

window.addEventListener("DOMContentLoaded", () => {
  typeLoop();
  fetchRepos();
  initTerminal();
  initCursor();
  initLastUpdate();
  initThemeToggle();
});
