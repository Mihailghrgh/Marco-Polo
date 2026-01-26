"use client";

function SelectorBreadCrumb({
  topic,
  location,
}: {
  topic: string;
  location: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <p className="text-left text-base font-medium tracking-tight text-muted-foreground">
        {topic}
      </p>
      <svg
        className="w-4 h-4 text-left text-base font-medium tracking-tight text-muted-foreground"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
      <p className="text-left text-base font-medium tracking-tight text-muted-foreground">
        {location}
      </p>
    </div>
  );
}
export default SelectorBreadCrumb;
