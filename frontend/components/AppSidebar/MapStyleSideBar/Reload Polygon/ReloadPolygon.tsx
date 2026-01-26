import {
  CrimeType,
  useCrimeStore,
  usePolygonCollectionStore,
} from "@/store/store";
import { useActiveMapStore } from "@/store/store";
import { useMapStore } from "@/store/store";
import { Heatmap } from "@/Data Features API/PolygonData/Map Type Helpers/Heatmap";
import { Extruded } from "@/Data Features API/PolygonData/Map Type Helpers/Extruded";
import { resetHeatmapTransition } from "@/Data Features API/PolygonData/Map Type Helpers/Heatmap";
import { resetExtrudedTransition } from "@/Data Features API/PolygonData/Map Type Helpers/Extruded";
import { polygon_Endpoints } from "@/helpers/request_Helpers";
import axios from "axios";
import { useSingleDrawerStore } from "@/store/store";
import maplibregl, { Map } from "maplibre-gl";
import { useMapListenerEvents } from "@/store/store";
async function ReloadPolygon() {
  setPolygon();
}

function setPolygon() {
  const mapGl = useMapStore.getState().map;
  const activeCrimeTypes = useCrimeStore.getState().crime_data;
  const useSetDrawer = useSingleDrawerStore.getState().useSetDrawer;
  const useSetDrawerBorough =
    useSingleDrawerStore.getState().useSetDrawerBorough;
  const polygon_Prop = usePolygonCollectionStore.getState().data;
  //popup variables to check if an active borough is selected
  let marker: maplibregl.Popup | null = null;
  let current_Id: string | null = null;
  let popupTimeout: NodeJS.Timeout | null = null;

  const active_map_layer = useActiveMapStore.getState().active_map_layer;
  const setMapListenerEvents =
    useMapListenerEvents.getState().setMapListenerEvents;

  for (const element of polygon_Prop) {
    const source = `Polygon-Source-${element.Borough_Name}`;
    const layer = `Polygon-Layer-${element.Borough_Name}`;
    const line = `Polygon-Line-Layer-${element.Borough_Name}`;

    //resetting the polygon layer
    setMapListenerEvents("polygon", layer);
    mapGl?.addSource(source, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: element.Borough_Name as string,
            geometry: { type: "Polygon", coordinates: [element.coordinates] },
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
      console.log("Triggered 2", activeMapType);
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

        el.addEventListener("mouseenter", (e) => {
          const activeMapLayer = useActiveMapStore.getState().active_map_layer;
          //setting the paint properties of the LOCAL LIVING LAYER, need to change to be dynamic to whatever layer is active
          // Extruded , Heatmap , etc. etc.
          // mapGl.setPaintProperty(activeMapLayer, "heatmap-opacity", 0.1);
          // for (const borough of polygon_Prop) {
          //   mapGl.setPaintProperty(layer, "fill-opacity", 0.1);
          // }
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

    mapGl?.on("mousemove", (e) => {
      const features = mapGl.queryRenderedFeatures(e.point, {
        layers: polygon_Prop.map((p) => layer),
      });

      if (features.length === 0) {
        if (marker) {
          marker.remove();
          marker = null;
          current_Id = null;
        }
      }
    });
  }
}
export default ReloadPolygon;
