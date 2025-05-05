<script lang="ts">
	import * as d3 from 'd3';
	import { hexbin as d3_hexbin } from 'd3-hexbin';
	let { data, schema } = $props();
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

		// Determine dimensions
		const width = 400;
		const height = 400;

		// Create SVG
		const svg = d3
			.select(chartContainer)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g');

		// Dynamic scales for x and y
		const xExtent = d3.extent(parsedData.map((d) => Number(d.x || 0))) || [0, width];
		const yExtent = d3.extent(parsedData.map((d) => Number(d.y || 0))) || [0, height];

		// Create hexbin generator
		const hexbin = d3_hexbin()
			.x((d: any) => Number(d.x || 0))
			.y((d: any) => Number(d.y || 0))
			.radius(25)
			.extent([
				[0, 0],
				[width, height]
			]);

		const bins = hexbin(parsedData);

		// Find max bin length for opacity scaling
		const maxBinLength = d3.max(bins, (b) => b.length) || 1;

		// Draw hexbin paths
		svg
			.selectAll('path')
			.data(bins)
			.enter()
			.append('path')
			.attr('d', () => hexbin.hexagon())
			.attr('transform', (d) => `translate(${d.x},${d.y})`)
			.attr('fill', '#1976d2')
			.attr('fill-opacity', (d) => 0.2 + (0.6 * d.length) / maxBinLength)
			.attr('stroke', '#333');

		// X-axis
		svg
			.append('g')
			.attr('transform', `translate(0,${height - 30})`)
			.call(d3.axisBottom(d3.scaleLinear().domain(xExtent).range([0, width])).ticks(8))
			.append('text')
			.attr('x', width - 10)
			.attr('y', -6)
			.attr('fill', '#333')
			.attr('text-anchor', 'end')
			.text('x');

		// Y-axis
		svg
			.append('g')
			.attr('transform', `translate(30,0)`)
			.call(d3.axisLeft(d3.scaleLinear().domain(yExtent).range([height, 0])).ticks(8))
			.append('text')
			.attr('x', 6)
			.attr('y', 10)
			.attr('fill', '#333')
			.attr('text-anchor', 'start')
			.text('y');
	});
</script>

<div bind:this={chartContainer} style="width: 400px; height: 400px;"></div>
