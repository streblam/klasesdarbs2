document.addEventListener("DOMContentLoaded", () => {
  const progressBar =
    document.getElementById("pageProgress");

  const lines = [
    ...document.querySelectorAll(".poem-copy p")
  ];

  const printButton =
    document.getElementById("printButton");

  const revealItems =
    document.querySelectorAll(".reveal");

  const hero =
    document.querySelector(".hero-modern");

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  function updatePageProgress() {
    const scrollable =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const progress =
      scrollable > 0
        ? clamp(
            window.scrollY / scrollable,
            0,
            1
          )
        : 0;

    if (progressBar) {
      progressBar.style.width =
        `${progress * 100}%`;
    }
  }

  /*
    Sākumā fons ir gandrīz desaturēts.
    Ritinot hero daļu, saturation pakāpeniski pieaug.
  */
  function updateBackgroundSaturation() {
    if (!hero) {
      return;
    }

    const heroHeight =
      Math.max(hero.offsetHeight, 1);

    const progress =
      clamp(
        window.scrollY / heroHeight,
        0,
        1
      );

    /*
      Smoothstep padara pāreju dabiskāku:
      lēnāka sākumā un beigās,
      ātrāka pa vidu.
    */
    const smoothProgress =
      progress *
      progress *
      (3 - 2 * progress);

    const minSaturation = 0.25;
    const maxSaturation = 1.25;

    const saturation =
      minSaturation +
      (
        maxSaturation -
        minSaturation
      ) *
      smoothProgress;

    document.body.style.setProperty(
      "--bg-saturation",
      saturation.toFixed(3)
    );
  }

  function updateActiveLine() {
    if (!lines.length) {
      return;
    }

    const readingPoint =
      window.innerHeight * 0.48;

    let activeIndex = 0;
    let closestDistance = Infinity;

    lines.forEach((line, index) => {
      line.classList.remove(
        "is-active",
        "is-near"
      );

      const rect =
        line.getBoundingClientRect();

      const center =
        rect.top + rect.height / 2;

      const distance =
        Math.abs(center - readingPoint);

      if (distance < closestDistance) {
        closestDistance = distance;
        activeIndex = index;
      }
    });

    lines.forEach((line, index) => {
      const distance =
        Math.abs(index - activeIndex);

      if (distance === 0) {
        line.classList.add("is-active");
      } else if (distance <= 2) {
        line.classList.add("is-near");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.12
        }
      );

    revealItems.forEach((item) =>
      observer.observe(item)
    );
  } else {
    revealItems.forEach((item) =>
      item.classList.add("visible")
    );
  }

  if (printButton) {
    printButton.addEventListener(
      "click",
      () => {
        window.print();
      }
    );
  }

  let ticking = false;

  function update() {
    updatePageProgress();
    updateBackgroundSaturation();
    updateActiveLine();
  }

  function onScroll() {
    if (ticking) {
      return;
    }

    ticking = true;

    window.requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }

  update();

  window.addEventListener(
    "scroll",
    onScroll,
    {
      passive: true
    }
  );

  window.addEventListener(
    "resize",
    update
  );
});
