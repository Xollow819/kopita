const ID = window.KOPITA_ID || {};
const EN = window.KOPITA_EN || {};
const translate = (key) => (lang === "id" ? ID[key] ?? EN[key] : EN[key]);
let lang = localStorage.getItem("kopita-lang") || "id";
let cart = [];
try {
  cart = JSON.parse(localStorage.getItem("kopita-cart") || "[]");
  if (!Array.isArray(cart)) cart = [];
} catch {
  cart = [];
}

const texts = [...document.querySelectorAll("[data-i18n]")].map((el) => [el, el.dataset.i18n]);
const htmlTexts = [...document.querySelectorAll("[data-i18n-html]")].map((el) => [el, el.dataset.i18nHtml]);
const drawer = document.querySelector("#drawer");
const backdrop = document.querySelector("#backdrop");
const cartItems = document.querySelector("#cartItems");
const total = document.querySelector("#total");
const toast = document.querySelector("#toast");
const fab = document.querySelector("[data-cart-open]");
const burger = document.querySelector("#burger");
const mobile = document.querySelector("#mobile");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const phone = "6282161750504";
let lastFocusedElement = null;
let toastTimer;

if (reduceMotion) {
  const processGif = document.querySelector(".process-gif");
  if (processGif) processGif.src = "./assets/story/process-new-poster.jpg";
}

const rupiah = (amount) => new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
}).format(amount);

function updateAddLabels() {
  document.querySelectorAll(".add").forEach((button) => {
    const name = lang === "id" ? button.dataset.idname : button.dataset.en;
    button.setAttribute("aria-label", `${translate("addToCart") || "Add"} ${name}`);
  });
}

function updateCartLabel(count) {
  const label = lang === "id" ? `Buka keranjang, ${count} item` : `Open cart, ${count} item${count === 1 ? "" : "s"}`;
  fab?.setAttribute("aria-label", label);
}

function render() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const amount = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  document.querySelectorAll("[data-count]").forEach((el) => {
    el.textContent = count;
    el.hidden = !count;
  });
  updateCartLabel(count);
  total.textContent = rupiah(amount);

  if (!cart.length) {
    cartItems.innerHTML = `<div class="empty"><div><div aria-hidden="true">+</div><strong>${translate("emptyTitle")}</strong><p>${translate("emptyCopy")}</p></div></div>`;
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => {
    const name = lang === "id" ? item.nameId : item.nameEn;
    return `<div class="cart-item">
      <div><h3>${name}</h3><p>${rupiah(item.price * item.qty)}</p></div>
      <div class="qty">
        <button type="button" data-minus="${index}" aria-label="${translate("decrease") || "Decrease quantity of"} ${name}">−</button>
        <strong aria-live="polite">${item.qty}</strong>
        <button type="button" data-plus="${index}" aria-label="${translate("increase") || "Increase quantity of"} ${name}">+</button>
      </div>
    </div>`;
  }).join("");
}

function save() {
  localStorage.setItem("kopita-cart", JSON.stringify(cart));
  render();
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 1800);
}

function getDialogFocusables() {
  return [...drawer.querySelectorAll("button:not([disabled]), [href], [tabindex]:not([tabindex='-1'])")]
    .filter((el) => el.offsetParent !== null);
}

function openCart() {
  if (drawer.classList.contains("open")) return;
  lastFocusedElement = document.activeElement;
  toast.hidden = true;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
  document.body.classList.add("lock");
  fab?.setAttribute("aria-expanded", "true");
  window.requestAnimationFrame(() => document.querySelector("#close")?.focus());
}

function closeCart(restoreFocus = true) {
  if (!drawer.classList.contains("open")) return;
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  backdrop.hidden = true;
  document.body.classList.remove("lock");
  fab?.setAttribute("aria-expanded", "false");
  if (restoreFocus && lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function setLang(nextLang) {
  lang = nextLang === "en" ? "en" : "id";
  localStorage.setItem("kopita-lang", lang);
  document.documentElement.lang = lang;
  texts.forEach(([el, key]) => {
    const value = translate(key);
    if (value !== undefined) el.textContent = value;
  });
  htmlTexts.forEach(([el, key]) => {
    const value = translate(key);
    if (value !== undefined) el.innerHTML = value;
  });
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
    button.setAttribute("aria-pressed", button.dataset.lang === lang ? "true" : "false");
  });
  updateAddLabels();
  render();
}

