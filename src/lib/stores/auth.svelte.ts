import type { User } from '$lib/types';

class AuthStore {
	user = $state<User | null>(null);
	isAuthenticated = $derived(this.user !== null);

	constructor() {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('workout-user');
			if (saved) {
				this.user = JSON.parse(saved);
			}
		}
	}

	login(username: string, password: string): boolean {
		// Simple client-side auth for demo purposes
		if (username.length >= 3 && password.length >= 4) {
			this.user = { username };
			if (typeof window !== 'undefined') {
				localStorage.setItem('workout-user', JSON.stringify(this.user));
			}
			return true;
		}
		return false;
	}

	logout() {
		this.user = null;
		if (typeof window !== 'undefined') {
			localStorage.removeItem('workout-user');
		}
	}
}

export const auth = new AuthStore();
