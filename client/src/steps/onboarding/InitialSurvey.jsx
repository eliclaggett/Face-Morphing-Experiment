/*
 * Filename: GenderForm.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file collects participants' gender during the experiment's onboarding process.
 */

// Imports
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Stack,
  Button,
  FormControl,
  FormLabel,
  Select,
  Option,
  Alert,
} from "@mui/joy";
import { usePlayer } from "@empirica/core/player/classic/react";
import WarningIcon from "@mui/icons-material/Warning";
import LikertQuestion from "../../components/LikertQuestion.jsx";

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

export default function InitialSurvey({ next }) {
  const player = usePlayer();
  const [gender, setGenderVar] = useState(false);

  // Logic to handle interactions with this page
  function setGender(val) {
    setGenderVar(val);
    player.set("gender", val);
  }

  function handleContinue() {
    if (Object.keys(rosenbergValues).length < 10 || gender == false) {
      setErrorDisplay("flex");
    } else {
      player.set("rosenbergSurveyValues", rosenbergValues);
      next();
    }
  }

  function handleRosenbergChange(ev) {
    let tmpRosenbergValues = { ...rosenbergValues };
    tmpRosenbergValues[ev.target.name.slice(-1)] = ev.target.value;
    console.log(Object.keys(tmpRosenbergValues).length);
    setRosenbergValues(tmpRosenbergValues);
  }

  const [rosenbergValues, setRosenbergValues] = useState({});

  const rosenbergSelfEsteemQuestionData = [
    [
      0,
      "I feel that I am a person of worth, at least on an equal plane with others.",
      1,
    ],
    [1, "I feel that I have a number of good qualities.", 1],
    [2, "All in all, I am inclined to feel that I am a failure.", -1],
    [3, "I am able to do things as well as most other people.", 1],
    [4, "I feel I do not have much to be proud of.", -1],
    [5, "I take a positive attitude toward myself.", 1],
    [6, "On the whole, I am satisfied with myself.", 1],
    [7, "I wish I could have more respect for myself.", -1],
    [8, "I certainly feel useless at times.", -1],
    [9, "At times I think I am no good at all.", -1],
  ];
  const [rosenbergSelfEsteemQuestions, setRosenbergSelfEsteemQuestions] =
    useState([]);
  const [errorDisplay, setErrorDisplay] = useState("none");

  useEffect(() => {
    shuffle(rosenbergSelfEsteemQuestionData);
    setRosenbergSelfEsteemQuestions(rosenbergSelfEsteemQuestionData);
  }, []);

  // UI
  return (
    <Container maxWidth="100vw">
      <Stack
        sx={{
          maxWidth: {
            md: "40rem",
          },
          mx: "auto",
          mt: "10vh",
          pb: "10em",
          textAlign: "center",
        }}
        gap={8}
      >
        <Typography level="h1" textAlign="center">
          Preliminary Survey
        </Typography>
        <Typography level="body-md" textAlign="center" sx={{ mt: "-3em" }}>
          Please answer this short survey about yourself before we begin the
          study. (~1&nbsp;min)
        </Typography>
        <FormControl
          sx={{
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <FormLabel
            id="select-field-demo-label"
            htmlFor="select-field-demo-button"
            sx={{ mx: "auto" }}
          >
            What is your gender?
          </FormLabel>
          <Select
            sx={{ maxWidth: "15rem" }}
            onChange={(e, newVal) => {
              setGender(newVal);
            }}
          >
            <Option value="female">Female</Option>
            <Option value="male">Male</Option>
            <Option value="other">Other</Option>
          </Select>
        </FormControl>

        {[...rosenbergSelfEsteemQuestions.keys()].map((idx) => (
          <FormControl className="small">
            <FormLabel sx={{ mx: "auto" }}>
              {rosenbergSelfEsteemQuestions[idx][1]}
            </FormLabel>
            <LikertQuestion
              name={"rosenberg" + rosenbergSelfEsteemQuestions[idx][0]}
              prompt=""
              onChange={handleRosenbergChange}
              value={rosenbergValues[rosenbergSelfEsteemQuestions[idx][0]]}
              type="rosenberg"
            />
          </FormControl>
        ))}

        <Alert
          startDecorator={<WarningIcon />}
          variant="outlined"
          color="danger"
          sx={{ display: errorDisplay }}
        >
          Please answer all survey items.
        </Alert>

        <Button onClick={handleContinue}>Continue</Button>
      </Stack>
    </Container>
  );
}
