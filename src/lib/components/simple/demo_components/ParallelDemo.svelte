<script lang="ts">
	import * as d3 from 'd3';
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

		// Ensure we have data and dimensions
		if (parsedData.length === 0) return;

		const margin = { top: 30, right: 10, bottom: 10, left: 10 };
		const width = 500 - margin.left - margin.right;
		const height = 300 - margin.top - margin.bottom;

		// Create SVG
		const svg = d3
			.select(chartContainer)
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		// Dynamically determine dimensions
		const dimensions = Object.keys(parsedData[0] || {});

		// Create scales for each dimension
		const y: Record<string, d3.ScaleLinear<number, number>> = {};
		dimensions.forEach((dim) => {
			// Safely extract numeric values
			const values = parsedData.map((d) => Number(d[dim] || 0));
			y[dim] = d3
				.scaleLinear()
				.domain([Math.min(...values), Math.max(...values)])
				.range([height, 0]);
		});

		const x = d3.scalePoint().domain(dimensions).range([0, width]);

		// Create path generator
		function path(d: Record<string, number>) {
			return d3.line()(dimensions.map((p) => [x(p) || 0, y[p](Number(d[p] || 0))])) || '';
		}

		// Draw lines
		svg
			.selectAll('path.data-line')
			.data(parsedData)
			.enter()
			.append('path')
			.attr('class', 'data-line')
			.attr('d', path)
			.attr('fill', 'none')
			.attr('stroke', '#1976d2')
			.attr('stroke-width', 2)
			.attr('opacity', 0.7);

		// Draw axes
		dimensions.forEach((dim) => {
			svg
				.append('g')
				.attr('transform', `translate(${x(dim) || 0},0)`)
				.call(d3.axisLeft(y[dim]))
				.append('text')
				.attr('y', -9)
				.attr('text-anchor', 'middle')
				.attr('fill', '#333')
				.text(dim);
		});
	});
</script>

<div bind:this={chartContainer} style="width: 500px; height: 300px;"></div>
