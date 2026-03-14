import type { WorkoutSession } from '$lib/types';

class SessionStore {
	sessions = $state<WorkoutSession[]>([]);

	constructor() {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('workout-sessions');
			if (saved) {
				this.sessions = JSON.parse(saved);
			}
		}
	}

	private save() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('workout-sessions', JSON.stringify(this.sessions));
		}
	}

	add(session: WorkoutSession) {
		this.sessions = [session, ...this.sessions];
		this.save();
	}

	update(session: WorkoutSession) {
		this.sessions = this.sessions.map(s => s.id === session.id ? session : s);
		this.save();
	}

	remove(id: string) {
		this.sessions = this.sessions.filter(s => s.id !== id);
		this.save();
	}

	get(id: string): WorkoutSession | undefined {
		return this.sessions.find(s => s.id === id);
	}
}

export const sessionStore = new SessionStore();
