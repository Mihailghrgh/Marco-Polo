"use client";
function CrimeHeader({ active_Borough , crime}: { active_Borough: string  , crime: string}) {
  return (
    <div className="w-full space-y-0">
      <h1 className="font-semibold">
        {" "}
        Crime Level - Borough of {active_Borough}
      </h1>
      <p className="text-sm font-medium text-muted-foreground">{crime}</p>
    </div>
  );
}
export default CrimeHeader;
