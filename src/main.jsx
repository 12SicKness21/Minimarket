import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CarritoProvider } from './shared/hooks/useCarrito';
import { CatalogosProvider } from './shared/hooks/useCatalogos';
import { ConfigTiendaProvider } from './shared/hooks/useConfigTienda';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigTiendaProvider>
        <CatalogosProvider>
          <CarritoProvider>
            <App />
          </CarritoProvider>
        </CatalogosProvider>
      </ConfigTiendaProvider>
    </BrowserRouter>
  </StrictMode>
);
