import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useCrimeStore } from "@/store/store";
import { Button } from "@/components/ui/button";
import { useSingleDrawerStore } from "@/store/store";
function MonthlyCrimeData() {
  const { crime_data } = useCrimeStore();
  const { city , crime} = useSingleDrawerStore();
  const ITEMS_PER_PAGE = 4;
  const MAX_PAGES = 3;

  const monthly_Crimes = useMemo(() => {
    const crimes = crime_data.flat();
    const map = new Map<string, number>();

    for (const [index, item] of Object.entries(crimes)) {
      for (const [month, value] of Object.entries(item)) {
        if (month.endsWith("2024")) {
          if (!map.get(month)) map.set(month, Number(value));
          else {
            const amount = Number(map.get(month)) + Number(value);
            map.set(month, amount);
          }
        }
      }
    }

    return [...map];
  }, [crime_data]);

  const limitedItems = monthly_Crimes.slice(0, ITEMS_PER_PAGE * MAX_PAGES);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.min(
    Math.ceil(limitedItems.length / ITEMS_PER_PAGE),
    MAX_PAGES
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const currentItems = limitedItems.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const getDate = (date: string) => {
    const month = date.replace("_", " ");
    const formatted_Date = month.charAt(0).toUpperCase() + month.slice(1);
    return formatted_Date;
  };

  const values = monthly_Crimes.map(([key, value]) => value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  const calcPercentage = (value: number) => {
    if (minValue === maxValue) return 50;
    return ((value - minValue) / (maxValue - minValue)) * 100;
  };

  // Transform data for the chart
  const chartData = currentItems.map((item, index) => {
    const globalIndex = startIndex + index;
    const currentValue = limitedItems[globalIndex]?.[1];
    const previousValue = limitedItems[globalIndex - 1]?.[1] ?? 0;

    const percentChange = previousValue
      ? Number(
          (((currentValue - previousValue) / previousValue) * 100).toFixed(1)
        )
      : 0;

    const barPercentage = calcPercentage(item[1]);

    return {
      month: getDate(item[0]),
      crimes: item[1],
      percentChange,
      barPercentage,
      // Color based on severity
      fill:
        barPercentage > 70
          ? "hsl(9, 95%, 53%)"
          : barPercentage >= 50
          ? "hsl(25, 95%, 53%)"
          : barPercentage >= 30
          ? "hsl(142, 76%, 36%)"
          : "hsl(233, 71%, 45%)",
    };
  });

  const chartConfig = {
    crimes: {
      label: "Crimes",
      color: "hsl(var(--chart-1))",
    },
    label: {
      color: "hsl(var(--background))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="border-border bg-card md:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Monthly Crimes Trends - {city}
        </CardTitle>
        <CardDescription className="mt-1 text-sm text-muted-foreground">
          {crime}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-[245px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 20,
              left: 20,
            }}
            barSize={20}
            width={500}
            height={200}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis dataKey="crimes" type="number" />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value, name, props) => (
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">{value} crimes</span>
                      {props.payload.percentChange !== 0 && (
                        <span
                          className={`text-xs ${
                            props.payload.percentChange < 0
                              ? "text-green-600"
                              : "text-destructive"
                          }`}
                        >
                          {props.payload.percentChange > 0 ? "+" : ""}
                          {props.payload.percentChange}% from previous month
                        </span>
                      )}
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey="crimes" layout="vertical" radius={2}>
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="crimes"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <Button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default MonthlyCrimeData;
