import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import ProductList from './ProductList';

ReactDOM.render(
  <Provider store={store}>
    <ProductList />
  </Provider>,
  document.getElementById('root')
);
