import type {
	AffineObject,
	BarycentricObject,
	CartesianObject,
	GeographicObject,
	HexbinObject,
	LogPolarObject,
	ObliqueObject,
	ParallelObject,
	PolarObject,
	RadarObject,
	SphericalObject,
	TernaryObject
} from './coordinate.schema.js';
import { z } from 'zod';
import * as d3 from 'd3';

const ConfigSchema = z.object({
	height: z.number().positive().int(),
	width: z.number().positive().int(),
	margin: z.number().positive().int(),
	skewX: z.number().int().optional().nullable(),
	skewY: z.number().int().optional().nullable()
});

export type Config = z.infer<typeof ConfigSchema>;

const affineScale = (data: Array<AffineObject>, config: Config) => {
	const { height, width, margin } = config;
	const xExtent = d3.extent(data.map((d) => d.tx)) || [0, 1];
	const yExtent = d3.extent(data.map((d) => d.ty)) || [0, 1];
	const xScale = d3
		.scaleLinear()
		.domain([Math.min(...xExtent), Math.max(...xExtent)])
		.range([margin, width - margin]);

	const yScale = d3
		.scaleLinear()
		.domain([Math.min(...yExtent), Math.max(...yExtent)])
		.range([height - margin, margin]);

	return { xScale, yScale };
};
const barycentricScale = (data: Array<BarycentricObject>, config: Config) => {
	// todo
};
const cartesianScale = (data: Array<CartesianObject>, config: Config) => {
	const { height, width, margin } = config;
	const xExtent = d3.extent(data.map((d) => Number(d.x || 0))) || [0, 1];
	const yExtent = d3.extent(data.map((d) => Number(d.y || 0))) || [0, 1];
	const xScale = d3
		.scaleLinear()
		.domain([Math.min(...xExtent), Math.max(...xExtent)])
		.range([margin, width - margin]);

	const yScale = d3
		.scaleLinear()
		.domain([Math.min(...yExtent), Math.max(...yExtent)])
		.range([height - margin, margin]);

	return { xScale, yScale };
};

