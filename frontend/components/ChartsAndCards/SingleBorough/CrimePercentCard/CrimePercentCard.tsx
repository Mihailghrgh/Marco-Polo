import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CrimeType,
  useCrimeStore,
  usePolygonCollectionStore,
} from "@/store/store";
import { useSingleDrawerStore } from "@/store/store";
import { useMemo } from "react";

export function CrimePercentCard() {
  const { crime_data } = useCrimeStore();
  const { active_Borough, crime, date, city } = useSingleDrawerStore();

  const getColorScheme = (percent: number) => {
    if (percent <= 2)
      return {
        text: "text-green-500",
        bg: "bg-green-500",
        light: "bg-green-500/10",
      };
    if (percent <= 4)
      return {
        text: "text-yellow-500",
        bg: "bg-yellow-500",
        light: "bg-yellow-500/10",
      };
    if (percent <= 10)
      return {
        text: "text-orange-500",
        bg: "bg-orange-500",
        light: "bg-orange-500/10",
      };
       return {
         text: "text-red-500",
         bg: "bg-red-500",
         light: "bg-red-500/10",
       };
  };

  const city_Total_Crimes = useMemo(() => {
    const crimes = crime_data.flat();

    const city_Object = { name: city, date: date, amount: 0 };
    Object.values(crimes).map((item) => {
      if (item[date as keyof CrimeType]) {
        city_Object.amount += Number(item[date as keyof CrimeType]);
      }
    });

    return city_Object;
  }, [crime_data, date, city]);

  const borough_Total_Crimes = useMemo(() => {
    const crimes = crime_data.flat();

    const borough = { name: active_Borough, date: date, amount: 0 };
    Object.values(crimes).map((item) => {
      if (
        item.borough_Name === active_Borough &&
        item[date as keyof CrimeType]
      ) {
        borough.amount += Number(item[date as keyof CrimeType]);
      }
    });

    return borough;
  }, [crime_data, active_Borough, date]);

  const borough_Average = Number(
    ((borough_Total_Crimes.amount / city_Total_Crimes.amount) * 100).toFixed()
  );

  const colors = getColorScheme(borough_Average);

  return (
    <Card>
      <CardContent className="space-y-2">
        <div className="items-start space-y-0">
          <h3 className="font-semibold">
            Crime Percentage - Borough of {active_Borough}
          </h3>
          <p className="text-sm font-medium text-muted-foreground">{crime}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{active_Borough}</span>
            <span className="font-medium">{borough_Average}%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full ${colors?.bg}`}
                style={{ width: `${borough_Average * 3}%` }}
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          In the month of {date.replace("_"," ")}, there were {borough_Total_Crimes.amount}{" "}
          crimes in the borough of {active_Borough}. In {city} there were{" "}
          {city_Total_Crimes.amount} total crimes and borough of{" "}
          {active_Borough} contributed {borough_Average}%
        </p>
      </CardContent>
    </Card>
  );
}
