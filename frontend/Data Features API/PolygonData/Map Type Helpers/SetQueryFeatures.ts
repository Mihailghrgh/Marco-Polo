import { useMapStore, useMarkerStore } from "@/store/store";
import { MouseEventHandler } from "react";
import maplibregl, { Map } from "maplibre-gl";
import { PolygonType } from "@/store/store";
function SetQueryFeatures({
  layer,
  e,
  polygon_Prop,
}: {
  layer: string;
  e: maplibregl.MapMouseEvent;
  polygon_Prop: PolygonType[];
}) {
  let features;
  const marker = useMarkerStore.getState().marker;
  const current_Id = useMarkerStore.getState().current_Id;
  const map = useMapStore.getState().map;
  if (layer) {
    features = map?.queryRenderedFeatures(e.point, {
      layers: polygon_Prop.map((p) => layer),
    });
  }

  if (features && features.length === 0) {
    // Not hovering any polygon - remove marker -
    if (marker) {
      marker.remove();
      useMarkerStore.getState().setMarker(null);
      useMarkerStore.getState().setCurrent_Id("");
    }
  }
}
export default SetQueryFeatures;
