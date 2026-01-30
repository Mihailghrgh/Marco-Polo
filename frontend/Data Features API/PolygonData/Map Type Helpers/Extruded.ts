import { PolygonType, useActiveMapStore } from "@/store/store";
import maplibregl from "maplibre-gl";
import { heath_layer } from "@/components/MapLayerTypes/map_layers";
import { CrimeType } from "@/store/store";
import { GeoJSONSource } from "maplibre-gl";
import { extrusion_layer } from "@/components/MapLayerTypes/map_layers";

export async function Extruded(
  map: maplibregl.Map,
  borough_Name: string,
  polygon_Prop: PolygonType[],
  activeCrimeTypes: CrimeType[],
  local_Layer: string,
) {
  const activeMapSource = useActiveMapStore.getState().active_Map_Source;
  const short_Data = (await map.getSource(activeMapSource)) as GeoJSONSource;
  const data_feature = [];

  if (!short_Data?._data?.updateable) {
    return;
  }

  for (const element of short_Data?._data?.updateable?.values()) {
    if (element.properties?.place === borough_Name) {
      data_feature.push(element);
    }
  }

  // Active Map Type (Extruded) and Layer (Extruded)
  const activeMapLayer = useActiveMapStore.getState().active_map_layer;
  const activeMapType = useActiveMapStore.getState().active_Map_Type;
  map?.setPaintProperty(activeMapLayer, "fill-extrusion-opacity", 0.2);
  // Short Lived Source and Layer to Manipulate
  const setShortLivedMapSource =
    useActiveMapStore.getState().setShortLivedSource;
  const setShortLivedMapLayer = useActiveMapStore.getState().setShortLivedLayer;

  //creating id and source for Short Lived Source and Layer
  const local_id = `${activeMapType}-local-layer-${borough_Name}`;
  const source = `${activeMapType}-local-source-${borough_Name}`;

  // Short Lived Source and Layer variables to check and remove previous ones just in case
  const short_lived_map_source =
    useActiveMapStore.getState().short_lived_map_source;
  const short_lived_map_layer =
    useActiveMapStore.getState().short_lived_map_layer;

  if (short_lived_map_layer && short_lived_map_layer !== local_id) {
    if (map?.getLayer(short_lived_map_layer)) {
      map.removeLayer(short_lived_map_layer);
    }
    if (map?.getSource(short_lived_map_source)) {
      map.removeSource(short_lived_map_source);
    }
  }

  //creating local source
  if (!map?.getSource(source)) {
    //creating local source name
    map?.addSource(source, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [...data_feature] },
    });

    //creating local layer
    const local_Layer = extrusion_layer(local_id, source);
    map?.addLayer(local_Layer);

    //Setting the local Source and Layers to be manipulated
    setShortLivedMapSource(source);
    setShortLivedMapLayer(local_id);
  }

  //setting up the transition after the polygon is hovered / selected
}

export function resetExtrudedTransition(
  map: maplibregl.Map,
  borough_Name: string,
) {
  //setting the Data Map to Normal
  const active_map_layer = useActiveMapStore.getState().active_map_layer;

  //setting the short lived map to be deleted and its children
  const short_lived_map_source =
    useActiveMapStore.getState().short_lived_map_source;
  const short_lived_map_layer =
    useActiveMapStore.getState().short_lived_map_layer;
  //remove layer and source of the type existing
  if (
    short_lived_map_layer.includes(borough_Name) &&
    map?.getLayer(short_lived_map_layer)
  ) {
    {
      map?.removeLayer(short_lived_map_layer);
      map?.removeSource(short_lived_map_source);
    }
  }

  map?.setPaintProperty(active_map_layer, "fill-extrusion-opacity", 1);
}
