/*
 * Filename: VideoRanking.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file displays a custom video conferencing application with facial manipulations.
 */

// Imports
import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormLabel,
  LinearProgress,
  RadioGroup,
  Sheet,
  Stack,
  Textarea,
  Typography,
} from "@mui/joy";
import { ThumbDownAlt, ThumbUpAlt } from "@mui/icons-material";
import LikertQuestion from "../components/LikertQuestion.jsx";
import { usePlayer } from "@empirica/core/player/classic/react";
import { wsSend } from "../utils/utils.js";

import P1 from "../assets/stills/positive/d9e1f5a5-e4eb-43df-910b-d9ae2befb039_0.jpg";
import P2 from "../assets/stills/positive/d9e1f5a5-e4eb-43df-910b-d9ae2befb039_1.jpg";
import P3 from "../assets/stills/positive/1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6_0.jpg";
import P4 from "../assets/stills/positive/1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6_1.jpg";
import P5 from "../assets/stills/positive/65ef52f0-93a4-435c-ae13-ab502aa60bd7_0.jpg";
import P6 from "../assets/stills/positive/65ef52f0-93a4-435c-ae13-ab502aa60bd7_1.jpg";
import P7 from "../assets/stills/positive/ac78bc80-4f3a-481a-91e6-213bc427c0b3_0.jpg";
import P8 from "../assets/stills/positive/ac78bc80-4f3a-481a-91e6-213bc427c0b3_1.jpg";
import P9 from "../assets/stills/positive/5348de6b-afa5-4c36-8087-cd3bf94eedfd_0.jpg";
import P10 from "../assets/stills/positive/5348de6b-afa5-4c36-8087-cd3bf94eedfd_1.jpg";
import P11 from "../assets/stills/positive/ddbd8c9d-1dc5-45ae-b8e4-7a5d1e266748_0.jpg";
import P12 from "../assets/stills/positive/ddbd8c9d-1dc5-45ae-b8e4-7a5d1e266748_1.jpg";
import P13 from "../assets/stills/positive/718d778c-d62e-463a-97cd-d6d3550d19a3_0.jpg";
import P14 from "../assets/stills/positive/718d778c-d62e-463a-97cd-d6d3550d19a3_1.jpg";
import P15 from "../assets/stills/positive/fcb7689a-5614-475c-9ea8-493fbe045499_0.jpg";
import P16 from "../assets/stills/positive/fcb7689a-5614-475c-9ea8-493fbe045499_1.jpg";

import N1 from "../assets/stills/neutral/a373174c-cade-4c7f-a3d6-7309f225f37d_0.jpg";
import N2 from "../assets/stills/neutral/a373174c-cade-4c7f-a3d6-7309f225f37d_1.jpg";
import N3 from "../assets/stills/neutral/ff6acf35-cfce-4d87-b04e-2bf91f1926ba_0.jpg";
import N4 from "../assets/stills/neutral/ff6acf35-cfce-4d87-b04e-2bf91f1926ba_1.jpg";
import N5 from "../assets/stills/neutral/94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e_0.jpg";
import N6 from "../assets/stills/neutral/94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e_1.jpg";
import N7 from "../assets/stills/neutral/43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d_0.jpg";
import N8 from "../assets/stills/neutral/43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d_1.jpg";
import N9 from "../assets/stills/neutral/e14e94f7-2550-4f38-b9ba-ebe4958e0512_0.jpg";
import N10 from "../assets/stills/neutral/e14e94f7-2550-4f38-b9ba-ebe4958e0512_1.jpg";
import N11 from "../assets/stills/neutral/3504e22c-1e69-4e99-928b-f8541539d888_0.jpg";
import N12 from "../assets/stills/neutral/3504e22c-1e69-4e99-928b-f8541539d888_1.jpg";
import N13 from "../assets/stills/neutral/2d8791a3-3ad0-4011-bdc1-2dde05ebcba2_0.jpg";
import N14 from "../assets/stills/neutral/2d8791a3-3ad0-4011-bdc1-2dde05ebcba2_1.jpg";
import N15 from "../assets/stills/neutral/9a54607c-02a3-48c6-ad11-02a5e27812de_0.jpg";
import N16 from "../assets/stills/neutral/9a54607c-02a3-48c6-ad11-02a5e27812de_1.jpg";

