export interface Exercise {
	id: string;
	name: string;
	category: string;
	isCustom: boolean;
}

export interface SetEntry {
	reps: number;
	weight: number;
}

export interface ExerciseEntry {
	exercise: Exercise;
	sets: SetEntry[];
	notes: string;
}

export interface WorkoutSession {
	id: string;
	name: string;
	date: string;
	exercises: ExerciseEntry[];
	notes: string;
}

export interface User {
	username: string;
}
