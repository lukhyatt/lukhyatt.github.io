/* Luke Hyatt — portfolio
   Three jobs only: the mobile nav, the current-section marker in the nav, and
   moving focus to a section after an in-page jump. Smooth scrolling and the
   reduced-motion opt-out live in CSS. */
(function () {
  "use strict";

  var masthead = document.querySelector(".masthead");
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__list a"));
  var mobile = window.matchMedia("(max-width: 759px)");

  /* ------------------------------ mobile nav ------------------------------ */
  function isOpen() {
    return toggle.getAttribute("aria-expanded") === "true";
  }

  function openNav() {
    toggle.setAttribute("aria-expanded", "true");
    nav.classList.add("is-open");
    if (links[0]) links[0].focus();
  }

  function closeNav(returnFocus) {
    if (!isOpen()) return;
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    if (returnFocus) toggle.focus();
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      if (isOpen()) closeNav(false); else openNav();
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav(true);
    });

    document.addEventListener("click", function (event) {
      if (!isOpen()) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      closeNav(false);
    });

    // Leaving the mobile breakpoint with the panel open would strand the state.
    var onBreakpoint = function () { if (!mobile.matches) closeNav(false); };
    if (mobile.addEventListener) mobile.addEventListener("change", onBreakpoint);
    else if (mobile.addListener) mobile.addListener(onBreakpoint);
  }

  /* --------------------------- current section ---------------------------- */
  var targets = links
    .map(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      return section ? { link: link, section: section } : null;
    })
    .filter(Boolean);

  function markCurrent() {
    if (!targets.length) return;

    var offset = (masthead ? masthead.offsetHeight : 0) + 24;
    var current = null;

    // Bottom of the page always belongs to the last section, whose height may
    // be shorter than the viewport.
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
      current = targets[targets.length - 1];
    } else {
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].section.getBoundingClientRect().top <= offset) current = targets[i];
      }
    }

    targets.forEach(function (target) {
      if (target === current) target.link.setAttribute("aria-current", "true");
      else target.link.removeAttribute("aria-current");
    });
  }

  /* ------------------------------ scroll state ---------------------------- */
  function onScrollState() {
    if (masthead) masthead.classList.toggle("is-scrolled", window.scrollY > 4);
    markCurrent();
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScrollState();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScrollState();

  /* --------------------- focus the target of an in-page jump -------------- */
  // Browsers move focus for anchor navigation inconsistently when the target is
  // a plain <section>; without this, keyboard users keep tabbing from the nav.
  document.addEventListener("click", function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;

    var id = link.getAttribute("href").slice(1);
    if (!id) return;

    var target = document.getElementById(id);
    if (!target) return;

    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  });
})();
