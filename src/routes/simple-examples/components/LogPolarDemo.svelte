<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	let svg;
	let { data, schema } = $props();

	onMount(() => {
		const parsedData = schema.safeParse(data).data;
		const width = 400;
		const height = 400;
		const margin = 40;
		const radius = Math.min(width, height) / 2 - margin;

		svg = d3
			.select('#logpolar-demo')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`);

		// Find log(r) extent
		const logExtent = d3.extent(parsedData, (d) => Math.log10(d.r));
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
			const thetaRad = (d.theta * Math.PI) / 180;
			const r = rScale(Math.log10(d.r));
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
		for (let angle = 0; angle < 360; angle += 45) {
			const rad = (angle * Math.PI) / 180;
			svg
				.append('text')
				.attr('x', (radius + 10) * Math.cos(rad))
				.attr('y', (radius + 10) * Math.sin(rad))
				.attr('text-anchor', 'middle')
				.attr('font-size', '10px')
				.attr('fill', '#333')
				.text(`${angle}\u00B0`);
		}
	});
</script>

<div id="logpolar-demo" style="width: 400px; height: 400px;"></div>
