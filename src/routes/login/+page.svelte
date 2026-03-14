<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import { haptics } from '$lib/haptics';

	let username = $state('');
	let password = $state('');
	let error = $state('');

	function handleLogin(e: Event) {
		e.preventDefault();
		error = '';

		if (!username.trim()) {
			error = 'Username is required';
			haptics.error();
			return;
		}
		if (password.length < 4) {
			error = 'Password must be at least 4 characters';
			haptics.error();
			return;
		}

		const success = auth.login(username.trim(), password);
		if (success) {
			haptics.success();
			goto('/sessions');
		} else {
			error = 'Invalid credentials';
			haptics.error();
		}
	}
</script>

<div class="flex items-center justify-center min-h-screen p-4">
	<Card class="w-full max-w-md p-8">
		<div class="text-center mb-8">
			<h1 class="text-3xl font-bold tracking-tight">Workout Tracker</h1>
			<p class="text-muted-foreground mt-2">Sign in to manage your workouts</p>
		</div>

		<form onsubmit={handleLogin} class="space-y-4">
			<div class="space-y-2">
				<Label for="username">Username</Label>
				<Input
					id="username"
					type="text"
					placeholder="Enter your username"
					bind:value={username}
					autocomplete="username"
				/>
			</div>

			<div class="space-y-2">
				<Label for="password">Password</Label>
				<Input
					id="password"
					type="password"
					placeholder="Enter your password"
					bind:value={password}
					autocomplete="current-password"
				/>
			</div>

			{#if error}
				<p class="text-sm text-red-500">{error}</p>
			{/if}

			<Button type="submit" class="w-full">Sign In</Button>
		</form>

		<p class="text-xs text-muted-foreground text-center mt-4">
			Enter any username (3+ chars) and password (4+ chars) to sign in
		</p>
	</Card>
</div>
