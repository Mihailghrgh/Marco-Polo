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

function MainMenuSideBar() {
  return (
    <SidebarGroup>
      <div className="space-y-4 pb-2">
        <h1 className="text-center text-lg font-semibold tracking-tight">
          Welcome to Marco Polo!
        </h1>
        <div>
          <p className="text-left text-base font-medium tracking-tight text-muted-foreground">
            Marco Polo is a major personal project built to explore and
            visualize data across a wide range of topics such as crime,
            earthquakes, rainfall, and other real-world phenomena. The goal is
            to make complex datasets more approachable through interactive maps,
            heatmaps, and spatial analysis that reveal patterns and trends in an
            intuitive way.
            <br />
            <br />
            You are currently viewing a development environment used for testing
            new features, experimenting with ideas, and refining the overall
            experience. Things may change, break, or evolve as the project
            grows.
            <br />
            <br />
            This application was originally started as a response to the growing
            practice of data hoarding by large platforms that place essential
            datasets behind expensive paywalls, sometimes charging hundreds of
            dollars for partial access. Marco Polo aims to promote openness,
            transparency, and accessibility by sourcing, processing, and
            presenting data in a way that is easier to explore, verify, and
            learn from.
            <br />
            <br />
            If you encounter any bugs, have suggestions, or would like to share
            feedback, please send an email to <strong>email@com.com</strong>.
            <br />
            <br />
            Enjoy and have fun!
          </p>
        </div>
      </div>
    </SidebarGroup>
  );
}
export default MainMenuSideBar;
