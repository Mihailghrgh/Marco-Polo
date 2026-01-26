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
import { useCityDrawer, useSingleDrawerStore } from "@/store/store";
import EmptyDataCard from "./CrimeWarning";
type Prop = {
  location: string;
};
function CrimeSelectorMenu({ location }: Prop) {
  const [crime, useSetCrime] = useState<string>("");
  const [isOpenCrime, setIsOpenCrime] = useState<boolean>(true);
  const [isOpenDate, setIsOpenDate] = useState<boolean>(true);
  const [isOpenLayer, setIsOpenLayer] = useState<boolean>(true);
  const [mapType, useMapType] = useState<string>("");
  const [returnedData, setReturnedData] = useState<boolean>(false);
  const { useSetDate, date } = useSingleDrawerStore();
  const [cityBtn, setCityBtn] = useState<boolean>(true);
  const { open, setOpen } = useCityDrawer();
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
    useSetCrime(str);
  }

  function SetDate(str: string) {
    useSetDate(str);
  }
  const [selectedMonth, setSelectedMonth] = useState<{
    year: number;
    month: string;
  } | null>(null);

  const selectDate = (year: number, month: string) => {
    setSelectedMonth({ year, month });
  };

  function SetMapType(str: string) {
    useMapType(str);
    setTimeout(() => {
      setIsOpenLayer(false);
    }, 200);
  }

  async function FetchData() {
    setReturnedData(false);
    setCityBtn(true);
    switch (mapType) {
      case "Heatmap":
        const heatmapData = await CrimeHeatmapFetching({
          crime_Selected: crime,
          date_Selected: date,
          location,
        });

        if (heatmapData) {
          await PolygonDataFetching(location);
          setCityBtn(false);
        } else {
          setReturnedData(true);
        }

        break;
      case "Extruded":
        const extrudedData = await CrimeExtrudedFetching({
          crime_Selected: crime,
          date_Selected: date,
          location,
        });

        if (extrudedData) {
          await PolygonDataFetching(location);
          setCityBtn(false);
        } else {
          setReturnedData(true);
        }

        break;
      default:
        break;
    }
  }

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
                          <h2 className="my-3 text-lg font-semibold tracking-tight text-center ">
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
                            className={`cursor-pointer p-4 transition-colors ${crime !== topic && "hover:bg-primary-foreground"} ${
                              crime === topic &&
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
                              {crime.includes(topic) && (
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
                  <h2 className="my-3 text-lg font-semibold tracking-tight text-center">
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
                  <h2 className="my-3 text-lg font-semibold tracking-tight text-center">
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
                <h3 className="text-sm font-medium text-foreground">
                  Data Type
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={mapType === "Heatmap" ? "default" : "outline"}
                    onClick={() => SetMapType("Heatmap")}
                  >
                    Heatmap
                  </Button>
                  <Button
                    size="sm"
                    variant={mapType === "Extruded" ? "default" : "outline"}
                    onClick={() => SetMapType("Extruded")}
                  >
                    Extruded
                  </Button>
                </div>
              </div>
            </Card>
          </CollapsibleContent>
        </Collapsible>
        {/* Selection Summary */}
        {(crime.length > 0 || selectedMonth || mapType) && (
          <Card className="mt-4 overflow-hidden border-border/50 from-card to-card/80 shadow-lg backdrop-blur-sm">
            <div className="border-b border-border/50 px-4 py-3">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                Active Filters
              </h3>
            </div>
            <div className="space-y-3 p-4">
              {selectedMonth && (
                <div className="group flex items-start gap-3 rounded-lg border border-border/40 bg-background/50 p-3 transition-all hover:border-border hover:bg-background/80">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
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
                      {selectedMonth.month} {selectedMonth.year}
                    </div>
                  </div>
                </div>
              )}

              {crime.length > 0 && (
                <div className="group flex items-start gap-3 rounded-lg border border-border/40 bg-background/50 p-3 transition-all hover:border-border hover:bg-background/80">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
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
                    <div className="font-semibold text-foreground">{crime}</div>
                  </div>
                </div>
              )}

              {mapType && (
                <div className="group flex items-start gap-3 rounded-lg border border-border/40 bg-background/50 p-3 transition-all hover:border-border hover:bg-background/80">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-500/10 text-blue-500">
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
                      {mapType}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
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
            disabled={cityBtn}
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
