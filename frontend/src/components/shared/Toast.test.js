import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastProvider, useToast } from './Toast';

// Componente de teste que usa o hook useToast
const TestComponent = () => {
  const { success, error, warning, info } = useToast();

  return (
    <div>
      <button onClick={() => success('Sucesso!')}>Show Success</button>
      <button onClick={() => error('Erro!')}>Show Error</button>
      <button onClick={() => warning('Aviso!')}>Show Warning</button>
      <button onClick={() => info('Info!')}>Show Info</button>
    </div>
  );
};

describe('Toast Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve renderizar o provider sem erros', () => {
    render(
      <ToastProvider>
        <div>Test</div>
      </ToastProvider>
    );

    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('deve mostrar toast de sucesso', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));

    expect(screen.getByText('Sucesso!')).toBeInTheDocument();
  });

  it('deve mostrar toast de erro', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Error'));

    expect(screen.getByText('Erro!')).toBeInTheDocument();
  });

  it('deve mostrar toast de aviso', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Warning'));

    expect(screen.getByText('Aviso!')).toBeInTheDocument();
  });

  it('deve mostrar toast de info', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Info'));

    expect(screen.getByText('Info!')).toBeInTheDocument();
  });

  it('deve remover toast apos timeout', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('Sucesso!')).toBeInTheDocument();

    // Avanca o timer
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.queryByText('Sucesso!')).not.toBeInTheDocument();
  });

  it('deve fechar toast ao clicar no botao fechar', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('Sucesso!')).toBeInTheDocument();

    const closeButton = screen.getByLabelText('Fechar notificacao');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Sucesso!')).not.toBeInTheDocument();
  });
});
