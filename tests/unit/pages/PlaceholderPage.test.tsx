import { render, screen, fireEvent } from '@testing-library/react';
import { PlaceholderPage } from '@/pages/PlaceholderPage';

describe('PlaceholderPage', () => {
  it('renders the page title', () => {
    render(<PlaceholderPage />);
    expect(screen.getByText(/Core App Placeholder/i)).toBeInTheDocument();
  });

  it('displays the current path', () => {
    render(<PlaceholderPage currentPath="/core/about" />);
    expect(screen.getByText('/core/about')).toBeInTheDocument();
  });

  it('calls onNavigate when navigation button is clicked', () => {
    const mockNavigate = jest.fn();
    render(<PlaceholderPage onNavigate={mockNavigate} />);
    
    const button = screen.getByText('Navigate to /core');
    fireEvent.click(button);
    
    expect(mockNavigate).toHaveBeenCalledWith('/core');
  });

  it('allows custom path navigation', () => {
    const mockNavigate = jest.fn();
    render(<PlaceholderPage onNavigate={mockNavigate} />);
    
    const input = screen.getByPlaceholderText('/core/custom');
    const goButton = screen.getByText('Go');
    
    fireEvent.change(input, { target: { value: '/core/custom-path' } });
    fireEvent.click(goButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/core/custom-path');
  });

  it('has accessible headings and landmarks', () => {
    render(<PlaceholderPage />);
    
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Current Route/i })).toBeInTheDocument();
  });
});
