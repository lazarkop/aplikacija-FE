import { setupServer } from 'msw/node';
import { authHandlers } from './handlers/auth';

// Setup requests interception using given handlers
export const server = setupServer(...authHandlers);
