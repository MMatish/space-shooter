import { Outlet } from "react-router-dom";
import CustomCursor from "../components/CustomCursor/CustomCursor";

const MainLayout = () => {
  return (
    <div>
        <Outlet></Outlet>
        <CustomCursor />
    </div>
  )
}

export default MainLayout;
