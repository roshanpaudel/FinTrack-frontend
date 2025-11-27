import { Routes, Route, Outlet } from "react-router-dom";

export const DefaultLayout = () => {
  return (
    <div>
      //navbar
      <Outlet />
      //footer
      <p>hello hello </p>
    </div>
  );
};
