import React from "react";
import styled from "styled-components";
import Players from "../GameInfo/components/Players/Players";
import {
  HEATMAP_FULL,
  HEATMAP_ZONE_QUARTER,
} from "./types";

const Wrapper = styled.div`
  width: 46%;
  margin-left: 25px;
`;

const HelpWrapper = styled.div`
  margin-top: 23px;
  max-height: 508px;
  overflow: scroll;
  overflow-x: hidden;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
`;

const HelpItem = styled.div`
  width: 48%;
  margin-bottom: 10px;
  background: ${(props) => (props.active ? "#29097D" : "#29099E")};
  padding: 10px;
  cursor: pointer;
  color: #fff
`;




const NewHelp = ({
  enemyPass,
  stepColor,
  yourColor,
  you,
  opponent,
  stepMain,
  stepTwo,
  handleHelp,
  activeHelpId,
  scores,
  times,
  moveCount
}) => {
  const BestMove = function(){
    return <HelpItem
            active={activeHelpId === 1}
            onClick={() =>
              scores && handleHelp({ type: "single", id: 1, count: 1 })
            }
          >
          Лучший ход (-3 балла)
        </HelpItem>
  }
  const HotCard = function(){
    return <HelpItem
            active={activeHelpId === HEATMAP_FULL}
            onClick={() =>
              scores && handleHelp({ type: "map", id: HEATMAP_FULL })
            }
          >
            Тепловая карта всей доски. Детализированная (-2 балла)
          </HelpItem>
  }

  const BestThree = function(){
    return <HelpItem
            active={activeHelpId === 16}
            onClick={() =>
              scores && handleHelp({ type: "multiple", multipleHandleCount: 4, id: 16 })
            }
          >
            Показать лучший из заданных 3 ходов (-2 балла)
          </HelpItem>
  }

  const BestPlayer = function(){
    return <HelpItem
            active={activeHelpId === 34}
            onClick={() => scores && handleHelp({ type: "score", id: 34 })}
          >
            Показать игрока с лучшей позицией (-1 балл)
          </HelpItem>
  }

  const BestUtil = function(){
    return <HelpItem
            active={activeHelpId === 42}
            onClick={() => scores && handleHelp({ type: "displayPower", id: 42 })}
          >
            ВКЛЮЧИТЬ УТИЛИТУ ПОДСВЕТКИ ЗОНЫ ВЛИЯНИЯ И ПРЕДУПРЕЖДЕНИЙ О ЗЕВКАХ (БЕСПЛАТНО)
          </HelpItem>
  }

  const experienceLevel = localStorage.getItem("userExperience");
  // console.log(moveCount)
  const maxMoveCount = 70;

  return <div class="hints-div">
          <h1 class="mt-3 mb-3">Не рекомендуем:</h1>

          {(moveCount < maxMoveCount) ?
            <BestMove/> : null
          }
          {(experienceLevel !== 3) ?
            <HotCard/> : null
          }
          {(moveCount < maxMoveCount) ?
            <BestThree/> : null
          }
          {(experienceLevel !== 3) ?
            <BestPlayer/> : null
          }
          {(moveCount > maxMoveCount) ?
            <BestUtil/> : null
          }

          <h1 class="mt-5 mb-3">Рекомендуем:</h1>
          {(!(moveCount < maxMoveCount)) ?
            <BestMove/> : null
          }
          {(experienceLevel === 3) ?
            <HotCard/> : null
          }
          {(!(moveCount < maxMoveCount)) ?
            <BestThree/> : null
          }
          {(experienceLevel === 3) ?
            <BestPlayer/> : null
          }
          {(!(moveCount > maxMoveCount)) ?
            <BestUtil/> : null
          }
        </div>
}

const Help = ({
    enemyPass,
    stepColor,
    yourColor,
    you,
    opponent,
    stepMain,
    stepTwo,
    handleHelp,
    activeHelpId,
    scores,
    times,
    moveCount
  }) => {
  return (
    <Wrapper>
      <Players
        enemyPass={enemyPass}
        opponent={opponent}
        you={you}
        stepColor={stepColor}
        yourColor={yourColor}
        stepMain={stepMain}
        stepTwo={stepTwo}
        times={times}
      />
      <HelpWrapper>
        <NewHelp
          enemyPass={enemyPass}
          stepColor={stepColor}
          yourColor={yourColor}
          you={you}
          opponent={opponent}
          stepMain={stepMain}
          stepTwo={stepTwo}
          handleHelp={handleHelp}
          activeHelpId={activeHelpId}
          scores={scores}
          times={times}
          moveCount={moveCount}
        />
      </HelpWrapper>
    </Wrapper>
  );
};

export default Help;
