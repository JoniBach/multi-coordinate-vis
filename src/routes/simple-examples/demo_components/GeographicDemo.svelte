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
		svg = d3.select('#geographic-demo').append('svg').attr('width', 500).attr('height', 300);

		// Define projection and path generator
		const projection = d3.geoMercator().scale(80).translate([250, 150]);
		const path = d3.geoPath().projection(projection);

		// Draw graticule (latitude/longitude lines)
		const graticule = d3.geoGraticule();
		svg
			.append('path')
			.datum(graticule())
			.attr('d', path)
			.attr('fill', 'none')
			.attr('stroke', '#ccc');

		// Plot points
		parsedData.features.forEach((feature) => {
			const [lon, lat] = feature.geometry.coordinates;
			const [x, y] = projection([lon, lat]);
			svg.append('circle').attr('cx', x).attr('cy', y).attr('r', 6).attr('fill', '#1976d2');
			svg
				.append('text')
				.attr('x', x + 8)
				.attr('y', y + 4)
				.text(feature.properties.name)
				.attr('font-size', '13px')
				.attr('fill', '#333');
		});
	});
</script>

<div id="geographic-demo" style="width: 500px; height: 300px;"></div>
