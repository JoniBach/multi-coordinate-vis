<script lang="ts">
	import { onMount } from 'svelte';
	import { createMultiSystem, createSystem } from '$lib/utils/coordinate.schema.js';
	import PlanarComponent from '$lib/components/system/PlanarComponent.svelte';
	import system_data from '$lib/data/example_data/v3/system_data.json';
	// import RadialComponent from '$lib/components/system/RadialComponent.svelte';

	let planarSystem = $state({
		loading: false,
		success: false
	});

	// this is the output
	const series = [
		{
			x: 'timestamp',
			y: 'environment.temperature'
		},
		{
			x: 'timestamp',
			y: 'environment.humidity'
		},
		{
			x: 'timestamp',
			y: 'environment.co2'
		}
	];

	const features = {
		y_axis: { show: true, color: 'black' },
		x_axis: { show: true, color: 'black' },
		x_axis_label: { show: true, color: 'black' },
		y_axis_label: { show: true, color: 'black' },
		title: { show: true, color: 'black' },
		x_axis_grid: { show: true, color: 'lightgrey' },
		y_axis_grid: { show: true, color: 'lightgrey' }
		// shade_area: { show: true, color: 'purple' },
		// bars: { show: true, color: 'blue' },
		// hexbin: { show: true, color: 'black', radius: 20 },
		// lines: { show: true, color: 'green' },
		// points: { show: true, color: 'red', radius: 3 }
	};

	const entity = {
		key: 'home_id',
		type: 'string',
		label: 'Home ID'
	};

	const config = {
		size: 500,
		margin: 60,
		title: 'Smart Home Temperature Over Time'
	};

	const dataset = [
		// Timestamp
		{
			key: 'timestamp',
			type: 'date_iso',
			label: 'Time',
			range: [null, null],
			scale: 'utc'
		},

		// Location
		{
			key: 'location.room',
			type: 'string',
			label: 'Room',
			range: null,
			scale: 'ordinal'
		},
		{
			key: 'location.floor',
			type: 'number',
			label: 'Floor',
			range: [0, null],
			scale: 'linear'
		},
		{
			key: 'location.coordinates.x',
			type: 'number',
			label: 'X Coordinate',
			range: [0, null],
			scale: 'linear'
		},
		{
			key: 'location.coordinates.y',
			type: 'number',
			label: 'Y Coordinate',
			range: [0, null],
			scale: 'linear'
		},
		{
			key: 'location.coordinates.z',
			type: 'number',
			label: 'Z Coordinate',
			range: [0, null],
			scale: 'linear'
		},

		// Environment
		{
			key: 'environment.temperature',
			type: 'number',
			label: 'Temperature (°C)',
			range: [0, null],
			scale: 'linear'
		},
		{
			key: 'environment.humidity',
			type: 'number',
			label: 'Humidity (%)',
			range: [0, 100],
			scale: 'linear'
		},
		{
			key: 'environment.co2',
			type: 'number',
			label: 'CO2 (ppm)',
			range: [0, null],
			scale: 'linear'
		},
		{
			key: 'environment.light_level',
			type: 'number',
			label: 'Light Level (lx)',
			range: [0, null],
			scale: 'linear'
		},
		{
			key: 'environment.noise_level',
			type: 'number',
			label: 'Noise Level (dB)',
			range: [0, null],
			scale: 'linear'
		},

		// Energy
		{
			key: 'energy.consumption',
			type: 'number',
			label: 'Energy Consumption (kWh)',
			range: [0, null],
			scale: 'linear'
		},
		{
			key: 'energy.solar_production',
			type: 'number',
			label: 'Solar Production (kWh)',
			range: [0, null],
			scale: 'linear'
		},
		{
			key: 'energy.battery.level',
			type: 'number',
			label: 'Battery Level (%)',
			range: [0, 100],
			scale: 'linear'
		},
		{
			key: 'energy.battery.charging',
			type: 'boolean',
			label: 'Battery Charging',
			range: null,
			scale: 'ordinal'
		},

		// Occupancy
		{
			key: 'occupancy.count',
			type: 'number',
			label: 'Occupant Count',
			range: [0, null],
			scale: 'linear'
		},
		{
			key: 'occupancy.movement_detected',
			type: 'boolean',
			label: 'Movement Detected',
			range: null,
			scale: 'ordinal'
		},
		{
			key: 'occupancy.last_movement',
			type: 'date_iso',
			label: 'Last Movement Time',
			range: [null, null],
			scale: 'utc'
		}

		// Devices (array fields typically require special handling or flattening for visualization)
		// {
		// 	key: 'devices[].id',
		// 	type: 'string',
		// 	label: 'Device ID',
		// 	range: null,
		// 	scale: 'ordinal'
		// },
		// {
		// 	key: 'devices[].type',
		// 	type: 'string',
		// 	label: 'Device Type',
		// 	range: null,
		// 	scale: 'ordinal'
		// },
		// {
		// 	key: 'devices[].status',
		// 	type: 'string',
		// 	label: 'Device Status',
		// 	range: null,
		// 	scale: 'ordinal'
		// },
		// {
		// 	key: 'devices[].target_temp',
		// 	type: 'number',
		// 	label: 'Target Temperature (°C)',
		// 	range: [0, null],
		// 	scale: 'linear'
		// },
		// {
		// 	key: 'devices[].power_usage',
		// 	type: 'number',
		// 	label: 'Device Power Usage (kWh)',
		// 	range: [0, null],
		// 	scale: 'linear'
		// },
		// {
		// 	key: 'devices[].brightness',
		// 	type: 'number',
		// 	label: 'Light Brightness',
		// 	range: [0, 100],
		// 	scale: 'linear'
		// },
		// {
		// 	key: 'devices[].color.r',
		// 	type: 'number',
		// 	label: 'Color Red Component',
		// 	range: [0, 255],
		// 	scale: 'linear'
		// },
		// {
		// 	key: 'devices[].color.g',
		// 	type: 'number',
		// 	label: 'Color Green Component',
		// 	range: [0, 255],
		// 	scale: 'linear'
		// },
		// {
		// 	key: 'devices[].color.b',
		// 	type: 'number',
		// 	label: 'Color Blue Component',
		// 	range: [0, 255],
		// 	scale: 'linear'
		// }
	];
	const data = system_data;
	const system = 'planar';
	const systemParams = {
		system,
		series,
		features,
		entity,
		config,
		dataset,
		data
	};

	let multiSystem = $state({
		loading: false,
		success: false
	});

	onMount(() => {
		multiSystem = createMultiSystem(systemParams);
		planarSystem = createSystem(system_data, {
			system: 'planar',
			schema: {
				x: {
					key: 'timestamp',
					type: 'date_iso',
					label: 'Time',
					range: [null, null],
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
		console.log(multiSystem);
		// console.log(radialSystem);
	});
</script>

<PlanarComponent bind:system={planarSystem} />
<!-- <RadialComponent bind:system={radialSystem} /> -->
