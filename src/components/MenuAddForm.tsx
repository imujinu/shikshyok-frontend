import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/menu-form.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../store/rootReducer";

interface MenuAddFormProps {
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
  setImgS3route: React.Dispatch<React.SetStateAction<string>>;
  setIsUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MenuAddForm({
  setIsShow,
  setImgS3route,
  setIsUpdated,
}: MenuAddFormProps) {
  let [mname, setMname] = useState("");
  let [mcategory, setMcategory] = useState("");
  let [mprice, setMprice] = useState("0");
  let [mdesc, setMcontent] = useState("");
  let [mfile, setMfile] = useState<File | null>(null);

  const formRef = useRef<HTMLFormElement | null>(null);
  const customRef = useRef<HTMLDivElement | null>(null);
  const id = useSelector((state: RootState) => state.login.id);
  const shop_id = useSelector((state: RootState) => state.login.shopId);
  console.log("menu add 내의 shop_id", shop_id);

  //메뉴 추가 함수
  const menuAdd = async (e: React.FormEvent) => {
    try {
      if (formRef.current && formRef.current.checkValidity()) {
        //redux

        const formData = new FormData();

        formData.append("mname", mname);
        formData.append("mcategory", mcategory);
        formData.append("mprice", mprice);
        formData.append("mdesc", mdesc);
        if (mfile) {
          formData.append("image", mfile);
          formData.append("mfile", mfile.name);
        }
        if (id) {
          formData.append("owner_id", String(id));
        }
        if (shop_id) {
          formData.append("shopId", String(shop_id));
        }

        const response = await axios.post(
          `${process.env.REACT_APP_API_SERVER}/menu-register`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const { isUpdate, msg } = response.data;
        setIsUpdated(true);

        setIsUpdated(false);

        if (isUpdate) {
          alert(msg);
        } else {
          alert(msg);
        }

        console.log(response.data.s3Url);

        //s3에 업로드하고 나서, 그 결과값으로 나온 경로를 state에 넣기
        const { s3Url } = response.data;
        console.log("이것은 fileUrl이다: ", s3Url);
        setImgS3route(s3Url);
      }
      setIsShow(false);
    } catch (err) {
      console.log(err);
    }
  };

  //파일명 보여주는 함수
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setMfile(file); // 파일 이름을 state에 저장

      // ref로 선택된 div에 파일 이름을 넣어줌
      if (customRef.current) {
        customRef.current.textContent = file.name;
      }
    }
  };

  return (
    <div className="m-reg-container">
      <form className="menu-modal" ref={formRef} onSubmit={menuAdd}>
        <div className="x-box">
          <FontAwesomeIcon
            icon={faXmark}
            className="close-btn"
            onClick={() => setIsShow(false)}
          />
        </div>
        <label>
          메뉴명
          <br />{" "}
          <input
            type="text"
            name="mname"
            value={mname}
            onChange={(e) => setMname(e.target.value)}
          />
        </label>
        <br />
        <label>
          분류
          <br />{" "}
          <input
            type="text"
            name="mcategory"
            value={mcategory}
            onChange={(e) => setMcategory(e.target.value)}
          />
        </label>
        <br />
        <label>
          가격
          <br />{" "}
          <input
            type="text"
            name="mprice"
            value={mprice}
            onChange={(e) => setMprice(e.target.value)}
          />
        </label>
        <br />
        <label>
          설명
          <br />{" "}
          <input
            type="text"
            name="mdesc"
            value={mdesc}
            onChange={(e) => setMcontent(e.target.value)}
          />
        </label>
        <br />

        <label className="custom-container">
          사진
          <br />
          <div className="custom-input" ref={customRef}>
            <p>{mfile ? mfile.name : "파일을 입력해 주세요."}</p>
            <input type="file" name="mfile" onChange={handleFileChange} />
          </div>
        </label>
        <br />
        <button type="submit">등록하기</button>
      </form>
    </div>
  );
}
