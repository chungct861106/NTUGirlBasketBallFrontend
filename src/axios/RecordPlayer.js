import axios from "axios";
import { token } from "../axios";

export const GetRecordPlayerObject = (serverURL) => {
  return {
    Create: async (recordPlayerObject) => {
      try {
        console.log("in axios, recordPlayer.create: ", recordPlayerObject);
        let response = await axios({
          method: "POST",
          url: serverURL + "recordPlayer/create",
          data: recordPlayerObject,
          headers: { Authorization: token },
        });
        return response.data.data;
      } catch (err) {
        return `[Error][Match][Create]` + err;
      }
    },
    Delete: async (recordPlayer_id) => {
      try {
        let response = await axios({
          method: "DELETE",
          url: serverURL + "recordPlayer/delete",
          data: { recordPlayer_id },
          headers: { Authorization: token },
        });
        return response.data.data;
      } catch (err) {
        return err.response.message;
      }
    },
    GetRecordPlayer: async ({ recordPlayer_id, match_id, player_id }) => {
      try {
        let response = await axios({
          method: "GET",
          url: serverURL + "recordPlayer/data",
          params: {
            recordPlayer_id,
            match_id,
            player_id,
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
