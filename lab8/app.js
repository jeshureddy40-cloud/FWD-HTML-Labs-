// Base Product class
class Product {
  constructor({ id, name, price, description, category }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
    this.category = category;
  }

  getFormattedPrice() {
    return `₹${this.price.toFixed(2)}`;
  }

  getTypeLabel() {
    return "Standard";
  }

  renderCard() {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-card__badge-row">
        <span class="badge badge--category">${this.category}</span>
        <span class="badge badge--type">${this.getTypeLabel()}</span>
      </div>
      <h2 class="product-card__title">${this.name}</h2>
      <p class="product-card__description">${this.description}</p>
      <div class="product-card__price-row">
        <span class="price">${this.getFormattedPrice()}</span>
        <button class="button" type="button">View Details</button>
      </div>
    `;

    card.querySelector(".button").addEventListener("click", () => {
      alert(`Viewing details for: ${this.name}`);
    });

    return card;
  }
}

// Subclass: PhysicalProduct
class PhysicalProduct extends Product {
  constructor(props) {
    super(props);
    this.weight = props.weight;
  }

  getTypeLabel() {
    return "Physical";
  }
}

// Subclass: DigitalProduct
class DigitalProduct extends Product {
  constructor(props) {
    super(props);
    this.fileSize = props.fileSize;
  }

  getTypeLabel() {
    return "Digital";
  }
}

// Subclass: FeaturedProduct
class FeaturedProduct extends Product {
  constructor(props) {
    super(props);
    this.ribbon = props.ribbon || "Featured";
  }

  getTypeLabel() {
    return this.ribbon;
  }

  renderCard() {
    const card = super.renderCard();
    card.classList.add("product-card--featured");
    return card;
  }
}

// ----- Sample data -----
const products = [
  new PhysicalProduct({
    id: 1,
    name: "Voyager Backpack",
    price: 2499,
    description: "Durable everyday backpack with padded laptop sleeve.",
    category: "Gear",
    weight: "900g"
  }),
  new DigitalProduct({
    id: 2,
    name: "UI Icon Pack",
    price: 799,
    description: "Collection of 600+ crisp SVG icons for web projects.",
    category: "Assets",
    fileSize: "12MB"
  }),
  new FeaturedProduct({
    id: 3,
    name: "UltraWide Monitor 34\"",
    price: 38999,
    description: "Immersive ultra‑wide display for multitasking and gaming.",
    category: "Electronics",
    ribbon: "Bestseller"
  }),
  new PhysicalProduct({
    id: 4,
    name: "Ceramic Desk Mug",
    price: 599,
    description: "Heat‑retaining mug with soft‑touch silicone base.",
    category: "Home"
  })
];

// ----- Render products -----
const grid = document.getElementById("productGrid");
products.forEach((p) => grid.appendChild(p.renderCard()));

// ----- Theme switching using CSS custom properties -----
const themeSelect = document.getElementById("themeSelect");
const body = document.body;

themeSelect.addEventListener("change", () => {
  const value = themeSelect.value; // "light" | "dark" | "ocean"
  body.classList.remove("theme-light", "theme-dark", "theme-ocean");
  body.classList.add(`theme-${value}`);
});
