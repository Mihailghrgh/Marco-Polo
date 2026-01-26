import { useMapListenerEvents } from "@/store/store";
import { mousemoveHandlers } from "@/Data Features API/PolygonData/Map Type Helpers/handler";
import { usePolygonCollectionStore } from "@/store/store";
import { useMapStore } from "@/store/store";
export function DestroyLayersAndSources() {
  const map = useMapStore.getState().map;
  const polygon_Prop = usePolygonCollectionStore.getState().data;

  const polygon = useMapListenerEvents.getState().polygon;
  const heatmap = useMapListenerEvents.getState().heatmap;
  const extruded = useMapListenerEvents.getState().extruded;

  const active_Layers = useMapStore.getState().refresh_Map_Layers;
  const active_Sources = useMapStore.getState().refresh_Map_Sources;

  const clear_Sources = useMapStore.getState().clearActiveSources;
  const clear_Layers = useMapStore.getState().clearActiveLayers;
  const clear_Map_Listeners =
    useMapListenerEvents.getState().clearMapListenerEvents;
  const eventTypes = [
    "mousemove",
    "mouseleave",
    "mouseenter",
    "click",
  ] as const;

  // Remove all polygon listeners
  polygon.forEach((layer) => {
    const handler = mousemoveHandlers.get(layer);
    if (handler) {
      map?.off("mousemove", handler);
      mousemoveHandlers.delete(layer);
    }

    eventTypes.forEach((event) => {
      map?.off(event, layer as any);
    });
  });

  // Remove all heatmap listeners
  heatmap.forEach((layer) => {
    eventTypes.forEach((event) => {
      map?.off(event, layer as any);
    });
  });

  // Remove all extruded listeners
  extruded.forEach((layer: string) => {
    eventTypes.forEach((event) => {
      map?.off(event, layer as any);
    });
  });

  active_Layers.forEach((layer: string) => {
    if (map?.getLayer(layer)) {
      map.removeLayer(layer);
    }
  });

  active_Sources.forEach((source: string) => {
    if (map?.getSource(source)) {
      map.removeSource(source);
    }
  });

  //clear all registries
  clear_Sources();
  clear_Layers();
  clear_Map_Listeners("polygon");
  clear_Map_Listeners("heatmap");
  clear_Map_Listeners("extruded");
}
