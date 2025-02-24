/*
 * Filename: callbacks.js
 * Author: Elijah Claggett
 *
 * Description:
 * This JavaScript file serves as the backend for the Empirica experiment, responding to callbacks triggered by the client.
 */

// Imports
import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();
import axios from "axios";
import * as fs from "fs";
import dotenv from "dotenv";
import findConfig from "find-config";
import { AccessToken } from "livekit-server-sdk";

// Load .env variables from either the server or local environment
let dotEnvPath = null;
if (fs.existsSync("/home/ubuntu")) {
  dotEnvPath = findConfig(".env", { cwd: "/home/ubuntu/Code" });
} else if (fs.existsSync("/Users/eclagget/Code/experiment/face-morph")) {
  dotEnvPath = findConfig(".env", {
    cwd: "/Users/eclagget/Code/experiment/face-morph",
  });
}

if (dotEnvPath) {
  console.log("Loading dotenv file!");
  const envFile = dotenv.parse(fs.readFileSync(dotEnvPath));
  for (const key of Object.keys(envFile)) {
    process.env[key] = envFile[key];
  }
} else {
  console.log("Warning: No dotenv file!");
}

// Initialize global variables
const gameParams = {
  version: "November 2024",
  videoLength: 20, // seconds
  numVideos: 8,
  studyPay: 2.4,
  partialPay: 1,
  studyLength: "10 minutes",
  completionCode: "C19BSZ93",
  livekitURL: process.env['LIVEKIT_URL'],
  morphingTarget: 'self',

  videos: {
    positive: [
      "d9e1f5a5-e4eb-43df-910b-d9ae2befb039",
      "1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6",
      "65ef52f0-93a4-435c-ae13-ab502aa60bd7",
      "ac78bc80-4f3a-481a-91e6-213bc427c0b3",
      "5348de6b-afa5-4c36-8087-cd3bf94eedfd",
      "ddbd8c9d-1dc5-45ae-b8e4-7a5d1e266748",
      "718d778c-d62e-463a-97cd-d6d3550d19a3",
      "fcb7689a-5614-475c-9ea8-493fbe045499",
    ],
    neutral: [
      "a373174c-cade-4c7f-a3d6-7309f225f37d",
      "ff6acf35-cfce-4d87-b04e-2bf91f1926ba",
      "94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e",
      "43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d",
      "e14e94f7-2550-4f38-b9ba-ebe4958e0512",
      "3504e22c-1e69-4e99-928b-f8541539d888",
      "2d8791a3-3ad0-4011-bdc1-2dde05ebcba2",
      "9a54607c-02a3-48c6-ad11-02a5e27812de",
    ],
  },
  video_genders: {
    "6e5975cf-1d81-47a0-a487-7cde60912857": ["female", "female"],
    "77f35248-1a74-45ae-b3b2-dfa5433093e3": ["male", "male"],
    "bb271ad2-d89d-4c4c-a8c5-d30ff0e1295a": ["male", "male"],
    "65ef52f0-93a4-435c-ae13-ab502aa60bd7": ["female", "male"],
    "01a62310-06c3-4b69-9d75-50f1e2f1dabf": ["female", "female"],
    "4e458f60-1fa1-4584-aca1-5932319e5ba9": ["male", "male"],
    "d7a96d59-d94f-4e56-b7c4-6e056c561f58": ["female", "female"],
    "100af445-702a-4fbd-8474-ec3d17e9490e": ["female", "female"],
    "ac78bc80-4f3a-481a-91e6-213bc427c0b3": ["male", "female"],
    "e0de7827-7011-4f5a-be33-24e1827b4d2b": ["female", "female"],
    "1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6": ["female", "male"],
    "d9e1f5a5-e4eb-43df-910b-d9ae2befb039": ["female", "male"],
    "ada6c3c4-8c97-4b37-b1e1-a28706a194d5": ["female", "female"],
    "94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e": ["male", "female"],
    "a373174c-cade-4c7f-a3d6-7309f225f37d": ["male", "female"],
    "43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d": ["male", "female"],
    "8b0ecdda-eb47-420e-8a79-a41e64a40b09": ["male", "male"],
    "e14e94f7-2550-4f38-b9ba-ebe4958e0512": ["female", "male"],
    "5ca9b7cd-9c68-4803-8d13-f3e6c7d24f43": ["female", "female"],
    "e0fef00d-2ae2-4c21-8205-8753fc580ec1": ["female", "female"],
    "3271eacf-69b5-4144-8dbe-b596de94ec30": ["male", "male"],
    "0f6c2eb4-5e44-46c7-8ea5-ddb74702beee": ["male", "female"],
    "ff6acf35-cfce-4d87-b04e-2bf91f1926ba": ["male", "female"],
    "1db0a83b-76d3-48f4-b0cd-13d559c67e61": ["female", "male"],

    "5348de6b-afa5-4c36-8087-cd3bf94eedfd": ["female", "male"],
    "ddbd8c9d-1dc5-45ae-b8e4-7a5d1e266748": ["male", "female"],
    "718d778c-d62e-463a-97cd-d6d3550d19a3": ["male", "female"],
    "fcb7689a-5614-475c-9ea8-493fbe045499": ["male", "female"],

    "3504e22c-1e69-4e99-928b-f8541539d888": ["male", "female"],
    "2d8791a3-3ad0-4011-bdc1-2dde05ebcba2": ["male", "female"],
    "9a54607c-02a3-48c6-ad11-02a5e27812de": ["male", "female"],
  },
  stillMapTxt: [
    "positive/d9e1f5a5-e4eb-43df-910b-d9ae2befb039_0",
    "positive/d9e1f5a5-e4eb-43df-910b-d9ae2befb039_1",
    "positive/1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6_0",
    "positive/1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6_1",
    "positive/65ef52f0-93a4-435c-ae13-ab502aa60bd7_0",
    "positive/65ef52f0-93a4-435c-ae13-ab502aa60bd7_1",
    "positive/ac78bc80-4f3a-481a-91e6-213bc427c0b3_0",
    "positive/ac78bc80-4f3a-481a-91e6-213bc427c0b3_1",
    "positive/5348de6b-afa5-4c36-8087-cd3bf94eedfd_0",
    "positive/5348de6b-afa5-4c36-8087-cd3bf94eedfd_1",
    "positive/ddbd8c9d-1dc5-45ae-b8e4-7a5d1e266748_0",
    "positive/ddbd8c9d-1dc5-45ae-b8e4-7a5d1e266748_1",
    "positive/718d778c-d62e-463a-97cd-d6d3550d19a3_0",
    "positive/718d778c-d62e-463a-97cd-d6d3550d19a3_1",
    "positive/fcb7689a-5614-475c-9ea8-493fbe045499_0",
    "positive/fcb7689a-5614-475c-9ea8-493fbe045499_1",

    "neutral/a373174c-cade-4c7f-a3d6-7309f225f37d_0",
    "neutral/a373174c-cade-4c7f-a3d6-7309f225f37d_1",
    "neutral/ff6acf35-cfce-4d87-b04e-2bf91f1926ba_0",
    "neutral/ff6acf35-cfce-4d87-b04e-2bf91f1926ba_1",
    "neutral/94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e_0",
    "neutral/94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e_1",
    "neutral/43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d_0",
    "neutral/43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d_1",
    "neutral/e14e94f7-2550-4f38-b9ba-ebe4958e0512_0",
    "neutral/e14e94f7-2550-4f38-b9ba-ebe4958e0512_1",
    "neutral/3504e22c-1e69-4e99-928b-f8541539d888_0",
    "neutral/3504e22c-1e69-4e99-928b-f8541539d888_1",
    "neutral/2d8791a3-3ad0-4011-bdc1-2dde05ebcba2_0",
    "neutral/2d8791a3-3ad0-4011-bdc1-2dde05ebcba2_1",
    "neutral/9a54607c-02a3-48c6-ad11-02a5e27812de_0",
    "neutral/9a54607c-02a3-48c6-ad11-02a5e27812de_1",
  ],
  maleFaces: ['2024-12-17_16-54-06.jpg', '2024-12-17_23-16-53.jpg', '2024-12-16_17-02-36.jpg', '2024-12-19_20-19-32.jpg', '2024-12-18_16-13-12.jpg', '2024-12-18_17-26-53.jpg', '2024-12-19_19-17-03.jpg', '2024-12-18_16-32-55.jpg', '2024-12-18_00-45-30.jpg', '2024-12-16_19-51-54.jpg', '2024-12-17_20-52-28.jpg', '2024-12-18_16-59-56.jpg', '2024-12-17_17-37-42.jpg', '2024-12-16_18-20-01.jpg'],
  femaleFaces: ['2024-12-17_21-17-42.jpg', '2024-12-19_19-48-38.jpg', '2024-12-17_16-07-04.jpg', '2025-01-06_17-28-26.jpg', '2024-12-19_22-24-39.jpg', '2024-12-19_21-55-40.jpg', '2024-12-17_16-28-20.jpg', '2024-12-16_21-07-35.jpg', '2025-01-06_18-27-03.jpg', '2024-12-17_22-31-10.jpg', '2024-12-18_15-28-28.jpg', '2024-12-16_23-08-45.jpg', '2024-12-16_17-28-17.jpg', '2024-12-18_18-25-19.jpg'],
  faceIdx: {male: 0, female: 0}
};

