import remoteApp from '@/remoteEntry';
import { REMOTE_APP_CONTRACT_VERSION } from '@/lib/remote-app-contract';

describe('Remote Entry', () => {
  it('exports the remote app instance', () => {
    expect(remoteApp).toBeDefined();
    expect(remoteApp.contractVersion).toBe(REMOTE_APP_CONTRACT_VERSION);
    expect(typeof remoteApp.mount).toBe('function');
    expect(typeof remoteApp.unmount).toBe('function');
  });

  it('exposes window.remoteApp_core', () => {
    expect(window.remoteApp_core).toBeDefined();
    expect(window.remoteApp_core.contractVersion).toBe('1');
  });

  it('window.remoteApp_core matches exported instance', () => {
    expect(window.remoteApp_core).toBe(remoteApp);
  });
});
