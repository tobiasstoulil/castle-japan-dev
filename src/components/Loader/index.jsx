import { useEffect, useRef, useMemo, useState } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { TextPlugin } from "gsap/TextPlugin";

import assets from "../../assets/index";
import useStats from "../../stores/useStats";
import { useGSAP } from "@gsap/react";
import { useProgress } from "@react-three/drei";

import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(CustomEase);

CustomEase.create("hop", "0.8, 0., 0.3, 1.");

const Index = () => {
  // console.log("loader r");

  const handleScopeAnim = useStats.getState().handleScopeAnim;

  const loaderRef = useRef(null);
  const sideLoaderRef = useRef(null);

  const { progress } = useProgress();

  useEffect(() => {
    gsap.to(sideLoaderRef.current, {
      y: 0,
      ease: "hop",
      duration: 5,
    });

    if (progress === 100) {
      gsap.to(loaderRef.current, {
        opacity: 0,
        ease: "hop",
        duration: 1,
        delay: 6,
        onComplete: () => {
          handleScopeAnim();
        },
      });
    }
  }, [progress]);

  const splitTextElements = (selector, type = "lines") => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      const splitText = new SplitText(element, {
        type,
        linesClass: "line",
        // wordsClass: "word",
        // charsClass: "char",
        autoSplit: true,
        onSplit: (self) => {
          console.log("split");

          if (type.includes("lines")) {
            self.lines.forEach((line, index) => {
              const originalText = line.textContent;
              line.innerHTML = `<span>${originalText}</span>`;
            });
          }
          // console.log(`${self.lines} span`);
          self.lines.forEach((line, index) => {
            return gsap.to(line.querySelectorAll("span"), {
              y: "0",
              duration: 1,
              delay: index * 0.075,
            });
          });
        },
      });

      if (type.includes("lines")) {
        splitText.lines.forEach((line, index) => {
          const originalText = line.textContent;
          line.innerHTML = `<span>${originalText}</span>`;
        });
      }
    });
  };

  useEffect(() => {
    splitTextElements(".paragraph p", "lines");

    const tl = gsap.timeline({
      defaults: { ease: "hop" },
    });

    // tl.delay(4);

    // tl.to(
    //   ".paragraph .line span",
    //   {
    //     y: 0,
    //     duration: 1.5,
    //     stagger: 0.1,
    //   },
    //   0.5
    // );

    tl.to(
      ".label p",
      {
        opacity: 1,
        duration: 1,
      },
      1.25
    );
  }, []);

  return (
    <div
      ref={loaderRef}
      className="relative z-10 inset-0 h-[100svh] w-full flex justify-center items-center bg-white"
    >
      <div className="h-full w-full flex flex-col justify-center items-center font-main !font-[500]">
        <div className="relative paragraph w-[625px]">
          <p className="text-black text-lg leading-[1.15]">
            Welcome to Castle Color Valley where colors are quiet. Even the king
            sleeps, but his queen, Suzzane? Never. She is a color hero. She
            adores colors. Help her before the colors might vanish forever. Good
            luck, color hero.
          </p>
        </div>

        <div className="label absolute left-1/2 md:left-[7.375rem] xl:left-1/2 -translate-x-1/2 -bottom-0.5 mb-6 sm:mb-6 h-full flex flex-col items-start justify-end font-main ">
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

      <div
        ref={sideLoaderRef}
        style={{ willChange: "transform", transform: "translateY(-100%)" }}
        className="absolute right-0 top-0 h-full w-[8px] bg-black"
      ></div>
    </div>
  );
};

export default Index;
