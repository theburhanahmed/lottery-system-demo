import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';

const mockNavigate = vi.fn();
const mockRegister = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

describe('LoginPage integration', () => {
  it('submits login form and redirects to dashboard', async () => {
    const onLogin = vi.fn().mockResolvedValue(undefined);

    const { container } = render(
      <MemoryRouter>
        <LoginPage onLogin={onLogin} addToast={vi.fn()} />
      </MemoryRouter>,
    );

    const inputs = container.querySelectorAll('input');
    fireEvent.change(inputs[0], { target: { value: 'player@example.com' } });
    fireEvent.change(inputs[1], { target: { value: 'secret123' } });

    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalledWith('player@example.com', 'secret123', 'user');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows validation errors when login inputs are invalid', async () => {
    const { container } = render(
      <MemoryRouter>
        <LoginPage onLogin={vi.fn()} addToast={vi.fn()} />
      </MemoryRouter>,
    );

    fireEvent.submit(container.querySelector('form')!);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });
});

describe('SignupPage integration', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      register: mockRegister,
      isLoading: false,
      error: null,
    });
    mockNavigate.mockReset();
    mockRegister.mockReset();
  });

  it('registers a valid user and redirects to email verification', async () => {
    mockRegister.mockResolvedValue(undefined);

    const { container } = render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>,
    );

    const inputs = container.querySelectorAll('input');
    fireEvent.change(inputs[0], { target: { value: 'Test User' } });
    fireEvent.change(inputs[1], { target: { value: 'test@example.com' } });
    fireEvent.change(inputs[2], { target: { value: '2000-01-01' } });
    fireEvent.change(inputs[3], { target: { value: 'StrongPass1!' } });
    fireEvent.change(inputs[4], { target: { value: 'StrongPass1!' } });

    fireEvent.submit(container.querySelector('form')!);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test User',
          email: 'test@example.com',
          password: 'StrongPass1!',
        }),
      );
      expect(mockNavigate).toHaveBeenCalledWith('/email-verification');
    });
  });
});
