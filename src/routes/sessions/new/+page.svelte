<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth.svelte';
	import SessionEditor from '$lib/components/SessionEditor.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		if (!auth.isAuthenticated) goto('/login');
	});
</script>

<SessionEditor />
