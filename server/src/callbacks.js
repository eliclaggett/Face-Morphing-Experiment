import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();
import axios from 'axios';
import * as fs from 'fs';
import dotenv from 'dotenv';
import findConfig from "find-config";
import { IngressClient, IngressInfo, IngressInput, AccessToken } from 'livekit-server-sdk';

let dotEnvPath = null;
if (fs.existsSync('/home/ubuntu')) {
  dotEnvPath = findConfig('.env', {cwd: '/home/ubuntu/Code'});
} else if (fs.existsSync('/Users/eclagget/Code/experiment/face-morph')) {
  dotEnvPath = findConfig('.env', {cwd: '/Users/eclagget/Code/experiment/face-morph'});
}

if (dotEnvPath) {
  console.log('Loading dotenv file!');
  const envFile = dotenv.parse(fs.readFileSync(dotEnvPath));
  for (const key of Object.keys(envFile)) {
    process.env[key] = envFile[key];
  }
} else {
  console.log('Warning: No dotenv file!');
}

const gameParams = {
  version: 'July 2024',
  videoLength: 20, // seconds
  numVideos: 6,
  studyPay: 2.4,
  partialPay: 1,
  studyLength: '10 minutes',
  completionCode: 'C19BSZ93',
  livekitURL: 'wss://facemorphing-pse030ak.livekit.cloud',







  videos: {
    positive: [
      '6e5975cf-1d81-47a0-a487-7cde60912857',
      '01a62310-06c3-4b69-9d75-50f1e2f1dabf',
      '5ca9b7cd-9c68-4803-8d13-f3e6c7d24f43',
      'd9e1f5a5-e4eb-43df-910b-d9ae2befb039',
      'ada6c3c4-8c97-4b37-b1e1-a28706a194d5',
      '8b0ecdda-eb47-420e-8a79-a41e64a40b09',
      '1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6',
      'd7a96d59-d94f-4e56-b7c4-6e056c561f58',
      '65ef52f0-93a4-435c-ae13-ab502aa60bd7',
      '100af445-702a-4fbd-8474-ec3d17e9490e',
      'ac78bc80-4f3a-481a-91e6-213bc427c0b3',
      'e0de7827-7011-4f5a-be33-24e1827b4d2b'
    ],
    neutral: [
        '4e458f60-1fa1-4584-aca1-5932319e5ba9',
        '77f35248-1a74-45ae-b3b2-dfa5433093e3',
        'a373174c-cade-4c7f-a3d6-7309f225f37d',
        '3271eacf-69b5-4144-8dbe-b596de94ec30',
        '1db0a83b-76d3-48f4-b0cd-13d559c67e61',
        'e0fef00d-2ae2-4c21-8205-8753fc580ec1',
        'ff6acf35-cfce-4d87-b04e-2bf91f1926ba',
        '94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e',
        '43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d',
        '0f6c2eb4-5e44-46c7-8ea5-ddb74702beee',
        'e14e94f7-2550-4f38-b9ba-ebe4958e0512',
        'bb271ad2-d89d-4c4c-a8c5-d30ff0e1295a'
    ]
  },
  video_genders: {
    '6e5975cf-1d81-47a0-a487-7cde60912857': ['female', 'female'],
    '77f35248-1a74-45ae-b3b2-dfa5433093e3': ['male', 'male'],
    'bb271ad2-d89d-4c4c-a8c5-d30ff0e1295a': ['male', 'male'],
    '65ef52f0-93a4-435c-ae13-ab502aa60bd7': ['female', 'male'],
    '01a62310-06c3-4b69-9d75-50f1e2f1dabf': ['female', 'female'],
    '4e458f60-1fa1-4584-aca1-5932319e5ba9': ['male', 'male'],
    'd7a96d59-d94f-4e56-b7c4-6e056c561f58': ['female', 'female'],
    '100af445-702a-4fbd-8474-ec3d17e9490e': ['female', 'female'],
    'ac78bc80-4f3a-481a-91e6-213bc427c0b3': ['male', 'female'],
    'e0de7827-7011-4f5a-be33-24e1827b4d2b': ['female', 'female'],
    '1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6': ['female', 'male'],
    'd9e1f5a5-e4eb-43df-910b-d9ae2befb039': ['female', 'male'],
    'ada6c3c4-8c97-4b37-b1e1-a28706a194d5': ['female', 'female'],
    '94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e': ['male', 'female'],
    'a373174c-cade-4c7f-a3d6-7309f225f37d': ['male', 'female'],
    '43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d': ['male', 'female'],
    '8b0ecdda-eb47-420e-8a79-a41e64a40b09': ['male', 'male'],
    'e14e94f7-2550-4f38-b9ba-ebe4958e0512': ['female', 'male'],
    '5ca9b7cd-9c68-4803-8d13-f3e6c7d24f43': ['female', 'female'],
    'e0fef00d-2ae2-4c21-8205-8753fc580ec1': ['female', 'female'],
    '3271eacf-69b5-4144-8dbe-b596de94ec30': ['male', 'male'],
    '0f6c2eb4-5e44-46c7-8ea5-ddb74702beee': ['male', 'female'],
    'ff6acf35-cfce-4d87-b04e-2bf91f1926ba': ['male', 'female'],
    '1db0a83b-76d3-48f4-b0cd-13d559c67e61': ['female', 'male']
  }
};

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

