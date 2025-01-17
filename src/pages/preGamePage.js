import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Button, Form, Input, Modal } from "antd";
import { usePreGame } from "../hooks/usePreGame";
import DrawLotsTable from "../components/drawLots/drawLotsTable";
import Cycles from "../components/drawLots/Cycles";

const ContentBackground = styled.div`
  height: 1000px;
  padding: 50px 100px;
`;
const ContentBody = styled.div`
  padding: 50px;
  border: 1px solid black;
  flex-direction: column;
  // justify-content: space-between;
  height: 100%;
`;
const TopDiv = styled.div`
  height: 64px;
`;
const BottomDiv = styled.div`
  width: 100%;
  display: inline-block;
`;
const Title = styled.h1`
  float: left;
`;
const ButtonDiv = styled.div`
  float: right;
  display: flex;
  justify-content: space-between;
  width: 225px;
`;
const StyledButton = styled(Button)`
  height: 33px;
  background-color: #6b9abb;
  border-radius: 10px;
  float: right;
  display: flex;
`;
const LeftBlock = styled.div`
  padding: 5px;
  width: 25%;
  float: left;
`;

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
    // xs: {
    //   span: ,
    // },
    sm: {
      span: 10,
    },
  },
};
const PreGamePage = () => {
  const {
    saveResult,
    setCycle3,
    setCycle4,
    editable,
    setEditable,
    preGameTable,
    setPreGameTable,
    mapDict,
  } = usePreGame();

  const [showChangeCycle, setShowChangeCycle] = useState(false);

  const cycle3Ref = useRef();
  const cycle4Ref = useRef();
  const [form] = Form.useForm();

  const RightBlock = styled.div`
    padding: 5px;
    width: ${editable ? "75%" : "100%"};
    float: left;
  `;

  const handleOK = (e) => {
    setCycle3(cycle3Ref.current.props.value);
    setCycle4(cycle4Ref.current.props.value);
    form.resetFields();
    setShowChangeCycle(false);
  };

  return (
    <React.Fragment>
      <ContentBackground className="ant-layout-content">
        <ContentBody className="site-layout-content">
          <TopDiv>
            <Title>預賽安排</Title>
            <ButtonDiv
              style={{
                justifyContent: editable ? " space-between" : "flex-end",
              }}
            >
              {editable ? (
                <React.Fragment>
                  <StyledButton onClick={() => setShowChangeCycle(true)}>
                    更改循環數目
                  </StyledButton>
                  <StyledButton
                    onClick={() => {
                      saveResult();
                    }}
                  >
                    輸出結果
                  </StyledButton>
                </React.Fragment>
              ) : (
                <StyledButton
                  onClick={() => {
                    setEditable(true);
                  }}
                >
                  更動預賽
                </StyledButton>
              )}
            </ButtonDiv>
          </TopDiv>
          <BottomDiv>
            {editable && (
              <LeftBlock>
                {/* <PreGameTable /> */}
                <DrawLotsTable
                  gameTable={preGameTable}
                  setGameTable={setPreGameTable}
                />
              </LeftBlock>
            )}
            <RightBlock>
              <Cycles mapDict={mapDict} editable={editable} />
            </RightBlock>
          </BottomDiv>
        </ContentBody>
      </ContentBackground>

      <React.Fragment>
        <Modal
          visible={showChangeCycle}
          onOk={(e) => handleOK(e)}
          onCancel={() => setShowChangeCycle(false)}
        >
          <Form {...formItemLayout} style={{ textAlign: "center" }} form={form}>
            <h2 style={{ textAlign: "center" }}>更改循環數</h2>
            <Form.Item name="cycle3Num" label="三循環數目">
              <Input ref={cycle3Ref} />
            </Form.Item>

            <Form.Item name="cycle4Num" label="四循環數目">
              <Input ref={cycle4Ref} />
            </Form.Item>
          </Form>
        </Modal>
      </React.Fragment>
    </React.Fragment>
  );
};

export default PreGamePage;
