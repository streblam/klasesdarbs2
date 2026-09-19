document.addEventListener("DOMContentLoaded", () => {
  const poem = document.querySelector(".poem-card");
  const progressWidget = document.getElementById("readingProgress");
  const progressCircle = document.querySelector(".progress-value");
  const progressText = document.getElementById("progressPercent");
  const topProgressBar = document.getElementById("topProgressBar");
  const printButton = document.getElementById("printButton");
  const heroArt = document.querySelector(".hero-art");

  const radius = 27;
  const circumference = 2 * Math.PI * radius;

  if (progressCircle) {
    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = `${circumference}`;
  }

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  function updateReadingProgress() {
    if (!poem) return;

    const rect = poem.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const readingStart = viewportHeight * 0.28;
    const readingDistance = Math.max(
      rect.height - viewportHeight * 0.42,
      1
    );

    const travelled = readingStart - rect.top;

    const progress = clamp(
      travelled / readingDistance,
      0,
      1
    );

    const percent = Math.round(progress * 100);

    if (progressCircle) {
      progressCircle.style.strokeDashoffset =
        circumference - progress * circumference;
    }

    if (progressText) {
      progressText.textContent = percent;
    }

    if (topProgressBar) {
      topProgressBar.style.width = `${percent}%`;
    }

    if (progressWidget) {
      const poemIsRelevant =
        rect.top < viewportHeight * 0.8 &&
        rect.bottom > viewportHeight * 0.16;

      progressWidget.classList.toggle(
        "visible",
        poemIsRelevant
      );
    }
  }

  const revealElements =
    document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach(element =>
      observer.observe(element)
    );
  } else {
    revealElements.forEach(element =>
      element.classList.add("is-visible")
    );
  }

  function updateHeroMotion() {
    if (
      !heroArt ||
      window
        .matchMedia("(prefers-reduced-motion: reduce)")
        .matches
    ) {
      return;
    }

    const offset = Math.min(
      window.scrollY * 0.08,
      34
    );

    heroArt.style.transform =
      `translateY(${offset}px)`;
  }

  let ticking = false;

  function handleScroll() {
    if (ticking) return;

    ticking = true;

    window.requestAnimationFrame(() => {
      updateReadingProgress();
      updateHeroMotion();
      ticking = false;
    });
  }

  if (printButton) {
    printButton.addEventListener("click", () => {
      window.print();
    });
  }

  updateReadingProgress();
  updateHeroMotion();

  window.addEventListener(
    "scroll",
    handleScroll,
    {
      passive: true
    }
  );

  window.addEventListener(
    "resize",
    updateReadingProgress
  );
});
