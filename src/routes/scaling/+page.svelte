<script lang="ts">
	import AffineExampleData from '$lib/data/example_data/v2/AffineDemo.json';
	import BarycentricExampleData from '$lib/data/example_data/v2/BarycentricDemo.json';
	import CartesianExampleData from '$lib/data/example_data/v2/CartesianDemo.json';
	import HexbinExampleData from '$lib/data/example_data/v2/HexbinDemo.json';
	import LogPolarExampleData from '$lib/data/example_data/v2/LogPolarDemo.json';
	import ObliqueExampleData from '$lib/data/example_data/v2/ObliqueDemo.json';
	import ParallelExampleData from '$lib/data/example_data/v2/ParallelDemo.json';
	import PolarExampleData from '$lib/data/example_data/v2/PolarDemo.json';
	import RadarExampleData from '$lib/data/example_data/v2/RadarDemo.json';
	import SphericalExampleData from '$lib/data/example_data/v2/SphericalDemo.json';
	import TernaryExampleData from '$lib/data/example_data/v2/TernaryDemo.json';
	import { onMount } from 'svelte';
	import { createSystem, type System } from '$lib/utils/coordinate.schema.js';
	import CartesianSystemComponent from '$lib/components/system/CartesianSystemComponent.svelte';

	let system: System = {
		loading: false,
		success: false
	};

	onMount(() => {
		system = createSystem(
			'cartesian',
			CartesianExampleData,
			{
				x: {
					key: 'timestamp',
					type: 'date_iso',
					label: 'Time'
				},
				y: [
					{
						key: 'readings.celsius',
						type: 'number',
						label: 'Temperature'
					},
					{
						key: 'readings.humidity',
						type: 'number',
						label: 'Humidity'
					}
				],
				entity: {
					key: 'greenhouse_id',
					type: 'string',
					label: 'Greenhouse'
				}
			},
			{
				height: 400,
				width: 400,
				margin: 40,
				skewX: 30,
				skewY: 0,
				gridLevels: 5,
				scaleExtent: 200,
				title: 'Chart'
			}
		);
	});
</script>

<CartesianSystemComponent bind:system />
