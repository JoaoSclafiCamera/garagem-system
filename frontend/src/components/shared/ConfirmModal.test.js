import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfirmModal from './ConfirmModal';

describe('ConfirmModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('nao deve renderizar quando isOpen e false', () => {
    render(
      <ConfirmModal
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('deve renderizar quando isOpen e true', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('deve mostrar titulo e mensagem customizados', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        title="Excluir veiculo"
        message="Tem certeza que deseja excluir este veiculo?"
      />
    );

    expect(screen.getByText('Excluir veiculo')).toBeInTheDocument();
    expect(screen.getByText('Tem certeza que deseja excluir este veiculo?')).toBeInTheDocument();
  });

  it('deve chamar onClose ao clicar em cancelar', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    fireEvent.click(screen.getByText('Cancelar'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onConfirm e onClose ao clicar em confirmar', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    fireEvent.click(screen.getByText('Confirmar'));

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose ao clicar no overlay', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    // Clica no overlay (o dialog)
    const dialog = screen.getByRole('dialog');
    fireEvent.click(dialog);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('deve fechar com tecla Escape', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('deve usar textos customizados nos botoes', () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        confirmText="Sim, excluir"
        cancelText="Nao, manter"
      />
    );

    expect(screen.getByText('Sim, excluir')).toBeInTheDocument();
    expect(screen.getByText('Nao, manter')).toBeInTheDocument();
  });
});
