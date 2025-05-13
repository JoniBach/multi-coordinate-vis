import type { System } from './coordinate.schema.js';

const scales = [
	'linear',
	'log',
	'pow',
	'log',
	'symlog',
	'radial',
	'time',
	'utc',
	'sequential',
	'diverging',
	'quantize',
	'quantile',
	'threshold',
	'ordinal',
	'band',
	'point',
	'identity'
];

export const calculateExtent = {
	string: (data: string[]) => [Math.min(...data), Math.max(...data)],
	number: (data: number[]) => [Math.min(...data), Math.max(...data)],
	date: (data: Date[]) => [Math.min(...data), Math.max(...data)],
	boolean: (data: boolean[]) => [Math.min(...data), Math.max(...data)]
};

const calculateScale = (system: System) => ({
	linear: (field: string) => null
});
