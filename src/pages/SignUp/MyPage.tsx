import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer'; // 경로 수정
import Header from '../../components/Header/Header'; // 헤더 임포트
import '../../styles/MyPage.scss'; // 경로 수정
import profileImage from '../../assets/dprofile.jpg'; // import 형식으로 수정
import axios from 'axios';
import Footer from '../Footer';

const MyPage: React.FC = () => {
  const memberType = useSelector((state: RootState) => state.login.type);
  const navigate = useNavigate();
  const loginId = useSelector((state: RootState) => state.login.loginId);
  const nicknameFromStore = useSelector(
    (state: RootState) => state.login.nickname,
  );
  const type = useSelector((state: RootState) => state.login.type);
  const shopId = useSelector((state: RootState) => state.login.shopId); // 가게 ID 가져오기

  // 머니 충전 상태 관리
  const [isCharging, setIsCharging] = useState(false);
  const [amount, setAmount] = useState('');

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleDeleteMember = () => {
    if (nicknameFromStore) {
      navigate(`/delete/${nicknameFromStore}`);
    } else {
      alert('사용자 닉네임을 찾을 수 없습니다.');
    }
  };

  const handleChargeMoney = () => {
    setIsCharging(true);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleSubmitCharge = async () => {
    if (!amount) {
      alert('충전할 금액을 입력해주세요.');
      return;
    }

    try {
      // 서버에 충전 요청 보내기
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/charge`,
        {
          type: memberType,
          amount: Number(amount),
          userId: loginId,
        },
        {
          withCredentials: true, // 쿠키 포함
        },
      );

      alert(response.data.message);
      setAmount(''); // 입력란 초기화
      setIsCharging(false); // 충전 입력란 숨기기
    } catch (error) {
      console.error('머니 충전 오류:', error);
      alert('머니 충전 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="container">
      <Header />
      <div className="card">
        <img
          src={profileImage} // import한 이미지 사용
          alt="Profile"
          className="profile-pic"
        />
        <h2 className="username">{nicknameFromStore || '사용자 이름'}</h2>
        <p className="bio">로그인 ID: {loginId}</p> {/* 로그인 ID 표시 */}
        <p className="bio">회원 유형: {type}</p> {/* 회원 유형 표시 */}
      </div>
      <div className="menu">
        <div className="menu-item">
          <h3 className="menu-title" onClick={handleEditProfile}>
            정보수정
          </h3>
        </div>
        <div className="menu-item">
          <h3 className="menu-title" onClick={handleDeleteMember}>
            회원 탈퇴
          </h3>
        </div>
        <div className="menu-item">
          <h3 className="menu-title" onClick={handleChargeMoney}>
            머니 충전
          </h3>
        </div>
      </div>

      {isCharging && (
        <div className="charge-container">
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="충전할 금액 입력"
          />
          <button onClick={handleSubmitCharge}>충전하기</button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MyPage;
