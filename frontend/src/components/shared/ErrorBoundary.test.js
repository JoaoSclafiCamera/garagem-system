import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from './ErrorBoundary';

// Componente que sempre lanca erro
const ThrowError = () => {
  throw new Error('Erro de teste');
};

// Componente que funciona normalmente
const WorkingComponent = () => <div>Funcionando normalmente</div>;

describe('ErrorBoundary Component', () => {
  // Silencia os erros do console durante os testes
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('deve renderizar children quando nao ha erro', () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Funcionando normalmente')).toBeInTheDocument();
  });

  it('deve mostrar fallback UI quando ocorre erro', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Ops! Algo deu errado')).toBeInTheDocument();
    expect(screen.getByText(/Desculpe, ocorreu um erro inesperado/)).toBeInTheDocument();
  });

  it('deve mostrar botao de recarregar pagina', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Recarregar Pagina')).toBeInTheDocument();
  });

  it('deve mostrar botao de ir para home', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Ir para Home')).toBeInTheDocument();
  });

  it('deve ter role de alert', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
