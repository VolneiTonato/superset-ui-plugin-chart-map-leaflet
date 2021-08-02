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

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { styled, ApiV1, DatasourceType, ChartProps } from '@superset-ui/core';
import { Deck, MapView } from '@deck.gl/core';
import { GeoJsonLayer, IconLayer, ScatterplotLayer } from '@deck.gl/layers';
import { useMap, useMapEvents } from 'react-leaflet';
import { filter, get } from 'lodash';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import mapgl from 'maplibre-gl';
import * as turf from '@turf/turf';
import { MapCitiesStylesProps } from '../types';
import { generateRandomRGB } from '../hooks';


const PIN = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAuCAYAAABJcBuEAAAACXBIWXMAAAEMAAABDAGWp/hQAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAxRJREFUWIW9WDtrFFEU/s6uxsJdhJVAsEiCEh9IbFPYipXa+BcsRFAQbMRHJQqWgoVEtBXEJqCNKFY2AQsFHyFiNCaa+MhG16xGM5/FzKx37t65j9ldv2Z3zj33fN/c1zl3gACQPEVyjmTELCKSSyTvkzxEshwS10Xan5CG4iHJSqfkkwWIdVyzcUgOcQ3A57z2AvgBYEBEGnpDyUA+AuBLF8kBYCOAZZL9ekOGhOQmAPXA4NTjWBABqIhIM09AFBCsKBoiUk0fWlNAcjKQvAHgBYDniOfYFxWSVzMWkjXPFR2RPEnDPidZJnmO2TNCPy9UVNTO7z3IZ0zEOULmPeJNqJ2c5AFDnMacdQUFgBLJ465YALaFCgAwnPSF8quL3O8z/McMHcskx0nWSX4jeYPmdXHUEfuu0L311onImkoOYAVAn+a3CqAqIquaCOPbJ1guOcgXVPIEdwzkSGwTBvtiqsXQVm07ijU8M9gOWPz3GWyvLP4llwDTAWPrY2r7YyNwCdhusL2x+M8YbMMWf4pjkUQiklndJLcAmMvxHxSRWc3ftsiXSgB+WgSUSI6qBhGZB7ALQFMxNwHsMZCPWcgBYAokHzj2am56JtlH0rQj0vZ6EiMvJ1wCyYMOASQ5bnmLPPLLHnG3ps4+uBJAftojXqR2WPEU8Zpx1ZRHXCM5pZJYYj0BkgVC8gyACwEjvADgFoCnyfMYgMMANgfE2Csij1srlLRux26jtb3Vg2i6w6AhL3A9/aOOwACADx2K8MWGNGu2RkBEPiJOs73GPTVl62X5EMzneTdRVW9ImWQkIm8RVmKH4rZ+PWs7pxlfnxZ1exdAAOv1AqctHYvIJwAveyDgrKG6yr0dl+EoJAKRuY6pMBYkidIjXRSwo1Avkt89c4QN1kxqvYwyzvW/CqmP8VtEcusFwFETJgfG+Q4E7O6g7z+QbBQY+os+sb2+BxSYinciMuTj6CrLAbSmYtTpGCMCMOLpGwaSNz2GfmdPyBURXy3kJ3pKrohYM5A/+i/kiYCKRp53U+qpiMGEfJodfJz+Cz2d8KTPSP0uAAAAAElFTkSuQmCC';


const Canvas = styled.canvas<MapCitiesStylesProps>`
    position: absolute;
    z-index: 999;
    top: 0;
    left: 0;
    height: ${({ height }) => height};
    width: ${({ width }) => width};
`

type MapDeckProps = Partial<ChartProps> & {
    points: Array<any>;
    height: number;
    width: number;
    totalRegistros: number;
    hash: string;
}

interface UpdateHandeProps {
    callbackPoints?: boolean;
    force?: boolean;
}

interface DataLayersProps {
    malhas?: null | turf.FeatureCollection;
    points?: null | turf.FeatureCollection;
    markers?: null | turf.FeatureCollection;
}

const ICON_MAPPING = {
    marker: { x: 0, y: 0, width: 32, height: 46, mask: true }
};


function templateMount(label, value) {
    return (
        <p><span><strong>{label}</strong>:&nbsp;</span><span>{value}</span></p>
    )
}


