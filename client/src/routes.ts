import AllPosts from "./pages/AllPosts/AllPosts";
import { IRoute } from "./interfaces/route.interface";
import UserPosts from "./pages/UserPosts/UserPosts";
import Friends from "./pages/Friends/Friends";
import EditProfile from "./pages/EditProfile/EditProfile";
import Authorization from "./pages/Authorization/Authorization";
import Messages from "./pages/Messages/Messages";
import AllNotifications from "./pages/AllNotifications/AllNotifications";
import Settings from "./pages/Settings/Settings";

const routes: IRoute[] = [
  { path: "/posts", component: AllPosts },
  {
    path: `/:id`,
    component: UserPosts,
  },
  { path: "/friends/:id", component: Friends },
  { path: "/edit/:id", component: EditProfile },
  { path: "/auth", component: Authorization },
  { path: "/messages", component: Messages },
  { path: "/notifications/:id", component: AllNotifications },
  { path: "/settings/:id", component: Settings },
];

export default routes;
