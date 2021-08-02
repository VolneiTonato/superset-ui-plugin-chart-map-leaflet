"use strict";

exports.__esModule = true;
exports.default = MapLeaflet;

var _react = _interopRequireWildcard(require("react"));

var _core = require("@superset-ui/core");

var _leaflet = _interopRequireDefault(require("leaflet"));

var _reactLeaflet = require("react-leaflet");

var _uuid = require("uuid");

var _MapDeck = _interopRequireDefault(require("./components/MapDeck"));

require("leaflet/dist/leaflet.css");

var _react2 = require("@emotion/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable import/order */

/* eslint-disable arrow-body-style */

/* eslint-disable prettier/prettier */

/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
// @ts-ignore
// @ts-nocheck
const Container = _core.styled.div`
 position: relative;    

 & > * {
     position: relative;
     top: 0;
     left: 0;
     height: ${({
  height
}) => height};
     width: ${({
  width
}) => width};
 }

 
 .leaflet-control-zoom > .leaflet-bar > .leaflet-control{
     z-index: 10000
 }

 .leaflet-control-layers-list{ 
     width:auto;
     background-position:3px 50% ;
     padding:3px;
     text-decoration:none;
     line-height:36px;
     text-align: left;
     text-transform: uppercase;
   }

`;

function MapLeaflet(props) {
  const [isReady, setIsReady] = (0, _react.useState)(false);
  const [layers, setLayers] = (0, _react.useState)(null);
  const overlay = (0, _react.useRef)({
    points: _leaflet.default.layerGroup(),
    malhas: _leaflet.default.layerGroup()
  });
  const {
    data,
    height,
    width,
    formData,
    datasource
  } = props;
  const [points, setPoints] = (0, _react.useState)(null);
  const [total, setTotal] = (0, _react.useState)(null);
  const rootElem = /*#__PURE__*/(0, _react.createRef)();
  const [key, setKey] = (0, _react.useState)(null);
  const tile = (0, _react.useMemo)(() => {
    return _leaflet.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  }, []);
  const totalPageHandle = (0, _react.useCallback)(async () => {
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
        filters: formData.extraFilters,
        metrics: ["count"]
      }]
    });

    try {
      // eslint-disable-next-line radix
      setTotal(parseInt(result[0].data[0].count));
    } catch (err) {
      throw new Error(err);
    }
  }, [formData]);
  (0, _react.useEffect)(() => {
    setLayers([tile, overlay.current.points, overlay.current.malhas]);
  }, [tile]);
  (0, _react.useEffect)(() => {
    if (points && total) {
      setKey((0, _uuid.v4)());
    }
  }, [points, total]);
  (0, _react.useEffect)(() => {
    setPoints(data);
    totalPageHandle();
  }, [data]);
  (0, _react.useEffect)(() => {
    return () => {
      setPoints(null);
      setTotal(null);
      setKey(null);
    };
  }, []);
  return (0, _react2.jsx)(Container, {
    ref: rootElem,
    height: height,
    width: width
  }, layers && points && (0, _react2.jsx)(_reactLeaflet.MapContainer, {
    style: {
      width,
      height
    },
    whenCreated: map => {
      _leaflet.default.control.layers({
        base: tile
      }, {
        points: overlay.current.points,
        malhas: overlay.current.malhas
      }).addTo(map);
    },
    layers: layers,
    center: [0, 0],
    zoom: 2,
    minZoom: 2,
    maxZoom: 18,
    whenReady: () => setIsReady(true)
  }, isReady && total && (0, _react2.jsx)(_MapDeck.default, {
    key: key,
    hash: key,
    totalRegistros: total,
    height: height,
    width: width,
    points: points,
    datasource: datasource,
    formData: formData
  })));
}