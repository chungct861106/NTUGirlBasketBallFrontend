import axios from "axios";
import { token } from "../axios";
export const GetUserObject = (serverURL) => {
  return {
    Create: async (userObj) => {
      try {
        let response = await axios({
          method: "POST",
          url: serverURL + "users/create",
          data: userObj,
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },

    AccountActive: async (id) => {
      // [Must] id       User ID
      // [Must] token    使用者登入憑證 {adim: administer}

      try {
        let response = await axios({
          method: "POST",
          url: serverURL + "users/active",
          data: { id: id },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return `[Error][User][Active]` + err;
      }
    },
    AccountDelete: async (id) => {
      // [Must] id       User ID
      // [Must] token    使用者登入憑證 {adim: administer}

      try {
        let response = await axios({
          method: "DELETE",
          url: serverURL + "users/delete",
          data: { user_id: id },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return `[Error][User][Delete]` + err;
      }
    },

    GetAccountByID: async (user_id) => {
      // [Must] id       User ID
      // [Must] token    使用者登入憑證 excpet for {adim: public}
      try {
        let response = await axios({
          method: "GET",
          url: serverURL + "users/data",
          params: { user_id },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },

    GetAccount: async (userQuery) => {
      // [Must] id       User ID
      // [Must] token    使用者登入憑證 {adim: administer}

      try {
        let response = await axios({
          method: "GET",
          url: serverURL + "users/data",
          headers: { Authorization: token },
          params: userQuery,
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },
    SendRemindEmail: async (email) => {
      // [Must] email    使用者信箱

      try {
        let response = await axios({
          method: "PUT",
          url: serverURL + "users/remind",
          data: { email },
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },

    Update: async (updateObj) => {
      // [Must] account
      // [Must] username
      // [Must] email
      // [Must] deparment

      try {
        let response = await axios({
          method: "POST",
          url: serverURL + "users/update",
          data: updateObj,
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return err.response.data;
      }
    },
  };
};
