import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSingleDrawerStore } from "@/store/store";
import { city_Helpers } from "@/helpers/city_Helpers";
type SetPropType = {
  chart_One: string;
  chart_Two: string;
  set_Chart_Name: React.Dispatch<React.SetStateAction<string>>;
  setChart: (s: string) => void;
};
export function ItemSelector({
  chart_One,
  chart_Two,
  set_Chart_Name,
  setChart,
}: SetPropType) {
  const { active_Borough, city } = useSingleDrawerStore();

  const handleValueChange = (value: string) => {
    setChart(value);
    console.log("Selected:", value);
    set_Chart_Name(value);
  };

  const active_City = city_Helpers.find((item) => {
    if (item.city === city) {
      return item;
    }
  });

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a borough" />
      </SelectTrigger>
      <SelectContent className="h-60 w-[280px]">
        <SelectGroup>
          <SelectLabel>Boroughs of {city}</SelectLabel>
          {active_City?.boroughs.map((item) => {
            return (
              <SelectItem
                className={`hover:cursor-pointer text-sm font-medium ${
                  active_Borough ===  item.borough||
                  chart_One === item.borough ||
                  chart_Two === item.borough
                    ? "text-muted-foreground"
                    : null
                }`}
                disabled={
                  active_Borough === item.borough ||
                  chart_One === item.borough ||
                  chart_Two === item.borough
                    ? true
                    : false
                }
                value={item.borough}
                key={item.borough}
              >
                {item.borough}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
