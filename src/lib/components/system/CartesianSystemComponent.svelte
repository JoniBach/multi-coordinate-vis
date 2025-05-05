<script lang="ts">
	import type { System } from '$lib/utils/coordinate.schema.js';
	import { onMount } from 'svelte';
	import * as d3 from 'd3';

	let { system = $bindable<System>() } = $props();
	let chartContainer = $state<HTMLDivElement>();

	$effect(() => {
		if (!system?.success) {
			return;
		}

		// Clear any existing content
		chartContainer.innerHTML = '';

		const svg = d3
			.select(chartContainer)
			.append('svg')
			.attr('width', '100%')
			.attr('height', '100%')
			.append('g')
			.attr('transform', 'translate(50, 50)');

		const xScale = d3
			.scaleBand()
			.domain(system.data.map((d) => d.x as string))
			.range([0, 400])
			.padding(0.2);
		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(system.data, (d) => d.y)])
			.range([400, 0]);

		const xAxis = d3.axisBottom(xScale);
		const yAxis = d3.axisLeft(yScale);

		svg.append('g').attr('transform', 'translate(0, 400)').call(xAxis);
		svg.append('g').call(yAxis);

		svg
			.selectAll('circle')
			.data(system.data)
			.enter()
			.append('circle')
			.attr('cx', (d) => xScale(d.x))
			.attr('cy', (d) => yScale(d.y))
			.attr('r', 5);
	});
</script>

{#if system?.loading}
	Loading...
{:else if system?.error}
	Error: {system.error.name}
{:else if system?.success}
	<div bind:this={chartContainer} style="width: 500px; height: 500px;"></div>
{/if}
