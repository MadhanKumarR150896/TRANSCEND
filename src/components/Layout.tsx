import { Outlet } from "react-router";
import { Header } from "./Header";

export const Layout = () => {
  return (
    <div className="flex flex-col h-dvh bg-neutral-100 text-neutral-900 text-base gap-2 p-2">
      <Header />
      <main
        style={{ scrollbarWidth: "none" }}
        className="flex-1 w-full overflow-none md:overflow-y-auto flex flex-col"
      >
        <Outlet />
      </main>
    </div>
  );
};
