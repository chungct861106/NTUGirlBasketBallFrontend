import axios from "axios";
import { token } from "../axios";
export const GetPostObject = (serverURL) => {
  return {
    Create: async (
      type = null,
      title_catagory = null,
      title_content = null,
      content = null
    ) => {
      console.log(
        "in axios, create: ",
        type,
        title_catagory,
        title_content,
        content
      );
      try {
        let response = await axios({
          method: "POST",
          url: serverURL + "posts/create",
          data: { type, title_catagory, title_content, content },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return err;
      }
    },
    Update: async (
      post_id = null,
      title_content = null,
      content = null,
      active = null,
      type = null,
      title_catagory = null
    ) => {
      try {
        let response = await axios({
          method: "POST",
          url: serverURL + "posts/update",
          data: {
            post_id,
            title_content,
            content,
            active,
            type,
            title_catagory,
          },
          headers: { Authorization: token },
        });
        return response.data;
      } catch (err) {
        return err.response.message;
      }
    },
    GetData: async ({
      post_id = null,
      title_content = null,
      content = null,
      active = null,
      type = null,
      title_catagory = null,
    }) => {
      try {
        let response = await axios({
          method: "GET",
          url: serverURL + "posts/getType",
          headers: { Authorization: token },
          params: {
            post_id,
            title_content,
            content,
            active,
            type,
            title_catagory,
          },
        });
        return response.data.data;
      } catch (err) {
        return err.response.data.message;
      }
    },
    Delete: async (post_id) => {
      try {
        let response = await axios({
          method: "DELETE",
          url: serverURL + "posts/delete",
          data: { post_id },
          headers: { Authorization: token },
        });
        return response.data.data;
      } catch (err) {
        return err.response.message;
      }
    },

    // GetTypeContent: async (type) => {
    //   try {
    //     let response = await axios({
    //       method: "GET",
    //       url: serverURL + "posts/getType",
    //       params: { type },
    //       // headers: { Authorization: token }
    //     });
    //     return response.data;
    //   } catch (err) {
    //     return `[Error][Post][GetTypeContent]`;
    //   }
    // },
    // DeletePost: async (post_id) => {
    //   try {
    //     let response = await axios({
    //       method: "DELETE",
    //       url: serverURL + "posts/deletePost",
    //       data: { post_id },
    //       headers: { Authorization: token },
    //     });
    //     return response.data;
    //   } catch (err) {
    //     throw err;
    //   }
    // },
  };
};
