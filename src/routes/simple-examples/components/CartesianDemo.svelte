<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import CartesianDemo from '../data/CartesianDemo.json' with { type: 'json' };
	let svg;

	onMount(() => {
		svg = d3
			.select('#cartesian-demo')
			.append('svg')
			.attr('width', '100%')
			.attr('height', '100%')
			.append('g')
			.attr('transform', 'translate(50, 50)');

		const xScale = d3
			.scaleLinear()
			.domain([0, d3.max(CartesianDemo, (d) => d.x)])
			.range([0, 400]);
		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(CartesianDemo, (d) => d.y)])
			.range([400, 0]);

		const xAxis = d3.axisBottom(xScale);
		const yAxis = d3.axisLeft(yScale);

		svg.append('g').attr('transform', 'translate(0, 400)').call(xAxis);
		svg.append('g').call(yAxis);

		svg
			.selectAll('circle')
			.data(CartesianDemo)
			.enter()
			.append('circle')
			.attr('cx', (d) => xScale(d.x))
			.attr('cy', (d) => yScale(d.y))
			.attr('r', 5);
	});
</script>

<div id="cartesian-demo" style="width: 500px; height: 500px;"></div>