const id2Video = {
  "d9e1f5a5-e4eb-43df-910b-d9ae2befb039":
    "positive/d9e1f5a5-e4eb-43df-910b-d9ae2befb039.mp4",
  "1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6":
    "positive/1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6.mp4",
  "65ef52f0-93a4-435c-ae13-ab502aa60bd7":
    "positive/65ef52f0-93a4-435c-ae13-ab502aa60bd7.mp4",
  "ac78bc80-4f3a-481a-91e6-213bc427c0b3":
    "positive/ac78bc80-4f3a-481a-91e6-213bc427c0b3.mp4",
  "5348de6b-afa5-4c36-8087-cd3bf94eedfd":
    "positive/5348de6b-afa5-4c36-8087-cd3bf94eedfd.mp4",
  "ddbd8c9d-1dc5-45ae-b8e4-7a5d1e266748":
    "positive/ddbd8c9d-1dc5-45ae-b8e4-7a5d1e266748.mp4",
  "718d778c-d62e-463a-97cd-d6d3550d19a3":
    "positive/718d778c-d62e-463a-97cd-d6d3550d19a3.mp4",
  "fcb7689a-5614-475c-9ea8-493fbe045499":
    "positive/fcb7689a-5614-475c-9ea8-493fbe045499.mp4",
  "a373174c-cade-4c7f-a3d6-7309f225f37d":
    "neutral/a373174c-cade-4c7f-a3d6-7309f225f37d.mp4",
  "ff6acf35-cfce-4d87-b04e-2bf91f1926ba":
    "neutral/ff6acf35-cfce-4d87-b04e-2bf91f1926ba.mp4",
  "94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e":
    "neutral/94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e.mp4",
  "43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d":
    "neutral/43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d.mp4",
  "e14e94f7-2550-4f38-b9ba-ebe4958e0512":
    "neutral/e14e94f7-2550-4f38-b9ba-ebe4958e0512.mp4",
  "3504e22c-1e69-4e99-928b-f8541539d888":
    "neutral/3504e22c-1e69-4e99-928b-f8541539d888.mp4",
  "2d8791a3-3ad0-4011-bdc1-2dde05ebcba2":
    "neutral/2d8791a3-3ad0-4011-bdc1-2dde05ebcba2.mp4",
  "9a54607c-02a3-48c6-ad11-02a5e27812de":
    "neutral/9a54607c-02a3-48c6-ad11-02a5e27812de.mp4",
};

