import { useEffect, useRef, useState } from "react";
import "../styles/ownerMain.scss";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import { RootState } from "../store/rootReducer";
import io from "socket.io-client";

//가게 정보 interface
interface shopIn {
  id: number; // 가게아이디
  shopName: string;
}

export default function OwnerMain() {
  // 로그인 확인
  const id = useSelector((state: RootState) => state.login.id);
  const loginId = useSelector((state: RootState) => state.login.loginId);
  const ownerShopId = useSelector((state: RootState) => state.login.shopId);
  const owneRShopLoginId = useSelector(
    (state: RootState) => state.login.shopOwnerLoginId
  );
  console.log("가게 기본키 = ", ownerShopId);
  console.log("가게 주인 로그인 아이디 = ", owneRShopLoginId);

  const [shopId, setShopId] = useState<number | null>(null); //선택된 shop id
  const [shops, setShops] = useState<shopIn[]>([]);
  const navigate = useNavigate();

  console.log("shops: ", shops);

  async function getData() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/owner`,
        {
          params: {
            userId: id, // redux state로
          },
        }
      );
      console.log("응답 샵id", response.data.shops); //객체 배열[{id: 1, name: 'starbucks'}...]
      const shopsList = response.data.shops.map((shop: shopIn) => shop);
      console.log("shopsList: ", shopsList[0]);

      setShops(shopsList);

      // 불러온 데이터에서 첫 번째 가게의 ID를 shopId로 설정
      if (shopsList.length > 0) {
        //shopsList.legnth  수정
        setShopId(shopsList[0].id);
      }
    } catch (error) {
      console.error("Error fetching shop data:", error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  // 셀렉트박스 확인용
  useEffect(() => {
    console.log("Selected shopId:", shopId);
    console.log("useSelector shop_id:", ownerShopId);
  }, [shopId]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setShopId(parseInt(e.target.value, 10)); //문자열 value값을 10진수 변환
    console.log("handleSelect-setShopId 결과: ", shopId);
  };

  const handleClick = (path: string) => {
    // navigate(path, { state: { shopId } });
    const selectedShopId = shopId !== null ? shopId : shops[0]?.id; // shopId가 없을 때 첫 번째 가게의 ID를 기본 값으로 사용

    navigate(path, {
      state: { shopId: selectedShopId, shopName: shops[0]?.shopName },
    });
  };

  return (
    <>
      <Header />
      <main className="box-content  max-w-[1200px] my-20 mx-auto">
        <div className="flex flex-col items-center w-full con">
          {/* 전체 컨테이너 */}

          <div className="relative w-4/5 border-b border-gray-300 titleBorder">
            <div className="relative w-56 mb-2 selctBox left-10 ">
              <select
                name="shop"
                className="w-48 text-xl font-bold bg-right bg-no-repeat bg-contain appearance-none cursor-pointer"
                onChange={handleSelect}
              >
                {shops.map((shop, index) => {
                  return (
                    <option value={shop.id} key={index}>
                      {shop.shopName}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="flex justify-center w-4/5 border rounded shadow folderBox my-7">
            <div className="box-content grid w-11/12 grid-cols-2 folder">
              <div
                onClick={() => handleClick("/ownerOrderHistory")}
                className="bg-contain bg-no-repeat w-[19rem] h-72 
                  relative my-0 mx-auto "
              >
                <p className="relative text-lg text-white top-12 left-6">
                  주문내역
                </p>
              </div>

              <div
                onClick={() => handleClick("/menu")}
                className="bg-contain bg-no-repeat w-[19rem] h-72 
              relative my-0 mx-auto "
              >
                <p className="relative text-lg text-white top-12 left-6">
                  메뉴관리
                </p>
              </div>

              <div
                onClick={() => handleClick("/income")}
                className="bg-contain bg-no-repeat w-[19rem] h-72 
              relative my-0 mx-auto "
              >
                <p className="relative text-lg text-white top-12 left-6">
                  매출관리
                </p>
              </div>
              <div
                onClick={() => handleClick("/owner-review")}
                className="bg-contain bg-no-repeat w-[19rem] h-72 
              relative my-0 mx-auto "
              >
                <p className="relative text-lg text-white top-12 left-6">
                  리뷰관리
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
