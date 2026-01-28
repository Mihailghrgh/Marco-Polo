import axios, { AxiosError, AxiosResponse } from "axios";
import { crime_Endpoints } from "@/helpers/request_Helpers";
import { CrimeType, PolygonType, useMapListenerEvents } from "@/store/store";
import maplibregl from "maplibre-gl";
import { heath_layer } from "@/components/MapLayerTypes/map_layers";
import { GeoJSONSource } from "maplibre-gl";
import type { Feature, Point } from "geojson";
import { useActiveMapStore } from "@/store/store";
import { useCrimeStore } from "@/store/store";
import { useSingleDrawerStore } from "@/store/store";
import { useMapStore } from "@/store/store";
import { DestroyLayersAndSources } from "../CleanUp/DestroyAll";
import { polygon_Endpoints } from "@/helpers/request_Helpers";

type endpoint = { location: string; request_Endpoint: string };
async function CrimePolygonFetching({
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
    if (!map?.isStyleLoaded()) {
      await new Promise<void>((resolve) => {
        map?.once("styledata", () => resolve());
      });
    }

    await DestroyLayersAndSources(); //layers, sources, listeners map.off basically and map.removeLayer / removeSources

    ///Crime fetching
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const config = { params: { crime: crime_Selected, date: date_Selected } };
    const endPoint = crime_Endpoints.find(
      (item: endpoint) => item.location === location,
    );
    const { data: crime_Data } = await axios.get(
      `${url}${endPoint?.request_Endpoint}`,
      config,
    );

    ///Polygon Fetching
    const polygon_Endpoint = polygon_Endpoints.find((item) =>
      item.location === location ? item : null,
    );
    const { data: polygon_Data } = await axios.get(
      `${url}${polygon_Endpoint?.request_Endpoint}`,
    );

    const SetLayers = useMapStore.getState().setActiveLayers;
    const SetSources = useMapStore.getState().setActiveSources;
    const setActiveMapSource = useActiveMapStore.getState().setActiveMapSource;

    //set the Crimes fetched for global store
    const addCrime = useCrimeStore.getState().addCrime;
    const addCity = useSingleDrawerStore.getState().useSetCity;
    const setCrimeType = useSingleDrawerStore.getState().useSetCrimeType;
    const setDate = useSingleDrawerStore.getState().useSetDate;
    const setActiveMapType = useActiveMapStore.getState().setActiveMapType;
    //setting global var location / date / crime / crime_data etc....
    addCity(location);
    setDate(date_Selected);
    setCrimeType(crime_Selected);
    setCrimeStore(crime_Data, addCrime);

    setActiveMapType("Polygon");
    const crime_Map = crime_Max_Queue(crime_Data, date_Selected);
    const data = CreatePolygonType(
      crime_Map,
      polygon_Data,
      location,
      crime_Selected,
      map as maplibregl.Map,
      SetLayers,
      SetSources,
      setActiveMapSource,
    );
    return data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

function CreatePolygonType(
  crime_Data: Map<string, number>,
  polygon_Data: PolygonType[],
  location: string,
  crime_Selected: string,
  map: maplibregl.Map,
  SetLayers: (f: string[]) => void,
  SetSources: (f: string[]) => void,
  setActiveMapSource: (f: string) => void,
) {
  try {
    const setMapListenerEvents =
      useMapListenerEvents.getState().setMapListenerEvents;

    const amounts = [...crime_Data.values()];
    const minAmount = Math.min(...amounts);
    const maxAmount = Math.max(...amounts);

    let marker: maplibregl.Popup | null = null;

    for (const element of polygon_Data) {
      const source_Name = `Polygon-Crime-Source-${element.Borough_Name}-${crime_Selected}-${location}`;
      const layer_Name = `Polygon-Crime-Layer-${element.Borough_Name}-${crime_Selected}-${location}`;
      const line = `Polygon-Crime-Line-Layer-${element.Borough_Name}`;

      SetSources([source_Name]);
      SetLayers([layer_Name, line]);
      setMapListenerEvents("polygon", layer_Name);
      if (!map?.getSource(source_Name)) {
        const amount = crime_Data.get(element.Borough_Name);
        const normalized =
          (Number(amount) - minAmount) / (maxAmount - minAmount);
        const lightGreen = [200, 250, 200];
        const darkGreen = [5, 46, 5];

        const r = Math.round(
          lightGreen[0] + (darkGreen[0] - lightGreen[0]) * normalized,
        );
        const g = Math.round(
          lightGreen[1] + (darkGreen[1] - lightGreen[1]) * normalized,
        );
        const b = Math.round(
          lightGreen[2] + (darkGreen[2] - lightGreen[2]) * normalized,
        );

        const color = (r: number, g: number, b: number) => {
          if (!r || !g || !b) {
            return `rgb(213 , 250 ,224)`;
          } else {
            return `rgb(${r}, ${g}, ${b})`;
          }
        };

        map?.addSource(source_Name, {
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

        map?.addLayer({
          id: layer_Name,
          type: "fill",
          source: source_Name,
          layout: {},
          paint: {
            "fill-color": color(r, g, b),
            "fill-opacity": 0.9,
            "fill-opacity-transition": { duration: 100, delay: 0 },
            "fill-color-transition": { duration: 100, delay: 0 },
          },
        });

        map.on("mouseenter", layer_Name, () => {
          map.setPaintProperty(layer_Name, "fill-opacity", 1);
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", layer_Name, () => {
          map.setPaintProperty(layer_Name, "fill-opacity", 0.8);
          map.getCanvas().style.cursor = "";
        });

        //just the line layer nothing else
        map?.addLayer({
          id: line,
          type: "line",
          source: source_Name,
          paint: { "line-color": "white", "line-width": 4 },
        });

        map?.on("mousemove", layer_Name, (e) => {
          if (marker) {
            marker?.remove();
            marker = null;
          }
          const point = map.project(e.lngLat);
          point.y -= 15;
          const adjustedLngLat = map.unproject(point);

          marker = new maplibregl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: "custom-popup",
          })
            .setHTML(
              `<div class="popup-content">
            <div class="text-lg font-bold text-green-800">Crimes: ${amount}</div>
            <div class="text-lg  text-black">Area: ${element.Borough_Name}</div>
                </div>`,
            )
            .setLngLat(adjustedLngLat)
            .addTo(map);

          const popupElement = marker.getElement();
        });

        map?.on("mouseleave", layer_Name, () => {
          marker?.remove() as maplibregl.Popup;
          marker = null;
        });

        map?.on("mouseup", layer_Name, () => {
          const setDrawer = useSingleDrawerStore.getState().useSetDrawer;
          const setDrawerName =
            useSingleDrawerStore.getState().useSetDrawerBorough;
          setDrawerName(element.Borough_Name);
          setDrawer(true);
        });
      }
    }

    return true;
  } catch (e) {
    console.log(e);
    return null;
  }
}

const crime_Max_Queue = (crime_data: CrimeType[], date: string) => {
  const map = new Map<string, number>();
  for (const item of crime_data) {
    // Initialize if borough doesn't exist
    if (!map.has(item.borough_Name)) {
      map.set(item.borough_Name, 0);
    }

    // Sum all properties that end with the date
    for (const [key, value] of Object.entries(item)) {
      if (key.endsWith(date)) {
        const currentAmount = map.get(item.borough_Name) || 0;
        map.set(item.borough_Name, currentAmount + Number(value));
      }
    }
  }

  return map;
};

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
export default CrimePolygonFetching;
