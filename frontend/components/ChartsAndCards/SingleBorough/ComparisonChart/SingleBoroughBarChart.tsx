"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { ItemSelector } from "./ItemSelector/ItemSelector";
import { useMemo, useState } from "react";
import { CrimeType, useCrimeStore } from "@/store/store";
import { useSingleDrawerStore } from "@/store/store";


export function SingleBoroughBarChart() {
  const { crime_data } = useCrimeStore();
  const { active_Borough } = useSingleDrawerStore();
  const [first_Chart, setFirstChart] = useState<string>("");
  const [second_Chart, setSecondChart] = useState<string>("");

  const chartConfig = {
    default: {
      label: `${active_Borough}`,
      color: "var(--bar-chart-1)",
    },
    chart1: {
      label: `${first_Chart}` || "",
      color: "var(--bar-chart-2)",
    },
    chart2: {
      label: `${second_Chart}`,
      color: "var(--bar-chart-3)",
    },
  } satisfies ChartConfig;

  const set_Chart_Data = useMemo(() => {
    const crimes = crime_data
      .flat()
      .reduce<Record<string, number>>((acc, item) => {
        for (const [key, value] of Object.entries(item)) {
          if (item.borough_Name === active_Borough && key.endsWith("2024")) {
            acc[key] = (acc[key] || 0) + Number(value);
          }
        }
        return acc;
      }, {});

    const final_Result = Object.entries(crimes).map(([date, amount]) => ({
      date: date.replace("_", " "),
      default: amount,
      chart1: 0,
      chart2: 0,
    }));

    return final_Result;
  }, [crime_data, active_Borough]);

  function set_Chart1(chart1: string) {
    if (chart1 === null) return;
    const crimes = crime_data.flat();

    const monthly_Crimes: { [key: string]: number } = {};
    for (const [index, value] of Object.entries(crimes)) {
      if (value.borough_Name === chart1) {
        for (const [index, element] of Object.entries(value)) {
          if (index.endsWith("2024")) {
            const date = index.replace("_", " ");
            if (monthly_Crimes[date]) {
              monthly_Crimes[date] += Number(element);
            } else {
              monthly_Crimes[date] = Number(element);
            }
          }
        }
      }
    }

    set_Chart_Data.map((item, index) => {
      const search_Key = item.date;

      if (monthly_Crimes[search_Key]) {
        item.chart1 = monthly_Crimes[search_Key];
      }
    });

  }

  function set_Chart2(chart2: string) {
    if (chart2 === null) return;
    const crimes = crime_data.flat();

    const monthly_Crimes: { [key: string]: number } = {};
    for (const [index, value] of Object.entries(crimes)) {
      if (value.borough_Name === chart2) {
        for (const [index, element] of Object.entries(value)) {
          if (index.endsWith("2024")) {
            const date = index.replace("_", " ");
            if (monthly_Crimes[date]) {
              monthly_Crimes[date] += Number(element);
            } else {
              monthly_Crimes[date] = Number(element);
            }
          }
        }
      }
    }

    set_Chart_Data.map((item, index) => {
      const search_Key = item.date;

      if (monthly_Crimes[search_Key]) {
        item.chart2 = monthly_Crimes[search_Key];
      }
    });
  }
  return (
    <Card>
      <CardHeader className="flex justify-between">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">
              Crime Comparison Chart - Borough of {active_Borough}
            </h3>
            <p className="text-sm font-medium text-muted-foreground">
              Arson and Criminal Damages
            </p>
          </div>
        </div>
        <div className="flex flex-row space-x-4">
          <ItemSelector
            chart_One={first_Chart}
            chart_Two={second_Chart}
            set_Chart_Name={setFirstChart}
            setChart={set_Chart1}
          />
          <ItemSelector
            chart_One={first_Chart}
            chart_Two={second_Chart}
            set_Chart_Name={setSecondChart}
            setChart={set_Chart2}
          />
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[245px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={set_Chart_Data}
            className="transition-all duration-300"
          >
            <CartesianGrid vertical={false} horizontal={true} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={true}
              content={({ active, payload }) => {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      {payload?.map((item, index) => {
                        const config =
                          chartConfig[item.dataKey as keyof typeof chartConfig];

                        const name = config?.label;

                        if (name !== undefined && Number(item?.value) > 0) {
                          return (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <div
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm font-medium">
                                {name}
                              </span>
                              <span className="text-sm font-medium">
                                {item.value}
                              </span>
                            </div>
                          );
                        } else {
                          return null;
                        }
                      })}
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="default" fill="var(--bar-chart-1)" radius={2} />
            <Bar dataKey="chart1" fill="var(--bar-chart-2)" radius={2} />
            <Bar dataKey="chart2" fill="var(--bar-chart-3)" radius={2} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
