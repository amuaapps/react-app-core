import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PlaceholderPage } from '@/pages/PlaceholderPage';

const renderWithRouter = (ui: React.ReactElement, basePath = '/core') => {
  return render(<BrowserRouter basename={basePath}>{ui}</BrowserRouter>);
};

describe('PlaceholderPage', () => {
  it('renders the page title', () => {
    renderWithRouter(<PlaceholderPage />);
    expect(screen.getByText(/Core App Placeholder/i)).toBeInTheDocument();
  });

  it('displays the current path with basePath', () => {
    renderWithRouter(<PlaceholderPage basePath="/core" />);
    expect(screen.getByText('/core/')).toBeInTheDocument();
  });

  it('calls onNavigate when navigation button is clicked', () => {
    const mockNavigate = jest.fn();
    renderWithRouter(<PlaceholderPage onNavigate={mockNavigate} />);

    const button = screen.getByText('Navigate to /core');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/core');
  });

  it('allows custom path navigation', () => {
    const mockNavigate = jest.fn();
    renderWithRouter(<PlaceholderPage onNavigate={mockNavigate} />);

    const input = screen.getByPlaceholderText('/core/custom');
    const goButton = screen.getByText('Go');

    fireEvent.change(input, { target: { value: '/core/custom-path' } });
    fireEvent.click(goButton);

    expect(mockNavigate).toHaveBeenCalledWith('/core/custom-path');
  });

  it('has accessible headings and landmarks', () => {
    renderWithRouter(<PlaceholderPage />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /Current Route/i })
    ).toBeInTheDocument();
  });
});
