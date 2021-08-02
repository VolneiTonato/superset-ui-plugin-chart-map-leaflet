"use strict";

exports.__esModule = true;
exports.default = MapDeck;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _core = require("@superset-ui/core");

var _core2 = require("@deck.gl/core");

var _layers = require("@deck.gl/layers");

var _reactLeaflet = require("react-leaflet");

var _lodash = require("lodash");

var _server = require("react-dom/server");

var _maplibreGl = _interopRequireDefault(require("maplibre-gl"));

var turf = _interopRequireWildcard(require("@turf/turf"));

var _hooks = require("../hooks");

var _react2 = require("@emotion/react");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable @typescript-eslint/no-use-before-define */

/* eslint-disable dot-notation */

/* eslint-disable radix */

/* eslint-disable arrow-body-style */

/* eslint-disable no-await-in-loop */

/* eslint-disable no-plusplus */

/* eslint-disable no-restricted-syntax */

/* eslint-disable no-param-reassign */

/* eslint-disable prefer-object-spread */

/* eslint-disable prefer-destructuring */

/* eslint-disable prettier/prettier */
// @ts-ignore
// @ts-nocheck
const PIN = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAuCAYAAABJcBuEAAAACXBIWXMAAAEMAAABDAGWp/hQAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAxRJREFUWIW9WDtrFFEU/s6uxsJdhJVAsEiCEh9IbFPYipXa+BcsRFAQbMRHJQqWgoVEtBXEJqCNKFY2AQsFHyFiNCaa+MhG16xGM5/FzKx37t65j9ldv2Z3zj33fN/c1zl3gACQPEVyjmTELCKSSyTvkzxEshwS10Xan5CG4iHJSqfkkwWIdVyzcUgOcQ3A57z2AvgBYEBEGnpDyUA+AuBLF8kBYCOAZZL9ekOGhOQmAPXA4NTjWBABqIhIM09AFBCsKBoiUk0fWlNAcjKQvAHgBYDniOfYFxWSVzMWkjXPFR2RPEnDPidZJnmO2TNCPy9UVNTO7z3IZ0zEOULmPeJNqJ2c5AFDnMacdQUFgBLJ465YALaFCgAwnPSF8quL3O8z/McMHcskx0nWSX4jeYPmdXHUEfuu0L311onImkoOYAVAn+a3CqAqIquaCOPbJ1guOcgXVPIEdwzkSGwTBvtiqsXQVm07ijU8M9gOWPz3GWyvLP4llwDTAWPrY2r7YyNwCdhusL2x+M8YbMMWf4pjkUQiklndJLcAmMvxHxSRWc3ftsiXSgB+WgSUSI6qBhGZB7ALQFMxNwHsMZCPWcgBYAokHzj2am56JtlH0rQj0vZ6EiMvJ1wCyYMOASQ5bnmLPPLLHnG3ps4+uBJAftojXqR2WPEU8Zpx1ZRHXCM5pZJYYj0BkgVC8gyACwEjvADgFoCnyfMYgMMANgfE2Csij1srlLRux26jtb3Vg2i6w6AhL3A9/aOOwACADx2K8MWGNGu2RkBEPiJOs73GPTVl62X5EMzneTdRVW9ImWQkIm8RVmKH4rZ+PWs7pxlfnxZ1exdAAOv1AqctHYvIJwAveyDgrKG6yr0dl+EoJAKRuY6pMBYkidIjXRSwo1Avkt89c4QN1kxqvYwyzvW/CqmP8VtEcusFwFETJgfG+Q4E7O6g7z+QbBQY+os+sb2+BxSYinciMuTj6CrLAbSmYtTpGCMCMOLpGwaSNz2GfmdPyBURXy3kJ3pKrohYM5A/+i/kiYCKRp53U+qpiMGEfJodfJz+Cz2d8KTPSP0uAAAAAElFTkSuQmCC';
const Canvas = _core.styled.canvas`
    position: absolute;
    z-index: 999;
    top: 0;
    left: 0;
    height: ${({
  height
}) => height};
    width: ${({
  width
}) => width};
`;
const ICON_MAPPING = {
  marker: {
    x: 0,
    y: 0,
    width: 32,
    height: 46,
    mask: true
  }
};

