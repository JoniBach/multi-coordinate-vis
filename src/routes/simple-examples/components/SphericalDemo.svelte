<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	let svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
	let { data, schema } = $props();

	onMount(() => {
		const parsedData = schema.safeParse(data).data;
		const width = 400;
		const height = 400;
		const margin = 40;
		const radius = Math.min(width, height) / 2 - margin;

		svg = d3
			.select('#spherical-demo')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`);

		// Draw sphere outline
		svg.append('circle').attr('r', radius).attr('fill', 'none').attr('stroke', '#333');

		// Project (r, theta, phi) to 2D (orthographic projection)
		parsedData.forEach((d) => {
			const thetaRad = (d.theta * Math.PI) / 180;
			const phiRad = (d.phi * Math.PI) / 180;
			const x = radius * d.r * Math.sin(phiRad) * Math.cos(thetaRad);
			const y = radius * d.r * Math.sin(phiRad) * Math.sin(thetaRad);
			svg.append('circle').attr('cx', x).attr('cy', y).attr('r', 8).attr('fill', '#1976d2');
			svg
				.append('text')
				.attr('x', x + 10)
				.attr('y', y)
				.attr('font-size', '12px')
				.attr('alignment-baseline', 'middle')
				.text(d.label);
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

<div id="spherical-demo" style="width: 400px; height: 400px;"></div>
