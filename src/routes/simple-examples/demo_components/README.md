# Multi-Coordinate System Data Visualization Library with D3.js

## Introduction

In data visualization, a **coordinate system** is a framework that maps data values to positions in a visual space, such as a screen or page. This mapping is essential for creating meaningful graphical representations, including charts, graphs, and maps. The choice of coordinate system influences how data is interpreted, making it a critical decision in visualization design. This library leverages [D3.js](https://d3js.org/), a powerful JavaScript library for bespoke data visualization, to support multiple coordinate systems, enabling users to create diverse and effective visualizations tailored to their data.

This README provides a comprehensive overview of five key coordinate systems, their characteristics, common use cases, and implementation details using D3.js. It also offers guidance on selecting the appropriate system for different data types and visualization goals.

## Coordinate Systems Covered

The library supports the following coordinate systems, each designed for specific types of data and visualizations:

1. **Cartesian Coordinates**
2. **Polar Coordinates**
3. **Geographic Coordinates**
4. **Parallel Coordinates**
5. **Radar Coordinates**

## Detailed Explanations

### 1. Cartesian Coordinates

**Definition:**
The Cartesian coordinate system is a two-dimensional plane defined by two perpendicular axes: the x-axis (horizontal) and the y-axis (vertical). Data points are plotted based on their (x, y) values, representing distances along these axes.

**Key Characteristics:**

- Supports various scale types, including linear (`d3.scaleLinear()`), logarithmic (`d3.scaleLog()`), and ordinal (`d3.scaleOrdinal()`).
- Axes can be customized with ticks, labels, and grids for enhanced readability.
- The SVG coordinate system in D3.js starts at (0,0) in the top-left corner, with y increasing downward, unlike the mathematical convention where y increases upward.

**Common Visualizations:**

- **Scatter Plots**: Points plotted at (x, y) positions to show relationships between two variables.
- **Line Charts**: Connected points to display trends over time or categories.
- **Bar Charts**: Rectangles representing categorical data.
- **Area Charts**: Filled areas under lines to show cumulative data.

**D3.js Tools and Functions:**

- **Scales**: `d3.scaleLinear()`, `d3.scaleLog()`, `d3.scaleOrdinal()` for mapping data to pixel positions.
- **Axes**: `d3.axisBottom()`, `d3.axisLeft()`, `d3.axisTop()`, `d3.axisRight()` for rendering axes.
- **Generators**: `d3.line()`, `d3.area()` for drawing lines and areas.

**Example Code Snippet:**

```javascript
// Define scales
const xScale = d3.scaleLinear().domain([0, 10]).range([0, 500]);
const yScale = d3.scaleLinear().domain([0, 10]).range([500, 0]);

// Create axes
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

// Append axes to SVG
svg.append('g').attr('transform', 'translate(0, 500)').call(xAxis);
svg.append('g').call(yAxis);
```

**Further Reading:**

- [D3.js Scales](https://d3js.org/d3-scale)
- [D3.js Axes](https://d3js.org/d3-axis)

### 2. Polar Coordinates

**Definition:**
In the polar coordinate system, each point is defined by its distance from a fixed point (the origin), called the radius (r), and its angle from a fixed direction, called theta (θ). Points are mapped to a circular layout.

**Key Characteristics:**

- Circular layout centered at the origin.
- Angles are typically measured in degrees or radians.
- In D3.js, θ = 0 is at 12 o’clock, with angles increasing clockwise, differing from the mathematical convention (θ = 0 at 3 o’clock, counterclockwise).
- Points (r, θ) are converted to Cartesian (x, y) for rendering: `x = r * cos(θ)`, `y = r * sin(θ)`.

**Common Visualizations:**

- **Pie Charts**: Sectors of a circle representing proportions.
- **Radar Charts**: Polygons showing multivariate data.
- **Polar Area Charts**: Similar to pie charts but with variable radius.
- **Rose Diagrams**: Histograms in polar coordinates for directional data.

**D3.js Tools and Functions:**

- `d3.lineRadial()`: Draws lines in polar coordinates.
- `d3.areaRadial()`: Draws areas in polar coordinates.
- `d3.arc()`: Creates arc shapes for pie charts or donut charts.
- Custom scales for radius (`d3.scaleLinear()`) and angle (`d3.scaleLinear().range([0, 2 * Math.PI])`).

**Example Code Snippet:**

```javascript
// Define scales
const radiusScale = d3.scaleLinear().domain([0, 10]).range([0, 200]);
const angleScale = d3
	.scaleLinear()
	.domain([0, 360])
	.range([0, 2 * Math.PI]);

// Create radial line
const lineRadial = d3
	.lineRadial()
	.radius((d) => radiusScale(d.r))
	.angle((d) => angleScale(d.theta));

// Append path to SVG
svg
	.append('path')
	.datum(data)
	.attr('d', lineRadial)
	.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
```

**Further Reading:**

- [D3.js Radial Lines](https://d3js.org/d3-shape/line#radial)
- [Polar Plot Example](https://bl.ocks.org/mbostock/4583749)

### 3. Geographic Coordinates

**Definition:**
Geographic coordinates specify locations on the Earth’s surface using longitude (east-west) and latitude (north-south). These are projected onto a 2D plane using mathematical transformations called projections.

**Key Characteristics:**

- The Earth is a three-dimensional sphere, requiring projections to create flat visualizations.
- Projections (e.g., Mercator, Albers, Orthographic) preserve different properties like area, shape, or distance.
- Data is typically in GeoJSON format or as [longitude, latitude] pairs.

**Common Visualizations:**

- **World Maps**: Displaying geographic boundaries.
- **Choropleth Maps**: Coloring regions based on data values.
- **Dot Density Maps**: Placing dots to represent data points.
- **Flow Maps**: Showing movement between locations.

**D3.js Tools and Functions:**

- **Projections**: `d3.geoMercator()`, `d3.geoAlbers()`, `d3.geoOrthographic()` for mapping coordinates.
- `d3.geoPath()`: Renders geographic shapes.
- `d3.geoGraticule()`: Draws latitude and longitude lines.

**Example Code Snippet:**

```javascript
// Define projection
const projection = d3
	.geoMercator()
	.scale(100)
	.translate([width / 2, height / 2]);

// Create path generator
const path = d3.geoPath().projection(projection);

// Append paths to SVG
svg.selectAll('path').data(geojson.features).enter().append('path').attr('d', path);
```

**Further Reading:**

- [D3.js Geo Projections](https://d3js.org/d3-geo/projection)
- [Let’s Make a Map](https://bost.ocks.org/mike/map/)

### 4. Parallel Coordinates

**Definition:**
Parallel coordinates visualize high-dimensional data by representing each dimension on a separate vertical axis. Data points are plotted as lines that connect their values across these axes.

**Key Characteristics:**

- Each axis corresponds to a different variable, scaled independently.
- Lines highlight relationships, correlations, or clusters in multivariate data.
- Not a single (x, y) mapping but a series of positions per data point.

**Common Visualizations:**

- **Parallel Coordinates Plots**: For exploring datasets with multiple variables, such as in machine learning or statistics.

**D3.js Tools and Functions:**

- **Scales**: Multiple `d3.scaleLinear()` for each axis.
- **Lines**: `d3.line()` to connect points across axes.
- **Axes**: `d3.axisLeft()` for each vertical axis.

**Example Code Snippet:**

```javascript
// Define scales for each dimension
const scales = dimensions.map((dim) =>
	d3
		.scaleLinear()
		.domain(d3.extent(data, (d) => d[dim]))
		.range([height, 0])
);

// Create line generator
const line = d3.line();

// Append lines
svg
	.selectAll('.line')
	.data(data)
	.enter()
	.append('path')
	.attr('d', (d) => line(dimensions.map((dim, i) => [i * 100, scales[i](d[dim])])));
```

**Further Reading:**

- [Parallel Coordinates Example](https://bl.ocks.org/jasondavies/1341281)

### 5. Radar Coordinates

**Definition:**
Radar coordinates, also known as spider or star plots, display multivariate data in a circular layout. Each variable is represented by an axis radiating from the center, and data points are connected to form a polygon.

**Key Characteristics:**

- Similar to polar coordinates but with multiple axes for different variables.
- Each axis is scaled independently, often linearly.
- Effective for comparing a small number of observations across multiple variables.

**Common Visualizations:**

- **Radar Charts**: For performance analysis, skill assessments, or product comparisons.

**D3.js Tools and Functions:**

- `d3.lineRadial()`: For drawing the polygon.
- `d3.scaleLinear()`: For each variable’s axis.
- Custom calculations for axis placement.

**Example Code Snippet:**

```javascript
// Define scales
const radiusScale = d3.scaleLinear().domain([0, 10]).range([0, 200]);
const angleScale = d3
	.scaleLinear()
	.domain([0, variables.length])
	.range([0, 2 * Math.PI]);

// Create radial line
const lineRadial = d3
	.lineRadial()
	.radius((d) => radiusScale(d.value))
	.angle((d, i) => angleScale(i));

// Append path
svg
	.append('path')
	.datum(data)
	.attr('d', lineRadial)
	.attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
```

**Further Reading:**

- [Radar Chart Example](https://www.d3-graph-gallery.com/graph/radar_basic.html)

## Other Coordinate Systems

In addition to the primary systems, specialized coordinate systems may be relevant for specific use cases:

- **Barycentric Coordinates**: Used in ternary plots for three-variable data with a constant sum, common in geology or chemistry. Can be implemented with custom triangular grids.
- **Hexagonal Coordinates**: Used in hexbin plots to aggregate spatial data into hexagonal bins, supported by `d3.hexbin()`.
- **Logarithmic Coordinates**: A variation of Cartesian coordinates where one or both axes use logarithmic scales, useful for data spanning multiple orders of magnitude.

These systems can be added to the library with custom implementations or existing D3.js plugins.

## Choosing the Right Coordinate System

Selecting the appropriate coordinate system depends on the nature of your data and the story you want to tell:

- **Cartesian Coordinates**: Ideal for standard charts with clear x and y values, such as time series, comparisons, or distributions.
- **Polar Coordinates**: Suited for circular or periodic data, like directional data or time in a circular format (e.g., hours in a day).
- **Geographic Coordinates**: Essential for spatial data tied to locations on Earth, such as demographic or environmental data.
- **Parallel Coordinates**: Useful for exploring high-dimensional data, identifying patterns, and detecting outliers across multiple variables.
- **Radar Coordinates**: Effective for comparing multiple variables for a small number of observations, such as performance metrics.

By understanding your data and visualization goals, you can choose a system that enhances clarity and insight.

## Library Implementation Notes

The library provides abstractions for each coordinate system, allowing users to define data accessors, scales, and mappings. A proposed API might look like:

```javascript
const cartesian = d3
	.coordCartesian()
	.x((d) => d.x)
	.y((d) => d.y)
	.scaleX(d3.scaleLinear().domain([0, 10]).range([0, 500]))
	.scaleY(d3.scaleLinear().domain([0, 10]).range([500, 0]));

const polar = d3
	.coordPolar()
	.radius((d) => d.r)
	.angle((d) => d.theta)
	.scaleRadius(d3.scaleLinear().domain([0, 10]).range([0, 200]))
	.scaleAngle(
		d3
			.scaleLinear()
			.domain([0, 360])
			.range([0, 2 * Math.PI])
	);
```

Users can map data using `coordSystem.mapPoint(d)` and apply D3.js generators (`d3.line()`, `d3.area()`) to the resulting [x, y] coordinates. Future enhancements could include axis generators or specialized mark renderers.

## Other Coordinate Systems not covered in this project

While this library focuses on the most widely used coordinate systems, there are several additional systems that may be useful for specialized applications:

- **Barycentric Coordinates**  
  Used for representing points within triangles or simplices, common in computer graphics and geometry.

- **Hexagonal (Axial or Cube) Coordinates**  
  Ideal for visualizing data on hexagonal grids, such as board games or spatial tiling.

- **Spherical Coordinates**  
  Useful for 3D data visualization or mapping points on a sphere, often seen in astronomy and physics.

- **Cylindrical Coordinates**  
  Applied to 3D data with rotational symmetry, combining circular and linear dimensions.

- **Log-Polar Coordinates**  
  A variant of polar coordinates, useful in certain types of signal processing and pattern recognition.

- **Ternary Coordinates**  
  Used to display proportions of three variables that sum to a constant, common in chemistry and geology.

These systems are not currently implemented in this library but are important in specific domains. Future updates may consider support for some of these advanced coordinate systems based on user demand.

## Additional Resources

- [D3.js Documentation](https://d3js.org/): Official documentation for D3.js modules and APIs.
- [Fundamentals of Data Visualization](https://clauswilke.com/dataviz/): A comprehensive guide to visualization principles.
- [D3 Graph Gallery](https://www.d3-graph-gallery.com/): A collection of D3.js visualization examples.
- [Using the SVG Coordinate Space With D3.js](https://www.dashingd3js.com/svg-coordinate-space): Tutorial on SVG coordinates in D3.js.

## Conclusion

Effective data visualization relies on choosing the right coordinate system to represent data clearly and intuitively. This library empowers users to leverage Cartesian, Polar, Geographic, Parallel, and Radar coordinate systems with D3.js, facilitating the creation of diverse and insightful visualizations. By providing flexible abstractions and leveraging D3.js’s robust tools, the library supports both novice and advanced users in building custom visualizations.
