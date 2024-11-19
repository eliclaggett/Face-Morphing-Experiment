import React, { useEffect } from "react";
import { Container } from "@mui/joy";
import { ThumbDownRounded, ThumbUpRounded } from "@mui/icons-material";

export default function FeedbackButtons({}) {
  useEffect(() => {
    window.animationInterval = null;
    window.animationStep = 1;
  }, []);

  function handleMouseDown(e) {
    const el = e.target;
    el.classList.add("grow");
    const posEmotion = el.closest(".thumbup_container") ? true : false;
    const direction = el.closest(".leftButtons") ? "left" : "right";
    console.log(posEmotion);

    const leftCanvas = document.getElementById("left-canvas");
    const rightCanvas = document.getElementById("right-canvas");

    const scalar = 5;
    const negShape = confetti.shapeFromText({ text: "😡", scalar });
    const posShape = confetti.shapeFromText({ text: "🤩", scalar });

    leftCanvas.confetti =
      leftCanvas.confetti || confetti.create(leftCanvas, { resize: true });
    rightCanvas.confetti =
      rightCanvas.confetti || confetti.create(rightCanvas, { resize: true });

    if (window.animationInterval) clearInterval(window.animationInterval);

    const canvas = direction == "left" ? leftCanvas : rightCanvas;
    const shape = posEmotion ? posShape : negShape;

    canvas.confetti({
      spread: 70,
      origin: { y: 1.2 },
      shapes: [shape],
      flat: true,
      scalar: scalar,
      particleCount: 5 * window.animationStep,
    });

    window.animationInterval = setInterval(() => {
      canvas.confetti({
        spread: 70,
        origin: { y: 1.2 },
        shapes: [shape],
        flat: true,
        scalar: scalar,
        particleCount: 5 * window.animationStep,
      });
      if (window.animationStep < 8) window.animationStep += 1;
    }, 250);
  }
  function handleMouseUp(e) {
    const el = e.target;
    el.classList.remove("grow");
    if (window.animationInterval) clearInterval(window.animationInterval);
    window.animationStep = 1;
  }

  return (
    <Container
      className="feedback_btns"
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container
        maxWidth="50%"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 2,
        }}
        className="leftButtons"
      >
        <div
          className="thumbdown_container"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <ThumbDownRounded />
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="100%"
            height="100%"
            viewBox="0 0 80 80"
            xmlSpace="preserve"
            className="circleContainer"
          >
            <circle
              transform="rotate(-90 40 40)"
              className="another-circle"
              cx="40"
              cy="40"
              r="36"
              fill="transparent"
              stroke="rgb(246, 76, 76)"
              strokeWidth="4"
            />
          </svg>
        </div>
        <div
          className="thumbup_container"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <ThumbUpRounded />
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="100%"
            height="100%"
            viewBox="0 0 80 80"
            xmlSpace="preserve"
            className="circleContainer"
          >
            <circle
              transform="rotate(-90 40 40)"
              className="another-circle"
              cx="40"
              cy="40"
              r="36"
              fill="transparent"
              stroke="rgb(76, 133, 246)"
              strokeWidth="4"
            />
          </svg>
        </div>
      </Container>
      <Container
        maxWidth="50%"
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <div
          className="thumbdown_container"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <ThumbDownRounded />
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="100%"
            height="100%"
            viewBox="0 0 80 80"
            xmlSpace="preserve"
            className="circleContainer"
          >
            <circle
              transform="rotate(-90 40 40)"
              className="another-circle"
              cx="40"
              cy="40"
              r="36"
              fill="transparent"
              stroke="rgb(246, 76, 76)"
              strokeWidth="4"
            />
          </svg>
        </div>
        <div
          className="thumbup_container"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <ThumbUpRounded />
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="100%"
            height="100%"
            viewBox="0 0 80 80"
            xmlSpace="preserve"
            className="circleContainer"
          >
            <circle
              transform="rotate(-90 40 40)"
              className="another-circle"
              cx="40"
              cy="40"
              r="36"
              fill="transparent"
              stroke="rgb(76, 133, 246);"
              strokeWidth="4"
            />
          </svg>
        </div>
      </Container>
    </Container>
  );
}
