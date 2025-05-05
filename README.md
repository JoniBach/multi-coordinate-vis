# Multi-Coordinate Visualization Project

This project is a Svelte-based interactive data visualization suite demonstrating a variety of coordinate systems using D3.js. It is designed to help users understand and compare how different coordinate systems work in practice, with real data and live visualizations.

## Features

- **Multiple Coordinate System Demos:**
  - Cartesian
  - Polar
  - Geographic
  - Parallel Coordinates
  - Radar
  - Ternary
  - Hexbin
  - Log-Polar
  - Barycentric
  - Spherical
  - Oblique
  - Affine

- **Component-Based Architecture:**
  - Each coordinate system is implemented as a standalone Svelte component.
  - Easily extendable for new coordinate systems or visualizations.

- **Type-Safe Data Validation:**
  - Uses [Zod](https://github.com/colinhacks/zod) schemas for each dataset to ensure correctness and safety.

- **Modern Svelte Syntax:**
  - Components use Svelte 5 runes and best practices for props and reactivity.

- **D3.js Integration:**
  - All visualizations are rendered with D3.js, leveraging its power for scales, axes, projections, and shapes.

## File Structure

- `src/routes/simple-examples/+page.svelte` — Main page, imports all demo components and passes data/schema props.
- `src/routes/simple-examples/components/` — Svelte components for each coordinate system demo.
- `src/routes/simple-examples/data/` — Example data files (JSON) for each demo.
- `src/routes/simple-examples/schema/` — Zod schemas for validating each data file.

## Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the dev server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**
   Visit the provided localhost link to explore the demos.

## Purpose

This project is intended as both a learning tool and a reference for:
- Understanding the practical differences between coordinate systems.
- Exploring D3.js visualizations in Svelte.
- Structuring data-driven Svelte applications with strong type safety.

---

Feel free to contribute new demos or suggest improvements!