function templateMount(label, value) {
  return (0, _react2.jsx)("p", null, (0, _react2.jsx)("span", null, (0, _react2.jsx)("strong", null, label), ":\xA0"), (0, _react2.jsx)("span", null, value));
}

function tratarDadosPoints(data) {
  const features = [];
  data.forEach(row => {
    if (row.LAT && row.LON) {
      row.Color = (0, _hooks.generateRandomRGB)('array');
      features.push(turf.feature({
        type: 'Point',
        coordinates: [row.LON, row.LAT]
      }, row));
    }
  });
  return turf.featureCollection(features);
}

function tratarDadosMultipoints(data) {
  const features = [];
  data.forEach(row => {
    if (row.geojson) {
      row.Color = (0, _hooks.generateRandomRGB)('array');
      const properties = Object.assign({}, row);
      delete properties.geojson;
      const poly = turf.feature(JSON.parse(row.geojson), properties);
      features.push(turf.rewind(poly));
    }
  });
  return turf.featureCollection(features);
}

function dadosCities(cliente) {
  return (0, _react2.jsx)("div", {
    style: {
      textAlign: 'left',
      fontSize: '14px'
    }
  }, templateMount('Street', (0, _lodash.get)(cliente, 'STREET')), templateMount('Number', (0, _lodash.get)(cliente, 'NUMBER')), templateMount('City', (0, _lodash.get)(cliente, 'CITY')), templateMount('Post Code', (0, _lodash.get)(cliente, 'POSTCODE')), templateMount('LAT', (0, _lodash.get)(cliente, 'LAT')), templateMount('LON', (0, _lodash.get)(cliente, 'LON')));
}

function dadosMalhas(cliente) {
  return (0, _react2.jsx)("div", {
    style: {
      textAlign: 'left',
      fontSize: '14px'
    }
  }, templateMount('City', (0, _lodash.get)(cliente, 'CITY')));
}

function updateTooltip({
  x,
  y,
  object
}) {
  if (object) {
    let html = '';
    if (object != null && object.properties['STREET']) html = (0, _server.renderToString)(dadosCities(object.properties));else {
      html = (0, _server.renderToString)(dadosMalhas(object.properties));
    }
    return {
      html: `${html}`,
      style: {
        color: '#fff',
        backgroundColor: '#000',
        fontSize: '0.8em',
        zIndex: 10000
      }
    };
  }

  return null;
}

const getViewState = map => {
  return {
    longitude: map.getCenter().lng,
    latitude: map.getCenter().lat,
    zoom: map.getZoom() - 1,
    pitch: 0,
    bearing: 0
  };
};

const getMalhasByCity = async filter_extra => {
  if (!Array.isArray(filter_extra)) return [];
  const custom_filter = (0, _lodash.filter)(filter_extra.map(row => {
    if (['CITY', 'REGION'].includes(row.col)) return row;
    return null;
  }));
  if (custom_filter.length === 0) return [];
  const {
    result
  } = await _core.ApiV1.getChartData({
    datasource: {
      id: 40,
      type: _core.DatasourceType.Table
    },
    force: true,
    result_format: 'json',
    result_type: 'results',
    queries: [{
      columns: ['REGION', 'CITY', 'geojson'],
      groupby: [],
      filters: custom_filter,
      row_limit: 50000,
      metrics: []
    }]
  });
  const data = result[0].data;
  if (!data) return null;
  return data;
};

