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

		// Draw sphere outline
		svg.append('circle').attr('r', radius).attr('fill', 'none').attr('stroke', '#333');

		// Dynamic scales for r, theta, and phi
		const rExtent = d3.extent(parsedData.map((d) => Number(d.r || 0))) || [0, 1];
		const thetaExtent = d3.extent(parsedData.map((d) => Number(d.theta || 0))) || [0, 360];
		const phiExtent = d3.extent(parsedData.map((d) => Number(d.phi || 0))) || [0, 180];

		const rScale = d3
			.scaleLinear()
			.domain([Math.min(...rExtent), Math.max(...rExtent)])
			.range([0, 1]);

		// Project (r, theta, phi) to 2D (orthographic projection)
		parsedData.forEach((d) => {
			const r = rScale(Number(d.r || 0)) * radius;
			const thetaRad = (Number(d.theta || 0) * Math.PI) / 180;
			const phiRad = (Number(d.phi || 0) * Math.PI) / 180;

			const x = r * Math.sin(phiRad) * Math.cos(thetaRad);
			const y = r * Math.sin(phiRad) * Math.sin(thetaRad);

			svg.append('circle').attr('cx', x).attr('cy', y).attr('r', 8).attr('fill', '#1976d2');

			svg
				.append('text')
				.attr('x', x + 10)
				.attr('y', y)
				.attr('font-size', '12px')
				.attr('alignment-baseline', 'middle')
				.text(d.label || '');
		});

		// Add axis labels for spherical (projected)
		svg
			.append('text')
			.attr('x', 0)
			.attr('y', -radius - 15)
			.attr('text-anchor', 'middle')
			.attr('fill', '#333')
			.text('Equator (φ=90°)');
		svg
			.append('text')
			.attr('x', radius + 15)
			.attr('y', 0)
			.attr('text-anchor', 'start')
			.attr('fill', '#333')
			.text('0°/360° (θ)');
		svg
			.append('text')
			.attr('x', 0)
			.attr('y', radius + 20)
			.attr('text-anchor', 'middle')
			.attr('fill', '#333')
			.text('South (φ=180°)');
	});
</script>

<div bind:this={chartContainer} style="width: {config.width}px; height: {config.height}px;"></div>
