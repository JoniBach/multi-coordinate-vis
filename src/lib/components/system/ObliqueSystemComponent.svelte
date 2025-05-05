<script lang="ts">
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
		const width = config.width;
		const height = config.height;
		const margin = config.margin;
		const skewX = config.skewX || 0; // degrees
		const skewY = config.skewY || 0; // degrees
		const skewMat = [
			[1, Math.tan((skewX * Math.PI) / 180)],
			[Math.tan((skewY * Math.PI) / 180), 1]
		];
		const scaleExtent = config.scaleExtent || 200;

		// Determine dynamic scale based on data
		const xExtent = d3.extent(parsedData.map((d) => Number(d.x || 0))) || [0, 1];
		const yExtent = d3.extent(parsedData.map((d) => Number(d.y || 0))) || [0, 1];
		const maxExtent = Math.max(
			Math.abs(xExtent[0] || 0),
			Math.abs(xExtent[1] || 0),
			Math.abs(yExtent[0] || 0),
			Math.abs(yExtent[1] || 0)
		);
		const scaleFactor = scaleExtent / maxExtent;

		// Create SVG
		const svg = d3
			.select(chartContainer)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${margin},${margin})`);

		// Draw axes
		svg
			.append('line')
			.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', scaleExtent)
			.attr('y2', 0)
			.attr('stroke', '#333');
		svg
			.append('line')
			.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', skewMat[0][1] * scaleExtent)
			.attr('y2', scaleExtent)
			.attr('stroke', '#333');

		// Add axis labels for oblique axes
		svg
			.append('text')
			.attr('x', scaleExtent)
			.attr('y', -10)
			.attr('text-anchor', 'end')
			.attr('fill', '#333')
			.text('x (skewed)');
		svg
			.append('text')
			.attr('x', skewMat[0][1] * scaleExtent + 10)
			.attr('y', scaleExtent)
			.attr('text-anchor', 'start')
			.attr('fill', '#333')
			.text('y (skewed)');

		// Transform and plot points
		parsedData.forEach((d) => {
			const x = Number(d.x || 0) * skewMat[0][0] + Number(d.y || 0) * skewMat[0][1];
			const y = Number(d.x || 0) * skewMat[1][0] + Number(d.y || 0) * skewMat[1][1];
			svg
				.append('circle')
				.attr('cx', x * scaleFactor)
				.attr('cy', y * scaleFactor)
				.attr('r', 8)
				.attr('fill', '#1976d2');
			svg
				.append('text')
				.attr('x', x * scaleFactor + 10)
				.attr('y', y * scaleFactor)
				.attr('font-size', '12px')
				.attr('alignment-baseline', 'middle')
				.text(d.label || '');
		});
	});
</script>

<div bind:this={chartContainer} style="width: {config.width}px; height: {config.height}px;"></div>
