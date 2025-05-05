# Sample Datasets for Multi-Coordinate System D3.js Library

## Introduction

To support the development of your multi-coordinate system data visualization library with [D3.js](https://d3js.org/), this document provides small, tailored sample datasets for each of the five primary coordinate systems: Cartesian, Polar, Geographic, Parallel, and Radar. These datasets are designed to be simple, realistic, and directly compatible with D3.js, enabling you to test and demonstrate your library’s functionality across various visualization types. Each dataset is presented in JSON format, accompanied by a description of its structure, intended use, and example D3.js integration.

## Dataset Details

The following sections detail each dataset, including its purpose, structure, and how it can be used within your D3.js library.

### 1. Cartesian Coordinates

**Purpose:**
This dataset represents a mathematical function, y = x², for x ranging from 0 to 5. It is ideal for testing scatter plots, line charts, or area charts in a Cartesian coordinate system, demonstrating a clear quadratic relationship.

**Structure:**
An array of objects, each with `x` and `y` properties representing coordinates on the x and y axes, respectively.

**Dataset:**

```json
[
	{ "x": 0, "y": 0 },
	{ "x": 1, "y": 1 },
	{ "x": 2, "y": 4 },
	{ "x": 3, "y": 9 },
	{ "x": 4, "y": 16 },
	{ "x": 5, "y": 25 }
]
```

**Use Case:**

- **Visualization**: Create a scatter plot to show the quadratic relationship or a line chart to emphasize the curve.
- **D3.js Integration**:
  ```javascript
  const cartesian = d3
  	.coordCartesian()
  	.x((d) => d.x)
  	.y((d) => d.y)
  	.scaleX(d3.scaleLinear().domain([0, 5]).range([0, 500]))
  	.scaleY(d3.scaleLinear().domain([0, 25]).range([500, 0]));
  svg
  	.selectAll('circle')
  	.data(data)
  	.enter()
  	.append('circle')
  	.attr('cx', (d) => cartesian.mapPoint(d)[0])
  	.attr('cy', (d) => cartesian.mapPoint(d)[1])
  	.attr('r', 5);
  ```

**Notes:**

- The dataset is synthetic, ensuring a predictable pattern for testing.
- Suitable for verifying scale and axis rendering in your library.

### 2. Polar Coordinates

**Purpose:**
This dataset provides points defined by radius (r) and angle (theta in degrees), simulating directional data like wind directions or cyclic patterns. It is suitable for polar plots, such as rose diagrams or circular scatter plots.

**Structure:**
An array of objects, each with `r` (radius) and `theta` (angle in degrees) properties.

**Dataset:**

```json
[
	{ "r": 1, "theta": 0 },
	{ "r": 1.5, "theta": 45 },
	{ "r": 2, "theta": 90 },
	{ "r": 1.8, "theta": 135 },
	{ "r": 1.2, "theta": 180 },
	{ "r": 0.8, "theta": 225 },
	{ "r": 1.3, "theta": 270 },
	{ "r": 1.7, "theta": 315 }
]
```

**Use Case:**

- **Visualization**: Plot as a polar scatter plot or connect points for a closed shape to show cyclic behavior.
- **D3.js Integration**:
  ```javascript
  const polar = d3
  	.coordPolar()
  	.radius((d) => d.r)
  	.angle((d) => d.theta)
  	.scaleRadius(d3.scaleLinear().domain([0, 2]).range([0, 200]))
  	.scaleAngle(
  		d3
  			.scaleLinear()
  			.domain([0, 360])
  			.range([0, 2 * Math.PI])
  	);
  svg
  	.selectAll('circle')
  	.data(data)
  	.enter()
  	.append('circle')
  	.attr('cx', (d) => polar.mapPoint(d)[0])
  	.attr('cy', (d) => polar.mapPoint(d)[1])
  	.attr('r', 5)
  	.attr('transform', 'translate(250, 250)');
  ```

**Notes:**

- Theta is in degrees for simplicity; your library can convert to radians if needed.
- Useful for testing radial and angular scale transformations.

### 3. Geographic Coordinates

**Purpose:**
This GeoJSON dataset includes coordinates of four major cities, ideal for testing map-based visualizations like point maps or simple geographic scatter plots.

**Structure:**
A GeoJSON `FeatureCollection` with `Point` features, each containing `[longitude, latitude]` coordinates and a `name` property.

**Dataset:**

```json
{
	"type": "FeatureCollection",
	"features": [
		{
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [-74.006, 40.7128]
			},
			"properties": {
				"name": "New York"
			}
		},
		{
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [-118.2437, 34.0522]
			},
			"properties": {
				"name": "Los Angeles"
			}
		},
		{
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [2.3522, 48.8566]
			},
			"properties": {
				"name": "Paris"
			}
		},
		{
			"type": "Feature",
			"geometry": {
				"type": "Point",
				"coordinates": [139.6917, 35.6895]
			},
			"properties": {
				"name": "Tokyo"
			}
		}
	]
}
```

**Use Case:**

- **Visualization**: Display city locations on a world map using a projection like Mercator.
- **D3.js Integration**:
  ```javascript
  const geo = d3
  	.coordGeo()
  	.longitude((d) => d.geometry.coordinates[0])
  	.latitude((d) => d.geometry.coordinates[1])
  	.projection(d3.geoMercator().fitSize([500, 500], data));
  svg
  	.selectAll('circle')
  	.data(data.features)
  	.enter()
  	.append('circle')
  	.attr('cx', (d) => geo.mapPoint(d)[0])
  	.attr('cy', (d) => geo.mapPoint(d)[1])
  	.attr('r', 5);
  ```

**Notes:**

- Coordinates are sourced from reliable geographic data ([Latitude and Longitude Finder](https://www.latlong.net/)).
- Suitable for testing projection accuracy and GeoJSON parsing.

### 4. Parallel Coordinates

**Purpose:**
This dataset is a subset of the Iris dataset, containing measurements of sepal and petal dimensions for five Iris setosa flowers. It is designed for parallel coordinates plots to visualize multivariate relationships.

**Structure:**
An array of objects, each with four numerical properties: `sepal_length`, `sepal_width`, `petal_length`, and `petal_width` (in centimeters).

**Dataset:**

```json
[
	{ "sepal_length": 5.1, "sepal_width": 3.5, "petal_length": 1.4, "petal_width": 0.2 },
	{ "sepal_length": 4.9, "sepal_width": 3.0, "petal_length": 1.4, "petal_width": 0.2 },
	{ "sepal_length": 4.7, "sepal_width": 3.2, "petal_length": 1.3, "petal_width": 0.2 },
	{ "sepal_length": 4.6, "sepal_width": 3.1, "petal_length": 1.5, "petal_width": 0.2 },
	{ "sepal_length": 5.0, "sepal_width": 3.6, "petal_length": 1.4, "petal_width": 0.2 }
]
```

**Use Case:**

- **Visualization**: Create a parallel coordinates plot to explore correlations between flower measurements.
- **D3.js Integration**:
  ```javascript
  const dimensions = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'];
  const scales = dimensions.map((dim) =>
  	d3
  		.scaleLinear()
  		.domain(d3.extent(data, (d) => d[dim]))
  		.range([500, 0])
  );
  svg
  	.selectAll('.line')
  	.data(data)
  	.enter()
  	.append('path')
  	.attr('d', (d) => d3.line()(dimensions.map((dim, i) => [i * 100, scales[i](d[dim])])));
  ```

**Notes:**

- Sourced from the [Iris Dataset](https://archive.ics.uci.edu/ml/datasets/iris).
- Compact size ensures quick rendering for testing.

### 5. Radar Coordinates

**Purpose:**
This dataset provides mean feature values for three Iris species, formatted for radar charts to compare multivariate characteristics across species.

**Structure:**
An array of objects, each representing a species with a `species` name and four numerical properties: `sepal_length`, `sepal_width`, `petal_length`, and `petal_width` (in centimeters).

**Dataset:**

```json
[
	{
		"species": "setosa",
		"sepal_length": 5.006,
		"sepal_width": 3.428,
		"petal_length": 1.462,
		"petal_width": 0.246
	},
	{
		"species": "versicolor",
		"sepal_length": 5.936,
		"sepal_width": 2.77,
		"petal_length": 4.26,
		"petal_width": 1.326
	},
	{
		"species": "virginica",
		"sepal_length": 6.588,
		"sepal_width": 2.974,
		"petal_length": 5.552,
		"petal_width": 2.026
	}
]
```

**Use Case:**

- **Visualization**: Create a radar chart to compare feature profiles of Iris species.
- **D3.js Integration**:
  ```javascript
  const radar = d3
  	.coordRadar()
  	.variables(['sepal_length', 'sepal_width', 'petal_length', 'petal_width'])
  	.scale(d3.scaleLinear().domain([0, 7]).range([0, 200]))
  	.angle(
  		d3
  			.scaleLinear()
  			.domain([0, 4])
  			.range([0, 2 * Math.PI])
  	);
  svg
  	.selectAll('.radar')
  	.data(data)
  	.enter()
  	.append('path')
  	.attr('d', (d) =>
  		d3.lineRadial()(radar.variables().map((v, i) => [radar.angle(i), radar.scale(d[v])]))
  	);
  ```

**Notes:**

- Mean values are approximate, derived from the Iris dataset for simplicity.
- Ideal for testing circular multivariate visualizations.

## Additional Coordinate Systems (Optional)

For completeness, datasets for additional coordinate systems mentioned previously are provided below. These can be included in your library as needed.

### Barycentric Coordinates

**Purpose:**
This dataset represents compositional data with three variables summing to 1, suitable for ternary plots in barycentric coordinates, common in fields like geology.

**Structure:**
An array of objects, each with `var1`, `var2`, and `var3` properties that sum to 1.

**Dataset:**

```json
[
	{ "var1": 0.2, "var2": 0.3, "var3": 0.5 },
	{ "var1": 0.4, "var2": 0.4, "var3": 0.2 },
	{ "var1": 0.1, "var2": 0.6, "var3": 0.3 }
]
```

**Use Case:**

- **Visualization**: Plot points in a ternary diagram to show compositional relationships.
- **D3.js Integration**: Requires custom triangular coordinate mapping, converting barycentric coordinates to Cartesian for SVG rendering.

### Hexagonal Coordinates

**Purpose:**
This dataset provides spatial points for binning into a hexagonal grid, useful for hexbin plots to visualize density.

**Structure:**
An array of objects with `x` and `y` properties representing spatial coordinates.

**Dataset:**

```json
[
	{ "x": 10, "y": 20 },
	{ "x": 15, "y": 25 },
	{ "x": 12, "y": 22 },
	{ "x": 18, "y": 28 },
	{ "x": 14, "y": 21 }
]
```

**Use Case:**

- **Visualization**: Use `d3.hexbin()` to aggregate points into hexagons.
- **D3.js Integration**:
  ```javascript
  const hexbin = d3.hexbin().size([500, 500]).radius(20);
  svg
  	.append('g')
  	.selectAll('path')
  	.data(hexbin(data.map((d) => [d.x, d.y])))
  	.enter()
  	.append('path')
  	.attr('d', hexbin.hexagon());
  ```

### Treemap Coordinates

**Purpose:**
This hierarchical dataset represents a tree structure with values, suitable for treemap visualizations to show proportions.

**Structure:**
A JSON object with a `name` and `children` array, where leaf nodes have a `value` property.

**Dataset:**

```json
{
	"name": "root",
	"children": [
		{ "name": "child1", "value": 10 },
		{ "name": "child2", "value": 20 },
		{
			"name": "child3",
			"children": [
				{ "name": "grandchild1", "value": 5 },
				{ "name": "grandchild2", "value": 15 }
			]
		}
	]
}
```

**Use Case:**

- **Visualization**: Create a treemap to visualize hierarchical data proportions.
- **D3.js Integration**:
  ```javascript
  const treemap = d3.treemap().size([500, 500]);
  const root = d3.hierarchy(data).sum((d) => d.value);
  svg
  	.selectAll('rect')
  	.data(treemap(root).leaves())
  	.enter()
  	.append('rect')
  	.attr('x', (d) => d.x0)
  	.attr('y', (d) => d.y0)
  	.attr('width', (d) => d.x1 - d.x0)
  	.attr('height', (d) => d.y1 - d.y0);
  ```

## Implementation Notes

To use these datasets in your D3.js library:

- **Load Data**: Use `d3.json()` for GeoJSON or direct array assignment for others.
- **Configure Accessors**: Align with your library’s API, e.g., `.x(d => d.x)` for Cartesian, `.longitude(d => d.geometry.coordinates[0])` for Geographic.
- **Test Visualizations**: Apply D3.js generators (`d3.line()`, `d3.geoPath()`, etc.) to the mapped coordinates.
- **Validate Scales**: Ensure scales and projections match the data domains and visualization canvas size.

These datasets are compact to facilitate quick testing while being representative of real-world use cases. For example, the Iris dataset subsets are standard in data visualization tutorials, and the city coordinates are verified for accuracy.

## Choosing Datasets for Testing

When selecting or creating datasets for your library:

- **Match Data to Coordinate System**: Ensure the data structure aligns with the coordinate system’s requirements (e.g., [lon, lat] for Geographic, multiple dimensions for Parallel).
- **Keep It Small**: Use 3–8 data points to avoid performance issues during testing.
- **Include Meaningful Properties**: Add properties like `name` or `species` to enable interactive features like tooltips.
- **Verify Compatibility**: Test datasets with your library’s mapping functions to confirm correct rendering.

## Additional Resources

- [D3.js Documentation](https://d3js.org/): Official guide for D3.js modules and APIs.
- [Iris Dataset](https://archive.ics.uci.edu/ml/datasets/iris): Source for Parallel and Radar datasets.
- [Latitude and Longitude Finder](https://www.latlong.net/): Tool for verifying geographic coordinates.
- [D3 Graph Gallery](https://www.d3-graph-gallery.com/): Examples of D3.js visualizations with sample data.

## Conclusion

These sample datasets provide a robust starting point for testing your multi-coordinate system D3.js library. By covering Cartesian, Polar, Geographic, Parallel, and Radar coordinates, along with optional datasets for Barycentric, Hexagonal, and Treemap systems, you can verify your library’s functionality across a wide range of visualization types. The datasets are designed to be easily integrated with your library’s API, leveraging D3.js’s data-binding and rendering capabilities to create effective and insightful visualizations.
