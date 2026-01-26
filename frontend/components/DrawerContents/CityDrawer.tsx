"use client";
import { SetStateAction } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import CityCrimeList from "../ChartsAndCards/City/City Specific Crimes List/CityCrimeList";
import MonthlyCrimeData from "../ChartsAndCards/City/City Monthly Crime Trends/CityCrimeTrends";
import CityBoroughRank from "../ChartsAndCards/City/City Borough Rank/CityBoroughRank";
import CityCrimeLevel from "../ChartsAndCards/City/City Crime Level/CityCrimeLevel";
import CityCrimeDensity from "../ChartsAndCards/City/City Crime Density/CityCrimeDensity";
import { useCityDrawer } from "@/store/store";

function CityDrawer() {
  const { open, setOpen } = useCityDrawer();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="bottom" className="">
        <SheetHeader className="border-b">
          <SheetTitle className="text-center">
            This is a showcase of the type of UI/UX designs
          </SheetTitle>
          <div className="@container h-[70vh] overflow-y-auto px-8 py-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 ">
              <MonthlyCrimeData />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <CityBoroughRank />
              <CityCrimeDensity />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <CityCrimeList />
              <CityCrimeLevel />
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
export default CityDrawer;
