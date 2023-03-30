import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import OpacityControl from 'maplibre-gl-opacity';
import 'maplibre-gl-opacity/dist/maplibre-gl-opacity.css';

import distance from '@turf/distance';

// 地理院標高タイルをMapLibre GL JSで使うためのライブラリ
import { useGsiTerrainSource } from 'maplibre-gl-gsi-terrain';

const map = new maplibregl.Map({
    container: 'map', // div要素のid
    zoom: 5, // 初期表示のズーム
    center: [138, 37], // 初期表示の中心
    minZoom: 5, // 最小ズーム
    maxZoom: 18, // 最大ズーム
    maxBounds: [122, 20, 154, 50], // 表示可能な範囲
    style: {
        version: 8, 
        sources: {
          osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              maxzoom: 19, 
              tileSize: 256, 
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }, 
          // 重ねるハザードマップ
          hazard_flood: {
              type: 'raster',
              tiles: [
                  'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png',
              ],
                minzoom: 2,
                maxzoom: 17,
                tileSize: 256,
                attribution:
                    '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
          },
          hazard_hightide: {
              type: 'raster',
              tiles: [
                  'https://disaportaldata.gsi.go.jp/raster/03_hightide_l2_shinsuishin_data/{z}/{x}/{y}.png',
              ],
              minzoom: 2,
              maxzoom: 17,
              tileSize: 256,
              attribution:
                  '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
          },
          hazard_tsunami: {
              type: 'raster',
              tiles: [
                  'https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/{z}/{x}/{y}.png',
              ],
              minzoom: 2,
              maxzoom: 17,
              tileSize: 256,
              attribution:
                  '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
          },
          hazard_doseki: {
              type: 'raster',
              tiles: [
                  'https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/{z}/{x}/{y}.png',
              ],
              minzoom: 2,
              maxzoom: 17,
              tileSize: 256,
              attribution:
                  '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
          },
          hazard_kyukeisha: {
              type: 'raster',
              tiles: [
                  'https://disaportaldata.gsi.go.jp/raster/05_kyukeishakeikaikuiki/{z}/{x}/{y}.png',
              ],
              minzoom: 2,
              maxzoom: 17,
              tileSize: 256,
              attribution:
                  '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
          },
          hazard_jisuberi: {
              type: 'raster',
              tiles: [
                  'https://disaportaldata.gsi.go.jp/raster/05_jisuberikeikaikuiki/{z}/{x}/{y}.png',
              ],
              minzoom: 2,
              maxzoom: 17,
              tileSize: 256,
              attribution:
                  '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>',
          }, 
          //   重ねるハザードマップここまで
          skhb: {
            type: "vector",
            tiles: [
              `${location.href.replace('/index.html', '')}/skhb/{z}/{x}/{y}.pbf`
            ], 
            minzoom: 5, 
            maxzoom: 8, 
            attribution: '<a href="https://www.gsi.go.jp/bousaichiri/hinanbasho.html" target="_blank">国土地理院：指定緊急避難場所データ</a>'
          }, 
          route: {
            type: "geojson",
            data: {
              "type": "FeatureCollection",
              features: [],
            }
          }
        }, 
        layers: [
            {
                id: "osm-layer",
                source: "osm", 
                type: "raster"
            }, 
            // 重ねるハザードマップここから
            {
              id: 'hazard_flood-layer',
              source: 'hazard_flood',
              type: 'raster',
              paint: { 'raster-opacity': 0.7 },
              layout: { visibility: 'none' }, // レイヤーの表示はOpacityControlで操作するためデフォルトで非表示にしておく
            },
            {
                id: 'hazard_hightide-layer',
                source: 'hazard_hightide',
                type: 'raster',
                paint: { 'raster-opacity': 0.7 },
                layout: { visibility: 'none' },
            },
            {
                id: 'hazard_tsunami-layer',
                source: 'hazard_tsunami',
                type: 'raster',
                paint: { 'raster-opacity': 0.7 },
                layout: { visibility: 'none' },
            },
            {
                id: 'hazard_doseki-layer',
                source: 'hazard_doseki',
                type: 'raster',
                paint: { 'raster-opacity': 0.7 },
                layout: { visibility: 'none' },
            },
            {
                id: 'hazard_kyukeisha-layer',
                source: 'hazard_kyukeisha',
                type: 'raster',
                paint: { 'raster-opacity': 0.7 },
                layout: { visibility: 'none' },
            },
            {
                id: 'hazard_jisuberi-layer',
                source: 'hazard_jisuberi',
                type: 'raster',
                paint: { 'raster-opacity': 0.7 },
                layout: { visibility: 'none' },
            },
            // 重ねるハザードマップここまで
            {
              id: 'skhb-1-layer',
              source: 'skhb',
              'source-layer': 'skhb',
              type: 'circle',
              paint: {
                  'circle-color': '#6666cc',
                  'circle-radius': [
                      // ズームレベルに応じた円の大きさ
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      5,
                      2,
                      14,
                      6,
                  ],
                  'circle-stroke-width': 1,
                  'circle-stroke-color': '#ffffff',
              },
              filter: ['==', ['get', 'disaster1'], 1], // 属性:disaster1がtrueの地物のみ表示する
              layout: { visibility: 'none' }, // レイヤーの表示はOpacityControlで操作するためデフォルトで非表示にしておく
          },
          {
              id: 'skhb-2-layer',
              source: 'skhb',
              'source-layer': 'skhb',
              type: 'circle',
              paint: {
                  'circle-color': '#6666cc',
                  'circle-radius': [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      5,
                      2,
                      14,
                      6,
                  ],
                  'circle-stroke-width': 1,
                  'circle-stroke-color': '#ffffff',
              },
              filter: ["==", ['get', 'disaster2'], 1],
              layout: { visibility: 'none' },
          },
          {
              id: 'skhb-3-layer',
              source: 'skhb',
              'source-layer': 'skhb',
              type: 'circle',
              paint: {
                  'circle-color': '#6666cc',
                  'circle-radius': [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      5,
                      2,
                      14,
                      6,
                  ],
                  'circle-stroke-width': 1,
                  'circle-stroke-color': '#ffffff',
              },
              filter: ["==", ['get', 'disaster3'], 1],
              layout: { visibility: 'none' },
          },
          {
              id: 'skhb-4-layer',
              source: 'skhb',
              'source-layer': 'skhb',
              type: 'circle',
              paint: {
                  'circle-color': '#6666cc',
                  'circle-radius': [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      5,
                      2,
                      14,
                      6,
                  ],
                  'circle-stroke-width': 1,
                  'circle-stroke-color': '#ffffff',
              },
              filter: ["==", ['get', 'disaster4'], 1],
              layout: { visibility: 'none' },
          },
          {
              id: 'skhb-5-layer',
              source: 'skhb',
              'source-layer': 'skhb',
              type: 'circle',
              paint: {
                  'circle-color': '#6666cc',
                  'circle-radius': [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      5,
                      2,
                      14,
                      6,
                  ],
                  'circle-stroke-width': 1,
                  'circle-stroke-color': '#ffffff',
              },
              filter: ["==", ['get', 'disaster5'], 1],
              layout: { visibility: 'none' },
          },
          {
              id: 'skhb-6-layer',
              source: 'skhb',
              'source-layer': 'skhb',
              type: 'circle',
              paint: {
                  'circle-color': '#6666cc',
                  'circle-radius': [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      5,
                      2,
                      14,
                      6,
                  ],
                  'circle-stroke-width': 1,
                  'circle-stroke-color': '#ffffff',
              },
              filter: ["==", ['get', 'disaster6'], 1],
              layout: { visibility: 'none' },
          },
          {
              id: 'skhb-7-layer',
              source: 'skhb',
              'source-layer': 'skhb',
              type: 'circle',
              paint: {
                  'circle-color': '#6666cc',
                  'circle-radius': [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      5,
                      2,
                      14,
                      6,
                  ],
                  'circle-stroke-width': 1,
                  'circle-stroke-color': '#ffffff',
              },
              filter: ["==", ['get', 'disaster7'], 1],
              layout: { visibility: 'none' },
          },
          {
              id: 'skhb-8-layer',
              source: 'skhb',
              'source-layer': 'skhb',
              type: 'circle',
              paint: {
                  'circle-color': '#6666cc',
                  'circle-radius': [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      5,
                      2,
                      14,
                      6,
                  ],
                  'circle-stroke-width': 1,
                  'circle-stroke-color': '#ffffff',
              },
              filter: ["==", ['get', 'disaster8'], 1],
              layout: { visibility: 'none' },
          },
          {
            id: "route-layer", 
            source: "route", 
            type: "line", 
            paint: {
              "line-color": "#33aaff",
              "line-width": 4,
            }
          }
        ]
    }
});

