<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { hexbin as d3_hexbin } from 'd3-hexbin';
	let svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
	let { data, schema } = $props();

	onMount(() => {
		const parsedData = schema.safeParse(data).data;
		const width = 400;
		const height = 400;

		svg = d3
			.select('#hexbin-demo')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g');

		const hexbin = d3_hexbin()
			.x((d) => d.x)
			.y((d) => d.y)
			.radius(25)
			.extent([
				[0, 0],
				[width, height]
			]);

		const bins = hexbin(parsedData);

		svg
			.selectAll('path')
			.data(bins)
			.enter()
			.append('path')
			.attr('d', (d) => hexbin.hexagon())
			.attr('transform', (d) => `translate(${d.x},${d.y})`)
			.attr('fill', '#1976d2')
			.attr('fill-opacity', (d) => 0.2 + (0.6 * d.length) / d3.max(bins, (b) => b.length))
			.attr('stroke', '#333');

		svg
			.append('g')
			.attr('transform', `translate(0,${height - 30})`)
			.call(d3.axisBottom(d3.scaleLinear().domain([0, width]).range([0, width])).ticks(8))
			.append('text')
			.attr('x', width - 10)
			.attr('y', -6)
			.attr('fill', '#333')
			.attr('text-anchor', 'end')
			.text('x');

		svg
			.append('g')
			.attr('transform', `translate(30,0)`)
			.call(d3.axisLeft(d3.scaleLinear().domain([0, height]).range([height, 0])).ticks(8))
			.append('text')
			.attr('x', 6)
			.attr('y', 10)
			.attr('fill', '#333')
			.attr('text-anchor', 'start')
			.text('y');
	});
</script>

<div id="hexbin-demo" style="width: 400px; height: 400px;"></div>
