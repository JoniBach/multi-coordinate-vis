// List of available data operations
export const operation_list = [
	'raw', // Original data without transformation
	'sum', // Sum of all values
	'average', // Average (mean) of values
	'median', // Median value
	'min', // Minimum value
	'max', // Maximum value
	'count', // Count of data points
	'variance', // Statistical variance
	'stddev', // Standard deviation
	'quantile25', // First quartile (25%)
	'quantile75', // Third quartile (75%)
	'range', // Range between min and max
	'cumulative', // Cumulative sum
	'normalize', // Normalize values to [0,1] range
	'percentile', // Convert to percentiles
	'zScore' // Z-score standardization
] as const;

export type OperationType = (typeof operation_list)[number];

// Operations implementation
const dataOperations = {
	raw: (data: any[]) => data,
	sum: (data: number[]) => data.reduce((acc, val) => acc + val, 0),
	average: (data: number[]) =>
		data.length > 0 ? data.reduce((acc, val) => acc + val, 0) / data.length : 0,
	median: (data: number[]) => {
		if (data.length === 0) return 0;
		const sorted = [...data].sort((a, b) => a - b);
		const mid = Math.floor(sorted.length / 2);
		return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
	},
	min: (data: number[]) => (data.length > 0 ? Math.min(...data) : 0),
	max: (data: number[]) => (data.length > 0 ? Math.max(...data) : 0),
	count: (data: any[]) => data.length,
	variance: (data: number[]) => {
		if (data.length <= 1) return 0;
		const avg = dataOperations.average(data);
		return dataOperations.average(data.map((val) => Math.pow(val - avg, 2)));
	},
	stddev: (data: number[]) => Math.sqrt(dataOperations.variance(data)),
	quantile25: (data: number[]) => {
		if (data.length === 0) return 0;
		const sorted = [...data].sort((a, b) => a - b);
		return sorted[Math.floor(sorted.length * 0.25)];
	},
	quantile75: (data: number[]) => {
		if (data.length === 0) return 0;
		const sorted = [...data].sort((a, b) => a - b);
		return sorted[Math.floor(sorted.length * 0.75)];
	},
	range: (data: number[]) => {
		if (data.length === 0) return 0;
		return dataOperations.max(data) - dataOperations.min(data);
	},
	cumulative: (data: number[]) => {
		const result: number[] = [];
		let sum = 0;
		for (const val of data) {
			sum += val;
			result.push(sum);
		}
		return result;
	},
	normalize: (data: number[]) => {
		if (data.length === 0) return [];
		const min = dataOperations.min(data);
		const max = dataOperations.max(data);
		const range = max - min;
		return range === 0 ? data.map(() => 0.5) : data.map((val) => (val - min) / range);
	},
	percentile: (data: number[]) => {
		if (data.length === 0) return [];
		const sorted = [...data].sort((a, b) => a - b);
		return data.map((val) => {
			const index = sorted.indexOf(val);
			return (index / (sorted.length - 1)) * 100;
		});
	},
	zScore: (data: number[]) => {
		if (data.length <= 1) return data.map(() => 0);
		const avg = dataOperations.average(data);
		const stdDev = dataOperations.stddev(data);
		return stdDev === 0 ? data.map(() => 0) : data.map((val) => (val - avg) / stdDev);
	}
};

const calculateData = (
	data: any[],
	schema: InputSchemaConfiguration,
	operations: Record<string, OperationType> = {}
): any[] => {
	if (!data || data.length === 0) return [];

	// If no operations specified, return original data
	if (Object.keys(operations).length === 0) return data;

	// Group data by non-operation fields if needed
	const operationKeys = Object.keys(operations);
	const groupingKeys = Object.keys(schema).filter((key) => !operationKeys.includes(key));

	// If no grouping keys, apply operations directly to the entire dataset
	if (groupingKeys.length === 0) {
		const result = {};
		for (const [key, operation] of Object.entries(operations)) {
			const values = data
				.map((item) => item[key])
				.filter((val) => val !== undefined && val !== null);

			// Only apply numeric operations to numeric data
			if (
				operation !== 'raw' &&
				operation !== 'count' &&
				values.some((v) => typeof v !== 'number')
			) {
				console.warn(`Operation ${operation} can only be applied to numeric data for key ${key}`);
				result[key] = values;
			} else {
				const operationFn = dataOperations[operation];
				result[key] = operationFn(values);
			}
		}
		return [result];
	}

	// Group data by grouping keys
	const groupedData = _.groupBy(data, (item) => {
		return groupingKeys.map((key) => item[key]).join('|');
	});

	// Apply operations to each group
	return Object.values(groupedData).map((group) => {
		const result = {};

		// Preserve grouping keys
		for (const key of groupingKeys) {
			result[key] = group[0][key];
		}

		// Apply operations to operation keys
		for (const [key, operation] of Object.entries(operations)) {
			const values = group
				.map((item) => item[key])
				.filter((val) => val !== undefined && val !== null);

			// Only apply numeric operations to numeric data
			if (
				operation !== 'raw' &&
				operation !== 'count' &&
				values.some((v) => typeof v !== 'number')
			) {
				console.warn(`Operation ${operation} can only be applied to numeric data for key ${key}`);
				result[key] = values[0]; // Default to first value if operation can't be applied
			} else {
				const operationFn = dataOperations[operation];
				result[key] = operationFn(values);
			}
		}

		return result;
	});
};
