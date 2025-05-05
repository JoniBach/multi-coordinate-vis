<script lang="ts">
	import * as d3 from 'd3';
	let { data, schema, config } = $props();
	let chartContainer = $state<HTMLDivElement>();

	$effect(() => {
		if (!chartContainer) return;

		// Clear previous content
		chartContainer.innerHTML = '';

		const validatedData = schema.safeParse(data);
		if (!validatedData.success) {
			console.error('Invalid data:', validatedData.error);
			return;
		}
		const parsedData = validatedData.data || { features: [] };

		const height = config.height;
		const width = config.width;
		const margin = config.margin;
		// Create SVG
		const svg = d3.select(chartContainer).append('svg').attr('width', width).attr('height', height);

		// Dynamic scales for longitude and latitude
		const lonExtent = d3.extent(
			parsedData.features.map((f) => Number(f.geometry.coordinates[0] || 0))
		) || [-180, 180];
		const latExtent = d3.extent(
			parsedData.features.map((f) => Number(f.geometry.coordinates[1] || 0))
		) || [-90, 90];

		// Define projection and path generator
		const projection = d3
			.geoMercator()
			.scale(80)
			.translate([250, 150])
			.center([(lonExtent[0] + lonExtent[1]) / 2, (latExtent[0] + latExtent[1]) / 2]);
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
			const [x, y] = projection([Number(lon || 0), Number(lat || 0)]);

			svg.append('circle').attr('cx', x).attr('cy', y).attr('r', 6).attr('fill', '#1976d2');

			svg
				.append('text')
				.attr('x', x + 8)
				.attr('y', y + 4)
				.text(feature.properties.name || '')
				.attr('font-size', '13px')
				.attr('fill', '#333');
		});
	});
</script>

<div bind:this={chartContainer} style="width: {config.width}px; height: {config.height}px;"></div>
