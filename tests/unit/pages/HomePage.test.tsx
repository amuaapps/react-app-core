import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('HomePage', () => {
  it('renders hero section with main heading', () => {
    renderWithRouter(<HomePage />);
    expect(
      screen.getByText('Every Child Deserves a Bright Future')
    ).toBeInTheDocument();
  });

  it('renders hero description', () => {
    renderWithRouter(<HomePage />);
    expect(
      screen.getByText(/We provide education, healthcare, and support/)
    ).toBeInTheDocument();
  });

  it('renders impact statistics', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('12,500+')).toBeInTheDocument();
    expect(screen.getByText('Children Supported')).toBeInTheDocument();
    expect(screen.getByText('250+')).toBeInTheDocument();
    expect(screen.getByText('Schools Partnered')).toBeInTheDocument();
    expect(screen.getByText('1,800+')).toBeInTheDocument();
    expect(screen.getByText('Volunteers')).toBeInTheDocument();
  });

  it('renders programs section heading', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Our Programs')).toBeInTheDocument();
  });

  it('renders all program cards', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Education Support')).toBeInTheDocument();
    expect(screen.getByText('Healthcare Access')).toBeInTheDocument();
    expect(screen.getByText('After-School Activities')).toBeInTheDocument();
    expect(screen.getByText('Nutrition Programs')).toBeInTheDocument();
    expect(screen.getByText('Family Support')).toBeInTheDocument();
    expect(screen.getByText('Mentorship')).toBeInTheDocument();
  });

  it('renders donation call-to-action section', () => {
    renderWithRouter(<HomePage />);
    expect(screen.getByText('Make a Difference Today')).toBeInTheDocument();
    expect(
      screen.getByText(/Your donation helps us provide essential services/)
    ).toBeInTheDocument();
  });

  it('renders multiple donate buttons', () => {
    renderWithRouter(<HomePage />);
    const donateButtons = screen.getAllByText('Donate Now');
    expect(donateButtons.length).toBeGreaterThan(0);
  });

  it('calls onNavigate when donate button is clicked', () => {
    const mockNavigate = jest.fn();
    renderWithRouter(<HomePage basePath="/core" onNavigate={mockNavigate} />);

    const donateButtons = screen.getAllByText('Donate Now');
    donateButtons[0].click();

    expect(mockNavigate).toHaveBeenCalledWith('/core/donate');
  });

  it('calls onNavigate when volunteer button is clicked', () => {
    const mockNavigate = jest.fn();
    renderWithRouter(<HomePage basePath="/core" onNavigate={mockNavigate} />);

    const volunteerButton = screen.getByText('Become a Volunteer');
    volunteerButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('/core/volunteer');
  });

  it('uses default basePath when not provided', () => {
    const mockNavigate = jest.fn();
    renderWithRouter(<HomePage onNavigate={mockNavigate} />);

    const donateButtons = screen.getAllByText('Donate Now');
    donateButtons[0].click();

    expect(mockNavigate).toHaveBeenCalledWith('/core/donate');
  });

  it('renders program learn more links', () => {
    renderWithRouter(<HomePage />);
    const learnMoreLinks = screen.getAllByText(/Learn more/);
    expect(learnMoreLinks.length).toBe(6);
  });

  it('calls onNavigate when program learn more link is clicked', () => {
    const mockNavigate = jest.fn();
    renderWithRouter(<HomePage basePath="/core" onNavigate={mockNavigate} />);

    const learnMoreLinks = screen.getAllByText(/Learn more/);
    learnMoreLinks[0].click();

    expect(mockNavigate).toHaveBeenCalledWith('/core/programs/education');
  });
});
