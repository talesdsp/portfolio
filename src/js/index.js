window.addEventListener("load", () => {
  const topNav = document.querySelector(".top-nav");
  const menuToggler = document.querySelector(".menu-toggler");
  const nav = document.querySelector(".nav-list");

  menuToggler.addEventListener("click", (e) => {
    menuToggler.classList.toggle("open");
    topNav.classList.toggle("open");
  });

  nav.addEventListener("click", (e) => {
    menuToggler.classList.remove("open");
    topNav.classList.remove("open");
  });

  document.querySelectorAll('nav a[href="#"]').forEach((v) => {
    document.querySelector("html").animate(
      {
        scrollTop: v.offsetTop - 400
      },
      {duration: 2000}
    );
  });

  document.querySelector(".uplink").addEventListener("click", (e) => {
    smooth(document.querySelector("#landing"), 1000);
    setTimeout(() => addFocus(target), 1000);
  });

  document.querySelector("form #subject").addEventListener("input", sanitize);
  document.querySelector("form #body").addEventListener("input", sanitize);
});

function smooth(target, duration) {
  let targetPosition = target.getBoundingClientRect().top;
  let startPosition = window.pageYOffset;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;

    let timeElapsed = currentTime - startTime;
    let run = ease(timeElapsed, startPosition, targetPosition, duration);

    window.scrollTo(0, run);

    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  function ease(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }
  window.requestAnimationFrame(animation);
}

function addFocus(t) {
  t.nextSibling.focus();
  if (document.activeElement === t.nextSibling) {
    return false;
  } else {
    t.nextSibling.setAttribute("tabindex", "-1"); // Adding tabindex for elements not focusable
    t.nextSibling.focus(); // Set focus again
  }
}

function sanitize(e) {
  // e.target.value = escapeRegExp(e.target.value);
}

function escapeRegExp(text) {
  // return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

window.AOS.init({
  easing: "ease",
  duration: 1800,
  once: true
});
