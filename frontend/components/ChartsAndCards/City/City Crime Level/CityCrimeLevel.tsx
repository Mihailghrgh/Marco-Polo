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
import { Users } from "lucide-react";
import { ShieldAlert } from "lucide-react";
import { CrimeType } from "@/store/store";
import { city_Helpers } from "@/helpers/city_Helpers";

function CityCrimeLevel() {
  const { crime_data } = useCrimeStore();
  const { city, date, crime } = useSingleDrawerStore();

  const cityPop = city_Helpers.find((item) => (item.city === city ? item : ""));
  const total_Crimes = useMemo(() => {
    const crimes = crime_data.flat();

    const total = {
      borough: "London",
      date: "2024",
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
  }, [crime_data]);

  const number = (): number => {
    if (cityPop && cityPop?.population?.replaceAll(",", "").length >= 6) {
      return 100000;
    } else if (cityPop && cityPop?.population?.replaceAll(",", "").length < 6) {
      return 10000;
    }
    return 0;
  };
  return (
    <Card className="w-full overflow-hidden justify-start py-6">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold text-foreground">
          Crime Level - {city}
        </CardTitle>
        <CardDescription className="mt-1 text-sm text-muted-foreground">
          {crime}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex md:flex-wrap justify-between space-x-1">
          <div className="flex items-center space-x-2 pb-2 ">
            <div className="flex w-12 h-12 items-center justify-center rounded-2xl bg-blue-500/10">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex justify-center items-center text-center space-x-1">
              <p className="text-sm font-medium text-muted-foreground">
                Population:
              </p>
              <p className="sm:text-sm font-bold">{cityPop?.population}</p>
            </div>
          </div>
          <div className="flex  items-center space-x-2 pb-2">
            <div className="flex w-12 h-12 items-center justify-center rounded-2xl bg-red-500/10">
              <ShieldAlert className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex justify-center items-center text-center space-x-1">
              <p className="text-sm font-medium text-muted-foreground">
                Crime Level:
              </p>
             
              <p className="text-sm text-center font-bold">
                {(
                  (Number(total_Crimes.amount) /
                    Number(cityPop?.population?.replaceAll(",", ""))) *
                  number()
                ).toFixed()}{" "}
                per{" "}
                {cityPop && cityPop?.population?.replaceAll(",", "").length <= 5
                  ? "10K"
                  : "100k"}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full hide-1562x911">
          <p className="text-xs text-muted-foreground">
            Crime level is calculated using the following formula for all cities
            ( crime count / population ) * 100K
          </p>
          <p className="text-xs text-muted-foreground">
            ( crime count / population ) * 100K
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
export default CityCrimeLevel;
