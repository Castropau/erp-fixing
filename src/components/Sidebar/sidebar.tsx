"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "../Context/SidebarContext";
import { SidebarTooltip } from "./SidebarTooltip";

import {
  MdDashboard,
  MdOutlineInventory,
  MdReceiptLong,
} from "react-icons/md";
import { IoIosArrowDown, IoMdCart, IoMdCard } from "react-icons/io";
import { FaStore } from "react-icons/fa6";
import {
  HiOutlineCalculator,
  HiClipboardDocumentList,
  HiDocumentCurrencyDollar,
} from "react-icons/hi2";
import { PiHandWithdraw } from "react-icons/pi";
import { BsPersonVcard, BsPersonFillGear } from "react-icons/bs";
import { FaMoneyBillAlt, FaRegUserCircle } from "react-icons/fa";

// Icon wrapper
const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="w-6 h-6 flex items-center justify-center text-xl">
    {children}
  </div>
);

const navSections = [
  {
    items: [{ name: "Dashboard", icon: <MdDashboard />, path: "/erp-v2/dashboard" }],
  },
  {
    title: "Accounting",
    items: [
      {
        name: "Requisition",
        icon: <IoMdCard />,
        subItems: [
          { name: "Cash Request", path: "/erp-v2/cash-request" },
          { name: "Cheque Request", path: "/erp-v2/cheque-request" },
        ],
      },
      { name: "Liquidation", icon: <HiOutlineCalculator />, path: "/erp-v2/liquidation" },
    ],
  },
  {
    title: "CRM",
    items: [
      {
        name: "Quotation",
        icon: <HiDocumentCurrencyDollar />,
        subItems: [
          { name: "Quotation", path: "/erp-v2/quotation" },
          { name: "BOM Quotation", path: "/erp-v2/bom-quotation" },
        ],
      },
      { name: "Vendors", icon: <FaStore />, path: "/erp-v2/vendors" },
      { name: "Clients", icon: <BsPersonVcard />, path: "/erp-v2/clients" },
      { name: "Delivery Receipt", icon: <MdReceiptLong />, path: "/erp-v2/delivery-receipt" },
    ],
  },
  {
    title: "SCM",
    items: [{ name: "Purchase Order", icon: <IoMdCart />, path: "/erp-v2/purchase-order" }],
  },
  {
    title: "Warehouse Management",
    items: [
      { name: "Inventory", icon: <MdOutlineInventory />, path: "/erp-v2/inventory" },
      { name: "Withdraw Materials", icon: <PiHandWithdraw />, path: "/erp-v2/withdraw_materials" },
      { name: "Product Master List", icon: <HiClipboardDocumentList />, path: "/erp-v2/product_master_list" },
    ],
  },
  {
    title: "Manufacturing Production",
    items: [
      { name: "Bill of Materials", icon: <FaMoneyBillAlt />, path: "/erp-v2/bill_of_materials" },
      { name: "Labor of Computation", icon: <BsPersonFillGear />, path: "/erp-v2/labor_of_computation" },
    ],
  },
  {
    title: "Account Management",
    items: [{ name: "Users", icon: <FaRegUserCircle />, path: "/erp-v2/user" }],
  },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [tooltipContent, setTooltipContent] = useState<React.ReactNode>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [isSidebarHover, setIsSidebarHover] = useState(false);
  const [isTooltipHover, setIsTooltipHover] = useState(false);

  // Check if exact path is active
  const isActive = (path: string) => pathname === path;

  // Check if any subitem is active
  const isSubItemActive = (subItems: { path: string }[]) =>
    subItems.some((sub) => pathname === sub.path);

  // Toggle dropdown open/close
  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  // Show tooltip and mark sidebar hover true
// ... inside Sidebar component

// Show tooltip and mark sidebar hover true
//  const [isSidebarHover, setIsSidebarHover] = useState(false);
//   const [isTooltipHover, setIsTooltipHover] = useState(false);

  // Add refs to hold latest hover state
  const isSidebarHoverRef = useRef(isSidebarHover);
  const isTooltipHoverRef = useRef(isTooltipHover);

  // Update refs whenever state changes
  React.useEffect(() => {
    isSidebarHoverRef.current = isSidebarHover;
  }, [isSidebarHover]);

  React.useEffect(() => {
    isTooltipHoverRef.current = isTooltipHover;
  }, [isTooltipHover]);

  // Timeout ref so we can clear on enter
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cancel any pending hide tooltip timeout
  const cancelHideTimeout = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  // When mouse enters sidebar item
  const handleMouseEnter = (e: React.MouseEvent, content: React.ReactNode) => {
    if (!isCollapsed) return;
    cancelHideTimeout();
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.right + 12, y: rect.top });
    setTooltipContent(content);
    setTooltipVisible(true);
    setIsSidebarHover(true);
  };

  // When mouse leaves sidebar item
  const handleMouseLeave = () => {
    if (!isCollapsed) return;
    setIsSidebarHover(false);
    hideTimeoutRef.current = setTimeout(() => {
      // Use latest refs here
      if (!isSidebarHoverRef.current && !isTooltipHoverRef.current) {
        setTooltipVisible(false);
      }
    }, 150);
  };

  // Tooltip mouse enter
  const handleTooltipMouseEnter = () => {
    cancelHideTimeout();
    setIsTooltipHover(true);
    setTooltipVisible(true);
  };

  // Tooltip mouse leave
  const handleTooltipMouseLeave = () => {
    setIsTooltipHover(false);
    hideTimeoutRef.current = setTimeout(() => {
      if (!isSidebarHoverRef.current && !isTooltipHoverRef.current) {
        setTooltipVisible(false);
      }
    }, 150);
  };


  return (
    <>
      <aside
        className={`fixed top-19 left-0 z-40 h-screen max-h-[90vh] transition-all duration-300 bg-[#800000] text-white overflow-scroll no-scrollbar border-r border-black dark:bg-gray-900 ${
          isCollapsed ? "w-16" : "w-64"
        } p-4`}
      >
        <ul className="text-sm font-medium space-y-2 max-h-[calc(97vh-80px)]">
          {navSections.map((section, sectionIndex) => {
            // Determine if this section has active path or subpath to highlight the title
            const sectionHasActive =
              section.items.some(
                (item) =>
                  isActive(item.path ?? "") ||
                  (item.subItems && isSubItemActive(item.subItems))
              );

            return (
              <li key={section.title ?? `section-${sectionIndex}`}>
                {section.title && !isCollapsed && (
                  <div
                    className={`text-xs font-bold tracking-wider ml-3 py-3 uppercase ${
                      sectionHasActive ? "text-yellow-300" : "text-white"
                    }`}
                  >
                    {section.title}
                  </div>
                )}
                <ul className="space-y-1">
                  {section.items.map((item, itemIndex) => {
                    const hasDropdown = !!item.subItems;
                    const isOpen = openDropdown === item.name;

                    // Active if this item path is active or any of its subitems active
                    const isItemActive =
                      isActive(item.path ?? "") ||
                      (hasDropdown && isSubItemActive(item.subItems!));

                    const hoverContent = (
                      <div className="cursor-pointer">
                        <div className="px-4 py-2 font-semibold border-b border-red-400">
                          {item.path ? (
                            <Link
                              href={item.path}
                              className="text-white hover:underline"
                              onClick={() => setTooltipVisible(false)}
                            >
                              {item.name}
                            </Link>
                          ) : (
                            item.name
                          )}
                        </div>
                        {item.subItems && (
                          <ul className="p-2 space-y-1">
                            {item.subItems.map((sub) => (
                              <li key={sub.path}>
                                <Link
                                  href={sub.path}
                                  className="block px-4 py-2 rounded hover:bg-red-600 text-white"
                                  onClick={() => setTooltipVisible(false)}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );

                    return (
                      <li key={`${item.name}-${itemIndex}`} className="relative">
                        <div
                          onMouseEnter={(e) =>
                            isCollapsed && handleMouseEnter(e, hoverContent)
                          }
                          onMouseLeave={handleMouseLeave}
                        >
                          {hasDropdown ? (
                            <button
                              onClick={() => toggleDropdown(item.name)}
                              className={`flex items-center justify-between w-full p-2 text-left rounded-lg ${
                                isItemActive
                                  ? "bg-white text-[#800000] font-semibold"
                                  : "text-white hover:bg-red-600"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <IconWrapper>{item.icon}</IconWrapper>
                                {!isCollapsed && <span className="ms-3">{item.name}</span>}
                              </div>
                              {!isCollapsed && (
                                <IoIosArrowDown
                                  className={`transition-transform duration-200 ${
                                    isOpen ? "rotate-180" : ""
                                  }`}
                                />
                              )}
                            </button>
                          ) : (
                            <Link
                              href={item.path!}
                              className={`flex items-center p-2 rounded-lg ${
                                isItemActive
                                  ? "bg-white text-[#800000] font-semibold"
                                  : "text-white hover:bg-red-600"
                              }`}
                            >
                              <IconWrapper>{item.icon}</IconWrapper>
                              {!isCollapsed && <span className="ms-3 whitespace-nowrap">{item.name}</span>}
                            </Link>
                          )}
                        </div>

                        {/* Subitems expanded view */}
                        {!isCollapsed && isOpen && item.subItems && (
                          <ul className="ml-9 mt-1 space-y-1">
                            {item.subItems.map((sub, subIndex) => (
                              <li key={`${sub.name}-${item.name}-${subIndex}`}>
                                <Link
                                  href={sub.path}
                                  className={`block p-2 rounded-lg ${
                                    isActive(sub.path)
                                      ? "bg-white text-[#800000] font-semibold"
                                      : "text-white hover:bg-red-600"
                                  }`}
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </aside>

      <SidebarTooltip
        content={tooltipContent}
        position={tooltipPos}
        visible={tooltipVisible}
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={handleTooltipMouseLeave}
      />
    </>
  );
};

export default Sidebar;
