import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { apiServer } from './server'

beforeAll(() => apiServer.listen({ onUnhandledRequest: 'error' }))
afterEach(() => apiServer.resetHandlers())
afterAll(() => apiServer.close())
