import { App } from '@/App';

describe('App', () => {
  it('exports the App component', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });

  it('accepts basePath prop', () => {
    const props = {
      basePath: '/core',
      initialPath: '/core',
      onNavigate: jest.fn(),
    };
    expect(() => App(props)).not.toThrow();
  });

  it('accepts onNavigate callback', () => {
    const mockNavigate = jest.fn();
    const props = {
      basePath: '/core',
      initialPath: '/core',
      onNavigate: mockNavigate,
    };
    expect(() => App(props)).not.toThrow();
  });
});
