<script lang="ts">
	import CartesianExampleData from '$lib/data/example_data/v2/CartesianDemo.json';
	import { onMount } from 'svelte';
	import { createSystem } from '$lib/utils/coordinate.schema.js';
	import SystemComponent from '$lib/components/system/SystemComponent.svelte';

	let system = $state({
		loading: false,
		success: false
	});

	onMount(() => {
		system = createSystem(CartesianExampleData, {
			system: 'cartesian',
			schema: {
				x: {
					key: 'timestamp',
					type: 'date_iso',
					label: 'Time',
					range: ['2025-05-05T00:00:00Z', null],
					scale: 'utc'
				},
				y: {
					key: 'readings.celsius',
					type: 'number',
					label: 'Temperature',
					range: [0, null],
					scale: 'linear'
				},

				entity: {
					key: 'greenhouse_id',
					type: 'string',
					label: 'Greenhouse'
				}
			},
			config: {
				height: 400,
				width: 400,
				size: 400,
				margin: 40,
				skewX: 30,
				skewY: 0,
				gridLevels: 5,
				scaleExtent: 200,
				title: 'Chart'
			}
		});
		console.log(system);
	});
</script>

<SystemComponent bind:system />
