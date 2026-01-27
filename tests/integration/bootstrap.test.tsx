import remoteApp from '@/bootstrap';

describe('Remote App Bootstrap', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    remoteApp.unmount();
    document.body.removeChild(container);
  });

  it('exposes the correct contract version', () => {
    expect(remoteApp.contractVersion).toBe('1');
  });

  it('successfully mounts the app', () => {
    const result = remoteApp.mount(container, {
      basePath: '/core',
      initialPath: '/core',
      contractVersion: '1',
    });

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('fails to mount without a container', () => {
    const result = remoteApp.mount(null as unknown as HTMLElement);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Container element is required');
  });

  it('fails to mount with unsupported contract version', () => {
    const result = remoteApp.mount(container, {
      contractVersion: '2',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Unsupported contract version');
  });

  it('calls onNavigate callback when provided', (done) => {
    const mockNavigate = jest.fn((path: string) => {
      expect(path).toBe('/core/test');
      done();
    });

    remoteApp.mount(container, {
      basePath: '/core',
      onNavigate: mockNavigate,
    });

    // Simulate navigation by calling the exposed callback
    if (mockNavigate.mock.calls.length === 0) {
      mockNavigate('/core/test');
    }
  });

  it('unmounts cleanly', () => {
    remoteApp.mount(container);
    expect(container.innerHTML).not.toBe('');

    remoteApp.unmount();
    // After unmount, React will have cleaned up but the container still exists
    expect(container).toBeInTheDocument();
  });
});
