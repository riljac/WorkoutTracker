<script lang="ts">
	import { goto } from '$app/navigation';
	import { sessionStore } from '$lib/stores/sessions.svelte';
	import { customExerciseStore } from '$lib/stores/exercises.svelte';
	import { categories } from '$lib/exercises';
	import type { Exercise, ExerciseEntry, WorkoutSession } from '$lib/types';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import { haptics } from '$lib/haptics';

	interface Props {
		session?: WorkoutSession;
	}

	let { session: initialSession }: Props = $props();

	// Capture initial values once — session prop won't change after mount
	const isEditing = !!initialSession;
	const init = initialSession ?? {} as Partial<WorkoutSession>;

	let name = $state(init.name ?? '');
	let date = $state(init.date ?? new Date().toISOString().split('T')[0]);
	let notes = $state(init.notes ?? '');
	let exercises = $state<ExerciseEntry[]>(init.exercises ? [...init.exercises] : []);

	// Exercise picker state
	let showExercisePicker = $state(false);
	let selectedCategory = $state('All');
	let searchQuery = $state('');

	// Custom exercise state
	let showCustomDialog = $state(false);
	let customName = $state('');
	let customCategory = $state('Chest');

	const filteredExercises = $derived(() => {
		let list = customExerciseStore.allExercises;
		if (selectedCategory !== 'All') {
			list = list.filter(e => e.category === selectedCategory);
		}
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			list = list.filter(e => e.name.toLowerCase().includes(q));
		}
		return list;
	});

	function addExercise(exercise: Exercise) {
		exercises = [...exercises, {
			exercise,
			sets: [
				{ reps: 10, weight: 0 },
				{ reps: 10, weight: 0 },
				{ reps: 10, weight: 0 }
			],
			notes: ''
		}];
		showExercisePicker = false;
		searchQuery = '';
		haptics.medium();
	}

	function removeExercise(index: number) {
		exercises = exercises.filter((_, i) => i !== index);
		haptics.warning();
	}

	function addSet(exerciseIndex: number) {
		const entry = exercises[exerciseIndex];
		const lastSet = entry.sets[entry.sets.length - 1];
		entry.sets = [...entry.sets, { reps: lastSet?.reps ?? 10, weight: lastSet?.weight ?? 0 }];
		exercises = [...exercises];
		haptics.tap();
	}

	function removeSet(exerciseIndex: number, setIndex: number) {
		const entry = exercises[exerciseIndex];
		if (entry.sets.length <= 1) return;
		entry.sets = entry.sets.filter((_, i) => i !== setIndex);
		exercises = [...exercises];
		haptics.tap();
	}

	function addCustomExercise() {
		if (!customName.trim()) return;
		const exercise = customExerciseStore.add(customName.trim(), customCategory);
		addExercise(exercise);
		customName = '';
		showCustomDialog = false;
	}

	function saveSession() {
		if (!name.trim()) {
			haptics.error();
			return;
		}

		const sessionData: WorkoutSession = {
			id: init.id ?? `session-${Date.now()}`,
			name: name.trim(),
			date,
			exercises,
			notes: notes.trim()
		};

		if (isEditing) {
			sessionStore.update(sessionData);
		} else {
			sessionStore.add(sessionData);
		}

		haptics.success();
		goto('/sessions');
	}
</script>

