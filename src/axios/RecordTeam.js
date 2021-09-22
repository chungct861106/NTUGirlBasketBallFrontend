import axios from "axios";
import { token } from "../axios";

export const GetRecordTeamObject = (serverURL) => {
  return {
    Create: async (recordTeamObject) => {
      try {
        console.log("in axios, recordTeam.create: ", recordTeamObject);
        let response = await axios({
          method: "POST",
          url: serverURL + "recordTeam/create",
          data: recordTeamObject,
          headers: { Authorization: token },
        });
        return response.data.data;
      } catch (err) {
        return `[Error][Match][Create]` + err;
      }
    },
    Delete: async (recordTeam_id) => {
      try {
        let response = await axios({
          method: "DELETE",
          url: serverURL + "recordTeam/delete",
          data: { recordTeam_id },
          headers: { Authorization: token },
        });
        return response.data.data;
      } catch (err) {
        return err.response.message;
      }
    },
  };
};
