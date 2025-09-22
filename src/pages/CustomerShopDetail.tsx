import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { act, useEffect, useState } from "react";
import "..//styles/shopDetail.scss";
import ShoppingCart from "../components/ShoppingCart";
import ShopAddForm from "../components/ShopAddForm";
import { useDispatch, useSelector } from "react-redux";
import { addMenu } from "../store/menupick/actions";
import Header from "../components/Header/Header";
import { RootState } from "../store/rootReducer";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { firstOrder } from "../store/menupick";
import io from "socket.io-client";
import * as L from "../store/login";
interface Menus {
  id: number;
  menuName: string;
  category: string;
  price: string;
  menudesc: string;
  originMfile: string;
  saveMfile: string;
}
export default function CustomerShopDetail(props: object) {
  const location = useLocation();
  const { shopId, owner_id, shopName } = location.state || {};
  const loginId = useSelector((state: RootState) => state.login.loginId);

  console.log("shopId = ", shopId);
  console.log("owner_id = ", owner_id);
  console.log("shopName = ", shopName);

  let [menuArr, setMenuArr] = useState<Menus[]>([]);
  let [categoryArr, setCategoryArr] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const menuData = useSelector((state: RootState) => state.menu.items);
  const shop_id = useSelector((state: RootState) => state.login.shopId);
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.login.loginId);
  const contactNumber = useSelector(
    (state: RootState) => state.login.phoneNumber
  );

  dispatch(L.setShopId(shopId));
  const lastMenu = menuData.length > 0 ? menuData[menuData.length - 1] : null;
  const handlerOrder = (menu: string[], price: string[]) => {
    const lastMenu: firstOrder =
      menuData.length > 0
        ? menuData[menuData.length - 1]
        : {
            orderType: "default",
            loginId: userId,
            orderTime: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
            orderNumber: uuidv4(),
            contactNumber,
            shopName,
            shopLoginId: shopId || shop_id,
            items: [],
            price: [],
          };

    const newMenu = {
      ...lastMenu,
      items: [...lastMenu.items, ...menu],
      price: [...lastMenu.price, ...price],
    };
    dispatch({ type: "menu/addMenu", payload: newMenu });
    // dispatch({ type: "menu/resetMenu", payload: newMenu });
  };
  useEffect(() => {
    const sum =
      lastMenu?.price?.reduce((acc, val) => acc + Number(val), 0) || 0;

    setTotal(sum);
    console.log(menuData);
  }, [menuData]);

  //메뉴 전체 조회 axios
  useEffect(() => {
    try {
      const menuList = async () => {
        const response = await axios.post(
          `${process.env.REACT_APP_API_SERVER}/menu-list`,
          { shopId: shopId || shop_id, owner_id: owner_id }
        );

        setMenuArr(() => [...response.data]);
      };

      menuList();
    } catch (err) {
      console.log("err", err);
    }
  }, []);

  //카테고리 set. 중복 제거.
  useEffect(() => {
    let categories = [...new Set(menuArr.map((el) => el.category))];
    setCategoryArr(categories);

    console.log("categories", categories);
  }, [menuArr]);

  return (
    <main className="m-auto max-w-7xl">
      <Header />
      <div className="shop-image-container">
        <div className="img-sample">
          <img src={process.env.PUBLIC_URL + "/assets/pizza.jpg"} />
        </div>
      </div>
      <hr />
      {/* 메뉴 탭 */}
      <ul className="flex list-none menu-tab">
        <li className="choose">전체 메뉴</li>
        {categoryArr.map((el) => {
          return <li>{el}</li>;
        })}
      </ul>

      {/* 메뉴 보드들 */}
      {categoryArr.map((comp) => {
        return (
          <div>
            <hr className="mb-3" />

            <span className="bg-gray-100 text-gray-800 text-xl font-semibold me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-gray-300">
              {comp}
            </span>

            <ul className="flex overflow-x-scroll list-none menu-board">
              {menuArr.map((mel) => {
                if (comp === mel.category) {
                  return (
                    <li
                      onClick={() => {
                        handlerOrder([mel.menuName], [mel.price]);
                      }}
                    >
                      <div className="icon-box"></div>
                      <div className="img-box">
                        <img
                          src={
                            mel.saveMfile
                              ? "https://lhm-bucket.s3.ap-northeast-2.amazonaws.com/" +
                                mel.saveMfile
                              : process.env.PUBLIC_URL + "/assets/fork-E.svg"
                          }
                          alt="aws s3에 저장된 이미지"
                        />
                      </div>
                      <p>{mel.menuName}</p>
                      <p>{mel.price}</p>
                      <div className="content-box">{mel.menudesc}</div>
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        );
      })}
      <ShoppingCart total={total} />
    </main>
  );
}
