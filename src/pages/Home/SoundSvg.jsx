import React, { useEffect } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

const RivePlayer = ({ isPlaying }) => {
  const { rive, RiveComponent } = useRive({
    src: "/images/soundSvgAnim.riv",
    stateMachines: "State Machine",
    autoplay: true,
  });

  const isPlayingInput = useStateMachineInput(
    rive,
    "State Machine",
    "isPlaying"
  );

  useEffect(() => {
    if (isPlayingInput) {
      isPlayingInput.value = isPlaying;
    }
  }, [isPlaying, isPlayingInput]);

  return (
    <div className="w-full h-full">
      <RiveComponent />
    </div>
  );
};

export default RivePlayer;