const getCurrentSkhbLayerFilter = () => {
  const style = map.getStyle();
  const skhbLayers = style.layers.filter((layer) => layer.id.startsWith('skhb'));
  const visibleSkhbLayers = skhbLayers.filter((layer) => layer.layout.visibility === 'visible');
  return visibleSkhbLayers[0].filter;
};

const getNearestFeature = (longitude, latitude) => {
  const currentSkhbLayerFilter = getCurrentSkhbLayerFilter();
  const features = map.querySourceFeatures('skhb', {
        sourceLayer: 'skhb',
        filter: currentSkhbLayerFilter
      }); // skhbのレイヤーのfilter条件に合致する地物を抽出
  const nearestFeature = features.reduce((minDistFeature, feature) => {
    const dist = distance(
      [longitude, latitude], 
      feature.geometry.coordinates
    );
    // 最初の要素ではminDistFeatureはnullなので、最初の要素は必ず返す
    if (minDistFeature === null || dist < minDistFeature.properties.dist) {
      return { 
        ...feature, 
        properties: {
          ...feature.properties, 
          dist, 
        }
      };
    }
    return minDistFeature;  
  }, null); 
  return nearestFeature;  
};

let userLocation = null; // ユーザーの最新の現在地を保存する変数

// MapLibre GL JSの現在地取得機能
const geolocationControl = new maplibregl.GeolocateControl({
    trackUserLocation: true,
});
map.addControl(geolocationControl, 'bottom-right');
geolocationControl.on('geolocate', (e) => {
    // 位置情報が更新されるたびに発火・userLocationを更新
    userLocation = [e.coords.longitude, e.coords.latitude];
});

