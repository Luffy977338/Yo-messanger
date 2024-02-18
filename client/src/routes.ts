import AllPosts from "./pages/AllPosts/AllPosts";
import { IRoute } from "./interfaces/route.interface";
import UserPosts from "./pages/UserPosts/UserPosts";
import Friends from "./pages/Friends/Friends";
import EditProfile from "./pages/EditProfile/EditProfile";
import Authorization from "./pages/Authorization/Authorization";
import Messages from "./pages/Messages/Messages";
import AllNotifications from "./pages/AllNotifications/AllNotifications";
import UserSettings from "./pages/UserSettings/UserSettings";
import NotFound from "./pages/NotFound/NotFound";

const routes: IRoute[] = [
  {
    path: `/:id`,
    component: UserPosts,
  },
  { path: "/posts", component: AllPosts },
  { path: "/friends/:id", component: Friends },
  { path: "/subscriptions/:id", component: Friends },
  { path: "/subscribers/:id", component: Friends },
  { path: "/edit", component: EditProfile },
  { path: "/auth", component: Authorization },
  { path: "/messages", component: Messages },
  { path: "/notifications", component: AllNotifications },
  { path: "/settings", component: UserSettings },
  { path: "*", component: NotFound },
];

export default routes;
