<script lang="ts">
	import { processData } from '$lib/utils/coordinate.schema.js';
	import CartesianExampleData from '$lib/data/example_data/v2/CartesianDemo.json';

	$effect(() => {
		const processedData = processData('cartesian', CartesianExampleData, {
			x: 'timestamp',
			y: 'readings.celsius'
		});
		console.log(processedData);
	});
</script>
