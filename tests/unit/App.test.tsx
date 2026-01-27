import { render, screen } from '@testing-library/react';
import { App } from '@/App';

describe('App', () => {
  it('renders the placeholder page', () => {
    render(<App />);
    expect(screen.getByText(/Core App Placeholder/i)).toBeInTheDocument();
  });

  it('displays the current path', () => {
    render(<App basePath="/core" initialPath="/core/test" />);
    expect(screen.getByText('/core/test')).toBeInTheDocument();
  });

  it('uses basePath as default when no initialPath provided', () => {
    render(<App basePath="/core" />);
    expect(screen.getByText('/core')).toBeInTheDocument();
  });
});
