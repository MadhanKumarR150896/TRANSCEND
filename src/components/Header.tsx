import { NavLink } from "react-router";
import Logo from "../assets/Full_Logo.svg";

export const Header = () => {
  return (
    <header className="flex z-100 items-center justify-start-safe h-12 md:h-14 lg:h-16 shrink-0 bg-white border border-neutral-300 rounded px-1">
      <NavLink to={"/admindashboard"}>
        <img className="h-8 md:h-10 lg:h-12" src={Logo} alt="App_logo" />
      </NavLink>
    </header>
  );
};
