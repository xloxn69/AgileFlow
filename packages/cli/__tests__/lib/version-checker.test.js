/**
 * Tests for version-checker.js
 *
 * Tests npm version checking functionality with mocked https requests
 */

const https = require('node:https');
const { EventEmitter } = require('node:events');

// Mock https module before requiring version-checker
jest.mock('node:https');

const {
  getLatestVersion,
  checkForUpdate,
  getCurrentVersion,
} = require('../../tools/cli/lib/version-checker');

describe('version-checker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentVersion', () => {
    it('returns the current package version', () => {
      const version = getCurrentVersion();

      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
      // Should be a valid semver
      expect(version).toMatch(/^\d+\.\d+\.\d+/);
    });
  });

  describe('getLatestVersion', () => {
    it('returns latest version on successful response', async () => {
      const mockResponse = new EventEmitter();
      mockResponse.statusCode = 200;

      const mockRequest = new EventEmitter();
      mockRequest.destroy = jest.fn();

      https.get.mockImplementation((url, options, callback) => {
        callback(mockResponse);
        // Simulate response data
        process.nextTick(() => {
          mockResponse.emit('data', JSON.stringify({ version: '3.0.0' }));
          mockResponse.emit('end');
        });
        return mockRequest;
      });

      const version = await getLatestVersion();

      expect(version).toBe('3.0.0');
      expect(https.get).toHaveBeenCalledWith(
        'https://registry.npmjs.org/agileflow/latest',
        expect.objectContaining({ timeout: 5000 }),
        expect.any(Function)
      );
    });

    it('accepts custom package name', async () => {
      const mockResponse = new EventEmitter();
      mockResponse.statusCode = 200;

      const mockRequest = new EventEmitter();
      mockRequest.destroy = jest.fn();

      https.get.mockImplementation((url, options, callback) => {
        callback(mockResponse);
        process.nextTick(() => {
          mockResponse.emit('data', JSON.stringify({ version: '1.0.0' }));
          mockResponse.emit('end');
        });
        return mockRequest;
      });

      await getLatestVersion('custom-package');

      expect(https.get).toHaveBeenCalledWith(
        'https://registry.npmjs.org/custom-package/latest',
        expect.any(Object),
        expect.any(Function)
      );
    });

    it('returns null on non-200 status code', async () => {
      const mockResponse = new EventEmitter();
      mockResponse.statusCode = 404;

      const mockRequest = new EventEmitter();
      mockRequest.destroy = jest.fn();

      https.get.mockImplementation((url, options, callback) => {
        callback(mockResponse);
        return mockRequest;
      });

      const version = await getLatestVersion();

      expect(version).toBeNull();
    });

    it('returns null on network error', async () => {
      const mockRequest = new EventEmitter();
      mockRequest.destroy = jest.fn();

      https.get.mockImplementation(() => {
        process.nextTick(() => {
          mockRequest.emit('error', new Error('Network error'));
        });
        return mockRequest;
      });

      const version = await getLatestVersion();

      expect(version).toBeNull();
    });

    it('returns null on timeout', async () => {
      const mockRequest = new EventEmitter();
      mockRequest.destroy = jest.fn();

      https.get.mockImplementation(() => {
        process.nextTick(() => {
          mockRequest.emit('timeout');
        });
        return mockRequest;
      });

      const version = await getLatestVersion();

      expect(version).toBeNull();
      expect(mockRequest.destroy).toHaveBeenCalled();
    });

    it('returns null on invalid JSON response', async () => {
      const mockResponse = new EventEmitter();
      mockResponse.statusCode = 200;

      const mockRequest = new EventEmitter();
      mockRequest.destroy = jest.fn();

      https.get.mockImplementation((url, options, callback) => {
        callback(mockResponse);
        process.nextTick(() => {
          mockResponse.emit('data', 'not valid json');
          mockResponse.emit('end');
        });
        return mockRequest;
      });

      const version = await getLatestVersion();

      expect(version).toBeNull();
    });

    it('returns null when version field is missing', async () => {
      const mockResponse = new EventEmitter();
      mockResponse.statusCode = 200;

      const mockRequest = new EventEmitter();
      mockRequest.destroy = jest.fn();

      https.get.mockImplementation((url, options, callback) => {
        callback(mockResponse);
        process.nextTick(() => {
          mockResponse.emit('data', JSON.stringify({ name: 'agileflow' }));
          mockResponse.emit('end');
        });
        return mockRequest;
      });

      const version = await getLatestVersion();

      expect(version).toBeNull();
    });

    it('handles chunked response data', async () => {
      const mockResponse = new EventEmitter();
      mockResponse.statusCode = 200;

      const mockRequest = new EventEmitter();
      mockRequest.destroy = jest.fn();

      https.get.mockImplementation((url, options, callback) => {
        callback(mockResponse);
        process.nextTick(() => {
          // Simulate chunked response
          mockResponse.emit('data', '{"ver');
          mockResponse.emit('data', 'sion":');
          mockResponse.emit('data', '"2.5.0"}');
          mockResponse.emit('end');
        });
        return mockRequest;
      });

      const version = await getLatestVersion();

      expect(version).toBe('2.5.0');
    });
  });

  describe('checkForUpdate', () => {
    it('returns updateAvailable true when newer version exists', async () => {
      const mockResponse = new EventEmitter();
      mockResponse.statusCode = 200;

      const mockRequest = new EventEmitter();
      mockRequest.destroy = jest.fn();

      https.get.mockImplementation((url, options, callback) => {
        callback(mockResponse);
        process.nextTick(() => {
          // Return a version higher than current
          mockResponse.emit('data', JSON.stringify({ version: '999.0.0' }));
          mockResponse.emit('end');
        });
        return mockRequest;
      });

      const result = await checkForUpdate();

      expect(result.updateAvailable).toBe(true);
      expect(result.latest).toBe('999.0.0');
      expect(result.current).toBe(getCurrentVersion());
      expect(result.error).toBeNull();
    });

    it('returns updateAvailable false when on latest version', async () => {
      const currentVersion = getCurrentVersion();
      const mockResponse = new EventEmitter();
      mockResponse.statusCode = 200;

      const mockRequest = new EventEmitter();
      mockRequest.destroy = jest.fn();

      https.get.mockImplementation((url, options, callback) => {
        callback(mockResponse);
        process.nextTick(() => {
          // Return same version as current
          mockResponse.emit('data', JSON.stringify({ version: currentVersion }));
          mockResponse.emit('end');
        });
        return mockRequest;
      });

      const result = await checkForUpdate();

      expect(result.updateAvailable).toBe(false);
      expect(result.latest).toBe(currentVersion);
      expect(result.current).toBe(currentVersion);
      expect(result.error).toBeNull();
    });

    it('returns updateAvailable false when on newer version than registry', async () => {
      const mockResponse = new EventEmitter();
      mockResponse.statusCode = 200;

      const mockRequest = new EventEmitter();
      mockRequest.destroy = jest.fn();

      https.get.mockImplementation((url, options, callback) => {
        callback(mockResponse);
        process.nextTick(() => {
          // Return an older version
          mockResponse.emit('data', JSON.stringify({ version: '0.0.1' }));
          mockResponse.emit('end');
        });
        return mockRequest;
      });

      const result = await checkForUpdate();

      expect(result.updateAvailable).toBe(false);
      expect(result.latest).toBe('0.0.1');
    });

    it('returns error when version check fails', async () => {
      const mockRequest = new EventEmitter();
      mockRequest.destroy = jest.fn();

      https.get.mockImplementation(() => {
        process.nextTick(() => {
          mockRequest.emit('error', new Error('Network error'));
        });
        return mockRequest;
      });

      const result = await checkForUpdate();

      expect(result.updateAvailable).toBe(false);
      expect(result.latest).toBeNull();
      expect(result.error).toBe('Could not check for updates');
      expect(result.current).toBe(getCurrentVersion());
    });
  });
});
