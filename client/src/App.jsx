import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Items from "./pages/Items";
import Dispatch from "./pages/Dispatch";
import Login from "./pages/Login";
import Receives from "./pages/Receives";
import Stock from "./pages/Stock";
import Summary from "./pages/Summary";

import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CheckAuth from "./components/CheckAuth";
import Category from "./pages/Category";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/"
        element={
          <CheckAuth>
            <Layout />
          </CheckAuth>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="items" element={<Items />} />
        <Route path="categories" element={<Category />} />
        <Route path="dispatch" element={<Dispatch />} />
        <Route path="receive" element={<Receives />} />
        <Route path="stock" element={<Stock />} />
        <Route path="summary" element={<Summary />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
