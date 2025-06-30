import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import useStats from "../../stores/useStats";

const HomePage = () => {
  console.log("home r");

  useEffect(() => {
    const unsubscribe = useStats.subscribe(
      (state) => state.scopeAnim,
      (value, prevValue) => {
        // console.log(value);
        if (value === true) {
          // console.log("animate");
          gsap.to(".label p", {
            opacity: 1,
            duration: 1,
            delay: 1,
            ease: "hop",
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="relative z-0 inset-0 h-[100svh] w-full flex justify-center items-center bg-transparent">
      <div className="label absolute right-[2.25rem] -bottom-0.5 mb-6 h-full flex flex-col items-start justify-end font-main">
        <p
          style={{ opacity: 0 }}
          className="select-none pointer-events-auto text-[0.875rem] sm:text-[1rem] !font-[500] normal-case"
        >
          Made by
          <span
            onClick={() => {
              window.location.href = "https://x.com/tobias_stoulil";
            }}
            className="hover:underline select-none cursor-pointer ml-1 text-[0.875rem] sm:text-[1rem] !font-[400] normal-case"
          >
            Tobias Stoulil
          </span>
        </p>
      </div>
    </div>
  );
};

export default HomePage;
