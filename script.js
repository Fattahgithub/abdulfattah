const cursorLight = document.querySelector(".cursor-light");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

window.addEventListener("pointermove", (event) => {
    if (!cursorLight) return;
    cursorLight.style.left = `${event.clientX}px`;
    cursorLight.style.top = `${event.clientY}px`;
});

const animateCounter = (counter) => {
    if (counter.dataset.done) return;
    counter.dataset.done = "true";

    const target = Number(counter.dataset.count);
    const duration = 1300;
    const start = performance.now();

    const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            counter.textContent = `${target}+`;
        }
    };

    requestAnimationFrame(tick);
};

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                entry.target.querySelectorAll("[data-count]").forEach(animateCounter);
            }
        });
    },
    {
        threshold: 0.16
    }
);

revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 70, 420)}ms`;
    observer.observe(item);
});

counters.forEach((counter) => {
    if (!counter.closest(".reveal")) {
        animateCounter(counter);
    }
});

if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("is-open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("is-open");
            menuButton.setAttribute("aria-expanded", "false");
        });
    });
}
