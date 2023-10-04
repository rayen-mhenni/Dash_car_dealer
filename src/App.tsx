import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Main from "./components/layout/Main";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";

import ProtectedRoute from "./ProtectedRoute";
import RestPassword from "./pages/RestPassword";

import Contacts from "./pages/Contacts";

import Cars from "./pages/Cars";

function App() {
  // if (!localStorage.getItem("token") || !getJSON(localStorage.getItem("token")))
  //   <Navigate to="/sign-in" />;
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
              <Route path="/Cars" element={<Cars />} />

              <Route path="/contact" element={<Contacts />} />

              <Route path="/dashboard" element={<Home />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
