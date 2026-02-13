import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

if (!globalThis.crypto) {
	globalThis.crypto = {} as Crypto;
}

if (!globalThis.crypto.randomUUID) {
	globalThis.crypto.randomUUID = ((() =>
		'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
			const rand = Math.floor(Math.random() * 16);
			const value = char === 'x' ? rand : (rand % 4) + 8;
			return value.toString(16);
		})) as Crypto['randomUUID']);
}
