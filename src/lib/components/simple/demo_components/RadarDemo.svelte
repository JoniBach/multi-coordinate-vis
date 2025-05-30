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

		// Determine dimensions
		const width = config.width;
		const height = config.height;
		const margin = config.margin;
		const radius = Math.min(width, height) / 2 - margin;

		// Create SVG
		const svg = d3
			.select(chartContainer)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`);

		// Dynamically determine variables
		const variables =
			parsedData.length > 0 ? Object.keys(parsedData[0]).filter((k) => k !== 'species') : [];
		const angleSlice = (2 * Math.PI) / variables.length;

		// Dynamic scales for each variable
		const variableExtents = variables.map(
			(v) => d3.extent(parsedData.map((d) => Number(d[v] || 0))) || [0, 1]
		);

		const rScale = d3
			.scaleLinear()
			.domain([0, Math.max(...variableExtents.map((extent) => Math.max(...extent)))])
			.range([0, radius]);

		// Draw circular grid
		const gridLevels = config.gridLevels;
		for (let i = 1; i <= gridLevels; i++) {
			svg
				.append('circle')
				.attr('r', (radius / gridLevels) * i)
				.attr('fill', 'none')
				.attr('stroke', '#ccc');
		}

		// Draw axes
		variables.forEach((v, i) => {
			const angle = angleSlice * i - Math.PI / 2;
			svg
				.append('line')
				.attr('x1', 0)
				.attr('y1', 0)
				.attr('x2', radius * Math.cos(angle))
				.attr('y2', radius * Math.sin(angle))
				.attr('stroke', '#999');
			svg
				.append('text')
				.attr('x', (radius + 10) * Math.cos(angle))
				.attr('y', (radius + 10) * Math.sin(angle))
				.attr('text-anchor', 'middle')
				.attr('alignment-baseline', 'middle')
				.attr('font-size', '13px')
				.text(v.replace('_', ' '));
		});

		// Draw data polygons
		const color = d3.scaleOrdinal(d3.schemeCategory10);
		parsedData.forEach((d, i) => {
			const points = variables.map((v, j) => {
				const angle = angleSlice * j - Math.PI / 2;
				const r = rScale(Number(d[v] || 0));
				return [r * Math.cos(angle), r * Math.sin(angle)];
			});
			svg
				.append('polygon')
				.attr('points', points.map((p) => p.join(',')).join(' '))
				.attr('fill', color(i.toString()))
				.attr('fill-opacity', 0.2)
				.attr('stroke', color(i.toString()))
				.attr('stroke-width', 2);
			// Label
			svg
				.append('text')
				.attr('x', points[0][0])
				.attr('y', points[0][1] - 10)
				.attr('text-anchor', 'middle')
				.attr('font-size', '12px')
				.attr('fill', color(i.toString()))
				.text(d.species || '');
		});
	});
</script>

<div bind:this={chartContainer} style="width: {config.width}px; height: {config.height}px;"></div>
