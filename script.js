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

// ── Job Simulations Slider (auto-running, one card at a time) ────
(function () {
  const track   = document.getElementById('simTrack');
  const prevBtn = document.getElementById('simPrev');
  const nextBtn = document.getElementById('simNext');
  const dotsEl  = document.getElementById('simDots');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.sim-slide'));
  let current = 0;
  let autoplayTimer = null;

  function showSlide(index, direction) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;

    slides.forEach((s) => { s.classList.remove('active', 'dir-left'); });

    const slide = slides[index];
    slide.classList.add('active');
    if (direction === 'left') slide.classList.add('dir-left');

    current = index;
    updateDots();
  }

  function updateDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    slides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'sim-dot' + (i === current ? ' active' : '');
      btn.setAttribute('aria-label', `Job simulation ${i + 1}`);
      btn.addEventListener('click', () => {
        showSlide(i, i > current ? 'right' : 'left');
        restartAutoplay();
      });
      dotsEl.appendChild(btn);
    });
  }

  function nextSlide() { showSlide(current + 1, 'right'); }
  function prevSlide() { showSlide(current - 1, 'left'); }

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 3200);
  }
  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }
  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); restartAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); restartAutoplay(); });

  // Pause while the user is looking at / hovering the slider
  const wrapper = document.querySelector('.sim-slider-wrapper');
  if (wrapper) {
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);
  }

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); restartAutoplay(); }
  });

  // Only auto-run once the section actually scrolls into view
  const simSection = document.getElementById('simulation');
  const simAutoplayObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startAutoplay();
        } else {
          stopAutoplay();
        }
      });
    },
    { threshold: 0.3 }
  );
  if (simSection) simAutoplayObserver.observe(simSection);

  showSlide(0, 'right');
})();

// ── Active nav highlight ─────────────────────
const navLinks = document.querySelectorAll("#desktop-nav .nav-links a:not(.nav-cta)");
const sectionIds = ["about", "experience", "certification", "achievements", "simulation", "contact"];

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

// ── Project Slider ────────────────────────────
(function () {
  const track     = document.getElementById('projTrack');
  const prevBtn   = document.getElementById('projPrev');
  const nextBtn   = document.getElementById('projNext');
  const dotsEl    = document.getElementById('projDots');
  if (!track) return;

  let allSlides   = Array.from(track.querySelectorAll('.proj-slide'));
  let visibleSlides = [...allSlides]; // filtered subset
  let current     = 0;

  function showSlide(index, direction) {
    if (visibleSlides.length === 0) return;
    index = Math.max(0, Math.min(index, visibleSlides.length - 1));

    visibleSlides.forEach((s) => {
      s.classList.remove('active');
      s.style.display = 'none';
    });

    const slide = visibleSlides[index];
    slide.style.display = 'block';
    slide.style.animation = 'none';
    slide.offsetHeight; // reflow
    slide.style.animation = direction === 'left'
      ? 'slideInLeft 0.45s cubic-bezier(.23,1,.32,1)'
      : 'slideIn 0.45s cubic-bezier(.23,1,.32,1)';
    slide.classList.add('active');

    current = index;
    updateDots();
    updateArrows();
  }

  function updateDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    visibleSlides.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'proj-dot' + (i === current ? ' active' : '');
      btn.setAttribute('aria-label', `Project ${i + 1}`);
      btn.addEventListener('click', () => showSlide(i, i > current ? 'right' : 'left'));
      dotsEl.appendChild(btn);
    });
  }

  function updateArrows() {
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === visibleSlides.length - 1;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(current - 1, 'left'));
  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(current + 1, 'right'));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    const section = document.getElementById('projects');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;
    if (e.key === 'ArrowLeft') showSlide(current - 1, 'left');
    if (e.key === 'ArrowRight') showSlide(current + 1, 'right');
  });

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? showSlide(current + 1, 'right') : showSlide(current - 1, 'left');
  });

  // Filter tabs — reuse existing filter buttons
  const filterBtns = document.querySelectorAll('.proj-filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      visibleSlides = allSlides.filter((s) => {
        return filter === 'all' || (s.dataset.tags || '').includes(filter);
      });
      current = 0;
      allSlides.forEach((s) => { s.classList.remove('active'); s.style.display = 'none'; });
      showSlide(0, 'right');
    });
  });

  // Init
  showSlide(0, 'right');
})();
