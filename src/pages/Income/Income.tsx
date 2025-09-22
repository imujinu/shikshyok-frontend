import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../types/Income";
import Header from "../../components/Header/Header";
import axios from "axios";

import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ko } from "date-fns/locale";
import { useLocation } from "react-router-dom";
import Footer from "../Footer";
export default function Income() {
  const location = useLocation();
  const { shopId, shopName } = location.state || {};
  console.log("shopId 인컴 = ", shopId);
  console.log("shopName 인컴 = ", shopName);

  type MenuItem = {
    name: string;
    value: number;
    color: string;
    menuName: string;
    price: number;
  };
  type DataState = {
    [key: string]: any;
    income: number[];
    visitors: number[];
  };
  type UserData = {
    isReVisit: boolean;
    number: number;
  };

  type VisitData = {
    // 🔥 `VisitData` 타입 추가
    reVisit: number;
    firstVisit: number;
    visitPercent: number;
  };
  type ReVisitData = {
    reVisit: number;
    firstVisit: number;
    visitPercent: number;
  };
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [selectedDateText, setSelectedDateText] = useState("");
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("income");
  const [data, setData] = useState<DataState>({
    income: [],
    visitors: [],
  });

  const [menuData, setMenuData] = useState<MenuItem[]>([]);

  const [orderVisitor, setOrderVisitor] = useState<number[]>([]);

  const [menuSum, setMenuSum] = useState(0);
  const [reVisit, setReVisit] = useState<ReVisitData>({
    reVisit: 0,
    firstVisit: 0,
    visitPercent: 0,
  });

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const handleDateChange = (dates: [Date | null, Date | null]) => {
    setDateRange(dates);
    if (dates[0] && dates[1]) {
      setSelectedDateText(
        `${dates[0].toLocaleDateString()} ~ ${dates[1].toLocaleDateString()}`
      );
    }
  };
  const [isDataEmpty, setIsDataEmpty] = useState(false);
  const price = async () => {
    if (!shopId) {
      return alert("shopId가 없습니다.");
    }
    console.log(shopId);
    const result = await axios.post(
      `${process.env.REACT_APP_API_SERVER}/income/orderMenu`,
      {
        shopId,
        startDate: dateRange[0],
        endDate: dateRange[1],
      }
    );
    console.log(
      "process.env.REACT_APP_API_SERVER",
      process.env.REACT_APP_API_SERVER
    );
    if (result.data) {
      const menuSum = result.data.priceSum;
      setMenuSum(menuSum);

      const menuData = result.data.menu
        ? (Object.values(result.data.menu) as MenuItem[])
        : [];
      setMenuData(menuData);

      const datePerSum = result.data.datePerSum
        ? (Object.values(result.data.datePerSum) as number[])
        : [];

      setData((prevData) => ({
        ...prevData,
        income: datePerSum,
      }));
      const menuNumber = result.data.groupedMenu
        ? Object.values(result.data.groupedMenu).map((item) => {
            const menuItem = item as MenuItem; // 🔥 타입 단언 추가
            return {
              name: String(menuItem.name),
              value: Number(menuItem.value),
              color: String(menuItem.color),
              menuName: String(menuItem.menuName),
              price: Number(menuItem.price),
            };
          })
        : [];

      setMenu(menuNumber);
    } else {
      console.error("Error fetching price data");
    }
  };

  const visitor = async () => {
    try {
      if (!shopId) {
        return alert("shopId가 없습니다.");
      }
      const result = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/income/orderVisitor`,
        { shopId, startDate: dateRange[0], endDate: dateRange[1] }
      );

      if (result.data) {
        const visitData = result.data.takeOutData
          ? (Object.values(result.data.takeOutData) as number[])
          : [];
        setOrderVisitor(visitData);

        const visitPerDate = result.data.totalVisitors
          ? (Object.values(result.data.totalVisitors) as number[]) // 🔥 타입 단언 추가
          : [];

        setData((prevData) => ({
          ...prevData,
          visitors: visitPerDate,
        }));
      } else {
        console.error("Error fetching visitor data: No data received");
      }
    } catch (error) {
      console.error("Error fetching visitor data:", error);
    }
  };

  const reVisitor = async () => {
    if (!shopId) {
      return alert("shopId가 없습니다.");
    }

    const result = await axios.post(
      `${process.env.REACT_APP_API_SERVER}/income/reVisitor`,
      { shopId, startDate: dateRange[0], endDate: dateRange[1] }
    );

    const reVisitData = Object.values(
      result.data.reVisitData
    ).reduce<VisitData>(
      (acc, user) => {
        const typedUser = user as UserData;

        if (typedUser.isReVisit) {
          acc.reVisit += typedUser.number;
        } else {
          acc.firstVisit += typedUser.number;
        }
        acc.visitPercent = Math.floor(
          (acc.reVisit / (acc.reVisit + acc.firstVisit)) * 100
        );
        return acc;
      },
      { reVisit: 0, firstVisit: 0, visitPercent: 0 }
    );

    setReVisit(reVisitData);
    console.log(reVisit);
  };
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setDateRange([thirtyDaysAgo, today]);
    setSelectedDateText(
      `${thirtyDaysAgo.toLocaleDateString()} - ${today.toLocaleDateString()}`
    );
  }, []);

  useEffect(() => {
    if (dateRange[1]) {
      price();
      visitor();
      reVisitor();
    }
  }, [dateRange[1]]);

  return (
    <>
      <Header />
      <div className="max-w-[1200px] mx-auto bg-amber-400 p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-white md:text-3xl">
          매출관리
        </h1>
        <hr className="my-4 border-white" />

        <div className="mb-4 text-center">
          <span className="text-lg font-semibold">선택기간 :</span>
          <span className="ml-2">
            {selectedDateText || "날짜를 선택해주세요"}
          </span>
          <button
            onClick={() => setIsCalendarVisible(!isCalendarVisible)}
            className="px-4 py-2 ml-4 font-bold bg-white rounded-lg shadow text-amber-500"
          >
            달력 보기
          </button>
          {isCalendarVisible && (
            <div
              className="absolute z-10 p-2 mt-2 bg-white rounded-lg shadow-lg "
              style={{
                top: "calc(29%)",
                left: "calc(53.5%)",
              }}
            >
              <DatePicker
                selectsRange
                startDate={dateRange[0]}
                endDate={dateRange[1]}
                onChange={handleDateChange}
                inline
                className="rounded-lg border-amber-500"
                locale={ko}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 text-white md:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 rounded-lg shadow bg-amber-500">
            <h4 className="font-bold">매출액</h4>
            <hr className="my-2 border-white" />
            <p>
              <div>
                {menuData.map((el) => {
                  return (
                    <div>
                      {el.menuName}: {el.price}원
                    </div>
                  );
                })}
              </div>
            </p>
            <p className="font-bold text-right">총 매출액 : {menuSum}원</p>
          </div>
          <div className="p-4 rounded-lg shadow bg-amber-500">
            <h4 className="font-bold">고객 수</h4>
            <hr className="my-2 border-white" />

            <p>방문 고객 수 : {orderVisitor[0] ? orderVisitor[0] : 0}명</p>
            <p>포장 고객 수 : {orderVisitor[1] ? orderVisitor[1] : 0}명</p>
            <p className="font-bold text-right">
              총 고객 수 :{" "}
              {orderVisitor[0] + orderVisitor[1]
                ? orderVisitor[0] + orderVisitor[1]
                : "0"}{" "}
              명
            </p>
          </div>
          <div className="p-4 rounded-lg shadow bg-amber-500">
            <h4 className="font-bold">재방문율</h4>
            <hr className="my-2 border-white" />

            <p>재방문 고객 : {reVisit.reVisit}명</p>
            <p>신규 고객 : {reVisit.firstVisit}명</p>
            <p className="font-bold text-right">
              재방문율 : {reVisit.visitPercent}%{" "}
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center w-full h-full gap-10 mt-10 lg:flex-row">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full lg:w-[70%] h-full">
            <select
              onChange={(e) => {
                setSelectedOption(e.target.value);
              }}
              className="p-2 mb-4 border rounded-lg"
            >
              <option value="income">매출</option>
              <option value="visitors">고객 수</option>
            </select>
            {isDataEmpty || data.income.length === 0 ? (
              <p className="text-center text-lg font-bold text-red-500">
                검색 결과가 존재하지 않습니다. 날짜를 변경해주세요.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={data[selectedOption]}>
                  <XAxis dataKey="날짜" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="매출" fill="rgb(233, 52, 52)" />
                  <Bar dataKey="포장" fill="rgb(233, 52, 52)" />
                  <Bar
                    dataKey="매장"
                    fill="hsl(0, 59.42028985507246%, 27.058823529411768%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-lg w-full lg:w-[30%]">
            <h4 className="font-bold">메뉴별 매출 비율</h4>
            {isDataEmpty || menu.length === 0 ? (
              <p className="text-center text-lg font-bold text-red-500">
                검색 결과가 존재하지 않습니다.
                <br /> 날짜를 변경해주세요.
              </p>
            ) : (
              <ResponsiveContainer
                width="100%"
                height={window.innerWidth < 900 ? 300 : 400}
              >
                <PieChart width={400} height={400}>
                  <Pie
                    data={menu}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ name, percent, x, y }) => (
                      <text
                        x={x}
                        y={y}
                        fill="black"
                        textAnchor="middle"
                        fontSize={12}
                      >
                        {`${name} (${(percent * 100).toFixed(2)}%)`}
                      </text>
                    )}
                    labelLine={false}
                  >
                    {menu.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}
            <table className="w-full mt-4 border border-gray-300 ">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">메뉴</th>
                  <th className="p-2 border">판매수량</th>
                </tr>
              </thead>
              <tbody>
                {menu.map((item, index) => (
                  <tr key={index} className="border">
                    <td className="p-2 border">{item.name}</td>
                    <td className="p-2 border">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
