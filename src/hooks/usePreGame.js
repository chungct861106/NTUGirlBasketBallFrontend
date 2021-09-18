import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { Team, Match } from "../axios";

export const usePreGame = () => {
  const [preGameTable, setPreGameTable] = useState([]);
  const [editable, setEditable] = useState(true);
  const [cycle3, setCycle3] = useState(0);
  const [cycle4, setCycle4] = useState(0);
  const [mapDict, setMapDict] = useState({});

  useEffect(() => {
    effect();

    async function effect() {
      const preGameData = await Team.GetTeam();
      let ifEditable = false;
      let newData = [];
      Object.entries(preGameData).forEach((data) => {
        if (
          data[1].session_preGame === "Not Arranged" ||
          data[1].session_preGame === "--"
        ) {
          ifEditable = true;
        }
        newData.push({
          team_id: data[1]._id,
          name: data[1].name,
          session_preGame:
            data[1].session_preGame === "Not Arranged" ||
            data[1].session_preGame === "--"
              ? "--"
              : data[1].session_preGame,
        });
      });
      setPreGameTable(() => newData);
      setEditable(() => ifEditable);

      try {
        // initial cycle3, 4
        let totalCycle = preGameData.length;
        if (totalCycle - (totalCycle % 3) * 4 >= 0) {
          setCycle3(() => (totalCycle - (totalCycle % 3) * 4) / 3);
          setCycle4(() => totalCycle % 3);
        } else {
          console.log("in preGame, error with the team number");
        }
      } catch (err) {
        console.log("in preGame, initial false");
      }
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      let updateDict = cycleDict();
      Object.entries(preGameTable).forEach((team, index) => {
        const teamSessionGroup = team[1].session_preGame[0];
        if (
          teamSessionGroup in updateDict &&
          team[1].session_preGame !== "--"
        ) {
          updateDict[teamSessionGroup][team[1].session_preGame] = {
            team_id: team[1].team_id,
            name: team[1].name,
            session: team[1].session_preGame,
          };
        }
      });

      setMapDict(() => updateDict);
    }, 500);
  }, [cycle3, cycle4, preGameTable]);

  const cycleDict = () => {
    let dict = {};
    // A = 65
    for (let i = 0; i < parseInt(cycle3) + parseInt(cycle4); i++) {
      let alphaChar = String.fromCharCode(65 + i);
      let ACycleDict = {};
      for (let j = 0; j < 3; j++) {
        let alpha = alphaChar + (j + 1).toString();
        ACycleDict[alpha] = { session: alpha };
      }
      if (i >= cycle3) {
        let alpha = alphaChar + (4).toString();
        ACycleDict[alpha] = { session: alpha };
      }
      dict[alphaChar] = ACycleDict;
    }
    return dict;
  };

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
    // [team DB]
    try {
      const assignSuccess = await Team.Assign(preGameTable);
    } catch (err) {
      return err;
    }

    // [editable]
    const notFillSession = preGameTable.reduce((acc, cur) => {
      return acc || cur.session_preGame === "--";
    }, false);
    setEditable(() => notFillSession);

    // [match DB]
    // get preGameData
    const stage = "preGame";
    const preGameData = await Match.GetMatch({ stage });

    // delete original preGameData
    if (preGameData.length > 0) {
      preGameData.map(async (data) => {
        await Match.Delete(data._id);
      });
      generateModal("result");
    } else {
      generateModal("not fill session yet");
    }

    // create match
    if (!notFillSession) {
      Object.entries(mapDict).map((sessionGroup, index) => {
        console.log(sessionGroup);
        let teams = Object.entries(sessionGroup[1]);
        for (let i = 0; i < teams.length; i++) {
          for (let j = i + 1; j < teams.length; j++) {
            if (i !== j) {
              const res = Match.Create(
                teams[i][1].team_id,
                teams[j][1].team_id,
                "preGame",
                sessionGroup[0]
              );
            }
          }
        }
      });
    }
  };

  return {
    saveResult,
    setCycle3,
    setCycle4,
    editable,
    setEditable,
    preGameTable,
    setPreGameTable,
    mapDict,
  };
};
