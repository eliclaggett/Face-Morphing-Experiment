import { ClassicListenersCollector } from "@empirica/core/admin/classic";
export const Empirica = new ClassicListenersCollector();
import * as fs from 'fs';
import dotenv from 'dotenv';
import findConfig from "find-config";
import { IngressClient, IngressInfo, IngressInput, AccessToken } from 'livekit-server-sdk';

let dotEnvPath = null;
if (fs.existsSync('/home/ubuntu/eli')) {
  dotEnvPath = findConfig('.env', {cwd: '/home/ubuntu/eli/experiment/face-morph'});
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

const ingressClient = new IngressClient(process.env['LIVEKIT_URL'], process.env['LIVEKIT_API_KEY'], process.env['LIVEKIT_API_SECRET']);

const gameParams = {
  version: 'June 2024',
  requiredWatchTime: 3
};


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

Empirica.on("player", "requestLiveKitToken", (ctx, { player, requestLiveKitToken }) => {
  async function init() {
    const at = new AccessToken(process.env['LIVEKIT_API_KEY'], process.env['LIVEKIT_API_SECRET'], {
      identity: 'user_blue',
    });
    at.addGrant({ roomJoin: true, room: 'room_blue' });
    const token = await at.toJwt();
    player.set('liveKitToken', token);
  }
  void init();
});

Empirica.onRoundStart(({ round }) => {});

Empirica.onStageStart(({ stage }) => {});

Empirica.onStageEnded(({ stage }) => {
  
});

Empirica.onRoundEnded(({ round }) => {});

Empirica.onGameEnded(({ game }) => {});