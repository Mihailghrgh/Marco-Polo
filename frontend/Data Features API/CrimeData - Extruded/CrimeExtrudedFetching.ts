import axios, { AxiosError, AxiosResponse } from "axios";
import { crime_Endpoints } from "@/helpers/request_Helpers";
import { CrimeType, useMapListenerEvents } from "@/store/store";
import maplibregl, { Map, typeOf } from "maplibre-gl";
import { heath_layer } from "@/components/MapLayerTypes/map_layers";
import { GeoJSONSource } from "maplibre-gl";
import type { Feature, Geometry, Point, Position } from "geojson";
import { useActiveMapStore } from "@/store/store";
import { useCrimeStore } from "@/store/store";
import { useSingleDrawerStore } from "@/store/store";
import { useMapStore } from "@/store/store";
import { extrusion_layer } from "@/components/MapLayerTypes/map_layers";
import { DestroyLayersAndSources } from "../CleanUp/DestroyAll";

async function CrimeExtrudedFetching({
  crime_Selected,
  date_Selected,
  location,
}: {
  date_Selected: string;
  crime_Selected: string;
  location: string;
}) {
  try {
    const map = useMapStore.getState().map;
    // FOR ELEMINATION THE OCCUPATION
    // WE WILL START OUR OPERATION IF AMERICA IS AGAINST THE AFGHAN NATION
    await DestroyLayersAndSources();
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const config = { params: { crime: crime_Selected, date: date_Selected } };
    const endPoint = crime_Endpoints.find(
      (item: { location: string; request_Endpoint: string }) =>
        item.location === location,
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

    setActiveMapType("Extruded");

    //set Map Sources and Layers to later use their ID's for map transition
    const SetLayers = useMapStore.getState().setActiveLayers;
    const SetSources = useMapStore.getState().setActiveSources;

    const source = setExtrudedMapLayer(
      map as maplibregl.Map,
      data,
      crime_Selected,
      location,
      setActiveMapLayer,
      date_Selected,
      SetLayers,
      SetSources,
      setActiveMapSource,
    );

    return source;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error(
        "Axios error fetching extruded crime data:",
        axiosError.message,
      );
      return null;
    } else {
      console.error("Unexpected error fetching extruded crime data:", error);
      return null;
    }
  }
}

function setExtrudedMapLayer(
  map: maplibregl.Map,
  data: CrimeType[],
  location: string,
  crime_Selected: string,
  setActiveMapLayer: (f: string) => void,
  date_Selected: string,
  SetLayers: (f: string[]) => void,
  SetSources: (f: string[]) => void,
  setActiveMapSource: (f: string) => void,
) {
  try {
    const source_Name: string = `Extruded-Source-${location}-${crime_Selected}`;
    const layer_Name: string = `Extruded-Layer-${location}-${crime_Selected}`;
    const setMapListenerEvents =
      useMapListenerEvents.getState().setMapListenerEvents;

    if (!map?.getSource(source_Name)) {
      //setting up the source empty first hand
      map?.addSource(source_Name, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      //setting up the extruded layer and as active layer for manipulation
      const extrude_map_layer = extrusion_layer(layer_Name, source_Name);
      const points: Feature[] = [];
      map.addLayer(extrude_map_layer);

      for (const [index, element] of Object.entries(data)) {
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
      SetSources([source_Name]);
      SetLayers([layer_Name]);
      setActiveMapSource(source_Name);
      setMapListenerEvents("extruded", layer_Name);
      setActiveMapLayer(layer_Name);
      return true;
    } else {
      if (map?.getLayer(layer_Name)) map.removeLayer(layer_Name);
      if (map?.getSource(source_Name)) map.removeSource(source_Name);

      map?.addSource(source_Name, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      //setting up the extruded layer and as active layer for manipulation
      const extrude_map_layer = extrusion_layer(layer_Name, source_Name);
      const points: Feature[] = [];
      map.addLayer(extrude_map_layer);

      for (const [index, element] of Object.entries(data)) {
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
      SetSources([source_Name]);
      SetLayers([layer_Name]);
      setActiveMapSource(source_Name);
      setMapListenerEvents("extruded", layer_Name);
      setActiveMapLayer(layer_Name);
      return true;
    }
  } catch (e) {
    console.log(e, "Something went wrong");
    return null;
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
export default CrimeExtrudedFetching;
