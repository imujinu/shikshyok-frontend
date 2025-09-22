import { useEffect, useState } from "react";

//pors interface 별점 저장할
interface StarProps {
  setStarClick: (value: number) => void;
}

export default function Star({ setStarClick }: StarProps) {
  const [starClick, setInStarClick] = useState<number | null>(0);
  const [preClicked, setPreClicked] = useState<number | null>(starClick);

  useEffect(() => {
    setPreClicked(starClick);
    setStarClick(starClick || 0); // 부모에게 전달
  }, [starClick]);

  useEffect(() => {
    console.log("starClick state:", starClick);
    console.log("preClicked state:", preClicked);
  }, [starClick, preClicked]);

  const goToFetch = (e: React.MouseEvent<HTMLImageElement>) => {
    e.preventDefault();
    const nowClicked = parseInt(e.currentTarget.id); // 현재 클릭한 id
    console.log("Clicked ID:", nowClicked);
    setInStarClick(nowClicked);
    if (nowClicked !== null) {
      if (nowClicked === preClicked) {
        // 현재 클릭한 별이 이전에 클릭한 별과 같다면 리셋
        setInStarClick(0);
        setPreClicked(0);
        for (let i = 1; i <= 5; i++) {
          const star_id = document.getElementById(
            i.toString()
          ) as HTMLImageElement;
          if (star_id) {
            star_id.src = `${process.env.PUBLIC_URL}/assets/fork-E.svg`;
          }
        }
      } else {
        // 별이 클릭한 상태라면
        if (preClicked !== null && nowClicked > preClicked) {
          for (let i = 1; i <= nowClicked; i++) {
            const star_id = document.getElementById(
              i.toString()
            ) as HTMLImageElement;
            if (star_id) {
              star_id.src = `${process.env.PUBLIC_URL}/assets/fork-F.svg`;
              console.log(`Star ${i} changed to fork-F`);
            }
          }
        } else if (preClicked !== null && nowClicked < preClicked) {
          for (let i = 1; i <= nowClicked; i++) {
            const star_id = document.getElementById(
              i.toString()
            ) as HTMLImageElement;
            if (star_id) {
              star_id.src = `${process.env.PUBLIC_URL}/assets/fork-F.svg`;
              console.log(`Star ${i} changed to fork-F`);
            }
          }
          for (let j = 5; j > nowClicked; j--) {
            const star_id = document.getElementById(
              j.toString()
            ) as HTMLImageElement;
            if (star_id) {
              star_id.src = `${process.env.PUBLIC_URL}/assets/fork-E.svg`;
              console.log(`Star ${j} changed to fork-E`);
            }
          }
        } else {
          for (let i = 1; i <= nowClicked; i++) {
            const star_id = document.getElementById(
              i.toString()
            ) as HTMLImageElement;
            if (star_id) {
              star_id.src = `${process.env.PUBLIC_URL}/assets/fork-E.svg`;
              console.log(`Star ${i} changed to fork-E`);
            }
          }
        }
      }
    }

    console.log("starClick state:", starClick);
    console.log("preClicked state:", preClicked);
  };

  // div 클릭시 리셋
  const resetStars = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).className === "background") {
      setStarClick(-1); //여기랑 밑에 -1 보다 0으로 하는게 좋대
      setPreClicked(-1);
      for (let i = 1; i <= 5; i++) {
        const star_id = document.getElementById(
          i.toString()
        ) as HTMLImageElement;
        if (star_id) {
          star_id.src = `${process.env.PUBLIC_URL}/assets/fork-E.svg`;
        }
      }
    }
  };

  return (
    <div
      className="flex w-4/5 h-12 box-content justify-center"
      onClick={resetStars}
    >
      {[1, 2, 3, 4, 5].map((el) => (
        <img
          key={el}
          id={`${el}`}
          className="w-8 h-5/6  cursor-pointer m-1"
          src={`${process.env.PUBLIC_URL}/assets/fork-E.svg`}
          alt="reivew"
          onClick={goToFetch}
        />
      ))}
      <p className="text-3xl  ml-3 pt-1">
        {starClick}/<span className="text-gray-300">5</span>
      </p>
    </div>
  );
}
