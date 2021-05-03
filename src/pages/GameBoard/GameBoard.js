import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Board from "./components/Board/Board";
import GameInfo from "./components/GameInfo/GameInfo";
import styled from "styled-components";
import { Header } from "./components/Header";
import Help from "./components/Help/Help";
import {
  hintHeatmapFull,
  hintHeatmapZone,
  markersClear,
  multipleHelp,
  setWinnerUser,
  setLoserUser,
  setBlocked,
  hintShowBest,
  setScoresWinner,
  hintBestMoves,
  updatedPowerDisplay
} from "../../store/Board/actions";

import { clearGameId } from "../../store/GameCreate/actions";

import { client, token } from '../../Socket.js'
import {
  HEATMAP_FULL,
  HEATMAP_ZONE_QUARTER,
} from "./components/Help/types";


const Wrapper = styled.div`
  max-width: 1377px;
  margin: 0 auto;
`;
const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: stretch;
  height: calc(100vh - 129px);
`;
const Wrap = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(255,255,255,0.5);
  z-index: 99999999;
`;

const myProps = {
  displayPower: true,
  powerArray: null,
  moveCount: 0,
  resetPowerArray() {
    this.powerArray = [];
    for (var i = 0; i < 13; i++){
      this.powerArray.push([])
      for (var k = 0; k < 13; k++){
        this.powerArray[i].push(0)
      }
    }
  },

}


myProps.resetPowerArray();


