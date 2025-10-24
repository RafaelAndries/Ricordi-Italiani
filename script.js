const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("primary-nav");
const navLinks = document.querySelectorAll("#primary-nav a");

function setNavForViewport() {
  if (window.innerWidth > 768) {
    nav.classList.remove("open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.style.display = "none";
  } else {
    navToggle.style.display = "inline-block";
  }
}

if (nav && navToggle) {
  navToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    nav.classList.toggle("open");
    navToggle.classList.toggle("is-open");
  });

  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768 && nav.classList.contains("open")) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        nav.classList.remove("open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  navLinks.forEach((a) =>
    a.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        nav.classList.remove("open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    })
  );

  window.addEventListener("resize", setNavForViewport);
  setNavForViewport();
}

const audio = document.getElementById("bgAudio");
const audioBtn = document.getElementById("audioToggle");

if (audio && audioBtn) {
  audio.src = "song.mp3";
  audio.preload = "auto";
  audio.volume = 0.1;

  audioBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio
        .play()
        .then(() => {
          audioBtn.textContent = "❚❚";
          audioBtn.classList.add("active");
        })
        .catch(() => {});
    } else {
      audio.pause();
      audioBtn.textContent = "►";
      audioBtn.classList.remove("active");
    }
  });
}
