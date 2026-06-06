// ── Hamburger menu ──────────────────────────
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

document.addEventListener("click", function (e) {
  const nav = document.getElementById("hamburger-nav");
  if (nav && !nav.contains(e.target)) {
    document.querySelector(".menu-links")?.classList.remove("open");
    document.querySelector(".hamburger-icon")?.classList.remove("open");
  }
});

// ── Skill bars animate on scroll ────────────
const skillFills = document.querySelectorAll(".skill-fill");
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
skillFills.forEach((fill) => {
  fill.style.animationPlayState = "paused";
  skillObserver.observe(fill);
});

// ── Section fade-in on scroll ────────────────
const sections = document.querySelectorAll("section");
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.07 }
);
sections.forEach((sec) => {
  sec.style.opacity = "0";
  sec.style.transform = "translateY(28px)";
  sec.style.transition = "opacity 0.7s ease, transform 0.7s ease";
  fadeObserver.observe(sec);
});

const visibleStyle = document.createElement("style");
visibleStyle.textContent = `section.visible { opacity: 1 !important; transform: none !important; }`;
document.head.appendChild(visibleStyle);

// ── Active nav highlight ─────────────────────
const navLinks = document.querySelectorAll("#desktop-nav .nav-links a:not(.nav-cta)");
const sectionIds = ["about", "experience", "certification", "contact"];

window.addEventListener("scroll", () => {
  let current = "";
  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 130) {
      current = id;
    }
  });
  navLinks.forEach((link) => {
    link.style.color = "";
    link.style.background = "";
    if (link.getAttribute("href") === `#${current}`) {
      link.style.color = "white";
    }
  });
});

// ── Contact form handler ─────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const name    = document.getElementById("name").value.trim();
  const email   = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();
  const note    = document.getElementById("form-note");

  if (!name || !email || !subject || !message) {
    note.style.color = "#f72585";
    note.textContent = "⚠ Please fill in all fields before sending.";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    note.style.color = "#f72585";
    note.textContent = "⚠ Please enter a valid email address.";
    return;
  }

  // Simulate send (replace with EmailJS / Formspree / backend call)
  const btn = e.target;
  btn.disabled = true;
  btn.textContent = "Sending…";

  setTimeout(() => {
    note.style.color = "#06d6a0";
    note.textContent = "✓ Message sent! I'll get back to you soon.";
    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message`;
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("subject").value = "";
    document.getElementById("message").value = "";
  }, 1600);
}

// ── Project filter tabs ───────────────────────
(function () {
  const filterBtns = document.querySelectorAll(".proj-filter-btn");
  const cards = document.querySelectorAll(".proj-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Active state
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const tags = card.dataset.tags || "";
        const show = filter === "all" || tags.includes(filter);

        if (show) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
})();

// ── Project cards scroll reveal ───────────────
const projCards = document.querySelectorAll(".proj-card");
const projObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0) scale(1)";
        }, i * 100);
        projObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

projCards.forEach((card, i) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(36px) scale(0.97)";
  card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  projObserver.observe(card);
});
