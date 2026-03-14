"use client";

import { useConversation, type Role } from "@elevenlabs/react";
import { AGENT_ID } from "../constants";
import { useState, useEffect } from "react";
import { Transcript } from "./Transcript";
import { orderPrompt } from "../prompt";

function useBakeryConvo() {
  const [transcription, setTranscription] = useState<{ message: string, source: Role }[]>([]);
  const conversation = useConversation({
    onMessage: (message) => {
      console.log(message);
      setTranscription((prev) => [...prev, message]);
    }
  });
  return { ...conversation, transcription };
}




export function Voice() {
  const { status, isSpeaking, startSession, endSession, transcription, changeInputDevice } = useBakeryConvo();
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  // Enumerate audio input devices on mount
  useEffect(() => {
    async function getDevices() {
      try {
        // Request microphone permission first
        await navigator.mediaDevices.getUserMedia({ audio: true });

        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(device => device.kind === 'audioinput');
        setAudioDevices(audioInputs);

        // Set default device if available
        if (audioInputs.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(audioInputs[0].deviceId);
        }
      } catch (error) {
        console.error('Error enumerating devices:', error);
      }
    }

    getDevices();

    // Listen for device changes
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, []);

  // Handle device selection
  const handleDeviceChange = async (deviceId: string) => {
    setSelectedDeviceId(deviceId);

    if (isConnected && changeInputDevice) {
      try {
        await changeInputDevice({
          sampleRate: 16000,
          format: 'pcm',
          preferHeadphonesForIosDevices: true,
          inputDeviceId: deviceId,
        });
        console.log('Changed to device:', deviceId);
      } catch (error) {
        console.error('Error changing input device:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Voice Conversation</h2>

        {/* Status Bar */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Status:</span>
              <span className={`px-2 py-1 rounded text-xs font-medium border ${
                isConnected
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : isConnecting
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                {status || 'Disconnected'}
              </span>
            </div>
            {isConnected && (
              <div className="flex items-center gap-2 pl-3 border-l border-gray-300">
                <span className="text-xs text-gray-500 font-medium">Speaking:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium border ${
                  isSpeaking
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-gray-100 text-gray-700 border-gray-200'
                }`}>
                  {isSpeaking ? 'Yes' : 'No'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Microphone Selector */}
        {audioDevices.length > 0 && (
          <div className="mb-6">
            <label htmlFor="microphone-select" className="block text-sm font-medium text-gray-700 mb-2">
              Microphone
            </label>
            <select
              id="microphone-select"
              value={selectedDeviceId}
              onChange={(e) => handleDeviceChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
            >
              {audioDevices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isConnected && (
            <button
              onClick={async () => {
                await startSession({
                  agentId: AGENT_ID,
                  connectionType: "webrtc",
                  inputDeviceId: selectedDeviceId,
                  overrides: {
                    agent: {
                      prompt: {
                        prompt: orderPrompt,
                      },
                    },
                  },
                }).catch((error) => {
                  console.error('Error starting session:', error);
                });
              }}
              disabled={isConnecting}
              className={`px-4 py-2 rounded font-medium text-sm transition-colors ${
                isConnecting
                  ? '!bg-gray-100 !text-gray-400 border border-gray-200 cursor-not-allowed'
                  : '!bg-green-600 !text-white hover:!bg-green-700'
              }`}
            >
              {isConnecting ? 'Connecting...' : 'Start Call'}
            </button>
          )}
          {isConnected && (
            <button
              onClick={endSession}
              className="px-4 py-2 rounded font-medium text-sm transition-colors !bg-red-600 !text-white hover:!bg-red-700"
            >
              End Call
            </button>
          )}
        </div>
      </div>

      <Transcript
        messages={transcription.map((msg, idx) => ({
          role: msg.source === 'ai' ? 'agent' : 'user',
          message: msg.message,
          timeInCallSecs: idx, // Replace with actual time if available
        }))}
      />
    </div>
  );
}
