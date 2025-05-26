import * as d3 from 'd3';
import { hexbin as d3_hexbin } from 'd3-hexbin';

export const createSvg = (system, container) =>
	d3
		.select(container)
		.append('svg')
		.attr('width', system.config.size)
		.attr('height', system.config.size)
		.append('g');

export const planarFeature = (system, svg, featureConfig) => {
	const style = {
		show: true,
		color: 'black',
		strokeWidth: null,
		radius: null,
		...featureConfig
	};

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

		data_points: () =>
			svg
				.append('g')
				.selectAll('circle')
				.data(system.data)
				.enter()
				.append('circle')
				.attr('cx', (d) => system.scale.x(d.x))
				.attr('cy', (d) => system.scale.y(d.y))
				.attr('r', style.radius || 5)
				.attr('fill', style.color || 'red'),

		lines: () =>
			svg
				.append('g')
				.selectAll('path')
				.data([system.data])
				.enter()
				.append('path')
				.attr(
					'd',
					d3
						.line()
						.x((d) => system.scale.x(d.x))
						.y((d) => system.scale.y(d.y))
				)
				.attr('fill', 'none')
				.attr('stroke-width', style.strokeWidth || 2)
				.attr('stroke', style.color || 'green'),

		shade_area: () =>
			svg
				.append('g')
				.selectAll('path')
				.data([system.data])
				.enter()
				.append('path')
				.attr(
					'd',
					(d) =>
						`M ${system.scale.x(d[0].x)}, ${system.scale.y(d[0].y)} L ${d.map((p) => `${system.scale.x(p.x)},${system.scale.y(p.y)}`).join(' L ')} L ${system.scale.x(d[d.length - 1].x)}, ${system.scale.y(0)} L ${system.scale.x(d[0].x)}, ${system.scale.y(0)} Z`
				)
				.attr('fill', style.color || 'green')
				.attr('opacity', 0.5),

		bars: () =>
			svg
				.append('g')
				.selectAll('rect')
				.data(system.data)
				.enter()
				.append('rect')
				.attr('x', (d) => system.scale.x(d.x) - 5)
				.attr('y', (d) => system.scale.y(d.y))
				.attr('width', 10)
				.attr('height', (d) => system.scale.y(0) - system.scale.y(d.y))
				.attr('fill', style.color || 'blue'),
		hexbin: () => {
			// Create hexbin generator
			const hexbin = d3_hexbin()
				.x((d) => system.scale.x(d.x))
				.y((d) => system.scale.y(d.y))
				.radius(style.radius || 25)
				.extent([
					[system.config.margin, system.config.margin],
					[system.config.size - system.config.margin, system.config.size - system.config.margin]
				]);

			const bins = hexbin(system.data);

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

export const radialFeature = (system, svg, featureConfig) => {
	const style = {
		show: true,
		color: 'black',
		strokeWidth: null,
		radius: null,
		...featureConfig
	};
	const features = {
		theta_axis: () => null,
		r_axis: () => null,
		r_axis_label: () => null,
		theta_axis_label: () => null,
		title: () =>
			svg
				.append('text')
				.attr('x', system.config.size / 2)
				.attr('y', system.config.margin)
				.attr('text-anchor', 'middle')
				.attr('fill', style.color)
				.text(system.config.title)
	};

	return features;
};
