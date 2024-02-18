import React from "react";
import { observer } from "mobx-react-lite";
import { Route, Routes, useLocation } from "react-router-dom";
import routes from "./routes";
import { IRoute } from "./interfaces/route.interface";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import { useQuery } from "@tanstack/react-query";
import AuthService from "./service/auth.service";
import { Toaster } from "react-hot-toast";
import { io } from "socket.io-client";
import socket from "./store/socket";
import user from "./store/user";
import CirclesLoader from "./components/UI/CirclesLoader/CirclesLoader";
import { useChangeLocation } from "./hooks/useChangeLocation";

const App = () => {
  const invalidLocations = ["/auth"];
  const location = useLocation();
  React.useEffect(() => {
    const newSocket = io("http://localhost:5000");
    socket.setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user.user._id]);

  useChangeLocation(() => window.scrollTo({ top: 0 }));

  React.useEffect(() => {
    socket.socket.emit("setUserId", user.user._id);
  }, [user.user._id]);

  const { isFetching } = useQuery(["checkAuth"], AuthService.checkAuth, {
    retry: 1,
  });

  if (isFetching) {
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <CirclesLoader />
      </div>
    );
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
      {invalidLocations.includes(location.pathname) ? "" : <Header />}
      <main>
        {invalidLocations.includes(location.pathname) ? "" : <Sidebar />}
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
