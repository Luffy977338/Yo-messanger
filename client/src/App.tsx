import React from "react";
import { observer } from "mobx-react-lite";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import routes from "./routes";
import { IRoute } from "./interfaces/route.interface";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { useQuery } from "@tanstack/react-query";
import AuthService from "./service/auth-service";
import Loader from "./components/UI/Loader/Loader";
import { Toaster } from "react-hot-toast";

const App = () => {
   const path = useNavigate();
   const location = useLocation();

   React.useEffect(() => {
      if (!!localStorage.getItem("token")) {
         return path("/posts");
      }
      return path("/auth");
   }, []);

   React.useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   }, [location]);

   const { isFetching } = useQuery(["checkAuth"], AuthService.checkAuth, {
      retry: 1,
   });

   if (isFetching) {
      return <Loader />;
   }

   return (
      <div>
         <Toaster
            position='bottom-left'
            reverseOrder={false}
            toastOptions={{
               style: {
                  background: "#444444",
                  color: "#eeeeee",
               },
            }}
         />
         {location.pathname === "/auth" ? "" : <Header />}
         <main>
            {location.pathname === "/auth" ? "" : <Sidebar />}
            <article>
               <Routes>
                  {routes.map((route: IRoute) => (
                     <Route
                        key={route.path}
                        path={route.path}
                        element={<route.component />}
                     />
                  ))}
               </Routes>
            </article>
         </main>
      </div>
   );
};

export default observer(App);
