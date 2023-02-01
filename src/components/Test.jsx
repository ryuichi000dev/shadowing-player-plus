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
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import AddIcon from "@mui/icons-material/Add";
import LoopIcon from "@mui/icons-material/Loop";
import DeleteIcon from "@mui/icons-material/Delete";
import SpatialAudioOffIcon from "@mui/icons-material/SpatialAudioOff";
import SpatialTrackingIcon from "@mui/icons-material/SpatialTracking";
import {
  Avatar,
  Button,
  Divider,
  Fab,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import "./main.css";
import { TransitionGroup } from "react-transition-group";
import { CurrencyYen, VolumeUp } from "@mui/icons-material";
import { display } from "@mui/system";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

/*
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
*/

const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

const LastPlayIcon = (props) => {
  //console.log(props);
  const LastPlayStatus = props;

  if (LastPlayStatus.props === "Listening") {
    return (
      <>
        <VolumeUp color="primary" sx={{ fontSize: "80px" }} />
        <SpatialAudioOffIcon sx={{ fontSize: "50px" }} />
        <SpatialTrackingIcon sx={{ fontSize: "50px" }} />
      </>
    );
  } else if (LastPlayStatus.props === "Recording") {
    return (
      <>
        <VolumeUp sx={{ fontSize: "50px" }} />
        <SpatialAudioOffIcon color="primary" sx={{ fontSize: "80px" }} />
        <SpatialTrackingIcon sx={{ fontSize: "50px" }} />
      </>
    );
  } else if (LastPlayStatus.props === "Feedbacking") {
    return (
      <>
        <VolumeUp sx={{ fontSize: "50px" }} />
        <SpatialAudioOffIcon sx={{ fontSize: "50px" }} />
        <SpatialTrackingIcon color="primary" sx={{ fontSize: "80px" }} />
      </>
    );
  }
};

export default function MusicPlayerSlider() {
  //console.log('レンダリングされました！');

  //-----------------Testing--------------------

  const [audioState, setAudioState] = useState(true);
  const recorderRef = useRef();
  const teachingAudioRef = useRef();
  const inputRef = useRef(null);

  let playTimer; //インターバル用の変数
  const [repeatingCount, setRepeatingCount] = useState(3);
  const [startTime, setStartTime] = useState();
  const [stopTime, setStopTime] = useState();
  const [recordingTime, setRecordingTime] = useState();
  const [ListeningTime, setListeningTime] = useState();

  const [playListIndex, setPlayListIndex] = useState(0);

  const [teachingAudioVolume, setTeachingAudioVolume] = useState(100);
  const [recAudioVolume, setRecAudioVolume] = useState(100);

  const [isLastPlaying, setIsLastPlaying] = useState(false);
  const [LastPlayStatus, setLastPlayStatus] = useState("Listening");

  const [recTimeLength, setRecTimeLength] = useState(1.2);

  const SE1Ref = useRef();
  const SE2Ref = useRef();


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

    let mimeType = '';

    mediaDevices
      .getUserMedia({
        video: false,
        audio: true,
      })
      .then(function (stream) {
        if (MediaRecorder.isTypeSupported("audio/webm")) {
          console.log("support audio/webm !")
          recorderRef.current = new MediaRecorder(stream, {
            mimeType: "audio/webm",
          });
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          console.log("support audio/mp4 !");
          recorderRef.current = new MediaRecorder(stream, {
            mimeType: "audio/mp4",
          });
        }
        // 音声データを貯める場所
        let chunks = [];
        // 録音が終わった後のデータをまとめる
        recorderRef.current.addEventListener("dataavailable", (ele) => {
          if (ele.data.size > 0) {
            chunks.push(ele.data);
            mimeType = ele.data.type;
          }
          // 音声データをセット
        });
        // 録音を開始したら状態を変える
        recorderRef.current.addEventListener("start", () => {
          setAudioState(false);
        });
        // 録音がストップしたらchunkを空にして、録音状態を更新
        recorderRef.current.addEventListener("stop", () => {
          console.log(mimeType);
          const blob = new Blob(chunks, {'type': mimeType });
          setAudioState(true);
          chunks = [];
          const recAudio = document.querySelector("#recAudio");
          recAudio.src = window.URL.createObjectURL(blob);
        });
      })
      .catch(function (err) {
        console.log(err);
        alert("マイクに接続できませんでした。デバイスとブラウザの設定を確認してください");
      });

    // teachingAudioRef.current.src = "./audiomaterial/excuseme.mp3";
    // settingTime();
  }, []);

  // 録音開始
  const handleRecStart = () => {
    recorderRef.current.start();
  };

  // 録音停止
  const handleRecStop = () => {
    recorderRef.current.stop();
  };

  //sleep機能
  const sleep = (waitSec) => {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve();
      }, waitSec);
    });
  };

  //-----LastPlay部分はじまり-----

  const [LastPlayFlg, setLastPlayFlg] = useState(false);
  const [ReLastPlayingFlg, setReLastPlayFlg] = useState(false);
  const [isReLastPlaying, setIsReLastPlaying] = useState(false);

  const startTimer = () => {
    setStartTime(teachingAudioRef.current.currentTime);
    setStartPosition(teachingAudioRef.current.currentTime);
    setEndPosition(teachingAudioRef.current.currentTime);
    setInterval(() => {
      playTimer = setNowPosition(teachingAudioRef.current.currentTime);
    }, 50);
  };

  const stopTimer = () => {
    clearInterval(playTimer);
    const newStopTime = teachingAudioRef.current.currentTime;
    console.log(`CurrentTime:${teachingAudioRef.current.currentTime}`);
    setStopTime(newStopTime);
    setNowPosition(newStopTime);
    setEndPosition(newStopTime);
    setListeningTime((newStopTime - startTime) * 1000);
    setRecordingTime((newStopTime - startTime) * 1000 * recTimeLength);
  };

  const listening = async () => {
    setLastPlayStatus("Listening");
    teachingAudioRef.current.currentTime = startTime;
    //console.dir(teachingAudioRef.current)
    await teachingAudioRef.current.play();
    //console.log(`ListeningTime:${ListeningTime}`);
    await sleep(ListeningTime);
    teachingAudioRef.current.pause();
    //console.log(`CurrentTime:${teachingAudioRef.current.currentTime}`);
  };

  const recording = async () => {
    setLastPlayStatus("Recording");
    await sleep(200);
    SE1Ref.current.play();
    await sleep(1000);
    recorderRef.current.start();
    await sleep(recordingTime);
    recorderRef.current.stop();
  };

  const feedbacking = async () => {
    setLastPlayStatus("Feedbacking");
    await sleep(200);
    SE2Ref.current.play();
    await sleep(1000);
    const recAudio = document.querySelector("#recAudio");
    recAudio.load();
    recAudio.play();
    await sleep(recordingTime);
    recAudio.pause();
    setLastPlayStatus("Listening");
  };

  const lastPlay = async () => {
    const recAudio = document.querySelector("#recAudio");
    recAudio.load();
    await recording();
    await feedbacking();
    for (let i = 1; i < repeatingCount; i++) {
      await listening();
      await recording();
      await feedbacking();
    }
    console.log("LastPlay END");
    setLastPlayStatus("Listening");
    setIsLastPlaying(false);
    setLastPlayFlg(false);
  };

  const handleLastPlayStart = () => {
    console.log("LastPlay Start");
    setIsLastPlaying(true);
    teachingAudioRef.current.play();
    startTimer();
  };

  const handleLastPlayStop = () => {
    teachingAudioRef.current.pause();
    stopTimer();
    setLastPlayFlg(true);
  };

  useEffect(() => {
    if (LastPlayFlg) {
      console.log(
        `useEffect!!  startTime:${startTime}, stopTime:${stopTime}, recTime:${recordingTime}, ListenTime:${ListeningTime}`
      );
      console.log(
        `useEffect!! startPosition:${startPosition}, endPosition:${endPosition}, nowPosition:${nowPosition}`
      );
      lastPlay();
    }
  }, [LastPlayFlg]);


  //reLastPlay
  const handleReLastPlay = () => {
    if (endPosition - startPosition !==  0) {
      setStartTime(startPosition);
      setRecordingTime(prev => prev * recTimeLength);
      setIsLastPlaying(true);
      setIsReLastPlaying(true);
      setReLastPlayFlg(true);
    }
  };

  const reLastPlay = async () => {
    for (let i = 0; i < repeatingCount; i++) {
      await listening();
      await recording();
      await feedbacking();
    }
    setIsLastPlaying(false);
    setIsReLastPlaying(false);
    setReLastPlayFlg(false);
  };

  useEffect(() => {
    if (ReLastPlayingFlg) {
      reLastPlay();
    }
  }, [ReLastPlayingFlg]);

  //-----LastPlay部分おわり-----



  //音源の時間を取得(audioタグのonLoadedMetaDataから副作用で呼び出し)
  const settingTime = () => {
    console.log("on Loaded Data!!");
    setDuration(teachingAudioRef.current.duration);
  };

  const [loadedFlg, setLoadedFlg] = useState(false);
  const handleLoaded = () => {
    setLoadedFlg(true);
  };

  useEffect(() => {
    if (loadedFlg) {
      settingTime();
      setLoadedFlg(false);
    }
  }, [loadedFlg]);

  const [playList, setPlayList] = useState([
    { name: "excuse-me.mp3", path: "./audiomaterial/excuse-me.mp3" },
  ]);
  const [teachingAudio, setTeachingAudio] = useState({
    name: "excuse-me.mp3",
    path: "./audiomaterial/excuse-me.mp3",
  });
  const [sampleAudio, setSampleAudio] = useState({
    name: "excuse-me.mp3",
    path: "./audiomaterial/excuse-me.mp3",
  });

  const handleInputAudio = (e) => {
    const files = e.target.files;
    const newAudios = [...playList];
    for (let i = 0; i < files.length; i++) {
      if(!files[i].type.match("audio.*")) {
        alert(`${files[i].name}は音声ファイルではありません。音声ファイルを選択してください`)
      } else {
        newAudios.push({
          name: files[i].name,
          path: URL.createObjectURL(files[i]),
        });
      }
    }
    setPlayList(newAudios);
  };

  //ファイル選択後にパスなどを更新する
  useEffect(() => {
    setTeachingAudio(playList[0]);
  }, [playList]);

  useEffect(() => {
    //playListが全て消えた時にsample音源を挿入する
    if (playList.length === 0) {
      setTeachingAudio({ name: sampleAudio.name, path: sampleAudio.path });
    } else {
      setTeachingAudio({
        name: playList[playListIndex].name,
        path: playList[playListIndex].path,
      });
    }
  }, [playList, playListIndex]);


  //音源を選択し、setする
  const handleSelectAudio = (index) => {
    //console.log(duration);
    console.log("select audio");
    resetPosition();
    setTeachingAudio({
      name: playList[index].name,
      path: playList[index].path,
    });
    setPlayListIndex(index);
  };

  //音源をデリートする
  const handleDeleteAudio = (index) => {
    console.log("delete audio");
    const newPlayList = [...playList];
    window.URL.revokeObjectURL(playList[index].path);
    newPlayList.splice(index, 1);
    setPlayList(newPlayList);
  };


  const resetPosition = () => {
    setStartPosition(0);
    setEndPosition(0);
    setNowPosition(0);
  };

  //次の曲・前の曲へ
  const handleNextAudio = () => {
    if (playListIndex !== playList.length - 1) {
      console.log("go next audio!!");
      setPlayListIndex(playListIndex + 1);
      resetPosition();
    }
  };
  const handlePrevAudio = () => {
    if (teachingAudioRef.current.currentTime !== 0) {
      teachingAudioRef.current.currentTime = 0;
      resetPosition();
    } else if (playListIndex !== 0) {
      console.log("back prev audio!!");
      setPlayListIndex(playListIndex - 1);
      resetPosition();
    }
  };

  
  //リピート回数を変更・反映
  const repeatingCountChange = (e) => {
    setRepeatingCount(e.target.value);
  };
  //録音時間を変更
  const recTimeLengthChange = (e) => {
    setRecTimeLength(e.target.value);
  };

  //音量変更
  const handleTeachingAudioVolume = (event, newValue) => {
    setTeachingAudioVolume(newValue);
    teachingAudioRef.current.volume = newValue / 100;
  };
  const handleRecAudioVolume = (event, newValue) => {
    setRecAudioVolume(newValue);
    const recAudio = document.querySelector("#recAudio"); //----!!!!-----
    recAudio.volume = newValue / 100;
  };

  //Slider操作
  const handleSliderChange = (e, newValue) => {
    teachingAudioRef.current.currentTime = newValue;
    setStartPosition(newValue);
    setNowPosition(newValue);
    setEndPosition(newValue);
  };

  
  const handleAudioPlay = () => {
    const recAudio = document.querySelector("#recAudio");
    console.dir(recAudio);
    recAudio.load();
    recAudio.play();
  }

  //教材音声が終了した時の処理
  const handleEnded = () => {
    if (isLastPlaying) {
      handleLastPlayStop();
      setPaused(!paused);
    }
  }

  //UI
  const theme = useTheme();
  const [duration, setDuration] = useState(0);
  const [startPosition, setStartPosition] = useState(0);
  const [endPosition, setEndPosition] = useState(0);
  const [nowPosition, setNowPosition] = useState(0);
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
    value = Math.ceil(value);
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
    <Box
      sx={{
        width: "100%",
        display: "flex",
        "@media screen and (max-width:650px)": {
          flexFlow: "column",
        },
      }}
    >
      <Box
        sx={{
          width: "60%",
          padding: "16px 48px",
          display: "flex",
          justifyContent: "center",
          flexFlow: "column",
          "@media screen and (max-width:650px)": {
            width: "80%",
          },
        }}
      >
        <Box
          sx={{
            height: "140px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LastPlayIcon props={LastPlayStatus} />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/*<AudiotrackIcon sx={{mr: 1}}/>*/}
          <Typography
            noWrap
            letterSpacing={-0.25}
            sx={{ textAlign: "center", fontSize: "20px" }}
          >
            {teachingAudio.name}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
          step={0.1}
          max={duration}
          onChange={handleSliderChange}
          disabled={isLastPlaying ? true : false}
          sx={{
            color: theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
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
            mt: -1,
          }}
        >
          <IconButton
            aria-label="previous song"
            onClick={handlePrevAudio}
            disabled={isLastPlaying ? true : false}
          >
            <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
          <IconButton
            aria-label="repeat Last Play"
            onClick={handleReLastPlay}
            disabled={isLastPlaying ? true : false}
          >
            <LoopIcon fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
          <IconButton
            aria-label={paused ? "play" : "pause"}
            disabled={LastPlayFlg || isReLastPlaying ? true : false}
            onClick={
              paused
                ? () => {
                    handleLastPlayStart();
                    setPaused(!paused);
                  }
                : () => {
                    handleLastPlayStop();
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
            onClick={handleNextAudio}
            disabled={isLastPlaying ? true : false}
          >
            <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
        </Box>
        {/*<button onClick={handleAudioPlay}>start</button>*/}
        <Stack
          spacing={2}
          direction="row"
          sx={{ mt: 1, mb: 1, px: 1 }}
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

        <Box mt={1}>
          <FormControl sx={{ m: 1, width: 150 }} size="small">
            <InputLabel id="repeatTimes">リピート回数</InputLabel>
            <Select
              labelId="repeatTimes"
              id="repeatTimes"
              value={repeatingCount}
              label="repeat"
              onChange={repeatingCountChange}
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

          <FormControl sx={{ m: 1, width: 150 }} size="small">
            <InputLabel id="recTimeLength">録音時間</InputLabel>
            <Select
              labelId="recTimeLength"
              id="recTimeLength"
              value={recTimeLength}
              label="repeat"
              onChange={recTimeLengthChange}
              disabled={isLastPlaying ? true : false}
            >
              <MenuItem value={0.7}>× 0.7</MenuItem>
              <MenuItem value={0.8}>× 0.8</MenuItem>
              <MenuItem value={0.9}>× 0.9</MenuItem>
              <MenuItem value={1.0}>× 1.0</MenuItem>
              <MenuItem value={1.1}>× 1.1</MenuItem>
              <MenuItem value={1.2}>× 1.2</MenuItem>
              <MenuItem value={1.3}>× 1.3</MenuItem>
              <MenuItem value={1.4}>× 1.4</MenuItem>
              <MenuItem value={1.5}>× 1.5</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box
        sx={{
          width: "40%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexFlow: "column",
          "@media screen and (max-width:650px)": {
            width: "100%",
          },
        }}
      >
        <Button variant="contained" component="label" size="large">
          <AddIcon />
          教材を選択
          <input
            hidden
            multiple
            type="file"
            onChange={handleInputAudio}
            ref={inputRef}
          />
        </Button>
        <List sx={style} component="nav" aria-label="playList">
          {[0, 1, 2, 3, 4].map((value) => {
            const labelId = `checkbox-list-secondary-label-${value}`;
            return (
              <ListItem
                key={value}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteAudio(value)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
                divider
              >
                <ListItemButton onClick={() => handleSelectAudio(value)}>
                  <AudiotrackIcon sx={{ mr: 1 }} />
                  <ListItemText
                    id={labelId}
                    primary={playList[value]?.name || " - "}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <audio
        id="teachingAudio"
        onLoadedMetadata={handleLoaded}
        onEnded={handleEnded}
        src={teachingAudio.path}
        ref={teachingAudioRef}
        volume={teachingAudioVolume/100}
      ></audio>
      <audio id="recAudio" volume={recAudioVolume/100}></audio>
      <audio
        id="SE1"
        src="./audiomaterial/Onoma-Pop03-3(Low).mp3"
        ref={SE1Ref}
      ></audio>
      <audio
        id="SE2"
        src="./audiomaterial/Onoma-Pop03-1(High).mp3"
        ref={SE2Ref}
      ></audio>
    </Box>
  );
}
