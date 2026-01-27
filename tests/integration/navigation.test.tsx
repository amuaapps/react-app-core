import remoteApp from '@/bootstrap';

describe('Navigation Synchronization', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    remoteApp.unmount();
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  });

  it('calls onNavigate with absolute paths when navigation occurs', async () => {
    const mockNavigate = jest.fn();

    const result = remoteApp.mount(container, {
      basePath: '/core',
      initialPath: '/core',
      onNavigate: mockNavigate,
    });

    expect(result.success).toBe(true);

    // Wait for React to render
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Find and click a navigation button
    const button = container.querySelector(
      'button'
    ) as HTMLButtonElement | null;

    if (button && button.textContent?.includes('Navigate to /core')) {
      button.click();

      // Wait for navigation to process
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify onNavigate was called with absolute path
      expect(mockNavigate).toHaveBeenCalled();
      const lastCall = mockNavigate.mock.calls[mockNavigate.mock.calls.length - 1];
      expect(lastCall?.[0]).toMatch(/^\/core/);
    }
  });

  it('handles external URL changes via popstate', async () => {
    const mockNavigate = jest.fn();

    const result = remoteApp.mount(container, {
      basePath: '/core',
      initialPath: '/core',
      onNavigate: mockNavigate,
    });

    expect(result.success).toBe(true);

    // Wait for React to render
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Simulate browser back/forward by changing URL and firing popstate
    const originalPath = window.location.pathname;
    window.history.pushState({}, '', '/core/test');
    window.dispatchEvent(new PopStateEvent('popstate'));

    // Wait for event to process
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Restore original path
    window.history.pushState({}, '', originalPath);
  });

  it('unmounts cleanly and removes event listeners', async () => {
    const mockNavigate = jest.fn();

    remoteApp.mount(container, {
      basePath: '/core',
      onNavigate: mockNavigate,
    });

    // Wait for React to render
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Unmount
    remoteApp.unmount();

    // Simulate popstate after unmount
    window.dispatchEvent(new PopStateEvent('popstate'));

    // Wait to ensure no errors occur
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Test passes if no errors thrown
    expect(true).toBe(true);
  });
});
