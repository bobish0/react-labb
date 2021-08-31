import React from 'react';
import { render } from 'react-dom';
import { App } from './app';

const RootApp = () => <App />;

render(<RootApp />, document.getElementById('root'));
