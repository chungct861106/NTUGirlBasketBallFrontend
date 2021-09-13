import axios from "axios";
import { GetPlayerObject } from "./axios/Player";
import { GetTeamObject } from "./axios/Team";
import { GetUserObject } from "./axios/User";
import { GetTimeObject } from "./axios/Time";
import { GetRecorderObject } from "./axios/Recorder";
import { GetMatchObject } from "./axios/Match";
import { GetPostObject } from "./axios/Post";
import { GetRecordObject } from "./axios/Record";

const serverURL = "https://girlbasketball.herokuapp.com/";
const testUsers = {
  adiminister: [
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJhY2NvdW50IjoidGhvbXNvbjg2MTEwNiIsInVzZXJuYW1lIjoidGhvbXNvbiIsImVtYWlsIjoidGhvbXNvbjg2MTEwNkBnbWFpbC5jb20iLCJhY3RpdmUiOjEsImFkaW0iOiJhZG1pbmlzdGVyIiwiaWF0IjoxNjIxNjU3MTE4LCJleHAiOjE2Mzk2NTcxMTh9.rx55CJNzevSUFJUP1EFjukPTgs47s2E42Ex-XHe_FdU",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0LCJhY2NvdW50IjoidGhvc21vbjg3MTEwNiIsInVzZXJuYW1lIjoidGhvbXNvbjIiLCJlbWFpbCI6InRob3Ntb244NzExMDZAZ21haWwuY29tIiwiYWN0aXZlIjoxLCJhZGltIjoiYWRtaW5pc3RlciIsImlhdCI6MTYyMTY1NzA2MiwiZXhwIjoxNjM5NjU3MDYyfQ.4-fwrbsyCKAkzwwWzZyBdIvceuO0DKAxPVs69PzEGRY",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJhY2NvdW50IjoidGhvc21vbjg4MTEwNiIsInVzZXJuYW1lIjoidGhvbXNvbjMiLCJlbWFpbCI6InRob3Ntb244ODExMDZAZ21haWwuY29tIiwiYWN0aXZlIjoxLCJhZGltIjoiYWRtaW5pc3RlciIsImlhdCI6MTYyMTY1NzA4NCwiZXhwIjoxNjM5NjU3MDg0fQ.PS68aMdUqW6chb2wEg0w8h7KPGm9Vyn-QenLwH9K_qU",
  ],

  team: [
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJhY2NvdW50IjoiY2h1bmdjdCIsInVzZXJuYW1lIjoiQ2h1bmdjdCIsImVtYWlsIjoicjA5NTIyNjI0QG51dC5lZHUudHciLCJhY3RpdmUiOjEsImFkaW0iOiJ0ZWFtIiwiaWF0IjoxNjIxNjU2ODgxLCJleHAiOjE2Mzk2NTY4ODF9.DXGYx-BQjcOuQCxid5TzWD1hfXwN6ofmiHN26M6CXfM",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo2LCJhY2NvdW50IjoiY2h1bmdjdDIiLCJ1c2VybmFtZSI6IkNodW5nY3QyIiwiZW1haWwiOiJyMTA1MjI2MjRAbnR1LmVkdS50dyIsImFjdGl2ZSI6MSwiYWRpbSI6InRlYW0iLCJpYXQiOjE2MjE2NTY5NzIsImV4cCI6MTYzOTY1Njk3Mn0.gfQXe6jHVxOMl7_hMYvK7Qvzh04hfzAxHvHZpbyJZaw",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3LCJhY2NvdW50IjoiY2h1bmdjdDMiLCJ1c2VybmFtZSI6IkNodW5nY3QzIiwiZW1haWwiOiJyMTE1MjI2MjRAbnR1LmVkdS50dyIsImFjdGl2ZSI6MSwiYWRpbSI6InRlYW0iLCJpYXQiOjE2MjE2NTY5MjUsImV4cCI6MTYzOTY1NjkyNX0.POeu6ENMWBSjbP9mPlaPc98KJci-DQx25RPXHg4YCDo",
  ],
  recorder: [
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJhY2NvdW50IjoiY2h1bmdjdHRlc3QiLCJ1c2VybmFtZSI6IkNodW5nY3R0ZXN0IiwiZW1haWwiOiJyMDk1MjI2MjRAbnR1LmVkdS50dyIsImFjdGl2ZSI6MSwiYWRpbSI6InJlY29yZGVyIiwiaWF0IjoxNjIxNjU2ODE0LCJleHAiOjE2Mzk2NTY4MTR9.z4CTNXZqBofLpJDxE-PE8uyGcZTwLEPhkYzC73kUuzs",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo4LCJhY2NvdW50IjoiY2h1bmdjdHRlc3QyIiwidXNlcm5hbWUiOiJDaHVuZ2N0dGVzdDIiLCJlbWFpbCI6InIwOTcyMjYyNEBudHUuZWR1LnR3IiwiYWN0aXZlIjoxLCJhZGltIjoicmVjb3JkZXIiLCJpYXQiOjE2MjE2NTY4NDIsImV4cCI6MTYzOTY1Njg0Mn0.3-9QGyTv4wZ7B4HG-Az-90zAX-CARjeqGUuL0QR_Gyg",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJhY2NvdW50IjoiY2h1bmdjdHRlc3QzIiwidXNlcm5hbWUiOiJDaHVuZ2N0dGVzdDMiLCJlbWFpbCI6InIxMDcyMjYyNEBudHUuZWR1LnR3IiwiYWN0aXZlIjoxLCJhZGltIjoicmVjb3JkZXIiLCJpYXQiOjE2MjE2NTY4NjIsImV4cCI6MTYzOTY1Njg2Mn0.SQXJc-cM496v6AdXi6ERNIJTANQSF5aDZuIwRRR2Aus",
  ],
};

// 調整這去改變目前使用者身分 Ex: testUser.team[0] (0號系隊使用者)
export let token;

export const gettoken = () => {
  return token;
};

export const Login = async (account, password) => {
  // [Must] account =    使用者帳號
  // [Must] password =   使用者密碼

  try {
    let response = await axios({
      method: "PUT",
      url: "http://localhost:4000/" + "users/login",
      data: { account, password },
    });
    token = response.data.data.token;
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};

export const CheckToken = async (storageToken) => {
  if (!storageToken) return;
  console.log(storageToken.slice(1, -1));
  try {
    let response = await axios({
      method: "GET",
      url: "http://localhost:4000/" + "users/checkToken",
      params: { token: storageToken.slice(1, -1) },
    });
    token = storageToken.slice(1, -1);
    return response.data;
  } catch (err) {
    return err.response.data;
  }
};
export const GenerateImageURL = async (image) => {
  try {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "ntugirlbasketball");
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/delpywtpj/image/upload",
      data
    );
    return { code: response.status, url: response.data.url };
  } catch (err) {
    return { code: 400, message: err.response.data };
  }
};

export const Player = GetPlayerObject("http://localhost:4000/");
export const User = GetUserObject("http://localhost:4000/");
export const Team = GetTeamObject("http://localhost:4000/");
export const Time = GetTimeObject("http://localhost:4000/");
export const Match = GetMatchObject("http://localhost:4000/");
export const Recorder = GetRecorderObject(serverURL);
export const Post = GetPostObject(serverURL);
export const Record = GetRecordObject(serverURL);