// Helper function to shuffle the array
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

// Run on startup
// Check that our current faceIdx for male and female faces is stored in a file
// If so, load it. Otherwise, create it
const faceIdxPath = process.env["STORE_PATH"] + '/faceIdx.txt';
if (fs.existsSync(faceIdxPath)) {
  console.log('faceIdx file exists! reading...');
  const data = fs.readFileSync(faceIdxPath, 'utf-8');
  const lines = data.split('\n');
  const maleVal = parseInt(lines[0].split(',')[1]);
  const femaleVal = parseInt(lines[1].split(',')[1]);
  gameParams['faceIdx'] = {male: maleVal, female: femaleVal};
  console.log(gameParams['faceIdx']);
} else {
  console.log('faceIdx file not found! creating...');
  try {
    const content = 'male,0\nfemale,0';
    fs.writeFileSync(faceIdxPath, content);
    console.log(gameParams['faceIdx']);
  } catch (err) {
    console.error(err);
  }
}


// Function that runs when the lobby timer runs out
Empirica.onGameStart(({ game }) => {
  const round = game.addRound({
    name: "Round",
  });

  round.addStage({
    name: "Stage",
    duration: 999 * 60, //mins
  });

  game.set("gameParams", gameParams);

  if (fs.existsSync(faceIdxPath)) {
    console.log('faceIdx file exists! reading...');
    const data = fs.readFileSync(faceIdxPath, 'utf-8');
    const lines = data.split('\n');
    const maleVal = parseInt(lines[0].split(',')[1]);
    const femaleVal = parseInt(lines[1].split(',')[1]);
    gameParams['faceIdx'] = {male: maleVal, female: femaleVal};
    console.log(gameParams['faceIdx']);
  } else {
    console.log('faceIdx file not found! creating...');
    try {
      const content = 'male,0\nfemale,0';
      fs.writeFileSync(faceIdxPath, content);
      console.log(gameParams['faceIdx']);
    } catch (err) {
      console.error(err);
    }
  }
});

