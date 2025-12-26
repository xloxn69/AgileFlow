/**
 * Tests for generators/index.js
 *
 * Tests the content generation orchestrator
 */

const { execSync } = require('child_process');
const path = require('path');

// Mock child_process
jest.mock('child_process', () => ({
  execSync: jest.fn(),
}));

// Capture console output
let consoleOutput = [];
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeEach(() => {
  consoleOutput = [];
  console.log = jest.fn((...args) => {
    consoleOutput.push(args.join(' '));
  });
  console.error = jest.fn((...args) => {
    consoleOutput.push(args.join(' '));
  });
  jest.clearAllMocks();
});

afterEach(() => {
  console.log = originalConsoleLog;
  console.error = originalConsoleError;
});

// Clear module cache to get fresh require each time
beforeEach(() => {
  jest.resetModules();
});

const { runGenerator } = require('../../../scripts/generators/index');

describe('generators/index.js', () => {
  describe('runGenerator', () => {
    it('returns true on successful execution', () => {
      execSync.mockImplementation(() => '');

      const result = runGenerator('test-generator.js');

      expect(result).toBe(true);
      expect(execSync).toHaveBeenCalled();
    });

    it('constructs correct script path', () => {
      execSync.mockImplementation(() => '');

      runGenerator('my-script.js');

      const expectedPath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'scripts',
        'generators',
        'my-script.js'
      );

      expect(execSync).toHaveBeenCalledWith(
        expect.stringContaining('my-script.js'),
        expect.any(Object)
      );
    });

    it('uses inherit stdio option', () => {
      execSync.mockImplementation(() => '');

      runGenerator('test.js');

      expect(execSync).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          stdio: 'inherit',
        })
      );
    });

    it('returns false when script throws error', () => {
      execSync.mockImplementation(() => {
        throw new Error('Script failed');
      });

      const result = runGenerator('failing-script.js');

      expect(result).toBe(false);
    });

    it('logs success message on completion', () => {
      execSync.mockImplementation(() => '');

      runGenerator('success-generator.js');

      const output = consoleOutput.join('\n');
      expect(output).toContain('success-generator.js completed successfully');
    });

    it('logs error message on failure', () => {
      execSync.mockImplementation(() => {
        throw new Error('Execution failed');
      });

      runGenerator('error-generator.js');

      const output = consoleOutput.join('\n');
      expect(output).toContain('error-generator.js failed');
    });

    it('logs script name when running', () => {
      execSync.mockImplementation(() => '');

      runGenerator('my-generator.js');

      const output = consoleOutput.join('\n');
      expect(output).toContain('Running: my-generator.js');
    });
  });

  describe('generator output format', () => {
    it('prints separator lines', () => {
      execSync.mockImplementation(() => '');

      runGenerator('test.js');

      const output = consoleOutput.join('\n');
      expect(output).toContain('='.repeat(60));
    });
  });
});
