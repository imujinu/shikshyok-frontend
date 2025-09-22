import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/Header/Header";
import { AppState } from "../../../store";
import io from "socket.io-client";
import * as O from "../../../store/order";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import * as C from "../../../store/clock";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RootState } from "../../../store/rootReducer";
import "../../../styles/customerOrderHistory.scss";

import { useLocation, useNavigate } from "react-router-dom";

interface CustomerOrderHistoryProps {}

const socket = io(`${process.env.REACT_APP_SOCKET_SERVER}`);

const shopLoginId = "owner1";
const shopName = "햄버거집";

const CustomerOrderHistory: React.FC<CustomerOrderHistoryProps> = () => {
  const loginId = useSelector((state: RootState) => state.login.loginId);
  console.log("로그인아이디 = ", loginId);

  // const location = useLocation();
  // const { order } = location.state || {};
  // const [sent, setSent] = useState(false); // 이미 emit을 보냈는지 확인하는 상태
  // console.log("order = ", order);
  // console.log("sent = ", sent);

  // if (!sent) {
  //   socket.emit("order", order);
  //   setSent(true);
  // }
  const [orderInfo, setOrderInfo] = useState<O.Order[]>([]);

  const clock = new Date(
    useSelector<AppState, C.State>((state) => state.clock)
  );
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 480);
  const [orderStatus, setOrderStatus] = useState<{ [key: string]: boolean }>();
  const [cookingCompleted, setCookingCompleted] = useState<{
    [key: string]: boolean;
  }>();
  const [orderApproved, setOrderApproved] = useState<{
    [key: string]: boolean;
  }>();
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
      "connectCustomer",
      data,
      orderStatus,
      cookingCompleted,
      orderApproved
    );
    socket.on("connect", () => {
      console.log("socket connect~~~");
      console.log("socket = ", socket);
    });

    socket.on("order", (data: O.Order) => {
      console.log("받은 값 = ", data);
      if (Array.isArray(data)) {
        setOrderInfo((prevOrderInfo) => [...prevOrderInfo, ...data]);
      } else {
        setOrderInfo((prevOrderInfo) => [data, ...prevOrderInfo]);
      }
    });

    socket.on("orderApproval", (data: O.Order) => {
      console.log("주문 승인 알림 받음 = ", data);
      socket.emit("orderCustomerSync", data);
      if (Array.isArray(data)) {
        setOrderInfo(data);
      }
    });

    //새로고침시 소켓이 변경된다. 주문정보를 동기화
    socket.on(
      "customerOrderSync",
      (
        data: O.Order[],
        customerApprovedOrders: any,
        customerCookingStatus: any,
        customerCookingCompleted: any
      ) => {
        console.log("고객 주문 동기화 = ", data);
        if (Array.isArray(data)) {
          setOrderInfo(data); // 배열로 설정
        } else {
          setOrderInfo((prevOrderInfo) => [data, ...prevOrderInfo]); // 배열이 아닐 경우 추가
        }

        if (customerApprovedOrders) {
          setOrderApproved(customerApprovedOrders);
        }
        if (customerCookingStatus) {
          setOrderStatus(customerCookingStatus);
        }
        if (customerCookingCompleted) {
          setCookingCompleted(customerCookingCompleted);
        }
      }
    );

    socket.on("cookingStart", (data: O.Order) => {
      console.log("요리 시작 알림 받음 = ", data);
    });

    socket.on("cookingEnd", (data: O.Order) => {
      console.log("조리 완료 알림 받음 = ", data);
    });

    socket.on("setOrderApprovedTo", (data: any) => {
      console.log("고객 페이지 = 주문승인 버튼 상태 값 = ", data);
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
  };

  const handleCookingStart = (order: O.Order) => {
    console.log("조리 시작 버튼 눌럿다");
  };

  const handleCookingEnd = (order: O.Order) => {
    console.log("조리 완료 버튼 눌럿다");
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(C.setClock(new Date().toISOString()));
  }, [dispatch]);

  function order2() {
    /**   loginId: string;
  orderTime: string;
  orderNumber: string;
  orderType: string;
  guests: number; // 방문 인원
  visitDate: string; //방문 날짜
  visitHour: string; // 방문 시간
  visitMinute: string; //방문 분
  contactNumber: string;
  shopName: string;
  shopLoginId: string;
  total: string;
  items: string[];

  */
    const order2 = {
      loginId: loginId,
      orderTime: clock,
      orderNumber: uuidv4(),
      orderType: "매장",
      guests: "4",
      visitDate: Date(),
      visitHour: "16",
      visitMinute: "30",
      contactNumber: "010-1234-1234",
      shopName: shopName,
      shopLoginId: shopLoginId,
      total: "85000",
      items: [
        "매우매우맛있는후라x1",
        "매우매우맛있는양념x1",
        "매우매우맛있는순살x1",
      ],
    };
    socket.emit("order", order2);
  }

  const navigate = useNavigate();
  const allOrder = () => {
    navigate("/customerOrderAllHistory");
  };

  return (
    <>
      <Header />

      <div className="wrap-container">
        <div>
          <div>
            {/* <button
              onClick={() => {
                order2();
              }}
              className="btn btn-primary btn-lg"
            >
              주문하기
            </button> */}
          </div>
          <section className="order-history-container">
            <div className="menu-tab-container">
              <div className="menu-tab-1">
                <p>현재 주문</p>
              </div>
              <div className="menu-tab-2" onClick={allOrder}>
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
                      <li>주문고객Id</li>
                      <li>{order.loginId}</li>
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

                      <li>주문번호</li>
                      <li>{order.orderNumber.slice(-8)}</li>
                      <li>가게이름 {order.shopName}</li>
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
                            className={`btn btn-warning ${
                              isSmallScreen ? "btn-sm" : ""
                            }`}
                            onClick={() => handleOrderApproval(order)}
                          >
                            주문요청 함
                          </button>
                        )}
                        {orderApproved?.[order.orderNumber] && (
                          <>
                            {!orderStatus?.[order.orderNumber] && (
                              <button
                                className={`btn btn-accent ${
                                  isSmallScreen ? "btn-sm" : ""
                                }`}
                                onClick={() => handleCookingStart(order)}
                              >
                                주문확인 됨
                              </button>
                            )}
                            {orderStatus?.[order.orderNumber] &&
                              !cookingCompleted?.[order.orderNumber] && (
                                <button
                                  className={`btn btn-info ${
                                    isSmallScreen ? "btn-sm" : ""
                                  }`}
                                  onClick={() => handleCookingEnd(order)}
                                >
                                  조리시작 됨
                                </button>
                              )}
                          </>
                        )}
                        {cookingCompleted?.[order.orderNumber] && (
                          <button
                            className={`btn btn-secondary ${
                              isSmallScreen ? "btn-sm" : ""
                            }`}
                          >
                            조리완료 됨
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

export default CustomerOrderHistory;
