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
    const data = await setPolygonLayer(
      map as maplibregl.Map,
      polygon_data,
      SetSources,
      SetLayers,
    );
    return data;
  } catch (error) {
    console.log("Something has gone wrong", error);
    return new Error(`Something has gone wrong ${error}`);
  }
}

//Polygon Layer
async function setPolygonLayer(
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

    const active_map_layer = useActiveMapStore.getState().active_map_layer;

    //For event cleanup when switching maps
    const setMapListenerEvents =
      useMapListenerEvents.getState().setMapListenerEvents;

    let marker: maplibregl.Popup | null = null;
    for (const element of polygon_Prop) {
      const source = `Polygon-Source-${element.Borough_Name}`;
      const layer = `Polygon-Layer-${element.Borough_Name}`;
      const line = `Polygon-Line-Layer-${element.Borough_Name}`;

      if (!mapGl?.getSource(source)) {
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
              "fill-color": "white",
              "fill-opacity": 0,
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
            paint: {
              "line-color": "white",
              "line-width": 2,
              "line-opacity": 0.2,
            },
          },
          active_map_layer,
        );

        mapGl.on("mouseenter", layer, () => {
          mapGl.setPaintProperty(line, "line-opacity", 1);
          mapGl.setPaintProperty(line, "line-width", 5);
          mapGl.getCanvas().style.cursor = "pointer";
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

        mapGl.on("mouseleave", layer, () => {
          mapGl.setPaintProperty(line, "line-opacity", 0.2);
          mapGl.setPaintProperty(line, "line-width", 2);
          mapGl.getCanvas().style.cursor = "";
          const activeMapType = useActiveMapStore.getState().active_Map_Type;
          switch (activeMapType) {
            case "Heatmap":
              resetHeatmapTransition(mapGl, element.Borough_Name);
              break;
            case "Extruded":
              resetExtrudedTransition(mapGl, element.Borough_Name);
              break;
            default:
              break;
          }
        });

        mapGl.on("mousemove", layer, (e) => {
          if (marker) {
            marker?.remove();
            marker = null;
          }
          const point = mapGl.project(e.lngLat);
          point.y -= 15;
          const adjustedLngLat = mapGl.unproject(point);

          marker = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: "custom-popup",
          })
            .setHTML(
              `<div class="popup-content">
                      <div class="text-md font-bold text-green-800">${element.Borough_Name}</div>
                      <div class="text-md  text-black">Click to see more details</div>
                          </div>`,
            )
            .setLngLat(adjustedLngLat)
            .addTo(mapGl);
        });

        mapGl.on("mouseleave", layer, () => {
          marker?.remove() as maplibregl.Popup;
          marker = null;
        });

        mapGl.on("mouseup", layer, (e) => {
          if (e.originalEvent.button === 0) {
            useSetDrawerBorough(element.Borough_Name);
            useSetDrawer(true);
          }
        });

        SetSources([source]);
        SetLayers([layer]);
        SetLayers([line]);
        setMapListenerEvents("polygon", layer);
      } else {
        const x = mapGl?.getSource(source);
        console.log(x);

        return new Error("Map already exists cannot make it again idiot");
      }
    }

    return "All done";
  } catch (e) {
    console.log(e);
    return new Error(`Something went wrong ${e} `);
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
