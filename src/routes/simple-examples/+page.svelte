<script lang="ts">
	import { onMount } from 'svelte';
	// import components
	import CartesianDemoComponent from './demo_components/CartesianDemo.svelte';
	import PolarDemoComponent from './demo_components/PolarDemo.svelte';
	import GeographicDemoComponent from './demo_components/GeographicDemo.svelte';
	import ParallelDemoComponent from './demo_components/ParallelDemo.svelte';
	import RadarDemoComponent from './demo_components/RadarDemo.svelte';
	import TernaryDemoComponent from './demo_components/TernaryDemo.svelte';
	import HexbinDemoComponent from './demo_components/HexbinDemo.svelte';
	import LogPolarDemoComponent from './demo_components/LogPolarDemo.svelte';
	import BarycentricDemoComponent from './demo_components/BarycentricDemo.svelte';
	import SphericalDemoComponent from './demo_components/SphericalDemo.svelte';
	import ObliqueDemoComponent from './demo_components/ObliqueDemo.svelte';
	import AffineDemoComponent from './demo_components/AffineDemo.svelte';

	// import schemas
	import CartesianDemoSchema from './schema/CartesianDemo.schema.js';
	import PolarDemoSchema from './schema/PolarDemo.schema.js';
	import GeographicDemoSchema from './schema/GeographicDemo.schema.js';
	import ParallelDemoSchema from './schema/ParallelDemo.schema.js';
	import RadarDemoSchema from './schema/RadarDemo.schema.js';
	import TernaryDemoSchema from './schema/TernaryDemo.schema.js';
	import HexbinDemoSchema from './schema/HexbinDemo.schema.js';
	import LogPolarDemoSchema from './schema/LogPolarDemo.schema.js';
	import BarycentricDemoSchema from './schema/BarycentricDemo.schema.js';
	import SphericalDemoSchema from './schema/SphericalDemo.schema.js';
	import ObliqueDemoSchema from './schema/ObliqueDemo.schema.js';
	import AffineDemoSchema from './schema/AffineDemo.schema.js';

	// import mock data
	import CartesianDemoData from './generic_data/CartesianDemo.json' with { type: 'json' };
	import PolarDemoData from './generic_data/PolarDemo.json' with { type: 'json' };
	import GeographicDemoData from './generic_data/GeographicDemo.json' with { type: 'json' };
	import ParallelDemoData from './generic_data/ParallelDemo.json' with { type: 'json' };
	import RadarDemoData from './generic_data/RadarDemo.json' with { type: 'json' };
	import TernaryDemoData from './generic_data/TernaryDemo.json' with { type: 'json' };
	import HexbinDemoData from './generic_data/HexbinDemo.json' with { type: 'json' };
	import LogPolarDemoData from './generic_data/LogPolarDemo.json' with { type: 'json' };
	import BarycentricDemoData from './generic_data/BarycentricDemo.json' with { type: 'json' };
	import SphericalDemoData from './generic_data/SphericalDemo.json' with { type: 'json' };
	import ObliqueDemoData from './generic_data/ObliqueDemo.json' with { type: 'json' };
	import AffineDemoData from './generic_data/AffineDemo.json' with { type: 'json' };

	// import example data
	import CartesianExampleData from './example_data/v2/CartesianDemo.json' with { type: 'json' };
	import PolarExampleData from './example_data/v2/PolarDemo.json' with { type: 'json' };
	import GeographicExampleData from './example_data/v2/GeographicDemo.json' with { type: 'json' };
	import ParallelExampleData from './example_data/v2/ParallelDemo.json' with { type: 'json' };
	import RadarExampleData from './example_data/v2/RadarDemo.json' with { type: 'json' };
	import TernaryExampleData from './example_data/v2/TernaryDemo.json' with { type: 'json' };
	import HexbinExampleData from './example_data/v2/HexbinDemo.json' with { type: 'json' };
	import LogPolarExampleData from './example_data/v2/LogPolarDemo.json' with { type: 'json' };
	import BarycentricExampleData from './example_data/v2/BarycentricDemo.json' with { type: 'json' };
	import SphericalExampleData from './example_data/v2/SphericalDemo.json' with { type: 'json' };
	import ObliqueExampleData from './example_data/v2/ObliqueDemo.json' with { type: 'json' };
	import AffineExampleData from './example_data/v2/AffineDemo.json' with { type: 'json' };
	import { toCoordinates } from './schema/AllDemo.schema.js';

	$effect(() => {
		const schema = {
			x: 'timestamp',
			y: 'readings.celsius'
			// celsius: 'greenhouse_id'
		};
		const data = toCoordinates['cartesian'](CartesianExampleData, schema);
		console.log(data);
	});
</script>

<h1>Basic Examples</h1>
<h2>Cartesian Demo</h2>
<CartesianDemoComponent data={CartesianDemoData} schema={CartesianDemoSchema} />
<hr />
<h2>Polar Demo</h2>
<PolarDemoComponent data={PolarDemoData} schema={PolarDemoSchema} />
<hr />
<h2>Geographic Demo</h2>
<GeographicDemoComponent data={GeographicDemoData} schema={GeographicDemoSchema} />
<hr />
<h2>Parallel Demo</h2>
<ParallelDemoComponent data={ParallelDemoData} schema={ParallelDemoSchema} />
<hr />
<h2>Radar Demo</h2>
<RadarDemoComponent data={RadarDemoData} schema={RadarDemoSchema} />
<hr />
<h2>Ternary Demo</h2>
<TernaryDemoComponent data={TernaryDemoData} schema={TernaryDemoSchema} />
<hr />
<h2>Hexbin Demo</h2>
<HexbinDemoComponent data={HexbinDemoData} schema={HexbinDemoSchema} />
<hr />
<h2>Log-Polar Demo</h2>
<LogPolarDemoComponent data={LogPolarDemoData} schema={LogPolarDemoSchema} />
<hr />
<h2>Barycentric Demo</h2>
<BarycentricDemoComponent data={BarycentricDemoData} schema={BarycentricDemoSchema} />
<hr />
<h2>Spherical Demo</h2>
<SphericalDemoComponent data={SphericalDemoData} schema={SphericalDemoSchema} />
<hr />
<h2>Oblique Demo</h2>
<ObliqueDemoComponent data={ObliqueDemoData} schema={ObliqueDemoSchema} />
<hr />
<h2>Affine Demo</h2>
<AffineDemoComponent data={AffineDemoData} schema={AffineDemoSchema} />
<hr />
