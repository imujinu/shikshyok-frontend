import "../styles/shop-form.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/rootReducer";

interface ShopAddFormProps {
  setIsShopShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ShopAddForm({ setIsShopShow }: ShopAddFormProps) {
  let [shopname, setShopname] = useState("");
  let [shopbrn, setShopbrn] = useState("");
  let [shopaddress, setShopaddress] = useState("");
  let [shopphone, setShopphone] = useState("");
  let [shoptype, setShoptype] = useState("");
  let [shopowner, setShopowner] = useState("");
  const id = useSelector((state: RootState) => state.login.id);

  const shopAdd = async () => {
    const response = await axios.post(
      "http://localhost:8082/api-server/shop-register",
      {
        owner_id: id,
        sname: shopname,
        sbrn: shopbrn,
        saddress: shopaddress,
        sphone: shopphone,
        stype: shoptype,
        sowner: shopowner,
      }
    );
    response.data.isAdd
      ? alert("등록이 완료되었습니다.")
      : alert("등록에 실패했습니다.");
  };
  return (
    <div className="sh-reg-container">
      <form className="shop-modal" onSubmit={shopAdd}>
        <div className="x-box">
          <FontAwesomeIcon
            icon={faXmark}
            className="close-btn"
            onClick={() => setIsShopShow(false)}
          />
        </div>

        <label>
          점포명
          <br />{" "}
          <input
            type="text"
            name="sname"
            onChange={(e) => setShopname(e.target.value)}
          />
        </label>
        <br />
        <label>
          점주명
          <br />{" "}
          <input
            type="text"
            name="sowner"
            onChange={(e) => setShopowner(e.target.value)}
          />
        </label>
        <br />
        <label>
          사업자번호
          <br />{" "}
          <input
            type="text"
            name="sbrn"
            onChange={(e) => setShopbrn(e.target.value)}
          />
        </label>
        <br />
        <label>
          업종
          <br />{" "}
          <input
            type="text"
            name="stype"
            onChange={(e) => setShoptype(e.target.value)}
          />
        </label>
        <br />
        <label>
          가게 주소
          <br />
          <input
            type="text"
            name="saddress"
            onChange={(e) => setShopaddress(e.target.value)}
          />
        </label>
        <br />
        <label>
          가게 전화번호
          <br />
          <input
            type="text"
            name="sphone"
            onChange={(e) => setShopphone(e.target.value)}
          />
        </label>

        <br />
        <button type="submit">등록하기</button>
      </form>
    </div>
  );
}
