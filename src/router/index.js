import { BrowserRouter, Route, Routes } from "react-router-dom";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h2>Hello</h2>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
