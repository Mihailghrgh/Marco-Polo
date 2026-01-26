"use client";
function CrimeDescription() {
  return (
    <div className="w-full hide-1562x911">
      <p className="text-xs text-muted-foreground">
        Crime level is calculated using the following formula for all cities
      </p>
      <p className="text-xs text-muted-foreground">
        ( crime count / population ) * 10K
      </p>
    </div>
  );
}
export default CrimeDescription;
