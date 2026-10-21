const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.setAttribute("aria-label", "Toggle navigation");
menuBtn.setAttribute("aria-expanded", "false");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
  menuBtn.setAttribute("aria-expanded", isOpen);
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
  menuBtn.setAttribute("aria-expanded", "false");
});

const scrollRevealOption = {
  origin: "bottom",
  distance: "50px",
  duration: 1000,
};

const reveal = typeof ScrollReveal === "function" ? ScrollReveal() : null;

reveal?.reveal(".header__container h1", {
  ...scrollRevealOption,
});
reveal?.reveal(".header__container form", {
  ...scrollRevealOption,
  delay: 500,
});
reveal?.reveal(".header__container img", {
  ...scrollRevealOption,
  delay: 1000,
});

reveal?.reveal(".range__card", {
  duration: 1000,
  interval: 500,
});

reveal?.reveal(".location__image img", {
  ...scrollRevealOption,
  origin: "right",
});
reveal?.reveal(".location__content .section__header", {
  ...scrollRevealOption,
  delay: 500,
});
reveal?.reveal(".location__content p", {
  ...scrollRevealOption,
  delay: 1000,
});
reveal?.reveal(".location__content .location__btn", {
  ...scrollRevealOption,
  delay: 1500,
});

const selectCards = document.querySelectorAll(".select__card");
selectCards[0].classList.add("show__info");

const price = ["225", "455", "275", "625", "395"];

const priceEl = document.getElementById("select-price");

function updateSwiperImage(eventName, args) {
  if (eventName === "slideChangeTransitionStart") {
    const index = args && args[0].realIndex;
    priceEl.innerText = `${price[index]} DH`;
    selectCards.forEach((item) => {
      item.classList.remove("show__info");
    });
    selectCards[index].classList.add("show__info");
  }
}

const swiper = new Swiper(".swiper", {
  loop: true,
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 0,
    depth: 500,
    modifier: 1,
    scale: 0.75,
    slideShadows: false,
    stretch: -100,
  },

  onAny(event, ...args) {
    updateSwiperImage(event, args);
  },
});

reveal?.reveal(".story__card", {
  ...scrollRevealOption,
  interval: 500,
});

const banner = document.querySelector(".banner__wrapper");

const bannerContent = Array.from(banner.children);

bannerContent.forEach((item) => {
  const duplicateNode = item.cloneNode(true);
  duplicateNode.setAttribute("aria-hidden", true);
  banner.appendChild(duplicateNode);
});

reveal?.reveal(".download__image img", {
  ...scrollRevealOption,
  origin: "right",
});
reveal?.reveal(".download__content .section__header", {
  ...scrollRevealOption,
  delay: 500,
});
reveal?.reveal(".download__links", {
  ...scrollRevealOption,
  delay: 1000,
});

document.querySelector(".search__form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#ride").scrollIntoView({ behavior: "smooth" });
  showToast("Here are the cars available for your trip.");
});

document.querySelectorAll("[data-scroll-to]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelector(button.dataset.scrollTo).scrollIntoView({ behavior: "smooth" });
  });
});

const carNames = ["Urban Cruiser", "Atlas Explorer", "Coast Runner", "Grand Tourer", "Desert Line"];
const bookingModal = document.getElementById("booking-modal");
const bookingCar = document.getElementById("booking-car");
const bookingPrice = document.getElementById("booking-price");

function openBooking(index) {
  bookingCar.textContent = carNames[index];
  bookingPrice.textContent = `${price[index]} DH / day`;
  bookingModal.classList.add("modal--open");
  bookingModal.setAttribute("aria-hidden", "false");
  document.getElementById("booking-name").focus();
}

function closeBooking() {
  bookingModal.classList.remove("modal--open");
  bookingModal.setAttribute("aria-hidden", "true");
}

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeBooking);
});

document.querySelector(".booking__form").addEventListener("submit", (event) => {
  event.preventDefault();
  closeBooking();
  event.currentTarget.reset();
  showToast("Request received. We'll be in touch shortly.");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && bookingModal.classList.contains("modal--open")) {
    closeBooking();
  }
});

document.querySelectorAll("[data-filter]").forEach((filterLink) => {
  filterLink.addEventListener("click", (event) => {
    event.preventDefault();
    const firstMatch = Array.from(document.querySelectorAll(".swiper-slide")).findIndex(
      (slide) => slide.dataset.type === filterLink.dataset.filter,
    );
    if (firstMatch >= 0) {
      swiper.slideToLoop(firstMatch);
    }
    document.querySelector("#ride").scrollIntoView({ behavior: "smooth" });
    showToast(`Showing our ${filterLink.dataset.filter} collection.`);
  });
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const activeIndex = swiper.realIndex;
    if (button.dataset.action === "rent") {
      openBooking(activeIndex);
      return;
    }
    showToast(`${carNames[activeIndex]} is available from ${price[activeIndex]} DH per day.`);
  });
});

document.querySelector(".newsletter__form").addEventListener("submit", (event) => {
  event.preventDefault();
  event.currentTarget.reset();
  showToast("You're on the list. Watch your inbox.");
});

function showToast(message) {
  let toast = document.querySelector(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("toast--visible");
  window.clearTimeout(toast.hideTimer);
  toast.hideTimer = window.setTimeout(() => {
    toast.classList.remove("toast--visible");
  }, 3200);
}