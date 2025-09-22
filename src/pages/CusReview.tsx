import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Star from "../components/Star";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/cusReview.scss";
import axios from "axios";
import Header from "../components/Header/Header";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import { RootState } from "../store/rootReducer";

//주문목록 interface (수정함)
interface data {
  id: number;
  cus_order_id: number;
  shop_order_id: number;
  user_id: string;
  menuName: string;
  price: string;
  totalPrice: string;
  visitors: number;
  isTakeout: boolean;
  orderTime: string;
  option?: string;
  progress?: string;
  visitTime: string;
}

export default function CusReview() {
  // 주문id로 메뉴,가격,총가격 가져오기(get),
  // 등록버튼 클릭=>rieview에 추가 + 사진도 reviewfile에
  //----- 오더아이디 받기
  const location = useLocation();
  const { orderId } = location.state || { orderId: null }; // 기본 값을 null로 설정
  console.log("주문아이디", orderId);

  // 사용자 아이디
  const userId = useSelector((state: RootState) => state.login.id);
  console.log("---------id?", userId);

  //===== 이미지
  const [imgFile, setImgFile] = useState<string | ArrayBuffer | null>("");
  //별점
  const [starClick, setStarClick] = useState<number>(0);
  const imgRef = useRef<HTMLInputElement | null>(null);
  //textarea
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const [text, setText] = useState<string>("");
  //----- GET
  const [menus, setMenus] = useState<string[]>([]); //처음 메뉴리스트
  const [review, setReview] = useState<data | null>(null);

  //----------------------- 처음 조회
  async function getData() {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_SERVER}/review`,
        {
          params: {
            orderId: orderId, //---- 여기 주문id 받아야 한다.
          },
        }
      );
      console.log(response.data.review);
      const review = response.data.review;
      setReview(review);

      // reviewData 배열에서 menuName을 추출하여 menus 배열로 저장
      if (Array.isArray(review)) {
        const menuNames = review.map((el) => el.menuName);
        setMenus(menuNames);
      } else {
        console.error("Review data is not an array:", review);
      }
      console.log("전체데이터", review);
      console.log(menus);
    } catch (error) {
      console.error("Error fetching shop data:", error);
    }
  }
  console.log("리뷰밖", review);
  console.log("메뉴밖", menus);

  useEffect(() => {
    getData();
  }, []);

  const saveImgFile = () => {
    // if (imgRef.current !== null)
    if (imgRef.current !== null && imgRef.current.files!.length > 0) {
      const file = imgRef.current.files![0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgFile(reader.result);
      };
      reader.readAsDataURL(file);
      console.log("안", imgRef.current.files![0]);
    }
    //-- 이미지 취소 에러시
    // else {
    //   setImgFile("");
    // }
  };
  if (imgRef.current !== null) {
    console.log("밖", imgRef.current.files![0]);
  }

  //- 등록시 이동을 위한
  const navigate = useNavigate(); // 성공시 이동
  // axios 데이터 업로드 요청 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (imgRef.current !== null && imgRef.current.files!.length > 0) {
      formData.append("image", imgRef.current.files![0]);
    }

    if (textRef.current !== null) {
      formData.append("reviewText", textRef.current.value);
    }

    formData.append("star", starClick.toString());
    formData.append("orderId", orderId); // 주문아이디
    // formData.append("cus_order_id", userId); // 회원 아이디  cus_order_id
    if (!review) {
      // review가 초기값 null이라서
      console.error("Review data is not loaded yet.");
      return;
    }
    if (Array.isArray(review) && review.length > 0) {
      formData.append("shopId", review[0].shop_order_id.toString());
      formData.append("cus_order_id", review[0].cus_order_id.toString());
    } else {
      console.error("Review data is not in the expected format:", review);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/review`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("서버에서 받은", response.data);
      if (response.data.message === "ok") {
        alert("리뷰가 등록됐습니다.");
        navigate("/"); //성공시 홈으로
      }
    } catch (error) {
      console.error("Error uploading data: ", error);
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-[1200px] flex justify-center my-0 mx-auto">
        <form
          className="con my-10 border rounded w-3/5 
        flex flex-col items-center shadow-md"
          onSubmit={handleSubmit}
        >
          <div className="title border-b mt-4 pb-2 w-4/5">
            <h1 className="text-2xl font-bold pl-2">리뷰 작성</h1>
          </div>
          <ul className="menuUl bg-[#fefcf5] w-4/5 m-3 p-3 shadow-sm ">
            <li className="pl-3 py-2 mb-2 font-bold border-b">메뉴</li>
            {menus.map((el, index) => {
              return (
                <li className="pl-3" key={index}>
                  {el}
                </li>
              );
            })}
          </ul>
          {/* === 금액 ===== */}
          <div className="total  w-4/5 border-t flex flex-col items-center py-3"></div>
          <div className="star w-full flex flex-col items-center my-6">
            <p className="text-stone-400">
              <span className="star-s font-bold">식사</span>는 어떠셨나요?
            </p>
            <p className="text-stone-400 mb-3">
              리뷰를 <span className="star-s text-amber-500 font-bold">쇽</span>{" "}
              남겨주세요
            </p>

            <Star setStarClick={setStarClick} />
          </div>

          <div className="textBox w-full my-7 flex justify-center">
            <textarea
              placeholder="리뷰를 입력해주세요.(공백 포함 200자 이내 작성)"
              maxLength={200}
              className="resize-none border block w-4/5 h-24 p-2 rounded text-sm"
              ref={textRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
          </div>

          {/* 이미지 */}
          <div className="imgUpload w-full h-28 flex justify-center mb-5">
            <div className="imgBox w-4/5 h-full flex justify-center">
              <label
                htmlFor="profileImg"
                className="inline-block cursor-pointer w-32 h-full 
                border rounded text-center leading-[105px] mr-4"
              >
                <FontAwesomeIcon
                  icon={faCamera}
                  size="2xl"
                  style={{ color: "#fe9a00" }}
                />
              </label>
              <input
                type="file"
                id="profileImg"
                accept="image/jpg, image/png, image/jpeg"
                className="absolute w-0 h-0 p-0 m-[-1px] 
                overflow-hidden sr-only" // clip: rect(0, 0, 0, 0);
                onChange={saveImgFile}
                ref={imgRef}
              />
              {imgFile && (
                <div
                  className="imgSum w-32 h-full 
                 border rounded p-1"
                >
                  <img
                    src={`${imgFile}`}
                    alt="imgSum"
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>
          {/* 여기 */}

          <div className="buttonBox w-full text-center mb-10">
            <button
              type="submit"
              className="register w-1/5 h-14 m-2 rounded bg-amber-500
            text-white hover:bg-amber-600 shadow-sm"
            >
              등록
            </button>
            <Link to={"/"}>
              <button
                type="button"
                className="cancel w-1/5 h-14 border rounded m-2 
            shadow-sm hover:bg-gray-50"
              >
                취소
              </button>
            </Link>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
