import React, { useState, useEffect } from "react";
import { User } from "../axios";
import DepartmentInfo from "../department.json";
import { Form, Input, Button, Typography, Select, Spin, Card } from "antd";

import { usePages } from "../hooks/usePages";
import styled from "styled-components";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 4,
    span: 16,
  },
};

const ContentBackground = styled.div`
  height: 100vh;
  padding: 50px 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const UserEditor = () => {
  const { userInfo, setUserInfo } = usePages();
  const [onEdit, setEditMode] = useState();
  const [form] = Form.useForm();
  const { id, account, email, department } = userInfo;
  const handleClick = () => {
    if (onEdit)
      (async () => {
        const response = await User.Update(form.getFieldsValue());
        if (response.code === 200) {
          setEditMode(false);
          setUserInfo((Info) => {
            const { account, email, department } = form.getFieldsValue();
            Info.account = account;
            Info.email = email;
            Info.department = department;
            console.log(Info);
            return Info;
          });
          return;
        }
        form.setFields(response.data);
        return;
      })();
    else setEditMode(true);
  };

  return department === undefined ? (
    <Spin size="large" style={{ marginTop: 30 }} />
  ) : (
    <ContentBackground>
      <Card title="個人資訊" style={{ width: 550, margin: 25 }} bordered={true}>
        <Form
          {...layout}
          name="basic"
          form={form}
          initialValues={{ id, account, email, department }}
        >
          <Form.Item label="使用者帳號" name="account" labelAlign="left">
            <Input style={{ width: 300 }} disabled={!onEdit} />
          </Form.Item>
          <Form.Item label="使用者信箱" name="email" labelAlign="left">
            <Input style={{ width: 300 }} disabled={!onEdit} />
          </Form.Item>
          <Form.Item label="使用者學系" name="department" labelAlign="left">
            <Select
              showSearch
              style={{ width: 300 }}
              placeholder="Search to Select"
              optionFilterProp="children"
              disabled={!onEdit}
            >
              {Object.keys(DepartmentInfo.info).map((part, index) => (
                <Option key={index} value={part}>
                  {DepartmentInfo.info[part]["zh"]}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item {...tailLayout}>
            {onEdit ? (
              <React.Fragment>
                <Button
                  style={{ marginRight: 20 }}
                  type="primary"
                  htmlType="submit"
                  onClick={handleClick}
                >
                  Submit
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
              </React.Fragment>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}
          </Form.Item>
        </Form>
      </Card>
    </ContentBackground>
  );
};
