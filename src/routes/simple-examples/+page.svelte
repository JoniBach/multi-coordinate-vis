<script lang="ts">
	import AffineDemoSchema from '$lib/components/simple/schema/AffineDemo.schema.js';
	import { processData } from '$lib/components/simple/schema/AllDemo.schema.js';
	import BarycentricDemoSchema from '$lib/components/simple/schema/BarycentricDemo.schema.js';
	import CartesianDemoSchema from '$lib/components/simple/schema/CartesianDemo.schema.js';
	import GeographicDemoSchema from '$lib/components/simple/schema/GeographicDemo.schema.js';
	import HexbinDemoSchema from '$lib/components/simple/schema/HexbinDemo.schema.js';
	import LogPolarDemoSchema from '$lib/components/simple/schema/LogPolarDemo.schema.js';
	import ObliqueDemoSchema from '$lib/components/simple/schema/ObliqueDemo.schema.js';
	import ParallelDemoSchema from '$lib/components/simple/schema/ParallelDemo.schema.js';
	import PolarDemoSchema from '$lib/components/simple/schema/PolarDemo.schema.js';
	import RadarDemoSchema from '$lib/components/simple/schema/RadarDemo.schema.js';
	import SphericalDemoSchema from '$lib/components/simple/schema/SphericalDemo.schema.js';
	import TernaryDemoSchema from '$lib/components/simple/schema/TernaryDemo.schema.js';

	import CartesianDemoData from '$lib/components/simple/generic_data/CartesianDemo.json';
	import PolarDemoData from '$lib/components/simple/generic_data/PolarDemo.json';
	import GeographicDemoData from '$lib/components/simple/generic_data/GeographicDemo.json';
	import ParallelDemoData from '$lib/components/simple/generic_data/ParallelDemo.json';
	import RadarDemoData from '$lib/components/simple/generic_data/RadarDemo.json';
	import TernaryDemoData from '$lib/components/simple/generic_data/TernaryDemo.json';
	import HexbinDemoData from '$lib/components/simple/generic_data/HexbinDemo.json';
	import LogPolarDemoData from '$lib/components/simple/generic_data/LogPolarDemo.json';
	import BarycentricDemoData from '$lib/components/simple/generic_data/BarycentricDemo.json';
	import SphericalDemoData from '$lib/components/simple/generic_data/SphericalDemo.json';
	import ObliqueDemoData from '$lib/components/simple/generic_data/ObliqueDemo.json';
	import AffineDemoData from '$lib/components/simple/generic_data/AffineDemo.json';

	import CartesianDemoComponent from '$lib/components/simple/demo_components/CartesianDemo.svelte';
	import PolarDemoComponent from '$lib/components/simple/demo_components/PolarDemo.svelte';
	import GeographicDemoComponent from '$lib/components/simple/demo_components/GeographicDemo.svelte';
	import ParallelDemoComponent from '$lib/components/simple/demo_components/ParallelDemo.svelte';
	import RadarDemoComponent from '$lib/components/simple/demo_components/RadarDemo.svelte';
	import TernaryDemoComponent from '$lib/components/simple/demo_components/TernaryDemo.svelte';
	import HexbinDemoComponent from '$lib/components/simple/demo_components/HexbinDemo.svelte';
	import LogPolarDemoComponent from '$lib/components/simple/demo_components/LogPolarDemo.svelte';
	import BarycentricDemoComponent from '$lib/components/simple/demo_components/BarycentricDemo.svelte';
	import SphericalDemoComponent from '$lib/components/simple/demo_components/SphericalDemo.svelte';
	import ObliqueDemoComponent from '$lib/components/simple/demo_components/ObliqueDemo.svelte';
	import AffineDemoComponent from '$lib/components/simple/demo_components/AffineDemo.svelte';
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
