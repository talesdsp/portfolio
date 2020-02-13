const topNav = document.querySelector(".top-nav");
const menuToggler = document.querySelector(".menu-toggler");
const nav = document.querySelector(".nav-list");

menuToggler.addEventListener("click", toggleMenu);
function toggleMenu(e) {
  menuToggler.classList.toggle("open");
  topNav.classList.toggle("open");
}

nav.addEventListener("click", closeMenu);
function closeMenu(e) {
  menuToggler.classList.remove("open");
  topNav.classList.remove("open");
}

document.addEventListener("aos:in:custom-fade-in", setOpacity);

function setOpacity({detail}) {
  setTimeout(() => (detail.style.opacity = 1), 2500);
}

document.querySelectorAll('nav a[href^="#"]').forEach((v) => {
  v.addEventListener("click", function(evt) {
    evt.preventDefault();
    let t = document.querySelector(this.hash);
    smooth(t, 800);
    setTimeout(() => addFocus(t), 1000);
  });
});

document.querySelector(".uplink").addEventListener("click", scrollTop);
function scrollTop(e) {
  smooth(document.querySelector("#landing"), 1000);
  setTimeout(() => addFocus(document.querySelector("#landing")), 1000);
}

document.querySelector("form").addEventListener("submit", sendEmail);
document.querySelector("form #subject").addEventListener("input", onChangeSubject);
document.querySelector("form #body").addEventListener("input", onChangeBody);

/**
 * Smooth scroll function
 * @param {Object} target - element to scroll to
 * @param {Number} duration - transition time
 */
function smooth(target, duration) {
  let targetPosition = target.getBoundingClientRect().top;
  let startPosition = window.pageYOffset;
  let startTime = null;

  /**
   * The animation takes the currentTime, do the ease calculation, scroll to the result, recursively calls itself again with a different currentTime
   * @param {Number} currentTime
   */
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;

    let timeElapsed = currentTime - startTime;
    let run = ease(
      timeElapsed,
      startPosition,
      targetPosition - (window.innerWidth < 768 ? 0 : 200),
      duration
    );

    window.scrollTo(0, run);

    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  /**
   * Ease-in-quadratic formula
   * @param {Number} t
   * @param {Number} b
   * @param {Number} c
   * @param {Number} d
   */
  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }
  window.requestAnimationFrame(animation);
}

/**
 * Add focus to element after scroll, for accessibility purposes
 * @param {Object} t - element
 */
function addFocus(t) {
  t.focus();
  if (document.activeElement === t) {
    return;
  } else {
    t.setAttribute("tabindex", "-1"); // Adding tabindex for elements not focusable
    t.focus(); // Set focus again
  }
}

/**
 * Open user default email app with To, Subject, and Body, filled
 * @param {Object} e - element
 */
function sendEmail(e) {
  e.preventDefault();

  window.location.href = `mailto:talesdsp@gmail.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

let body;
function onChangeBody(e) {
  body = e.target.value;
}

let subject;
function onChangeSubject(e) {
  subject = e.target.value;
}

window.AOS.init({
  easing: "ease",
  duration: 1800,
  once: true
});
