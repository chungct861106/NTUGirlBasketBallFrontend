import { useState, useEffect, useMemo } from "react";
import { Team, Match, RecordTeamAPI } from "../axios";
import { Modal } from "antd";

export const useInterGame = () => {
  const [interGameTable, setInterGameTable] = useState([]);
  const [interTeamNum, setInterTeamNum] = useState(8);
  const [editable, setEditable] = useState(false);
  const [mapDict, setMapDict] = useState({});
  let matchCount = 0;

  useEffect(() => {
    (async () => {
      const getMatchBySession = async (alpha) => {
        let preGameMatch;
        try {
          preGameMatch = await Match.GetMatch({
            stage: "preGame",
            stage_session: alpha,
          });
          return preGameMatch;
        } catch (err) {
          console.log("in useInterGame, initial, preGameMatch fail");
          return null;
        }
      };

      const generateWinnerDict = async (matchData) => {
        let dict = {};
        try {
          await Promise.all(
            matchData.map(async (aMatch) => {
              // initial team object
              // count score
              await Promise.all(
                ["home", "away"].map(async (type) => {
                  if (!(aMatch[type].name in dict)) {
                    dict[aMatch[type].name] = {
                      score: 0,
                      winCount: 0,
                      team_id: aMatch[type]._id,
                    };
                  }
                  try {
                    let teamScoreData = await RecordTeamAPI.GetRecordTeam({
                      match_id: aMatch._id,
                      team_id: aMatch[type]._id,
                    });
                    let teamScore =
                      teamScoreData[0].score1 +
                      teamScoreData[0].score2 +
                      teamScoreData[0].score3 +
                      teamScoreData[0].score4;
                    dict[aMatch[type].name].score += teamScore;
                  } catch (err) {
                    console.log("assinging score fail");
                  }
                })
              );
              // count win
              let winnerType = aMatch.winner;
              dict[aMatch[winnerType].name].winCount += 1;
            })
          );
        } catch (err) {
          console.log("generateWinnerDict fail");
        }

        return dict;
      };

      // pseudo code
      // get match.preGame Data (v)
      // for each AlphabatCycle, select into interGame Team (v)
      //    select advanced team
      //    - make dictionary, every team map to win count
      //    - dictionary to array, sort

      let interGameData = await Team.GetTeam({});
      interGameData = interGameData.filter(
        (team) => team.session_interGame !== -1
      );

      console.log("initial filter:", interGameData);

      if (interGameData.length === 0) {
        // get advanced team
        for (let i = 0; i < 3; i++) {
          let alphaChar = String.fromCharCode(65 + i);
          let matchData;
          try {
            matchData = await getMatchBySession(alphaChar);
          } catch (err) {
            console.log("in useInterGame, matchData, fail", err);
          }
          if (matchData === null) {
            break;
          }
          // find the advanced team
          let winnerDict;
          try {
            winnerDict = await generateWinnerDict(matchData);
          } catch (err) {
            console.log("generateWinnerDict fail");
          }

          // object to array & sort
          const sortDict = Object.entries(winnerDict).sort(function (a, b) {
            return a[1].winCount < b[1].winCount ? 1 : -1;
          });

          // select 1 in 3, 2 in 4
          // 1 1 1 =>看比分
          // 2 1 0 =>

          // 3 2 1 0 =>
          // 2 2 2 0 =>看比分
          // 3 1 1 1 => 看比分
          // 3 3 0 0 =>
          let sortByScore = Object.entries(sortDict).sort(function (a, b) {
            if (a[1][1].winCount < b[1][1].winCount) return 1;
            if (a[1][1].winCount > b[1][1].winCount) return -1;
            if (a[1][1].score < b[1][1].score) return 1;
            if (a[1][1].score > b[1][1].score) return -1;
            return 0;
          });

          console.log("sortByScore: ", sortByScore);

          await Team.Assign([
            {
              team_id: sortByScore[0][1][1].team_id,
              session_interGame: 0,
            },
          ]);
          if (sortDict.length === 4) {
            await Team.Assign([
              {
                team_id: sortByScore[1][1][1].team_id,
                session_interGame: 0,
              },
            ]);
          }
        }
        interGameData = await Team.GetTeam({ session_interGame: 0 });
      }

      let newData = [];
      Object.entries(interGameData).forEach((data) => {
        newData.push({
          team_id: data[1]._id,
          name: data[1].name,
          session_interGame:
            data[1].session_interGame === 0 ? "--" : data[1].session_interGame,
        });
      });
      setInterGameTable(newData);
      setInterTeamNum(newData.length);

      const notFillSession = newData.reduce((acc, cur) => {
        return acc || cur.session_interGame === "--";
      }, false);
      setEditable(() => notFillSession);
    })();
  }, []);

  const generateModal = (action) => {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "This is a notification message",
      content:
        action === "result"
          ? `${secondsToGo} 秒後跳轉至結果頁面`
          : `目前隊伍資訊已儲存`,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      if ((secondsToGo >= 0) & (action === "result")) {
        modal.update({
          content: `${secondsToGo} 秒後跳轉至結果頁面`,
        });
      }
    }, 1000);
    setTimeout(() => {
      if (action === "result") {
        clearInterval(timer);
      }
      modal.destroy();
      setEditable(action === "result" ? false : true);
    }, (secondsToGo + 1) * 1000);
  };

  const saveResult = async () => {
    // update [team] session_interGame
    try {
      const assignSuccess = await Team.Assign(interGameTable);
      console.log("update team successfully");
    } catch (err) {
      return err;
    }

    // eitable

    const notFillSession = interGameTable.reduce((acc, cur) => {
      return acc || cur.session_interGame === "--";
    }, false);
    setEditable(() => notFillSession);

    // check if [match] exist
    const stage = "interGame";
    const interGameData = await Match.GetMatch({ stage });
    if (interGameData.length > 0) {
      interGameData.map(async (data) => {
        await Match.Delete(data._id);
      });
      generateModal("result");
    } else {
      generateModal("not fill session yet");
    }
    // create [match]
    // if(!notFillSession){
    console.log("in save :", interGameTable, mapDict);
    let tempArr = [];
    Object.entries(mapDict).map(async (team, index) => {
      tempArr.push(team);
    });
    createMatch(tempArr);
  };

  useMemo(() => {
    let updateDict = {};
    for (let i = 1; i <= interTeamNum; i++) {
      updateDict[i.toString()] = { session_interGame: i.toString() };
    }
    Object.entries(interGameTable).forEach((team) => {
      if (team[1].session !== "--") {
        updateDict[team[1].session_interGame] = {
          team_id: team[1].team_id,
          name: team[1].name,
          session_interGame: team[1].session_interGame,
        };
      }
    });
    setMapDict(() => updateDict);
  }, [interTeamNum, interGameTable]);

  const createMatch = (arr) => {
    if (arr.length === 1) {
      matchCount += 1;
      const res = Match.Create(
        null,
        arr[0][1].team_id,
        "interGame",
        matchCount.toString()
      );
    } else if (arr.length === 2) {
      matchCount += 1;
      const res = Match.Create(
        arr[0][1].team_id,
        arr[1][1].team_id,
        "interGame",
        matchCount.toString()
      );
    } else {
      const sepIndex = Math.ceil(arr.length / 2);
      createMatch(arr.slice(0, sepIndex));
      createMatch(arr.slice(sepIndex, arr.length));
    }
  };

  return {
    interGameTable,
    setInterGameTable,
    interTeamNum,
    setInterTeamNum,
    mapDict,
    setMapDict,
    saveResult,
    editable,
    setEditable,
  };
};
