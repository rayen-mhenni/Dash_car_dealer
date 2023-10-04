import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Tables from "./pages/Tables";
import Data from "./pages/Data";
import Profile from "./pages/Profile";
import Billing from "./pages/Billing";
import ProtectedRoute from "./ProtectedRoute";
import RestPassword from "./pages/RestPassword";
import Partners from "./pages/Partners";
import Reservation from "./pages/Reservation";
import Sliders from "./pages/Sliders";
import Services from "./pages/Services";
import Team from "./pages/Team";
import Contacts from "./pages/Contacts";
import Opinions from "./pages/Opinions";
import CustomMailGen from "./pages/CustomMailGenerator";
import Article from "./pages/Article";
import Semulations from "./pages/Semulations";
import Config from "./pages/Config";
import TextEditor from "./pages/TextEditor";
import Page from "./pages/Pages";
import _ from "lodash";
import { useEffect } from "react";
import { getJSON } from "./utils";
import Navigation from "./pages/Navigation";
import Gestion from "./pages/Gestion";
import HtmlEditor from "./pages/HTML Editor";
import Users from "./pages/Users";

function App() {
  if (!localStorage.getItem("token") || !getJSON(localStorage.getItem("token")))
    <Navigate to="/sign-in" />;
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<Navigate to="/dashboard" />} />
          <Route path="/resetpassword/:id/:token" element={<RestPassword />} />

          {/* <Route path="/sign-up" element={<SignUp />} /> */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Main />}>
              <Route path="/billing" element={<Billing />} />
              <Route path="/gestion" element={<Gestion />} />
              <Route path="/tables" element={<Tables />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/meeting" element={<Reservation />} />
              <Route path="/opinions" element={<Opinions />} />
              <Route path="/article" element={<Article />} />
              <Route path="/config" element={<Config />} />
              <Route path="/pages" element={<Page />} />
              <Route path="/semulations" element={<Semulations />} />
              <Route path="/contact" element={<Contacts />} />
              <Route path="/services" element={<Services />} />
              <Route path="/data" element={<Data />} />
              <Route path="/sliders" element={<Sliders />} />
              <Route path="/team" element={<Team />} />
              <Route path="/dashboard" element={<Home />} />
              <Route path="/navigation" element={<Navigation />} />

              <Route path="/profile" element={<Profile />} />
              <Route path="/custommail" element={<CustomMailGen />} />
              <Route path="/htmleditor" element={<HtmlEditor />} />
              <Route path="/users" element={<Users />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
