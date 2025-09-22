import Header from "../../../components/Header/Header";

import "../../../styles/payment.scss";
import { useState } from "react";

interface PaymentProps {}

const Payment: React.FC<PaymentProps> = () => {
  return (
    <>
      <Header />

      <div>
        <h1>Payment</h1>

        <div className="wrap-container-payment">
          <div className="wrap-content-payment-1">
            <div className="wrap-content-payment-1-1">
              <input
                type="checkbox"
                defaultChecked
                className="checkbox checkbox-secondary checkbox-lg"
              />
              매장
            </div>
            <div className="wrap-content-payment-1-1">
              <input
                type="checkbox"
                defaultChecked
                className="checkbox checkbox-secondary checkbox-lg"
              />
              포장
            </div>
          </div>
          <div className="wrap-content-payment-2">
            <ul>
              <li>주문정보</li>
              <li>방문시간:</li>
              <li>방문고객수:</li>
            </ul>
          </div>
          <div className="wrap-content-payment-3">
            <div className="wrap-content-payment-3-1">
              <ul>
                <li>장바구니목록</li>
                <li>맛잇는 치킨 x1</li>
                <li>맛잇는 치킨 x1</li>
                <li>맛잇는 치킨 x1</li>
              </ul>
              <div>
                <button className="btn btn-warning btn-lg">
                  합계: 300만원{" "}
                </button>
              </div>
            </div>
          </div>
          <div className="wrap-content-payment-4">
            <div className="wrap-content-payment-4-1">
              <div>
                <button className="btn btn-warning btn-lg">
                  결제하기: 300만원{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
