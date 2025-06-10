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

			console.log('system');
			// Create SVG once
			const svg = system.series.svg(system, container);
			for (const seriesId of system.series.list) {
				const seriesConfig = system.series.config[seriesId];
				const seriesScale = system.series.scale[seriesId];
				console.log('seriesScale', seriesScale);
				for (const feature of seriesConfig.features) {
					console.log('feature', system.series.data[seriesId]);
					system.series.feature(system, svg, seriesId)[feature]();
				}
				// console.log('seriesConfig', seriesConfig);
				// system.series.feature(system, svg, system.features[fetureKey])[fetureKey]();
			}
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
	<div id={system.id} style="width: {system.config.size}px; height: {system.config.size}px;" />
{/if}