function tratarDadosPoints(data: Array<any>): turf.FeatureCollection {
    const features: any = [];

    data.forEach(row => {
        if (row.LAT && row.LON) {

            row.Color = generateRandomRGB('array')

            features.push(turf.feature({ type: 'Point', coordinates: [row.LON, row.LAT] }, row))
        }
    })


    return turf.featureCollection(features);
}


function tratarDadosMultipoints(data: Array<any>): turf.FeatureCollection {
    const features: any = []


    data.forEach(row => {

        if (row.geojson) {

            row.Color = generateRandomRGB('array');

            const properties = Object.assign({}, row);

            delete properties.geojson;

            const poly = turf.feature(JSON.parse(row.geojson), properties);
            features.push(turf.rewind(poly));
        }
    })

    return turf.featureCollection(features);
}


function dadosCities(cliente) {

    return (
        <div style={{ textAlign: 'left', fontSize: '14px' }}>
            {templateMount('Street', get(cliente, 'STREET'))}
            {templateMount('Number', get(cliente, 'NUMBER'))}
            {templateMount('City', get(cliente, 'CITY'))}
            {templateMount('Post Code', get(cliente, 'POSTCODE'))}
            {templateMount('LAT', get(cliente, 'LAT'))}
            {templateMount('LON', get(cliente, 'LON'))}
        </div>
    )
}



function dadosMalhas(cliente) {

    return (
        <div style={{ textAlign: 'left', fontSize: '14px' }}>
            {templateMount('City', get(cliente, 'CITY'))}
        </div>
    )
}


function updateTooltip({ x, y, object }) {

    if (object) {

        let html = ''
        if (object?.properties['STREET'])
            html = renderToString(dadosCities(object.properties))
        else {
            html = renderToString(dadosMalhas(object.properties))
        }


        return {
            html: `${html}`,
            style: {
                color: '#fff',
                backgroundColor: '#000',
                fontSize: '0.8em',
                zIndex: 10000
            }
        }
    }

    return null
}

const getViewState = (map: L.Map) => {

    return {
        longitude: map.getCenter().lng,
        latitude: map.getCenter().lat,
        zoom: map.getZoom() - 1,
        pitch: 0,
        bearing: 0
    };

};


