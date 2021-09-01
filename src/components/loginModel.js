import React, { useRef, useState, useEffect } from "react";
import { Modal, Form, Input } from "antd";
import { usePages } from "../hooks/usePages";
import { Login, User } from "../axios";

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

export default function LoginModel(props) {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const emailRef = useRef();
  const { setUserInfo } = usePages();

  const [showWarn, setShowWarn] = useState("");
  const [showForgetPw, setShowForgetPw] = useState(false);
  const [form] = Form.useForm();

  const handleOK = async () => {
    if (!showForgetPw) {
      const response = await Login(
        usernameRef.current.props.value,
        passwordRef.current.props.value
      );
      if (response.code === 200) {
        localStorage.setItem("userInfo", JSON.stringify(response.data.token));
        setUserInfo(response.data);
        props.setVisible(false);
        setShowWarn("");
        return;
      }
      setShowWarn(response.data);
    } else {
      const response = await User.SendRemindEmail(emailRef.current.props.value);
      console.log(response);
      if (response.code === 200) {
        setShowWarn("");
        return;
      }
      setShowWarn(response.data);
    }

    form.resetFields();
  };

  const handleForgotPw = () => {
    setShowForgetPw(true);
  };

  useEffect(() => {
    setShowWarn(false);
  }, [showForgetPw]);

  return (
    <div>
      <Modal
        visible={props.visible}
        onOk={handleOK}
        onCancel={
          showForgetPw
            ? () => setShowForgetPw(false)
            : () => props.setVisible(false)
        }
        afterClose={() => {
          setShowWarn(false);
          setShowForgetPw(false);
        }}
        cancelText={showForgetPw ? "返回登入" : "Cancel"}
      >
        <Form {...formItemLayout} style={{ textAlign: "center" }} form={form}>
          {showForgetPw ? (
            <React.Fragment>
              <h2 style={{ textAlign: "center" }}>寄密碼到您的信箱</h2>
              <h4
                style={{
                  textAlign: "center",
                  color: "red",
                }}
              >
                {showWarn}
              </h4>
              <Form.Item name="email" label="Email">
                <Input ref={emailRef} />
              </Form.Item>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <h2 style={{ textAlign: "center" }}>登入</h2>
              <h4
                style={{
                  textAlign: "center",
                  color: "red",
                }}
              >
                {showWarn}
              </h4>
              <Form.Item name="username" label="Username">
                <Input ref={usernameRef} />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password ref={passwordRef} />
              </Form.Item>

              <Form.Item>
                <a
                  aria-hidden={true}
                  style={{ float: "right" }}
                  onClick={handleForgotPw}
                >
                  Forgot password?
                </a>
              </Form.Item>
            </React.Fragment>
          )}
        </Form>
      </Modal>
    </div>
  );
}
