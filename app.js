const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav a");
const sections = Array.from(document.querySelectorAll("main section[id]"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const syncActiveNav = () => {
  const offset = window.scrollY + window.innerHeight * 0.28;
  let currentId = "";

  sections.forEach((section) => {
    if (section.offsetTop <= offset) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentId}`;
    link.classList.toggle("active", isActive);
  });
};

syncActiveNav();
window.addEventListener("scroll", syncActiveNav, { passive: true });
