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
        return err.response.data;
      }
    },

    Status: async (id, status) => {
      // [Must] id       User ID
      // [Must] status   ['已報名', '已繳費', '審核中', '未報名', '未繳費']
      // [Myst] token    {adim:adimister}

      try {
        let response = await axios({
          method: "POST",
          url: serverURL + "teams/status",
          data: { id, status },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return `[Error][Team][SetStatus]` + err;
      }
    },

    Delete: async (id) => {
      try {
        let response = await axios({
          method: "DELETE",
          url: serverURL + "teams/delete",
          data: { team_id: id },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },

    GetTeamByID: async (id) => {
      // [Must] id       User ID
      // [Must] token    {adim:adimister}

      try {
        let response = await axios({
          method: "GET",
          url: serverURL + "teams/data",
          query: { user_id: id },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },

    GetALLTeam: async () => {
      // [Must] token    {adim:adimister}

      try {
        let response = await axios({
          method: "GET",
          url: serverURL + "teams/getALL",
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return `[Error][Team][GetALL]` + err;
      }
    },
    GetTeamIDbyUser: async (user_id) => {
      // [Must] token    {adim:adimister}
      try {
        let response = await axios({
          method: "GET",
          url: serverURL + "teams/data",
          headers: { Authorization: token },
          query: { user_id },
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },
    GetInterGame: async () => {
      // [Must] token {adim: adiminister}
      try {
        let response = await axios({
          method: "GET",
          url: serverURL + "teams/getInterGame",
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return `[Error][Team][GetInterGame]` + err;
      }
    },

    Update: async (team_id, name, department) => {
      try {
        let response = await axios({
          method: "POST",
          url: serverURL + "teams/update",
          data: { team_id, name, department },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },
    UpdatePaid: async (team_id, status) => {
      // [Must] id       Team name
      // [Must] name     Team department
      // [Must] token    {adim:team}

      try {
        let response = await axios({
          method: "POST",
          url: serverURL + "teams/updatePaid",
          data: { team_id, status },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return `[Error][Team][UpdatePaid]` + err;
      }
    },

    UpdateSession: async (sessionType, id, teamSession) => {
      // [Must] sessionType     preGame || interGame
      // [Must] id              Team ID
      // [Must] teamSession     Team assined session
      // [Must] token           {adim: adimister}

      try {
        let response = await axios({
          method: "POST",
          url: serverURL + "teams/update_session",
          data: { sessionType, id, teamSession },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return `[ERROR][Team][Update_session]` + err;
      }
    },

    CheckFillSession: async (sessionType) => {
      try {
        let response = await axios({
          method: "GET",
          url: serverURL + "teams/checkFillSession",
          params: { sessionType },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        throw err;
      }
    },
  };
};
