import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * Componente que protege rotas que requerem autenticação.
 * Verifica o token em CADA renderização (não apenas no mount).
 */
const PrivateRoute = ({ children }) => {
  const location = useLocation();

  // Verificação dinâmica - executa a cada render
  const isAuthenticated = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      // Verificação básica de expiração do JWT (opcional mas recomendado)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          // Token expirado - remove e retorna false
          localStorage.removeItem('token');
          return false;
        }
      } catch {
        // Se não conseguir decodificar, assume que é válido
        // O backend vai validar de qualquer forma
      }

      return true;
    } catch {
      return false;
    }
  };

  if (!isAuthenticated()) {
    // Redireciona para login, salvando a localização atual
    // para poder voltar após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;