function MapDeck({
  height,
  width,
  points,
  datasource,
  formData,
  totalRegistros,
  hash
}) {
  const divDeck = (0, _react.useRef)(null);
  const [deck, setDeck] = (0, _react.useState)(null);
  const map = (0, _reactLeaflet.useMap)();
  const data = (0, _react.useRef)({
    malhas: null,
    points: null,
    markers: null
  });
  const breakSearch = (0, _react.useRef)(false);
  const typeZoom = (0, _react.useRef)({
    zoomPoints: 0
  });
  const colors = (0, _react.useRef)({
    lines: [255, 255, 255],
    background: (0, _hooks.generateRandomRGB)('array'),
    hover: (0, _hooks.generateRandomRGB)('array')
  });
  const visibled = (0, _react.useRef)({
    malhas: true,
    points: true
  });
  const isRunning = (0, _react.useRef)(false);
  const totalRef = (0, _react.useRef)(null);
  const zoomRef = (0, _react.useRef)(null);
  (0, _reactLeaflet.useMapEvents)({
    move: e => {
      updateDeckViewHandle({});
    },
    zoomend: e => {
      changeZoom(e.target.getZoom());
    },
    overlayremove: e => {
      visibled.current[e.name] = false;
      updateHande({
        force: true
      });
    },
    overlayadd: e => {
      visibled.current[e.name] = true;
      updateHande({
        force: true
      });
    }
  });
  const updateDeckViewHandle = (0, _react.useCallback)(({
    layers
  }) => {
    if (!map || !deck) return;
    const viewState = getViewState(map);
    deck.setProps({
      viewState
    });
    if (layers) deck.setProps({
      layers
    });
    deck.redraw(true);
  }, [deck, map]);
  const updateHande = (0, _react.useCallback)(async param => {
    let change = (param == null ? void 0 : param.force) || false;
    const callbackPoints = (param == null ? void 0 : param.callbackPoints) || true;
    const zoom = zoomRef.current || 0;

    if (!data.current.points) {
      data.current.points = tratarDadosPoints(points);
      change = true;
    }

    if (!data.current.malhas) {
      data.current.malhas = tratarDadosMultipoints(await getMalhasByCity(formData == null ? void 0 : formData.extraFilters));
      change = true;
    }

    if (change === false) {
      return;
    }

    const customLayers = {
      layerMalhas: null,
      layerPoints: null
    }; // https://github.com/visgl/deck.gl/blob/8.4-release/examples/website/highway/app.js

    customLayers.layerMalhas = new _layers.GeoJsonLayer({
      id: 'geo-malhas',
      data: data.current.malhas.features,
      lineWidthMinPixels: 0.5,
      parameters: {
        depthTest: false
      },
      stroked: true,
      filled: true,
      visible: visibled.current.malhas,
      pickable: true,
      getLineWidth: 10,
      getFillColor: f => colors.current.background,
      getLineColor: colors.current.lines,
      autoHighlight: true,
      highlightColor: colors.current.hover
    });

    if (zoom < 14) {
      customLayers.layerPoints = new _layers.ScatterplotLayer({
        id: 'point-layer',
        opacity: 0.8,
        stroked: true,
        filled: true,
        pickable: true,
        radiusScale: 6,
        radiusMinPixels: 1,
        radiusMaxPixels: 100,
        visible: visibled.current.points,
        lineWidthMinPixels: 6,
        data: data.current.points.features,
        getPosition: d => {
          return [Number(d.geometry.coordinates[0]), Number(d.geometry.coordinates[1])];
        },
        getRadius: 10,
        getFillColor: d => d.properties.Color,
        getLineColor: d => d.properties.Color
      });
    }

    if (zoom >= 14) {
      customLayers.layerMarker = new _layers.IconLayer({
        id: 'icon-layer',
        data: data.current.points.features,
        pickable: true,
        iconAtlas: PIN,
        iconMapping: ICON_MAPPING,
        getIcon: d => 'marker',
        sizeScale: 6,
        sizeMinPixels: 6,
        visible: visibled.current.points,
        getPosition: d => {
          return [Number(d.geometry.coordinates[0]), Number(d.geometry.coordinates[1])];
        },
        getSize: d => 10,
        getColor: d => d.properties.Color,
        updateTriggers: {
          getSize: zoom
        }
      });
    }

    if (callbackPoints) updatePoints();
    updateDeckViewHandle({
      layers: Object.values(customLayers)
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, points, updateDeckViewHandle]);
  const changeZoom = (0, _react.useCallback)(zoom => {
    let force = false;
    zoomRef.current = zoom;

    if (!typeZoom.current.zoomPoints) {
      typeZoom.current.zoomPoints = zoom;
      force = true;
    } else if (typeZoom.current.zoomPoints >= 14 && zoom < 14) {
      typeZoom.current.zoomPoints = zoom;
      force = true;
    } else if (typeZoom.current.zoomPoints < 14 && zoom >= 14) {
      typeZoom.current.zoomPoints = zoom;
      force = true;
    }

    updateHande({
      force
    });
  }, [updateHande]);
  const getData = (0, _react.useCallback)(async (offset = 0) => {
    const {
      result
    } = await _core.ApiV1.getChartData({
      datasource: {
        id: datasource.id,
        type: _core.DatasourceType.Table
      },
      force: true,
      result_format: 'json',
      result_type: 'results',
      queries: [{
        columns: formData.allColumns,
        groupby: [],
        filters: formData.extraFilters,
        row_offset: offset || 0,
        row_limit: formData.rowLimit,
        metrics: formData.metrics
      }]
    });
    const data = result[0].data;
    if (!data) return true;
    return data;
  }, [datasource, formData]);
  const updatePoints = (0, _react.useCallback)(async () => {
    if (isRunning.current) return true;
    const total_registros = totalRegistros;
    if (!isRunning.current) isRunning.current = true;
    if (totalRef.current === total_registros) return true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    const limit = formData.rowLimit;
    const total_pages = parseInt(Math.ceil(parseInt(total_registros) / limit));
    const range = Array.from(Array(total_pages).keys());
    delete range[0];

    const populate = async () => {
      let tentativas = 0;

      for (let page of range) {
        try {
          if (breakSearch.current === true) break;
          page++;
          await new Promise(resolve => setTimeout(resolve, 1000));
          const offset = page * limit - limit;
          let my_features = tratarDadosPoints(await getData(offset));
          if (!data.current.points) data.current.points = my_features;else data.current.points.features = [...data.current.points.features, ...my_features.features];
          my_features = null;
          totalRef.current = data.current.points.features.length;
          updateHande({
            force: true,
            callbackPoints: false
          });
        } catch (err) {
          if (tentativas > 3) throw new Error(err);
          tentativas++;
        }
      }

      return true;
    };

    populate();
    return true;
  }, [formData, getData, totalRegistros, updateHande]);
  (0, _react.useEffect)(() => {
    if (!map || !divDeck.current) return;
    if (zoomRef.current === map.getZoom()) return;
    zoomRef.current = map.getZoom();
    const map_deck = new _core2.Deck({
      canvas: divDeck.current,
      viewState: getViewState(map),
      controller: true,
      layers: [],
      map: _maplibreGl.default,
      views: [new _core2.MapView({
        repeat: false
      })],
      getTooltip: updateTooltip
    });
    setDeck(map_deck);
  }, [map, divDeck]);
  (0, _react.useEffect)(() => {
    if (deck) updateHande({});
  }, [deck, updateHande]);
  (0, _react.useEffect)(() => {
    return () => {
      divDeck.current = null;
      zoomRef.current = null;
      data.current = null;
      breakSearch.current = true;
      colors.current = null;
      setDeck(null);
    };
  }, []);
  return (0, _react2.jsx)(Canvas, {
    height: height,
    width: width,
    key: hash,
    ref: divDeck
  });
}

MapDeck.propTypes = {
  points: _propTypes.default.arrayOf(_propTypes.default.any).isRequired,
  height: _propTypes.default.number.isRequired,
  width: _propTypes.default.number.isRequired,
  totalRegistros: _propTypes.default.number.isRequired,
  hash: _propTypes.default.string.isRequired
};