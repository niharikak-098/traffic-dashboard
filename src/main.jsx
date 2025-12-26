import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './style.css'; // Corrected import to match your file name

// Get the root HTML element where the React app will be rendered
const rootElement = document.getElementById('root');

// Ensure the root element exists before rendering
if (rootElement) {
  // Create a React root and render the App component inside of it
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error("The root element with ID 'root' was not found in the HTML file.");
}
