(function () {
  const { products, categories, faqs, reviews } = window.BITBLOC;

  const state = {
    category: "all",
    query: "",
    sort: "featured",
    openFaq: 0,
  };

  const els = {
    featuredGrid: document.getElementById("featured-grid"),
    productGrid: document.getElementById("product-grid"),
    productsCount: document.getElementById("products-count"),
    productsEmpty: document.getElementById("products-empty"),
    filterChips: document.getElementById("filter-chips"),
    searchInput: document.getElementById("search-input"),
    sortSelect: document.getElementById("sort-select"),
    categoryList: document.getElementById("category-list"),
    reviewsGrid: document.getElementById("reviews-grid"),
    faqList: document.getElementById("faq-list"),
    modal: document.getElementById("product-modal"),
    modalClose: document.getElementById("modal-close"),
    modalVisual: document.getElementById("modal-visual"),
    modalEyebrow: document.getElementById("modal-eyebrow"),
    modalTitle: document.getElementById("modal-title"),
    modalDescription: document.getElementById("modal-description"),
    modalBadges: document.getElementById("modal-badges"),
    modalSpecs: document.getElementById("modal-specs"),
    modalPrice: document.getElementById("modal-price"),
    modalOldPrice: document.getElementById("modal-old-price"),
    modalStock: document.getElementById("modal-stock"),
    newsletterForm: document.getElementById("newsletter-form"),
    newsletterOk: document.getElementById("newsletter-ok"),
    year: document.getElementById("year"),
  };

  function formatPrice(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function blocStack(large) {
    return `
      <div class="bloc-stack${large ? " bloc-stack--lg" : ""}" aria-hidden="true">
        <span class="bloc bloc--a"></span>
        <span class="bloc bloc--b"></span>
        <span class="bloc bloc--c"></span>
      </div>
    `;
  }

  function getFiltered() {
    const q = state.query.trim().toLowerCase();
    let list = products.filter((product) => {
      const catOk = state.category === "all" || product.category === state.category;
      const text = `${product.name} ${product.tagline} ${product.badges.join(" ")}`.toLowerCase();
      const qOk = !q || text.includes(q);
      return catOk && qOk;
    });

    switch (state.sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        list = [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
        break;
    }

    return list;
  }

  function renderFeatured() {
    const featured = products.filter((p) => p.featured);
    els.featuredGrid.innerHTML = featured
      .map(
        (product) => `
      <article class="featured-card featured-card--${product.accent}">
        <div class="featured-card__copy">
          <p class="featured-card__eyebrow">${product.badges.join(" · ")}</p>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <ul>
            ${product.specs
              .slice(0, 3)
              .map((spec) => `<li>${spec}</li>`)
              .join("")}
          </ul>
          <div class="featured-card__row">
            <strong>${formatPrice(product.price)}</strong>
            <a href="#produtos" class="btn btn--primary">Ver na vitrine</a>
          </div>
        </div>
        <div class="featured-card__visual" aria-hidden="true">
          <div class="circuit-orb"></div>
          ${blocStack(true)}
        </div>
      </article>
    `,
      )
      .join("");
  }

  function renderFilters() {
    const chips = [
      { id: "all", title: "Todos" },
      ...categories.map((c) => ({ id: c.id, title: c.title })),
    ];

    els.filterChips.innerHTML = chips
      .map(
        (chip) => `
      <button type="button" data-category="${chip.id}" class="${
          state.category === chip.id ? "is-active" : ""
        }">${chip.title}</button>
    `,
      )
      .join("");
  }

  function renderProducts() {
    const filtered = getFiltered();
    els.productsCount.textContent = `${filtered.length} itens`;
    els.productsEmpty.hidden = filtered.length > 0;

    els.productGrid.innerHTML = filtered
      .map(
        (product) => `
      <li class="product-tile product-tile--${product.accent}">
        <button type="button" class="product-tile__hit" data-open="${product.id}" aria-label="Ver detalhes de ${product.name}">
          <div class="product-tile__visual" aria-hidden="true">
            ${blocStack(false)}
            <span class="product-tile__age">${product.age}</span>
            ${
              product.badges[0]
                ? `<span class="product-tile__badge">${product.badges[0]}</span>`
                : ""
            }
          </div>
          <div class="product-tile__body">
            <div class="product-tile__meta">
              <span>★ ${product.rating.toFixed(1)} · ${product.reviews}</span>
              <span>${product.stock < 10 ? `${product.stock} restam` : "Em estoque"}</span>
            </div>
            <h3>${product.name}</h3>
            <p>${product.tagline}</p>
            <div class="product-tile__row">
              <div class="product-tile__price">
                <strong>${formatPrice(product.price)}</strong>
                ${product.oldPrice ? `<s>${formatPrice(product.oldPrice)}</s>` : ""}
              </div>
            </div>
          </div>
        </button>
        <div class="product-tile__actions">
          <button type="button" class="btn btn--small btn--block" data-open="${product.id}">
            Ver detalhes
          </button>
        </div>
      </li>
    `,
      )
      .join("");
  }

  function renderCategories() {
    els.categoryList.innerHTML = categories
      .map(
        (category, index) => `
      <li class="category-row">
        <span class="category-row__index">0${index + 1}</span>
        <div>
          <h3>${category.title}</h3>
          <p>${category.description}</p>
        </div>
        <a href="#produtos" class="category-row__link" data-jump-category="${category.id}">Ver itens</a>
      </li>
    `,
      )
      .join("");
  }

  function renderReviews() {
    els.reviewsGrid.innerHTML = reviews
      .map(
        (review) => `
      <li>
        <blockquote>
          <p>“${review.text}”</p>
          <footer>${review.name} · ${review.age} anos</footer>
        </blockquote>
      </li>
    `,
      )
      .join("");
  }

  function renderFaq() {
    els.faqList.innerHTML = faqs
      .map(
        (item, index) => `
      <div class="faq__item ${state.openFaq === index ? "is-open" : ""}">
        <button type="button" class="faq__q" data-faq="${index}" aria-expanded="${
          state.openFaq === index
        }">
          ${item.q}
          <span aria-hidden="true">${state.openFaq === index ? "−" : "+"}</span>
        </button>
        ${state.openFaq === index ? `<p class="faq__a">${item.a}</p>` : ""}
      </div>
    `,
      )
      .join("");
  }

  function openModal(productId) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    els.modalVisual.className = `product-modal__visual product-tile--${product.accent}`;
    els.modalVisual.innerHTML = blocStack(true);
    els.modalEyebrow.textContent = `${product.age} · ★ ${product.rating.toFixed(1)} (${product.reviews} reviews)`;
    els.modalTitle.textContent = product.name;
    els.modalDescription.textContent = product.description;
    els.modalBadges.innerHTML = product.badges.map((b) => `<li>${b}</li>`).join("");
    els.modalSpecs.innerHTML = product.specs.map((s) => `<li>${s}</li>`).join("");
    els.modalPrice.textContent = formatPrice(product.price);

    if (product.oldPrice) {
      els.modalOldPrice.hidden = false;
      els.modalOldPrice.textContent = formatPrice(product.oldPrice);
    } else {
      els.modalOldPrice.hidden = true;
      els.modalOldPrice.textContent = "";
    }

    els.modalStock.textContent =
      product.stock > 0 ? `${product.stock} em estoque` : "Indisponível";

    els.modal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    els.modal.hidden = true;
    document.body.style.overflow = "";
  }

  function bindEvents() {
    els.filterChips.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-category]");
      if (!button) return;
      state.category = button.dataset.category;
      renderFilters();
      renderProducts();
    });

    els.searchInput.addEventListener("input", (event) => {
      state.query = event.target.value;
      renderProducts();
    });

    els.sortSelect.addEventListener("change", (event) => {
      state.sort = event.target.value;
      renderProducts();
    });

    els.productGrid.addEventListener("click", (event) => {
      const opener = event.target.closest("[data-open]");
      if (!opener) return;
      openModal(opener.dataset.open);
    });

    els.categoryList.addEventListener("click", (event) => {
      const link = event.target.closest("[data-jump-category]");
      if (!link) return;
      state.category = link.dataset.jumpCategory;
      renderFilters();
      renderProducts();
    });

    els.faqList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-faq]");
      if (!button) return;
      const index = Number(button.dataset.faq);
      state.openFaq = state.openFaq === index ? -1 : index;
      renderFaq();
    });

    els.modalClose.addEventListener("click", closeModal);
    els.modal.addEventListener("click", (event) => {
      if (event.target === els.modal) closeModal();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !els.modal.hidden) closeModal();
    });

    els.newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      els.newsletterForm.hidden = true;
      els.newsletterOk.hidden = false;
    });
  }

  function init() {
    els.year.textContent = String(new Date().getFullYear());
    renderFeatured();
    renderFilters();
    renderProducts();
    renderCategories();
    renderReviews();
    renderFaq();
    bindEvents();
  }

  init();
})();
