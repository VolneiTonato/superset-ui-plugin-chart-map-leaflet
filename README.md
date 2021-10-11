## @superset-ui/plugin-chart-map-leaflet


## Example

[Video](https://drive.google.com/file/d/1BlFS9FGVuhFHNrw7S2U4S5vYGd_5c1Cb/view?usp=sharing)


This plugin provides Map Leaflet for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import MapLeafletChartPlugin from '@superset-ui/plugin-chart-map-leaflet';



new MapLeafletChartPlugin()
  .configure({ key: 'map-leaflet' })
  .register();
```

Then use it via `SuperChart`. See [storybook](https://apache-superset.github.io/superset-ui/?selectedKind=plugin-chart-map-leaflet) for more details.

```js
<SuperChart
  chartType="map-leaflet"
  width={600}
  height={600}
  formData={...}
  queriesData={[{
    data: {...},
  }]}
/>
```

### File structure generated

```
├── package.json
├── README.md
├── tsconfig.json
├── src
│   ├── MapLeaflet.tsx
│   ├── images
│   │   └── thumbnail.png
│   ├── index.ts
│   ├── plugin
│   │   ├── buildQuery.ts
│   │   ├── controlPanel.ts
│   │   ├── index.ts
│   │   └── transformProps.ts
│   └── types.ts
├── test
│   └── index.test.ts
└── types
    └── external.d.ts
```
