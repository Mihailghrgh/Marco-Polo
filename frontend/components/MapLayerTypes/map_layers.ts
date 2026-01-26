import {
  FillExtrusionLayerSpecification,
  SourceSpecification,
} from "maplibre-gl";
import { HeatmapLayerSpecification } from "maplibre-gl";

export const heath_layer = (
  id: string,
  source: string
): HeatmapLayerSpecification => {
  return {
    id: id,
    type: "heatmap",
    source: source,
    paint: {
      "heatmap-weight": [
        "interpolate",
        ["linear"],
        ["get", "magnitude"],
        0,
        0,
        6,
        1,
      ],

      "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 0, 1, 9, 2],
      "heatmap-color": [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0,
        "rgba(0,255,0,0)",
        0.2,
        "rgb(0,166,0)",
        0.4,
        "rgb(103,200,47)",
        0.6,
        "rgb(200,200,0)",
        0.8,
        "rgb(200,120,0)",
        1,
        "rgb(150,0,0)",
      ],
      "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 15, 9, 20],
      "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 11, 1],
      "heatmap-opacity-transition": { duration: 200, delay: 0 },
    },
  };
};

export const extrusion_layer = (
  id: string,
  source: string
): FillExtrusionLayerSpecification => {
  return {
    id: id,
    type: "fill-extrusion",
    source: source,
    paint: {
      "fill-extrusion-height": ["get", "height"],
      "fill-extrusion-base": ["get", "base"],
      "fill-extrusion-color": ["get", "color"],
      // "fill-extrusion-opacity": 1,
      "fill-extrusion-vertical-gradient": true,
      "fill-extrusion-translate": [0.2, 0.2],
    },
  };
};

export enum map_tile_layer {
  "Default" = "https://api.maptiler.com/maps/streets-v4/style.json?key=yzax3zR8dQOlJDaNSDpK",
  "Dark" = "https://api.maptiler.com/maps/019ae664-d223-7a00-9a67-e52c5bc63fac/style.json?key=yzax3zR8dQOlJDaNSDpK",
  "Realistic" = "https://api.maptiler.com/maps/satellite/style.json?key=yzax3zR8dQOlJDaNSDpK",
}
