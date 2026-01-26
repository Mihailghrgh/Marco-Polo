"use client";
import { AlertTriangleIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function EmptyDataCard() {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-center text-center ">
          <div className="flex justify-between items-center space-x-2">
            <div className=" rounded-full p-2 mb-2">
              <AlertTriangleIcon className="w-8 h-8 text-red-700" />
            </div>

            <h3 className="text-center text-lg font-semibold tracking-tight mb-2">
              No Records Found !
            </h3>
          </div>

          <p className="text-left text-base font-medium tracking-tight text-muted-foreground">
            There are no records for the selected data. Please select another
            combination and press button `View Data` again.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
