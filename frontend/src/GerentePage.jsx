import React from 'react';
import { useNavigate } from 'react-router-dom';

const GerentePage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove o token
        navigate('/login'); // Redireciona para o login
    };

    return (
        <div>
            <h1>Página do Gerente</h1>
            <button onClick={handleLogout}>Sair</button>
        </div>
    );
};

export default GerentePage;
