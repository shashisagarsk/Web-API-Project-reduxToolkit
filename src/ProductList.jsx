import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from './redux/productSlice';

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const productStatus = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  // State to keep track of selected category and price
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');

  // Fetch products when the component mounts
  useEffect(() => {
    if (productStatus === 'idle') {
      dispatch(fetchProducts());
    }
  }, [productStatus, dispatch]);

  // Extract unique categories from products
  const categories = ['all', ...new Set(products.map((product) => product.category))];

  // Price ranges (you can adjust these based on your needs)
  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under $50', value: 'under50' },
    { label: '$50 to $100', value: '50to100' },
    { label: 'Above $100', value: 'above100' },
  ];

  // Filter products based on selected category and price
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

  return (
    <div style={styles.container}>
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
            <button style={styles.button}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '60px',
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
};

export default ProductList;
