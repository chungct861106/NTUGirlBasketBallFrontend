import axios from "axios";
import { token } from "../axios";
export const GetTeamObject = (serverURL) => {
  return {
    Create: async (name, department) => {
      try {
        let response = await axios({
          method: "POST",
          url: serverURL + "teams/create",
          data: { name, department },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return err.response.message;
      }
    },

    Update: async (
      team_id = null,
      session_preGame = null,
      session_interGame = null,
      name = null,
      department = null,
      user_id = null
    ) => {
      try {
        let response = await axios({
          method: "POST",
          url: serverURL + "teams/update",
          data: {
            team_id,
            session_preGame,
            session_interGame,
            name,
            department,
            user_id,
          },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return err.response.message;
      }
    },
    Assign: async (
      team_id,
      session_preGame = null,
      session_interGame = null
    ) => {
      try {
        let response = await axios({
          method: "POST",
          url: serverURL + "teams/assign",
          data: {
            team_id,
            session_preGame,
            session_interGame,
          },
          headers: {
            Authorization: token,
          },
        });
        return response.data;
      } catch (err) {
        return err.response.message;
      }
    },

    Delete: async (team_id) => {
      try {
        let response = await axios({
          method: "DELETE",
          url: serverURL + "teams/delete",
          data: { team_id },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return err.response.message;
      }
    },

    GetTeam: async (
      team_id = null,
      session_preGame = null,
      session_interGame = null,
      name = null,
      department = null,
      user_id = null
    ) => {
      try {
        let response = await axios({
          method: "GET",
          url: serverURL + "teams/data",
          params: {
            team_id,
            session_preGame,
            session_interGame,
            name,
            department,
            user_id,
          },
          headers: { Authorization: token },
        });
        return response.data.data;
      } catch (err) {
        return err.response.data.message;
      }
    },

    CheckFillSession: async (sessionType) => {
      try {
        let response = await axios({
          method: "GET",
          url: serverURL + "teams/data",
          headers: { Authorization: token },
        });

        if (sessionType === "session_preGame") {
          console.log(
            "in axios team, check session_preGame, ",
            response.data.data
          );
        }
        return response.data.data;
      } catch (err) {
        return err.response.data.message;
      }
    },
  };
};
