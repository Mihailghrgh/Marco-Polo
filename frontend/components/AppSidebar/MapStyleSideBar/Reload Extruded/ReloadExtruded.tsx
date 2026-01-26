import { Map } from "maplibre-gl";
import { useCrimeStore, useMapStore } from "@/store/store";
import { heath_layer } from "@/components/MapLayerTypes/map_layers";
import { GeoJSONSource } from "maplibre-gl";
import { CrimeType } from "@/store/store";
import { useSingleDrawerStore } from "@/store/store";
import type { Feature, Geometry, Point, Position } from "geojson";
import { useActiveMapStore } from "@/store/store";
import { useMapListenerEvents } from "@/store/store";
import { extrusion_layer } from "@/components/MapLayerTypes/map_layers";

async function ReloadExtruded() {
  const crime_Selected = useCrimeStore.getState().type;
  const map = useMapStore.getState().map;
  const extrusion_Data = useCrimeStore.getState().crime_data;
  const date_Selected = useSingleDrawerStore.getState().date;
  const location = useSingleDrawerStore.getState().city;

  const setActiveMapType = useActiveMapStore.getState().setActiveMapType;
  const setActiveMapSource = useActiveMapStore.getState().setActiveMapSource;
  const setActiveMapLayer = useActiveMapStore.getState().setActiveMapLayer;

  const source_Name: string = `Extruded-Source-${location}-${crime_Selected}`;
  const layer_Name: string = `Extruded-Layer-${location}-${crime_Selected}`;
  const setMapListenerEvents =
    useMapListenerEvents.getState().setMapListenerEvents;

  setActiveMapSource(source_Name);
  setActiveMapLayer(layer_Name);
  setActiveMapType("Extruded");
  setMapListenerEvents("extruded", layer_Name);

  if (!map?.getSource(source_Name)) {
    //setting up the source empty first hand
    map?.addSource(source_Name, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });

    //setting up the extruded layer and as active layer for manipulation
    const extrude_map_layer = extrusion_layer(layer_Name, source_Name);
    const points: Feature[] = [];
    map?.addLayer(extrude_map_layer);

    for (const [index, element] of Object.entries(extrusion_Data.flat())) {
      //create polygon feature point for extrusion
      const point = CreateFeaturePoint(
        element.longitude,
        element.latitude,
        element[date_Selected as keyof CrimeType],
        element.borough_Name,
      );

      if (point !== null && point.type === "Feature") {
        points.push(point);
      } else {
        continue;
      }
    }
    //active source cuz maplibre doesnt like to add data in loop and cuz its retarded
    const active_Source = map?.getSource(source_Name) as GeoJSONSource;
    active_Source?.updateData({ add: [...points] });
  }
}

function CreateFeaturePoint(
  longitude: string,
  latitude: string,
  amount: string,
  borough_Name: string,
): Feature | null {
  const new_Longitude = Number(longitude) + (Math.random() - 0.5) * 0.01;
  const new_Latitude = Number(latitude) + (Math.random() - 0.5) * 0.01;
  const id = `${borough_Name}-${Math.floor(Math.random() * 10000000)}`;

  if (isNaN(Number(longitude)) || isNaN(Number(latitude))) {
    return null;
  }

  const coords = (
    lng: number,
    lat: number,
    offset: number = 0.004,
  ): Position[] => {
    return [
      [lng, lat],
      [lng + offset, lat],
      [lng + offset, lat + offset],
      [lng, lat + offset],
    ];
  };

  const height = (amount: string): number => {
    const amt = Number(amount);
    const uniqueOffset = 1 + Math.random() * 1000;
    if (amt === 0) return 0;
    if (amt < 5) return 1000 + Math.random() * 500 + uniqueOffset;
    if (amt <= 10) return 2000 + Math.random() * 1000 + uniqueOffset;
    if (amt <= 25) return 5000 + Math.random() * 2000 + uniqueOffset;
    if (amt <= 50) return 8000 + Math.random() * 3000 + uniqueOffset;
    if (amt <= 100) return 12000 + Math.random() * 4000 + uniqueOffset;
    if (amt <= 200) return 18000 + Math.random() * 5000 + uniqueOffset;
    return 25000 + Math.random() * 8000 + uniqueOffset;
  };

  //no point to show zero height extrusions on a map
  if (height(amount) === 0) {
    return null;
  }

  const color = `hsl(0, 100%, ${45 + (height(amount) / 5000) * 10}%)`;

  const geoPoint: Feature = {
    type: "Feature",
    id: id,
    properties: {
      name: borough_Name,
      place: borough_Name,
      height: height(amount),
      color: color,
      base: 0,
    },
    geometry: {
      type: "Polygon",
      coordinates: [coords(new_Longitude, new_Latitude)],
    },
  };

  return geoPoint;
}
export default ReloadExtruded;
