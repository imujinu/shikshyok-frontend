import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../styles/header.scss'; // Sass 파일 불러오기
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import { RootState } from '../../store/rootReducer';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { setLogout } from '../../store/login'; // 액션 임포트 추가
import axios from 'axios'; // axios 추가

const Header: React.FC = () => {
  const id = useSelector((state: RootState) => state.login.id);
  const loginId = useSelector((state: RootState) => state.login.loginId);
  const nickname = useSelector((state: RootState) => state.login.nickname);
  const type = useSelector((state: RootState) => state.login.type);
  const phoneNumber = useSelector(
    (state: RootState) => state.login.phoneNumber,
  );

  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수 가져오기

  useEffect(() => {
    console.log('id 나와라(기본키 나중에 db쿼리에서 사용) =', id);
    console.log('loginId 나와라 =', loginId);
    console.log('nickname 나와라 =', nickname);
    console.log('type 나와라 = ', type);
    console.log('phoneNumber 나와라 = ', phoneNumber);
  }, [id, loginId, nickname, type]);

  const toggleSideMenu = () => {
    setSideMenuVisible(!sideMenuVisible);
  };

  const handleLogout = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_SERVER}/logout`, {
        withCredentials: true, // 세션을 사용하므로 필요
      });
      alert('로그아웃 성공!'); // 예시로 알림 추가

      // 리덕스 상태 초기화
      dispatch(setLogout()); // setLogout 액션 호출

      navigate('/login'); // 로그인 페이지로 리다이렉트
    } catch (error) {
      console.error('로그아웃 오류:', error);
      alert('로그아웃 중 오류가 발생했습니다.'); // 오류 메시지 표시
    }
  };

  return (
    <header>
      <div className="wrap-container-header">
        <div className="header-container">
          <div className="logo-container">
            <Link to="/">
              <img
                src={`${process.env.PUBLIC_URL}/assets/logo.png`}
                alt="Logo"
              />
            </Link>
          </div>
          <div className="menu-container">
            {/* 비로그인 헤더 */}
            {loginId === null && (
              <>
                <Link to="/login" className="menu-item">
                  <div>로그인</div>
                </Link>
                <Link to="/signup" className="menu-item">
                  <div>회원가입</div>
                </Link>
                <div className="menu-sidebar" onClick={toggleSideMenu}>
                  <FontAwesomeIcon icon={faBars} size="4x" />
                </div>
              </>
            )}

            {/* 점주회원 헤더  */}
            {type === 'business' && (
              <>
                <div className="menu-item">{nickname}님 환영합니다</div>
                <Link to="/mypage" className="menu-item">
                  <div>마이페이지</div>
                </Link>
                <Link to="/ownerOrderHistory" className="menu-item">
                  <div>주문내역</div>
                </Link>
                <div className="menu-item" onClick={handleLogout}>
                  <div>로그아웃</div>
                </div>
                <div className="menu-sidebar" onClick={toggleSideMenu}>
                  <FontAwesomeIcon icon={faBars} size="4x" />
                </div>
              </>
            )}

            {/* 일반회원 헤더 */}
            {type === 'individual' && (
              <>
                <div className="menu-item">{nickname}님 환영합니다</div>
                <Link to="/mypage" className="menu-item">
                  <div>마이페이지</div>
                </Link>
                <Link to="/customerOrderHistory" className="menu-item">
                  <div>주문내역</div>
                </Link>
                <div className="menu-item" onClick={handleLogout}>
                  <div>로그아웃</div>
                </div>
                <div className="menu-sidebar" onClick={toggleSideMenu}>
                  <FontAwesomeIcon icon={faBars} size="4x" />
                </div>
              </>
            )}
          </div>

          {/* 점주회원 헤더 */}
          {sideMenuVisible && type === 'business' && (
            <div className="side-menu-container">
              <Link to="/mypage">
                <div className="side-menu">마이페이지</div>
              </Link>
              <Link to="/ownerOrderHistory">
                <div className="side-menu">주문내역</div>
              </Link>
              <div className="side-menu" onClick={handleLogout}>
                로그아웃
              </div>
            </div>
          )}

          {/* 일반회원 헤더 */}
          {sideMenuVisible && type === 'individual' && (
            <div className="side-menu-container">
              <Link to="/mypage">
                <div className="side-menu">마이페이지</div>
              </Link>
              <Link to="/customerOrderHistory">
                <div className="side-menu">주문내역</div>
              </Link>
              <div className="side-menu" onClick={handleLogout}>
                로그아웃
              </div>
            </div>
          )}

          {sideMenuVisible && loginId === null && (
            <div className="side-menu-container">
              <Link to="/login">
                <div className="side-menu">로그인</div>
              </Link>
              <Link to="/signup">
                <div className="side-menu">회원가입</div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
