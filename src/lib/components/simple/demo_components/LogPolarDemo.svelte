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
		const radius = Math.min(width, height) / 2 - margin;

		// Create SVG
		const svg = d3
			.select(chartContainer)
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`);

		// Find log(r) extent with safe conversion
		const safeLogExtent = parsedData.map((d) => Math.log10(Number(d.r || 1)));
		const logExtent = [Math.min(...safeLogExtent), Math.max(...safeLogExtent)] as [number, number];
		const rScale = d3.scaleLinear().domain(logExtent).range([0, radius]);

		// Draw circular grid (log-spaced)
		const gridLevels = 5;
		for (let i = 0; i <= gridLevels; i++) {
			const r = rScale(logExtent[0] + (i * (logExtent[1] - logExtent[0])) / gridLevels);
			svg.append('circle').attr('r', r).attr('fill', 'none').attr('stroke', '#ccc');
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

		// Plot points
		parsedData.forEach((d) => {
			const thetaRad = (Number(d.theta || 0) * Math.PI) / 180;
			const r = rScale(Math.log10(Number(d.r || 1)));
			const x = r * Math.cos(thetaRad);
			const y = r * Math.sin(thetaRad);
			svg.append('circle').attr('cx', x).attr('cy', y).attr('r', 7).attr('fill', '#1976d2');
		});

		// Add axis labels (log-polar)
		svg
			.append('text')
			.attr('x', 0)
			.attr('y', -radius - 15)
			.attr('text-anchor', 'middle')
			.attr('fill', '#333')
			.text('r (log scale)');

		// Angle labels
		for (let angle = 0; angle < 360; angle += 45) {
			const rad = (angle * Math.PI) / 180;
			svg
				.append('text')
				.attr('x', (radius + 10) * Math.cos(rad))
				.attr('y', (radius + 10) * Math.sin(rad))
				.attr('text-anchor', 'middle')
				.attr('font-size', '10px')
				.attr('fill', '#333')
				.text(`${angle}°`);
		}
	});
</script>

<div bind:this={chartContainer} style="width: {config.width}px; height: {config.height}px;"></div>
