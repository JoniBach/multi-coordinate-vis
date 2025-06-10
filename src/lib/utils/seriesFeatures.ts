import * as d3 from 'd3';
import { hexbin as d3_hexbin } from 'd3-hexbin';

export const createSeriesSvg = (system, container) =>
	d3
		.select(container)
		.append('svg')
		.attr('width', system.config.size)
		.attr('height', system.config.size)
		.append('g');

const style = {
	show: true,
	color: 'black',
	strokeWidth: null,
	radius: null
};

export const seriesPlanarFeature = (system, svg, seriesId) => {
	const colorScale = style.colorScale
		? d3.scaleSequential(d3[style.colorScale]).domain([0, 1])
		: d3
				.scaleOrdinal(d3.schemeCategory10)
				.domain(system.series.data[seriesId].map((d) => d.entity));

	const features = {
		x_axis: () =>
			svg
				.append('g')
				.attr('transform', `translate(0, ${system.config.size - system.config.margin})`)
				.call(d3.axisBottom(system.scale.x))
				.selectAll('text')
				.attr('transform', 'rotate(-45)')
				.attr('fill', style.color)
				.attr('text-anchor', 'end'),

		y_axis: () =>
			svg
				.append('g')
				.attr('transform', `translate(${system.config.margin}, 0)`)
				.call(d3.axisLeft(system.scale.y))
				.selectAll('text')
				.attr('fill', style.color),

		x_axis_label: () =>
			svg
				.append('text')
				.attr('x', system.config.size / 2)
				.attr('y', system.config.size)
				.attr('text-anchor', 'middle')
				.attr('fill', style.color)
				.text(system.schema.x.label),

		y_axis_label: () =>
			svg
				.append('text')
				.attr('transform', 'rotate(-90)')
				.attr('x', -system.config.size / 2)
				.attr('y', 15)
				.attr('text-anchor', 'middle')
				.attr('fill', style.color)
				.text(system.schema.y.label),

		title: () =>
			svg
				.append('text')
				.attr('x', system.config.size / 2)
				.attr('y', system.config.margin)
				.attr('text-anchor', 'middle')
				.attr('fill', style.color)
				.text(system.config.title),

		x_axis_grid: () =>
			svg
				.append('g')
				.selectAll('line.x-grid')
				.data(system.scale.x.ticks())
				.enter()
				.append('line')
				.attr('class', 'x-grid')
				.attr('x1', (d) => system.scale.x(d))
				.attr('y1', system.config.margin)
				.attr('x2', (d) => system.scale.x(d))
				.attr('y2', system.config.size - system.config.margin)
				.attr('stroke-width', style.strokeWidth || 1)
				.attr('stroke', style.color),

		y_axis_grid: () =>
			svg
				.append('g')
				.selectAll('line.y-grid')
				.data(system.scale.y.ticks())
				.enter()
				.append('line')
				.attr('class', 'y-grid')
				.attr('x1', system.config.margin)
				.attr('y1', (d) => system.scale.y(d))
				.attr('x2', system.config.size - system.config.margin)
				.attr('y2', (d) => system.scale.y(d))
				.attr('stroke-width', style.strokeWidth || 1)
				.attr('stroke', style.color),

		// the pretty bit

		points: () =>
			svg
				.append('g')
				.selectAll('circle')
				.data(system.series.data[seriesId])
				.enter()
				.append('circle')
				.attr('cx', (d) => system.series.scale[seriesId].x(d.x))
				.attr('cy', (d) => system.series.scale[seriesId].y(d.y))
				.attr('r', style.radius || 5)
				.attr('fill', (d) => colorScale(d.entity)),

		lines: () =>
			svg
				.append('g')
				.selectAll('path')
				.data(d3.groups(system.series.data[seriesId], (d) => d.entity))
				.enter()
				.append('path')
				.attr('d', (group) =>
					d3
						.line()
						.x((d) => system.series.scale[seriesId].x(d.x))
						.y((d) => system.series.scale[seriesId].y(d.y))(group[1])
				)
				.attr('fill', 'none')
				.attr('stroke-width', style.strokeWidth || 2)
				.attr('stroke', (group) => colorScale(group[0])),

		shade_area: () =>
			svg
				.append('g')
				.selectAll('path')
				.data(d3.groups(system.series.data[seriesId], (d) => d.entity))
				.enter()
				.append('path')
				.attr(
					'd',
					(group) =>
						`M ${system.series.scale[seriesId].x(group[1][0].x)}, ${system.series.scale[seriesId].y(group[1][0].y)} L ${group[1].map((p) => `${system.series.scale[seriesId].x(p.x)},${system.series.scale[seriesId].y(p.y)}`).join(' L ')} L ${system.series.scale[seriesId].x(group[1][group[1].length - 1].x)}, ${system.series.scale[seriesId].y(0)} L ${system.series.scale[seriesId].x(group[1][0].x)}, ${system.series.scale[seriesId].y(0)} Z`
				)
				.attr('fill', (group) => colorScale(group[0]))
				.attr('opacity', 0.5),

		bars: () =>
			svg
				.append('g')
				.selectAll('rect')
				.data(system.series.data[seriesId])
				.enter()
				.append('rect')
				.attr('x', (d) => system.series.scale[seriesId].x(d.x) - 5)
				.attr('y', (d) => system.series.scale[seriesId].y(d.y))
				.attr('width', 10)
				.attr(
					'height',
					(d) => system.series.scale[seriesId].y(0) - system.series.scale[seriesId].y(d.y)
				)
				.attr('fill', (d) => colorScale(d.entity))
				.sort((a, b) => a.x - b.x || b.y - a.y),

		hexbin: () => {
			// Create hexbin generator
			const hexbin = d3_hexbin()
				.x((d) => system.series.scale[seriesId].x(d.x))
				.y((d) => system.series.scale[seriesId].y(d.y))
				.radius(style.radius || 25)
				.extent([
					[system.series.config.margin, system.series.config.margin],
					[
						system.series.config.size - system.series.config.margin,
						system.series.config.size - system.series.config.margin
					]
				]);

			const bins = hexbin(system.series.data[seriesId]);

			// Find max bin length for opacity scaling
			const maxBinLength = d3.max(bins, (b) => b.length) || 1;

			// Draw hexbin paths
			return svg
				.append('g') // Add a group element to contain the hexbins
				.selectAll('path')
				.data(bins)
				.enter()
				.append('path')
				.attr('d', hexbin.hexagon())
				.attr('transform', (d) => `translate(${d.x},${d.y})`)
				.attr('fill', style.color || '#1976d2')
				.attr('fill-opacity', (d) => 0.2 + (0.6 * d.length) / maxBinLength)
				.attr('stroke', '#333');
		}
	};

	return features;
};
