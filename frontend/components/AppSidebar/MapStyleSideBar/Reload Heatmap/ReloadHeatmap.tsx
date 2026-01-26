import { Map } from "maplibre-gl";
import { useCrimeStore, useMapStore } from "@/store/store";
import { heath_layer } from "@/components/MapLayerTypes/map_layers";
import { GeoJSONSource } from "maplibre-gl";
import { CrimeType } from "@/store/store";
import { useSingleDrawerStore } from "@/store/store";
import type { Feature, Point } from "geojson";
import { useActiveMapStore } from "@/store/store";
import { useMapListenerEvents } from "@/store/store";

async function ReloadHeatmap() {
  const crime_Selected = useCrimeStore.getState().type;
  const mapGl = useMapStore.getState().map;
  const heatmap_Prop = useCrimeStore.getState().crime_data;
  const date_Selected = useSingleDrawerStore.getState().date;
  const location = useSingleDrawerStore.getState().city;
  
  const setActiveMapLayer = useActiveMapStore.getState().setActiveMapLayer;
  const setActiveMapType = useActiveMapStore.getState().setActiveMapType;
  const setActiveMapSource = useActiveMapStore.getState().setActiveMapSource;
  const setMapListenerEvents =
    useMapListenerEvents.getState().setMapListenerEvents;

  const source_Name = `Heatmap-Source-${location}-${crime_Selected}`;
  const layer_Name = `Heatmap-Layer-${location}-${crime_Selected}`;

  //setting this shit map type shit
  setActiveMapSource(source_Name);
  setActiveMapLayer(layer_Name);
  setActiveMapType("Heatmap");
  setMapListenerEvents("heatmap", layer_Name);

  if (!mapGl?.getSource(source_Name)) {
    //setting up the source empty first hand
    mapGl?.addSource(source_Name, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });

    //setting up the heatmap layer and as active layer for manipulation
    const heath_map_layer = heath_layer(layer_Name, source_Name);
    mapGl?.addLayer(heath_map_layer);

    const points = [];
    for (const [index, element] of Object.entries(heatmap_Prop.flat())) {
      const point = createFeaturePoint(
        element.longitude,
        element.latitude,
        element[date_Selected as keyof CrimeType],
        element.borough_Name,
        index,
      );

      points.push(point);
    }

    const active_Source = mapGl?.getSource(source_Name) as GeoJSONSource;
    active_Source.updateData({ add: [...points] });
  }
}

function createFeaturePoint(
  longitude: string,
  latitude: string,
  amount: string,
  borough_Name: string,
  index: string,
): Feature {
  const new_Longitude = Number(longitude) + (Math.random() - 0.5) * 0.01;
  const new_Latitude = Number(latitude) + (Math.random() - 0.5) * 0.01;

  const coords = () => {
    if (Number(index) % 2) {
      return [new_Longitude, new_Latitude];
    } else {
      return [new_Longitude, new_Latitude];
    }
  };

  const height = (amount: string) => {
    return Number(amount) < 50
      ? Math.random() * 1
      : Number(amount) < 200
        ? 1 + Math.random() * 2
        : 2 + Math.random() * 3;
  };

  const geoPoint: Feature = {
    type: "Feature",
    id: `${borough_Name}-${1 * (Math.random() * 10)}`,
    properties: {
      magnitude: height(amount),
      place: borough_Name,
      name: borough_Name,
    },
    geometry: {
      type: "Point",
      coordinates: coords(),
    },
  };

  return geoPoint;
}

export default ReloadHeatmap;
