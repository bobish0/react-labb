import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render } from 'react-dom';
import { App } from './app';
import { rootReducer } from './reducers';

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const RootApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

render(<RootApp />, document.getElementById('root'));
