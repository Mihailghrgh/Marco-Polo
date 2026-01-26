"use client";
import HeathMap from "./Heatmap";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar/AppSidebar";
import "maplibre-gl/dist/maplibre-gl.css";

function App({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main >
      <HeathMap />
      <SidebarProvider
        style={
          {
            "--sidebar-width": "35rem",
            "--sidebar-width-icon": "4rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <div className="flex justify-between w-full z-10 h-0 py-2 px-2 ">
          <SidebarTrigger variant="outline" className="z-50" />
        </div>
        {children}
      </SidebarProvider>
    </main>
  );
}
export default App;
