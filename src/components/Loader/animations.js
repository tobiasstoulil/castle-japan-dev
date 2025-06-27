import gsap from "gsap";
import useStats from "../../stores/useStats";

import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

CustomEase.create("myEase", "M0,0 C0.2,0.5 0.3,1 1,1");

export const exitAnimation = (loaderContainer, logoRef, type = "else") => {
  const handleScopeAnim = useStats.getState().handleScopeAnim;

  const tl = gsap.timeline({
    delay: 0.5,
    onComplete: () => {
      loaderContainer.current.remove();
    },
  });

  tl.to(
    logoRef.current,
    {
      duration: 0.5,
      opacity: 0,
      ease: "myEase",
      onStart: () => {
        handleScopeAnim();
      },
    },
    "<+0.5"
  );

  if (type === "g") {
    // tl.to(
    //   loaderContainer.current,
    //   {
    //     duration: 2,
    //     ease: "power3.inOut",
    //     clipPath:
    //       "polygon(0% 100%, 100% 100%, 100% 92.5%, 0% 92.5%, 0% 0%, 100% 0%, 100% 7.5%, 0% 7.5%)",
    //     onStart: () => {
    //       handleScopeAnim();
    //     },
    //   },
    //   ">+0.25"
    // );
    // tl.to(
    //   loaderContainer.current,
    //   {
    //     duration: 1.5,
    //     ease: "power3.inOut",
    //     clipPath:
    //       "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%, 0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    //   },
    //   ">"
    // );
  } else {
    tl.to(
      loaderContainer.current,
      {
        duration: 1,
        ease: "power3.inOut",
        opacity: 0,
      },
      ">+0.25"
    );
  }
};