// マップの初期ロード完了時に発火するイベントを定義
map.on('load', () => {

    // 背景地図のコントロール
    const opacity = new OpacityControl({
      baseLayers: {
        'hazard_flood-layer': '洪水浸水想定区域',
        'hazard_hightide-layer': '高潮浸水想定区域',
        'hazard_tsunami-layer': '津波浸水想定区域',
        'hazard_doseki-layer': '土石流警戒区域',
        'hazard_kyukeisha-layer': '急傾斜警戒区域',
        'hazard_jisuberi-layer': '地滑り警戒区域',       
      },
    });
    map.addControl(opacity, 'top-left');

    const opacitySkhb = new OpacityControl({
        baseLayers: {
            'skhb-1-layer': '洪水',
            'skhb-2-layer': '崖崩れ/土石流/地滑り',
            'skhb-3-layer': '高潮',
            'skhb-4-layer': '地震',
            'skhb-5-layer': '津波',
            'skhb-6-layer': '大規模な火事',
            'skhb-7-layer': '内水氾濫',
            'skhb-8-layer': '火山現象',
        },
    });
    map.addControl(opacitySkhb, 'top-right');

    map.on('click', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [
          'skhb-1-layer',
          'skhb-2-layer',
          'skhb-3-layer',
          'skhb-4-layer',
          'skhb-5-layer',
          'skhb-6-layer',
          'skhb-7-layer',
          'skhb-8-layer',
        ]
      });
      if (features.length === 0) return;

      const feature = features[0];
      const popup = new maplibregl.Popup()
        .setLngLat(feature.geometry.coordinates)
        .setHTML(
          ` <div style="font-weight:900; font-size: 1.2rem;">${
            feature.properties.name
            }</div>\
            <div>${feature.properties.address}</div>\
            <div>${feature.properties.remarks ?? ''}</div>\
            <div>\
            <span${
                feature.properties.disaster1 ? '' : ' style="color:#ccc;"'
            }">洪水</span>\
            <span${
                feature.properties.disaster2 ? '' : ' style="color:#ccc;"'
            }> 崖崩れ/土石流/地滑り</span>\
            <span${
                feature.properties.disaster3 ? '' : ' style="color:#ccc;"'
            }> 高潮</span>\
            <span${
                feature.properties.disaster4 ? '' : ' style="color:#ccc;"'
            }> 地震</span>\
            <div>\
            <span${
                feature.properties.disaster5 ? '' : ' style="color:#ccc;"'
            }>津波</span>\
            <span${
                feature.properties.disaster6 ? '' : ' style="color:#ccc;"'
            }> 大規模な火事</span>\
            <span${
                feature.properties.disaster7 ? '' : ' style="color:#ccc;"'
            }> 内水氾濫</span>\
            <span${
                feature.properties.disaster8 ? '' : ' style="color:#ccc;"'
            }> 火山現象</span>\
            </div>
          `
        )
        .setMaxWidth("400px")
        .addTo(map);
    });

    map.on('mousemove', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [
          'skhb-1-layer',
          'skhb-2-layer',
          'skhb-3-layer',
          'skhb-4-layer',
          'skhb-5-layer',
          'skhb-6-layer',
          'skhb-7-layer',
          'skhb-8-layer',
        ]
      });
      if (features.length > 0) {
        map.getCanvas().style.cursor = 'pointer';
      } else {
        map.getCanvas().style.cursor = '';
      }

    });
  

    map.on('render', () => {
      // GeolocationControlがオフなら現在位置を消去する
      if (geolocationControl._watchState === 'OFF') userLocation = null;

      // ズームが一定値以下または現在地が計算されていない場合はラインを消去する
      if (map.getZoom() < 7 || userLocation === null) {
          map.getSource('route').setData({
              type: 'FeatureCollection',
              features: [],
          });
          return;
      }

      // 現在地の最寄りの地物を取得
      const nearestFeature = getNearestFeature(
          userLocation[0],
          userLocation[1],
      );
      // 現在地と最寄りの地物をつないだラインのGeoJSON-Feature
      const routeFeature = {
          type: 'Feature',
          geometry: {
              type: 'LineString',
              coordinates: [
                  userLocation,
                  nearestFeature._geometry.coordinates,
              ],
          },
      };
      // style.sources.routeのGeoJSONデータを更新する
      map.getSource('route').setData({
          type: 'FeatureCollection',
          features: [routeFeature],
      });
  });

  const gsiTerrainSource = useGsiTerrainSource(maplibregl.addProtocol);
  map.addSource('terrain', gsiTerrainSource);
  // 陰影図追加
  map.addLayer(
      {
          id: 'hillshade',
          source: 'terrain', // type=raster-demのsourceを指定
          type: 'hillshade', // 陰影図レイヤー
          paint: {
              'hillshade-illumination-anchor': 'map', // 陰影の方向の基準
              'hillshade-exaggeration': 0.2, // 陰影の強さ
          },
      },
      'hazard_jisuberi-layer', // どのレイヤーの手前に追加するかIDで指定
  );
  // 3D地形
  map.addControl(
      new maplibregl.TerrainControl({
          source: 'terrain', // type="raster-dem"のsourceのID
          exaggeration: 1, // 標高を強調する倍率
      }),
  );

});


