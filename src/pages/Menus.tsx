import "../styles/menu.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faGear } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import MenuAddForm from "../components/MenuAddForm";
import axios from "axios";
import MenuChgForm from "../components/MenuChgForm";
import Header from "../components/Header/Header";
import { useSelector } from "react-redux";
import { RootState } from "../store/rootReducer";
import { useLocation } from "react-router-dom";

interface Menus {
  id: number;
  shop_menu_id: number;
  menuName: string;
  category: string;
  price: string;
  menudesc: string;
  originMfile: string;
  saveMfile: string;
}

export default function Menus() {
  let [isShow, setIsShow] = useState(false);
  let [isChgShow, setIsChgShow] = useState(false);
  let [menuArr, setMenuArr] = useState<Menus[]>([]);
  let [categoryArr, setCategoryArr] = useState<string[]>([]);
  let [selectMenu, setSelectMenu] = useState<Menus | null>(null);
  let [imgS3route, setImgS3route] = useState<string>(
    "https://lhm-bucket.s3.ap-northeast-2.amazonaws.com/"
  );
  const [isUpdated, setIsUpdated] = useState(false);
  const owner_id = useSelector((state: RootState) => state.login.id);
  const shopId = useSelector((state: RootState) => state.login.shopId);

  //메뉴 전체 조회 axios
  useEffect(() => {
    try {
      //점주 하나, 가게 하나의 메뉴를 가져와야 한다.
      const menuList = async () => {
        const response = await axios.post(
          `${process.env.REACT_APP_API_SERVER}/menu-list`,
          {
            owner_id: owner_id,
            shopId: shopId,
          }
        );

        setMenuArr(() => [...response.data]);
      };
      if (!isUpdated) {
        menuList();
      }
    } catch (err) {
      console.log("err", err);
    }
  }, [isUpdated]);

  console.log(menuArr);

  //카테고리 set. 중복 제거.
  useEffect(() => {
    let categories = [...new Set(menuArr.map((el) => el.category))];
    setCategoryArr(categories);
  }, [menuArr]);

  return (
    <main className="m-auto max-w-7xl">
      <Header />
      <h3 className="m-5 text-3xl font-bold">메뉴 관리</h3>
      {/* 메뉴 탭 */}
      <ul className="flex list-none menu-tab">
        <li className="choose">전체 메뉴</li>
        {categoryArr.map((el, index) => {
          return <li key={index}>{el}</li>;
        })}
      </ul>

      {/* 메뉴 보드들 */}
      {categoryArr.length > 0 ? (
        categoryArr.map((comp, index) => {
          return (
            <div key={index}>
              <hr className="mb-3" />

              <span className="bg-gray-100 text-gray-800 text-xl font-semibold me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-gray-300">
                {comp}
              </span>

              <ul className="flex overflow-x-scroll list-none menu-board">
                {menuArr.map((mel) => {
                  if (comp === mel.category) {
                    return (
                      <li key={mel.id}>
                        <div className="icon-box">
                          <FontAwesomeIcon
                            icon={faGear}
                            className="m-2 setting-icon"
                            onClick={() => {
                              setIsChgShow(true);
                              setSelectMenu({
                                id: mel.id,
                                shop_menu_id: mel.shop_menu_id,
                                menuName: mel.menuName,
                                price: mel.price,
                                menudesc: mel.menudesc,
                                category: mel.category,
                                originMfile: mel.originMfile,
                                saveMfile: mel.saveMfile,
                              });
                            }}
                          />
                        </div>
                        <div className="img-box">
                          <img
                            src={
                              mel.saveMfile
                                ? `https://lhm-bucket.s3.ap-northeast-2.amazonaws.com/${mel.saveMfile}`
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

                <li onClick={() => setIsShow(true)}>
                  <FontAwesomeIcon icon={faPlus} className="add-icon" />
                </li>
              </ul>
            </div>
          );
        })
      ) : (
        <div>
          <hr />
          <ul className="flex overflow-x-scroll list-none menu-board">
            <li onClick={() => setIsShow(true)}>
              <FontAwesomeIcon icon={faPlus} className="add-icon" />
            </li>
          </ul>
          <hr />
        </div>
      )}
      {/* categoryArr 끝 */}

      {isShow && (
        <MenuAddForm
          setIsShow={setIsShow}
          setImgS3route={setImgS3route}
          setIsUpdated={setIsUpdated}
        />
      )}
      {isChgShow && selectMenu && (
        <MenuChgForm
          selectMenu={selectMenu}
          setIsChgShow={setIsChgShow}
          setImgS3route={setImgS3route}
          setIsUpdated={setIsUpdated}
        />
      )}
    </main>
  );
}
