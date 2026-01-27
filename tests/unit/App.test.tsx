import { render, screen, waitFor } from '@testing-library/react';
import { App } from '@/App';

describe('App', () => {
  it('renders the placeholder page', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Core App Placeholder/i)).toBeInTheDocument();
    });
  });

  it('displays the current path with basePath', async () => {
    render(<App basePath="/core" />);
    await waitFor(() => {
      expect(screen.getByText('/core/')).toBeInTheDocument();
    });
  });

  it('handles initialPath navigation', async () => {
    render(<App basePath="/core" initialPath="/core/about" />);
    await waitFor(() => {
      expect(screen.getByText(/Core App Placeholder/i)).toBeInTheDocument();
    });
  });
});
