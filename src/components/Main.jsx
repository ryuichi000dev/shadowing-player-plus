import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayArrowRounded from "@mui/icons-material/PlayArrowRounded";
import FastForwardRounded from "@mui/icons-material/FastForwardRounded";
import FastRewindRounded from "@mui/icons-material/FastRewindRounded";
import VolumeUpRounded from "@mui/icons-material/VolumeUpRounded";
import VolumeDownRounded from "@mui/icons-material/VolumeDownRounded";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Divider,
  Fab,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import "./main.css";

const Widget = styled("div")(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: "80%",
  maxWidth: "100%",
  margin: "auto",
  position: "relative",
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.4)",
  backdropFilter: "blur(40px)",
}));

const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});


export default function MusicPlayerSlider() {
  //console.log('レンダリングされました！');

  //-----------------Testing--------------------

  const [audioState, setAudioState] = useState(true);
  const audioRef = useRef();
  const teachingAudioRef = useRef();
  const inputRef = useRef(null);

  //let startTime
  let stopTime, recordingTime;
  let playTimer;
  const [repeatingTimes, setRepeatingTimes] = useState(2);
  const [startTime, setStartTime] = useState();
  //const [stopTime, setStopTime] = useState();
  //const [recordingTime, setRecordingTime] = useState();
  const [teachingAudioPath, setTeachingAudioPath] = useState();
  const [teachingAudioName, setTeachingAudioName] =
    useState("ファイルを選択してください");

  const [teachingAudioPaths, setTeachingAudioPaths] = useState([]);
  const [teachingAudioNames, setTeachingAudioNames] = useState([]);
  const [playListIndex, setPlayListIndex] = useState(0);

  const [teachingAudioVolume, setTeachingAudioVolume] = useState(30);
  const [recAudioVolume, setRecAudioVolume] = useState(30);

  const [isLastPlaying, setIsLastPlaying] = useState(false);

  useEffect(() => {
    //mimeTypeの確認
    /*
    const types = ["video/webm",
                  "audio/webm",
                  "video/webm;codecs=vp8",
                  "video/webm;codecs=daala",
                  "video/webm;codecs=h264",
                  "audio/webm;codecs=opus",
                  "video/mpeg",
                  "video/webm;codecs=vp9",
                  "audio/mp4",
                  "audio/3gpp"];

    for (var i in types) {
      console.log( types[i] + " をサポートしている？ " + (MediaRecorder.isTypeSupported(types[i]) ? "たぶん！" : "いいえ :("));
      //alert( types[i] + " をサポートしている？ " + (MediaRecorder.isTypeSupported(types[i]) ? "たぶん！" : "いいえ :("));
    }
    */

    //マイクへのアクセス権を取得
    const mediaDevices =
      navigator.mediaDevices ||
      (navigator.mozGetUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.msGetUserMedia
        ? {
            getUserMedia(c) {
              return new Promise((y, n) => {
                (
                  navigator.mozGetUserMedia || navigator.webkitGetUserMedia
                ).call(navigator, c, y, n);
              });
            },
          }
        : null);

    mediaDevices
      .getUserMedia({
        video: false,
        audio: true,
      })
      .then(function (stream) {
        audioRef.current = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });
        // 音声データを貯める場所
        let chunks = [];
        // 録音が終わった後のデータをまとめる
        audioRef.current.addEventListener("dataavailable", (ele) => {
          if (ele.data.size > 0) {
            chunks.push(ele.data);
          }
          // 音声データをセット
        });
        // 録音を開始したら状態を変える
        audioRef.current.addEventListener("start", () => {
          setAudioState(false);
        });
        // 録音がストップしたらchunkを空にして、録音状態を更新
        audioRef.current.addEventListener("stop", () => {
          const blob = new Blob(chunks /*, 'type': mimeType }*/);
          setAudioState(true);
          chunks = [];
          const recAudio = document.querySelector("#recAudio");
          //console.dir(recAudio)
          recAudio.src = window.URL.createObjectURL(blob);
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  // 録音開始
  const handleStart = () => {
    audioRef.current.start();
  };

  // 録音停止
  const handleStop = () => {
    audioRef.current.stop();
  };

  //教材音声再生
  const audioStart = () => {
    teachingAudioRef.current.play();
  };
  const audioStop = () => {
    teachingAudioRef.current.pause();
  };

  //音源の時間を取得 => UIに反映
  const startTimer = () => {
    setStartTime(teachingAudioRef.current.currentTime);
    setStartPosition(teachingAudioRef.current.currentTime);
    setInterval(() => {
      playTimer = setNowPosition(teachingAudioRef.current.currentTime);
    }, 100);
  };

  const stopTimer = () => {
    stopTime = teachingAudioRef.current.currentTime;
    setEndPosition(stopTime);
    recordingTime = (teachingAudioRef.current.currentTime - startTime) * 1000; //sleepと単位を合わせるために*1000
    clearInterval(playTimer);
  };
  /*
  const stopTimer = () => {
    setStopTime(teachingAudioRef.current.currentTime);
    setRecordingTime((teachingAudioRef.current.currentTime - startTime) * 1000); //sleepと単位を合わせるために*1000
    console.log(teachingAudioRef.current.currentTime);
    clearInterval(playTimer);
  };
  */

  //sleep機能
  const sleep = (waitSec) => {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, waitSec);
    });
  };

  //LastPlay機能
  const lastPlayStart = () => {
    audioStart();
    startTimer();
  };
  const lastPlayStop = async () => {
    audioStop();
    stopTimer();
    await sleep(500); //=====!!!!!=====
    handleStart(); //録音開始
    await sleep(recordingTime);
    handleStop(); //録音停止
    await sleep(1000); //=====!!!!!=====
    const recAudio = document.querySelector("#recAudio");
    recAudio.load();
    recAudio.play();
    await sleep(recordingTime);
    recAudio.pause();
  };

  //LastPlay複数回リピート
  const lastPlayStartRepeat = () => {
    console.log(teachingAudioRef);
    console.log("1回目のリピート!!");
    startTimer();
    lastPlayStart();
  };
  const lastPlayStopRepeat = async () => {
    //stopTimer();
    setIsLastPlaying(true);
    await lastPlayStop();
    console.log(
      `startTime:${startTime}, stopTime:${stopTime}, recordingTime:${
        recordingTime / 1000
      }`
    );
    //2回目以降のリピート
    for (let i = 1; i < repeatingTimes; i++) {
      console.log(`${i + 1}回目のリピート!!`);
      teachingAudioRef.current.currentTime = startTime;
      await lastPlayStart();
      await sleep(recordingTime);
      await lastPlayStop();
    }
    setStartPosition(endPosition);
    setIsLastPlaying(false);
  };

  //音源の時間を最初に取得(audioタグのonLoadedMetaDataから呼び出し)
  const settingTime = () => {
    setDuration(Math.ceil(teachingAudioRef.current.duration));
  };

  //ファイルを複数選択
  const selectFiles = (e) => {
    //console.log(e.target.files.length);
    //console.log(e.target.files);
    const files = e.target.files;
    const newPaths = [...teachingAudioPaths];
    const newNames = [...teachingAudioNames];
    for (let i = 0; i < files.length; i++) {
      newPaths.push(URL.createObjectURL(files[i]));
      newNames.push(files[i].name);
    }
    setTeachingAudioPaths(newPaths);
    setTeachingAudioNames(newNames);
  };

  //ファイル選択後にパスなどを更新する
  useEffect(() => {
    //console.log(`Names: ${teachingAudioNames}`);
    setTeachingAudioName(teachingAudioNames[0]);
  }, [teachingAudioNames]);

  useEffect(() => {
    //console.log(`Paths: ${teachingAudioPaths}`);
    setTeachingAudioPath(teachingAudioPaths[0]);
  }, [teachingAudioPaths]);

  //path更新後に教材の時間を取得 → テキストに反映
  useEffect(() => {
    console.log("副作用レンダリング:path更新後");
    settingTime();
  }, [teachingAudioPath]);

  //リピート回数を変更・反映
  const repeatingTimesChange = (e) => {
    setRepeatingTimes(e.target.value);
  };

  //次の曲・前の曲へ
  const goNextAudio = () => {
    console.log("go next audio!!");
    setPlayListIndex(playListIndex + 1);
    setTeachingAudioPath(teachingAudioPaths[playListIndex]);
    setTeachingAudioName(teachingAudioNames[playListIndex]);
  };
  const backPreviousAudio = () => {
    console.log("back prev audio!!");
    setPlayListIndex(playListIndex - 1);
    setTeachingAudioPath(teachingAudioPaths[playListIndex]);
    setTeachingAudioName(teachingAudioNames[playListIndex]);
  };

  //音量変更
  const handleTeachingAudioVolume = (event, newValue) => {
    setTeachingAudioVolume(newValue);
    teachingAudioRef.current.volume = teachingAudioVolume / 100;
  };
  const handleRecAudioVolume = (event, newValue) => {
    setRecAudioVolume(newValue);
    const recAudio = document.querySelector("#recAudio"); //----!!!!-----
    recAudio.volume = recAudioVolume / 100;
  };

  //Slider操作
  const handleSliderChange = (e, newValue) => {
    teachingAudioRef.current.currentTime = newValue;
    setStartPosition(newValue);
    setNowPosition(newValue);
    setEndPosition(newValue);
  };

  //lastPlayを強制停止
  const handleAllStop = () => {};

  //---------------Testing--------------------------------

  const theme = useTheme();
  const [duration, setDuration] = useState(0);
  const [startPosition, setStartPosition] = useState(0);
  const [endPosition, setEndPosition] = useState(0);
  const [nowPosition, setNowPosition] = React.useState(0);
  const [paused, setPaused] = useState(true);
  const marks = [
    {
      value: startPosition,
      label: "△",
    },
    {
      value: endPosition,
      label: "△",
    },
  ];

  function formatDuration(value) {
    const minute = Math.floor(value / 60);
    const secondLeft = Math.ceil(value - minute * 60);
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

  const mainIconColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const lightIconColor =
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";

  const style = {
    width: "100%",
    maxWidth: 360,
    bgcolor: "background.paper",
  };

  return (
    <Box sx={{ width: "80%", overflow: "hidden" }}>
      <Widget>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            noWrap
            letterSpacing={-0.25}
            sx={{ margin: "auto", textAlign: "center" }}
          >
            {teachingAudioName || "curry.mp3"}
          </Typography>
        </Box>
        <Box></Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <TinyText>{formatDuration(nowPosition)}</TinyText>
          <TinyText>-{formatDuration(duration - nowPosition)}</TinyText>
        </Box>
        <Slider
            aria-label="time-indicator"
            size="small"
            value={nowPosition}
            marks={marks}
            min={0}
            step={1}
            max={duration}
            onChange={handleSliderChange}
            disabled={isLastPlaying ? true : false}
            sx={{
              color:
                theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
              height: 4,
              mt: -1,
              
              "& .MuiSlider-thumb": {
                width: 8,
                height: 8,
                transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                "&:before": {
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                },
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: `0px 0px 0px 8px ${
                    theme.palette.mode === "dark"
                      ? "rgb(255 255 255 / 16%)"
                      : "rgb(0 0 0 / 16%)"
                  }`,
                },
                "&.Mui-active": {
                  width: 20,
                  height: 20,
                },
              },
              "& .MuiSlider-rail": {
                opacity: 0.28,
              },
            }}
          />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: -2,
          }}
        >
          <IconButton
            aria-label="previous song"
            onClick={backPreviousAudio}
            disabled={isLastPlaying ? true : false}
          >
            <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
          <IconButton
            aria-label={paused ? "play" : "pause"}
            disabled={isLastPlaying ? true : false}
            onClick={
              paused
                ? () => {
                    lastPlayStartRepeat();
                    setPaused(!paused);
                  }
                : () => {
                    lastPlayStopRepeat();
                    setPaused(!paused);
                  }
            }
          >
            {paused ? (
              <PlayArrowRounded
                sx={{ fontSize: "3rem" }}
                htmlColor={mainIconColor}
              />
            ) : (
              <PauseRounded
                sx={{ fontSize: "3rem" }}
                htmlColor={mainIconColor}
              />
            )}
          </IconButton>
          <IconButton
            aria-label="next song"
            onClick={goNextAudio}
            disabled={isLastPlaying ? true : false}
          >
            <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
        </Box>
        <Stack
          spacing={2}
          direction="row"
          sx={{ mb: 1, px: 1 }}
          alignItems="center"
        >
          <VolumeDownRounded htmlColor={lightIconColor} />
          <Slider
            aria-label="Volume"
            defaultValue={30}
            value={teachingAudioVolume}
            onChange={handleTeachingAudioVolume}
            sx={{
              color:
                theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
              "& .MuiSlider-track": {
                border: "none",
              },
              "& .MuiSlider-thumb": {
                width: 24,
                height: 24,
                backgroundColor: "#fff",
                "&:before": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                },
                "&:hover, &.Mui-focusVisible, &.Mui-active": {
                  boxShadow: "none",
                },
              },
            }}
          />
          <VolumeUpRounded htmlColor={lightIconColor} />
        </Stack>
        <Stack
          spacing={2}
          direction="row"
          sx={{ mb: 1, px: 1 }}
          alignItems="center"
        >
          <MicOffIcon htmlColor={lightIconColor} />
          <Slider
            aria-label="recVolume"
            defaultValue={30}
            value={recAudioVolume}
            onChange={handleRecAudioVolume}
            sx={{
              color:
                theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
              "& .MuiSlider-track": {
                border: "none",
              },
              "& .MuiSlider-thumb": {
                width: 24,
                height: 24,
                backgroundColor: "#fff",
                "&:before": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                },
                "&:hover, &.Mui-focusVisible, &.Mui-active": {
                  boxShadow: "none",
                },
              },
            }}
          />
          <MicIcon htmlColor={lightIconColor} />
        </Stack>
        <FormControl sx={{ m: 1, minWidth: 150 }} size="small">
          <InputLabel id="repeatTimes">リピート回数</InputLabel>
          <Select
            labelId="repeatTimes"
            id="repeatTimes"
            value={repeatingTimes}
            label="repeat"
            onChange={repeatingTimesChange}
            disabled={isLastPlaying ? true : false}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" component="label" size="large">
          <AddIcon />
          教材を選択
          <input
            hidden
            accept="audio/*"
            multiple
            type="file"
            onChange={selectFiles}
            ref={inputRef}
          />
        </Button>

        <List sx={style} component="nav" aria-label="playList">
          <ListItem button>
            <ListItemText primary={teachingAudioNames[0] || " - "} />
          </ListItem>
          <Divider />
          <ListItem button divider>
            <ListItemText primary={teachingAudioNames[1] || " - "} />
          </ListItem>
          <ListItem button>
            <ListItemText primary={teachingAudioNames[2] || " - "} />
          </ListItem>
          <Divider light />
          <ListItem button>
            <ListItemText primary={teachingAudioNames[3] || " - "} />
          </ListItem>
        </List>
      </Widget>

      <audio
        id="teachingAudio"
        src={teachingAudioPath || "./audiomaterial/curry.mp3"}
        onLoadedMetadata={settingTime}
        ref={teachingAudioRef}
      ></audio>
      <audio id="recAudio"></audio>
    </Box>
  );
}
