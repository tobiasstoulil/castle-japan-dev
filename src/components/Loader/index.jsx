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
        delay: 7,
        onComplete: () => {
          handleScopeAnim();
          loaderRef.current.remove();
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
    const tl = gsap.timeline({
      defaults: { ease: "hop" },
    });

    tl.to(
      ".paragraph",
      {
        opacity: 1,
        duration: 1,
      },
      0.75
    );
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed z-20 inset-0 h-[100svh] w-full flex justify-center items-center bg-white"
    >
      <div className="h-full w-full flex flex-col justify-center items-center font-main !font-[300]">
        <div
          style={{ willChange: "opacity", opacity: 0 }}
          className="relative paragraph w-[300px] md:w-[600px]"
        >
          <p className="text-[#969696] text-[0.875rem] sm:text-lg leading-[1.375] tracking-[-0.02em] normal-case">
            Welcome to
            <span className="!font-[500] text-[#3d3d3d] uppercase">
              {" "}
              Castle Color Valley{" "}
            </span>
            where colors are
            <span className="!font-[500] text-[#3d3d3d] uppercase"> quiet</span>
            . Even the king sleeps, but his queen,
            <span className="!font-[500] text-[#3d3d3d] uppercase">
              {" "}
              Suzanne
            </span>
            ? Never. She adores colors.
            <span className="!font-[500] text-[#3d3d3d] uppercase">
              {" "}
              Help{" "}
            </span>{" "}
            her before the colors
            <span className="!font-[500] text-[#3d3d3d] uppercase">
              {" "}
              vanish{" "}
            </span>{" "}
            forever. Good luck, color hero.
          </p>
        </div>
      </div>

      <div
        ref={sideLoaderRef}
        style={{ willChange: "transform", transform: "translateY(-100%)" }}
        className="absolute right-0 top-0 h-full w-[8px] bg-[#3d3d3d]"
      ></div>
    </div>
  );
};

export default Index;