Empirica.onGameStart(({ game }) => {
  const round = game.addRound({
    name: "Round",
  });

  round.addStage({ name: "Stage", duration:
    999 * 60 //mins
  });

  game.set('gameParams', gameParams);

  (async () => {

    // const ingressList = await ingressClient.listIngress({roomName: 'room_red'});
    // for (const ingress in ingressList) {
    //   await ingressClient.deleteIngress(ingress.ingressId);
    //   console.log('Livekit: Deleted currently playing video');
    // }

    // const ingress = {
    //   name: 'my-ingress',
    //   roomName: 'room_red',
    //   participantIdentity: 'user_experimenter',
    //   participantName: 'Video',
    //   url: 'https://ia804602.us.archive.org/16/items/pokemon-indigo-league-the-complete-collection/Pokémon%20-%20001%20-%20Pokemon%20-%20I%20Choose%20You%20%20%20%5BDarkDream%5D.mp4' // or 'srt://domain.com:7001' 
    // };
  
    // await ingressClient.createIngress(IngressInput.URL_INPUT, ingress);
    // console.log('Livekit: Started playing new video');

  })();

});

const stillMapTxt = [
  'positive/01a62310-06c3-4b69-9d75-50f1e2f1dabf_0',
  'positive/01a62310-06c3-4b69-9d75-50f1e2f1dabf_1',
  'positive/100af445-702a-4fbd-8474-ec3d17e9490e_0',
  'positive/100af445-702a-4fbd-8474-ec3d17e9490e_1',
  'positive/1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6_0',
  'positive/1fdf2fcf-746c-446e-a3fa-d70fbbf3e2c6_1',
  'positive/5ca9b7cd-9c68-4803-8d13-f3e6c7d24f43_0',
  'positive/5ca9b7cd-9c68-4803-8d13-f3e6c7d24f43_1',
  'positive/65ef52f0-93a4-435c-ae13-ab502aa60bd7_0',
  'positive/65ef52f0-93a4-435c-ae13-ab502aa60bd7_1',
  'positive/6e5975cf-1d81-47a0-a487-7cde60912857_0',
  'positive/6e5975cf-1d81-47a0-a487-7cde60912857_1',
  'positive/8b0ecdda-eb47-420e-8a79-a41e64a40b09_0',
  'positive/8b0ecdda-eb47-420e-8a79-a41e64a40b09_1',
  'positive/ac78bc80-4f3a-481a-91e6-213bc427c0b3_0',
  'positive/ac78bc80-4f3a-481a-91e6-213bc427c0b3_1',
  'positive/ada6c3c4-8c97-4b37-b1e1-a28706a194d5_0',
  'positive/ada6c3c4-8c97-4b37-b1e1-a28706a194d5_1',
  'positive/d7a96d59-d94f-4e56-b7c4-6e056c561f58_0',
  'positive/d7a96d59-d94f-4e56-b7c4-6e056c561f58_1',
  'positive/d9e1f5a5-e4eb-43df-910b-d9ae2befb039_0',
  'positive/d9e1f5a5-e4eb-43df-910b-d9ae2befb039_1',
  'positive/e0de7827-7011-4f5a-be33-24e1827b4d2b_0',
  'positive/e0de7827-7011-4f5a-be33-24e1827b4d2b_1',
  'neutral/0f6c2eb4-5e44-46c7-8ea5-ddb74702beee_0',
  'neutral/0f6c2eb4-5e44-46c7-8ea5-ddb74702beee_1',
  'neutral/1db0a83b-76d3-48f4-b0cd-13d559c67e61_0',
  'neutral/1db0a83b-76d3-48f4-b0cd-13d559c67e61_1',
  'neutral/3271eacf-69b5-4144-8dbe-b596de94ec30_0',
  'neutral/3271eacf-69b5-4144-8dbe-b596de94ec30_1',
  'neutral/43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d_0',
  'neutral/43a0eb07-4a0c-4766-bdcf-00eb87dfbb5d_1',
  'neutral/4e458f60-1fa1-4584-aca1-5932319e5ba9_0',
  'neutral/4e458f60-1fa1-4584-aca1-5932319e5ba9_1',
  'neutral/77f35248-1a74-45ae-b3b2-dfa5433093e3_0',
  'neutral/77f35248-1a74-45ae-b3b2-dfa5433093e3_1',
  'neutral/94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e_0',
  'neutral/94a3c6b5-46d5-4d3c-9616-1cc0e5a21e9e_1',
  'neutral/a373174c-cade-4c7f-a3d6-7309f225f37d_0',
  'neutral/a373174c-cade-4c7f-a3d6-7309f225f37d_1',
  'neutral/bb271ad2-d89d-4c4c-a8c5-d30ff0e1295a_0',
  'neutral/bb271ad2-d89d-4c4c-a8c5-d30ff0e1295a_1',
  'neutral/e0fef00d-2ae2-4c21-8205-8753fc580ec1_0',
  'neutral/e0fef00d-2ae2-4c21-8205-8753fc580ec1_1',
  'neutral/e14e94f7-2550-4f38-b9ba-ebe4958e0512_0',
  'neutral/e14e94f7-2550-4f38-b9ba-ebe4958e0512_1',
  'neutral/ff6acf35-cfce-4d87-b04e-2bf91f1926ba_0',
  'neutral/ff6acf35-cfce-4d87-b04e-2bf91f1926ba_1'
];

