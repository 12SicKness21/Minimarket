import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CarritoProvider } from './shared/hooks/useCarrito';
import { CatalogosProvider } from './shared/hooks/useCatalogos';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CatalogosProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </CatalogosProvider>
    </BrowserRouter>
  </StrictMode>
);
