"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import SelectorBreadCrumb from "./SelectorBreadCrumb";
import { data_Menu } from "@/helpers/menu_Helper";
import { useState } from "react";
import { BoroughDrawer } from "@/components/DrawerContents/BoroughDrawer";
import CityDrawer from "@/components/DrawerContents/CityDrawer";
import CrimeSelectorMenu from "./Crime/CrimeSelectorMenu";
function SelectorMenuSideBar() {
  const isMobile = useIsMobile();
  const [dataType, useSetDataType] = useState<string>("Crime");
  const [location, useSetLocation] = useState<string>("London");
  const [setActive, useSetActive] = useState<boolean>(true);

  function SetBreadCrumbs(str1: string, str2: string) {
    useSetActive(true);
    useSetDataType(str1);
    useSetLocation(str2);
  }
  return (
    <>
      <SidebarGroup>
        <SidebarMenu>
          <div className="space-y-4 pb-2">
            <h1 className="text-center text-lg font-semibold tracking-tight">
              Select a Topic
            </h1>
            {/* <p className="text-left text-base font-medium tracking-tight text-muted-foreground">
              Pick a topic from the menu to begin exploring the available data
              and heatmaps.
            </p> */}
          </div>
          <SidebarMenuItem className=" flex justify-center items-center ">
            <NavigationMenu viewport={isMobile}>
              <NavigationMenuList className=" flex flex-row gap-0 space-x-2">
                {/******** ***** ***** ***** */}
                {data_Menu.map((item) => {
                  return (
                    <NavigationMenuItem
                      key={item.data_Type}
                      className="relative"
                    >
                      <NavigationMenuTrigger
                        className="h-10 rounded-lg text-sm font-medium shadow-none hover:bg-slate-200 hover:text-accent-foreground hover:cursor-pointer data-[state=closed]:bg-transparent"
                        disabled={item.data_Type === "Crime" ? false : true}
                      >
                        {item.data_Type}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="mt-2 w-40 shadow-lg rounded border z-50 p-2 left-1/2 -translate-x-1/2">
                        <ul className="grid gap-2">
                          {[...item.data_Location].map((location, index) => {
                            return (
                              <li key={index}>
                                <NavigationMenuLink asChild>
                                  <Button
                                    variant="ghost"
                                    className="w-full flex justify-start"
                                    disabled={
                                      location === "London" ||
                                      location === "San Francisco"
                                        ? false
                                        : true
                                    }
                                    onClick={() =>
                                      SetBreadCrumbs(item.data_Type, location)
                                    }
                                  >
                                    {location}
                                  </Button>
                                </NavigationMenuLink>
                              </li>
                            );
                          })}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  );
                })}
                {/******** ***** ***** ***** */}
              </NavigationMenuList>
            </NavigationMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarMenu>
          {setActive ? (
            <>
              <SelectorBreadCrumb topic={dataType} location={location} />
              {dataType === "Crime" ? (
                <CrimeSelectorMenu location={location} />
              ) : null}
            </>
          ) : null}
        </SidebarMenu>
      </SidebarGroup>
      <BoroughDrawer />
      <CityDrawer />
    </>
  );
}
export default SelectorMenuSideBar;
