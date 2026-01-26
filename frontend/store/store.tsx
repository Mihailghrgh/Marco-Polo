import { create, createStore } from "zustand";
import { FeatureCollection, Point, GeoJsonProperties, Feature } from "geojson";
import maplibregl, { Map } from "maplibre-gl";

export type CrimeType = {
  major_Crime: string;
  specific_Crime: string;
  ward_Name: string;
  ward_Code: string;
  borough_Name: string;
  latitude: string;
  longitude: string;
  nov_2023: string;
  dec_2023: string;
  jan_2024: string;
  feb_2024: string;
  mar_2024: string;
  apr_2024: string;
  may_2024: string;
  jun_2024: string;
  jul_2024: string;
  aug_2024: string;
  sep_2024: string;
  oct_2024: string;
  nov_2024: string;
  dec_2024: string;
  jan_2025: string;
  feb_2025: string;
  mar_2025: string;
  apr_2025: string;
  may_2025: string;
  jun_2025: string;
  jul_2025: string;
  aug_2025: string;
  sep_2025: string;
  oct_2025: string;
};

export type CrimeCollectionType = {
  type: string;
  crime_data: CrimeType[];
  addCrime: (crime: CrimeType) => void;
};

export const useCrimeStore = create<CrimeCollectionType>()((set) => ({
  type: "CrimeCollection",
  crime_data: [],
  addCrime: (f) => set((state) => ({ crime_data: [...state.crime_data, f] })),
}));

export type MapCollectionType = {
  map: maplibregl.Map | null;
  refresh_Map_Sources: string[];
  refresh_Map_Layers: string[];
  setActiveSources: (f: string[]) => void;
  setActiveLayers: (f: string[]) => void;
  setMap: (f: maplibregl.Map) => void;
  clearActiveSources: () => void;
  clearActiveLayers: () => void;
};

export const useMapStore = create<MapCollectionType>()((set) => ({
  map: null,
  refresh_Map_Sources: [],
  refresh_Map_Layers: [],
  setActiveSources: (f) => {
    set((state) => ({
      refresh_Map_Sources: [...state.refresh_Map_Layers, ...f],
    }));
  },
  setActiveLayers: (f) => {
    set((state) => ({
      refresh_Map_Layers: [...state.refresh_Map_Layers, ...f],
    }));
  },
  setMap: (mapInstance) => set({ map: mapInstance }),
  clearActiveSources: () => {
    set(() => ({ refresh_Map_Sources: [] }));
  },
  clearActiveLayers: () => set(() => ({ refresh_Map_Layers: [] })),
}));

type PolygonCoordinatesType = [number, number][];

export type PolygonType = {
  Borough_Name: string;
  coordinates: PolygonCoordinatesType;
};

type PolygonDataType = {
  type: string;
  data: PolygonType[];
  setPolygonData: (f: PolygonType[]) => void;
};

export const usePolygonCollectionStore = create<PolygonDataType>()((set) => ({
  type: "PolygonCollectionType",
  data: [],
  setPolygonData: (f) => set(() => ({ data: f })),
}));

type ActiveMapType = {
  type: string;
  polygon: string | null;
  active_map_layer: string;
  active_Map_Source: string;
  short_lived_map_layer: string;
  short_lived_map_source: string;
  active_Map_Type: string;
  setPolygon: (f: string) => void;
  setActiveMapSource: (f: string) => void;
  setActiveMapType: (f: string) => void;
  setActiveMapLayer: (f: string) => void;
  setShortLivedLayer: (f: string) => void;
  setShortLivedSource: (f: string) => void;
};

export const useActiveMapStore = create<ActiveMapType>()((set) => ({
  type: "ActiveMapType",
  polygon: null,

  short_lived_map_layer: "",
  short_lived_map_source: "",

  active_map_layer: "",
  active_Map_Type: "",
  active_Map_Source: "",

  setPolygon: (f) => set(() => ({ polygon: f })),

  setActiveMapSource: (f) => set(() => ({ active_Map_Source: f })),
  setActiveMapType: (f) => set(() => ({ active_Map_Type: f })),
  setActiveMapLayer: (f) => set(() => ({ active_map_layer: f })),

  setShortLivedLayer: (f) => set(() => ({ short_lived_map_layer: f })),
  setShortLivedSource: (f) => set(() => ({ short_lived_map_source: f })),
}));

type ActiveDrawerType = {
  open: boolean;
  city: string;
  active_Borough: string;
  crime: string;
  date: string;
  useSetDrawerBorough: (f: string) => void;
  useSetDate: (f: string) => void;
  useSetCrimeType: (f: string) => void;
  useSetDrawer: (f: boolean) => void;
  useSetCity: (f: string) => void;
};

export const useSingleDrawerStore = create<ActiveDrawerType>()((set) => ({
  open: false,
  active_Borough: "",
  city: "",
  crime: "",
  date: "",
  useSetDate: (f) => {
    set({ date: f });
  },
  useSetDrawerBorough: (f) => set(() => ({ active_Borough: f })),
  useSetCrimeType: (f) => set(() => ({ crime: f })),
  useSetDrawer: (f) => set(() => ({ open: f })),
  useSetCity: (f) => set(() => ({ city: f })),
}));

//// Reseting Map events Global Store (Refreshing map mod , map type , map design etc)
type ActiveMapListenerEvents = {
  polygon: string[];
  heatmap: string[];
  extruded: string[];
  setMapListenerEvents: (
    layerType: "polygon" | "heatmap" | "extruded",
    layerName: string,
  ) => void;
  clearMapListenerEvents: (
    layerType: "polygon" | "heatmap" | "extruded",
  ) => void;
};

export const useMapListenerEvents = create<ActiveMapListenerEvents>()(
  (set) => ({
    polygon: [],
    heatmap: [],
    extruded: [],
    setMapListenerEvents: (layerType, layerName) =>
      set((state) => ({
        [layerType]: [...state[layerType], layerName],
      })),

    clearMapListenerEvents: (layerType) =>
      set(() => ({
        [layerType]: [],
      })),
  }),
);

type ActiveMarkerType = {
  marker: maplibregl.Popup | null;
  current_Id: string | null;
  setMarker: (f: maplibregl.Popup | null) => void;
  setCurrent_Id: (f: string) => void;
};

export const useMarkerStore = create<ActiveMarkerType>()((set) => ({
  marker: null,
  current_Id: null,
  setMarker: (f) => set(() => ({ marker: f })),
  setCurrent_Id: (f) => set(() => ({ current_Id: f })),
}));

type CityDrawer = {
  open: boolean;
  setOpen: (f: boolean) => void;
};

export const useCityDrawer = create<CityDrawer>()((set) => ({
  open: false,
  setOpen: (f) => set(() => ({ open: f })),
}));
