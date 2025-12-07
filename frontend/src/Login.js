import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, isAuthenticated } from './services/api';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Se já está autenticado, redireciona para gerente
  useEffect(() => {
    if (isAuthenticated()) {
      const from = location.state?.from?.pathname || '/gerente';
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials.username, credentials.password);
      // Redireciona para onde o usuário tentou ir, ou para /gerente
      const from = location.state?.from?.pathname || '/gerente';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Erro ao autenticar:', err);
      if (err.message.includes('não encontrado')) {
        setError('Usuário não encontrado');
      } else if (err.message.includes('Senha')) {
        setError('Senha incorreta');
      } else {
        setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login Administrativo</h2>
        <p className="login-subtitle">Capatti Veículos - Painel Admin</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Usuário:</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
              disabled={loading}
              placeholder="Digite seu usuário"
            />
          </div>

          <div className="form-group">
            <label>Senha:</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              disabled={loading}
              placeholder="Digite sua senha"
            />
          </div>

          {error && <p className="erro-login">{error}</p>}

          <button type="submit" className="botao-login" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
