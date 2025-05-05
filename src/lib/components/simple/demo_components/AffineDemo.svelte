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
		const affineMat = [
			[1.2, 0.5],
			[0.3, 1.1]
		];

		svg = d3
			.select('#affine-demo')
			.append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('transform', `translate(${margin},${margin})`);

		// Draw axes
		svg
			.append('line')
			.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', 200)
			.attr('y2', 0)
			.attr('stroke', '#333');
		svg
			.append('line')
			.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', 0)
			.attr('y2', 200)
			.attr('stroke', '#333');

		// Add axis labels for affine axes
		svg
			.append('text')
			.attr('x', 200)
			.attr('y', -10)
			.attr('text-anchor', 'end')
			.attr('fill', '#333')
			.text('x (affine)');
		svg
			.append('text')
			.attr('x', 10)
			.attr('y', 200)
			.attr('text-anchor', 'start')
			.attr('fill', '#333')
			.text('y (affine)');

		// Transform and plot points
		parsedData.forEach((d) => {
			const x = d.x * affineMat[0][0] + d.y * affineMat[0][1];
			const y = d.x * affineMat[1][0] + d.y * affineMat[1][1];
			svg
				.append('circle')
				.attr('cx', x * 70)
				.attr('cy', y * 70)
				.attr('r', 8)
				.attr('fill', '#1976d2');
			svg
				.append('text')
				.attr('x', x * 70 + 10)
				.attr('y', y * 70)
				.attr('font-size', '12px')
				.attr('alignment-baseline', 'middle')
				.text(d.label);
		});
	});
</script>

<div id="affine-demo" style="width: 400px; height: 400px;"></div>
