import axios from "axios";
import { crime_Categories, polygon_Endpoints } from "@/helpers/request_Helpers";
import {
  usePolygonCollectionStore,
  useMapStore,
  CrimeType,
  useSingleDrawerStore,
  useMapListenerEvents,
  useMarkerStore,
} from "@/store/store";
import { PolygonType } from "@/store/store";
import { useActiveMapStore } from "@/store/store";
import { useCrimeStore } from "@/store/store";
import maplibregl, { Map } from "maplibre-gl";
import { Heatmap, resetHeatmapTransition } from "./Map Type Helpers/Heatmap";
import { Extruded, resetExtrudedTransition } from "./Map Type Helpers/Extruded";
import SetQueryFeatures from "./Map Type Helpers/SetQueryFeatures";
import { mousemoveHandlers } from "./Map Type Helpers/handler";

async function PolygonDataFetching(City_Polygon: string) {
  try {
    const location = polygon_Endpoints.find((item) =>
      item.location === City_Polygon ? item : null,
    );
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const { data: polygon_data } = await axios.get(
      `${url}${location?.request_Endpoint}`,
    );

    const map = useMapStore.getState().map;
    const setPolygonData = usePolygonCollectionStore.getState().setPolygonData;

    //set sources and layers for transition
    const SetLayers = useMapStore.getState().setActiveLayers;
    const SetSources = useMapStore.getState().setActiveSources;

    setPolygonData(polygon_data);
    setPolygonLayer(map as maplibregl.Map, polygon_data, SetSources, SetLayers);
    return map;
  } catch (error) {
    console.log("Something has gone wrong", error);
  }
}

