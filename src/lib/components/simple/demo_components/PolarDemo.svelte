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

		// Draw circular grid
		const gridLevels = 5;
		for (let i = 1; i <= gridLevels; i++) {
			svg
				.append('circle')
				.attr('r', (radius / gridLevels) * i)
				.attr('fill', 'none')
				.attr('stroke', '#ccc');
		}

		// Draw radial lines
		for (let angle = 0; angle < 360; angle += 45) {
			const rad = (angle * Math.PI) / 180;
			svg
				.append('line')
				.attr('x1', 0)
				.attr('y1', 0)
				.attr('x2', radius * Math.cos(rad))
				.attr('y2', radius * Math.sin(rad))
				.attr('stroke', '#eee');
		}

		// Dynamic scales for r and theta
		const rExtent = d3.extent(parsedData.map((d) => Number(d.r || 0))) || [0, 1];
		const thetaExtent = d3.extent(parsedData.map((d) => Number(d.theta || 0))) || [0, 360];

		const rScale = d3
			.scaleLinear()
			.domain([Math.min(...rExtent), Math.max(...rExtent)])
			.range([0, radius]);

		// Plot points
		parsedData.forEach((d) => {
			const thetaRad = (Number(d.theta || 0) * Math.PI) / 180;
			const r = rScale(Number(d.r || 0));
			const x = r * Math.cos(thetaRad);
			const y = r * Math.sin(thetaRad);
			svg.append('circle').attr('cx', x).attr('cy', y).attr('r', 6).attr('fill', '#1976d2');
		});
	});
</script>

<div bind:this={chartContainer} style="width: 400px; height: 400px;"></div>
