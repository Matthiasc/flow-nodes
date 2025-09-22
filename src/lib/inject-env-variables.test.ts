import { describe, it, expect, beforeEach } from 'vitest';
import { injectEnvVariables } from './inject-env-variables.ts';

describe('injectEnvVariables', () => {
  beforeEach(() => {
    // Set up test environment variables
    process.env.TEST_USER = 'john@example.com';
    process.env.TEST_TOKEN = 'secret123';
    process.env.TEST_PORT = '587';
    process.env.API_KEY = 'abc-def-ghi';
  });

  it('should replace simple string templates', () => {
    const input = 'Hello {{TEST_USER}}!';
    const result = injectEnvVariables(input);
    
    expect(result).toBe('Hello john@example.com!');
  });

  it('should replace multiple variables in one string', () => {
    const input = 'User: {{TEST_USER}}, Token: {{TEST_TOKEN}}';
    const result = injectEnvVariables(input);
    
    expect(result).toBe('User: john@example.com, Token: secret123');
  });

  it('should handle nested object properties', () => {
    const input = {
      user: '{{TEST_USER}}',
      auth: {
        token: '{{TEST_TOKEN}}',
        port: '{{TEST_PORT}}'
      },
      enabled: true,
      count: 42
    };

    const result = injectEnvVariables(input);

    expect(result).toEqual({
      user: 'john@example.com',
      auth: {
        token: 'secret123',
        port: '587'
      },
      enabled: true,
      count: 42
    });
  });

  it('should handle arrays with mixed content', () => {
    const input = [
      '{{TEST_USER}}',
      { token: '{{TEST_TOKEN}}' },
      'static string',
      123,
      { nested: { api: '{{API_KEY}}' } }
    ];

    const result = injectEnvVariables(input);

    expect(result).toEqual([
      'john@example.com',
      { token: 'secret123' },
      'static string',
      123,
      { nested: { api: 'abc-def-ghi' } }
    ]);
  });

  it('should leave non-template strings unchanged', () => {
    const input = {
      normal: 'just a normal string',
      withBraces: 'this has {single} braces',
      empty: '',
      number: 42,
      boolean: true,
      nullValue: null
    };

    const result = injectEnvVariables(input);

    expect(result).toEqual(input);
  });

  it('should handle null and undefined values', () => {
    expect(injectEnvVariables(null)).toBe(null);
    expect(injectEnvVariables(undefined)).toBe(undefined);
  });

  it('should throw error for missing environment variables', () => {
    const input = 'Missing var: {{NON_EXISTENT_VAR}}';
    
    expect(() => injectEnvVariables(input)).toThrow(
      "Environment variable 'NON_EXISTENT_VAR' is not defined. Please set it in your environment."
    );
  });

  it('should handle complex real-world config', () => {
    const smtpConfig = {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: '{{TEST_USER}}',
        pass: '{{TEST_TOKEN}}'
      },
      options: {
        debug: true,
        timeout: 5000
      }
    };

    const result = injectEnvVariables(smtpConfig);

    expect(result.auth.user).toBe('john@example.com');
    expect(result.auth.pass).toBe('secret123');
    expect(result.host).toBe('smtp.gmail.com');
    expect(result.port).toBe(587);
    expect(result.secure).toBe(false);
    expect(result.options.debug).toBe(true);
  });

  it('should handle URL templates', () => {
    const config = {
      apiUrl: 'https://api.example.com/{{TEST_USER}}/data',
      webhookUrl: 'https://{{TEST_USER}}.webhook.site/{{API_KEY}}'
    };

    const result = injectEnvVariables(config);

    expect(result.apiUrl).toBe('https://api.example.com/john@example.com/data');
    expect(result.webhookUrl).toBe('https://john@example.com.webhook.site/abc-def-ghi');
  });
});