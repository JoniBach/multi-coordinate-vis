<script lang="ts">
	import type { System } from '$lib/utils/coordinate.schema.js';
	import * as d3 from 'd3';
	import { calculateExtent } from '$lib/utils/scale.js';
	let { system = $bindable<System>() } = $props();
	let { data, success, loading, config, schema } = $derived(system);
	let chartContainer = $state<HTMLDivElement>();

	$effect(() => {
		console.log(system);
		if (loading) return;
		if (!success) return;
		if (!chartContainer) return;

		// Clear previous content
		chartContainer.innerHTML = '';

		// Determine scale and padding

		const isMultiSeries = system.metadata.multiseries;

		const xType = schema.input.x.type;
		const yType = schema.input.y.type;
		console.log(xType, yType);
		// Calculate dynamic scales
		// const yExtent = d3.extent(data.map((d) => new Date(d.y))) || [new Date(0), new Date()];
		// const xExtent = d3.extent(data.map((d) => new Date(d.x))) || [new Date(0), new Date()];
		const yExtent = calculateExtent[yType](data.map((d) => d.y));
		const xExtent = calculateExtent[xType](data.map((d) => d.x));

		const xScale = d3
			.scaleLinear()
			.domain([Math.min(...xExtent), Math.max(...xExtent)])
			.range([config.margin, config.width - config.margin]);

		const yScale = d3
			.scaleLinear()
			.domain([Math.min(...yExtent), Math.max(...yExtent)])
			.range([config.height - config.margin, config.margin]);

		console.log({ xType, yType, xExtent, yExtent });

		// Create SVG
		const svg = d3
			.select(chartContainer)
			.append('svg')
			.attr('width', config.width)
			.attr('height', config.height);

		// Draw axes
		const xAxis = d3.axisBottom(xScale);
		const yAxis = d3.axisLeft(yScale);

		svg
			.append('g')
			.attr('transform', `translate(0, ${config.height - config.margin})`)
			.call(xAxis);

		svg.append('g').attr('transform', `translate(${config.margin}, 0)`).call(yAxis);

		// Add axis labels
		svg
			.append('text')
			.attr('x', config.width / 2)
			.attr('y', config.height)
			.attr('text-anchor', 'middle')
			.text('x');

		svg
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('x', -config.height / 2)
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
{:else if !success}
	Error: {system?.error?.name}
{:else}
	<div bind:this={chartContainer} style="width: {config.width}px; height: {config.height}px;"></div>
{/if}
