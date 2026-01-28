import axios, { AxiosError, AxiosResponse } from "axios";
import { crime_Endpoints } from "@/helpers/request_Helpers";
import { CrimeType, PolygonType, useMapListenerEvents } from "@/store/store";
import maplibregl, { Map } from "maplibre-gl";
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
async function CrimeClusterFetching({
  crime_Selected,
  date_Selected,
  location,
}: {
  date_Selected: string;
  crime_Selected: string;
  location: string;
}) {
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

  //cluster data
  const { data: crime_Data } = await axios.get(
    `${url}${endPoint?.request_Endpoint}`,
    config,
  );

  //polygon data
  const polygon_Endpoint = polygon_Endpoints.find((item) =>
    item.location === location ? item : null,
  );
  const { data: polygon_Data } = await axios.get(
    `${url}${polygon_Endpoint?.request_Endpoint}`,
  );

  const SetLayers = useMapStore.getState().setActiveLayers;
  const SetSources = useMapStore.getState().setActiveSources;
  const setActiveMapSource = useActiveMapStore.getState().setActiveMapSource;

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

  setActiveMapType("Cluster");

  try {
    const cluster = await CreateClusterType(
      crime_Data,
      location,
      crime_Selected,
      map as maplibregl.Map,
      date_Selected,
      polygon_Data as PolygonType[],
      SetLayers,
      SetSources,
      setActiveMapSource,
    );

    return cluster;
  } catch (e) {
    console.log(e, "Something has gone wrong");
    return null;
  }
}

async function CreateClusterType(
  crime_Data: CrimeType[],
  location: string,
  crime_Selected: string,
  map: maplibregl.Map,
  date_Selected: string,
  polygon_Data: PolygonType[],
  SetLayers: (f: string[]) => void,
  SetSources: (f: string[]) => void,
  setActiveMapSource: (f: string) => void,
) {
  try {
    const source_Name = `Cluster-Crime-Source-${location}-${crime_Selected}`;
    const layer_Name = `Cluster-Crime-Layer-${location}-${crime_Selected}`;
    /// Add the cluster source

    if (!map.getSource(source_Name)) {
      map?.addSource(source_Name, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      map.addLayer({
        id: layer_Name,
        type: "circle",
        source: source_Name,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6", // < 100 points
            100,
            "#f1f075", // 100-750 points
            750,
            "#f28cb1", // >= 750 points
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20, // < 100 points
            100,
            30, // 100-750 points
            750,
            40, // >= 750 points
          ],
        },
      });

      // 2. Cluster count labels
      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: source_Name,
        filter: ["has", "point_count"],
        layout: {
          "text-field": "{point_count_abbreviated}",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      // 3. Unclustered points (individual circles)
      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: source_Name,
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#11b4da",
          "circle-radius": 6,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#fff",
        },
      });

      setActiveMapSource(source_Name);
      SetSources([source_Name]);
      SetLayers([layer_Name, "cluster-count", "unclustered-point"]);
      const points = [];
      for (const [index, element] of Object.entries(crime_Data)) {
        const point = createFeaturePoint(
          element.longitude,
          element.latitude,
          element[date_Selected as keyof CrimeType],
          element.borough_Name,
          index,
        );

        points.push(point);
      }

      const active_Source = map?.getSource(source_Name) as GeoJSONSource;
      active_Source.updateData({ add: [...points] });
    }
    /// add the polygons for it
    for (const element of polygon_Data) {
      const source_Cluster = `Polygon-Invisible-Source-${element.Borough_Name}`;
      const layer_Cluster = `Polygon-Invisible-Layer-${element.Borough_Name}`;
      const line = `Polygon-Invisible-Line-Layer-${element.Borough_Name}`;
      SetSources([source_Cluster]);
      SetLayers([layer_Cluster, line]);

      if (!map?.getSource(source_Cluster)) {
        map?.addSource(source_Cluster, {
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
          id: layer_Cluster,
          type: "fill",
          source: source_Cluster,
          layout: {},
          paint: {
            "fill-color": "white",
            "fill-opacity": 0,
            "fill-opacity-transition": { duration: 100, delay: 0 },
            "fill-color-transition": { duration: 100, delay: 0 },
          },
        });

        map?.addLayer(
          {
            id: line,
            type: "line",
            source: source_Cluster,
            paint: {
              "line-color": "white",
              "line-width": 2,
              "line-opacity": 0.2,
              "line-blur": 0,
              "line-blur-transition": { duration: 200, delay: 0 },
            },
          },
          layer_Name,
        );

        map.on("mouseenter", layer_Cluster, () => {
          map.setPaintProperty(line, "line-opacity", 1);
          map.setPaintProperty(line, "line-width", 3);
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", layer_Cluster, () => {
          map.setPaintProperty(line, "line-opacity", 0.2);
          map.setPaintProperty(line, "line-width", 2);
          map.getCanvas().style.cursor = "";
        });

        map?.on("mouseup", layer_Cluster, () => {
          const setDrawer = useSingleDrawerStore.getState().useSetDrawer;
          const setDrawerName =
            useSingleDrawerStore.getState().useSetDrawerBorough;
          setDrawerName(element.Borough_Name);
          setDrawer(true);
        });
      } else {
        console.log(" Something went wrong if its not loading");
      }
    }

    return true;
  } catch (e) {
    console.log(e, "Something went wrong");
    return null;
  }
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

function createFeaturePoint(
  longitude: string,
  latitude: string,
  amount: string,
  borough_Name: string,
  index: string,
): Feature {
  const new_Longitude = Number(longitude) + (Math.random() - 0.5) * 0.01;
  const new_Latitude = Number(latitude) + (Math.random() - 0.5) * 0.01;

  //// ?????????????????? in what brain dead univers I wrote this magnificent code  ? ?????
  // const coords = () => {
  //   if (Number(index) % 2) {
  //     return [new_Longitude, new_Latitude];
  //   } else {
  //     return [new_Longitude, new_Latitude];
  //   }
  // };

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
      coordinates: [new_Longitude, new_Latitude],
    },
  };

  return geoPoint;
}

export default CrimeClusterFetching;
