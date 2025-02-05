import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import ReactContextProvider from './context/auth-context';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <ReactContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReactContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
