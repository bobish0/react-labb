import React from 'react';
// import { Provider } from 'react-redux';
// import { createStore, applyMiddleware, compose } from 'redux';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
// import thunk from 'redux-thunk';
import { App } from './app';
// import { rootReducer } from './reducers';
import { apiClient } from './api-client';
import { RootStore } from './store/root-store';

const store = new RootStore(apiClient);

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// const store = createStore(
//   rootReducer,
//   composeEnhancers(applyMiddleware(thunk.withExtraArgument(apiClient)))
// );

const RootApp = () => (
  <Provider tasks={store.tasks}>
    <App />
  </Provider>
);

render(<RootApp />, document.getElementById('root'));
