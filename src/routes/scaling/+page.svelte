<script lang="ts">
	import { onMount } from 'svelte';
	import { createSystem } from '$lib/utils/coordinate.schema.js';
	import PlanarComponent from '$lib/components/system/PlanarComponent.svelte';
	import system_data from '$lib/data/example_data/v3/system_data.json';
	// import RadialComponent from '$lib/components/system/RadialComponent.svelte';

	let planarSystem = $state({
		loading: false,
		success: false
	});

	// let radialSystem = $state({
	// 	loading: false,
	// 	success: false
	// });

	onMount(() => {
		planarSystem = createSystem(system_data, {
			system: 'planar',
			schema: {
				x: {
					key: 'timestamp',
					type: 'date_iso',
					label: 'Time',
					range: ['2025-05-23T12:00:00Z', null],
					scale: 'utc'
				},
				y: {
					key: 'environment.temperature',
					type: 'number',
					label: 'Temperature (°C)',
					range: [18, null],
					scale: 'linear'
				},
				entity: {
					key: 'home_id',
					type: 'string',
					label: 'Home ID'
				}
			},
			config: {
				size: 500,
				margin: 60,
				title: 'Smart Home Temperature Over Time'
			},
			features: {
				y_axis: { show: true, color: 'black' },
				x_axis: { show: true, color: 'black' },
				x_axis_label: { show: true, color: 'black' },
				y_axis_label: { show: true, color: 'black' },
				title: { show: true, color: 'black' },
				shade_area: { show: true, color: 'purple' },
				x_axis_grid: { show: true, color: 'lightgrey' },
				y_axis_grid: { show: true, color: 'lightgrey' },
				bars: { show: true, color: 'blue' },
				hexbin: { show: true, color: 'black', radius: 20 },
				lines: { show: true, color: 'green' },
				points: { show: true, color: 'red', radius: 3 }
			}
		});

		// radialSystem = createSystem(system_data, {
		// 	system: 'radial',
		// 	schema: {
		// 		r: {
		// 			key: 'environment.temperature',
		// 			type: 'number',
		// 			label: 'Temperature (°C)',
		// 			range: [0, null],
		// 			scale: 'linear'
		// 		},
		// 		theta: {
		// 			key: 'timestamp',
		// 			type: 'date_iso',
		// 			label: 'Time',
		// 			range: ['2025-05-24T00:00:00Z', '2025-05-27T12:00:00Z'],
		// 			scale: 'time'
		// 		},
		// 		entity: {
		// 			key: 'home_id',
		// 			type: 'string',
		// 			label: 'Home ID'
		// 		}
		// 	},
		// 	config: {
		// 		size: 500,
		// 		margin: 60,
		// 		title: 'Smart Home Temperature (Polar Coordinates)'
		// 	},
		// 	features: {
		// 		theta_axis: { show: true, color: 'black' },
		// 		r_axis: { show: true, color: 'black' },
		// 		r_axis_label: { show: true, color: 'black' },
		// 		theta_axis_label: { show: true, color: 'black' },
		// 		title: { show: true, color: 'black' }
		// 	}
		// });

		console.log(planarSystem);
		// console.log(radialSystem);
	});
</script>

<PlanarComponent bind:system={planarSystem} />
<!-- <RadialComponent bind:system={radialSystem} /> -->
