interface Home {}

const Home: React.FC = () => {
  return (
    <>
      <h1>홈입니다.</h1>
      <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
        버튼
      </button>
    </>
  );
};

export default Home;