Empirica.on("player", (ctx, { player, _ }) => {
  if (player.get('gameParams')) return;
  player.set('gameParams', gameParams);
  player.set('studyStep', 'calibration');
  player.set('videoReactions', []);
  player.set('livekitURL', gameParams.livekitURL);


  const playerVideos = [];
  
  // Randomize order of videos
  const randomizedPositives = [0,1,2,3,4,5,6,7,8,9,10,11];
  const randomizedNeutrals = [0,1,2,3,4,5,6,7,8,9,10,11];

  shuffle(randomizedPositives);
  shuffle(randomizedNeutrals);

  // Randomize order of morphing levels
  const randomizedMorphingLevel = [0,1,2,0,1,2];
  shuffle(randomizedMorphingLevel);

  // Randomize left/right order
  const randomizedMorphingLR = [];
  const randomizedDisplayLR = [];
  for (let i = 0; i < 6; i++) {
    randomizedMorphingLR.push(Math.round(Math.random()));
    randomizedDisplayLR.push(Math.round(Math.random()));
  }

  for (let i = 0; i < 3; i++) {
    playerVideos.push('positive/' + gameParams.videos['positive'][randomizedPositives[i]] + '.mp4');
  }

  for (let i = 3; i < 6; i++) {
    playerVideos.push('neutral/' + gameParams.videos['neutral'][randomizedNeutrals[i]] + '.mp4');
  }
  shuffle(playerVideos);
  

  const seenPpl = [];
  for (const vidName of playerVideos) {
    const idx = stillMapTxt.indexOf(vidName.slice(0,-4)+'_0');
    seenPpl.push(idx);
    seenPpl.push(idx+1);
  }


  player.set('randomizedVideos', playerVideos);
  player.set('randomizedMorphingLevel', randomizedMorphingLevel);
  player.set('randomizedMorphingLR', randomizedMorphingLR);
  player.set('randomizedDisplayLR', randomizedDisplayLR);


  // Final Survey
  let leftoverIndices = [];
  let tmp = [];

  for (let i = 0; i < 36; i++) tmp.push(i);
  shuffle(tmp);
  tmp = tmp.slice(0,12)
  
  const randomizedSeenIndices = [...tmp];

  for (let i = 0; i < 48; i++) {
    if (randomizedSeenIndices.indexOf(i) == -1) {
      leftoverIndices.push(i);
    }
  }

  shuffle(leftoverIndices);

  player.set('leftoverIndices', leftoverIndices);
  player.set('randomizedSeenIndices', randomizedSeenIndices);


});

// Called when a participant submits the reCAPTCHA
Empirica.on("player", "submitRecaptcha", (ctx, { player, submitRecaptcha }) => {
  const data = submitRecaptcha;

  if (data === true) { return; }

  if ('data' in data && data['data']) {
    const secret = process.env['DEPLOYMENT'] == 'dev' ?
      '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe' :
      process.env['RECAPTCHA_SECRET'];
    const response = data['data'];

    axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${response}`,
      {},
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        },
      })
      .then((resp) => {
        const respData = resp.data;
        if (respData.success) {
          player.set('passedRecaptcha', true);
          Empirica.flush(); // Allows asynchronous state updates
        } else {
          console.log(respData);
          player.set('passedRecaptcha', false);
        }
      });
  }
});

// Called when a participant submits the consent form
Empirica.on("player", "submitConsentForm", (ctx, { player, submitConsentForm }) => {
  const consentFormResponse = submitConsentForm;
  let passedConsentForm = true;
  for (q in consentFormResponse) {
    if (consentFormResponse[q] != 'yes') { passedConsentForm = false; }
  }
  player.set('passedConsentForm', passedConsentForm);
});

Empirica.on("player", "requestLiveKitToken", (ctx, { player, requestLiveKitToken }) => {
  async function init() {
    const at = new AccessToken(process.env['LIVEKIT_API_KEY'], process.env['LIVEKIT_API_SECRET'], {
      identity: 'user_blue',
    });
    at.addGrant({ roomJoin: true, room: 'room_blue' });
    const token = await at.toJwt();
    player.set('liveKitToken', token);
    Empirica.flush();
  }
  void init();
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {
  
});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});