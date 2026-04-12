import { lazyImport } from "@/lib/lazyImport";

const { Dashboard } = lazyImport(() => import("./Dashboard"), "Dashboard");
const { Users } = lazyImport(() => import("./Users"), "Users");
const { UserAdd } = lazyImport(() => import("./UserAdd"), "UserAdd");
const { UserEdit } = lazyImport(() => import("./UserEdit"), "UserEdit");
const { UserView } = lazyImport(() => import("./UserView"), "UserView");
const { Settings } = lazyImport(() => import("./Settings"), "Settings");
const { AppSettings } = lazyImport(() => import("./AppSettings"), "AppSettings");
const { HelpAndSupportPage } = lazyImport(() => import("./HelpAndSupport/HelpAndSupport"), "HelpAndSupportPage");
const { ContentList } = lazyImport(() => import("./Content/ContentList"), "ContentList");
const { AddContent } = lazyImport(() => import("./Content/AddContent"), "AddContent");
const { EditContent } = lazyImport(() => import("./Content/EditContent"), "EditContent");
const { ViewContent } = lazyImport(() => import("./Content/ViewContent"), "ViewContent");


export const AdminRoutes = [
  {
    path: "",
    element: <Dashboard />,
  },
  {
    path: "users",
    element: <Users />,
  },
  {
    path: "users/add",
    element: <UserAdd />,
  },
  {
    path: "users/edit/:userId",
    element: <UserEdit />,
  },
  {
    path: "users/view/:userId",
    element: <UserView />,
  },
  {
    path: "settings",
    element: <Settings />,
  },
  {
    path: "app-settings",
    element: <AppSettings />,
  },
  {
    path: "help-support",
    element: <HelpAndSupportPage />,
  },
  {
    path: "content",
    element: <ContentList />,
  },
  {
    path: "content/add",
    element: <AddContent />,
  },
  {
    path: "content/edit/:id",
    element: <EditContent />,
  },
  {
    path: "content/view/:id",
    element: <ViewContent />,
  },
  {
    path: "*",
    element: <p>Not found</p>,
  },
];
