import axios, { AxiosError, AxiosResponse } from "axios";
import { crime_Endpoints } from "@/helpers/request_Helpers";
import { CrimeType, useMapListenerEvents } from "@/store/store";
import maplibregl, { Map } from "maplibre-gl";
import { heath_layer } from "@/components/MapLayerTypes/map_layers";
import { GeoJSONSource } from "maplibre-gl";
import type { Feature, Point } from "geojson";
import { useActiveMapStore } from "@/store/store";
import { useCrimeStore } from "@/store/store";
import { useSingleDrawerStore } from "@/store/store";
import { mousemoveHandlers } from "@/Data Features API/PolygonData/Map Type Helpers/handler";
import { usePolygonCollectionStore } from "@/store/store";
import { useMapStore } from "@/store/store";
import { DestroyLayersAndSources } from "../CleanUp/DestroyAll";

type polygon = { location: string; request_Endpoint: string };
async function CrimeHeatmapFetching({
  crime_Selected,
  date_Selected,
  location,
}: {
  date_Selected: string;
  crime_Selected: string;
  location: string;
}) {
  try {
    /// FOR ELIMINATION THE OCCUPATION
    /// WE WILL EXECUTE THE OPERATION
    const map = useMapStore.getState().map;
    if (!map?.isStyleLoaded()) {
      await new Promise<void>((resolve) => {
        map?.once("styledata", () => resolve());
      });
    }

    await DestroyLayersAndSources(); //layers, sources, listeners map.off basically and map.removeLayer / removeSources

    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const config = { params: { crime: crime_Selected, date: date_Selected } };
    const endPoint = crime_Endpoints.find(
      (item: polygon) => item.location === location,
    );
    const { data } = await axios.get(
      `${url}${endPoint?.request_Endpoint}`,
      config,
    );

    //set the Crimes fetched for global store
    const addCrime = useCrimeStore.getState().addCrime;
    const addCity = useSingleDrawerStore.getState().useSetCity;
    const setCrimeType = useSingleDrawerStore.getState().useSetCrimeType;
    const setDate = useSingleDrawerStore.getState().useSetDate;

    //setting global var location / date / crime / crime_data etc....
    addCity(location);
    setDate(date_Selected);
    setCrimeType(crime_Selected);
    setCrimeStore(data, addCrime);

    //set Global Map Sources and Layer
    const setActiveMapLayer = useActiveMapStore.getState().setActiveMapLayer;
    const setActiveMapType = useActiveMapStore.getState().setActiveMapType;
    const setActiveMapSource = useActiveMapStore.getState().setActiveMapSource;

    setActiveMapType("Heatmap");
    //set Map Sources and Layers to later use their ID's for map transition
    const SetLayers = useMapStore.getState().setActiveLayers;
    const SetSources = useMapStore.getState().setActiveSources;

    const source = setHeatMapLayer(
      map as maplibregl.Map,
      data,
      crime_Selected as string,
      setActiveMapLayer,
      date_Selected,
      SetLayers,
      SetSources,
      location,
      setActiveMapSource,
    );

    return source;
  } catch (e) {
    console.log("Something went wrong", e);
    return null;
  }
}

function setHeatMapLayer(
  mapGl: maplibregl.Map,
  heathmap_Prop: CrimeType[],
  crime_Selected: string,
  setActiveMapLayer: (f: string) => void,
  date_Selected: string,
  SetLayers: (f: string[]) => void,
  SetSources: (f: string[]) => void,
  location: string,
  setActiveMapSource: (f: string) => void,
) {
  try {
    const setMapListenerEvents =
      useMapListenerEvents.getState().setMapListenerEvents;
    const source_Name = `Heatmap-Source-${location}-${crime_Selected}`;
    const layer_Name = `Heatmap-Layer-${location}-${crime_Selected}`;

    if (!mapGl?.getSource(source_Name)) {
      //setting up the source empty first hand
      mapGl?.addSource(source_Name, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      //setting up the heatmap layer and as active layer for manipulation
      const heath_map_layer = heath_layer(layer_Name, source_Name);
      mapGl.addLayer(heath_map_layer);

      for (const [index, element] of Object.entries(heathmap_Prop)) {
        const active_Source = mapGl?.getSource(source_Name) as GeoJSONSource;

        const point = createFeaturePoint(
          element.longitude,
          element.latitude,
          element[date_Selected as keyof CrimeType],
          element.borough_Name,
          index,
        );

        active_Source.updateData({ add: [point] });
      }

      SetSources([source_Name]);
      SetLayers([layer_Name]);
      //setting this shit map type shit
      setMapListenerEvents("heatmap", layer_Name);
      setActiveMapSource(source_Name);
      setActiveMapLayer(layer_Name);

      return true;
    } else {
      // Source exists → delete first
      if (mapGl?.getLayer(layer_Name)) mapGl.removeLayer(layer_Name);
      if (mapGl?.getSource(source_Name)) mapGl.removeSource(source_Name);

      // Now repeat the same addition code
      mapGl?.addSource(source_Name, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      const heath_map_layer = heath_layer(layer_Name, source_Name);
      mapGl.addLayer(heath_map_layer);

      for (const [index, element] of Object.entries(heathmap_Prop)) {
        const active_Source = mapGl?.getSource(source_Name) as GeoJSONSource;

        const point = createFeaturePoint(
          element.longitude,
          element.latitude,
          element[date_Selected as keyof CrimeType],
          element.borough_Name,
          index,
        );

        active_Source.updateData({ add: [point] });
      }

      SetSources([source_Name]);
      SetLayers([layer_Name]);
      //setting this shit map type shit
      setMapListenerEvents("heatmap", layer_Name);
      setActiveMapSource(source_Name);
      setActiveMapLayer(layer_Name);

      return true;
    }
  } catch (e) {
    console.log(e , "Something went wrong");
    return null
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

function setCrimeStore(data: CrimeType[], addCrime: (f: CrimeType) => void) {
  for (const value of data) {
    const point = createCrimeType(value);
    addCrime(point);
  }
}

function createCrimeType(data: CrimeType) {
  const point = {
    major_Crime: data.major_Crime,
    specific_Crime: data.specific_Crime,
    ward_Name: data.ward_Name,
    ward_Code: data.ward_Code,
    borough_Name: data.borough_Name,
    latitude: data.latitude,
    longitude: data.longitude,
    nov_2023: data.nov_2023,
    dec_2023: data.dec_2023,
    jan_2024: data.jan_2024,
    feb_2024: data.feb_2024,
    mar_2024: data.mar_2024,
    apr_2024: data.apr_2024,
    may_2024: data.may_2024,
    jun_2024: data.jun_2024,
    jul_2024: data.jul_2024,
    aug_2024: data.aug_2024,
    sep_2024: data.sep_2024,
    oct_2024: data.oct_2024,
    nov_2024: data.nov_2024,
    dec_2024: data.dec_2024,
    jan_2025: data.jan_2025,
    feb_2025: data.feb_2025,
    mar_2025: data.mar_2025,
    apr_2025: data.apr_2025,
    may_2025: data.may_2025,
    jun_2025: data.jun_2025,
    jul_2025: data.jul_2025,
    aug_2025: data.aug_2025,
    sep_2025: data.sep_2025,
    oct_2025: data.oct_2025,
  };

  return point;
}
export default CrimeHeatmapFetching;
