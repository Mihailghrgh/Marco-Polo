"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useCrimeStore } from "@/store/store";
import { useMemo } from "react";
import { useSingleDrawerStore } from "@/store/store";
import { CrimeType } from "@/store/store";
import { city_Helpers } from "@/helpers/city_Helpers";
function CityCrimeDensity() {
  const { crime_data } = useCrimeStore();
  const { city, date, crime } = useSingleDrawerStore();
  const totalSquares = 75;

  const total_Crimes = useMemo(() => {
    const crimes = crime_data.flat();

    const total = {
      borough: city,
      date: date,
      amount: 0,
    };

    for (const [index, item] of Object.entries(crimes)) {
      for (const [index, element] of Object.entries(item)) {
        if (index.endsWith("2024")) {
          total.amount += Number(element);
        }
      }
    }
    return total;
  }, [crime_data, city, date]);

  const city_Area = city_Helpers.find((item) =>
    item.city === city ? item : null
  );

  const crime_Density = Number(
    Math.ceil(
      (total_Crimes.amount /
        Number(city_Area?.population.replaceAll(",", ""))) *
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
            <h3 className="font-semibold">Crime Area Density - {city}</h3>
            <p className="text-sm font-medium text-muted-foreground">{crime}</p>
          </div>
        </div>
        <div className="text-center space-y-1">
          <div className="text-4xl font-bold">{crime_Density}</div>
          <div className="text-sm text-muted-foreground">crimes per km²</div>
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
          <h1 className="text-sm font-medium text-muted-foreground ">
            {crime_Density} crimes per km²
          </h1>
          <h1 className="text-sm font-medium text-muted-foreground">
            Each square = {crimesPerSquare} crimes/km²
          </h1>
        </div>
      </CardContent>
    </Card>
  );
}
export default CityCrimeDensity;
