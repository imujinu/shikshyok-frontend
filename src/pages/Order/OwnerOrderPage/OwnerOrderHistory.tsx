import "../../../styles/ownerOrderHistory.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "../../../components/Header/Header";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import * as O from "../../../store/order";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/rootReducer";
import { useNavigate } from "react-router-dom";

interface OwnerOrderHistoryProps {}
const socket = io(`${process.env.REACT_APP_SOCKET_SERVER}`);
const OwnerOrderHistory: React.FC<OwnerOrderHistoryProps> = () => {
  const loginId = useSelector((state: RootState) => state.login.loginId);
  console.log("리덕스 스토어 loginId = ", loginId);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 480);
  const [orderStatus, setOrderStatus] = useState<{ [key: string]: boolean }>();
  const [cookingCompleted, setCookingCompleted] = useState<{
    [key: string]: boolean;
  }>();
  const [orderApproved, setOrderApproved] = useState<{
    [key: string]: boolean;
  }>();

  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState<O.Order[]>([]);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 480);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const data = { loginId: loginId, socketId: socket.id };

    socket.emit(
      "connectOwner",
      data,
      orderStatus,
      cookingCompleted,
      orderApproved
    );

    socket.on("connect", () => {
      console.log("socket connect~~~");
    });
    socket.on("order", (data: O.Order[]) => {
      console.log("주문 받은 값 = ", data);

      if (Array.isArray(data)) {
        setOrderInfo((prevOrderInfo) => [...prevOrderInfo, ...data]);
      } else {
        setOrderInfo((prevOrderInfo) => [data, ...prevOrderInfo]);
      }
    });

    //새로고침시 소켓이 변경된다. 주문정보를 동기화 emit 보내면 서버는 받아서
    socket.on(
      "ownerOrderSync",
      (
        data: O.Order[],
        ownerApprovedOrders: any,
        ownerCookingStatus: any,
        ownerCookingCompleted: any
      ) => {
        console.log("주문 동기화 = ", data);
        if (Array.isArray(data)) {
          setOrderInfo(data); // 배열로 설정
        } else {
          setOrderInfo((prevOrderInfo) => [data, ...prevOrderInfo]); // 배열이 아닐 경우 추가
        }

        if (ownerApprovedOrders) {
          setOrderApproved(ownerApprovedOrders);
        }
        if (ownerCookingStatus) {
          setOrderStatus(ownerCookingStatus);
        }
        if (ownerCookingCompleted) {
          setCookingCompleted(ownerCookingCompleted);
        }
      }
    );

    socket.on("setOrderApprovedTo", (data: any) => {
      console.log("주문승인 버튼 상태 값 = ", data);
      setOrderApproved((prevState) => {
        const updatedState = { ...prevState, ...data };
        return updatedState;
      });
    });

    socket.on("setOrderStatusTo", (data: any) => {
      console.log("조리시작 버튼 상태 값 = ", data);
      setOrderStatus((prevState) => {
        const updatedState = { ...prevState, ...data };
        return updatedState;
      });
    });

    socket.on("setCookingCompletedTo", (data: any) => {
      console.log("조리완료 버튼 상태 값 = ", data);
      setCookingCompleted((prevState) => {
        const updatedState = { ...prevState, ...data };
        return updatedState;
      });
    });

    socket.on("disconnect", () => {
      console.log("socket disconnect~~~");
    });
    return () => {
      socket.off("connect");
      socket.off("order");
      socket.off("disconnect");
    };
  }, [socket]);
  const handleOrderApproval = (order: O.Order) => {
    console.log("주문 확인 버튼 눌럿다");
    console.log("주문확인버튼=", order);
    socket.emit("orderApproval", order);

    // 상태 업데이트 후 콜백 함수 사용
    setOrderApproved((prevState) => {
      const updatedStatus = { ...prevState, [order.orderNumber]: true };
      // 상태 업데이트 후 최신 상태로 socket.emit 호출
      socket.emit(
        "setOrderApproved",
        { ...prevState, [order.orderNumber]: true },
        order.shopLoginId,
        order.loginId
      );
      return updatedStatus;
    });
  };

  const handleCookingStart = (order: O.Order) => {
    console.log("조리 시작 버튼 눌럿다");
    socket.emit("cookingStart", order);

    setOrderStatus((prevState) => {
      const updatedStatus = { ...prevState, [order.orderNumber]: true };
      socket.emit(
        "setOrderStatus",
        updatedStatus,
        order.shopLoginId,
        order.loginId
      ); // 업데이트된 상태 값을 소켓 이벤트로 보냅니다.
      return updatedStatus;
    });
  };

  const handleCookingEnd = (order: O.Order) => {
    console.log("조리 완료 버튼 눌럿다");
    socket.emit("cookingEnd", order);

    setCookingCompleted((prevState) => {
      const updatedCompletedStatus = {
        ...prevState,
        [order.orderNumber]: true,
      };

      socket.emit(
        "setCookingCompleted",
        updatedCompletedStatus,
        order.shopLoginId,
        order.loginId
      ); // 업데이트된 상태 값을 소켓 이벤트로 보냅니다.
      return updatedCompletedStatus;
    });
  };

  // const allOrder = () => {
  //   navigate("/ownerOrderAllHistory");
  // };

  return (
    <>
      <Header />
      <div className="wrap-container">
        <div>
          <section className="order-history-container">
            <div className="menu-tab-container">
              <div className="menu-tab-1">
                <p>현재 주문</p>
              </div>
              <div
                className="menu-tab-2"
                onClick={() => navigate("/ownerOrderAllHistory")}
              >
                <p>전체 주문</p>
              </div>
            </div>
            <hr className="border-2 opacity-75 black" />
            <div className="receipt-card-container">
              {Array.isArray(orderInfo) && orderInfo.length > 0 ? (
                orderInfo.map((order, index) => (
                  <div key={index} className="receipt-card">
                    <ul className="receipt-card-list">
                      <li>
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="custom-icon"
                        />
                      </li>
                      <li>주문시간</li>
                      <li>
                        {`${new Date(order.orderTime).getFullYear()}년 ${
                          new Date(order.orderTime).getMonth() + 1
                        }월 ${new Date(order.orderTime).getDate()}일`}
                      </li>
                      <li>
                        {new Date(order.orderTime).toLocaleTimeString("ko-KR", {
                          hour12: false,
                        })}
                      </li>
                      <li>방문날짜</li>
                      <li>
                        {`${new Date(order.visitDate).getFullYear()}년 ${
                          new Date(order.visitDate).getMonth() + 1
                        }월 ${new Date(order.visitDate).getDate()}일`}
                      </li>
                      <li>방문시간</li>
                      <li>
                        {order.visitHour}시 {order.visitMinute}분
                      </li>
                      <li>주문고객Id</li>
                      <li>{order.loginId}</li>
                      <li>주문번호</li>
                      <li>{order.orderNumber.slice(-8)}</li>
                      <li>
                        {order.orderType} {order.guests}명
                      </li>
                      <li>연락처</li>
                      <li>{order.contactNumber}</li>
                      <li>메뉴이름</li>
                      {Array.isArray(order.items) && order.items.length > 0 ? (
                        order.items.map((item: any, index) => (
                          <li key={index}>
                            {item.menuName} {item.price}원
                          </li>
                        ))
                      ) : (
                        <li>-</li>
                      )}
                      <br />
                      <li>합계: {order.total}원</li>
                    </ul>
                    <div className="mt-2">
                      <div>
                        {!orderApproved?.[order.orderNumber] && (
                          <button
                            className={`btn btn-secondary ${
                              isSmallScreen ? "btn-sm" : ""
                            }`}
                            onClick={() => handleOrderApproval(order)}
                          >
                            주문 확인
                          </button>
                        )}
                        {orderApproved?.[order.orderNumber] &&
                          !cookingCompleted?.[order.orderNumber] && (
                            <>
                              <button
                                className={`btn btn-warning ${
                                  isSmallScreen ? "btn-sm" : ""
                                }`}
                                onClick={() => handleCookingStart(order)}
                                disabled={
                                  orderStatus?.[order.orderNumber] ?? false
                                }
                              >
                                조리 시작
                              </button>
                              <button
                                className={`btn btn-success ${
                                  isSmallScreen ? "btn-sm" : ""
                                }`}
                                onClick={() => handleCookingEnd(order)}
                                disabled={!orderStatus?.[order.orderNumber]}
                              >
                                조리 완료
                              </button>
                            </>
                          )}
                        {cookingCompleted?.[order.orderNumber] && (
                          <button
                            className={`btn btn-info ${
                              isSmallScreen ? "btn-sm" : ""
                            }`}
                          >
                            조리완료되었습니다.
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>주문 정보가 없습니다.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default OwnerOrderHistory;
