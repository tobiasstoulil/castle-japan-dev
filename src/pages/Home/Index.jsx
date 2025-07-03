import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import useStats from "../../stores/useStats";
import SoundSvg from "./SoundSvg";

const HomePage = () => {
  console.log("home r");

  const counterRef = useRef(null);
  const finalButtonRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const themeSoundRef = useRef(new Audio("/sounds/themeTrackFinal.mp3"));
  const hitSoundRef = useRef(new Audio("/sounds/hitSound.mp3"));

  useEffect(() => {
    const themeSound = themeSoundRef.current;

    themeSound.volume = 0.375;
    themeSound.loop = true;

    // console.log(isPlaying);
    if (isPlaying) {
      themeSound.play();
    } else {
      themeSound.pause();
      themeSound.currentTime = 0;
    }
  }, [isPlaying]);

  useEffect(() => {
    const unsubscribe = useStats.subscribe(
      (state) => state.scopeAnim,
      (value, prevValue) => {
        // console.log(value);
        if (value === true) {
          // console.log("animate");
          gsap.to(".label", {
            opacity: 1,
            duration: 1,
            delay: 2.5,
            ease: "hop",
          });
          gsap.to(".message p", {
            opacity: 1,
            duration: 1.75,
            delay: 1.75,
            ease: "hop",
          });
          gsap.to(".icon", {
            opacity: 0.775,
            duration: 1,
            delay: 2.5,
            ease: "hop",
          });
          gsap.to(".counter p", {
            opacity: 1,
            duration: 1.75,
            delay: 1.75,
            ease: "hop",
          });
        }
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = useStats.subscribe(
      (state) => state.hintCount,
      (value, prevValue) => {
        // console.log(value);
        counterRef.current.textContent = `${value}/3`;
        // console.log(isPlaying);

        if (isPlaying) {
          hitSoundRef.current.currentTime = 0;
          hitSoundRef.current.volume = 0.2;
          hitSoundRef.current.play();
        } else {
          hitSoundRef.current.pause();
          hitSoundRef.current.currentTime = 0;
        }

        if (value === 3) {
          gsap.to(finalButtonRef.current, {
            opacity: 1,
            duration: 1.75,
            delay: 2,
            ease: "hop",
            onComplete: () => {
              gsap.to(finalButtonRef.current, {
                opacity: 0,
                duration: 1.5,
                delay: 0,
                ease: "hop",
                onComplete: () => {
                  finalButtonRef.current.textContent =
                    "Fortunately the castle is no longer sick";
                  gsap.to(finalButtonRef.current, {
                    opacity: 1,
                    duration: 1.75,
                    delay: 1.5,
                    ease: "hop",
                  });
                },
              });
            },
          });
        }
      }
    );

    return () => unsubscribe();
  }, [isPlaying]);

  return (
    <div className="relative z-0 inset-0 h-[100svh] w-full flex justify-center items-center bg-transparent">
      <p
        style={{ opacity: 0 }}
        className="label z-[1] absolute top-[40px] right-[2.25rem] pointer-events-auto text-[#3d3d3d] text-[0.875rem] !font-[500] normal-case"
      >
        Made by
        <span
          onClick={() => {
            window.location.href = "https://x.com/tobias_stoulil";
          }}
          className="hover:underline text-[#3d3d3d] cursor-pointer ml-1 text-[0.875rem]  !font-[300] normal-case"
        >
          Tobias Stoulil
        </span>
      </p>

      {/* <div className="icon absolute top-[18px] left-[0.5rem]">
        <img
          style={{ opacity: 0 }}
          className="select-none object-cover cursor-pointer scale-[0.375] hover:scale-[0.4] transition-all"
          src="/images/suzanne-icon.png"
          alt="suzanne-icon"
        />

 
      </div> */}

      <div
        style={{ opacity: 0 }}
        onClick={() => setIsPlaying(!isPlaying)}
        className="z-50 cursor-pointer icon absolute top-[40px] left-[2.25rem] h-5 w-5"
      >
        <SoundSvg isPlaying={isPlaying} />
        <div className="absolute left-0 top-0 h-full w-[5%] bg-white/40"></div>
        <div className="absolute right-0 top-0 h-full w-[5%]  bg-white/40"></div>
      </div>

      <div className="absolute pl-[1.5rem] sm:pl-[2.25rem] h-[150px] pr-[1.5rem] sm:pr-[2.25rem] bottom-6 w-full flex flex-row justify-between items-center font-main">
        <div className="counter h-full flex items-end">
          <p
            ref={counterRef}
            style={{ opacity: 0 }}
            className="pointer-events-auto text-[#3d3d3d] text-[0.875rem] sm:text-[1rem] !font-[500] normal-case mt-7"
          >
            0/3
          </p>
        </div>

        <div className="message w-[260px] md:w-[320px] h-full flex flex-col items-start justify-end font-main">
          <p
            style={{ opacity: 0 }}
            className="pointer-events-auto !font-[300] normal-case
        text-[#969696] text-[0.875rem] sm:text-[1rem] leading-[1.375] tracking-[-0.02em]
        "
          >
            Use the{" "}
            <span className="!font-[500] text-[#3d3d3d] uppercase"> WASD </span>{" "}
            keys to move,{" "}
            <span className="!font-[500] text-[#3d3d3d] uppercase">
              {" "}
              SHIFT{" "}
            </span>{" "}
            to run, and{" "}
            <span className="!font-[500]  text-[#3d3d3d] uppercase">
              {" "}
              SPACE{" "}
            </span>
            to jump. Help Suzanne{" "}
            <span className="!font-[500] text-[#3d3d3d] uppercase">
              {" "}
              search{" "}
            </span>{" "}
            for the missing color hints. Have fun, explore the world, but
            beware:{" "}
            <span className="!font-[500] text-[#3d3d3d] uppercase">
              obstacles
            </span>{" "}
            may stand in your way!
          </p>
        </div>
      </div>

      {/* <div className="icon absolute bottom-[85px] right-[2.375rem]">
        <img
          style={{ opacity: 0.625, transformOrigin: "center right" }}
          className="select-none pointer-events-none cursor-pointer scale-[0.3]"
          src="/images/arrow-icon.png"
          alt="arrow-icon"
        />
      </div> */}

      <button
        ref={finalButtonRef}
        style={{ opacity: 0 }}
        className="pointer-events-none finalButton z-[1] absolute top-[40px] left-[5.25rem] text-[#3d3d3d] text-[0.875rem] !font-[600] uppercase
        "
      >
        Congratulations you found all the missing peaces
      </button>
    </div>
  );
};

export default HomePage;