<div class="max-w-4xl mx-auto p-4 sm:p-6">
	<header class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">
				{isEditing ? 'Edit Session' : 'New Session'}
			</h1>
		</div>
		<Button variant="outline" onclick={() => goto('/sessions')}>Cancel</Button>
	</header>

	<div class="space-y-6">
		<!-- Session Details -->
		<Card class="p-6 space-y-4">
			<h2 class="text-lg font-semibold">Session Details</h2>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="session-name">Session Name</Label>
					<Input id="session-name" placeholder="e.g. Upper Body Day" bind:value={name} />
				</div>
				<div class="space-y-2">
					<Label for="session-date">Date</Label>
					<Input id="session-date" type="date" bind:value={date} />
				</div>
			</div>

			<div class="space-y-2">
				<Label for="session-notes">Notes (optional)</Label>
				<Textarea id="session-notes" placeholder="Any notes about this session..." bind:value={notes} />
			</div>
		</Card>

		<!-- Exercises -->
		<Card class="p-6">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-lg font-semibold">Exercises</h2>
				<div class="flex gap-2">
					<Button variant="outline" size="sm" onclick={() => { showCustomDialog = true; }}>
						+ Custom Exercise
					</Button>
					<Button size="sm" onclick={() => { showExercisePicker = true; }}>
						+ Add Exercise
					</Button>
				</div>
			</div>

			{#if exercises.length === 0}
				<div class="text-center py-8 text-muted-foreground">
					<p>No exercises added yet. Click "Add Exercise" to get started.</p>
				</div>
			{:else}
				<div class="space-y-4">
					{#each exercises as entry, index (index)}
						<div class="border rounded-lg p-4">
							<div class="flex items-center justify-between mb-3">
								<div class="flex items-center gap-2">
									<span class="font-medium">{entry.exercise.name}</span>
									<Badge variant="secondary" class="text-xs">{entry.exercise.category}</Badge>
									{#if entry.exercise.isCustom}
										<Badge variant="outline" class="text-xs">Custom</Badge>
									{/if}
								</div>
								<Button variant="ghost" size="sm" onclick={() => removeExercise(index)}>
									Remove
								</Button>
							</div>

							<!-- Set headers -->
							<div class="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center mb-1 px-1">
								<span class="text-xs text-muted-foreground w-12">Set</span>
								<span class="text-xs text-muted-foreground">Reps</span>
								<span class="text-xs text-muted-foreground">Weight (lbs)</span>
								<span class="w-8"></span>
							</div>

							<!-- Individual sets -->
							<div class="space-y-2">
								{#each entry.sets as set, setIndex (setIndex)}
									<div class="grid grid-cols-[auto_1fr_1fr_auto] gap-2 items-center">
										<span class="text-sm text-muted-foreground w-12 text-center font-medium">{setIndex + 1}</span>
										<Input type="number" min="1" bind:value={set.reps} class="h-9" />
										<Input type="number" min="0" bind:value={set.weight} class="h-9" />
										<button
											class="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-destructive-foreground hover:bg-destructive/80 rounded transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
											onclick={() => removeSet(index, setIndex)}
											disabled={entry.sets.length <= 1}
											title="Remove set"
										>&times;</button>
									</div>
								{/each}
							</div>

							<Button variant="outline" size="sm" class="mt-2 w-full" onclick={() => addSet(index)}>
								+ Add Set
							</Button>

							<div class="mt-3 space-y-1">
								<Label class="text-xs">Notes</Label>
								<Input placeholder="e.g. Drop set on last set" bind:value={entry.notes} />
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</Card>

		<!-- Save -->
		<div class="flex justify-end gap-2">
			<Button variant="outline" onclick={() => goto('/sessions')}>Cancel</Button>
			<Button onclick={saveSession} disabled={!name.trim()}>
				{isEditing ? 'Save Changes' : 'Create Session'}
			</Button>
		</div>
	</div>
</div>

<!-- Exercise Picker Dialog -->
<Dialog bind:open={showExercisePicker}>
	<h2 class="text-lg font-semibold mb-4">Add Exercise</h2>

	<div class="space-y-3 mb-4">
		<Input placeholder="Search exercises..." bind:value={searchQuery} />
		<div class="flex gap-2 flex-wrap">
			<button
				class="px-2 py-1 text-xs rounded-full border cursor-pointer transition-colors {selectedCategory === 'All' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}"
				onclick={() => { selectedCategory = 'All'; haptics.selection(); }}
			>All</button>
			{#each categories as cat}
				<button
					class="px-2 py-1 text-xs rounded-full border cursor-pointer transition-colors {selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}"
					onclick={() => { selectedCategory = cat; haptics.selection(); }}
				>{cat}</button>
			{/each}
		</div>
	</div>

	<div class="space-y-1 max-h-[40vh] overflow-y-auto">
		{#each filteredExercises() as exercise (exercise.id)}
			<button
				class="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors flex items-center justify-between cursor-pointer"
				onclick={() => addExercise(exercise)}
			>
				<span class="text-sm">{exercise.name}</span>
				<div class="flex items-center gap-1">
					<Badge variant="secondary" class="text-xs">{exercise.category}</Badge>
					{#if exercise.isCustom}
						<Badge variant="outline" class="text-xs">Custom</Badge>
					{/if}
				</div>
			</button>
		{/each}
		{#if filteredExercises().length === 0}
			<p class="text-center text-muted-foreground py-4 text-sm">No exercises found</p>
		{/if}
	</div>

	<div class="mt-4 pt-4 border-t">
		<Button variant="outline" class="w-full" onclick={() => { showExercisePicker = false; showCustomDialog = true; }}>
			Create Custom Exercise
		</Button>
	</div>
</Dialog>

<!-- Custom Exercise Dialog -->
<Dialog bind:open={showCustomDialog}>
	<h2 class="text-lg font-semibold mb-4">Create Custom Exercise</h2>

	<div class="space-y-4">
		<div class="space-y-2">
			<Label for="custom-name">Exercise Name</Label>
			<Input id="custom-name" placeholder="e.g. Bulgarian Split Squat" bind:value={customName} />
		</div>
		<div class="space-y-2">
			<Label for="custom-category">Category</Label>
			<Select id="custom-category" bind:value={customCategory}>
				{#each categories as cat}
					<option value={cat}>{cat}</option>
				{/each}
			</Select>
		</div>
		<div class="flex justify-end gap-2">
			<Button variant="outline" onclick={() => { showCustomDialog = false; }}>Cancel</Button>
			<Button onclick={addCustomExercise} disabled={!customName.trim()}>Add Exercise</Button>
		</div>
	</div>
</Dialog>
