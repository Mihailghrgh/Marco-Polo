"use client";
import { Card, CardContent } from "@/components/ui/card";
import { useCrimeStore } from "@/store/store";
import { useMemo } from "react";
import { useSingleDrawerStore } from "@/store/store";
import CrimeHeader from "./helpers/CrimeHeader";
import CrimeData from "./helpers/CrimeData";
import CrimeDescription from "./helpers/CrimeDescription";
import { CrimeType } from "@/store/store";
import { city_Helpers } from "@/helpers/city_Helpers";

export function CrimeLevelCard() {
  const { crime_data } = useCrimeStore();
  const { active_Borough, date, city, crime } = useSingleDrawerStore();

  const borough_Data = () => {
    for (const item of city_Helpers) {
      if (item.city === city) {
        return item.boroughs.find((item) =>
          item.borough === active_Borough ? item : null
        );
      }
    }
  };

  const total_Crime = useMemo(() => {
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

  return (
    <Card className="w-full overflow-hidden justify-center">
      <CardContent>
        <CrimeHeader active_Borough={active_Borough} crime={crime} />
        <CrimeData
          total_Crime={total_Crime.amount}
          borough_Pop={borough_Data()?.population as string}
        />
        <CrimeDescription />
      </CardContent>
    </Card>
  );
}
