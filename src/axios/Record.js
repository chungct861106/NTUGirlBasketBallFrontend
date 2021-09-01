import axios from "axios";
import { token } from "../axios";
export const GetRecordObject = (serverURL) => {
  return {
    CreateTeamRecord: async (match_id, team_id) => {
      try {
        let response = await axios({
          method: "POST",
          url: serverURL + "records/createTeamRecord",
          data: { match_id, team_id },
          headers: { Authorization: token },
        });
        return response;
      } catch (err) {
        return `[Error][Record][CreateTeamRecord]`;
      }
    },
  };
};
