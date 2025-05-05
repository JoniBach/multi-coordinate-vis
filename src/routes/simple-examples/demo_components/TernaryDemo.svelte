<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	let svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
	let { data, schema } = $props();

	onMount(() => {
		const validatedData = schema.safeParse(data);
		if (!validatedData.success) {
			console.error('Invalid data:', validatedData.error);
			return;
		}
		const parsedData = validatedData.data;
		const width = 400;
		const height = 400;
		const margin = 40;
		const size = width - 2 * margin;

		svg = d3
			.select('#ternary-demo')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${margin},${margin})`);

		// Triangle corners
		const corners = [
			[size / 2, 0], // A
			[0, size * Math.sin(Math.PI / 3)], // B
			[size, size * Math.sin(Math.PI / 3)] // C
		];

		// Draw triangle
		svg
			.append('polygon')
			.attr('points', corners.map((d) => d.join(',')).join(' '))
			.attr('fill', 'none')
			.attr('stroke', '#333')
			.attr('stroke-width', 2);

		// Axis labels
		svg
			.append('text')
			.attr('x', corners[0][0])
			.attr('y', corners[0][1] - 10)
			.attr('text-anchor', 'middle')
			.text('A');
		svg
			.append('text')
			.attr('x', corners[1][0] - 15)
			.attr('y', corners[1][1] + 5)
			.attr('text-anchor', 'end')
			.text('B');
		svg
			.append('text')
			.attr('x', corners[2][0] + 15)
			.attr('y', corners[2][1] + 5)
			.attr('text-anchor', 'start')
			.text('C');

		// Convert barycentric to cartesian
		function ternaryToCartesian(a, b, c) {
			const x = a * corners[0][0] + b * corners[1][0] + c * corners[2][0];
			const y = a * corners[0][1] + b * corners[1][1] + c * corners[2][1];
			return [x, y];
		}

		// Plot points
		parsedData.forEach((d) => {
			const [x, y] = ternaryToCartesian(d.A, d.B, d.C);
			svg.append('circle').attr('cx', x).attr('cy', y).attr('r', 7).attr('fill', '#1976d2');
			svg
				.append('text')
				.attr('x', x + 10)
				.attr('y', y)
				.attr('font-size', '12px')
				.attr('alignment-baseline', 'middle')
				.text(d.label);
		});
	});
</script>

<div id="ternary-demo" style="width: 400px; height: 400px;"></div>
