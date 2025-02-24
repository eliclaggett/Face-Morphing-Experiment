/*
 * Filename: FinalDisclosure.jsx
 * Author: Elijah Claggett
 *
 * Description:
 * This ReactJS file discloses the experiment details and asks for additional consent from experiment participants.
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
  RadioGroup,
  Alert,
} from "@mui/joy";
import { usePlayer } from "@empirica/core/player/classic/react";
import WarningIcon from "@mui/icons-material/Warning";
import LikertButton from "../../components/LikertButton.jsx";
import "./FinalDisclosure.css";

export default function FinalDisclosure({ next }) {
  const [errorDisplay, setErrorDisplay] = useState("none");

  const [recognize, setRecognize] = useState(-1);
  const [consent, setConsent] = useState(-1);
  const [canShow, setCanShow] = useState(-1);

  const player = usePlayer();
  const studyStep = player.get("studyStep");

  // Logic to handle interactions with this page
  function handleClickFinish() {
    if (recognize == -1 || consent == -1 || canShow == -1) {
      setErrorDisplay("flex");
    } else {
      player.set("debriefingResults", {
        recognizedFace: recognize,
        confirmedConsent: consent,
        canShowFace: canShow,
      });
      setErrorDisplay("none");
      player.set("studyStep", "end");
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [studyStep]);

  // UI
  return (
    <Container maxWidth="100vw">
      <Stack
        sx={{
          maxWidth: {
            md: "40rem",
          },
          mx: "auto",
          mt: "15vh",
          textAlign: "center",
          gap: 6,
        }}
        gap={1}
      >
        <Typography level="h1" sx={{ fontSize: "2em" }}>
          Debriefing Statement
        </Typography>

        <Typography
          level="h3"
          sx={{ border: "solid 1px #94681c", p: 5, borderRadius: "0.5em" }}
        >
          Your face was morphed with the faces of some people in the videos you
          watched.
        </Typography>

        <FormControl>
          <FormLabel sx={{ margin: "2em auto" }}>
            Did you recognize your face in the videos you watched?
          </FormLabel>
          <RadioGroup
            overlay
            name={"recognize"}
            orientation="horizontal"
            sx={{ display: "flex", flexDirection: "row", mx: "auto", gap: 2 }}
            onChange={(ev) => setRecognize(ev.target.value)}
          >
            <LikertButton label="Yes" value="1" sx={{ minWidth: "5em" }} />
            <LikertButton label="No" value="0" sx={{ minWidth: "5em" }} />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel sx={{ margin: "0 auto" }}>
            Do you still consent to participate in this study?
          </FormLabel>
          <RadioGroup
            overlay
            name={"consent"}
            orientation="horizontal"
            sx={{ display: "flex", flexDirection: "row", mx: "auto", gap: 2 }}
            onChange={(ev) => setConsent(ev.target.value)}
          >
            <LikertButton label="Yes" value="1" sx={{ minWidth: "5em" }} />
            <LikertButton label="No" value="0" sx={{ minWidth: "5em" }} />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel sx={{ margin: "0 auto" }}>
            May we show the morphed videos you watched to future participants of
            this study?
          </FormLabel>
          <RadioGroup
            overlay
            name={"canShow"}
            orientation="horizontal"
            sx={{ display: "flex", flexDirection: "row", mx: "auto", gap: 2 }}
            onChange={(ev) => setCanShow(ev.target.value)}
          >
            <LikertButton label="Yes" value="1" sx={{ minWidth: "5em" }} />
            <LikertButton label="No" value="0" sx={{ minWidth: "5em" }} />
          </RadioGroup>
        </FormControl>
        <Alert
          startDecorator={<WarningIcon />}
          variant="outlined"
          color="danger"
          sx={{ display: errorDisplay }}
        >
          Please answer all survey items.
        </Alert>
        <Stack
          direction="row"
          gap={2}
          justifyContent={"center"}
          sx={{ pt: 4, pb: 12 }}
        >
          <Button onClick={handleClickFinish}>Finish Study</Button>
        </Stack>
      </Stack>
    </Container>
  );
}
