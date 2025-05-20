<script lang="ts">
	import * as d3 from 'd3';
	let { system = $bindable<unknown>() } = $props();
	let chartContainer = $state<HTMLDivElement>();

	$effect(() => {
		if (!system) return;
		if (system.loading) return;
		if (!system.success) return;
		console.log(system);
		// Create SVG
		const svg = d3
			.select(chartContainer)
			.append('svg')
			.attr('width', system.config.width)
			.attr('height', system.config.height);

		const xAxis = d3.axisBottom(system.scale.x);
		const yAxis = d3.axisLeft(system.scale.y);

		svg
			.append('g')
			.attr('transform', `translate(0, ${system.config.height - system.config.margin})`)
			.call(xAxis)
			.selectAll('text')
			.attr('transform', 'rotate(-45)')
			.attr('text-anchor', 'end');

		svg.append('g').attr('transform', `translate(${system.config.margin}, 0)`).call(yAxis);

		svg
			.append('text')
			.attr('x', system.config.width / 2)
			.attr('y', system.config.height)
			.attr('text-anchor', 'middle')
			.text(system.schema.x.label);

		svg
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('x', -system.config.height / 2)
			.attr('y', 15)
			.attr('text-anchor', 'middle')
			.text(system.schema.y.label);

		svg
			.append('text')
			.attr('x', system.config.width / 2)
			.attr('y', system.config.margin)
			.attr('text-anchor', 'middle')
			.text(system.config.title);

		svg
			.append('g')
			.selectAll('circle')
			.data(system.data)
			.enter()
			.append('circle')
			.attr('cx', (d) => system.scale.x(d.x))
			.attr('cy', (d) => system.scale.y(d.y))
			.attr('r', 5)
			.attr('fill', '#1976d2');
	});
</script>

{#if !system || system.loading}
	<p>Loading...</p>
{:else if !system.success}
	<p>Failed to load data</p>
{:else}
	<div
		bind:this={chartContainer}
		style="width: {system.config.width}px; height: {system.config.height}px;"
	/>
{/if}
