<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import ObliqueDemo from '../data/ObliqueDemo.json' with { type: 'json' };
	let svg;

	onMount(() => {
		const width = 400;
		const height = 400;
		const margin = 40;
		const skewX = 30; // degrees
		const skewY = 0;  // degrees
		const skewMat = [
			[1, Math.tan((skewX * Math.PI) / 180)],
			[Math.tan((skewY * Math.PI) / 180), 1]
		];

		svg = d3
			.select('#oblique-demo')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${margin},${margin})`);

		// Draw axes
		svg.append('line')
			.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', 200)
			.attr('y2', 0)
			.attr('stroke', '#333');
		svg.append('line')
			.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', skewMat[0][1] * 200)
			.attr('y2', 200)
			.attr('stroke', '#333');

		// Add axis labels for oblique axes
		svg.append('text')
			.attr('x', 200)
			.attr('y', -10)
			.attr('text-anchor', 'end')
			.attr('fill', '#333')
			.text('x (skewed)');
		svg.append('text')
			.attr('x', skewMat[0][1] * 200 + 10)
			.attr('y', 200)
			.attr('text-anchor', 'start')
			.attr('fill', '#333')
			.text('y (skewed)');

		// Transform and plot points
		ObliqueDemo.forEach((d) => {
			const x = d.x * skewMat[0][0] + d.y * skewMat[0][1];
			const y = d.x * skewMat[1][0] + d.y * skewMat[1][1];
			svg.append('circle')
				.attr('cx', x * 70)
				.attr('cy', y * 70)
				.attr('r', 8)
				.attr('fill', '#1976d2');
			svg.append('text')
				.attr('x', x * 70 + 10)
				.attr('y', y * 70)
				.attr('font-size', '12px')
				.attr('alignment-baseline', 'middle')
				.text(d.label);
		});
	});
</script>

<div id="oblique-demo" style="width: 400px; height: 400px;"></div>
