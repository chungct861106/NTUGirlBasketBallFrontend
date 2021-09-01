import React, { useState } from "react";
import { Form, Input, Select, Modal } from "antd";
import { User } from "../axios";
import Department from "../department.json";

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    sm: {
      span: 10,
    },
  },
};

export default function SignupModel(props) {
  const [form] = Form.useForm();
  const [issignup, setsignup] = useState(false);
  const [showWarn, setShowWarn] = useState(false);

  const handleOK = async () => {
    console.log(form.getFieldsValue());
    const response = await User.Create(form.getFieldsValue());
    if (response.code === 200) {
      setsignup(true);
      setShowWarn(false);
      return;
    }

    setShowWarn(true);
    form.setFields(response.data);
    console.log(response.data);
  };

  const handleCancel = () => {
    props.setVisible(false);
  };

  return (
    <Modal
      visible={props.visible}
      onOk={() => {
        if (issignup) {
          props.setVisible(false);
          setsignup(false);
        } else form.submit();
      }}
      onCancel={handleCancel}
      afterClose={() => {
        setShowWarn(false);
        form.resetFields();
      }}
      closable={issignup ? false : true}
      cancelButtonProps={issignup && { style: { display: "none" } }}
    >
      {issignup && <h2 style={{ textAlign: "center" }}>註冊成功</h2>}
      {!issignup && (
        <Form
          {...formItemLayout}
          name="register"
          form={form}
          onFinish={handleOK}
        >
          <h2 style={{ textAlign: "center" }}>註冊</h2>
          <h4
            style={{
              textAlign: "center",
              visibility: showWarn ? "" : "hidden",
              color: "red",
            }}
          >
            註冊失敗!
          </h4>
          <Form.Item
            name="department"
            label="使用者系所"
            hasFeedback
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select your department">
              {Object.keys(Department.info).map((part, index) => (
                <Option key={index} value={part}>
                  {Department.info[part]["zh"]}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="account"
            label="使用者帳號"
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please input your account!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="admin"
            label="註冊身份"
            hasFeedback
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Select your identity">
              <Option key={1} value="administer">
                主辦人員
              </Option>
              <Option key={2} value="team">
                系隊代表
              </Option>
              <Option key={3} value="recorder">
                紀錄人員
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="password"
            label="密碼"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="passwordconfirm"
            label="確認密碼"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="email"
            label="使用者信箱"
            rules={[
              {
                type: "email",
                message: "Email's format is incorrect.",
              },
              {
                required: true,
              },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
}
