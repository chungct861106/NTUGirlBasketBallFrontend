import axios from "axios";
import { token } from "../axios";
export const GetTimeObject = (serverURL) => {
  return {
    TeamAppointment: async (teamID, timeNumber) => {
      try {
        let response = await axios({
          method: "PUT",
          url: serverURL + "time/team/appoint",
          data: { teamID, timeNumber },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },

    GetTeamTimeByID: async (team_id) => {
      try {
        let response = await axios({
          method: "GET",
          url: serverURL + "time/team",
          params: { team_id },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },
    GetALLTeamTime: async () => {
      try {
        let response = await axios({
          method: "GET",
          url: serverURL + "time/data",
          params: { type: "team" },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },

    GetRecorderTimeByID: async (user_id) => {
      try {
        let response = await axios({
          method: "GET",
          url: serverURL + "/time/recorder",
          params: { user_id },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return `[Error][Time][GetAllTime]` + err;
      }
    },
  };
};
