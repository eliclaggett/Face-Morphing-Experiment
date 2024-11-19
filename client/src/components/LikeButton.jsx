import React, { useEffect, useState } from "react";
import { Button } from "@mui/joy";
import { ThumbUpAlt } from "@mui/icons-material";
import "./LikeButton.css";
import TimerMixin from "react-timer-mixin";

export default function LikeButton({ setHolding, name }) {
  const [likeClass, setLikeClass] = useState("likeBtnContainer");
  const [heldStartTime, setHeldStartTime] = useState(0);

  useEffect(() => {
    window.animationInterval = null;
    window.animationStep = 1;
  }, []);

  function handleMouseDown(e) {
    setHolding(name, -1);
    setHeldStartTime(new Date());
    if (window.animationInterval)
      TimerMixin.clearInterval(window.animationInterval);

    window.animationInterval = TimerMixin.setInterval(() => {
      if (window.animationStep == 150) {
        setLikeClass("likeBtnContainer held");
      }
      if (window.animationStep < 150) window.animationStep += 1;
    }, 20);
  }

  function handleMouseUp(e) {
    let diff = new Date() - heldStartTime;
    setHolding(name, diff);
    if (window.animationInterval)
      TimerMixin.clearInterval(window.animationInterval);
    window.animationStep = 1;
    setLikeClass("likeBtnContainer");
  }

  return (
    <div className={likeClass}>
      <Button
        startDecorator={<ThumbUpAlt />}
        className="likeBtn"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        Like
      </Button>
    </div>
  );
}
