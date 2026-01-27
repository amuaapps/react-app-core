import { App } from '@/App';

describe('App', () => {
  it('exports the App component', () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe('function');
  });

  it('has correct component name', () => {
    expect(App.name).toBe('App');
  });
});
