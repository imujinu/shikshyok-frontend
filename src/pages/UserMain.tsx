import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/rootReducer'; // 경로 수정
import {
  setUserId,
  setLoginId,
  setNickname,
  setType,
} from '../store/login/actions'; // 경로 수정
import '../styles/UserMain.scss';
import '../styles/UserMain.scss';
import Header from '../components/Header/Header';
import axios from 'axios';
// 이미지 파일 import
import burger from '../assets/burger.jpg';
import mexican from '../assets/mexican.jpg';
import pizza from '../assets/pizza.jpg';
import pizza2 from '../assets/pizza2.jpg';
import vietnam from '../assets/vietnam.jpg';
import Footer from './Footer';

interface FoodItem {
  id: number;
  shop_menu_id: number;
  menuName: string;
  price: number;
  menudesc: string;
  category: string;
  originMfile?: string;
  saveMfile?: string;
}

interface StoreItem {
  id: number;
  owner_id: number;
  shopName: string;
  businessNumber: string;
  shopAddress: string;
  shopPhone: string;
  shopType: string;
  shopOwner: string;
}
// const socket = io(`${process.env.REACT_APP_SOCKET_SERVER}`);

const UserMain: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // dispatch 훅 사용
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('서울시 종로구');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const loginId = useSelector((state: RootState) => state.login.loginId);
  const [store, setStore] = useState<StoreItem[]>([]);

  useEffect(() => {
    const fetchShopList = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_SERVER}/getShop`,
        );

        setStore(res.data.shop);
        console.log(res.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchShopList();
  }, []);

  // 하드코딩된 슬라이드 이미지
  const images = [burger, mexican, pizza, pizza2, vietnam];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAreaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArea(event.target.value);
  };

  const nextSlide = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const handleStoreClick = (
    shopId: number,
    owner_id: number,
    shopName: string,
  ) => {
    navigate('/shopdetail', { state: { shopId, owner_id, shopName } });
  };

  return (
    <>
      <Header />
      <div className="user-main">
        <header className="header">
          <div className="header-controls">
            <div className="search-container">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="검색할 음식을 입력하세요..."
                className="search-input"
              />
            </div>
          </div>
        </header>
        <div className="banner">
          <div className="slider">
            <button className="slider-button prev" onClick={prevSlide}>
              &#10094; {/* 이전 버튼 */}
            </button>
            {images.length > 0 && (
              <img
                src={images[currentIndex]}
                alt="슬라이드 이미지"
                className="banner-image"
              />
            )}
            <button className="slider-button next" onClick={nextSlide}>
              &#10095; {/* 다음 버튼 */}
            </button>
          </div>
          <h1 className="banner-title">
            every day <span className="highlight">Shik - Shok</span>
          </h1>
        </div>
        <div className="food-grid">
          {foodItems.map(item => (
            <div key={item.id} className="food-item">
              <img
                src={item.saveMfile} // 메뉴 이미지
                alt={item.menuName}
                className="food-image"
              />
              <p className="food-name">{item.menuName}</p>
            </div>
          ))}
        </div>
        {/* STORE 섹션 */}
        <div className="store-section">
          <h2 className="store-title">STORE</h2>
          <div className="store-grid">
            {store.map(store => (
              <div
                key={store.id}
                className="store-item"
                onClick={() =>
                  handleStoreClick(store.id, store.owner_id, store.shopName)
                } // 클릭 시 상세 페이지로 이동
              >
                <img
                  src={process.env.PUBLIC_URL + '/assets/fork-E.svg'} // 하드코딩된 기본 이미지
                  alt={store.shopName}
                  className="store-image"
                />
                <div className="store-info">
                  <h3 className="store-name">{store.shopName}</h3>
                  <div className="store-rating">
                    <span className="rating-circle">4.8</span>{' '}
                    {/* 실제 평점 데이터로 대체 필요 */}
                  </div>
                  <p className="store-description">{store.shopType}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserMain;
