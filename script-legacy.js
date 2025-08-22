// Floating navigation functionality - Legacy Safari compatible
document.addEventListener("DOMContentLoaded", function () {
  var floatingNav = document.getElementById("floating-nav");
  var floatingNavLinks = document.getElementById("floating-nav-links");
  var currentActiveSection = null;

  // Navigation data for each section
  var navigationData = {
    inferno: [
      { href: "#inferno-smoke-1", text: "Banana 1" },
      { href: "#inferno-smoke-2", text: "Banana 2" },
      { href: "#inferno-smoke-3", text: "Banana 3" },
      { href: "#inferno-smoke-4", text: "Banana 4" },
      { href: "#inferno-smoke-5", text: "Banana 5" },
      { href: "#inferno-smoke-6", text: "Banana 6" },
      { href: "#inferno-mid-1", text: "Mid 1" },
      { href: "#inferno-mid-2", text: "Mid 2" },
      { href: "#inferno-mid-3", text: "Mid 3" },
      { href: "#inferno-mid-4", text: "Mid 4" },
      { href: "#inferno-mid-5", text: "Mid 5" },
      { href: "#inferno-mid-6", text: "Mid 6" },
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
      { href: "#nuke-smoke-11", text: "A Main Smoke" },
      { href: "#nuke-fire-1", text: "Fire HUT" },
    ],
  };

  // Function to check if element is in viewport (fallback for Intersection Observer)
  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top <= window.innerHeight * 0.7 &&
      rect.bottom >= window.innerHeight * 0.3 &&
      rect.left >= 0 &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // Function to update floating navigation
  function updateFloatingNav() {
    var sections = document.querySelectorAll(".section[data-section]");
    var activeSection = null;

    // Find which section is currently in view
    for (var i = 0; i < sections.length; i++) {
      var section = sections[i];
      if (isElementInViewport(section)) {
        activeSection = section.getAttribute("data-section");
        break;
      }
    }

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

  // Modern browser support check
  function supportsIntersectionObserver() {
    return "IntersectionObserver" in window;
  }

  // Use Intersection Observer if supported, otherwise fallback to scroll events
  if (supportsIntersectionObserver()) {
    var observer = new IntersectionObserver(
      function (entries) {
        for (var i = 0; i < entries.length; i++) {
          var entry = entries[i];
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            var sectionName = entry.target.getAttribute("data-section");

            if (sectionName !== currentActiveSection) {
              currentActiveSection = sectionName;

              if (navigationData[sectionName]) {
                showFloatingNav(sectionName);
              } else {
                hideFloatingNav();
              }
            }
          }
        }
      },
      {
        threshold: [0.1, 0.3, 0.5],
        rootMargin: "-120px 0px -100px 0px",
      }
    );

    // Observe all sections
    var sections = document.querySelectorAll(".section[data-section]");
    for (var i = 0; i < sections.length; i++) {
      observer.observe(sections[i]);
    }
  } else {
    // Fallback for older browsers (like iPad 3)
    console.log("Using scroll fallback for older Safari");
  }

  // Scroll event listener (works on all browsers)
  var scrollTimeout;
  function handleScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateFloatingNav, 100);
  }

  // Attach scroll listener (compatible way)
  if (window.addEventListener) {
    window.addEventListener("scroll", handleScroll, false);
  } else if (window.attachEvent) {
    window.attachEvent("onscroll", handleScroll);
  }

  function showFloatingNav(sectionName) {
    var links = navigationData[sectionName];

    if (!links) return;

    // Clear existing links
    floatingNavLinks.innerHTML = "";

    // Add new links
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      var linkElement = document.createElement("a");
      linkElement.href = link.href;
      linkElement.textContent = link.text;
      floatingNavLinks.appendChild(linkElement);
    }

    // Update title
    var title = floatingNav.querySelector(".floating-nav-title");
    if (title) {
      title.textContent =
        "RYCHLÁ NAVIGACE - " + sectionName.toUpperCase() + ":";
    }

    // Show floating nav (compatible class manipulation)
    if (floatingNav.classList) {
      floatingNav.classList.add("visible");
    } else {
      // Fallback for older browsers
      floatingNav.className += " visible";
    }

    console.log("Floating nav shown for: " + sectionName);
  }

  function hideFloatingNav() {
    if (floatingNav.classList) {
      floatingNav.classList.remove("visible");
    } else {
      // Fallback for older browsers
      floatingNav.className = floatingNav.className.replace(/\bvisible\b/g, "");
    }
    console.log("Floating nav hidden");
  }

  // Smooth scrolling for all anchor links (compatible version)
  function handleLinkClick(e) {
    var target = e.target || e.srcElement;
    if (
      target.tagName === "A" &&
      target.getAttribute("href") &&
      target.getAttribute("href").indexOf("#") === 0
    ) {
      e.preventDefault();
      var targetId = target.getAttribute("href").substring(1);
      var targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Try modern smooth scrolling first
        if (
          targetElement.scrollIntoView &&
          "scrollBehavior" in document.documentElement.style
        ) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else {
          // Fallback for older browsers
          var targetPosition = targetElement.offsetTop - 120; // Account for fixed headers

          // Simple scroll animation for older browsers
          var currentPosition =
            window.pageYOffset || document.documentElement.scrollTop;
          var distance = targetPosition - currentPosition;
          var duration = 500;
          var startTime = Date.now();

          function animateScroll() {
            var elapsed = Date.now() - startTime;
            var progress = Math.min(elapsed / duration, 1);

            // Easing function
            progress = progress * (2 - progress);

            var newPosition = currentPosition + distance * progress;
            window.scrollTo(0, newPosition);

            if (progress < 1) {
              setTimeout(animateScroll, 16); // ~60fps
            }
          }

          animateScroll();
        }
      }
    }
  }

  // Attach click listener (compatible way)
  if (document.addEventListener) {
    document.addEventListener("click", handleLinkClick, false);
  } else if (document.attachEvent) {
    document.attachEvent("onclick", handleLinkClick);
  }

  // Initial check
  setTimeout(updateFloatingNav, 500);
});