const stillMap = [
  ["positive/d9e1f5a5-e4eb-43df-910b-d9ae2befb039_0", P1],
  ["positive/d9e1f5a5-e4eb-43df-910b-d9ae2befb039_1", P2],
  ["positive/1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6_0", P3],
  ["positive/1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6_1", P4],
  ["positive/65ef52f0-93a4-435c-ae13-ab502aa60bd7_0", P5],
  ["positive/65ef52f0-93a4-435c-ae13-ab502aa60bd7_1", P6],
  ["positive/ac78bc80-4f3a-481a-91e6-213bc427c0b3_0", P7],
  ["positive/ac78bc80-4f3a-481a-91e6-213bc427c0b3_1", P8],
  ["positive/5348de6b-afa5-4c36-8087-cd3bf94eedfd_0", P9],
  ["positive/5348de6b-afa5-4c36-8087-cd3bf94eedfd_1", P10],
  ["positive/ddbd8c9d-1dc5-45ae-b8e4-7a5d1e266748_0", P11],
  ["positive/ddbd8c9d-1dc5-45ae-b8e4-7a5d1e266748_1", P12],
  ["positive/718d778c-d62e-463a-97cd-d6d3550d19a3_0", P13],
  ["positive/718d778c-d62e-463a-97cd-d6d3550d19a3_1", P14],
  ["positive/fcb7689a-5614-475c-9ea8-493fbe045499_0", P15],
  ["positive/fcb7689a-5614-475c-9ea8-493fbe045499_1", P16],

  ["neutral/a373174c-cade-4c7f-a3d6-7309f225f37d_0", N1],
  ["neutral/a373174c-cade-4c7f-a3d6-7309f225f37d_1", N2],
  ["neutral/ff6acf35-cfce-4d87-b04e-2bf91f1926ba_0", N3],
  ["neutral/ff6acf35-cfce-4d87-b04e-2bf91f1926ba_1", N4],
  ["neutral/94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e_0", N5],
  ["neutral/94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e_1", N6],
  ["neutral/43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d_0", N7],
  ["neutral/43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d_1", N8],
  ["neutral/e14e94f7-2550-4f38-b9ba-ebe4958e0512_0", N9],
  ["neutral/e14e94f7-2550-4f38-b9ba-ebe4958e0512_1", N10],
  ["neutral/3504e22c-1e69-4e99-928b-f8541539d888_0", N11],
  ["neutral/3504e22c-1e69-4e99-928b-f8541539d888_1", N12],
  ["neutral/2d8791a3-3ad0-4011-bdc1-2dde05ebcba2_0", N13],
  ["neutral/2d8791a3-3ad0-4011-bdc1-2dde05ebcba2_1", N14],
  ["neutral/9a54607c-02a3-48c6-ad11-02a5e27812de_0", N15],
  ["neutral/9a54607c-02a3-48c6-ad11-02a5e27812de_1", N16],
];

