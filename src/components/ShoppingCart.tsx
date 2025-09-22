import { useEffect, useRef, useState } from "react";
import "../styles/shoppingCart.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "../store/rootReducer";
import Header from "./Header/Header";
import { useNavigate } from "react-router-dom";

interface MenuWithPrice {
  name: string;
  price: number;
}

type Props = {
  total: number;
};

export default function ShoppingCart({ total }: Props) {
  const btnRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);

  const dispatch = useDispatch();
  const menuData = useSelector((state: RootState) => state.menu.items);
  const menuWithPrice =
    menuData.length > 0 ? menuData[menuData.length - 1] : null;

  const handleRemoveMenu = (orderIndex: number, itemIndex: number) => {
    console.log("🛑 삭제 요청됨:", { orderIndex, itemIndex });

    dispatch({
      type: "menu/delMenu",
      payload: { orderIndex, itemIndex },
    });
  };

  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate("/payment", { state: { total } });
    console.log(menuWithPrice);
  };

  // 화면 크기에 따라 isMobile 상태 업데이트
  useEffect(() => {
    const checkIfMobile = () => {
      if (window.innerWidth <= 480) {
        setIsMobile(true); // 모바일 화면이면 true
      } else {
        setIsMobile(false); // 데스크탑 화면이면 false
      }
    };

    // 초기화 시 확인
    checkIfMobile();

    // 화면 크기 변경 시마다 호출
    window.addEventListener("resize", checkIfMobile);
    return () => {
      window.removeEventListener("resize", checkIfMobile); // 리소스 해제
    };
  }, []);

  const cartFold = () => {
    if (!isMobile) {
      //데스크톱
      if (cartRef.current) {
        const cartStyle = getComputedStyle(cartRef.current);
        const cartRight = cartStyle.right;

        if (cartRight === "0px") {
          cartRef.current.style.right = "-400px";
        } else if (cartRight === "-400px") {
          cartRef.current.style.right = "0px";
        }
      }
    } else {
      //모바일
      if (cartRef.current) {
        const cartStyle = getComputedStyle(cartRef.current);
        const cartBottom = cartStyle.bottom;

        if (cartBottom === "-600px") {
          cartRef.current.style.bottom = "0px";
        } else if (cartBottom === "0px") {
          cartRef.current.style.bottom = "-600px";
        }
      }
    }
  };

  console.log("이게 menuWIthPrice: ", menuWithPrice);

  return (
    <div className="cart-container" ref={cartRef}>
      <div className="fold-btn" ref={btnRef} onClick={cartFold}>
        <div className="menu-length">
          {menuWithPrice &&
            (menuWithPrice.items.length > 0
              ? menuWithPrice.items.length
              : 0)}{" "}
        </div>
        <FontAwesomeIcon icon={faCartShopping} className="cart" />
      </div>
      <div className="pay-info">
        <ul>
          {/* menuWithPrice가 null이 아니고, items와 price가 존재하는지 확인 */}
          {menuWithPrice?.items && menuWithPrice?.price ? (
            menuWithPrice.items.map((item: string, idx: number) => (
              <li
                key={idx}
                onClick={() => handleRemoveMenu(menuData.length - 1, idx)}
              >
                {item} : {menuWithPrice.price[idx]} 원
                <FontAwesomeIcon icon={faXmark} className="delete-btn" />
              </li>
            ))
          ) : (
            <li>주문한 메뉴가 없습니다.</li>
          )}
        </ul>

        <hr />
        <button type="submit" onClick={handleSubmit}>
          결제하기{total}원
        </button>
      </div>
    </div>
  );
}
