import { useCrimeStore, useMapListenerEvents } from "@/store/store";
import { usePolygonCollectionStore } from "@/store/store";
import { useMapStore } from "@/store/store";
export async function DestroyLayersAndSources() {
  const map = useMapStore.getState().map;
  const active_Layers = useMapStore.getState().refresh_Map_Layers;
  const active_Sources = useMapStore.getState().refresh_Map_Sources;

  // Remove layers (this automatically removes associated event listeners)
  active_Layers.forEach((layer: string) => {
    if (map?.getLayer(layer)) {
      map.removeLayer(layer);
    }
  });

  // Remove sources
  active_Sources.forEach((source: string) => {
    if (map?.getSource(source)) {
      map.removeSource(source);
    }
  });

  // Clear registries
  useMapStore.getState().clearActiveSources();
  useMapStore.getState().clearActiveLayers();
  useMapListenerEvents.getState().clearMapListenerEvents("polygon");
  useMapListenerEvents.getState().clearMapListenerEvents("heatmap");
  useMapListenerEvents.getState().clearMapListenerEvents("extruded");
  useCrimeStore.getState().clearCrime();
  usePolygonCollectionStore.getState().clearPolygon();
}