document.querySelectorAll("[data-lang]").forEach((button) => {
  button.addEventListener("click", () => setLang(button.dataset.lang));
});

document.querySelectorAll(".add").forEach((button) => {
  button.addEventListener("click", () => {
    const existing = cart.find((item) => item.id === button.dataset.id);
    if (existing) existing.qty += 1;
    else cart.push({
      id: button.dataset.id,
      nameEn: button.dataset.en,
      nameId: button.dataset.idname,
      price: Number(button.dataset.price),
      qty: 1,
    });
    save();
    const name = lang === "id" ? button.dataset.idname : button.dataset.en;
    showToast(`${name} ${translate("added")}`);
  });
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  const index = Number(button.dataset.plus ?? button.dataset.minus);
  if (!Number.isInteger(index) || !cart[index]) return;
  if (button.dataset.plus !== undefined) cart[index].qty += 1;
  if (button.dataset.minus !== undefined) {
    cart[index].qty -= 1;
    if (cart[index].qty < 1) cart.splice(index, 1);
  }
  save();
});

document.querySelectorAll("[data-cart-open]").forEach((button) => button.addEventListener("click", openCart));
document.querySelector("#close")?.addEventListener("click", () => closeCart());
backdrop.addEventListener("click", () => closeCart());

document.addEventListener("keydown", (event) => {
  if (!drawer.classList.contains("open")) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeCart();
    return;
  }
  if (event.key !== "Tab") return;
  const focusables = getDialogFocusables();
  if (!focusables.length) {
    event.preventDefault();
    drawer.focus();
    return;
  }
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

document.querySelectorAll("[data-quick]").forEach((button) => {
  button.addEventListener("click", () => {
    const message = lang === "id"
      ? `Halo KOPI TA! Saya ingin memesan minuman untuk teman nugas.\nNama:\nPesanan:\nWaktu pengambilan:`
      : `Hello KOPI TA! I would like to order a drink for my study session.\nName:\nOrder:\nPickup time:`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  });
});

document.querySelector("#checkout")?.addEventListener("click", () => {
  if (!cart.length) {
    showToast(translate("emptyToast"));
    return;
  }
  const lines = cart.map((item) => `• ${item.qty}x ${lang === "id" ? item.nameId : item.nameEn} (${rupiah(item.qty * item.price)})`);
  const amount = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const message = lang === "id"
    ? ["Halo KOPI TA! Saya ingin memesan:", "", ...lines, "", `Total: ${rupiah(amount)}`, "", "Nama:", "Waktu pengambilan:"]
    : ["Hello KOPI TA! I would like to order:", "", ...lines, "", `Total: ${rupiah(amount)}`, "", "Name:", "Pickup time:"];
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message.join("\n"))}`, "_blank", "noopener");
});

burger.addEventListener("click", () => {
  const isOpen = mobile.classList.toggle("open");
  burger.textContent = isOpen ? "×" : "≡";
  burger.setAttribute("aria-expanded", String(isOpen));
});
mobile.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  mobile.classList.remove("open");
  burger.textContent = "≡";
  burger.setAttribute("aria-expanded", "false");
}));

const nav = document.querySelector("#nav");
window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 24), { passive: true });

const sections = [...document.querySelectorAll("[data-story-section]")];
const railLinks = [...document.querySelectorAll("[data-chapter]")];
const progress = document.querySelector("#railProgress");
if (sections.length) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    railLinks.forEach((link) => {
      const active = link.dataset.chapter === entry.target.dataset.storySection;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    });
  }), { rootMargin: "-42% 0px -42% 0px" });
  sections.forEach((section) => observer.observe(section));
  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.height = `${max ? Math.min(100, (window.scrollY / max) * 100) : 0}%`;
  }, { passive: true });
}

setLang(lang);
