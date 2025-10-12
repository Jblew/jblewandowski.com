import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';

// Find the 'rejestracja-root' div in our index.html
const rootElement = document.getElementById('rejestracja-root');

// Ensure the element exists before trying to render our app into it
if (rootElement) {
    // Use the new `createRoot` API to render our App component
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("Could not find root element to mount the app.");
}