// Called when a participant joins the experiment
Empirica.on("player", (ctx, { player, _ }) => {
  if (player.get("gameParams")) return;
  player.set("gameParams", gameParams);
  player.set("studyStep", "calibration");
  player.set("videoReactions", []);
  player.set("livekitURL", gameParams.livekitURL);
  player.set('trialDt', (new Date()).getTime());

  // Final Survey
  let leftoverIndices = [];
  let tmp = [];

  for (let i = 0; i < 32; i++) tmp.push(i);
  shuffle(tmp);
  tmp = tmp.slice(0, 16);

  const randomizedSeenIndices = [...tmp];

  for (let i = 0; i < 32; i++) {
    if (randomizedSeenIndices.indexOf(i) == -1) {
      leftoverIndices.push(i);
    }
  }

  shuffle(leftoverIndices);

  player.set("leftoverIndices", leftoverIndices);
  player.set("randomizedSeenIndices", randomizedSeenIndices);
});


Empirica.on("player", "gender", (ctx, { player, gender }) => {
  const playerGender = gender;

  const playerVideos = [];
  const orderedVideoIDs = [];

  // Randomize order of videos
  let randomPositiveVideos = [0,1,2,3,4,5,6,7];
  let randomNegativeVideos = [0,1,2,3,4,5,6,7];
  shuffle(randomPositiveVideos);
  shuffle(randomNegativeVideos);

  for (let i = 0; i < 4; i++) {
    orderedVideoIDs.push(gameParams.videos["positive"][randomPositiveVideos[i]]);
  }

  for (let i = 0; i < 4; i++) {
    orderedVideoIDs.push(gameParams.videos["neutral"][randomNegativeVideos[i]]);
  }

  // Randomize order of video sentiment and morphing level
  const randomizedConditions = [0,1,2,3,4,5,6,7];
  shuffle(randomizedConditions);

  // Apply the condition indices to the randomizedMorphingLevel, playerVideoIDs
  const randomizedVideoIDs = [];
  const randomizedMorphingLevels = [];  
  const orderedMorphingLevels = [0, 1, 2, 3, 0, 1, 2, 3];

  for (let i = 0; i < randomizedConditions.length; i++) {
    const idx = randomizedConditions[i];
    randomizedVideoIDs.push(orderedVideoIDs[idx]);
    randomizedMorphingLevels.push(orderedMorphingLevels[idx]);
  }

  for (let i = 0; i < 8; i++) {
    playerVideos.push(id2Video[randomizedVideoIDs[i]]);
  }

  // Only morph the gender-matched participants!
  const randomizedMorphingLR = [];
  // Randomize left/right order
  const randomizedDisplayLR = [];

  for (let i = 0; i < 8; i++) {
    // NOTE: We no longer randomize morphing with either the left or right speaker. Now, we do it based on gender
    // randomizedMorphingLR.push(Math.round(Math.random()));

    let morphingLR = 0;
    if (playerGender == gameParams["video_genders"][randomizedVideoIDs[i]][0]) {
      morphingLR = 0;
    } else if (
      playerGender == gameParams["video_genders"][randomizedVideoIDs[i]][1]
    ) {
      morphingLR = 1;
    } else {
      morphingLR = Math.round(Math.random());
    }
    randomizedMorphingLR.push(morphingLR);
    randomizedDisplayLR.push(Math.round(Math.random()));
  }

  const seenPpl = [];
  for (const vidName of playerVideos) {
    const idx = gameParams["stillMapTxt"].indexOf(vidName.slice(0, -4) + "_0");
    seenPpl.push(idx);
    seenPpl.push(idx + 1);
  }

  player.set("randomizedVideos", playerVideos);
  player.set("randomizedMorphingLevel", randomizedMorphingLevels);
  player.set("randomizedMorphingLR", randomizedMorphingLR);
  player.set("randomizedDisplayLR", randomizedDisplayLR);
});

