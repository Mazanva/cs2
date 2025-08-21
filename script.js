// Floating navigation functionality
document.addEventListener("DOMContentLoaded", function () {
  const floatingNav = document.getElementById("floating-nav");
  const floatingNavLinks = document.getElementById("floating-nav-links");
  let currentActiveSection = null;

  // Navigation data for each section
  const navigationData = {
    inferno: [
      { href: "#inferno-smoke-1", text: "Spawn 1" },
      { href: "#inferno-smoke-2", text: "Spawn 2" },
      { href: "#inferno-smoke-3", text: "Spawn 3" },
      { href: "#inferno-smoke-4", text: "Spawn 4" },
      { href: "#inferno-smoke-5", text: "Spawn 5" },
      { href: "#inferno-smoke-6", text: "Spawn 6" },
    ],
    nuke: [
      { href: "#nuke-smoke-1", text: "Spawn 1" },
      { href: "#nuke-smoke-2", text: "Spawn 2" },
      { href: "#nuke-smoke-3", text: "Spawn 3" },
      { href: "#nuke-smoke-4", text: "Spawn 4" },
      { href: "#nuke-smoke-5", text: "Spawn 5" },
      { href: "#nuke-smoke-6", text: "Spawn 6" },
      { href: "#nuke-smoke-7", text: "Spawn 7" },
      { href: "#nuke-smoke-8", text: "Spawn 8" },
      { href: "#nuke-smoke-9", text: "Outside 1" },
      { href: "#nuke-smoke-10", text: "Outside 2" },
    ],
  };

  // Function to update floating navigation
  function updateFloatingNav() {
    const sections = document.querySelectorAll(".section[data-section]");
    let activeSection = null;

    // Find which section is currently in view
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;

      // Check if section is in the viewport (with some offset for better UX)
      if (
        sectionTop <= window.innerHeight * 0.7 &&
        sectionBottom >= window.innerHeight * 0.3
      ) {
        activeSection = section.dataset.section;
      }
    });

    // Update floating nav if active section changed
    if (activeSection !== currentActiveSection) {
      currentActiveSection = activeSection;

      if (activeSection && navigationData[activeSection]) {
        showFloatingNav(activeSection);
      } else {
        hideFloatingNav();
      }
    }
  }

  // Create Intersection Observer as backup
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          const sectionName = entry.target.dataset.section;

          if (sectionName !== currentActiveSection) {
            currentActiveSection = sectionName;

            if (navigationData[sectionName]) {
              showFloatingNav(sectionName);
            } else {
              hideFloatingNav();
            }
          }
        }
      });
    },
    {
      threshold: [0.1, 0.3, 0.5],
      rootMargin: "-120px 0px -100px 0px",
    }
  );

  // Observe all sections
  document.querySelectorAll(".section[data-section]").forEach((section) => {
    observer.observe(section);
  });

  // Listen to scroll events for more responsive updates
  let scrollTimeout;
  window.addEventListener(
    "scroll",
    function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateFloatingNav, 50);
    },
    { passive: true }
  );

  function showFloatingNav(sectionName) {
    const links = navigationData[sectionName];

    if (!links) return;

    // Clear existing links
    floatingNavLinks.innerHTML = "";

    // Add new links
    links.forEach((link) => {
      const linkElement = document.createElement("a");
      linkElement.href = link.href;
      linkElement.textContent = link.text;
      floatingNavLinks.appendChild(linkElement);
    });

    // Update title
    const title = floatingNav.querySelector(".floating-nav-title");
    if (title) {
      title.textContent = `RYCHLÁ NAVIGACE - ${sectionName.toUpperCase()}:`;
    }

    // Show floating nav
    floatingNav.classList.add("visible");

    console.log(`Floating nav shown for: ${sectionName}`); // Debug log
  }

  function hideFloatingNav() {
    floatingNav.classList.remove("visible");
    console.log("Floating nav hidden"); // Debug log
  }

  // Smooth scrolling for all anchor links
  document.addEventListener("click", function (e) {
    if (
      e.target.tagName === "A" &&
      e.target.getAttribute("href") &&
      e.target.getAttribute("href").startsWith("#")
    ) {
      e.preventDefault();
      const targetId = e.target.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });

  // Initial check
  setTimeout(updateFloatingNav, 500);
});
