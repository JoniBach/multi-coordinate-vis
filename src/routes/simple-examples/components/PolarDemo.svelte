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
			.select('#polar-demo')
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

		// Scale for r
		const rExtent = d3.extent(parsedData, (d) => d.r);
		const rScale = d3.scaleLinear().domain(rExtent).range([0, radius]);

		// Plot points
		parsedData.forEach((d) => {
			const thetaRad = (d.theta * Math.PI) / 180;
			const r = rScale(d.r);
			const x = r * Math.cos(thetaRad);
			const y = r * Math.sin(thetaRad);
			svg.append('circle').attr('cx', x).attr('cy', y).attr('r', 6).attr('fill', '#1976d2');
		});
	});
</script>

<div id="polar-demo" style="width: 400px; height: 400px;"></div>
