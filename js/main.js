/* ===========================================================
   Portfolio — main.js
   Vanilla JS orchestrator: splash, cursor, nav, typewriter,
   counters, skill stagger, project tilt, LeetCode fetch + chart.
   =========================================================== */

(() => {
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isFinePointer =
    window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  /* -------------------- Splash -------------------- */
  const hideSplash = () => {
    const splash = document.getElementById("splash");
    if (!splash) return;
    splash.classList.add("hide");
    setTimeout(() => splash.remove(), 700);
  };
  // Always hide after a max wait, even if other things fail.
  const splashDelay = prefersReducedMotion ? 200 : 1400;
  window.addEventListener("load", () => setTimeout(hideSplash, splashDelay));
  // Fail-safe in case 'load' is unusually slow.
  setTimeout(hideSplash, 4000);

  /* -------------------- Footer year -------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------- Custom cursor -------------------- */
  if (isFinePointer && !prefersReducedMotion) {
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    if (dot && ring) {
      document.body.classList.add("has-custom-cursor");
      let mx = window.innerWidth / 2;
      let my = window.innerHeight / 2;
      let rx = mx;
      let ry = my;

      window.addEventListener("mousemove", (e) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      });

      const animate = () => {
        rx += (mx - rx) * 0.18;
        ry += (my - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);

      // Hover state for interactive elements
      const hoverSelector =
        "a, button, .pill, .stat-card, .project-card, .contact-card, .lc-card, .cert-card, .nav-toggle";
      document.querySelectorAll(hoverSelector).forEach((el) => {
        el.addEventListener("mouseenter", () =>
          document.body.classList.add("cursor-hover")
        );
        el.addEventListener("mouseleave", () =>
          document.body.classList.remove("cursor-hover")
        );
      });

      // Hide on leaving the window
      document.addEventListener("mouseleave", () => {
        dot.style.opacity = "0";
        ring.style.opacity = "0";
      });
      document.addEventListener("mouseenter", () => {
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      });
    }
  }

  /* -------------------- AOS init -------------------- */
  if (window.AOS) {
    window.AOS.init({
      duration: prefersReducedMotion ? 0 : 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      disable: prefersReducedMotion ? "phone" : false,
    });
  }

  /* -------------------- Typewriter -------------------- */
  const typedEl = document.getElementById("typed");
  if (typedEl && window.Typed) {
    if (prefersReducedMotion) {
      typedEl.textContent = "AI Developer";
    } else {
      // eslint-disable-next-line no-new
      new window.Typed("#typed", {
        strings: [
          "AI Developer",
          "Full-Stack Engineer",
          "Cybersecurity Enthusiast",
          "Problem Solver",
        ],
        typeSpeed: 60,
        backSpeed: 35,
        backDelay: 1400,
        startDelay: 400,
        loop: true,
        showCursor: false,
      });
    }
  } else if (typedEl) {
    typedEl.textContent = "AI Developer";
  }

  /* -------------------- Sticky navbar + active section -------------------- */
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  const onScroll = () => {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 30);
    }

    // Determine active section
    const scrollPos = window.scrollY + 120;
    let current = sections[0]?.id;
    for (const s of sections) {
      if (s.offsetTop <= scrollPos) current = s.id;
    }
    navLinks.forEach((l) =>
      l.classList.toggle("active", l.dataset.section === current)
    );
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* -------------------- Mobile nav toggle -------------------- */
  const navToggle = document.getElementById("nav-toggle");
  const navLinksWrap = document.getElementById("nav-links");
  if (navToggle && navLinksWrap) {
    navToggle.addEventListener("click", () => {
      const open = navLinksWrap.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinksWrap.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navLinksWrap.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* -------------------- Animated counters (About stats) -------------------- */
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target || "0");
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    if (prefersReducedMotion) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out-cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      el.textContent = value.toFixed(decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const statsObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".stat-num").forEach(animateCounter);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  const statsEl = document.getElementById("stats");
  if (statsEl) statsObserver.observe(statsEl);

  /* -------------------- Skill group stagger -------------------- */
  const skillObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );
  document.querySelectorAll(".skill-group").forEach((el) =>
    skillObserver.observe(el)
  );

  /* -------------------- Project tilt + glow -------------------- */
  if (!prefersReducedMotion) {
    document.querySelectorAll(".project-card.tilt").forEach((card) => {
      const maxTilt = 6; // degrees
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotY = (x - 0.5) * 2 * maxTilt;
        const rotX = (0.5 - y) * 2 * maxTilt;
        card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
        card.style.setProperty("--mx", `${x * 100}%`);
        card.style.setProperty("--my", `${y * 100}%`);
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* -------------------- tsParticles background -------------------- */
  if (!prefersReducedMotion && window.tsParticles) {
    window.tsParticles
      .load({
        id: "tsparticles",
        options: {
          fpsLimit: 60,
          fullScreen: { enable: false },
          background: { color: "transparent" },
          particles: {
            number: { value: 55, density: { enable: true, area: 900 } },
            color: { value: ["#00d4ff", "#1f5c99", "#6db8ff"] },
            shape: { type: "circle" },
            opacity: {
              value: { min: 0.15, max: 0.5 },
              animation: { enable: true, speed: 0.6, sync: false },
            },
            size: { value: { min: 1, max: 2.5 } },
            move: {
              enable: true,
              speed: 0.5,
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "out" },
            },
            links: {
              enable: true,
              distance: 130,
              color: "#1f5c99",
              opacity: 0.25,
              width: 1,
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "grab" },
              resize: { enable: true },
            },
            modes: {
              grab: { distance: 140, links: { opacity: 0.4 } },
            },
          },
          detectRetina: true,
        },
      })
      .catch(() => {
        /* particles are decorative; ignore failures */
      });
  }

  /* -------------------- LeetCode stats + donut -------------------- */
  const lcUser = "arshyan122";
  // Primary: the original spec'd endpoint. Fallback: a community-maintained
  // alternative (Heroku free tier was retired in 2022, so the primary often
  // returns 503). Both expose identical field names.
  const lcEndpoints = [
    `https://leetcode-stats-api.herokuapp.com/${lcUser}`,
    `https://leetcode-api-faisalshohag.vercel.app/${lcUser}`,
    `https://alfa-leetcode-api.onrender.com/userProfile/${lcUser}`,
  ];
  const lcStatsEl = document.getElementById("lc-stats");
  const lcChartTotal = document.getElementById("lc-chart-total");
  const lcLegend = {
    easy: document.getElementById("legend-easy"),
    medium: document.getElementById("legend-medium"),
    hard: document.getElementById("legend-hard"),
  };
  const lcError = document.getElementById("lc-error");
  const lcChartCanvas = document.getElementById("lc-chart");
  let lcChart = null;
  let lcLoaded = false;

  const fmt = (n) => {
    if (typeof n !== "number" || !isFinite(n)) return "—";
    return Math.round(n).toLocaleString();
  };

  const renderLcCards = (data) => {
    if (!lcStatsEl) return;
    const cards = [
      { key: "easy", icon: "🟢", label: "Easy Solved", value: data.easySolved, cls: "easy" },
      { key: "medium", icon: "🟡", label: "Medium Solved", value: data.mediumSolved, cls: "medium" },
      { key: "hard", icon: "🔴", label: "Hard Solved", value: data.hardSolved, cls: "hard" },
      { key: "total", icon: "⭐", label: "Total Solved", value: data.totalSolved },
      { key: "ranking", icon: "🏆", label: "Global Ranking", value: data.ranking, prefix: "#" },
      {
        key: "acceptance",
        icon: "✅",
        label: "Acceptance Rate",
        value: data.acceptanceRate,
        suffix: "%",
        decimals: 1,
      },
    ];

    lcStatsEl.innerHTML = cards
      .map(
        (c) => `
        <div class="lc-card glass ${c.cls || ""}" data-key="${c.key}">
          <div class="lc-icon-bg">${c.icon}</div>
          <div class="lc-card-num"
               data-target="${Number(c.value) || 0}"
               data-prefix="${c.prefix || ""}"
               data-suffix="${c.suffix || ""}"
               data-decimals="${c.decimals || 0}">
            ${c.prefix || ""}0${c.suffix || ""}
          </div>
          <div class="lc-card-label">${c.label}</div>
        </div>`
      )
      .join("");

    // Animate count-ups when section enters view
    const animateLcCard = (el) => {
      const target = parseFloat(el.dataset.target || "0");
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      if (prefersReducedMotion) {
        el.textContent =
          prefix +
          (decimals ? target.toFixed(decimals) : Math.round(target).toLocaleString()) +
          suffix;
        return;
      }
      const duration = 1500;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = target * eased;
        const txt =
          decimals > 0
            ? value.toFixed(decimals)
            : Math.round(value).toLocaleString();
        el.textContent = prefix + txt + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(
      (entries, o) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target
              .querySelectorAll(".lc-card-num")
              .forEach(animateLcCard);
            o.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    obs.observe(lcStatsEl);
  };

  const renderLcChart = (data) => {
    if (!lcChartCanvas || !window.Chart) return;
    const easy = Number(data.easySolved) || 0;
    const medium = Number(data.mediumSolved) || 0;
    const hard = Number(data.hardSolved) || 0;
    const total = Number(data.totalSolved) || easy + medium + hard;

    if (lcChartTotal) lcChartTotal.textContent = fmt(total);
    if (lcLegend.easy) lcLegend.easy.textContent = fmt(easy);
    if (lcLegend.medium) lcLegend.medium.textContent = fmt(medium);
    if (lcLegend.hard) lcLegend.hard.textContent = fmt(hard);

    if (lcChart) {
      lcChart.destroy();
    }

    lcChart = new window.Chart(lcChartCanvas, {
      type: "doughnut",
      data: {
        labels: ["Easy", "Medium", "Hard"],
        datasets: [
          {
            data: [easy, medium, hard],
            backgroundColor: [
              "rgba(0, 212, 255, 0.85)",
              "rgba(255, 176, 32, 0.85)",
              "rgba(255, 79, 107, 0.85)",
            ],
            borderColor: [
              "rgba(0, 212, 255, 1)",
              "rgba(255, 176, 32, 1)",
              "rgba(255, 79, 107, 1)",
            ],
            borderWidth: 1.5,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        animation: prefersReducedMotion
          ? { duration: 0 }
          : { animateRotate: true, duration: 1200, easing: "easeOutCubic" },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(10, 15, 30, 0.95)",
            borderColor: "rgba(0, 212, 255, 0.3)",
            borderWidth: 1,
            padding: 10,
            titleColor: "#fff",
            bodyColor: "#cfe6ff",
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.parsed} solved`,
            },
          },
        },
      },
    });
  };

  const showLcError = () => {
    if (!lcStatsEl) return;
    lcStatsEl.innerHTML = "";
    if (lcError) lcError.hidden = false;
    if (lcChartTotal) lcChartTotal.textContent = "—";
  };

  const computeAcceptance = (data) => {
    // If acceptanceRate is provided directly, prefer it.
    if (data && typeof data.acceptanceRate === "number") return data.acceptanceRate;
    // Fallback: derive from the submission breakdown.
    const tot = Array.isArray(data?.totalSubmissions) ? data.totalSubmissions : [];
    const all = tot.find((d) => d.difficulty === "All");
    if (all && all.submissions > 0) {
      return (all.count / all.submissions) * 100;
    }
    return null;
  };

  const tryFetchLcEndpoint = async (url) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data || (data.status && data.status !== "success")) {
        throw new Error("Bad payload");
      }
      // Sanity check: at least one solved field should be a number.
      const hasSolved =
        typeof data.totalSolved === "number" ||
        typeof data.easySolved === "number";
      if (!hasSolved) throw new Error("Missing fields");
      return data;
    } finally {
      clearTimeout(timer);
    }
  };

  const fetchLeetCode = async () => {
    // Set the guard synchronously before any await so concurrent triggers
    // (IntersectionObserver + setTimeout) cannot both pass it and double-render.
    if (lcLoaded) return;
    lcLoaded = true;
    let lastErr = null;
    for (const url of lcEndpoints) {
      try {
        const data = await tryFetchLcEndpoint(url);
        // Normalise: if acceptanceRate is missing, derive it.
        if (typeof data.acceptanceRate !== "number") {
          const ar = computeAcceptance(data);
          if (ar !== null) data.acceptanceRate = ar;
        }
        renderLcCards(data);
        renderLcChart(data);
        return;
      } catch (err) {
        lastErr = err;
        // eslint-disable-next-line no-console
        console.warn(`[LeetCode] ${url} failed:`, err);
      }
    }
    // All endpoints failed — release the guard so a later trigger
    // (e.g. user scrolling back into view, slow Render cold-start finishing)
    // can retry. The race-condition fix above is preserved because the guard
    // is still set synchronously before any await.
    lcLoaded = false;
    // eslint-disable-next-line no-console
    console.warn("[LeetCode] all endpoints failed:", lastErr);
    showLcError();
  };

  // Trigger fetch when LeetCode section nears the viewport (avoids wasted call on quick scrollers)
  const lcSection = document.getElementById("leetcode");
  if (lcSection) {
    const lcObs = new IntersectionObserver(
      (entries, o) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchLeetCode();
            o.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "200px 0px" }
    );
    lcObs.observe(lcSection);
    // Also kick off after 800ms unconditionally so the data is ready by the time the user gets there
    setTimeout(fetchLeetCode, 800);
  }
})();
