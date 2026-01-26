"use client";

import maplibregl, { Map } from "maplibre-gl";
import { useEffect } from "react";
import React, { useRef } from "react";
import { useMapStore } from "@/store/store";
import { map_tile_layer } from "@/components/MapLayerTypes/map_layers";
import "maplibre-gl/dist/maplibre-gl.css";
import { BoroughDrawer } from "@/components/DrawerContents/BoroughDrawer";

function HeathMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { setMap, map } = useMapStore();

  //Adding heathmap layer
  useEffect(() => {
    if (!containerRef.current) return;

    const mapGL = new maplibregl.Map({
      container: containerRef.current,
      style: map_tile_layer.Dark,
      center: [-122.43, 37.37],
      zoom: 6,
    });

    mapGL.on("style.load", () => {
      mapGL.setProjection({ type: "globe" });

      if (!mapGL.getSource("globe")) {
        mapGL.addSource("globe", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });

        mapGL.addLayer({
          id: "global-hit-layer",
          type: "background",
          paint: {
            "background-color": "rgba(0,0,0,0)",
          },
        });
      }
    });

    setMap(mapGL);

    return () => mapGL.remove();
  }, []);

  return (
    <>
      <div
        id="map"
        ref={containerRef}
        className=" inset-0 z-0 h-screen w-screen bg-slate-700"
      />
      <BoroughDrawer/>
    </>
  );
}
export default HeathMap;