// Called when a participant submits the reCAPTCHA
Empirica.on("player", "submitRecaptcha", (ctx, { player, submitRecaptcha }) => {
  const data = submitRecaptcha;

  if (data === true) {
    return;
  }

  if ("data" in data && data["data"]) {
    const secret =
      process.env["DEPLOYMENT"] == "dev"
        ? "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
        : process.env["RECAPTCHA_SECRET"];
    const response = data["data"];

    axios
      .post(
        `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${response}`,
        {},
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          },
        }
      )
      .then((resp) => {
        const respData = resp.data;
        if (respData.success) {
          player.set("passedRecaptcha", true);
          Empirica.flush(); // Allows asynchronous state updates
        } else {
          player.set("passedRecaptcha", false);
        }
      });
  }
});

// Called when a participant submits the consent form
Empirica.on(
  "player",
  "submitConsentForm",
  (ctx, { player, submitConsentForm }) => {
    const consentFormResponse = submitConsentForm;
    let passedConsentForm = true;
    for (q in consentFormResponse) {
      if (consentFormResponse[q] != "yes") {
        passedConsentForm = false;
      }
    }
    player.set("passedConsentForm", passedConsentForm);
  }
);

Empirica.on(
  "player",
  "requestLiveKitToken",
  (ctx, { player, requestLiveKitToken }) => {
    async function init() {
      const at = new AccessToken(
        process.env["LIVEKIT_API_KEY"],
        process.env["LIVEKIT_API_SECRET"],
        {
          identity: "user_blue",
        }
      );
      at.addGrant({ roomJoin: true, room: "room_blue" });
      const token = await at.toJwt();
      player.set("liveKitToken", token);
      Empirica.flush();
    }
    void init();
  }
);

// Called when a player finishes the study
Empirica.on(
  "player",
  "debriefingResults",
  (ctx, { player, debriefingResults }) => {
    const gender = player.get('gender');
    gameParams['faceIdx'][gender] += 1;
    console.log('Updating faceIdx...');
    const newContent = 'male,'+gameParams['faceIdx']['male']+'\nfemale,'+gameParams['faceIdx']['female'];
    fs.writeFileSync(faceIdxPath, newContent);
    console.log(gameParams['faceIdx']);
  }
);

// Debugging
// (Unused) callback from Empirica
Empirica.onRoundStart(({ round }) => {});

// (Unused) callback from Empirica
Empirica.onStageStart(({ stage }) => {});

// (Unused) callback from Empirica
Empirica.onStageEnded(({ stage }) => {});

// (Unused) callback from Empirica
Empirica.onRoundEnded(({ round }) => {});

// (Unused) callback from Empirica
Empirica.onGameEnded(({ game }) => {});
