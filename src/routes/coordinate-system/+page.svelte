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
			label: 'Original U',
			scale: 'linear'
		},
		y: {
			key: 'original_v',
			type: 'number',
			label: 'Original V',
			scale: 'linear'
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
			label: 'Sand',
			scale: 'linear'
		},
		B: {
			key: 'silt',
			type: 'number',
			label: 'Silt',
			scale: 'linear'
		},
		C: {
			key: 'clay',
			type: 'number',
			label: 'Clay',
			scale: 'linear'
		},
		entity: {
			key: 'sample_location',
			type: 'string',
			label: 'Sample Location'
		}
	};
	const cartesianSchema = {
		x: {
			key: 'timestamp',
			type: 'date_iso',
			label: 'Time',
			scale: 'linear'
		},
		y: {
			key: 'readings.celsius',
			type: 'number',
			label: 'Temperature',
			scale: 'linear'
		},

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
			label: 'Longitude',
			scale: 'linear'
		},
		y: {
			key: 'latitude',
			type: 'number',
			label: 'Latitude',
			scale: 'linear'
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
			label: 'Range (km)',
			scale: 'linear'
		},
		theta: {
			key: 'bearing',
			type: 'number',
			label: 'Bearing',
			scale: 'linear'
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
			label: 'Panel Angle',
			scale: 'linear'
		},
		y: {
			key: 'land_slope_degrees',
			type: 'number',
			label: 'Land Slope',
			scale: 'linear'
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
			label: 'Nitrogen',
			scale: 'linear'
		},
		theta: {
			key: 'phosphorus_ppm',
			type: 'number',
			label: 'Phosphorus',
			scale: 'linear'
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
			label: 'Wind Speed (m/s)',
			scale: 'linear'
		},
		theta: {
			key: 'direction_degrees',
			type: 'number',
			label: 'Wind Direction',
			scale: 'linear'
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
			label: 'Water Usage',
			scale: 'linear'
		},
		sepal_width: {
			key: 'disease_resistance_score',
			type: 'number',
			label: 'Disease Resistance',
			scale: 'linear'
		},
		petal_length: {
			key: 'growth_rate_index',
			type: 'number',
			label: 'Growth Rate',
			scale: 'linear'
		},
		petal_width: {
			key: 'yield_potential_index',
			type: 'number',
			label: 'Yield Potential',
			scale: 'linear'
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
			label: 'Nitrogen',
			scale: 'linear'
		},
		theta: {
			key: 'nutrient_levels.phosphorus_ppm',
			type: 'number',
			label: 'Phosphorus',
			scale: 'linear'
		},
		phi: {
			key: 'nutrient_levels.potassium_ppm',
			type: 'number',
			label: 'Potassium',
			scale: 'linear'
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
			label: 'Irrigation (mm)',
			scale: 'linear'
		},
		B: {
			key: 'fertilizer_kg_ha',
			type: 'number',
			label: 'Fertilizer (kg/ha)',
			scale: 'linear'
		},
		C: {
			key: 'pesticide_liters_ha',
			type: 'number',
			label: 'Pesticide (liters/ha)',
			scale: 'linear'
		},
		entity: {
			key: 'crop_type',
			type: 'string',
			label: 'Crop Type'
		}
	};
	const examples = [
		{
			options: {
				system: 'affine',
				schema: affineSchema,
				config: { ...config, title: 'Affine' }
			},
			data: AffineExampleData
		},
		{
			options: {
				system: 'barycentric',
				schema: barycentricSchema,
				config: { ...config, title: 'Barycentric' }
			},
			data: BarycentricExampleData
		},
		{
			options: {
				system: 'cartesian',
				schema: cartesianSchema,
				config: { ...config, title: 'Cartesian' }
			},
			data: CartesianExampleData
		},
		{
			options: {
				system: 'hexbin',
				schema: hexbinSchema,
				config: { ...config, title: 'Hexbin' }
			},
			data: HexbinExampleData
		},
		{
			options: {
				system: 'logPolar',
				schema: logPolarSchema,
				config: { ...config, title: 'Log Polar' }
			},
			data: LogPolarExampleData
		},
		{
			options: {
				system: 'oblique',
				schema: obliqueSchema,
				config: { ...config, title: 'Oblique' }
			},
			data: ObliqueExampleData
		},
		{
			options: {
				system: 'parallel',
				schema: parallelSchema,
				config: { ...config, title: 'Parallel' }
			},
			data: ParallelExampleData
		},
		{
			options: {
				system: 'polar',
				schema: polarSchema,
				config: { ...config, title: 'Polar' }
			},
			data: PolarExampleData
		},
		{
			options: {
				system: 'radar',
				schema: radarSchema,
				config: { ...config, title: 'Radar' }
			},
			data: RadarExampleData
		},
		{
			options: {
				system: 'spherical',
				schema: sphericalSchema,
				config: { ...config, title: 'Spherical' }
			},
			data: SphericalExampleData
		},
		{
			options: {
				system: 'ternary',
				schema: ternarySchema,
				config: { ...config, title: 'Ternary' }
			},
			data: TernaryExampleData
		}
	];

	onMount(() => {
		examples.forEach((example) => {
			const res = createSystem(example.data, example.options);
			chartInstances.push(res);
			console.log(example.options.system, res.success, res);
		});
	});

	$effect(() => {});
</script>

<div style="display: flex; flex-wrap: wrap">
	{#each chartInstances as chart}
		<p
			style={`border: 2px solid ${chart.success ? 'green' : 'red'}; margin: 1px; border-radius: 100px; padding: 0 5px`}
		>
			{chart.system}
		</p>
	{/each}
</div>

<!-- <CartesianSystemComponent bind:system /> -->
