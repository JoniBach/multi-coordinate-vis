<script lang="ts">
	import type { System } from '$lib/utils/coordinate.schema.js';
	import * as d3 from 'd3';
	let { system = $bindable<System>() } = $props();
	let { data, success, loading, config } = $derived(system);
	let chartContainer = $state<HTMLDivElement>();

	$effect(() => {
		console.log(system);
		if (loading) return;
		if (!success) return;
		if (!chartContainer) return;

		// Clear previous content
		chartContainer.innerHTML = '';

		// Determine scale and padding
		const width = config.width;
		const height = config.height;
		const margin = config.margin;

		// Calculate dynamic scales
		const xExtent = d3.extent(data.map((d) => Number(d.x))) || [0, 1];
		const yExtent = d3.extent(data.map((d) => Number(d.y))) || [0, 1];

		const xScale = d3
			.scaleLinear()
			.domain([Math.min(...xExtent), Math.max(...xExtent)])
			.range([margin, width - margin]);

		const yScale = d3
			.scaleLinear()
			.domain([Math.min(...yExtent), Math.max(...yExtent)])
			.range([height - margin, margin]);

		// Create SVG
		const svg = d3.select(chartContainer).append('svg').attr('width', width).attr('height', height);

		// Draw axes
		const xAxis = d3.axisBottom(xScale);
		const yAxis = d3.axisLeft(yScale);

		svg
			.append('g')
			.attr('transform', `translate(0, ${height - margin})`)
			.call(xAxis);

		svg.append('g').attr('transform', `translate(${margin}, 0)`).call(yAxis);

		// Add axis labels
		svg
			.append('text')
			.attr('x', width / 2)
			.attr('y', height)
			.attr('text-anchor', 'middle')
			.text('x');

		svg
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('x', -height / 2)
			.attr('y', 15)
			.attr('text-anchor', 'middle')
			.text('y');

		// Plot points
		svg
			.selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
			.attr('cx', (d) => xScale(d.x))
			.attr('cy', (d) => yScale(d.y))
			.attr('r', 5)
			.attr('fill', '#1976d2');
	});
</script>

{#if loading}
	Loading...
{:else if system.error}
	Error: {system.error.name}
{:else if !success}
	No data
{:else}
	<div bind:this={chartContainer} style="width: {config.width}px; height: {config.height}px;"></div>
{/if}
