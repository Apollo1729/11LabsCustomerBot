import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";


const viteKey = import.meta.env?.ELEVENLABS_API_KEY;
const processKey = process?.env?.ELEVENLABS_API_KEY;

const apiKey = viteKey || processKey;

export const client = new ElevenLabsClient({
  apiKey: apiKey,
  environment: "https://api.elevenlabs.io",
});
