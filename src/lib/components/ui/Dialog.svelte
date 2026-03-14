<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		open: boolean;
		onclose?: () => void;
		children: Snippet;
		class?: string;
	}

	let { open = $bindable(false), onclose, children, class: className }: Props = $props();

	function close() {
		open = false;
		onclose?.();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center"
		role="dialog"
		aria-modal="true"
		onkeydown={handleKeydown}
	>
		<button
			class="fixed inset-0 bg-black/80 cursor-default"
			onclick={close}
			aria-label="Close dialog"
			tabindex="-1"
		></button>
		<div class={cn('relative z-50 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-lg border bg-background p-6 shadow-lg', className)}>
			{@render children()}
		</div>
	</div>
{/if}
