import type { Exercise } from './types';

export const exerciseDatabase: Exercise[] = [
	// Chest
	{ id: 'bench-press', name: 'Bench Press', category: 'Chest', isCustom: false },
	{ id: 'incline-bench', name: 'Incline Bench Press', category: 'Chest', isCustom: false },
	{ id: 'decline-bench', name: 'Decline Bench Press', category: 'Chest', isCustom: false },
	{ id: 'dumbbell-fly', name: 'Dumbbell Fly', category: 'Chest', isCustom: false },
	{ id: 'cable-crossover', name: 'Cable Crossover', category: 'Chest', isCustom: false },
	{ id: 'push-up', name: 'Push-Up', category: 'Chest', isCustom: false },

	// Back
	{ id: 'deadlift', name: 'Deadlift', category: 'Back', isCustom: false },
	{ id: 'pull-up', name: 'Pull-Up', category: 'Back', isCustom: false },
	{ id: 'barbell-row', name: 'Barbell Row', category: 'Back', isCustom: false },
	{ id: 'lat-pulldown', name: 'Lat Pulldown', category: 'Back', isCustom: false },
	{ id: 'seated-row', name: 'Seated Cable Row', category: 'Back', isCustom: false },
	{ id: 'face-pull', name: 'Face Pull', category: 'Back', isCustom: false },

	// Legs
	{ id: 'squat', name: 'Barbell Squat', category: 'Legs', isCustom: false },
	{ id: 'leg-press', name: 'Leg Press', category: 'Legs', isCustom: false },
	{ id: 'lunges', name: 'Lunges', category: 'Legs', isCustom: false },
	{ id: 'leg-curl', name: 'Leg Curl', category: 'Legs', isCustom: false },
	{ id: 'leg-extension', name: 'Leg Extension', category: 'Legs', isCustom: false },
	{ id: 'calf-raise', name: 'Calf Raise', category: 'Legs', isCustom: false },
	{ id: 'romanian-deadlift', name: 'Romanian Deadlift', category: 'Legs', isCustom: false },

	// Shoulders
	{ id: 'overhead-press', name: 'Overhead Press', category: 'Shoulders', isCustom: false },
	{ id: 'lateral-raise', name: 'Lateral Raise', category: 'Shoulders', isCustom: false },
	{ id: 'front-raise', name: 'Front Raise', category: 'Shoulders', isCustom: false },
	{ id: 'reverse-fly', name: 'Reverse Fly', category: 'Shoulders', isCustom: false },
	{ id: 'arnold-press', name: 'Arnold Press', category: 'Shoulders', isCustom: false },

	// Arms
	{ id: 'bicep-curl', name: 'Bicep Curl', category: 'Arms', isCustom: false },
	{ id: 'hammer-curl', name: 'Hammer Curl', category: 'Arms', isCustom: false },
	{ id: 'tricep-pushdown', name: 'Tricep Pushdown', category: 'Arms', isCustom: false },
	{ id: 'tricep-dip', name: 'Tricep Dip', category: 'Arms', isCustom: false },
	{ id: 'skull-crusher', name: 'Skull Crusher', category: 'Arms', isCustom: false },
	{ id: 'preacher-curl', name: 'Preacher Curl', category: 'Arms', isCustom: false },

	// Core
	{ id: 'plank', name: 'Plank', category: 'Core', isCustom: false },
	{ id: 'crunch', name: 'Crunch', category: 'Core', isCustom: false },
	{ id: 'russian-twist', name: 'Russian Twist', category: 'Core', isCustom: false },
	{ id: 'leg-raise', name: 'Leg Raise', category: 'Core', isCustom: false },
	{ id: 'ab-wheel', name: 'Ab Wheel Rollout', category: 'Core', isCustom: false },

	// Cardio
	{ id: 'treadmill', name: 'Treadmill', category: 'Cardio', isCustom: false },
	{ id: 'cycling', name: 'Cycling', category: 'Cardio', isCustom: false },
	{ id: 'rowing', name: 'Rowing Machine', category: 'Cardio', isCustom: false },
	{ id: 'jump-rope', name: 'Jump Rope', category: 'Cardio', isCustom: false },
];

export const categories = [...new Set(exerciseDatabase.map(e => e.category))];
