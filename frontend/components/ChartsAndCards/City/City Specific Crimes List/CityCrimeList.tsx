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

function CityCrimeList() {
  const { crime_data } = useCrimeStore();
  const { city, crime, date } = useSingleDrawerStore();
  const crime_Max_Queue = useMemo(() => {
    const crimes = crime_data.flat();
    const map = new Map<string, number>();

    for (const [index, item] of Object.entries(crimes)) {
      if (!map.get(item.specific_Crime)) {
        let amount = 0;
        for (const [index, element] of Object.entries(item)) {
          if (index.endsWith("2024")) {
            amount += Number(element);
          }
        }

        map.set(item.specific_Crime, amount);
      } else {
        for (const [index, element] of Object.entries(item)) {
          if (index.endsWith(date) && map.get(item.specific_Crime)) {
            const amount = map.get(item.specific_Crime) ?? 0;
            const second_Amount = Number(element) ?? 0;
            const new_Amount = amount + second_Amount;
            map.set(item.specific_Crime, new_Amount);
          }
        }
      }
    }

    const max_Queue = [...map.entries()].sort((a, b) => b[1] - a[1]);
    return max_Queue;
  }, [crime_data, date]);

  const total_Percentage = useMemo(() => {
    const total = crime_Max_Queue.reduce((acc, num) => acc + num[1], 0);
    return total;
  }, [crime_Max_Queue]);

  const displayQueue = (() => {
    if (crime_Max_Queue.length <= 4) {
      return crime_Max_Queue;
    }

    const topFour = crime_Max_Queue.slice(0, 4);
    const rest = crime_Max_Queue.slice(4);

    const restTotal = rest.reduce((acc, [, value]) => acc + value, 0);

    return [...topFour, ["OTHER", restTotal] as [string, number]];
  })();

  const returnIndex = (index: number) =>
    index === 0
      ? "bg-blue-600"
      : index === 1
      ? "bg-green-600"
      : index === 2
      ? "bg-orange-600"
      : "bg-gray-600";

  return (
    <Card className="border-border bg-card">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-lg font-semibold text-foreground">
          Specific Crime Distribution - {city}
        </CardTitle>
        <CardDescription className="mt-1 text-sm text-muted-foreground">
          {crime}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayQueue.map((element, index) => {
            const num = ((element[1] / total_Percentage) * 100).toFixed();

            return (
              <div key={element[0]} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${returnIndex(index)}`}
                    />
                    <span className="text-sm text-muted-foreground">
                      {element[0]} ({num}%)
                    </span>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-foreground">
                    {element[1]}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className={`h-full rounded-full ${returnIndex(index)}`}
                    style={{
                      width: `${num}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
export default CityCrimeList;