export default function VideoRanking({ next }) {
  const player = usePlayer();

  const gameParams = player.get("gameParams");
  const videoReactions = player.get("videoReactions");
  const randomizedVideos = player.get("randomizedVideos") || [];
  const randomizedDisplayLR = player.get("randomizedDisplayLR");
  const recognizedPeople = player.get("recognizedPeople") || [];
  const surveyStep = player.get("surveyStep") || 2;
  const btnTxt = surveyStep == 1 ? "Next" : "Next";
  const vectorDistances = player.get("vectorDistances");
  const mostLikedPersonID = player.get("mostLikedPersonID") || false;
  const mostDislikedPersonID = player.get("mostDislikedPersonID") || false;
  const trialDt = player.get('trialDt');

  let mostLikedPerson = null;
  let mostDislikedPerson = null;

  let maxStats = -101;
  let minStats = 101;
  let maxLike = 0;
  let maxDislike = 0;
  let minLike = 0;
  let minDislike = 0;

  let maxVideos = [];
  let minVideos = [];

  let maxIdx = 0;
  let minIdx = 0;

  window.nlpServer.onmessage = (msg) => {
    const data = JSON.parse(msg.data);

    if (data.distance) {
      player.set("vectorDistances", [...vectorDistances, data.distance]);
    }
  };

  if (!mostLikedPersonID) {
    for (const video of videoReactions) {
      const leftStats = video.leftLikeAmt - video.leftDislikeAmt;
      const rightStats = video.rightLikeAmt - video.rightDislikeAmt;
      let currentPerson = null;

      if (leftStats >= maxStats) {
        currentPerson =
          randomizedVideos[video.videoIdx].slice(0, -4) +
          "_" +
          randomizedDisplayLR[video.videoIdx];

        if (leftStats == maxStats) {
          maxVideos.push(currentPerson);
        } else {
          maxVideos = [currentPerson];
        }

        maxStats = leftStats;
      }
      if (rightStats >= maxStats) {
        currentPerson =
          randomizedVideos[video.videoIdx].slice(0, -4) +
          "_" +
          (1 - randomizedDisplayLR[video.videoIdx]);

        if (rightStats == maxStats) {
          maxVideos.push(currentPerson);
        } else {
          maxVideos = [currentPerson];
        }

        maxStats = rightStats;
      }

      if (leftStats <= minStats) {
        currentPerson =
          randomizedVideos[video.videoIdx].slice(0, -4) +
          "_" +
          randomizedDisplayLR[video.videoIdx];

        if (leftStats == minStats) {
          minVideos.push(currentPerson);
        } else {
          minVideos = [currentPerson];
        }

        minStats = leftStats;
      }
      if (rightStats <= minStats) {
        currentPerson =
          randomizedVideos[video.videoIdx].slice(0, -4) +
          "_" +
          (1 - randomizedDisplayLR[video.videoIdx]);

        if (rightStats == minStats) {
          minVideos.push(currentPerson);
        } else {
          minVideos = [currentPerson];
        }

        minStats = rightStats;
      }
    }

    maxIdx = Math.floor(Math.random() * maxVideos.length);
    minIdx = Math.floor(Math.random() * minVideos.length);
  }

  let calcMostLikedPersonID = mostLikedPersonID
    ? mostLikedPersonID
    : maxVideos[maxIdx];
  let calcMostDislikedPersonID = mostDislikedPersonID
    ? mostDislikedPersonID
    : minVideos[minIdx];

  for (const video of videoReactions) {
    let leftDisplayedPerson =
      randomizedVideos[video.videoIdx].slice(0, -4) +
      "_" +
      randomizedDisplayLR[video.videoIdx];
    let rightDisplayedPerson =
      randomizedVideos[video.videoIdx].slice(0, -4) +
      "_" +
      (1 - randomizedDisplayLR[video.videoIdx]);

    if (leftDisplayedPerson == calcMostLikedPersonID) {
      maxLike = Math.min(video.leftLikeAmt, 100);
      maxDislike = Math.min(video.leftDislikeAmt, 100);
    }
    if (leftDisplayedPerson == calcMostDislikedPersonID) {
      minLike = Math.min(video.leftLikeAmt, 100);
      minDislike = Math.min(video.leftDislikeAmt, 100);
    }
    if (rightDisplayedPerson == calcMostLikedPersonID) {
      maxLike = Math.min(video.rightLikeAmt, 100);
      maxDislike = Math.min(video.rightDislikeAmt, 100);
    }
    if (rightDisplayedPerson == calcMostDislikedPersonID) {
      minLike = Math.min(video.rightLikeAmt, 100);
      minDislike = Math.min(video.rightDislikeAmt, 100);
    }
  }

  if (!mostLikedPersonID) {
    player.set("mostLikedPersonID", calcMostLikedPersonID);
    player.set("mostDislikedPersonID", calcMostDislikedPersonID);
  }

  for (const pair of stillMap) {
    if (pair[0] == calcMostLikedPersonID) mostLikedPerson = pair[1];
    if (pair[0] == calcMostDislikedPersonID) mostDislikedPerson = pair[1];
  }
  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);

  const leftoverIndices = player.get("leftoverIndices");
  const randomizedSeenIndices = player.get("randomizedSeenIndices");
  const correctlyRecognized = [];

  useEffect(() => {
    wsSend(JSON.stringify({ command: "getLastVectorDistance", trialDt: trialDt }));
  }, []);

  let leftoverIdx = 0;
  let seenIdx = 0;

  // Loop through people
  const stills = new Array(32);
  for (let i = 0; i < 32; i++) {
    // Place person in index depending on if they've been watched
    const person = gameParams["stillMapTxt"][i];
    const video = person.slice(0, -2) + ".mp4";
    if (randomizedVideos.indexOf(video) != -1) {
      // Get index that this person should be
      // Watched
      const personIdx = randomizedSeenIndices[seenIdx++];
      stills[personIdx] = stillMap[i][1];
    } else {
      // Not watched
      // Get index that this person should be
      const personIdx = leftoverIndices[leftoverIdx++];
      if (personIdx < 32) {
        stills[personIdx] = stillMap[i][1];
      }
    }
  }

  const handleNext = () => {
    if (surveyStep == 2) {
      wsSend(JSON.stringify({ command: "stopRecording", trialDt: trialDt }));
      player.set("surveyAnswers", {
        likedPersonalReason: likedPersonal,
        likedGeneralReason: likedGeneral,
        likedAppearance: likedAppearanceChange,
        likedInteractionStyle: likedStyleChange,
        dislikedPersonalReason: dislikedPersonal,
        dislikedGeneralReason: dislikedGeneral,
        dislikedAppearance: dislikedAppearanceChange,
        dislikedInteractionStyle: dislikedStyleChange,
      });
      player.set("studyStep", "debrief");
      return;
    }
    player.set("surveyStep", surveyStep + 1);
    document.querySelectorAll("div").forEach((el) => (el.scrollTop = 0));
  };

  const handleRecognized = (el, num) => {
    const recallList = [...recognizedPeople];
    if (el.classList.contains("checked")) {
      player.set("recognizedPeople", [...recallList, num]);
    } else {
      const idx = recallList.indexOf(num);
      recallList.splice(idx, 1);
      player.set("recognizedPeople", recallList);
    }
  };

  let stepUI = (
    <>
      <Stack width="100vw">
        <Typography level="title-lg" sx={{ fontSize: "2.5em" }}>
          Reflection Survey
        </Typography>
        <Typography level="body-md">
          Thank you for watching these videos. Please complete this short survey
          before submitting the study (1/2).
        </Typography>
        <Typography level="title-lg" sx={{ fontSize: "2em", pt: 6 }}>
          1)&emsp;Which of these individuals do you remember?
        </Typography>
        <Typography level="body-md" sx={{ pt: 0 }}>
          <span style={{ fontSize: "2em", opacity: 0 }}>1) &emsp;</span>Please
          select all of the individuals you remember watching in the previous
          step of the study.
        </Typography>
      </Stack>

      <FormControl sx={{ width: "100%" }}>
        <RadioGroup
          overlay
          name="member"
          defaultValue="person1"
          orientation="horizontal"
          sx={{
            display: "grid",
            width: "100%",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: 2,
          }}
        >
          {[...Array(32).keys()].map((num) => (
            <Sheet
              component="label"
              key={num}
              variant="outlined"
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                boxShadow: "sm",
                borderRadius: "md",
                gap: 2,
              }}
            >
              <Avatar
                alt={`Person${num}`}
                src={stills[num]}
                className="recallAvatar"
              />
              <Checkbox
                label={`person${num}`}
                variant="soft"
                overlay
                onChange={(ev) => {
                  ev.target
                    .closest(".MuiSheet-root")
                    .classList.toggle("checked");
                  handleRecognized(ev.target.closest(".MuiSheet-root"), num);
                }}
              />
            </Sheet>
          ))}
        </RadioGroup>
      </FormControl>
    </>
  );

  const [likedPersonal, setLikedPersonalChange] = useState("");
  const [likedGeneral, setLikedGeneralChange] = useState("");
  const [dislikedPersonal, setDislikedPersonalChange] = useState("");
  const [dislikedGeneral, setDislikedGeneralChange] = useState("");

  const [likedAppearanceChange, setLikedAppearanceChange] = useState();
  const [likedStyleChange, setLikedStyleChange] = useState();
  const [dislikedAppearanceChange, setDislikedAppearanceChange] = useState();
  const [dislikedStyleChange, setDislikedStyleChange] = useState();

  const handleLikedAppearanceChange = (e) =>
    setLikedAppearanceChange(e.target.value);
  const handleLikedStyleChange = (e) => setLikedStyleChange(e.target.value);
  const handleDislikedAppearanceChange = (e) =>
    setDislikedAppearanceChange(e.target.value);
  const handleDislikedStyleChange = (e) =>
    setDislikedStyleChange(e.target.value);

  const handleLikedPersonalChange = (e) =>
    setLikedPersonalChange(e.target.value);
  const handleLikedGeneralChange = (e) => setLikedGeneralChange(e.target.value);
  const handleDislikedPersonalChange = (e) =>
    setDislikedPersonalChange(e.target.value);
  const handleDislikedGeneralChange = (e) =>
    setDislikedGeneralChange(e.target.value);

  if (surveyStep == 2) {
    stepUI = (
      <>
        <Stack width="100%">
          <Typography level="title-lg" sx={{ fontSize: "2.5em" }}>
            Reflection Survey
          </Typography>
          <Typography level="body-md">
            Thank you for watching these videos. Please complete this short
            survey before submitting the study (2/2).
          </Typography>
          <Typography level="title-lg" sx={{ fontSize: "2em", pt: 6 }}>
            2)&emsp;Review your ratings
          </Typography>
          <Typography level="body-md" sx={{ ml: 8.4 }}>
            Please describe how you rated your top and bottom choices.
          </Typography>
        </Stack>
        <Stack direction={"row"} sx={{ width: "100%", mb: "-3em" }}>
          <div className="likeLine"></div>
          <Typography level="title-lg" className="likedHeader">
            Most-liked individual
          </Typography>
        </Stack>
        <Stack
          sx={{
            width: "100%",
            flex: 1,
            gap: 2,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
          direction={"row"}
        >
          <Card
            variant="outlined"
            className="reviewCard"
            sx={{ width: "15em" }}
          >
            <CardContent>
              <Avatar src={mostLikedPerson} />
              <Stack className="horizontalRatings">
                <div className="singleBar">
                  <ThumbUpAlt />
                  <LinearProgress
                    determinate={true}
                    value={maxLike}
                    className="likeLinear"
                  />
                  <span>+{maxLike.toFixed(0)}%</span>
                </div>
                <div className="singleBar">
                  <ThumbDownAlt />
                  <LinearProgress
                    determinate={true}
                    value={maxDislike}
                    className="dislikeLinear"
                  />
                  <span></span>
                </div>
              </Stack>
            </CardContent>
          </Card>
          <Stack
            width="calc(100% - 16em);"
            gap={4}
            sx={{ position: "relative" }}
          >
            <FormControl>
              <FormLabel>
                How did you feel while watching this individual?
              </FormLabel>
              <Textarea
                minRows={4}
                value={likedPersonal}
                onChange={handleLikedPersonalChange}
                placeholder="Type answer here"
              />
            </FormControl>
            <FormControl>
              <FormLabel>
                In general, what gave you a positive impression of the
                individuals you saw?
              </FormLabel>
              <Textarea
                minRows={4}
                value={likedGeneral}
                onChange={handleLikedGeneralChange}
                placeholder="Type answer here"
              />
            </FormControl>
            <FormControl>
              <FormLabel>
                How did{" "}
                <span
                  style={{ textDecoration: "underline", padding: "0 0.1em" }}
                >
                  appearance
                </span>{" "}
                affect your judgment of the individuals you liked?
              </FormLabel>
              <LikertQuestion
                name="likedAppearance"
                prompt=""
                onChange={handleLikedAppearanceChange}
                value={likedAppearanceChange}
                type="strength"
              />
            </FormControl>
            <FormControl>
              <FormLabel>
                How did{" "}
                <span
                  style={{ textDecoration: "underline", padding: "0 0.1em" }}
                >
                  interaction style
                </span>{" "}
                affect your judgment of the individuals you liked?
              </FormLabel>
              <LikertQuestion
                name="likedStyle"
                prompt=""
                onChange={handleLikedStyleChange}
                value={likedStyleChange}
                type="strength"
              />
            </FormControl>
          </Stack>
          <Stack
            direction={"row"}
            sx={{ width: "100%", mb: "-1em", mt: "2em" }}
          >
            <div className="likeLine"></div>
            <Typography level="title-lg" className="likedHeader disliked">
              Most-disliked individual
            </Typography>
          </Stack>

          <Card
            variant="outlined"
            className="reviewCard"
            sx={{ width: "15em" }}
          >
            <CardContent>
              <Avatar alt="" src={mostDislikedPerson} />
              <Stack className="horizontalRatings">
                <div className="singleBar">
                  <ThumbUpAlt />
                  <LinearProgress
                    determinate={true}
                    value={minLike}
                    className="likeLinear"
                  />
                  <span></span>
                </div>
                <div className="singleBar">
                  <ThumbDownAlt />
                  <LinearProgress
                    determinate={true}
                    value={minDislike}
                    className="dislikeLinear"
                  />
                  <span>-{minDislike.toFixed(0)}%</span>
                </div>
              </Stack>
            </CardContent>
          </Card>
          <Stack
            width="calc(100% - 16em);"
            gap={4}
            sx={{ position: "relative" }}
          >
            <FormControl>
              <FormLabel>How did you feel watching this individual?</FormLabel>
              <Textarea
                minRows={4}
                value={dislikedPersonal}
                onChange={handleDislikedPersonalChange}
                placeholder="Type answer here"
              />
            </FormControl>
            <FormControl>
              <FormLabel>
                In general, what gave you a negative impression of the
                individuals you saw?
              </FormLabel>
              <Textarea
                minRows={4}
                value={dislikedGeneral}
                onChange={handleDislikedGeneralChange}
                placeholder="Type answer here"
              />
            </FormControl>
            <FormControl>
              <FormLabel>
                How did{" "}
                <span
                  style={{ textDecoration: "underline", padding: "0 0.1em" }}
                >
                  appearance
                </span>{" "}
                affect your judgment of the individuals you disliked?
              </FormLabel>
              <LikertQuestion
                name="dislikedAppearance"
                prompt=""
                onChange={handleDislikedAppearanceChange}
                value={dislikedAppearanceChange}
                type="strength"
              />
            </FormControl>
            <FormControl>
              <FormLabel>
                How did{" "}
                <span
                  style={{ textDecoration: "underline", padding: "0 0.1em" }}
                >
                  interaction style
                </span>{" "}
                affect your judgment of the individuals you disliked?
              </FormLabel>
              <LikertQuestion
                name="dislikedStyle"
                prompt=""
                onChange={handleDislikedStyleChange}
                value={dislikedStyleChange}
                type="strength"
              />
            </FormControl>
          </Stack>
        </Stack>
      </>
    );
  }

  // UI
  return (
    <Stack
      width="100vw"
      sx={{
        pt: 10,
        flexWrap: "wrap",
        maxWidth: "60em",
        mx: "auto",
        boxSizing: "border-box",
      }}
      direction={"row"}
      justifyContent={"center"}
      gap={6}
      className="rankings"
    >
      {stepUI}
      <Stack width="100vw">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            flexDirection: "row",
          }}
        >
          <Button
            sx={{ my: 2, mr: 1 }}
            onClick={handleNext}
            disabled={nextButtonDisabled}
          >
            {btnTxt}
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
}
