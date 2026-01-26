"use client";
import { Users, ShieldAlert } from "lucide-react";

type Prop = {
  borough_Pop: string;
  total_Crime: number;
};
function CrimeData({ borough_Pop, total_Crime }: Prop) {
  const number = (): number => {
    if (borough_Pop?.replaceAll(",", "").length >= 6) {
      return 100000;
    } else if (borough_Pop?.replaceAll(",", "").length < 6) {
      return 10000;
    }
    return 0;
  };

  return (
    <div className="flex md:flex-wrap justify-between space-x-1">
      <div className="flex items-center space-x-2 py-2">
        <div className="flex w-12 h-12 items-center justify-center rounded-2xl bg-blue-500/10">
          <Users className="w-6 h-6 text-blue-500" />
        </div>
        <div className="flex justify-center items-center text-center space-x-1">
          <p className="text-sm font-medium text-muted-foreground">
            Population
          </p>
          <p className="sm:text-sm font-bold">{borough_Pop}</p>
        </div>
      </div>
      <div className="flex  items-center space-x-2 py-2">
        <div className="flex w-12 h-12 items-center justify-center rounded-2xl bg-red-500/10">
          <ShieldAlert className="w-6 h-6 text-red-500" />
        </div>
        <div className="flex justify-center items-center text-center space-x-1">
          <p className="text-sm font-medium text-muted-foreground">
            Crime Level
          </p>
          <p className="text-sm text-center font-bold">
            {(
              (Number(total_Crime) / Number(borough_Pop?.replaceAll(",", ""))) *
              number()
            ).toFixed()}{" "}
            per {borough_Pop?.replaceAll(",", "").length <= 5 ? "10K" : "100k"}
          </p>
        </div>
      </div>
    </div>
  );
}
export default CrimeData;
