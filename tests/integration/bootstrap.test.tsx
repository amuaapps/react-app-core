import remoteApp from '@/bootstrap';
import { REMOTE_APP_CONTRACT_VERSION } from '@/lib/remote-app-contract';

describe('Remote App Bootstrap', () => {
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

  it('exposes the correct contract version', () => {
    expect(remoteApp.contractVersion).toBe(REMOTE_APP_CONTRACT_VERSION);
    expect(remoteApp.contractVersion).toBe('1');
  });

  it('successfully mounts the app', async () => {
    const result = remoteApp.mount(container, {
      basePath: '/core',
      initialPath: '/core',
      contractVersion: '1',
    });

    expect(result.success).toBe(true);
    expect(result.error).toBeUndefined();

    // Wait for React to render
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  it('fails to mount without a container', () => {
    const result = remoteApp.mount(null as unknown as HTMLElement);

    expect(result.success).toBe(false);
    expect(result.error).toContain('MISSING_CONTAINER');
    expect(result.error).toContain('Container element is required');
  });

  it('fails to mount with unsupported contract version', () => {
    const result = remoteApp.mount(container, {
      contractVersion: '2',
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('INVALID_CONTRACT_VERSION');
    expect(result.error).toContain('Unsupported contract version');
  });

  it('accepts onNavigate callback', async () => {
    const mockNavigate = jest.fn();

    const result = remoteApp.mount(container, {
      basePath: '/core',
      onNavigate: mockNavigate,
    });

    expect(result.success).toBe(true);

    // Wait for React to render
    await new Promise((resolve) => setTimeout(resolve, 100));

    // The callback is passed to the app but not called during mount
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('unmounts cleanly', async () => {
    remoteApp.mount(container);

    // Wait for React to render
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(container.innerHTML).not.toBe('');

    remoteApp.unmount();
    // After unmount, React will have cleaned up but the container still exists
    expect(container).toBeInTheDocument();
  });

  it('implements required contract interface', () => {
    expect(remoteApp).toHaveProperty('contractVersion');
    expect(remoteApp).toHaveProperty('mount');
    expect(remoteApp).toHaveProperty('unmount');

    expect(typeof remoteApp.contractVersion).toBe('string');
    expect(typeof remoteApp.mount).toBe('function');
    expect(typeof remoteApp.unmount).toBe('function');
  });
});
