import { useEffect, useRef, useMemo, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { TextPlugin } from "gsap/TextPlugin";

import assets from "../../assets/index";
import useStats from "../../stores/useStats";
import { useGSAP } from "@gsap/react";
import { useProgress } from "@react-three/drei";

gsap.registerPlugin(CustomEase);
gsap.registerPlugin(TextPlugin);

CustomEase.create("hop", "0.8, 0., 0.3, 1.");

const Index = () => {
  // console.log("loader r");

  const images = useMemo(
    () => assets.find((asset) => asset.name === "images").items,
    []
  );

  const handleScopeAnim = useStats.getState().handleScopeAnim;

  const progressRef = useRef(null);
  const loaderRef = useRef(null);
  const imageRef = useRef(null);

  const [progres, setProgres] = useState(0);

  const tl = useRef(null);

  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100) {
      setProgres(100);
    }
  }, [progress]);

  useGSAP(() => {
    let index = 1;

    tl.current = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.1,
      delay: 0.75,
      defaults: { ease: "hop" },
    });

    tl.current.to(
      imageRef.current,
      {
        opacity: 1,
        duration: 1,
      },
      0
    );
    tl.current.to(
      imageRef.current,
      {
        opacity: 0,
        duration: 1,
        delay: 0.1,

        onComplete: () => {
          imageRef.current.src = images[index];
          index = (index + 1) % images.length;
        },
      },
      ">"
    );
  }, []);

  useEffect(() => {
    // console.log(progressRef.current.textContent);

    // if (progressRef.current.textContent < 27) {
    //   gsap.to(progressRef.current, {
    //     text: "27",
    //     delay: 0.125,
    //     ease: "none",
    //   });
    // } else if (progressRef.current.textContent < 43) {
    //   gsap.to(progressRef.current, {
    //     text: "43",
    //     delay: 0.375,
    //     ease: "none",
    //   });
    // } else if (progressRef.current.textContent < 79) {
    //   gsap.to(progressRef.current, {
    //     text: "79",
    //     delay: 0.875,
    //     ease: "none",
    //   });
    // }

    if (progres === 100) {
      // gsap.to(progressRef.current, {
      //   text: "100",
      //   duration: 0,
      //   delay: 1.525,
      //   ease: "none",
      // });
      gsap.delayedCall(4, () => {
        // gsap.to(progressRef.current, {
        //   opacity: 0,
        //   duration: 1,
        //   delay: 0.75,
        //   ease: "power3.inOut",
        // });
        tl.current.pause();
        gsap.to(imageRef.current, {
          opacity: 0,
          duration: 1,
          delay: 0.75,
          ease: "hop",
          onStart: () => {
            gsap.set(".paragraph .line span", { y: "-100%" });

            gsap.delayedCall(0.75, () => {
              handleScopeAnim();
            });
          },
        });

        gsap.to(loaderRef.current, {
          opacity: 0,
          duration: 1,
          delay: 1.9,
          ease: "hop",

          onComplete: () => {
            gsap.delayedCall(1, () => {
              loaderRef.current.remove();
            });
          },
        });
      });
    }
  }, [progres]);

  return (
    <div
      ref={loaderRef}
      // style={{ opacity: 0.98 }}
      className="fixed z-10 inset-0 h-[100svh] w-full flex justify-center items-center bg-white"
    >
      <div className="relative h-[270px] sm:h-[320px] md:h-[430px] w-[315px] sm:w-[370px] md:w-[480px] flex overflow-hidden">
        <img
          ref={imageRef}
          style={{ opacity: 0 }}
          src={images[0]}
          alt="loader painting"
          className="select-none w-full h-full object-cover"
        />
        <div
          className="z-50 absolute inset-0 h-full w-full
         bg-gradient-to-r from-white/95 via-white/5 to-white/95 "
        ></div>
        <div
          className="z-50  absolute inset-0 h-full w-full
          bg-gradient-to-b from-white/95 via-white/5 to-white/95"
        ></div>
      </div>

      {/* <div className="box pointer-events-none absolute right-0 sm:right-10 bottom-0 sm:bottom-4 scale-75 sm:scale-90">
        <p
          ref={progressRef}
          className="progress inline-block font-main text-black/10 !font-[500] text-[8rem] antialiased select-none"
        >
          0
        </p>
      </div> */}
    </div>
  );
};

export default Index;
