<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import ParallelDemo from '../data/ParallelDemo.json' with { type: 'json' };
	let svg;

	onMount(() => {
		const margin = { top: 30, right: 10, bottom: 10, left: 10 };
		const width = 500 - margin.left - margin.right;
		const height = 300 - margin.top - margin.bottom;

		svg = d3
			.select('#parallel-demo')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);

		const dimensions = Object.keys(ParallelDemo[0]);

		const y = {};
		dimensions.forEach((dim) => {
			y[dim] = d3
				.scaleLinear()
				.domain(d3.extent(ParallelDemo, (d) => d[dim]))
				.range([height, 0]);
		});

		const x = d3.scalePoint()
			.domain(dimensions)
			.range([0, width]);

		function path(d) {
			return d3.line()(dimensions.map((p) => [x(p), y[p](d[p])]));
		}

		// Draw lines
		svg
			.selectAll('path.data-line')
			.data(ParallelDemo)
			.enter()
			.append('path')
			.attr('class', 'data-line')
			.attr('d', path)
			.attr('fill', 'none')
			.attr('stroke', '#1976d2')
			.attr('stroke-width', 2)
			.attr('opacity', 0.7);

		// Draw axes
		dimensions.forEach((dim) => {
			svg
				.append('g')
				.attr('transform', `translate(${x(dim)},0)`)
				.call(d3.axisLeft(y[dim]))
				.append('text')
				.attr('y', -9)
				.attr('text-anchor', 'middle')
				.attr('fill', '#333')
				.text(dim);
		});
	});
</script>

<div id="parallel-demo" style="width: 500px; height: 300px;"></div>