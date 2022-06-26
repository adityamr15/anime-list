import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter as Router,
} from "react-router-dom";

import { ApolloProvider } from "@apollo/client";
import App from './app/App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import client from './apollo';
import { Provider } from './recontext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <ApolloProvider client={client}>
    <Provider>
      <Router>
        <App />
      </Router>
    </Provider>
  </ApolloProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
