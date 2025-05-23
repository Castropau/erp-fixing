// // layout.tsx
// import React from "react";
// import Sidebar from "@/components/Sidebar/sidebar";
// import AppHeader from "@/components/NavigationHeader/AppHeader";
// import { SidebarProvider } from "@/components/Context/SidebarContext"; // Make sure path is correct
// import { ThemeProvider } from "@/components/Context/ThemeContext"; // Optional: for theme context

// export default function layout({ children }: { children: React.ReactNode }) {
//   return (
//     <ThemeProvider>
//       <SidebarProvider>
//         <div className="flex flex-col min-h-screen bg-gray-300 dark:bg-gray-dark">
//           {/* App Header */}
//           <AppHeader />
//           <div className="flex flex-1">
//             {/* Sidebar */}
//             <Sidebar />
//             <main className="flex-1 overflow-y-auto p-4">{children}</main>
//           </div>
//         </div>
//       </SidebarProvider>
//     </ThemeProvider>
//   );
// }
"use client";

import React from "react";
import Sidebar from "@/components/Sidebar/sidebar";
import AppHeader from "@/components/NavigationHeader/AppHeader";
import {
  SidebarProvider,
  useSidebar,
} from "@/components/Context/SidebarContext";
import { ThemeProvider } from "@/components/Context/ThemeContext"; // Optional

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Apply dynamic margin
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? //  ? "lg:ml-[290px]"
      "lg:ml-[260px]"
    : // : "lg:ml-[90px]";
      "lg:ml-[70px]";

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-dark">
      {/* App Header */}
      <AppHeader />
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content with dynamic margin */}
        <main
          className={`flex-1 overflow-y-auto  transition-all duration-300 ease-in-out ${mainContentMargin}`}

          // className={`flex-1 overflow-y-auto p-4 transition-all duration-300 ease-in-out ${mainContentMargin}`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <LayoutContent>{children}</LayoutContent>
      </SidebarProvider>
    </ThemeProvider>
  );
}
