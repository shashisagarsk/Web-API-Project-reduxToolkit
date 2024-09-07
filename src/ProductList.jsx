import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from './redux/productSlice';
import { addToCart } from './redux/cartSlice';  // Import the addToCart action

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const productStatus = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const cartItems = useSelector((state) => state.cart.items); // Access cart items

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [productStatus, dispatch]);

  const categories = ['all', ...new Set(products.map((product) => product.category))];

  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under $50', value: 'under50' },
    { label: '$50 to $100', value: '50to100' },
    { label: 'Above $100', value: 'above100' },
  ];

  const filteredProducts = products
    .filter((product) => selectedCategory === 'all' || product.category === selectedCategory)
    .filter((product) => {
      if (selectedPriceRange === 'all') return true;
      if (selectedPriceRange === 'under50') return product.price < 50;
      if (selectedPriceRange === '50to100') return product.price >= 50 && product.price <= 100;
      if (selectedPriceRange === 'above100') return product.price > 100;
      return true;
    });

  if (productStatus === 'loading') {
    return <div>Loading...</div>;
  }

  if (productStatus === 'failed') {
    return <div>Error: {error}</div>;
  }

  const handleAddToCart = (product) => {
    dispatch(addToCart(product)); // Dispatch addToCart action when clicking the button
  };

  // Calculate total items in the cart
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div style={styles.container}>
      {/* Cart Icon and Total Items */}
      <div style={styles.cartIconContainer}>
        <div style={styles.cartIcon}>
          🛒 {/* Cart icon, you can replace it with an actual image or Font Awesome icon */}
        </div>
        <div style={styles.cartCount}>{totalItemsInCart}</div>
      </div>

      <h1 style={styles.header}>Product List with Filters</h1>

      {/* Dropdown to select category */}
      <div style={styles.dropdownContainer}>
        <label htmlFor="category" style={styles.label}>Choose a category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={styles.select}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown to select price range */}
      <div style={styles.dropdownContainer}>
        <label htmlFor="price" style={styles.label}>Choose a price range:</label>
        <select
          id="price"
          value={selectedPriceRange}
          onChange={(e) => setSelectedPriceRange(e.target.value)}
          style={styles.select}
        >
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Display filtered products */}
      <div style={styles.productGrid}>
        {filteredProducts.map((product) => (
          <div key={product.id} style={styles.card}>
            <img src={product.image} alt={product.title} style={styles.image} />
            <h2 style={styles.title}>{product.title}</h2>
            <p>{product.description.substring(0, 100)}...</p>
            <div style={styles.price}>${product.price}</div>
            <button style={styles.button} onClick={() => handleAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '60px',
    position: 'relative',
  },
  header: {
    textAlign: 'center',
  },
  dropdownContainer: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  label: {
    marginRight: '10px',
    fontSize: '18px',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    marginRight: '10px',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '20px',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    marginBottom: '10px',
  },
  title: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  price: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cartIconContainer: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    border: '1px solid #ddd',
  },
  cartIcon: {
    fontSize: '24px',
    marginRight: '8px',
  },
  cartCount: {
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '50%',
    padding: '5px 10px',
  },
};

export default ProductList;