//Polygon Layer
function setPolygonLayer(
  mapGl: maplibregl.Map,
  polygon_Prop: PolygonType[],
  SetSources: (f: string[]) => void,
  SetLayers: (f: string[]) => void,
) {
  //get all the fucking active Layers, Crime Types, Drawer for opening and such , and Single Borough for the drawer etc.
  try {
    const activeCrimeTypes = useCrimeStore.getState().crime_data;
    const useSetDrawer = useSingleDrawerStore.getState().useSetDrawer;
    const useSetDrawerBorough =
      useSingleDrawerStore.getState().useSetDrawerBorough;

    //popup variables to check if an active borough is selected
    let marker: maplibregl.Popup | null = null;
    let current_Id: string | null = null;
    let popupTimeout: NodeJS.Timeout | null = null;
    const active_map_layer = useActiveMapStore.getState().active_map_layer;

    //For event cleanup when switching maps
    const setMapListenerEvents =
      useMapListenerEvents.getState().setMapListenerEvents;

    for (const element of polygon_Prop) {
      const source = `Polygon-Source-${element.Borough_Name}`;
      const layer = `Polygon-Layer-${element.Borough_Name}`;
      const line = `Polygon-Line-Layer-${element.Borough_Name}`;
      if (!mapGl?.getSource(source)) {
        SetSources([source]);
        SetLayers([layer, line]);
        setMapListenerEvents("polygon", layer);
        mapGl?.addSource(source, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                id: element.Borough_Name as string,
                geometry: {
                  type: "Polygon",
                  coordinates: [element.coordinates],
                },
                properties: {},
              },
            ],
          },
        });

        mapGl?.addLayer(
          {
            id: layer,
            type: "fill",
            source: source,
            layout: {},
            paint: {
              "fill-color": "blue",
              "fill-opacity": 0.5,
              "fill-opacity-transition": { duration: 100, delay: 0 },
              "fill-color-transition": { duration: 100, delay: 0 },
            },
          },
          active_map_layer,
        );

        //just the line layer nothing else
        mapGl?.addLayer(
          {
            id: line,
            type: "line",
            source: source,
            paint: { "line-color": "white", "line-width": 2 },
          },
          active_map_layer,
        );

        mapGl?.on("mousemove", layer, (e: maplibregl.MapLayerMouseEvent) => {
          const activeMapType = useActiveMapStore.getState().active_Map_Type;
          switch (activeMapType) {
            case "Heatmap":
              Heatmap(
                mapGl,
                element.Borough_Name,
                polygon_Prop,
                activeCrimeTypes,
                layer,
              );
              break;
            case "Extruded":
              Extruded(
                mapGl,
                element.Borough_Name,
                polygon_Prop,
                activeCrimeTypes,
                layer,
              );
              break;
            default:
              break;
          }
        });

        mapGl?.on("mouseleave", layer, (e: maplibregl.MapLayerMouseEvent) => {
          const activeMapType = useActiveMapStore.getState().active_Map_Type;
          switch (activeMapType) {
            case "Heatmap":
              resetHeatmapTransition(
                polygon_Prop,
                element.Borough_Name,
                mapGl,
                layer,
              );
              break;
            case "Extruded":
              resetExtrudedTransition(
                polygon_Prop,
                element.Borough_Name,
                mapGl,
                layer,
              );
              break;
            default:
              break;
          }
        });

        ///////Setting up popup with delay 600 ms
        mapGl?.on("mousemove", layer, (e) => {
          const borough_Id = element.Borough_Name;

          if (marker && borough_Id === current_Id) {
            return;
          }

          if (marker) {
            marker?.remove();
            marker = null;
            current_Id = null;
          }

          if (popupTimeout) {
            clearTimeout(popupTimeout);
            popupTimeout = null;
          }
          popupTimeout = setTimeout(() => {
            if (marker && borough_Id === current_Id) {
              return;
            }
            const el = document.createElement("div");
            el.id = `hover-card-${element.Borough_Name}`;
            el.style.pointerEvents = "auto";
            el.style.cssText =
              "background: white; padding: 12px 16px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: all 0.2s ease; max-width: 280px;";
            el.innerHTML = `
  <h3 style="
    margin: 0 0 10px 0;
    font-size: 16px;
    font-weight: 600;
    color: #111;
  ">
    ${element.Borough_Name}
  </h3>

  <p style="
    margin: 0 0 14px 0;
    color: #111;
    font-size: 13px;
    line-height: 1.6;
  ">
    Click below to see more details about <strong>${element.Borough_Name}</strong>.
  </p>

  <button id="view-more-btn" style="
    width: 100%;
    padding: 10px 16px;
    cursor: pointer;
    border: 1px solid #111;
    border-radius: 6px;
    background: #fff;
    color: #111;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.2s ease, transform 0.1s ease;
  ">
    View more details
  </button>
`;

            // Optional: Add hover effect for button
            const btn = el.querySelector("#view-more-btn") as HTMLButtonElement;
            btn.addEventListener("mouseenter", () => {
              btn.style.background = "#f5f5f5";
            });
            btn.addEventListener("mouseleave", () => {
              btn.style.background = "white";
            });

            btn.addEventListener("click", () => {
              useSetDrawer(true);
              useSetDrawerBorough(element.Borough_Name);
            });

            marker = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              className: "custom-popup",
            })
              .setHTML("background none")
              .setLngLat(e.lngLat)
              .setDOMContent(el)
              .addTo(mapGl);

            const popupElement = marker.getElement();
            const content = popupElement.querySelector(
              ".maplibregl-popup-content",
            ) as HTMLElement;
            const tip = popupElement.querySelector(
              ".maplibregl-popup-tip",
            ) as HTMLElement;

            if (content) {
              content.style.background = "none";
              content.style.boxShadow = "none";
              content.style.padding = "0";
            }
            if (tip) {
              tip.style.display = "none";
            }
            current_Id = element.Borough_Name;
            useMarkerStore.getState().setMarker(marker);
            useMarkerStore.getState().setCurrent_Id(current_Id);
          }, 1000);
        });

        /////Deleting pending popups delete and other markers when leaving or other markers that might exist after leaving too fast
        mapGl?.on("mouseleave", layer, (e) => {
          if (popupTimeout) {
            clearTimeout(popupTimeout);
            popupTimeout = null;
          }

          if (marker) {
            if (element.Borough_Name === current_Id) {
              return;
            } else {
              marker?.remove() as maplibregl.Popup;
              marker = null;
              current_Id = null;
            }
          }
        });

        const handler = (e: maplibregl.MapMouseEvent) => {
          SetQueryFeatures({ layer, e, polygon_Prop });
        };

        mousemoveHandlers.set(layer, handler);

        mapGl?.on("mousemove", handler);
      } else {
        if (mapGl?.getLayer(layer)) mapGl.removeLayer(layer);
        if (mapGl?.getSource(source)) mapGl.removeSource(source);

        SetSources([source]);
        SetLayers([layer, line]);
        setMapListenerEvents("polygon", layer);

        mapGl?.addSource(source, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                id: element.Borough_Name as string,
                geometry: {
                  type: "Polygon",
                  coordinates: [element.coordinates],
                },
                properties: {},
              },
            ],
          },
        });

        mapGl?.addLayer(
          {
            id: layer,
            type: "fill",
            source: source,
            layout: {},
            paint: {
              "fill-color": "blue",
              "fill-opacity": 0.5,
              "fill-opacity-transition": { duration: 100, delay: 0 },
              "fill-color-transition": { duration: 100, delay: 0 },
            },
          },
          active_map_layer,
        );

        //just the line layer nothing else
        mapGl?.addLayer(
          {
            id: line,
            type: "line",
            source: source,
            paint: { "line-color": "white", "line-width": 2 },
          },
          active_map_layer,
        );

        mapGl?.on("mousemove", layer, (e: maplibregl.MapLayerMouseEvent) => {
          const activeMapType = useActiveMapStore.getState().active_Map_Type;
          switch (activeMapType) {
            case "Heatmap":
              Heatmap(
                mapGl,
                element.Borough_Name,
                polygon_Prop,
                activeCrimeTypes,
                layer,
              );
              break;
            case "Extruded":
              Extruded(   
                mapGl,
                element.Borough_Name,
                polygon_Prop,
                activeCrimeTypes,
                layer,
              );
              break;
            default:
              break;
          }
        });

        mapGl?.on("mouseleave", layer, (e: maplibregl.MapLayerMouseEvent) => {
          const activeMapType = useActiveMapStore.getState().active_Map_Type;
          switch (activeMapType) {
            case "Heatmap":
              resetHeatmapTransition(
                polygon_Prop,
                element.Borough_Name,
                mapGl,
                layer,
              );
              break;
            case "Extruded":
              resetExtrudedTransition(
                polygon_Prop,
                element.Borough_Name,
                mapGl,
                layer,
              );
              break;
            default:
              break;
          }
        });

        ///////Setting up popup with delay 600 ms
        mapGl?.on("mousemove", layer, (e) => {
          const borough_Id = element.Borough_Name;

          if (marker && borough_Id === current_Id) {
            return;
          }

          if (marker) {
            marker?.remove();
            marker = null;
            current_Id = null;
          }

          if (popupTimeout) {
            clearTimeout(popupTimeout);
            popupTimeout = null;
          }
          popupTimeout = setTimeout(() => {
            if (marker && borough_Id === current_Id) {
              return;
            }
            const el = document.createElement("div");
            el.id = `hover-card-${element.Borough_Name}`;
            el.style.pointerEvents = "auto";
            el.style.cssText =
              "background: white; padding: 12px 16px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); transition: all 0.2s ease; max-width: 280px;";
            el.innerHTML = `
  <h3 style="
    margin: 0 0 10px 0;
    font-size: 16px;
    font-weight: 600;
    color: #111;
  ">
    ${element.Borough_Name}
  </h3>

  <p style="
    margin: 0 0 14px 0;
    color: #111;
    font-size: 13px;
    line-height: 1.6;
  ">
    Click below to see more details about <strong>${element.Borough_Name}</strong>.
  </p>

  <button id="view-more-btn" style="
    width: 100%;
    padding: 10px 16px;
    cursor: pointer;
    border: 1px solid #111;
    border-radius: 6px;
    background: #fff;
    color: #111;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.2s ease, transform 0.1s ease;
  ">
    View more details
  </button>
`;

            // Optional: Add hover effect for button
            const btn = el.querySelector("#view-more-btn") as HTMLButtonElement;
            btn.addEventListener("mouseenter", () => {
              btn.style.background = "#f5f5f5";
            });
            btn.addEventListener("mouseleave", () => {
              btn.style.background = "white";
            });

            btn.addEventListener("click", () => {
              useSetDrawer(true);
              useSetDrawerBorough(element.Borough_Name);
            });

            marker = new maplibregl.Popup({
              closeButton: false,
              closeOnClick: false,
              className: "custom-popup",
            })
              .setHTML("background none")
              .setLngLat(e.lngLat)
              .setDOMContent(el)
              .addTo(mapGl);

            const popupElement = marker.getElement();
            const content = popupElement.querySelector(
              ".maplibregl-popup-content",
            ) as HTMLElement;
            const tip = popupElement.querySelector(
              ".maplibregl-popup-tip",
            ) as HTMLElement;

            if (content) {
              content.style.background = "none";
              content.style.boxShadow = "none";
              content.style.padding = "0";
            }
            if (tip) {
              tip.style.display = "none";
            }
            current_Id = element.Borough_Name;
            useMarkerStore.getState().setMarker(marker);
            useMarkerStore.getState().setCurrent_Id(current_Id);
          }, 1000);
        });

        /////Deleting pending popups delete and other markers when leaving or other markers that might exist after leaving too fast
        mapGl?.on("mouseleave", layer, (e) => {
          if (popupTimeout) {
            clearTimeout(popupTimeout);
            popupTimeout = null;
          }

          if (marker) {
            if (element.Borough_Name === current_Id) {
              return;
            } else {
              marker?.remove() as maplibregl.Popup;
              marker = null;
              current_Id = null;
            }
          }
        });

        const handler = (e: maplibregl.MapMouseEvent) => {
          SetQueryFeatures({ layer, e, polygon_Prop });
        };

        mousemoveHandlers.set(layer, handler);

        mapGl?.on("mousemove", handler);
      }
    }
  } catch (e) {
    console.log(e);
    throw new Error("Something went wrong");
  }
}

