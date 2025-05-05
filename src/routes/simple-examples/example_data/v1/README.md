**1\. Cartesian:**

JSON

```
[
  {"reading_timestamp": "2025-05-05T08:00:00Z", "sensor_id": "TEMP-001", "celsius_value": 22.5},
  {"reading_timestamp": "2025-05-05T08:15:00Z", "sensor_id": "TEMP-001", "celsius_value": 22.8},
  {"reading_timestamp": "2025-05-05T08:30:00Z", "sensor_id": "TEMP-001", "celsius_value": 23.1},
  {"reading_timestamp": "2025-05-05T08:45:00Z", "sensor_id": "TEMP-002", "celsius_value": 21.9},
  {"reading_timestamp": "2025-05-05T09:00:00Z", "sensor_id": "TEMP-002", "celsius_value": 22.2}
]

```

**Use Case:** Temperature readings from two different IoT sensors over a short period.

**2\. Polar:**

JSON

```
[
  {"device_id": "WIND-005", "wind_direction_degrees": 45, "wind_speed_mps": 12.3},
  {"device_id": "WIND-005", "wind_direction_degrees": 70, "wind_speed_mps": 15.1},
  {"device_id": "WIND-006", "wind_direction_degrees": 180, "wind_speed_mps": 8.7},
  {"device_id": "WIND-006", "wind_direction_degrees": 205, "wind_speed_mps": 11.2}
]

```

**Use Case:** Wind data from two anemometers, showing wind direction and speed.

**3\. Geographic:**

JSON

```
[
  {"station_name": "Bristol Air Quality", "latitude": 51.4545, "longitude": -2.5879, "pm25_concentration_ugm3": 15.6},
  {"station_name": "London Monitoring Site", "latitude": 51.5007, "longitude": -0.1246, "pm25_concentration_ugm3": 18.2},
  {"station_name": "Cardiff Urban", "latitude": 51.4816, "longitude": -3.1791, "pm25_concentration_ugm3": 12.9}
]

```

**Use Case:** Air quality measurements (PM2.5 concentration) from different monitoring stations.

**4\. Parallel Coordinates:**

JSON

```
[
  {"process_id": "BATCH-01", "temperature_celsius": 85.2, "pressure_kpa": 155.7, "flow_rate_lpm": 32.1, "yield_percentage": 92.5},
  {"process_id": "BATCH-02", "temperature_celsius": 83.9, "pressure_kpa": 152.3, "flow_rate_lpm": 30.8, "yield_percentage": 91.1},
  {"process_id": "BATCH-03", "temperature_celsius": 86.5, "pressure_kpa": 158.9, "flow_rate_lpm": 33.5, "yield_percentage": 93.2}
]

```

**Use Case:** Readings from sensors monitoring different parameters in a manufacturing process, aiming to understand their relationship with the final product yield.

**5\. Radar:**

JSON

```
[
  {"system_component": "Engine-A", "vibration_level": 0.78, "noise_db": 82.1, "power_output_kw": 155.3, "fuel_consumption_lph": 18.7, "efficiency_rating": 0.91},
  {"system_component": "Engine-B", "vibration_level": 0.65, "noise_db": 79.5, "power_output_kw": 162.8, "fuel_consumption_lph": 19.5, "efficiency_rating": 0.88}
]

```

**Use Case:** Comparing the performance characteristics of different engine components across several operational metrics.

**6\. Ternary:**

JSON

```
[
  {"soil_sample_id": "FIELD-A-01", "sand_percent": 0.70, "silt_percent": 0.20, "clay_percent": 0.10, "water_retention_capacity": 0.65},
  {"soil_sample_id": "FIELD-B-03", "sand_percent": 0.35, "silt_percent": 0.45, "clay_percent": 0.20, "water_retention_capacity": 0.78},
  {"soil_sample_id": "FIELD-C-02", "sand_percent": 0.15, "silt_percent": 0.30, "clay_percent": 0.55, "water_retention_capacity": 0.85}
]

```

**Use Case:** Analyzing the composition of different soil samples (proportions of sand, silt, and clay) and their corresponding water retention capacity.

**7\. Hexbin:**

JSON

```
[
  {"latitude": 51.45, "longitude": -2.59, "event_count": 7},
  {"latitude": 51.46, "longitude": -2.58, "event_count": 12},
  {"latitude": 51.455, "longitude": -2.585, "event_count": 9},
  {"latitude": 51.47, "longitude": -2.60, "event_count": 5},
  {"latitude": 51.465, "longitude": -2.575, "event_count": 15}
  // ... more data points representing locations of events
]

```

**Use Case:** Aggregating the number of reported incidents (e.g., traffic events, sensor triggers) in different hexagonal areas of a city.

**8\. Log-Polar:**

JSON

```
[
  {"bearing_degrees": 25, "distance_meters": 15, "signal_strength_dbm": -60},
  {"bearing_degrees": 50, "distance_meters": 40, "signal_strength_dbm": -75},
  {"bearing_degrees": 80, "distance_meters": 5, "signal_strength_dbm": -55},
  {"bearing_degrees": 110, "distance_meters": 20, "signal_strength_dbm": -68}
]

```

**Use Case:** Analyzing the signal strength of a wireless network from a central access point, where distance might have a logarithmic effect on signal attenuation.

**9\. Barycentric:**

JSON

```
[
  {"nutrient_a_proportion": 0.55, "nutrient_b_proportion": 0.30, "nutrient_c_proportion": 0.15, "growth_rate": 0.82},
  {"nutrient_a_proportion": 0.40, "nutrient_b_proportion": 0.45, "nutrient_c_proportion": 0.15, "growth_rate": 0.75},
  {"nutrient_a_proportion": 0.20, "nutrient_b_proportion": 0.35, "nutrient_c_proportion": 0.45, "growth_rate": 0.68}
]

```

**Use Case:** Studying the effect of different nutrient mixtures on the growth rate of a plant or organism, where the proportions of the three nutrients sum to one.

**10\. Spherical:**

JSON

```
[
  {"latitude_degrees": 35, "longitude_degrees": -100, "magnetic_field_strength_ut": 48.5},
  {"latitude_degrees": -20, "longitude_degrees": 150, "magnetic_field_strength_ut": 52.1},
  {"latitude_degrees": 70, "longitude_degrees": 20, "magnetic_field_strength_ut": 45.9}
]

```

**Use Case:** Visualizing the strength of the Earth's magnetic field at different geographic locations (approximated as points on a sphere).

**11\. Oblique:**

JSON

```
[
  {"strain_x_microns": 120, "strain_y_microns": 85, "material_strength_mpa": 250},
  {"strain_x_microns": 95, "strain_y_microns": 110, "material_strength_mpa": 235},
  {"strain_x_microns": 150, "strain_y_microns": 70, "material_strength_mpa": 265}
]

```

**Use Case:** Analyzing material testing data where strain is measured along two non-orthogonal axes, and relating these measurements to the material's overall strength.

**12\. Affine:**

JSON

```
[
  {"image_pixel_u": 50, "image_pixel_v": 100, "transformed_u": 55, "transformed_v": 120},
  {"image_pixel_u": 120, "image_pixel_v": 30, "transformed_u": 130, "transformed_v": 50},
  {"image_pixel_u": 80, "image_pixel_v": 150, "transformed_u": 90, "transformed_v": 170}
]

```

**Use Case:** Tracking the transformation of pixel coordinates in an image processing pipeline, demonstrating how an affine transformation maps original pixel locations to new ones.
