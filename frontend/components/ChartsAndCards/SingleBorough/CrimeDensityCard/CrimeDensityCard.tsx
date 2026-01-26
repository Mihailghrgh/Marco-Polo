"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCrimeStore } from "@/store/store";
import { useMemo } from "react";
import { useSingleDrawerStore } from "@/store/store";
import { CrimeType } from "@/store/store";
import { city_Helpers } from "@/helpers/city_Helpers";
import { usePolygonCollectionStore } from "@/store/store";
export function CrimeDensityCard() {
  // Create grid visualization (10x10 = 100 squares, each representing 2 crimes/km²)
  const { crime_data } = useCrimeStore();
  const { active_Borough, crime, date, city } = useSingleDrawerStore();
  const totalSquares = 75;

  const total_Crimes = useMemo(() => {
    const crimes = crime_data.flat();

    const total = {
      borough: active_Borough,
      date: date,
      amount: 0,
    };

    Object.values(crimes).map((item) => {
      if (
        item.borough_Name === active_Borough &&
        item[date as keyof CrimeType]
      ) {
        total.amount += Number(item[date as keyof CrimeType]);
      }
    });

    return total;
  }, [crime_data, active_Borough, date]);
  
  const borough_Area = () => {
    for (const item of city_Helpers) {
      if (item.city === city) {
        return item.boroughs.find((element) =>
          element.borough === active_Borough ? element : null
        );
      }
    }
  };

  const crime_Density = Number(
    (
      (total_Crimes.amount / Number(borough_Area()?.area.replace(",", ""))) *
      1000
    ).toFixed()
  );

  const crimesPerSquare = Math.ceil(crime_Density / totalSquares);
  const getColorClass = (rate: number) => {
    if (rate < 25) return "bg-emerald-500";
    if (rate < 50) return "bg-yellow-500";
    if (rate < 75) return "bg-orange-500";
    return "bg-red-500";
  };

  const colorClass = getColorClass(crime_Density);

  return (
    <Card className="w-full h-full">
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">
              Crime Area Density - Borough of {active_Borough}
            </h3>
            <p className="text-sm font-medium text-muted-foreground">{crime}</p>
          </div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-4xl font-bold">{crime_Density || 0}~</div>
          <div className="text-sm text-muted-foreground">
            Crimes/km² in the are of {active_Borough}
          </div>
        </div>
        {/* Grid visualization */}
        <div className="rounded-lg bg-muted/30">
          <div className="grid grid-cols-12 space-x-1 space-y-2">
            {Array.from({ length: totalSquares }).map((_, index) => (
              <div
                key={index}
                className={`h-5 w-5 rounded-lg  transition-all ${
                  index < crime_Density ? colorClass : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center text-center">
          <h1 className="text-sm font-medium text-muted-foreground "></h1>
          <h1 className="text-sm font-medium text-muted-foreground">
            Each square = {crimesPerSquare} crimes/km²
          </h1>
        </div>
      </CardContent>
    </Card>
  );
}
