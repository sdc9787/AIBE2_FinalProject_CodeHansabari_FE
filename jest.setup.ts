import '@testing-library/jest-dom';
import 'whatwg-fetch';

// MSW setup (tests only). The server is started in global setup style here.
// If you later need a custom globalSetup file, move this logic there.
import { server } from './src/mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Polyfill IntersectionObserver for framer-motion in JSDOM
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
	// @ts-ignore
	window.IntersectionObserver = class IntersectionObserver {
		constructor() {}
		observe() {}
		unobserve() {}
		disconnect() {}
		takeRecords() { return []; }
		root = null;
		rootMargin = '';
		thresholds = [];
	};
}
