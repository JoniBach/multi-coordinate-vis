<script lang="ts">
	import { createSystem } from '$lib/utils/coordinate.schema.js';
	import CartesianExampleData from '$lib/data/example_data/v2/CartesianDemo.json';
	// import CartesianExampleData from '$lib/components/simple/generic_data/CartesianDemo.json';
	import CartesianSystemComponent from '$lib/components/system/CartesianSystemComponent.svelte';
	import type { System } from '$lib/utils/coordinate.schema.js';
	import { onMount } from 'svelte';

	let system: System = $state({ loading: false, success: false });

	const config = {
		height: 400,
		width: 400,
		margin: 40,
		skewX: 30,
		skewY: 0,
		gridLevels: 5,
		scaleExtent: 200,
		title: 'Cartesian System'
	};

	onMount(() => {
		const res = createSystem(
			'cartesian',
			CartesianExampleData,
			// {
			// 	x: {
			// 		key: 'x',
			// 		type: 'number',
			// 		label: 'X'
			// 	},
			// 	y: {
			// 		key: 'y',
			// 		type: 'number',
			// 		label: 'Y'
			// 	}
			// },
			{
				x: {
					key: 'timestamp',
					type: 'date_iso',
					label: 'X'
				},
				y: {
					key: 'readings.celsius',
					type: 'number',
					label: 'Y'
				},
				entity: {
					key: 'greenhouse_id',
					type: 'string',
					label: 'Greenhouse'
				}
			},
			config
		);
		system = res;
		console.log(res);
	});

	$effect(() => {});
</script>

<!-- <CartesianSystemComponent bind:system /> -->
