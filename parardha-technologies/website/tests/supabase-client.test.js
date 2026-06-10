import { describe, it, expect } from 'vitest';
import { submitContactForm } from '../js/supabase-client.js';

function mockClient({ error = null } = {}) {
  const inserted = [];
  return {
    from: () => ({
      insert: (rows) => {
        inserted.push(...rows);
        return Promise.resolve({ error });
      },
    }),
    getInserted: () => inserted,
  };
}

const validInput = { name: 'Jane Smith', email: 'jane@example.com', message: 'Hello, I need AI consulting.' };

describe('submitContactForm', () => {
  it('returns success: true for valid input', async () => {
    const result = await submitContactForm(mockClient(), validInput);
    expect(result).toEqual({ success: true });
  });

  it('returns success: false when Supabase returns an error', async () => {
    const client = mockClient({ error: { message: 'Connection failed' } });
    const result = await submitContactForm(client, validInput);
    expect(result).toEqual({ success: false, error: 'Connection failed' });
  });

  it('returns success: false when name is missing', async () => {
    const result = await submitContactForm(mockClient(), { ...validInput, name: '' });
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns success: false when email is missing', async () => {
    const result = await submitContactForm(mockClient(), { ...validInput, email: '' });
    expect(result.success).toBe(false);
  });

  it('returns success: false when message is missing', async () => {
    const result = await submitContactForm(mockClient(), { ...validInput, message: '' });
    expect(result.success).toBe(false);
  });

  it('does not make a network call when fields are missing', async () => {
    let insertCalled = false;
    const client = {
      from: () => ({
        insert: () => {
          insertCalled = true;
          return Promise.resolve({ error: null });
        },
      }),
    };
    await submitContactForm(client, { name: '', email: '', message: '' });
    expect(insertCalled).toBe(false);
  });

  it('inserts exactly the data that was passed in', async () => {
    const client = mockClient();
    await submitContactForm(client, validInput);
    expect(client.getInserted()[0]).toEqual(validInput);
  });

  it('does not mutate the input object', async () => {
    const input = { ...validInput };
    const before = { ...input };
    await submitContactForm(mockClient(), input);
    expect(input).toEqual(before);
  });
});
