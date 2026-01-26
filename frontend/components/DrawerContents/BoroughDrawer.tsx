"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChartAreaInteractive } from "../ChartsAndCards/SingleBorough/AreaChart/SingleBoroughAreaChart";
import { useSingleDrawerStore, useCrimeStore } from "@/store/store";
import { useMemo, useState } from "react";
import { SingleBoroughBarChart } from "../ChartsAndCards/SingleBorough/ComparisonChart/SingleBoroughBarChart";
import { CrimeLevelCard } from "../ChartsAndCards/SingleBorough/CrimeLevelCard/CrimeLevelCard";
import { CrimeDensityCard } from "../ChartsAndCards/SingleBorough/CrimeDensityCard/CrimeDensityCard";
import { CrimePercentCard } from "../ChartsAndCards/SingleBorough/CrimePercentCard/CrimePercentCard";
import { RankCrimeCard } from "../ChartsAndCards/SingleBorough/CrimeRankCard/RankCrimeCard";
import BoroughCrimesList from "../ChartsAndCards/SingleBorough/CrimeSpecificList/BoroughCrimesList";

export function BoroughDrawer() {
  const { active_Borough, open, useSetDrawer } = useSingleDrawerStore();
  const { crime_data } = useCrimeStore();

  const existing_Boroughs = useMemo(() => {
    const crime = crime_data.flat();
    const map = new Map();
    Object.values(crime).map((item) => {
      if (!map.get(item.borough_Name)) {
        map.set(item.borough_Name, item.borough_Name);
      }
    });

    return map;
  }, [crime_data]);

  if (!existing_Boroughs.has(active_Borough)) {
    return (
      <Sheet open={open} onOpenChange={useSetDrawer}>
        <SheetContent side="bottom" className="">
          <div className="@container h-[70vh] overflow-y-auto px-8 py-6 space-y-6 flex flex-col justify-center text-center items-center">
            <h1 className="text-4xl font-sans">
              The borough of `{active_Borough}` does not have any active data.
            </h1>
            <p className="text-muted-foreground text-xl">please select something else</p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }
  return (
    <Sheet open={open} onOpenChange={useSetDrawer}>
      <SheetContent side="bottom" className="">
        <SheetHeader className="border-b">
          <SheetTitle className="text-center">
            This is a showcase of the type of UI/UX designs
          </SheetTitle>
        </SheetHeader>

        <div className="@container h-[70vh] overflow-y-auto px-8 py-6 space-y-6">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-3 gap-6">
            <CrimeLevelCard />
            <CrimePercentCard />
            <RankCrimeCard />
          </div>

          {/* Main Charts Row */}
          <div className="grid grid-cols-3 gap-6">
            <CrimeDensityCard />
            <ChartAreaInteractive />
            <BoroughCrimesList />
          </div>

          {/* Bottom Charts Row */}
          <div className="grid grid-cols-1 gap-6">
            <SingleBoroughBarChart />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
