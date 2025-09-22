import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/SignUpPage.scss';
import Header from '../../components/Header/Header';
import Footer from '../Footer';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    birthdate: '',
    gender: '',
    email: '',
    phoneNumber: '',
    address: '',
    companyName: '',
    businessType: '',
    storeAddress: '',
    representativeName: '',
    businessRegistrationNumber: '',
    nickname: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailExists, setEmailExists] = useState(false);
  const [membershipType, setMembershipType] = useState<
    'individual' | 'business'
  >('individual');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') {
      if (value.length < 8 || value.length > 16) {
        setPasswordError('비밀번호는 8-16자 이내여야 합니다.');
      } else if (
        !/[a-z]/.test(value) ||
        !/[0-9]/.test(value) ||
        !/[!@#$%^&*]/.test(value)
      ) {
        setPasswordError(
          '비밀번호는 소문자, 숫자, 특수문자를 포함해야 합니다.',
        );
      } else {
        setPasswordError('');
      }
    }

    if (name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        setEmailError('유효하지 않은 이메일 형식입니다.');
      } else {
        setEmailError('');
      }
    }
  };

  const handleMembershipChange = (type: 'individual' | 'business') => {
    setMembershipType(type);
    setFormData({
      username: '',
      password: '',
      name: '',
      birthdate: '',
      gender: '',
      email: '',
      phoneNumber: '',
      address: '',
      companyName: '',
      businessType: '',
      storeAddress: '',
      representativeName: '',
      businessRegistrationNumber: '',
      nickname: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 필수 입력값 확인
    if (
      !formData.nickname ||
      !formData.username ||
      !formData.password ||
      !formData.email ||
      !formData.phoneNumber
    ) {
      alert('필수 정보를 입력하세요.');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/signup`,

        {
          user_id: formData.username, // 사용자 ID
          password: formData.password, // 비밀번호
          name: formData.name, // 이름
          gender: formData.gender, // 성별
          email: formData.email, // 이메일
          phoneNumber: formData.phoneNumber, // 전화번호
          address: formData.address, // 주소 (서버에서 요구하는 경우 추가)
          companyName: formData.companyName, // 회사명 (사업자 회원인 경우)
          businessType: formData.businessType, // 업종 (사업자 회원인 경우)
          storeAddress: formData.storeAddress, // 가게 주소 (사업자 회원인 경우)
          representativeName: formData.representativeName, // 대표자명 (사업자 회원인 경우)
          businessRegistrationNumber: formData.businessRegistrationNumber, // 사업자 등록증 번호 (사업자 회원인 경우)
          nickname: formData.nickname, // 닉네임
          membershipType, // 회원 유형 (individual 또는 business)
        },
      );

      console.log('회원가입 성공:', response.data);
      alert('회원가입이 완료되었습니다.');
      navigate('/login');
    } catch {
      // 오류 발생 시 기본 메시지만 표시
      alert('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <>
      <Header />
      <div className="signup-page">
        <h1>회원가입</h1>
        <div className="signup-container">
          <div className="membership-type">
            <button
              onClick={() => handleMembershipChange('individual')}
              className={membershipType === 'individual' ? 'active' : ''}
            >
              개인회원
            </button>
            <button
              onClick={() => handleMembershipChange('business')}
              className={membershipType === 'business' ? 'active' : ''}
            >
              기업회원
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>아이디</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="아이디를 입력해주세요"
                required
              />
            </div>
            <div className="form-group">
              <label>닉네임</label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="닉네임을 입력해주세요"
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
                placeholder="비밀번호(8-16자 이내, 소문자, 특수문자)"
                required
              />
              {passwordError && <span className="error">{passwordError}</span>}
            </div>
            <div className="form-group">
              <label>이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="이름을 입력해주세요"
                required
              />
            </div>
            <div className="form-group">
              <label>생년월일(예: 2000-01-31)</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>성별</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">선택하세요</option>
                <option value="male">남자</option>
                <option value="female">여자</option>
                <option value="none">밝히고 싶지 않음</option>
              </select>
            </div>
            <div className="form-group">
              <label>이메일</label>
              <div className="email-container">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@example.com"
                  required
                />
              </div>
              {emailError && <span className="error">{emailError}</span>}
              {emailExists && (
                <span className="error">이미 사용 중인 이메일입니다.</span>
              )}
            </div>
            <div className="form-group">
              <label>휴대폰 번호</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="01012345678"
                required
              />
            </div>
            <div className="form-group">
              <label>주소</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="주소를 입력해주세요"
                required
              />
            </div>
            {membershipType === 'business' && (
              <>
                <div className="form-group-inline">
                  <div className="inline-input">
                    <label>가게명</label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="가게명을 입력해주세요"
                      required
                    />
                  </div>
                  <div className="inline-input">
                    <label>업종</label>
                    <input
                      type="text"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      placeholder="업종을 입력해주세요"
                      required
                    />
                  </div>
                </div>
                <div className="form-group-inline">
                  <div className="inline-input">
                    <label>가게 주소</label>
                    <input
                      type="text"
                      name="storeAddress"
                      value={formData.storeAddress}
                      onChange={handleChange}
                      placeholder="가게 주소를 입력해주세요"
                      required
                    />
                  </div>
                  <div className="inline-input">
                    <label>대표자명</label>
                    <input
                      type="text"
                      name="representativeName"
                      value={formData.representativeName}
                      onChange={handleChange}
                      placeholder="대표자명을 입력해주세요"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>사업자 등록증 번호</label>
                  <input
                    type="text"
                    name="businessRegistrationNumber"
                    value={formData.businessRegistrationNumber}
                    onChange={handleChange}
                    placeholder="사업자 등록증 번호를 입력해주세요"
                    required
                  />
                </div>
              </>
            )}

            <button type="submit">가입하기</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignUpPage;
