import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "../pages";
import Pager from "../pages/Pager";
import JoinRoom from "../pages/JoinRoom";
import ROUTES from "./ROUTES";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.INDEX} element={<Index />} />
        <Route path={ROUTES.JOIN_ROOM} element={<JoinRoom />} />
        <Route path={ROUTES.PAGER} element={<Pager />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
