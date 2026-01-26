"use client";
import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import axios from "axios";
import { design_Endpoints } from "@/helpers/request_Helpers";
import {
  useActiveMapStore,
  useMapListenerEvents,
  useMapStore,
} from "@/store/store";
import ReloadHeatmap from "./Reload Heatmap/ReloadHeatmap";
import ReloadPolygon from "./Reload Polygon/ReloadPolygon";
import ReloadExtruded from "./Reload Extruded/ReloadExtruded";
import { DestroyLayersAndSources } from "@/Data Features API/CleanUp/DestroyAll";

function MapStyleSideBar() {
  const [mapDesign, useMapDesign] = useState<string>("Default");
  const [mapType, useMapType] = useState<string>("Heatmap");
  const { map } = useMapStore();
  const active_Map_Type = useActiveMapStore.getState().active_Map_Type;

  async function SetMapDesign(str: string) {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL;
    const endPoint = design_Endpoints.find((item) => item.type === str);

    const { data: newStyle } = await axios.get(
      `${url}${endPoint?.request_Endpoint}`,
    );

    const polygon = useMapListenerEvents.getState().polygon;

    await DestroyLayersAndSources();

    map?.setStyle(newStyle, { diff: true });

    map?.once("style.load", async () => {
      switch (active_Map_Type) {
        case "Heatmap":
          await ReloadHeatmap();
          if (polygon !== null) {
            await ReloadPolygon();
          }
          break;
        case "Extruded":
          await ReloadExtruded();
          if (polygon !== null) {
            await ReloadPolygon();
          }
          break;
        default:
          break;
      }
    });
  }

  function SetDesign(str: string) {
    useMapDesign(str);
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        <div className="space-y-4 pb-2">
          <h1 className="text-center text-lg font-semibold tracking-tight">
            Map Control Menu
          </h1>
          <p className="text-center text-base font-medium tracking-tight text-muted-foreground">
            Choose your preferred map design and data visualization type.
          </p>
        </div>
        <SidebarMenuItem className=" flex justify-center items-center ">
          <div className="flex flex-col gap-4 w-full">
            {/* Map Design Selector */}
            <Card className="p-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-foreground">
                  Map Design
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={mapDesign === "Default" ? "default" : "outline"}
                    onClick={() => {
                      SetDesign("Default");
                      SetMapDesign("Default");
                    }}
                  >
                    Default
                  </Button>
                  <Button
                    size="sm"
                    variant={mapDesign === "Realistic" ? "default" : "outline"}
                    onClick={() => {
                      SetDesign("Realistic");
                      SetMapDesign("Realistic");
                    }}
                  >
                    Realistic
                  </Button>
                  <Button
                    size="sm"
                    variant={mapDesign === "Dark" ? "default" : "outline"}
                    onClick={() => {
                      SetDesign("Dark");
                      SetMapDesign("Dark");
                    }}
                  >
                    Dark
                  </Button>
                  {/* <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => CheckLayer()}
                  >
                    Check layers
                  </Button> */}
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-secondary/80">
              <div className="space-y-3 " aria-disabled>
                <h3 className="text-sm font-medium text-foreground">
                  Data Type
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-secondary/80"
                    disabled

                    // onClick={() => SetMapType("Heatmap")}
                  >
                    Heatmap
                  </Button>
                  <Button
                    size="sm"
                    className="bg-secondary/80"
                    disabled
                    variant="outline"

                    // onClick={() => SetMapType("Extrusion")}
                  >
                    Extrusion
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Data Type Selector */}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
export default MapStyleSideBar;
