import { all, takeLatest, call, put } from "redux-saga/effects";
import { getToken } from "../../helpers/session";
import {
  SINGLE_HELP,
  GET_HINT_BEST_MOVES,
  GET_HINT_SHOW_BEST,
  GET_HINT_HEATMAP_FULL,
  MAP_HELP,
  GET_HINT_HEATMAP_ZONE,
  SCORES_WINNER,
  GET_SCORES_WINNER,
  UPDATED_POWER_DISPLAY
} from "./types";
import {
  helpBestMoves,
  helpShowBest,
  helpHeatmapFull,
  helpHeatmapZone,
  scoresWinner
} from "../../api/board";

function* fetchGetHintBestMoves_saga(action) {
  const { payload } = action;
  try {
    const res = yield call(helpBestMoves, getToken(), payload.game_id, payload.count);
    if (res.hint) {
      let newObj = {};
      res.hint.forEach((key, i) => {
        newObj[key.move] = i+1
      })
      yield put({ type: SINGLE_HELP, payload: newObj})
    }
  } catch (e) {
    //throw e;
  }
}

function* fetchGetHintShowBest_saga(action) {
  const { payload } = action;
  try {
    const res = yield call(helpShowBest, getToken(), payload.game_id, payload.moves);
    if (res.hint) {
      const newObj = {}
      newObj[res.hint] = 'circle'
      yield put({ type: SINGLE_HELP, payload: newObj})
    }
  } catch (e) {
    //throw e;
  }
}

function* fetchGetHintHeatmapFull_saga(action) {
  const { payload } = action;
  try {
    const res = yield call(helpHeatmapFull, getToken(), payload.game_id);
    if (res.hint) {
      yield put({ type: MAP_HELP, payload: res.hint})
    }
  } catch (e) {
    //throw e;
  }
}

function* fetchGetHintHeatmapZone_saga(action) {
  const { payload } = action;
  try {
    const res = yield call(helpHeatmapZone, getToken(), payload.game_id, payload.isQuarter);
    if (res.hint) {
      yield put({ type: MAP_HELP, payload: { zone: res.hint, isQuarter: payload.isQuarter}})
    }
  } catch (e) {
    //throw e;
  }
}


// my function
function* updatedPowerDisplay(action){
  const { payload } = action;

  var translateValue = 16;
  var warningValue  = 45;

  if (payload === false){
    const res = []
    for (var i = 0; i < 13; i++){
      res.push([]);
      for (var k = 0; k < 13; k++){
        res[i].push(0);
      }
    }
    return put({ type: MAP_HELP, payload: res, colorClass: "greenstone"});
  };

  const res = [];

  for (var i = 0; i < 13; i++){
    var arr = [];

    for (var k = 0; k < 13; k++){
      // для черных
      if (payload[i][k] === 1){
        arr.push({number: translateValue, color: "greenstone"});
      }
      else if (payload[i][k] === -1) {
        arr.push({number: translateValue, color: "redstone"});
      }
      else if (payload[i][k] === 2) {
        arr.push({number: warningValue, color: "greenstone null-opacity"});
      }
      else if (payload[i][k] === -2) {
        arr.push({number: warningValue, color: "redstone null-opacity"});
      }
      else {
        arr.push(0);
      }
    }
    res.push(arr);
  }

  yield put({ type: MAP_HELP, payload: res, colorClass: "greenstone"});
}

function* fetchGetHintScoresWinner_saga(action) {
  const { payload } = action;
  try {
    const res = yield call(scoresWinner, getToken(), payload.game_id);
    if (res.hint) {
      yield put({ type: SCORES_WINNER, payload: res.hint})
    }
  } catch (e) {
    //throw e;
  }
}

export function* boardSaga() {
  yield all([
    takeLatest(GET_HINT_BEST_MOVES, fetchGetHintBestMoves_saga),
    takeLatest(GET_HINT_SHOW_BEST, fetchGetHintShowBest_saga),
    takeLatest(GET_HINT_HEATMAP_FULL, fetchGetHintHeatmapFull_saga),
    takeLatest(GET_HINT_HEATMAP_ZONE, fetchGetHintHeatmapZone_saga),
    takeLatest(GET_SCORES_WINNER, fetchGetHintScoresWinner_saga),

    takeLatest(UPDATED_POWER_DISPLAY, updatedPowerDisplay)
  ]);
}
