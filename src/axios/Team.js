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

    Update: async ({
      team_id,
      session_preGame,
      session_interGame,
      name,
      department,
      user_id,
    }) => {
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
    Assign: async (TeamObj) => {
      try {
        let response = await axios({
          method: "POST",
          url: serverURL + "teams/assign",
          data: {
            TeamObj,
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

    GetTeam: async ({
      team_id,
      session_preGame,
      session_interGame,
      name,
      department,
      user_id,
    }) => {
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
  };
};
