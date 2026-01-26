"use client";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";
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
import { useMemo } from "react";
import { useSingleDrawerStore } from "@/store/store";
const chartConfig = {
  chart1: {
    color: "hsl(9, 95%, 53%)",
  },
  chart2: {
    color: "hsl(29, 95%, 53%)",
  },
  chart3: {
    color: "hsl(111, 95%, 33%)",
  },
  chart4: {
    color: "hsl(111, 95%, 53%)",
  },
  chart5: {
    color: "hsl(211, 95%, 53%)",
  },
} satisfies ChartConfig;

const chartColors = [
  "hsl(9,95%,53%)",
  "hsl(29,95%,53%)",
  "hsl(111,95%,33%)",
  "hsl(111,95%,53%)",
  "hsl(211,95%,53%)",
];
import { useCrimeStore } from "@/store/store";
import { useTheme } from "next-themes";

function CityBoroughRank() {
  const { theme } = useTheme();
  const { crime_data } = useCrimeStore();
  const { city , crime , date } = useSingleDrawerStore();
  const crime_Max_Queue = useMemo(() => {
    const crimes = crime_data.flat();

    const map = new Map<string, number>();

    for (const [index, item] of Object.entries(crimes)) {
      if (!map.get(item.borough_Name)) {
        map.set(item.borough_Name, 0);
        for (const [index, element] of Object.entries(item)) {
          if (index.endsWith(date)) {
            const amount =
              Number(map.get(item?.borough_Name)) + Number(element);
            map.set(item.borough_Name, amount);
          }
        }
      } else {
        for (const [index, element] of Object.entries(item)) {
          if (index.endsWith(date)) {
            const amount =
              Number(map.get(item?.borough_Name)) + Number(element);
            map.set(item.borough_Name, amount);
          }
        }
      }
    }

    const max_Queue = [...map.entries()].sort((a, b) => b[1] - a[1]);
    const chart_data = max_Queue.slice(0, 5).map(([borough, amount], index) => {
      const chartItem = {
        borough: borough,
        amount: amount,
        fill: `var(--color-chart${index + 1})`,
        color: chartColors[index],
      };

      return chartItem;
    });

    return chart_data;
  }, [crime_data, date]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Top 5 Boroughs by Crime - {city}</CardTitle>
        <CardDescription>{crime}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[245px] w-full pb-2"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={crime_Max_Queue}
              dataKey="amount"
              label={({ payload, ...props }) => {
                return (
                  <text
                    cx={props.cx}
                    cy={props.cy}
                    x={props.x}
                    y={props.y}
                    textAnchor={props.textAnchor}
                    dominantBaseline={props.dominantBaseline}
                    fill={theme === "dark" ? "#fff" : "#011"}
                  >
                    {payload.borough}
                  </text>
                );
              }}
              nameKey="borough"
            />
          </PieChart>
        </ChartContainer>
        <div className="grid grid-cols-3">
          {crime_Max_Queue.map((item) => {
            return (
              <div
                key={item.borough}
                className="flex justify-center text-center items-center space-x-1 px-2"
              >
                <div
                  style={{ backgroundColor: item.color }}
                  className="aspect-square h-2 w-2"
                />
                <h1>{item.borough}</h1>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
export default CityBoroughRank;
