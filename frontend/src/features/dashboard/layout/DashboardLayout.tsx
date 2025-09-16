import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { Sheet } from "@/components/ui/sheet";
import { toggleSheet } from "../model/sheetSlice";
import SheetComponent from "../components/Sheet";
import { useAppDispatch, useAppSelector } from "@/app/store";
export const DashboardLayout = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.sheet.isOpen);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar>
        <main className="flex-1 p-6 overflow-y-auto relative">
          <Sheet open={isOpen} onOpenChange={() => dispatch(toggleSheet())}>
            <Outlet />
            <SheetComponent />
          </Sheet>
        </main>
      </Sidebar>
    </div>
  );
};
