import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';

import './scss/style.scss';
 
document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    React.createElement(App),
    document.getElementById('mount')
  );
});