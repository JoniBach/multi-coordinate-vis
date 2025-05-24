import * as d3 from 'd3';
import { hexbin as d3_hexbin } from 'd3-hexbin';

export const createSvg = (system, container) =>
	d3
		.select(container)
		.append('svg')
		.attr('width', system.config.size)
		.attr('height', system.config.size);

export const chartFeature = (system, svg) => {
	const features = {
		x_axis: () =>
			svg
				.append('g')
				.attr('transform', `translate(0, ${system.config.size - system.config.margin})`)
				.call(d3.axisBottom(system.scale.x))
				.selectAll('text')
				.attr('transform', 'rotate(-45)')
				.attr('text-anchor', 'end'),

		y_axis: () =>
			svg
				.append('g')
				.attr('transform', `translate(${system.config.margin}, 0)`)
				.call(d3.axisLeft(system.scale.y)),

		x_axis_label: () =>
			svg
				.append('text')
				.attr('x', system.config.size / 2)
				.attr('y', system.config.size)
				.attr('text-anchor', 'middle')
				.text(system.schema.x.label),

		y_axis_label: () =>
			svg
				.append('text')
				.attr('transform', 'rotate(-90)')
				.attr('x', -system.config.size / 2)
				.attr('y', 15)
				.attr('text-anchor', 'middle')
				.text(system.schema.y.label),

		title: () =>
			svg
				.append('text')
				.attr('x', system.config.size / 2)
				.attr('y', system.config.margin)
				.attr('text-anchor', 'middle')
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
				.attr('stroke', '#ccc'),

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
				.attr('stroke', '#ccc'),

		data_points: () =>
			svg
				.append('g')
				.selectAll('circle')
				.data(system.data)
				.enter()
				.append('circle')
				.attr('cx', (d) => system.scale.x(d.x))
				.attr('cy', (d) => system.scale.y(d.y))
				.attr('r', 5)
				.attr('fill', 'red'),

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
				.attr('stroke', 'green'),

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
				.attr('fill', 'green')
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
				.attr('fill', 'blue'),
		hexbin: () => {
			// Create hexbin generator
			const hexbin = d3_hexbin()
				.x((d: any) => system.scale.x(d.x))
				.y((d: any) => system.scale.y(d.y))
				.radius(25)
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
				.attr('fill', '#1976d2')
				.attr('fill-opacity', (d) => 0.2 + (0.6 * d.length) / maxBinLength)
				.attr('stroke', '#333');
		}
	};

	return features;
};
