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
		const size = width - 2 * margin;

		// Create SVG
		const svg = d3
			.select(chartContainer)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${margin},${margin})`);

		// Triangle corners
		const corners = [
			[size / 2, 0],
			[0, size * Math.sin(Math.PI / 3)],
			[size, size * Math.sin(Math.PI / 3)]
		];

		// Draw triangle
		svg
			.append('polygon')
			.attr('points', corners.map((d) => d.join(',')).join(' '))
			.attr('fill', 'none')
			.attr('stroke', '#333')
			.attr('stroke-width', 2);

		// Axis labels
		svg
			.append('text')
			.attr('x', corners[0][0])
			.attr('y', corners[0][1] - 10)
			.attr('text-anchor', 'middle')
			.text('A');
		svg
			.append('text')
			.attr('x', corners[1][0] - 15)
			.attr('y', corners[1][1] + 5)
			.attr('text-anchor', 'end')
			.text('B');
		svg
			.append('text')
			.attr('x', corners[2][0] + 15)
			.attr('y', corners[2][1] + 5)
			.attr('text-anchor', 'start')
			.text('C');

		// Dynamic scales for A, B, and C
		const aExtent = d3.extent(parsedData.map((d) => Number(d.A || 0))) || [0, 1];
		const bExtent = d3.extent(parsedData.map((d) => Number(d.B || 0))) || [0, 1];
		const cExtent = d3.extent(parsedData.map((d) => Number(d.C || 0))) || [0, 1];

		// Convert barycentric to cartesian
		function baryToCartesian(a: number, b: number, c: number) {
			// Normalize the coordinates to ensure they sum to 1
			const total = a + b + c;
			const na = a / total;
			const nb = b / total;
			const nc = c / total;

			const x = na * corners[0][0] + nb * corners[1][0] + nc * corners[2][0];
			const y = na * corners[0][1] + nb * corners[1][1] + nc * corners[2][1];
			return [x, y];
		}

		// Plot points
		parsedData.forEach((d) => {
			const [x, y] = baryToCartesian(Number(d.A || 0), Number(d.B || 0), Number(d.C || 0));

			svg.append('circle').attr('cx', x).attr('cy', y).attr('r', 7).attr('fill', '#1976d2');

			svg
				.append('text')
				.attr('x', x + 10)
				.attr('y', y)
				.attr('font-size', '12px')
				.attr('alignment-baseline', 'middle')
				.text(d.label || '');
		});
	});
</script>

<div bind:this={chartContainer} style="width: {config.width}px; height: {config.height}px;"></div>
