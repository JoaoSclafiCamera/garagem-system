import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import CadastroEstoque from './CadastroEstoque';
import Catalogo from './Catalogo';
import CatalogoPremium from './components/Catalogo/CatalogoPremium';
import Home from './Home';
import HomePremium from './HomePremium';
import Detalhes from './Detalhes';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import { ErrorBoundary, ToastProvider } from './components/shared';

const App = () => {
    return (
        <ErrorBoundary>
            <ToastProvider>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/catalogo-old" element={<Catalogo />} />
                        <Route path="/catalogo" element={<CatalogoPremium />} />
                        <Route path="/home-old" element={<Home />} />
                        <Route path="/home" element={<HomePremium />} />
                        <Route path="/" element={<HomePremium />} />
                        <Route path="/detalhes/:id" element={<Detalhes />} />
                        <Route
                            path="/gerente"
                            element={
                                <PrivateRoute>
                                    <CadastroEstoque />
                                </PrivateRoute>
                            }
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </ToastProvider>
        </ErrorBoundary>
    );
};

export default App;
