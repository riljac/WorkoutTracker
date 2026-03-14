<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth.svelte';
	import { sessionStore } from '$lib/stores/sessions.svelte';
	import SessionEditor from '$lib/components/SessionEditor.svelte';
	import type { WorkoutSession } from '$lib/types';
	import { onMount } from 'svelte';

	let session = $state<WorkoutSession | undefined>(undefined);
	let loading = $state(true);

	onMount(() => {
		if (!auth.isAuthenticated) {
			goto('/login');
			return;
		}

		const id = $page.url.searchParams.get('id');
		if (!id) {
			goto('/sessions');
			return;
		}

		session = sessionStore.get(id);
		if (!session) {
			goto('/sessions');
			return;
		}

		loading = false;
	});
</script>

{#if loading}
	<div class="flex items-center justify-center min-h-screen">
		<p class="text-muted-foreground">Loading...</p>
	</div>
{:else if session}
	<SessionEditor {session} />
{/if}
