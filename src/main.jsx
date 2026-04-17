import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CarritoProvider } from './shared/hooks/useCarrito';
import { CatalogosProvider } from './shared/hooks/useCatalogos';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CatalogosProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </CatalogosProvider>
    </BrowserRouter>
  </React.StrictMode>
);
