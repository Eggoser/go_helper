export * from "./GameBoard";


{!hint ? (
  <GameInfo
    you={you}
    opponent={opponent}
    stepColor={stepColor}
    yourColor={yourColor}
    turns={turns}
    enemyPass={enemyPass}
    stepMain={stepMain}
    times={times}
    stepTwo={stepTwo} />
) : (
  <Help
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
  />
)}