const GameBoard = ({ history }) => {
  const dispatch = useDispatch();

  const game_id = useSelector((state) => state.createGame.id);
  const blocked = useSelector((state) => state.board.blocked);
  const mapStones = useSelector((state) => state.board.mapStones);

  const [hint, setHint] = useState(false);
  const [enemyPass, setEnemyPass] = useState(false);
  const [lastMarkers, setLastMarkers] = useState(null);
  const [helpType, setHelpType] = useState('');
  const [activeHelpId, setActiveHelpId] = useState('');
  const [multipleType, setMultipleType] = useState(false);
  const [mapType, setMapType] = useState(false);
  const [multipleHint, setMultipleHint] = useState({});
  const [multipleCount, setMultipleCount] = useState([]);
  const [turns, setTurns] = useState([]);
  const [yourColor, setYourColor] = useState("white");
  const [coordinates, setCoordinates] = useState({});
  const [you, setYou] = useState({});
  const [opponent, setOpponent] = useState({});
  const [stepMain, setStepMain] = useState(0)
  const [stepTwo, setStepTwo] = useState(0)
  const [stepColor, setStepColor] = useState('white')
  const [classNames, setClassNames] = useState({})
  const [moveCount, setMoveCount] = useState(0)

  const [times, setTimes] = useState({playerOne: 0, playerTwo: 0})



  useEffect(() => {
    if (Object.keys(multipleHint).length === multipleCount) {
      dispatch(multipleHelp());
      deleteCoordinates(multipleHint);
      setHelpType('');
      setMultipleHint({});
    }
  }, [multipleHint, multipleCount]);

  if (game_id === null) {
    history.push('/')
  }


  useEffect(() => {
    if (game_id) {
      client.send(JSON.stringify([5, 'go/game']));
      client.send(JSON.stringify([7, "go/game", {command: "auth", token: localStorage.getItem('GoGameToken'), game_id: game_id}]));
    }
  },[])

  client.onmessage = function(e) {
    setEnemyPass(false)
    if (typeof e.data === 'string') {
      let jsonData = JSON.parse(e.data);
      if (jsonData.payload) {
        if (jsonData.payload.currentMap) {
          let currentMap = jsonData.payload.currentMap
          setCoordinates(mapMap(currentMap))
          // мои методы
          myProps.resetPowerArray();
          prepaireFromMap(currentMap);
          findDanger(currentMap);
          setDisplayPower();
        }
        if (jsonData.payload.type === "currentMap") {
          setYou(jsonData.payload.you)
          setOpponent(jsonData.payload.opponent)
        }
        if (jsonData.payload.player) {
          if (typeof jsonData.payload.player === 'string') {
            setYourColor(jsonData.payload.player === 'w' ? 'white' : 'black')
          }
        }
        if (jsonData.payload.type && (jsonData.payload.type === 'endGame')) {
          let winner = jsonData.payload.winnerPlayer
          let loser = jsonData.payload.loserPlayer
          winner.finalScore = jsonData.payload.finalScore;
          dispatch(setWinnerUser(winner))
          dispatch(setLoserUser(loser))
          history.push('/', { from: "Win" })
          dispatch(clearGameId())
          myProps.resetPowerArray()
        }
        if (jsonData.payload.turn) {
          setStepColor(jsonData.payload.turn)
        }
        if (jsonData.payload.move) {
          setTurns(turns => [...turns, timeConverter(jsonData.time)+': '+jsonData.payload.move])
        }
        if (jsonData.payload.type === 'newTurn') {
          setLastMarkers({[jsonData.payload.place]:'circle'});
        }
        if (jsonData.payload.moveType === 'pass') {
          if (stepColor !== yourColor) {
            setEnemyPass(true)
          }
        }
        if (jsonData.payload.turnBlackEndedAt && jsonData.payload.turnWhiteEndedAt) {
          setTimes({
            playerOne: Math.floor((Number(jsonData.payload.turnBlackEndedAt)  - new Date().getTime()) / 1000),
            playerTwo: Math.floor((Number(jsonData.payload.turnWhiteEndedAt)  - new Date().getTime()) / 1000)
          })
        }
      }
    }
    dispatch(setBlocked(false))
  };

  const mapMap = (map) => {
    let coords = {};
    let alpha = 'ABCDEFGHJKLMNOPQRSTUV'
    map.map((row, rowId) => row.map((cell, colId) => {
      if(cell !== 0)
      {
        let sign = alpha[rowId];
        coords[`${sign}${(colId + 1)}`] = cell === -1 ? 'white' : 'black';
      }
    }))
    let steMainTemp = 0
    let stepTwoTemp = 0
    Object.keys(coords).forEach((key) => {
      if (String(yourColor) === String(coords[key])) {
        steMainTemp += 1
      } else {
        stepTwoTemp += 1
      }
    })
    setStepMain(steMainTemp)
    setStepTwo(stepTwoTemp)
    return coords;
  }

  const move = (coord) => {
    if (stepColor === yourColor) {
      dispatch(markersClear());
      setActiveHelpId(null);
      setHelpType('')
      dispatch(setBlocked(true))
      client.send(JSON.stringify([7, "go/game", {command: "move", token: token, place: coord.toString().toLowerCase(), game_id: game_id}]));
    }
  }

  const pass = () => {
    dispatch(markersClear());
    setActiveHelpId(null);
    setHelpType('')
    dispatch(setBlocked(true))
    client.send(JSON.stringify([7, "go/game", {command: "pass", token: token, game_id: game_id}]));
  }

  const resign = () => {
    dispatch(setBlocked(true))
    client.send(JSON.stringify([7, "go/game", {command: "resign", token: token, game_id: game_id}]));
  }

  const findPosition = (x, y) => {
    const array_x = [];
    const array_y = [];

    const left = 1;
    const right = 1;

    for (let x_local = x-left; x_local <= x + right; x_local++){
      if (x_local >= 0 & x_local < 13){
        array_x.push(x_local)
      }
    }

    for (let y_local = y-left; y_local <= y + right; y_local++){
      if (y_local >= 0 & y_local < 13){
        array_y.push(y_local)
      }
    }
    return {x: array_x, y: array_y}
  };
  var counter = 0;

  const getAssociatesRecur = (associate, emptyPlaces, blackList, map) => {
    let [x, y] = [parseInt(associate[0]), parseInt(associate[1])]
    let coords = [];
    let currentColor = map[x][y];

    coords.push([x, y + 1])
    coords.push([x, y - 1])
    coords.push([x + 1, y])
    coords.push([x - 1, y])

    blackList.push(x + " " + y);


    for (var coord in coords){
      var [local_x, local_y] = [parseInt(coords[coord][0]), parseInt(coords[coord][1])];
      if (0 <= local_x & local_x < 13 & 0 <= local_y & local_y < 13){
        // нашли союзников
        if (map[local_x][local_y] === currentColor & blackList.indexOf(local_x + " " + local_y) === -1){
          // пока не известно что вернет
          var [emptyPlacesLocal, blackListLocal] = getAssociatesRecur([local_x, local_y], emptyPlaces, blackList, map);

          emptyPlaces = emptyPlaces.concat(emptyPlacesLocal);
          blackList = blackList.concat(blackListLocal);
        }
        // нашли пустую клеточку
        else if (map[local_x][local_y] === 0){
          emptyPlaces.push([parseInt(local_x), parseInt(local_y)])
        }
      }
    }

    return [emptyPlaces, blackList]
  }

  const findDanger = (map) => {
    for (var x in map){
      for (var y in map[x]){
        if (map[x][y] !== 0){
          var [emptyPlaces, blackList] = getAssociatesRecur([x, y], [], [], map)
          if (emptyPlaces.length === 1){
            if (map[x][y] == -1){
              myProps.powerArray[emptyPlaces[0][0]][emptyPlaces[0][1]] = -2;
            }
            else {
              myProps.powerArray[emptyPlaces[0][0]][emptyPlaces[0][1]] = 2;
            }
          }
        }
      }
    }
  };

  const replacePoints = (map_local, x_index, y_index, remove) => {
    let indexes = findPosition(x_index, y_index);
    for (let x in indexes.x){
      for (let y in indexes.y){
        let x_1 = indexes.x[x]
        let y_1 = indexes.y[y]
        if (!remove & map_local[x_1][y_1] === 0){
          myProps.powerArray[x_1][y_1] = 1
        }
        // точки противника
        if (remove){
          // уберем точки если пересекаются
          if (myProps.powerArray[x_1][y_1] === 1){
            myProps.powerArray[x_1][y_1] = 0
          }
          // расставим точки противника
          else if (map_local[x_1][y_1] === 0) {
            myProps.powerArray[x_1][y_1] = -1
          }
        }
      }
    }
  };

  const setDisplayPower = () => {
    if (myProps.displayPower){
      dispatch(updatedPowerDisplay(myProps.powerArray));
    }
    else {
      dispatch(updatedPowerDisplay(false));
    }
  }

  // setDisplayPower();

  const prepaireFromMap = (map) => {
    var moveCount = 0;

    for (let x in map){
      for (let y in map[x]){
        if (map[x][y] === 1){
          moveCount += 1
          replacePoints(map, parseInt(x), parseInt(y), false);
        }
      }
    }
    for (let x in map){
      for (let y in map[x]){
        if (map[x][y] === -1){
          moveCount += 1
          replacePoints(map, parseInt(x), parseInt(y), true);
        }
      }
    }
    setMoveCount(moveCount);
  }


  const handleHelp = ({type, multipleHandleCount, id, count} ) => {
    dispatch(markersClear());
    setMultipleHint({});
    setActiveHelpId(id);
    if (type === "single") {
      dispatch(setBlocked(true))
      setHelpType("single");
      dispatch(hintBestMoves(game_id, count));
    }
    if (type === "multiple") {
      setHelpType("multiple");
      setMultipleType("multiple");
      setMultipleCount(multipleHandleCount);
    }
    if (type === "map") {
      dispatch(setBlocked(true))
      setHelpType("map");
      setMapType("map");
      switch (id)
      {
        case HEATMAP_FULL:
          dispatch(hintHeatmapFull(game_id));
          break;
        case HEATMAP_ZONE_QUARTER:
          dispatch(hintHeatmapZone(game_id, true));
          break;
      }
    }
    if (type === "score") {
      dispatch(setBlocked(true))
      dispatch(setScoresWinner(game_id))
    }
    if (type === "displayPower"){
      myProps.displayPower = !myProps.displayPower
      setDisplayPower();
    }
  };

  const deleteCoordinates = (hints) => {
    for (const key in coordinates) {
      for (const keyHint in hints) {
        if(key === keyHint) {
          delete coordinates[key];
        }
      }
    }
  }

  const timeConverter = (UNIX_timestamp) => {
    let a = new Date(UNIX_timestamp);
    let year = a.getFullYear().toString().substr(-2);
    let month = ('0' + (a.getMonth()+1)).slice(-2);
    let date = ('0' + a.getDate()).slice(-2);
    let hour = ('0' + a.getHours()).slice(-2);
    let min = ('0' + a.getMinutes()).slice(-2);
    let time = `${date}/${month}/${year} ${hour}:${min}`;
    return time;
  }

  const setMultipleHintFunc = (val) => {
    if (Object.keys(mapStones).length === (multipleCount - 2)) {
      dispatch(markersClear());
      setActiveHelpId(null);
      setMultipleHint({})
      setHelpType('');
      dispatch(setBlocked(true))
      dispatch(hintShowBest(game_id, Object.keys({...mapStones, [val]: 'circle'})))
    } else {
      setMultipleHint(mapStones)
    }
  }

  return (
    <Wrapper>
      <Header
        hint={hint}
        setPass={pass}
        viewPass={Object.keys(coordinates).length > 0}
        history={history}
        setHint={(e) => setHint(e)}
        setResign={resign}
        helpType={helpType}
        gameId={game_id}
        view={stepColor === yourColor}
        timeOut={() => alert('End Time')}
        timer={stepColor === yourColor}
      />
      <Flex>
        {blocked && (
          <Wrap />
        )}
        <Board
          lastMarkers={lastMarkers}
          hint={hint}
          setHint={setHint}
          currentColor={stepColor}
          setCurrentColor={setStepColor}
          yourColor={yourColor}
          helpType={helpType}
          setMultipleHint={(val) => setMultipleHintFunc(val)}
          multipleHint={multipleHint}
          multipleCount={multipleCount}
          coordinates={coordinates}
          setStonePosition={move}
          setHelpType={setHelpType}
          setMapType={setMapType}
          setMultipleType={setMultipleType}
          setActiveHelpId={setActiveHelpId}
          classNames={classNames}
          mapStones={mapStones}
        />
        {<Help
            you={you}
            opponent={opponent}
            stepColor={stepColor}
            yourColor={yourColor}
            turns={turns}
            enemyPass={enemyPass}
            stepMain={stepMain}
            stepTwo={stepTwo}
            currentColor={yourColor}
            setHint={setHint}
            handleHelp={handleHelp}
            helpType={helpType}
            multipleType={multipleType}
            mapType={mapType}
            activeHelpId={activeHelpId}
            times={times}
            scores={stepColor !== yourColor ? false : true}
            moveCount={moveCount}
          />
        }
      </Flex>
    </Wrapper>
  );
};

export default GameBoard;
