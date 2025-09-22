import React, { useState } from 'react';
import '../../styles/LoginPage.scss';
import { useDispatch } from 'react-redux';
import * as T from '../../store/login';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅을 임포트합니다.
import Header from '../../components/Header/Header';
import Footer from '../Footer';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    user_id: '',
    password: '',
    membershipType: 'individual', // 기본값 개인회원
  });

  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 가져오기

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(''); // 입력할 때 에러 메시지 초기화
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('폼데이터 확인 = ', formData);
    if (!formData.user_id || !formData.password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    // 로그인 요청을 위한 API 호출
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/login`,
        formData, // formData에 membershipType 포함
        {
          withCredentials: true, // 세션을 사용하므로 필요
        },
      );

      const data = response.data;
      console.log('결과값 = :', data);

      if (data.isSuccess) {
        // 로그인 아이디 저장 리덕스에
        dispatch(T.setLoginId(data.user_id));
        // 기본키 id 저장 나중에 db 쿼리 사용할 때 사용
        dispatch(T.setUserId(data.id));
        // 헤더에서 닉네임 표시 위한 리덕스 저장
        dispatch(T.setNickname(data.nickname));
        dispatch(T.setType(data.membershipType)); // 회원 유형 저장
        dispatch(T.setPhoneNumber(data.phone)); // 전화번호 저
        dispatch(T.setShopId(data.shopId)); // 가게 아이디 저장
        dispatch(T.setShopOwnerLoginId(data.shopOwnerLoginId)); // 가게 주인 로그인 아이디 저장

        // 사용자 유형에 따라 리다이렉트
        if (data.membershipType === 'business') {
          setTimeout(() => navigate('/'), 1000); // 1초 후 홈으로 리다이렉트
        } else {
          setTimeout(() => navigate('/'), 1000); // 1초 후 사용자 메인으로 리다이렉트
        }
      } else {
        // 로그인 실패 시 에러 메시지를 서버의 메시지로 변경
        setError(data.message || '로그인 실패!'); // 서버로부터 받은 메시지 사용
      }
    } catch (error) {
      setError('로그인에 실패했습니다. 다시 시도해주세요.');
      console.error('로그인 오류:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="login-page">
        <h1 className="login-title">로그인</h1>
        <div className="membership-container">
          {/* 회원 유형 선택 박스 */}
          <div className="membership-type">
            <button
              onClick={() =>
                setFormData({ ...formData, membershipType: 'individual' })
              }
              className={
                formData.membershipType === 'individual' ? 'active' : ''
              }
            >
              개인회원
            </button>
            <button
              onClick={() =>
                setFormData({ ...formData, membershipType: 'business' })
              }
              className={formData.membershipType === 'business' ? 'active' : ''}
            >
              기업회원
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>아이디</label>
              <input
                type="text"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                placeholder="아이디를 입력해주세요"
                required
              />
            </div>
            <div className="form-group">
              <label>비밀번호</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력해주세요"
                required
              />
            </div>
            {error && <span className="error">{error}</span>}
            <button type="submit">로그인</button>
          </form>
          {/* 회원가입 링크 추가 */}
          <div className="additional-links">
            <a href="/signup">회원가입</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LoginPage;
