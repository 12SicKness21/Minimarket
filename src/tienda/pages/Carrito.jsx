import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../../shared/hooks/useCarrito';

export default function Carrito() {
  const navigate = useNavigate();
  const { totalItems } = useCarrito();

  // Esta página redirige a Home — el carrito es un drawer, no una página
  navigate('/');
  return null;
}