//Local Feature Point for Local Living Layer
// function createFeaturePoint(
//   longitude: string,
//   latitude: string,
//   amount: string,
//   borough_Name: string,
//   index: string,
//   local?: boolean
// ): Feature {
//   const activeMapId = `${borough_Name}-${1 * (Math.random() * 10)}`;
//   const localId = `${borough_Name}-${longitude}-${latitude}-${
//     1 * (Math.random() * 10)
//   }`;

//   const coord = () => {
//     if (Number(index) % 2) {
//       return [
//         Number(longitude) + (Math.random() - 0.5) * 0.0012,
//         Number(latitude) + (Math.random() - 0.5) * 0.0045,
//       ];
//     } else {
//       return [
//         Number(longitude) + (Math.random() - 0.5) * 0.0045,
//         Number(latitude) + (Math.random() - 0.5) * 0.0012,
//       ];
//     }
//   };

//   const geoPoint: Feature = {
//     type: "Feature",
//     id: `${local ? localId : activeMapId}`,
//     properties: {
//       magnitude:
//         Number(amount) < 50
//           ? Math.random() * 2
//           : Number(amount) < 200
//           ? 2 + Math.random() * 3
//           : 5 + Math.random() * 4,
//       place: borough_Name,
//     },
//     geometry: {
//       type: "Point",
//       coordinates: coord(),
//     },
//   };

//   return geoPoint;
// }

export default PolygonDataFetching;
