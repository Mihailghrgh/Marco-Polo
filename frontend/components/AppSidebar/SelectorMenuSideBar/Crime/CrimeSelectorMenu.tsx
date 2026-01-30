"use client";
import { Button } from "@/components/ui/button";
import { city_Crime_Choices } from "@/helpers/menu_Helper";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import PolygonDataFetching from "@/Data Features API/PolygonData/PolygonDataFetching";
import CrimeHeatmapFetching from "@/Data Features API/CrimeData - Heatmap/CrimeHeatmapFetching";
import CrimeExtrudedFetching from "@/Data Features API/CrimeData - Extruded/CrimeExtrudedFetching";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Separator } from "@radix-ui/react-separator";
import {
  useActiveMapStore,
  useCityDrawer,
  useMapListenerEvents,
  useMapStore,
  useSingleDrawerStore,
} from "@/store/store";
import EmptyDataCard from "./CrimeWarning";
import CrimePolygonFetching from "@/Data Features API/CrimeData - Polygon/CrimePolygonFetching";
import CrimeClusterFetching from "@/Data Features API/CrimeData -Cluster/CrimeClusterFetching";
import { city_Helpers } from "@/helpers/city_Helpers";
import { LngLatLike } from "maplibre-gl";
type Prop = {
  location: string;
};

