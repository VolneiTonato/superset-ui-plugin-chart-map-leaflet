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
import React, { useEffect, createRef, useState, useRef, useMemo, useCallback } from 'react';
import { styled, ApiV1, DatasourceType } from '@superset-ui/core';
import L from 'leaflet';
import { MapContainer } from 'react-leaflet';
import { MapCitiesProps, MapCitiesStylesProps } from './types';
import { v4 } from 'uuid';
import MapDeck from './components/MapDeck';

import 'leaflet/dist/leaflet.css';


const Container = styled.div<MapCitiesStylesProps>`
 position: relative;    

 & > * {
     position: relative;
     top: 0;
     left: 0;
     height: ${({ height }) => height};
     width: ${({ width }) => width};
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

`

export default function MapLeaflet(props: MapCitiesProps) {

  const [isReady, setIsReady] = useState(false)
  const [layers, setLayers] = useState(null)
  const overlay = useRef({
    points: L.layerGroup(),
    malhas: L.layerGroup()
  })
  const { data, height, width, formData, datasource } = props;
  const [points, setPoints] = useState<null | Array<any>>(null)
  const [total, setTotal] = useState<number | null>(null)
  const rootElem = createRef<HTMLDivElement>();
  // const [key, setKey] = useState(null);
  const key_render = useRef(null)

  const tile = useMemo(() => {
    return L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  }, []);


  const totalPageHandle = useCallback(async () => {

    const { result } = await ApiV1.getChartData({
      datasource: {
        id: datasource.id,
        type: DatasourceType.Table
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
      setTotal(parseInt(result[0].data[0].count))
    } catch (err) {
      throw new Error(err)
    }

  }, [formData]);


  useEffect(() => {
    setLayers([tile, overlay.current.points, overlay.current.malhas])
  }, [tile]);

  useEffect(() => {
    key_render.current = v4()
  }, [points]);

  useEffect(() => {
    setPoints(data)
    totalPageHandle()
  }, [data]);

  return (
    <Container
      ref={rootElem}
      height={height}
      width={width}
    >
      {layers && points && (
        <MapContainer style={{ width, height }} whenCreated={(map) => {
          L.control.layers({ base: tile }, {
            points: overlay.current.points,
            malhas: overlay.current.malhas
          }).addTo(map);

        }} layers={layers} center={[0, 0]} zoom={2} minZoom={2} maxZoom={18} whenReady={() => setIsReady(true)}>
          {isReady && total && <MapDeck key={key_render.current} hash={key_render.current as unknown as string} totalRegistros={total} height={height} width={width} points={points} datasource={datasource} formData={formData} />}
        </MapContainer>
      )}
    </Container>
  );
}
