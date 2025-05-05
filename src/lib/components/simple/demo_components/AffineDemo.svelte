<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	let { data, schema, config } = $props();
	let chartContainer = $state<HTMLDivElement>();

	$effect(() => {
		if (!chartContainer) return;

		// Clear previous content
		chartContainer.innerHTML = '';

		const validatedData = schema.safeParse(data);
		if (!validatedData.success) {
			console.error('Invalid data:', validatedData.error);
			return;
		}
		const parsedData = validatedData.data || [];

		// Affine transformation matrix
		const affineMat = [
			[1.2, 0.5],
			[0.3, 1.1]
		];

		// Transform points
		const transformedPoints = parsedData.map((d) => ({
			...d,
			tx: (d.x || 0) * affineMat[0][0] + (d.y || 0) * affineMat[0][1],
			ty: (d.x || 0) * affineMat[1][0] + (d.y || 0) * affineMat[1][1]
		}));

		// Calculate dynamic scales
		const xExtent = d3.extent(transformedPoints.map((d) => d.tx)) || [0, 1];
		const yExtent = d3.extent(transformedPoints.map((d) => d.ty)) || [0, 1];

		// Determine scale and padding
		const width = config.width;
		const height = config.height;
		const margin = config.margin;

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
			.text('x (affine)');

		svg
			.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('x', -height / 2)
			.attr('y', 15)
			.attr('text-anchor', 'middle')
			.text('y (affine)');

		// Plot transformed points
		transformedPoints.forEach((d) => {
			svg
				.append('circle')
				.attr('cx', xScale(d.tx))
				.attr('cy', yScale(d.ty))
				.attr('r', 8)
				.attr('fill', '#1976d2');

			svg
				.append('text')
				.attr('x', xScale(d.tx) + 10)
				.attr('y', yScale(d.ty))
				.attr('font-size', '12px')
				.attr('alignment-baseline', 'middle')
				.text(d.label);
		});
	});
</script>

<div bind:this={chartContainer} style="width: {config.width}px; height: {config.height}px;"></div>
