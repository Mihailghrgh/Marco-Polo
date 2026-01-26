"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { useActiveMapStore } from "@/store/store";
import { useCrimeStore } from "@/store/store";
import { useMemo } from "react";
import { useSingleDrawerStore } from "@/store/store";
import { Separator } from "@radix-ui/react-separator";

function BoroughCrimesList() {
  const { crime_data } = useCrimeStore();
  const { city, active_Borough, crime, date } = useSingleDrawerStore();

  const crime_Max_Queue = useMemo(() => {
    const crimes = crime_data.flat();
    const map = new Map<string, number>();
    for (const [index, item] of Object.entries(crimes)) {
      if (!map.get(item.specific_Crime)) {
        let amount = 0;
        for (const [index, element] of Object.entries(item)) {
          if (item.borough_Name === active_Borough && index.endsWith(date)) {
            amount += Number(element);
          }
        }

        map.set(item.specific_Crime, amount);
      } else {
        for (const [index, element] of Object.entries(item)) {
          if (
            index.endsWith(date) &&
            map.get(item.specific_Crime) &&
            item.borough_Name === active_Borough
          ) {
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
  }, [crime_data, active_Borough, date]);

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
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">
              Specific Crime Distribution - {active_Borough}
            </h3>
            <p className="text-sm font-medium text-muted-foreground">{crime}</p>
          </div>
        </div>
        <div className="space-y-2 py-4">
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
                    className={`h-full rounded-full ${returnIndex(index)} ${
                      (element[1] / total_Percentage) * 100
                    }`}
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

      <div className="space-x-2">
        <Separator className="border px-10" />
        <CardFooter className="grid grid-rows-1 space-y-2 py-2">
          <div>
            <h1 className="mt-1 text-sm text-muted-foreground">
              A distribution of all Specific Crimes committed in a category as
              Example `Theft` can have these subcategories:
            </h1>
            <div className="flex justify-between space-x-2 py-2">
              {[
                "SHOPLIFTING",
                "OTHER THEFT",
                "THEFT FROM THE PERSON",
                "BICYCLE THEFT",
              ].map((item, index) => {
                const background = returnIndex(index);
                return (
                  <div
                    key={item}
                    className="flex justify-between space-x-1 text-center items-center"
                  >
                    <div className={`h-3 w-3 rounded-full ${background}`}></div>
                    <h1 className="text-xs">{item}</h1>
                  </div>
                );
              })}
            </div>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}
export default BoroughCrimesList;
