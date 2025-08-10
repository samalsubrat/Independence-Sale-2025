// Products management script
class ProductsManager {
  constructor() {
    this.products = [];
    this.container = null;
  }

  // Initialize the products manager
  init() {
    this.container = document.getElementById('products-container');
    if (!this.container) {
      console.error('Products container not found');
      return;
    }
    
    // Load products from JSON file or use default data
    this.loadProducts();
  }

  // Load products from external JSON file
  async loadProducts(url = 'products.json') {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      this.products = data;
      this.renderProducts();
    } catch (error) {
      console.error('Error loading products:', error);
      console.log('Using fallback data...');
      this.loadFallbackData();
    }
  }

  // Fallback data if JSON file is not available
  loadFallbackData() {
    this.products = [
      {
        name: "Arion Frost x Keychron K8 Pro",
        image: "https://mks.blr1.cdn.digitaloceanspaces.com/uploads/2023/11/2.jpg",
        price: 7999,
        originalPrice: 15000,
        description: "Get Deskmat L (Free)"
      },
      {
        name: "Royal Kludge RK R87 PRO",
        image: "https://mks.blr1.cdn.digitaloceanspaces.com/uploads/2023/11/rk87.jpg",
        price: 4700,
        originalPrice: 7000,
        description: "87-key TKL mechanical gaming keyboard"
      },
      {
        name: "Hello Ganss GS 87C-HT",
        image: "https://mks.blr1.cdn.digitaloceanspaces.com/uploads/2023/11/ganss.jpg",
        price: 3999,
        originalPrice: 6499,
        description: "Compact mechanical keyboard with premium switches"
      }
    ];
    this.renderProducts();
  }

  // Create HTML for a single product card
  createProductCard(product, index) {
    return `
      <div class="p-5 rounded-xl border border-white/30 bg-white/5 backdrop-blur-xl shadow-md hover-lift transition-all duration-300 opacity-0 animate-fade-in-scale" style="animation-delay: ${index * 0.1}s">
        <img
          src="${product.image}"
          alt="${product.name}"
          class="rounded-md mb-4 h-72 w-full object-cover"
          onerror="this.src='/api/placeholder/300/300?text=${encodeURIComponent(product.name)}'"
        />
        <h1 class="font-semibold text-lg mb-2">${product.name}</h1>
        <div class="flex items-end gap-2 mb-2">
          <h1 class="font-bold text-2xl text-orange-500">₹${this.formatPrice(product.price)}</h1>
          <h2 class="text-md text-gray-500 line-through">₹${this.formatPrice(product.originalPrice)}</h2>
        </div>
        <h3 class="text-sm text-gray-500 mb-4">${product.description}</h3>
        <button 
          class="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4 rounded-full font-medium hover:shadow-lg transition-all duration-300"
          onclick="productsManager.buyProduct('${product.name}')"
        >
          Buy Now
        </button>
      </div>
    `;
  }

  // Format price with Indian number system
  formatPrice(price) {
    return price.toLocaleString('en-IN');
  }

  // Render all products to the container
  renderProducts() {
    if (!this.container || !this.products.length) return;

    this.container.innerHTML = this.products
      .map((product, index) => this.createProductCard(product, index))
      .join('');
  }

  // Add new product
  addProduct(product) {
    this.products.push(product);
    this.renderProducts();
  }

  // Update existing product
  updateProduct(index, updatedProduct) {
    if (index >= 0 && index < this.products.length) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      this.renderProducts();
    }
  }

  // Remove product
  removeProduct(index) {
    if (index >= 0 && index < this.products.length) {
      this.products.splice(index, 1);
      this.renderProducts();
    }
  }

  // Update all products with new data
  updateAllProducts(newProducts) {
    this.products = newProducts;
    this.renderProducts();
  }

  // Handle buy button click
  buyProduct(productName) {
    console.log(`Buying product: ${productName}`);
    // Add your buy logic here
    alert(`Added "${productName}" to cart!`);
  }

  // Filter products by price range
  filterByPriceRange(minPrice, maxPrice) {
    const filtered = this.products.filter(
      product => product.price >= minPrice && product.price <= maxPrice
    );
    
    // Temporarily show filtered products
    const originalProducts = [...this.products];
    this.products = filtered;
    this.renderProducts();
    
    // Return function to restore original products
    return () => {
      this.products = originalProducts;
      this.renderProducts();
    };
  }

  // Search products by name
  searchProducts(query) {
    const filtered = this.products.filter(
      product => product.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Temporarily show filtered products
    const originalProducts = [...this.products];
    this.products = filtered;
    this.renderProducts();
    
    // Return function to restore original products
    return () => {
      this.products = originalProducts;
      this.renderProducts();
    };
  }
}

// Global instance
const productsManager = new ProductsManager();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  productsManager.init();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ProductsManager;
}
