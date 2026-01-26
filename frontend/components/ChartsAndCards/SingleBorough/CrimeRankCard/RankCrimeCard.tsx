"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CrimeType, useSingleDrawerStore } from "@/store/store";
import { useCrimeStore } from "@/store/store";
import { useMemo } from "react";
import { Separator } from "@radix-ui/react-separator";

export function RankCrimeCard() {
  const { active_Borough, crime, date, city } = useSingleDrawerStore();
  const { crime_data } = useCrimeStore();

  const borough = useMemo(() => {
    const map = new Map();
    const crimes = crime_data.flat();

    Object.values(crimes).map((item) => {
      if (!map.has(item.borough_Name)) {
        const new_Item = {
          borough: item.borough_Name,
          amount: Number(item[date as keyof CrimeType]),
          date: date,
        };

        map.set(item.borough_Name, new_Item);
      } else if (map.has(item.borough_Name)) {
        const existing_Item = map.get(item.borough_Name);
        existing_Item.amount += Number(item[date as keyof CrimeType]) || 0;
        map.set(item.borough_Name, existing_Item);
      }
    });

    const max_Queue = [...map.values()].sort((a, b) => b.amount - a.amount);

    let borough_Item;
    for (const [index, item] of max_Queue.entries()) {
      if (item.borough === active_Borough) {
        borough_Item = { ...item, rank: index + 1 }
        break;
      }
    }

    return borough_Item;
  }, [crime_data, active_Borough, date]);

  const getRankStyle = (rank: number) => {
    if (rank === 1)
      return {
        bg: "bg-red-500/10 dark:bg-red-500/20",
        text: "text-red-500 dark:text-red-400",
        icon: <Crown className="h-8 w-8" />,
      };
    if (rank >= 2 && rank <= 15)
      return {
        bg: "bg-yellow-500/10 dark:bg-yellow-500/20",
        text: "text-yellow-600 dark:text-yellow-400",
        icon: <TrendingUp className="h-8 w-8" />,
      };
    if (rank >= 16 && rank <= 31)
      return {
        bg: "bg-green-500/10 dark:bg-green-500/20",
        text: "text-green-600 dark:text-green-400",
        icon: <Minus className="h-8 w-8" />,
      };
    return {
      bg: "bg-blue-500/10 dark:bg-blue-500/20",
      text: "text-blue-600 dark:text-blue-400",
      icon: <TrendingDown className="h-8 w-8" />,
    };
  };

  const style = getRankStyle(borough?.rank);

  return (
    <Card className="w-full overflow-hidden gap-0 px-0">
      <CardContent className="gap-0 px-0">
        <div className="flex space-x-4">
          {/* Rank / Icon Section */}
          <div
            className={`flex w-28 flex-col rounded-lg h-full items-center justify-center ${style.bg} gap-2 p-6`}
          >
            <div className={style.text}>{style.icon}</div>
            <span className={`text-3xl font-bold ${style.text}`}>
              #{borough.rank}
            </span>
            <span className={`text-xs ${style.text}`}>of 32</span>
          </div>

          {/* Text / Info Section */}

          <div className="flex flex-col flex-1 justify-between items-start">
            <div className="space-y-0">
              <h1 className="font-semibold">
                Crime Rank - Borough of {active_Borough}
              </h1>
              <p className="text-sm font-medium text-muted-foreground">
                {crime}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Ranking based on the total amount of crimes committed by each
              borough in the city of {city}
            </p>
            <Separator className="border w-full" />

            <div className="flex align-text-bottom items-baseline space-x-1">
              <h1 className="text-2xl font-bold">{borough.amount} </h1>
              <h1 className="text-xs text-muted-foreground align-bottom">
                crimes
              </h1>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
