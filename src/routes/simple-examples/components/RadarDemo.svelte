<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import RadarDemo from '../data/RadarDemo.json' with { type: 'json' };
	let svg;

	onMount(() => {
		const width = 400;
		const height = 400;
		const margin = 40;
		const radius = Math.min(width, height) / 2 - margin;

		svg = d3
			.select('#radar-demo')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${width / 2},${height / 2})`);

		const variables = Object.keys(RadarDemo[0]).filter((k) => k !== 'species');
		const angleSlice = (2 * Math.PI) / variables.length;

		// Find max for each variable
		const maxValues = variables.map(v => d3.max(RadarDemo, d => d[v]));
		const rScale = d3.scaleLinear().domain([0, d3.max(maxValues)]).range([0, radius]);

		// Draw circular grid
		const gridLevels = 5;
		for (let i = 1; i <= gridLevels; i++) {
			svg.append('circle')
				.attr('r', (radius / gridLevels) * i)
				.attr('fill', 'none')
				.attr('stroke', '#ccc');
		}
		// Draw axes
		variables.forEach((v, i) => {
			const angle = angleSlice * i - Math.PI / 2;
			svg.append('line')
				.attr('x1', 0)
				.attr('y1', 0)
				.attr('x2', radius * Math.cos(angle))
				.attr('y2', radius * Math.sin(angle))
				.attr('stroke', '#999');
			svg.append('text')
				.attr('x', (radius + 10) * Math.cos(angle))
				.attr('y', (radius + 10) * Math.sin(angle))
				.attr('text-anchor', 'middle')
				.attr('alignment-baseline', 'middle')
				.attr('font-size', '13px')
				.text(v.replace('_', ' '));
		});

		// Draw data polygons
		const color = d3.scaleOrdinal(d3.schemeCategory10);
		RadarDemo.forEach((d, i) => {
			const points = variables.map((v, j) => {
				const angle = angleSlice * j - Math.PI / 2;
				const r = rScale(d[v]);
				return [r * Math.cos(angle), r * Math.sin(angle)];
			});
			svg.append('polygon')
				.attr('points', points.map(p => p.join(",")).join(' '))
				.attr('fill', color(i.toString()))
				.attr('fill-opacity', 0.2)
				.attr('stroke', color(i.toString()))
				.attr('stroke-width', 2);
			// Label
			svg.append('text')
				.attr('x', points[0][0])
				.attr('y', points[0][1] - 10)
				.attr('text-anchor', 'middle')
				.attr('font-size', '12px')
				.attr('fill', color(i.toString()))
				.text(d.species);
		});
	});
</script>

<div id="radar-demo" style="width: 400px; height: 400px;"></div>