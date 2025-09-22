import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Modal } from "../../components/ui/modal";
import Footer from "../Footer";
import { useDispatch, useSelector } from "react-redux";
import { Order, OrderState } from "../../store/order";
import { RootState } from "../../store/rootReducer";
import Header from "../../components/Header/Header";
import { useLocation, useNavigate } from "react-router-dom";
import * as T from "../../store/order";
import io from "socket.io-client";

// const socket = io(`${process.env.REACT_APP_SOCKET_SERVER}`);
const Pay: React.FC = () => {
  const loginId = useSelector((state: RootState) => state.login.loginId);

  const [date, setDate] = useState<Date>(new Date());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hour, setHour] = useState<string>("10");
  const [minute, setMinute] = useState<string>("00");
  const [guests, setGuests] = useState<number>(1);
  const [orderType, setOrderType] = useState<string>("매장");

  // useEffect(() => {
  //   const data = { loginId: loginId, socketId: socket.id };
  //   socket.emit("connectCustomer", data);

  //   socket.on("connect", () => {
  //     console.log("소켓 연결 성공");
  //   });
  // }, [socket]);
  const hours: string[] = Array.from({ length: 13 }, (_, i) =>
    (i + 10).toString().padStart(2, "0")
  );
  const minutes: string[] = ["00", "10", "20", "30", "40", "50"];

  const increaseGuests = () => setGuests((prev) => prev + 1);
  const decreaseGuests = () => setGuests((prev) => (prev > 1 ? prev - 1 : 1));

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const sum = (location.state?.total ?? 0).toLocaleString();
  const total = location.state?.total || 0;

  const menuData = useSelector((state: RootState) => state.menu.items);
  const lastOrder = menuData.length > 0 ? menuData[menuData.length - 1] : null;
  const orderData = useSelector((state: RootState) => state.order.orders);

  const handleOrder = () => {
    const newOrder = {
      ...lastOrder,
      guests: guests,
      visitHour: hour,
      visitMinute: minute,
      visitDate: date,
      orderType: orderType,
    };

    dispatch({ type: "menu/addMenu", payload: newOrder });
    console.log("newOrder = ", newOrder);

    navigate("/pay2", { state: { total } });

    dispatch(T.delOrder(orderData));
    dispatch({ type: "order/addOrder", payload: newOrder });

    dispatch({ type: "menu/resetMenu" });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <Header />
      <Card className="p-6 mt-5 bg-white border rounded-lg shadow-lg w-96 border-amber-400">
        <CardContent className="flex flex-col gap-6">
          <div className="flex justify-center gap-6 text-lg font-semibold text-amber-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="매장"
                checked={orderType === "매장"}
                onChange={() => setOrderType("매장")}
                className="hidden"
              />
              <div
                className={`px-4 py-2 rounded-md border border-amber-400 ${
                  orderType === "매장"
                    ? "bg-amber-400 text-white"
                    : "bg-white text-amber-600"
                }`}
              >
                매장
              </div>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                value="포장"
                checked={orderType === "포장"}
                onChange={() => setOrderType("포장")}
                className="hidden"
              />
              <div
                className={`px-4 py-2 rounded-md border border-amber-400 ${
                  orderType === "포장"
                    ? "bg-amber-400 text-white"
                    : "bg-white text-amber-600"
                }`}
              >
                포장
              </div>
            </label>
          </div>

          <Button
            className="text-white bg-amber-400 hover:bg-amber-500"
            onClick={() => setIsOpen(true)}
          >
            날짜 선택
          </Button>
          <Modal open={isOpen} onClose={() => setIsOpen(false)}>
            <DatePicker
              selected={date}
              onChange={(newDate: Date | null) => {
                if (newDate) setDate(newDate);
              }}
              locale="ko"
              minDate={new Date()}
              maxDate={new Date(new Date().setDate(new Date().getDate() + 30))}
              inline
            />
            <Button
              className="mt-4 text-white bg-amber-400 hover:bg-amber-500"
              onClick={() => setIsOpen(false)}
            >
              확인
            </Button>
          </Modal>
          <div className="text-lg font-bold text-center text-amber-600">
            선택한 날짜: {date.toLocaleDateString("ko-KR")}
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-lg font-bold text-amber-600">방문 시간</div>
            <div className="flex gap-2">
              <select
                className="p-2 text-lg bg-white border rounded-md border-amber-400 text-amber-600"
                value={hour}
                onChange={(e) => setHour(e.target.value)}
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}시
                  </option>
                ))}
              </select>
              <select
                className="p-2 text-lg bg-white border rounded-md border-amber-400 text-amber-600"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
              >
                {minutes.map((m) => (
                  <option key={m} value={m}>
                    {m}분
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              className="text-white bg-amber-400 hover:bg-amber-500"
              onClick={decreaseGuests}
            >
              -
            </Button>
            <span className="text-lg font-bold text-amber-600">{guests}명</span>
            <Button
              className="text-lg text-white bg-amber-400 hover:bg-amber-500"
              onClick={increaseGuests}
            >
              +
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 mt-6 bg-white border rounded-lg shadow-lg w-96 border-amber-400 text-amber-600">
        <div className="text-lg font-bold">장바구니</div>
        <hr className="my-2" />
        {lastOrder?.items && lastOrder?.price ? (
          lastOrder.items.map((item: string, idx: number) => (
            <div key={idx} className="flex justify-between text-lg font-bold">
              <span>{item}</span>
              <span>{lastOrder.price[idx]}원</span>
            </div>
          ))
        ) : (
          <div>주문이 없습니다.</div> // 조건에 맞지 않는 경우를 처리
        )}
        <hr className="my-2" />
        <div className="flex justify-center mt-4">
          <Button
            onClick={handleOrder}
            className="text-white bg-amber-400 hover:bg-amber-500"
          >
            결제하기 : {sum} 원
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pay;