const geographicScale = (data: Array<GeographicObject>, config: Config) => {
	const { height, width, margin } = config;
	// Dynamic scales for longitude and latitude
	const lonExtent = d3.extent(data.map((f) => Number(f.geometry.coordinates[0] || 0))) || [
		-180, 180
	];
	const latExtent = d3.extent(data.map((f) => Number(f.geometry.coordinates[1] || 0))) || [-90, 90];

	return { lonExtent, latExtent };
};
const hexbinScale = (data: Array<HexbinObject>, config: Config) => {
	const { height, width, margin } = config;
	const xExtent = d3.extent(data.map((d) => Number(d.x || 0))) || [0, width];
	const yExtent = d3.extent(data.map((d) => Number(d.y || 0))) || [0, height];

	const xScale = d3
		.scaleLinear()
		.domain([Math.min(...xExtent), Math.max(...xExtent)])
		.range([margin, width - margin]);

	const yScale = d3
		.scaleLinear()
		.domain([Math.min(...yExtent), Math.max(...yExtent)])
		.range([height - margin, margin]);

	return { xScale, yScale };
};
const logPolarScale = (data: Array<LogPolarObject>, config: Config) => {
	// Find log(r) extent with safe conversion
	const { height, width, margin } = config;
	const radius = Math.min(width, height) / 2 - margin;

	const safeLogExtent = data.map((d) => Math.log10(Number(d.r || 1)));
	const logExtent = [Math.min(...safeLogExtent), Math.max(...safeLogExtent)] as [number, number];
	const rScale = d3.scaleLinear().domain(logExtent).range([0, radius]);
	return { logExtent, rScale };
};
const obliqueScale = (data: Array<ObliqueObject>, config: Config) => {
	const { height, width, margin, scaleExtent } = config;

	// Determine dynamic scale based on data
	const xExtent = d3.extent(data.map((d) => Number(d.x || 0))) || [0, 1];
	const yExtent = d3.extent(data.map((d) => Number(d.y || 0))) || [0, 1];
	const maxExtent = Math.max(
		Math.abs(xExtent[0] || 0),
		Math.abs(xExtent[1] || 0),
		Math.abs(yExtent[0] || 0),
		Math.abs(yExtent[1] || 0)
	);
	const scaleFactor = scaleExtent / maxExtent;

	return { scaleFactor };
};
const parallelScale = (data: Array<ParallelObject>, config: Config) => {
	const { height, width } = config;

	// Dynamically determine dimensions
	const dimensions = Object.keys(data[0] || {});

	// Create scales for each dimension
	const y: Record<string, d3.ScaleLinear<number, number>> = {};
	dimensions.forEach((dim) => {
		// Safely extract numeric values
		const values = data.map((d) => Number(d[dim] || 0));
		y[dim] = d3
			.scaleLinear()
			.domain([Math.min(...values), Math.max(...values)])
			.range([height, 0]);
	});

	const x = d3.scalePoint().domain(dimensions).range([0, width]);
	return { x, y };
};
const polarScale = (data: Array<PolarObject>, config: Config) => {
	const { height, width, margin } = config;
	const radius = Math.min(width, height) / 2 - margin;

	// Dynamic scales for r and theta
	const rExtent = d3.extent(data.map((d) => Number(d.r || 0))) || [0, 1];
	const thetaExtent = d3.extent(data.map((d) => Number(d.theta || 0))) || [0, 360];

	const rScale = d3
		.scaleLinear()
		.domain([Math.min(...rExtent), Math.max(...rExtent)])
		.range([0, radius]);

	const thetaScale = d3
		.scaleLinear()
		.domain([Math.min(...thetaExtent), Math.max(...thetaExtent)])
		.range([0, 2 * Math.PI]);
	return { rScale, thetaScale };
};
const radarScale = (data: Array<RadarObject>, config: Config) => {
	// Dynamically determine variables
	const { height, width, margin } = config;
	const radius = Math.min(width, height) / 2 - margin;
	const variables = data.length > 0 ? Object.keys(data[0]).filter((k) => k !== 'species') : [];
	const angleSlice = (2 * Math.PI) / variables.length;

	// Dynamic scales for each variable
	const variableExtents = variables.map(
		(v) => d3.extent(data.map((d) => Number(d[v] || 0))) || [0, 1]
	);

	const rScale = d3
		.scaleLinear()
		.domain([0, Math.max(...variableExtents.map((extent) => Math.max(...extent)))])
		.range([0, radius]);
	return { rScale, angleSlice };
};
const sphericalScale = (data: Array<SphericalObject>, config: Config) => {
	const { height, width, margin } = config;
	const radius = Math.min(width, height) / 2 - margin;
	// Dynamic scales for r, theta, and phi
	// Dynamic scales for r, theta, and phi
	const rExtent = d3.extent(data.map((d) => Number(d.r || 0))) || [0, 1];
	const thetaExtent = d3.extent(data.map((d) => Number(d.theta || 0))) || [0, 360];
	const phiExtent = d3.extent(data.map((d) => Number(d.phi || 0))) || [0, 180];

	// Use square root scaling for better point distribution
	const maxR = Math.max(...rExtent);
	const rScale = d3.scaleSqrt().domain([0, maxR]).range([0, radius]);

	const thetaScale = d3
		.scaleLinear()
		.domain([Math.min(...thetaExtent), Math.max(...thetaExtent)])
		.range([0, 2 * Math.PI]);
	const phiScale = d3
		.scaleLinear()
		.domain([Math.min(...phiExtent), Math.max(...phiExtent)])
		.range([0, Math.PI]);
	return { rScale, thetaScale, phiScale };
};
const ternaryScale = (data: Array<TernaryObject>, config: Config) => {
	// todo
};

export const scales = {
	affine: affineScale,
	barycentric: barycentricScale,
	cartesian: cartesianScale,
	geographic: geographicScale,
	hexbin: hexbinScale,
	logPolar: logPolarScale,
	oblique: obliqueScale,
	parallel: parallelScale,
	polar: polarScale,
	radar: radarScale,
	spherical: sphericalScale,
	ternary: ternaryScale
};
