import React, { useRef, useState } from 'react';

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const audioContextRef = useRef(null);
  const mediaStreamSourceRef = useRef(null);
  const scriptProcessorNodeRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        audioContextRef.current = new AudioContext();
        mediaStreamSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        scriptProcessorNodeRef.current = audioContextRef.current.createScriptProcessor(1024, 1, 1);
        audioChunksRef.current = [];
        mediaStreamSourceRef.current.connect(scriptProcessorNodeRef.current);
        scriptProcessorNodeRef.current.connect(audioContextRef.current.destination);
        scriptProcessorNodeRef.current.onaudioprocess = event => {
          audioChunksRef.current.push(event.inputBuffer.getChannelData(0));
        };
        setRecording(true);
      });
  };

  const stopRecording = () => {
    mediaStreamSourceRef.current.disconnect();
    scriptProcessorNodeRef.current.disconnect();
    const audioBlob = new Blob(audioChunksRef.current);
    setAudioBlob(audioBlob);
    setRecording(false);
  };

  const playAudio = () => {
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <div>
      {!recording && <button onClick={startRecording}>Start Recording</button>}
      {recording && <button onClick={stopRecording}>Stop Recording</button>}
      {audioBlob && <button onClick={playAudio}>Play Audio</button>}
    </div>
  );
  }
