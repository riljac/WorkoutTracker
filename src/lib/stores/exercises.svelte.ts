import type { Exercise } from '$lib/types';
import { exerciseDatabase } from '$lib/exercises';

class CustomExerciseStore {
	customExercises = $state<Exercise[]>([]);

	allExercises = $derived([...exerciseDatabase, ...this.customExercises]);

	constructor() {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('workout-custom-exercises');
			if (saved) {
				this.customExercises = JSON.parse(saved);
			}
		}
	}

	private save() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('workout-custom-exercises', JSON.stringify(this.customExercises));
		}
	}

	add(name: string, category: string) {
		const exercise: Exercise = {
			id: `custom-${Date.now()}`,
			name,
			category,
			isCustom: true
		};
		this.customExercises = [...this.customExercises, exercise];
		this.save();
		return exercise;
	}
}

export const customExerciseStore = new CustomExerciseStore();
