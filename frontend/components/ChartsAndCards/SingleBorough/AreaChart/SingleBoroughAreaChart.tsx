"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useCrimeStore } from "@/store/store";
import { useSingleDrawerStore } from "@/store/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../../../ui/button";
import { useMemo } from "react";
const chartConfig = {
  amount: {
    label: "Crime Count ",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function parsedDate(item: string) {
  const new_Date = new Date(item.replace("_", " "));
  return new_Date;
}

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("all");
  const { crime_data } = useCrimeStore();
  const { active_Borough, crime } = useSingleDrawerStore();

  const total_Crimes = useMemo(() => {
    const result = crime_data
      .flat()
      .reduce<Record<string, number>>((acc, item) => {
        for (const [key, value] of Object.entries(item)) {
          if (item.borough_Name === active_Borough && key.endsWith("2024")) {
            acc[key] = (acc[key] || 0) + Number(value);
          }
        }
        return acc;
      }, {});

    const final_Result = Object.entries(result).map(([date, amount]) => ({
      date,
      borough: active_Borough,
      amount,
    }));

    return final_Result;
  }, [crime_data, active_Borough]);

  const filteredData = useMemo(() => {
    if (!total_Crimes) return [];

    return total_Crimes
      .map((item) => ({
        ...item,
        parsedDate: parsedDate(item.date),
      }))
      .filter((item) => {
        if (timeRange === "all") return true;
      })
      .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());
  }, [total_Crimes, timeRange]);

  

  return (
    <Card className="h-full">
      <CardContent className="py-0 px-2 sm:px-6 ">
        <div className="flex flex-col pb-4 justify-between">
          <h3 className="font-semibold">
            Crime Monthly Report - Borough of {active_Borough}
          </h3>
          <p className="text-sm font-medium text-muted-foreground">{crime}</p>
        </div>
        <ChartContainer
          config={chartConfig}
          className="space-y-2 h-[320px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var( --area-chart)"
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor="var( --area-chart)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={1}
              offset={3}
              interval="preserveStartEnd"
              tickFormatter={(value) => {
                const [month] = value.split("_");
                const dateFormated = month;
                return `${dateFormated.slice(0)}`;
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const [month, year] = value.split("_");
                    const date =
                      month.charAt(0).toUpperCase() +
                      month.slice(1) +
                      " " +
                      year;
                    return (
                      <div className="flex justify-start">
                        <h1>{date}</h1>
                        <h1></h1>
                      </div>
                    );
                  }}
                  indicator="line"
                />
              }
            />
            <Area
              dataKey="amount"
              type="natural"
              fill="url(#fillAmount)"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
