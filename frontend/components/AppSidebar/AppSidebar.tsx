"use client";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarContent,
  SidebarMenuSubItem,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuAction,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { Separator } from "@radix-ui/react-select";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Menu,
  Map,
  SquareMousePointer,
  AlertTriangleIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useContext, useState } from "react";
import { stat } from "fs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import MainMenuSideBar from "./MainMenuSideBar/MainMenuSideBar";
import MapStyleSideBar from "./MapStyleSideBar/MapStyleSideBar";
import SettingsMenuSideBar from "./SettingsMenuSideBar/SettingsMenuSideBar";
import SearchMenuSideBar from "./SearchMenuSideBar/SearchMenuSideBar";
import SelectorMenuSideBar from "./SelectorMenuSideBar/SelectorMenuSideBar";
import { ReactNode } from "react";
import { ModeToggle } from "../ui/darkMode";
const items = [
  {
    title: "Home Menu",
    url: "#",
    icon: Home,
    text: "",
    menuBtn: "MAIN_MENU",
    description:
      "Provides a quick overview and easy access to the main features of the application.",
    smallTxt: "Description of the app.",
  },
  {
    title: "Data Selection Menu",

    icon: SquareMousePointer,
    menuBtn: "SELECTOR_MENU",
    description:
      "Allows you to choose and manage the specific datasets or items you want to work with.",
    smallTxt: "Select data to show.",
  },
  {
    title: "Map Style Menu",

    icon: Map,
    menuBtn: "MAP_STYLE",
    description:
      "Lets you specify which map style you want to show data selected on. Must select data first",
    smallTxt: "Select different map styles.",
  },
  {
    title: "Search Menu",

    icon: Search,
    menuBtn: "SEARCH_MENU",
    description:
      "Allows you to quickly find items, data, or features within the application.",
    smallTxt: "Search for settings.",
  },
  {
    title: "Settings Menu",

    icon: Settings,
    menuBtn: "SETTINGS_MENU",
    description:
      "Offers options to customize your preferences, app behavior, and display configurations.",
    smallTxt: "Customize the app.",
  },
];

export function AppSidebar() {
  const { state, setOpen } = useSidebar();
  type PageType =
    | "MAIN_MENU"
    | "MAP_STYLE"
    | "SELECTOR_MENU"
    | "SEARCH_MENU"
    | "SETTINGS_MENU";
  const [setPage, useSetPage] = useState<PageType>("MAIN_MENU");
  const pageComponents: Record<PageType, ReactNode> = {
    MAIN_MENU: <MainMenuSideBar />,
    SELECTOR_MENU: <SelectorMenuSideBar />,
    MAP_STYLE: <MapStyleSideBar />,
    SEARCH_MENU: <SearchMenuSideBar />,
    SETTINGS_MENU: <SettingsMenuSideBar />,
  };

  function SetMenuOption(str: PageType) {
    useSetPage(str);
  }
  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className="group/sidebar overflow-x-hidden "
    >
      <SidebarHeader>
        <SidebarHeader className="sticky">
          <SidebarGroup>
            <SidebarMenuItem
              className={`flex  ${
                state === "expanded"
                  ? "justify-center space-x-2"
                  : "justify-center items-center flex-col space-x-0"
              }`}
            >
              {state === "collapsed" ? (
                <>
                  <Button
                    variant="outline"
                    className="justify-center text-center font-sans"
                    onClick={() => setOpen(true)}
                  >
                    <Menu />
                  </Button>
                </>
              ) : (
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    className="hover:bg-muted"
                    onClick={() => setOpen(false)}
                  >
                    <Menu />
                    <span>Marco Polo</span>
                  </Button>
                  <div className="flex justify-between space-x-2">
                    <TriangleAlertIcon/>
                    <p>TESTING ENVIRONMENT</p>
                    <TriangleAlertIcon/>
                  </div>
                </div>
              )}
            </SidebarMenuItem>
          </SidebarGroup>
          <Separator className="border" />
          <SidebarGroup className="group">
            <SidebarMenuItem
              className={`flex  ${
                state === "expanded"
                  ? "justify-center space-x-4"
                  : "justify-center items-center flex-col space-x-0 space-y-2"
              }`}
            >
              {items.map((item) => (
                <HoverCard key={item.title}>
                  <HoverCardTrigger
                    asChild
                    onPointerDown={(e) => e.preventDefault()}
                  >
                    <Button
                      key={item.title}
                      variant={item.menuBtn === setPage ? "default" : "ghost"}
                      onClick={() => {
                        setOpen(true);
                        SetMenuOption(item.menuBtn as PageType);
                      }}
                    >
                      <item.icon />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent
                    className={`w-80 ${
                      state === "collapsed"
                        ? "translate-x-14 -translate-y-12 shadow-xl hover:shadow-md transition"
                        : "shadow-sm hover:shadow-md transition"
                    }`}
                    align={`${state === "expanded" ? "center" : "start"}`}
                  >
                    <div className="flex items-start gap-2 rounded-2xl ">
                      <div className="text-primary flex object-center">
                        <item.icon className="text-3xl" />
                      </div>

                      <div className="flex flex-col">
                        <h1 className="text-lg font-semibold tracking-tight">
                          {item.title}
                        </h1>

                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>

                        <div className="text-xs text-muted-foreground mt-2">
                          {item.smallTxt}
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
              <ModeToggle />
            </SidebarMenuItem>
          </SidebarGroup>
          <Separator className="border" />
        </SidebarHeader>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden px-2">
        {state === "expanded" ? pageComponents[setPage] : null}
      </SidebarContent>
    </Sidebar>
  );
}
