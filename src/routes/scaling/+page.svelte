<script lang="ts">
	import { onMount } from 'svelte';
	import { createSystem } from '$lib/utils/coordinate.schema.js';
	import PlanarComponent from '$lib/components/system/PlanarComponent.svelte';
	import system_data from '$lib/data/example_data/v3/system_data.json';

	let planarSystem = $state({
		loading: false,
		success: false
	});

	onMount(() => {
		planarSystem = createSystem(system_data, {
			system: 'cartesian',
			schema: {
				x: {
					key: 'timestamp',
					type: 'date_iso',
					label: 'Time',
					range: ['2025-05-24T00:00:00Z', '2025-05-27T12:00:00Z'],
					scale: 'utc'
				},
				y: {
					key: 'environment.temperature',
					type: 'number',
					label: 'Temperature (°C)',
					range: [0, null],
					scale: 'linear'
				},
				entity: {
					key: 'home_id',
					type: 'string',
					label: 'Home ID'
				}
			},
			config: {
				size: 400,
				margin: 60,
				title: 'Smart Home Temperature Over Time'
			},
			features: [
				'x_axis',
				'y_axis',
				'x_axis_label',
				'y_axis_label',
				'title',
				'x_axis_grid',
				'y_axis_grid',
				'data_points',
				'lines',
				'bars',
				'hexbin'
			]
		});
		console.log(planarSystem);
	});
</script>

<PlanarComponent bind:system={planarSystem} />