type SelectionProp = {
  crime: string | null;
  date: string | null;
  type: string | null;
};
function CrimeSelectorMenu({ location }: Prop) {
  ////This just opens or closes the modal on click for the selection menus
  const [isOpenCrime, setIsOpenCrime] = useState<boolean>(true);
  const [isOpenDate, setIsOpenDate] = useState<boolean>(true);
  const [isOpenLayer, setIsOpenLayer] = useState<boolean>(true);

  const [selectionProp, setSelectionProp] = useState<SelectionProp>({
    crime: null,
    date: null,
    type: null,
  });
  const [failedFetch, setFailedFetch] = useState<string[] | null>(null);
  ///Bans the spam of click of the btn
  const [returnedData, setReturnedData] = useState<boolean>(false);
  ///Opens drawers for city and blocks its use until Valid data its back Cuh
  const [cityBtn, setCityBtn] = useState<boolean>(true);
  const { setOpen } = useCityDrawer();

  ///necessary values to fetch data Cuh if not Cuh you cant get stuff Cuh !
  const { useSetDate, date } = useSingleDrawerStore();
  const { map } = useMapStore();
  const sources = useMapStore((state) => state.refresh_Map_Sources);
  const MONTHS_2024 = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  const MONTHS_2025 = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
  ];
  function SetCrime(str: string) {
    setSelectionProp((state) => ({ ...state, crime: str }));
  }

  function SetDate(str: string) {
    setSelectionProp((state) => ({ ...state, date: str }));
  }
  const [selectedMonth, setSelectedMonth] = useState<{
    year: number;
    month: string;
  } | null>(null);

  const selectDate = (year: number, month: string) => {
    setSelectedMonth({ year, month });
  };

  function SetMapType(str: string) {
    setSelectionProp((state) => ({ ...state, type: str }));
    setTimeout(() => {
      setIsOpenLayer(false);
    }, 200);
  }

  async function FetchData() {
    setReturnedData(false);
    setCityBtn(true);
    setFailedFetch([]);
    if (!selectionProp.crime || !selectionProp.date || !selectionProp.type) {
      const nullKey = Object.entries(selectionProp)
        .filter(([key, item]) => item === null)
        .map(([key]) => key);
      setFailedFetch(nullKey);
      return nullKey;
    }
    switch (selectionProp.type) {
      case "Heatmap":
        const heatmapData = await CrimeHeatmapFetching({
          crime_Selected: selectionProp.crime as string,
          date_Selected: selectionProp.date as string,
          location,
        });

        if (heatmapData) {
          await PolygonDataFetching(location);
          setCityBtn(false);
          const lnglat = city_Helpers.find((item) => item.city === location);
          map?.flyTo({
            center: [lnglat?.lat, lnglat?.lng] as LngLatLike,
            zoom: 9,
            essential: true,
          });
        } else {
          setReturnedData(true);
        }

        break;
      case "Extruded":
        const extrudedData = await CrimeExtrudedFetching({
          crime_Selected: selectionProp.crime as string,
          date_Selected: selectionProp.date as string,
          location,
        });

        if (extrudedData) {
          const extruded_Polygon = await PolygonDataFetching(location);
          setCityBtn(false);
          const lnglat = city_Helpers.find((item) => item.city === location);
          map?.flyTo({
            center: [lnglat?.lat, lnglat?.lng] as LngLatLike,
            zoom: 9,
            essential: true,
          });
        } else {
          setReturnedData(true);
        }

        break;
      case "Polygon":
        const polygonData = await CrimePolygonFetching({
          crime_Selected: selectionProp.crime as string,
          date_Selected: selectionProp.date as string,
          location,
        });

        if (polygonData) {
          setCityBtn(false);
          const lnglat = city_Helpers.find((item) => item.city === location);
          map?.flyTo({
            center: [lnglat?.lat, lnglat?.lng] as LngLatLike,
            zoom: 9,
            essential: true,
          });
        } else {
          setReturnedData(true);
        }

        break;
      case "Cluster":
        const clusterData = await CrimeClusterFetching({
          crime_Selected: selectionProp.crime as string,
          date_Selected: selectionProp.date as string,
          location,
        });

        if (clusterData) {
          setCityBtn(false);
          const lnglat = city_Helpers.find((item) => item.city === location);
          map?.flyTo({
            center: [lnglat?.lat, lnglat?.lng] as LngLatLike,
            zoom: 9,
            essential: true,
          });
        } else {
          setReturnedData(true);
        }

        break;
      default:
        break;
    }
  }
  // const layers = useMapStore((state) => state.refresh_Map_Layers);
  // const sources = useMapStore((state) => state.refresh_Map_Sources);

  // function KillMe() {
  //   console.log(layers, sources);
  // }

  return (
    <div>
      <div className="mb-4">
        {city_Crime_Choices.map((item, index) => {
          if (item.city === location) {
            return (
              <div key={item.crimes[index]}>
                <Collapsible
                  open={isOpenCrime}
                  onOpenChange={setIsOpenCrime}
                  className="transition-all duration-500 ease-out"
                >
                  <CollapsibleTrigger asChild>
                    <div className="flex justify-center py-2">
                      <Button variant="ghost" className="hover:bg-muted">
                        <div className="flex justify-between items-center space-x-2 ">
                          <h2
                            className={`my-3 text-lg font-semibold tracking-tight text-center ${failedFetch?.find((item) => item === "crime") && "underline decoration-2 decoration-red-600"} `}
                          >
                            Select Crime Types
                          </h2>
                          {isOpenCrime ? <ChevronDown /> : <ChevronsUpDown />}
                        </div>
                      </Button>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent
                    className="
              overflow-hidden
              transition-all
              duration-500
              ease-out
              data-[state=closed]:animate-collapsible-up
              data-[state=open]:animate-collapsible-down
            "
                  >
                    <div className="grid grid-cols-1 gap-2 transition-all duration-500 ease-out">
                      {item.crimes.map((topic) => {
                        return (
                          <Card
                            key={topic}
                            className={`cursor-pointer p-4 transition-colors ${selectionProp.crime !== topic && "hover:bg-primary-foreground"} ${
                              selectionProp.crime === topic &&
                              "bg-primary text-primary-foreground"
                            }`}
                            onClick={() => {
                              SetCrime(topic);
                              setTimeout(() => {
                                setIsOpenCrime((item) => !item);
                              }, 200);
                            }}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm font-medium leading-tight ">
                                {topic}
                              </span>
                              {selectionProp?.crime?.includes(topic) && (
                                <Check className="h-5 w-5 shrink-0 text-primary" />
                              )}
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            );
          }
        })}
        {isOpenCrime === false ? <Separator className="border" /> : null}
        <Collapsible
          open={isOpenDate}
          onOpenChange={setIsOpenDate}
          className="transition-all duration-500 ease-out"
        >
          <CollapsibleTrigger asChild>
            <div className="flex justify-center py-2">
              <Button variant="ghost">
                <div className="flex justify-between items-center space-x-2">
                  <h2
                    className={`my-3 text-lg font-semibold tracking-tight text-center ${failedFetch?.find((item) => item === "date") && "underline decoration-2 decoration-red-600"} `}
                  >
                    Select Date
                  </h2>
                  {isOpenDate ? <ChevronDown /> : <ChevronsUpDown />}
                </div>
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent
            className="
              overflow-hidden
              transition-all
              duration-500
              ease-out
              data-[state=closed]:animate-collapsible-up
              data-[state=open]:animate-collapsible-down
            "
          >
            <Card className="p-4">
              <div className="space-y-4">
                {/* 2024 */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                    2024
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {MONTHS_2024.map((month) => (
                      <Button
                        key={`2024-${month}`}
                        variant={
                          selectedMonth?.year === 2024 &&
                          selectedMonth?.month === month
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          selectDate(2024, month);
                          const setDate = month.concat("_2024");
                          SetDate(setDate);
                          setTimeout(() => {
                            setIsOpenDate((item) => !item);
                          }, 200);
                        }}
                        className="w-full"
                      >
                        {month}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 2025 */}
                {/* <div>
                  <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
                    2025
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {MONTHS_2025.map((month) => (
                      <Button
                        key={`2025-${month}`}
                        variant={
                          selectedMonth?.year === 2025 &&
                          selectedMonth?.month === month
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          selectDate(2025, month);
                          const setDate = month.concat("_2025");
                          SetDate(setDate);
                          setTimeout(() => {
                            setIsOpenDate((item) => !item);
                          }, 200);
                        }}
                        className="w-full"
                      >
                        {month}
                      </Button>
                    ))}
                  </div>
                </div> */}
              </div>
            </Card>
          </CollapsibleContent>
        </Collapsible>
        {isOpenCrime === false ? <Separator className="border" /> : null}
        <Collapsible
          open={isOpenLayer}
          onOpenChange={setIsOpenLayer}
          className="transition-all duration-500 ease-out"
        >
          <CollapsibleTrigger asChild>
            <div className="flex justify-center py-2">
              <Button variant="ghost">
                <div className="flex justify-between items-center space-x-2">
                  <h2
                    className={`my-3 text-lg font-semibold tracking-tight text-center ${failedFetch?.find((item) => item === "type") && "underline decoration-2 decoration-red-600"} `}
                  >
                    Select Layer Type
                  </h2>
                  {isOpenLayer ? <ChevronDown /> : <ChevronsUpDown />}
                </div>
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent
            className="
              overflow-hidden
              transition-all
              duration-500
              ease-out
              data-[state=closed]:animate-collapsible-up
              data-[state=open]:animate-collapsible-down
            "
          >
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex flex-row justify-center items-center gap-4">
                  <Button
                    size="sm"
                    variant={
                      selectionProp.type === "Heatmap" ? "default" : "outline"
                    }
                    onClick={() => SetMapType("Heatmap")}
                  >
                    Heatmap
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      selectionProp.type === "Extruded" ? "default" : "outline"
                    }
                    onClick={() => SetMapType("Extruded")}
                  >
                    Extruded
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      selectionProp.type === "Polygon" ? "default" : "outline"
                    }
                    onClick={() => SetMapType("Polygon")}
                  >
                    Polygon
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      selectionProp.type === "Cluster" ? "default" : "outline"
                    }
                    onClick={() => SetMapType("Cluster")}
                  >
                    Cluster
                  </Button>
                </div>
              </div>
            </Card>
          </CollapsibleContent>
        </Collapsible>
        {/* Selection Summary */}
        {(selectionProp?.crime ||
          selectionProp?.type ||
          selectionProp?.date) && (
          <div className="py-4 overflow-hidden  space-y-4 bg-transparent">
            {selectionProp?.date && (
              <div className="group flex items-start gap-3 rounded-lg transition-all w-full bg-transparent">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Time Period
                  </div>
                  <div className="font-semibold text-foreground">
                    {selectedMonth?.month} {selectedMonth?.year}
                  </div>
                </div>
              </div>
            )}

            {selectionProp?.crime && (
              <div className="group flex items-start gap-3 rounded-lg transition-all w-full">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Crime Types
                  </div>
                  <div className="font-semibold text-foreground">
                    {selectionProp?.crime}
                  </div>
                </div>
              </div>
            )}

            {selectionProp?.type && (
              <div className="group flex items-start gap-3 rounded-lg transition-all w-full">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Visualization
                  </div>
                  <div className="font-semibold text-foreground">
                    {selectionProp?.type}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="mt-4 space-y-4">
          {returnedData ?? <EmptyDataCard />}
          <Button
            variant="default"
            className="w-full shadow-sm"
            onClick={() => FetchData()}
          >
            View Data
          </Button>

          <Button
            variant="destructive"
            disabled={sources.length < 1 ? true : false}
            className="w-full"
            onClick={() => setOpen(true)}
          >
            Open City Details
          </Button>
        </div>
      </div>
    </div>
  );
}
export default CrimeSelectorMenu;
