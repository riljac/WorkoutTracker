<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte';
	import { sessionStore } from '$lib/stores/sessions.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Card from '$lib/components/ui/Card.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { onMount } from 'svelte';
	import { haptics } from '$lib/haptics';

	onMount(() => {
		if (!auth.isAuthenticated) {
			goto('/login');
		}
	});

	function handleLogout() {
		auth.logout();
		goto('/login');
	}

	function deleteSession(id: string) {
		haptics.warning();
		if (confirm('Delete this workout session?')) {
			sessionStore.remove(id);
			haptics.success();
		}
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<div class="max-w-4xl mx-auto p-4 sm:p-6">
	<header class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-2xl font-bold tracking-tight">My Workouts</h1>
			<p class="text-muted-foreground">Welcome, {auth.user?.username}</p>
		</div>
		<div class="flex gap-2">
			<Button onclick={() => goto('/sessions/new')}>+ New Session</Button>
			<Button variant="outline" onclick={handleLogout}>Sign Out</Button>
		</div>
	</header>

	{#if sessionStore.sessions.length === 0}
		<Card class="p-12 text-center">
			<div class="text-muted-foreground">
				<p class="text-lg font-medium mb-1">No workout sessions yet</p>
				<p class="text-sm mb-4">Create your first workout session to get started</p>
				<Button onclick={() => goto('/sessions/new')}>Create Session</Button>
			</div>
		</Card>
	{:else}
		<div class="space-y-3">
			{#each sessionStore.sessions as session (session.id)}
				<Card class="p-4 hover:border-foreground/20 transition-colors">
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2 mb-1">
								<h2 class="font-semibold truncate">{session.name}</h2>
								<Badge variant="secondary">{session.exercises.length} exercises</Badge>
							</div>
							<p class="text-sm text-muted-foreground">{formatDate(session.date)}</p>
							{#if session.exercises.length > 0}
								<div class="flex flex-wrap gap-1 mt-2">
									{#each session.exercises.slice(0, 5) as entry}
										<Badge variant="outline" class="text-xs">{entry.exercise.name}</Badge>
									{/each}
									{#if session.exercises.length > 5}
										<Badge variant="outline" class="text-xs">+{session.exercises.length - 5} more</Badge>
									{/if}
								</div>
							{/if}
							{#if session.notes}
								<p class="text-sm text-muted-foreground mt-2 truncate">{session.notes}</p>
							{/if}
						</div>
						<div class="flex gap-2 shrink-0">
							<Button variant="outline" size="sm" onclick={() => goto(`/sessions/edit?id=${session.id}`)}>
								Edit
							</Button>
							<Button variant="destructive" size="sm" onclick={() => deleteSession(session.id)}>
								Delete
							</Button>
						</div>
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</div>
