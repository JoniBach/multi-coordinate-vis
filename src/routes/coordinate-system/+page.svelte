<script lang="ts">
	import { createSystem } from '$lib/utils/coordinate.schema.js';
	import CartesianExampleData from '$lib/data/example_data/v2/CartesianDemo.json';
	import CartesianSystemComponent from '$lib/components/system/CartesianSystemComponent.svelte';
	import type { System } from '$lib/utils/coordinate.schema.js';
	import { onMount } from 'svelte';

	let system: System = $state({ loading: false, success: false });

	onMount(() => {
		const res = createSystem('cartesian', CartesianExampleData, {
			x: 'timestamp',
			y: 'readings.celsius'
		});
		system = res;
		console.log(res);
	});

	$effect(() => {});
</script>

<CartesianSystemComponent bind:system />
