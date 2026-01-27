import {
  REMOTE_APP_CONTRACT_VERSION,
  RemoteAppErrorType,
  type RemoteAppInstance,
  type RemoteAppMountOptions,
  type RemoteAppMountResult,
} from '@/lib/remote-app-contract';

describe('Remote App Contract', () => {
  describe('REMOTE_APP_CONTRACT_VERSION', () => {
    it('should be version "1"', () => {
      expect(REMOTE_APP_CONTRACT_VERSION).toBe('1');
    });

    it('should be a string', () => {
      expect(typeof REMOTE_APP_CONTRACT_VERSION).toBe('string');
    });
  });

  describe('RemoteAppErrorType', () => {
    it('should define MISSING_CONTAINER error type', () => {
      expect(RemoteAppErrorType.MISSING_CONTAINER).toBe('MISSING_CONTAINER');
    });

    it('should define INVALID_CONTRACT_VERSION error type', () => {
      expect(RemoteAppErrorType.INVALID_CONTRACT_VERSION).toBe(
        'INVALID_CONTRACT_VERSION'
      );
    });

    it('should define MOUNT_FAILED error type', () => {
      expect(RemoteAppErrorType.MOUNT_FAILED).toBe('MOUNT_FAILED');
    });
  });

  describe('RemoteAppMountOptions type', () => {
    it('should allow valid mount options', () => {
      const options: RemoteAppMountOptions = {
        basePath: '/core',
        initialPath: '/core/about',
        onNavigate: (path: string) => {
          console.log(path);
        },
        contractVersion: '1',
      };

      expect(options.basePath).toBe('/core');
      expect(options.initialPath).toBe('/core/about');
      expect(typeof options.onNavigate).toBe('function');
      expect(options.contractVersion).toBe('1');
    });

    it('should allow empty options', () => {
      const options: RemoteAppMountOptions = {};
      expect(options).toBeDefined();
    });
  });

  describe('RemoteAppMountResult type', () => {
    it('should allow success result', () => {
      const result: RemoteAppMountResult = {
        success: true,
      };

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should allow error result', () => {
      const result: RemoteAppMountResult = {
        success: false,
        error: 'Test error',
      };

      expect(result.success).toBe(false);
      expect(result.error).toBe('Test error');
    });
  });

  describe('RemoteAppInstance type', () => {
    it('should define required contractVersion property', () => {
      const instance: RemoteAppInstance = {
        contractVersion: '1',
        mount: () => ({ success: true }),
      };

      expect(instance.contractVersion).toBe('1');
    });

    it('should define required mount method', () => {
      const instance: RemoteAppInstance = {
        contractVersion: '1',
        mount: () => ({ success: true }),
      };

      expect(typeof instance.mount).toBe('function');
    });

    it('should allow optional unmount method', () => {
      const instance: RemoteAppInstance = {
        contractVersion: '1',
        mount: () => ({ success: true }),
        unmount: () => {
          // cleanup
        },
      };

      expect(typeof instance.unmount).toBe('function');
    });

    it('should work without unmount method', () => {
      const instance: RemoteAppInstance = {
        contractVersion: '1',
        mount: () => ({ success: true }),
      };

      expect(instance.unmount).toBeUndefined();
    });
  });
});
