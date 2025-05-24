<script lang="ts">
	let { system = $bindable<unknown>() } = $props();

	$effect(() => {
		if (!system) return;
		if (system.loading) return;
		if (!system.success) return;

		try {
			// Clear container before creating SVG
			const container = document.getElementById(system.id);
			if (!container) return;
			container.innerHTML = '';

			// Check if SVG already exists to prevent duplicates
			if (container.querySelector('svg')) return;

			// Create SVG once
			const svg = system.vis.svg(system, container);

			// for (const feature of system.features) {
			// 	system.vis.feature(system, svg)[feature]();
			// }
		} catch (error) {
			console.error('Error creating visualization:', error);
		}
	});
</script>

{#if !system || system.loading}
	<p>Loading...</p>
{:else if !system.success}
	<p>Failed to load data</p>
{:else}
	<div id={system.id} style="width: {system.config.width}px; height: {system.config.height}px;" />
{/if}