const getMalhasByCity = async (filter_extra: Array<any>) => {

    if (!Array.isArray(filter_extra))
        return []

    const custom_filter = filter(filter_extra.map(row => {
        if (['CITY', 'REGION'].includes(row.col))
            return row
        return null
    }))


    if (custom_filter.length === 0)
        return []



    const { result } = await ApiV1.getChartData({
        datasource: {
            id: 40,
            type: DatasourceType.Table
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
    })

    const data = result[0].data

    if (!data)
        return null

    return data as any
}




export default function MapDeck({ height, width, points, datasource, formData, totalRegistros, hash }: MapDeckProps) {
    const divDeck = useRef(null);
    const [deck, setDeck] = useState<Deck | null>(null);
    const map = useMap();
    const data = useRef<DataLayersProps>({ malhas: null, points: null, markers: null });
    const breakSearch = useRef(false);
    const typeZoom = useRef({
        zoomPoints: 0
    });




    const colors = useRef({
        lines: [255, 255, 255],
        background: generateRandomRGB('array'),
        hover: generateRandomRGB('array')
    });

    const visibled = useRef<any>({
        malhas: true,
        points: true
    });

    const isRunning = useRef<boolean>(false);
    const totalRef = useRef<number | null>(null);


    const zoomRef = useRef<number | null>(null);


    useMapEvents({
        move: (e: any) => {
            updateDeckViewHandle({});
        },
        zoomend: (e: any) => {
            changeZoom(e.target.getZoom());
        },
        overlayremove: (e: any) => {
            visibled.current[e.name] = false;
            updateHande({ force: true });
        },
        overlayadd: (e: any) => {
            visibled.current[e.name] = true;
            updateHande({ force: true });
        }
    });

    const updateDeckViewHandle = useCallback(({ layers }: { layers?: any }) => {
        if (!map || !deck)
            return

        const viewState = getViewState(map)

        deck.setProps({ viewState })

        if (layers)
            deck.setProps({ layers })

        deck.redraw(true)
    }, [deck, map]);


    const updateHande = useCallback(async (param: UpdateHandeProps) => {



        let change = param?.force || false
        const callbackPoints = param?.callbackPoints || true

        const zoom = zoomRef.current || 0

        if (!data.current.points) {
            data.current.points = tratarDadosPoints(points)
            change = true
        }


        if (!data.current.malhas) {
            data.current.malhas = tratarDadosMultipoints(await getMalhasByCity(formData?.extraFilters))
            change = true
        }

        if (change === false) {
            return
        }


        const customLayers: any = {
            layerMalhas: null,
            layerPoints: null,
        }

        customLayers.layerMalhas = new GeoJsonLayer({
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
        })



        if (zoom < 14) {

            customLayers.layerPoints = new ScatterplotLayer({
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
                    return [Number(d.geometry.coordinates[0]), Number(d.geometry.coordinates[1])]
                },
                getRadius: 10,
                getFillColor: d => d.properties.Color,
                getLineColor: d => d.properties.Color

            })
        }




        if (zoom >= 14) {

            customLayers.layerMarker = new IconLayer({
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
                    return [Number(d.geometry.coordinates[0]), Number(d.geometry.coordinates[1])]
                },
                getSize: d => 10,
                getColor: d => d.properties.Color,
                updateTriggers: {
                    getSize: zoom
                }

            })
        }

        if (callbackPoints)
            updatePoints()
        updateDeckViewHandle({ layers: Object.values(customLayers) })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData, points, updateDeckViewHandle]);



    const changeZoom = useCallback((zoom: number) => {

        let force = false

        zoomRef.current = zoom

        if (!typeZoom.current.zoomPoints) {
            typeZoom.current.zoomPoints = zoom
            force = true
        } else if (typeZoom.current.zoomPoints >= 14 && zoom < 14) {
            typeZoom.current.zoomPoints = zoom
            force = true
        } else if (typeZoom.current.zoomPoints < 14 && zoom >= 14) {
            typeZoom.current.zoomPoints = zoom
            force = true
        }

        updateHande({ force })

    }, [updateHande]);




    const getData = useCallback(async (offset = 0) => {

        const { result } = await ApiV1.getChartData({
            datasource: {
                id: datasource.id,
                type: DatasourceType.Table
            },
            force: true,
            result_format: 'json',
            result_type: 'results',
            queries: [{
                columns: formData.allColumns,
                groupby: formData.groupby,
                filters: formData.extraFilters,
                row_offset: offset || 0,
                row_limit: formData.rowLimit,
                metrics: formData.metrics,
            }]
        })

        const data = result[0].data

        if (!data)
            return true

        return data
    }, [datasource, formData])



    const updatePoints = useCallback(async () => {


        if (isRunning.current)
            return true

        const total_registros = totalRegistros

        if (!isRunning.current)
            isRunning.current = true


        if (totalRef.current === total_registros)
            return true

        await new Promise(resolve => setTimeout(resolve, 1000))


        const limit = formData.rowLimit || 1000


        const total_pages = parseInt(Math.ceil(parseInt(total_registros) / limit))

        const range = Array.from(Array(total_pages).keys())

        delete range[0]

        const populate = async () => {
            let tentativas = 0
            for (let page of range) {
                try {

                    if (breakSearch.current === true)
                        break

                    page++

                    await new Promise(resolve => setTimeout(resolve, 1000))

                    const offset = (page * limit) - limit

                    let my_features = tratarDadosPoints(await getData(offset))


                    if (!data.current.points)
                        data.current.points = my_features
                    else
                        data.current.points.features = [...data.current.points.features, ...my_features.features]

                    my_features = null

                    totalRef.current = data.current.points.features.length

                    updateHande({ force: true, callbackPoints: false })

                } catch (err) {
                    if (tentativas > 3)
                        throw new Error(err)
                    tentativas++
                }

            }
            return true
        }

        populate()

        return true
    }, [formData, getData, totalRegistros, updateHande]);



    useEffect(() => {

        if (!map || !divDeck.current)
            return



        if (zoomRef.current === map.getZoom())
            return

        zoomRef.current = map.getZoom()


        const map_deck = new Deck({
            canvas: divDeck.current,
            viewState: getViewState(map),
            controller: true,
            layers: [],
            map: mapgl,
            views: [
                new MapView({ repeat: false }),
            ],
            getTooltip: updateTooltip
        })

        setDeck(map_deck)
    }, [map, divDeck]);


    useEffect(() => {
        if (deck)
            updateHande({})
    }, [deck, updateHande]);

    useEffect(() => {

        return () => {
            divDeck.current = null
            zoomRef.current = null
            data.current = null as any
            breakSearch.current = true
            colors.current = null as any
            setDeck(null)
        }
    }, []);


    return <Canvas height={height} width={width} key={hash} ref={divDeck} />
}



