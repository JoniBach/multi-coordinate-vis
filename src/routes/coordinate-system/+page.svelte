<script lang="ts">
	import { createSystem } from '$lib/utils/coordinate.schema.js';
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
	import type { System } from '$lib/utils/coordinate.schema.js';
	import { onMount } from 'svelte';

	let system: System = $state({ loading: false, success: false });

	let chartInstances: System[] = $state([]);
	const config = {
		height: 400,
		width: 400,
		margin: 40,
		skewX: 30,
		skewY: 0,
		gridLevels: 5,
		scaleExtent: 200,
		title: 'Chart'
	};
	const affineSchema = {
		x: {
			key: 'original_u',
			type: 'number',
			label: 'Original U'
		},
		y: {
			key: 'original_v',
			type: 'number',
			label: 'Original V'
		},
		entity: {
			key: 'transformed_u',
			type: 'number',
			label: 'Transformed U'
		}
	};
	const barycentricSchema = {
		A: {
			key: 'sand',
			type: 'number',
			label: 'Sand'
		},
		B: {
			key: 'silt',
			type: 'number',
			label: 'Silt'
		},
		C: {
			key: 'clay',
			type: 'number',
			label: 'Clay'
		}
	};
	const cartesianSchema = {
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
	};

	const hexbinSchema = {
		x: {
			key: 'longitude',
			type: 'number',
			label: 'Longitude'
		},
		y: {
			key: 'latitude',
			type: 'number',
			label: 'Latitude'
		},
		entity: {
			key: 'pest_count',
			type: 'number',
			label: 'Pest Count'
		}
	};
	const logPolarSchema = {
		r: {
			key: 'range_km',
			type: 'number',
			label: 'Range (km)'
		},
		theta: {
			key: 'bearing',
			type: 'number',
			label: 'Bearing'
		},
		entity: {
			key: 'signal_strength_dbm',
			type: 'number',
			label: 'Signal Strength (dBm)'
		}
	};
	const obliqueSchema = {
		x: {
			key: 'panel_angle_degrees',
			type: 'number',
			label: 'Panel Angle'
		},
		y: {
			key: 'land_slope_degrees',
			type: 'number',
			label: 'Land Slope'
		},
		entity: {
			key: 'efficiency_percentage',
			type: 'number',
			label: 'Efficiency'
		}
	};
	const parallelSchema = {
		r: {
			key: 'nitrogen_ppm',
			type: 'number',
			label: 'Nitrogen'
		},
		theta: {
			key: 'phosphorus_ppm',
			type: 'number',
			label: 'Phosphorus'
		},
		entity: {
			key: 'field_id',
			type: 'string',
			label: 'Field ID'
		}
	};
	const polarSchema = {
		r: {
			key: 'speed_mps',
			type: 'number',
			label: 'Wind Speed (m/s)'
		},
		theta: {
			key: 'direction_degrees',
			type: 'number',
			label: 'Wind Direction'
		},
		entity: {
			key: 'turbine_id',
			type: 'string',
			label: 'Turbine ID'
		}
	};
	const radarSchema = {
		sepal_length: {
			key: 'water_usage_index',
			type: 'number',
			label: 'Water Usage'
		},
		sepal_width: {
			key: 'disease_resistance_score',
			type: 'number',
			label: 'Disease Resistance'
		},
		petal_length: {
			key: 'growth_rate_index',
			type: 'number',
			label: 'Growth Rate'
		},
		petal_width: {
			key: 'yield_potential_index',
			type: 'number',
			label: 'Yield Potential'
		},
		entity: {
			key: 'crop_variety',
			type: 'string',
			label: 'Crop Variety'
		}
	};
	const sphericalSchema = {
		r: {
			key: 'nutrient_levels.nitrogen_ppm',
			type: 'number',
			label: 'Nitrogen'
		},
		theta: {
			key: 'nutrient_levels.phosphorus_ppm',
			type: 'number',
			label: 'Phosphorus'
		},
		phi: {
			key: 'nutrient_levels.potassium_ppm',
			type: 'number',
			label: 'Potassium'
		},
		entity: {
			key: 'field_id',
			type: 'string',
			label: 'Field ID'
		}
	};
	const ternarySchema = {
		A: {
			key: 'irrigation_mm',
			type: 'number',
			label: 'Irrigation (mm)'
		},
		B: {
			key: 'fertilizer_kg_ha',
			type: 'number',
			label: 'Fertilizer (kg/ha)'
		},
		C: {
			key: 'pesticide_liters_ha',
			type: 'number',
			label: 'Pesticide (liters/ha)'
		},
		entity: {
			key: 'crop_type',
			type: 'string',
			label: 'Crop Type'
		}
	};
	const examples = [
		{
			type: 'affine',
			data: AffineExampleData,
			schema: affineSchema,
			config: { ...config, title: 'Affine' }
		},
		{
			type: 'barycentric',
			data: BarycentricExampleData,
			schema: barycentricSchema,
			config: { ...config, title: 'Barycentric' }
		},
		{
			type: 'cartesian',
			data: CartesianExampleData,
			schema: cartesianSchema,
			config: { ...config, title: 'Cartesian' }
		},
		{
			type: 'hexbin',
			data: HexbinExampleData,
			schema: hexbinSchema,
			config: { ...config, title: 'Hexbin' }
		},
		{
			type: 'logPolar',
			data: LogPolarExampleData,
			schema: logPolarSchema,
			config: { ...config, title: 'Log Polar' }
		},
		{
			type: 'oblique',
			data: ObliqueExampleData,
			schema: obliqueSchema,
			config: { ...config, title: 'Oblique' }
		},
		{
			type: 'parallel',
			data: ParallelExampleData,
			schema: parallelSchema,
			config: { ...config, title: 'Parallel' }
		},
		{
			type: 'polar',
			data: PolarExampleData,
			schema: polarSchema,
			config: { ...config, title: 'Polar' }
		},
		{
			type: 'radar',
			data: RadarExampleData,
			schema: radarSchema,
			config: { ...config, title: 'Radar' }
		},
		{
			type: 'spherical',
			data: SphericalExampleData,
			schema: sphericalSchema,
			config: { ...config, title: 'Spherical' }
		},
		{
			type: 'ternary',
			data: TernaryExampleData,
			schema: ternarySchema,
			config: { ...config, title: 'Ternary' }
		}
	];

	onMount(() => {
		examples.forEach((example) => {
			const res = createSystem(example.type, example.data, example.schema, example.config);
			chartInstances.push(res);
			console.log(example.type, res.success, res);
		});
	});

	$effect(() => {});
</script>

{#each chartInstances as chart}
	<div>
		<h3>{chart.config.title}</h3>
		{chart.coordinateType}
		<span style={`color: ${chart.success ? 'green' : 'red'}`}>{chart.success}</span>
		{#if !chart.success}
			<div>
				- &nbsp;{chart.error.name}
			</div>
		{/if}

		{#if chart.success}
			<div>
				Size - in: {chart.metadata.size.in} / out: {chart.metadata.size.out} / res: {chart.metadata
					.size.res}
			</div>
			Data - {chart.data.length} items:
			<pre>{JSON.stringify(chart.data[0], null, 2)}</pre>
		{/if}
	</div>
	<hr />
{/each}
<!-- <CartesianSystemComponent bind:system /> -->
