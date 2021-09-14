import React, { useEffect, useState } from "react";
import { Card, Form, Spin } from "antd";
import { useParams } from "react-router";
import styled from "styled-components";
import { User } from "../axios";

const ContentBackground = styled.div`
  height: 100vh;
  padding: 50px 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
};
export default () => {
  const { user_id } = useParams();
  const [user, setUser] = useState(null);
  useEffect(async () => {
    if (!user_id) return;
    const response = await User.GetAccountByID(user_id);
    if (response.code === 200) setUser(response.data);
  }, []);
  return (
    <ContentBackground>
      <Card title="個人資訊" style={{ width: 550, margin: 25 }} bordered={true}>
        {user ? (
          <Form {...layout}>
            <Form.Item label="使用者帳號">{user.account}</Form.Item>
            <Form.Item label="使用者信箱">{user.email}</Form.Item>
            <Form.Item label="使用者系所">{user.department}</Form.Item>
            <Form.Item label="使用者狀態">
              {user.active ? "未開通" : "已開通"}
            </Form.Item>
          </Form>
        ) : (
          <div className="example">
            <Spin />
          </div>
        )}
      </Card>
    </ContentBackground>
  );
};
