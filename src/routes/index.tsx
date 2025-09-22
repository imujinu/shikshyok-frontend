import { useLocation, useRoutes } from "react-router-dom";
import Home from "../pages/Home/Home";
import OwnerOrderAllHistory from "../pages/Order/OwnerOrderPage/OwnerOrderAllHistory";
import OwnerOrderHistory from "../pages/Order/OwnerOrderPage/OwnerOrderHistory";

import CustomerOrderAllHistory from "../pages/Order/CustomerOrderPage/CustomerOrderAllhistory";

import Menus from "../pages/Menus";
import OwnerMain from "../pages/OwnerMain";
import OwnerReview from "../pages/OwnerReview";

import CustomerShopDetail from "../pages/CustomerShopDetail";
import ShoppingCart from "../components/ShoppingCart";
import CusReview from "../pages/CusReview";
import EditProfilePage from "../pages/SignUp/EditProfilePage";
import LoginPage from "../pages/SignUp/LoginPage";
import SignUpPage from "../pages/SignUp/SignUpPage";
import MyPage from "../pages/SignUp/MyPage";
import UserMain from "../pages/UserMain";

import Payment from "../pages/Order/Payment/Payment";
import Payment2 from "../pages/Order/Payment/Payment2";

import Income from "../pages/Income/Income";
import DeleteMember from "../pages/SignUp/DeleteMember";

import Pay from "../pages/Pay/Pay";

import CustomerOrderHistory from "../pages/Order/CustomerOrderPage/CustomerOrderHistory";
import { useSelector } from "react-redux";
import { RootState } from "../store/rootReducer";
const AppRoutes = () => {
  const userType = useSelector((state: RootState) => state.login.type);

  let routes = useRoutes([
    { path: "/Home", element: <Home /> },

    { path: "/order1", element: <OwnerOrderHistory /> },

    { path: "/menu", element: <Menus /> },

    { path: "/ownerOrderHistory", element: <OwnerOrderHistory /> },
    { path: "/ownerOrderAllHistory", element: <OwnerOrderAllHistory /> },
    { path: "/customerOrderHistory", element: <CustomerOrderHistory /> },
    { path: "/customerOrderAllHistory", element: <CustomerOrderAllHistory /> },
    { path: "/owner-review", element: <OwnerReview /> },
    { path: "/income", element: <Income /> },

    { path: "/shopdetail", element: <CustomerShopDetail /> },

    { path: "/cart", element: <ShoppingCart total={0} /> },

    { path: "/review", element: <CusReview /> },

    { path: "/edit-profile", element: <EditProfilePage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/mypage", element: <MyPage /> },

    {
      path: "/",
      element:
        userType === "individual" || userType === null ? (
          <UserMain />
        ) : (
          <OwnerMain />
        ),
    },
    { path: "/", element: <OwnerMain /> },

    { path: "/delete/:nickname", element: <DeleteMember /> },

    { path: "/Payment", element: <Pay /> },

    { path: "/pay", element: <Payment /> },
    { path: "/pay2", element: <Payment2 /> },
    { path: "/Payment", element: <Pay /> },
  ]);
  return routes;
};
export default AppRoutes;
