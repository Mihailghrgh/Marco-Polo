import SetQueryFeatures from "./SetQueryFeatures";
import { PolygonType } from "@/store/store";
export const map_handler = (
  e: maplibregl.MapMouseEvent,
  layer: string,
  polygon_Prop: PolygonType[],
) => {
  SetQueryFeatures({ layer, e, polygon_Prop });
};


export const mousemoveHandlers = new Map<
  string,
  (e: maplibregl.MapMouseEvent) => void
>();