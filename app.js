const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav a");
const sections = Array.from(document.querySelectorAll("main section[id]"));
const carousel = document.querySelector("[data-carousel]");
const productDropdown = document.querySelector("[data-product-dropdown]");
const productDropdownToggle = document.querySelector("[data-product-dropdown-toggle]");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxHtml = document.getElementById("lightboxHtml");
const lightboxCaption = document.getElementById("lightboxCaption");

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

if (productDropdown && productDropdownToggle) {
  productDropdownToggle.addEventListener("click", () => {
    const isOpen = productDropdown.classList.toggle("is-open");
    productDropdownToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!productDropdown.contains(event.target)) {
      productDropdown.classList.remove("is-open");
      productDropdownToggle.setAttribute("aria-expanded", "false");
    }
  });

  productDropdown.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      productDropdown.classList.remove("is-open");
      productDropdownToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
  const prevButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const dots = Array.from(document.querySelectorAll("[data-carousel-dot]"));
  let activeIndex = 0;

  const renderCarousel = () => {
    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === activeIndex);
    });
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  };

  prevButton?.addEventListener("click", () => {
    activeIndex = (activeIndex - 1 + slides.length) % slides.length;
    renderCarousel();
  });

  nextButton?.addEventListener("click", () => {
    activeIndex = (activeIndex + 1) % slides.length;
    renderCarousel();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      activeIndex = index;
      renderCarousel();
    });
  });

  renderCarousel();
}

const openLightboxImage = (src, title, alt) => {
  if (!lightbox || !lightboxImage || !lightboxCaption || !lightboxHtml) return;
  lightboxHtml.innerHTML = "";
  lightboxHtml.style.display = "none";
  lightboxImage.style.display = "block";
  lightboxImage.src = src;
  lightboxImage.alt = alt || title || "Screenshot";
  lightboxCaption.textContent = title || "";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const openLightboxHtml = (contentNode, title) => {
  if (!lightbox || !lightboxImage || !lightboxCaption || !lightboxHtml || !contentNode) return;
  lightboxImage.src = "";
  lightboxImage.alt = "";
  lightboxImage.style.display = "none";
  lightboxHtml.innerHTML = "";
  lightboxHtml.appendChild(contentNode.cloneNode(true));
  lightboxHtml.style.display = "block";
  lightboxCaption.textContent = title || "";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImage || !lightboxCaption || !lightboxHtml) return;
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  lightboxImage.style.display = "";
  lightboxHtml.innerHTML = "";
  lightboxHtml.style.display = "none";
  lightboxCaption.textContent = "";
  document.body.style.overflow = "";
};

document.querySelectorAll("[data-lightbox-trigger]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openLightboxImage(
      trigger.getAttribute("data-lightbox-src"),
      trigger.getAttribute("data-lightbox-title"),
      trigger.querySelector("img")?.alt || ""
    );
  });
});

document.querySelectorAll("[data-table-lightbox-trigger]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openLightboxHtml(
      trigger,
      trigger.getAttribute("data-table-lightbox-title") || "Preview"
    );
  });
});

document.querySelector("[data-lightbox-close]")?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});
