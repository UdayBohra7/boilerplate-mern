import { lazyImport } from "@/lib/lazyImport";
import { ProductManagement } from "./ProductManagement/ProductManagement";
import { AddProduct } from "./ProductManagement/AddProduct";
import { EditProduct } from "./ProductManagement/EditProduct";
import { ViewProduct } from "./ProductManagement/ViewProduct";
import { SubscriptionPlans } from "./Subscriptions/SubscriptionPlans";
import AnalyticsReporting from "./AnalyticsReporting/AnalyticsReporting";
import PushNotifications from "./PushNotifications/PushNotifications";
import Community from "./Community/Community";
import { AddPost } from "./Community/AddPost";
import { EditPost } from "./Community/EditPost";
import { Meals } from "./MealManagement/Meals";
import { AddMeal } from "./MealManagement/AddMeal";
import { EditMeal } from "./MealManagement/EditMeal";
// import { AddProduct } from "./ProductManagement/AddProduct";

const { Dashboard } = lazyImport(() => import("./Dashboard"), "Dashboard");
const { Users } = lazyImport(() => import("./Users"), "Users");
const { UserAdd } = lazyImport(() => import("./UserAdd"), "UserAdd");
const { UserEdit } = lazyImport(() => import("./UserEdit"), "UserEdit");
const { UserView } = lazyImport(() => import("./UserView"), "UserView");
const { Settings } = lazyImport(() => import("./Settings"), "Settings");
const { Categories } = lazyImport(() => import("./CategoryManagement/Categories"), "Categories");
const { CategoryAdd } = lazyImport(() => import("./CategoryManagement/CategoryAdd"), "CategoryAdd");
const { CategoryEdit } = lazyImport(() => import("./CategoryManagement/CategoryEdit"), "CategoryEdit");
const { CategoryView } = lazyImport(() => import("./CategoryManagement/CategoryView"), "CategoryView");
const { HelpAndSupportPage } = lazyImport(() => import("./HelpAndSupport/HelpAndSupport"), "HelpAndSupportPage");
const { ContentList } = lazyImport(() => import("./Content/ContentList"), "ContentList");
const { AddContent } = lazyImport(() => import("./Content/AddContent"), "AddContent");
const { EditContent } = lazyImport(() => import("./Content/EditContent"), "EditContent");
const { ViewContent } = lazyImport(() => import("./Content/ViewContent"), "ViewContent");
const { AppSettings } = lazyImport(() => import("./AppSettings"), "AppSettings");


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
    path: "categories",
    element: <Categories />,
  },
  {
    path: "categories/add",
    element: <CategoryAdd />,
  },
  {
    path: "categories/edit/:id",
    element: <CategoryEdit />,
  },
  {
    path: "categories/view/:id",
    element: <CategoryView />,
  },
  {
    path: "products",
    element: <ProductManagement />,
  },
  {
    path: "products/add",
    element: <AddProduct />,
  },
  {
    path: "products/edit/:productId",
    element: <EditProduct />,
  },
  {
    path: "products/view/:productId",
    element: <ViewProduct />,
  },
  {
    path: "subscription-plans",
    element: <SubscriptionPlans />,
  },
  {
    path: "reports",
    element: <AnalyticsReporting />,
  },
  {
    path: "product-details",
    element: <ViewProduct />,
  },
  {
    path: "push-notifications",
    element: <PushNotifications />,
  },
  {
    path: "community",
    element: <Community />,
  },
  {
    path: "community/add",
    element: <AddPost />,
  },
  {
    path: "community/edit/:postId",
    element: <EditPost />,
  },
  {
    path: "meals",
    element: <Meals />,
  },
  {
    path: "meals/add",
    element: <AddMeal />,
  },
  {
    path: "meals/edit/:mealId",
    element: <EditMeal />,
  },
  {
    path: "add-product",
    element: <AddProduct />,
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
