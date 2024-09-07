import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from './redux/productSlice';
import { addToCart, removeFromCart } from './redux/cartSlice';  // Import the actions

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const productStatus = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const cartItems = useSelector((state) => state.cart.items); // Access cart items

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [showCheckout, setShowCheckout] = useState(false); // To toggle the checkout view
  const [showDeliveryForm, setShowDeliveryForm] = useState(false); // Toggle the delivery form view
  const [userDetails, setUserDetails] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
  });

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

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product)); // Dispatch removeFromCart action when clicking the button
  };

  // Calculate total items and total price in the cart
  const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalPriceInCart = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // Function to handle Buy Now click
  const handleBuyNowClick = () => {
    setShowDeliveryForm(true);
  };

  // Function to simulate checkout after delivery details are filled
  const handleCheckout = (e) => {
    e.preventDefault(); // Prevent form submission
    alert(`Purchase successful! Total: $${totalPriceInCart.toFixed(2)}\nDelivery to: ${userDetails.name}, ${userDetails.address}, ${userDetails.city}, ${userDetails.postalCode}`);
    // You can clear the cart or redirect the user here
    setShowDeliveryForm(false);
  };

  // Function to handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  return (
    <div style={styles.container}>
      {/* Cart Icon and Total Items */}
      <div style={styles.cartIconContainer} onClick={() => setShowCheckout(!showCheckout)}>
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
            <button style={styles.buyButton} onClick={handleBuyNowClick}>
              Buy Now
            </button>
          </div>
        ))}
      </div>

      {/* Display Cart with Remove and Buy Now Functionality */}
      {showCheckout && (
        <div style={styles.cart}>
          <h2>Your Cart</h2>
          {cartItems.length === 0 ? (
            <p>No items in the cart.</p>
          ) : (
            <>
              <ul style={styles.cartList}>
                {cartItems.map((item) => (
                  <li key={item.id} style={styles.cartItem}>
                    {item.title} - {item.quantity} x ${item.price}
                    <button style={styles.removeButton} onClick={() => handleRemoveFromCart(item)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <h3>Total: ${totalPriceInCart.toFixed(2)}</h3>
              <button style={styles.checkoutButton} onClick={handleBuyNowClick}>
                Buy Now
              </button>
            </>
          )}
        </div>
      )}

      {/* Show delivery form */}
      {showDeliveryForm && (
        <div style={styles.deliveryForm}>
          <h2>Enter Delivery Details</h2>
          <form onSubmit={handleCheckout}>
            <div style={styles.formGroup}>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={userDetails.name}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={userDetails.address}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="city">City:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={userDetails.city}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label htmlFor="postalCode">Postal Code:</label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={userDetails.postalCode}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.checkoutButton}>
              Complete Purchase
            </button>
          </form>
        </div>
      )}
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
    marginTop: '10px',
  },
  buyButton: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
    marginLeft: '10px',
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
  cart: {
    marginTop: '40px',
  },
  cartList: {
    listStyleType: 'none',
    padding: 0,
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  removeButton: {
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  deliveryForm: {
    marginTop: '40px',
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
  },
  formGroup: {
    marginBottom: '10px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '100%',
  },
  checkoutButton: {
    padding: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px',
  },
};

export default ProductList;
