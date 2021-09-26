import React, { useState, useEffect } from "react";
import { Match, Player } from "../axios";
import { List, Divider, Spin, Drawer, Table, Modal, Button } from "antd";
import { Link } from "react-router-dom";
import { usePages } from "../hooks/usePages";

const InChargeGame = () => {
  const [dataSource, setDataSource] = useState();
  const { userInfo } = usePages();
  const { user_id } = userInfo;
  const [targetMatch, setTargetMatch] = useState(null);
  const [onInspect, setOnInspect] = useState(false);
  useEffect(async () => {
    try {
      const response = await Match.GetMatch({ recorder: user_id });
      setDataSource(response);
    } catch (err) {
      throw err;
    }
  }, [user_id]);

  return (
    <div className="ant-layout-content" style={{ height: "1000px" }}>
      <div className="site-layout-content" style={{ padding: "0 50px" }}>
        <Divider orientation="left">負責賽事</Divider>
        {dataSource ? (
          <List
            bordered
            dataSource={dataSource}
            renderItem={(aMatch) => (
              <List.Item>
                <div>{new Date(aMatch.startDate).toLocaleDateString()}</div>
                <div style={{ width: "150px" }}>
                  {`${aMatch.home.name} vs ${aMatch.away.name}`}
                </div>
                <Link
                  onClick={() => {
                    setTargetMatch(aMatch);
                    setOnInspect(true);
                  }}
                >
                  球員名單確認
                </Link>
                <Link
                  to={
                    "/recordTeam/" +
                    JSON.stringify({ aMatch, teamType: "home" })
                  }
                >
                  紀錄台
                </Link>
                <Link
                  to={
                    "/recordPlayer/" +
                    JSON.stringify({ aMatch, teamType: "away" })
                  }
                >
                  A隊球員紀錄表
                </Link>
                <Link to={"/"}>B隊球員紀錄表</Link>
              </List.Item>
            )}
          />
        ) : (
          <Spin />
        )}
      </div>
      <PlayerInspector
        match={targetMatch}
        visible={onInspect}
        setVisable={setOnInspect}
      />
    </div>
  );
};

function PlayerInspector({ match, visible, setVisable }) {
  const [HomePlayers, setHomePlayer] = useState([]);
  const [AwayPlayers, setAwayPlayer] = useState([]);
  const [targetPlayer, setTargetPlayer] = useState(null);
  const [onPreview, setOnPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);
  useEffect(async () => {
    if (!match) return;
    const { home, away } = match;
    if (!home._id || !away._id) return;
    setLoading(true);
    const HomeResponse = await Player.GetAllPlayerByTeamID(home._id);
    const AwayResponse = await Player.GetAllPlayerByTeamID(away._id);
    setLoading(false);
    if (HomeResponse.code === 200 && AwayResponse.code === 200) {
      setHomePlayer(HomeResponse.data);
      setAwayPlayer(AwayResponse.data);
    }
  }, [match, visible]);
  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "學號",
      dataIndex: "studentID",
    },
    {
      title: "年級",
      dataIndex: "grade",
    },
    {
      title: "背號",
      dataIndex: "number",
    },
    {
      title: "創建時間",
      dataIndex: "create_time",
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      title: "學生證連結",
      render: (value) =>
        value.photo ? (
          <a
            onClick={() => {
              setTargetPlayer(value);
              setOnPreview(true);
            }}
          >
            檢視
          </a>
        ) : (
          <h4>未上傳</h4>
        ),
    },
  ];
  return (
    <Drawer
      visible={visible}
      title="檢視隊伍"
      placement="bottom"
      closable={true}
      height={500}
      onClose={() => {
        setHomePlayer([]);
        setAwayPlayer([]);
        setVisable(false);
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <div style={{ marginRight: 20 }}>
          <h3>{match ? match.home.name : "None"}</h3>
          <Table dataSource={HomePlayers} columns={columns} loading={loading} />
        </div>
        <Divider type="vertical" />
        <div style={{ marginLeft: 20 }}>
          <h3>{match ? match.away.name : "None"}</h3>
          <Table dataSource={AwayPlayers} columns={columns} loading={loading} />
        </div>
      </div>
      <Modal
        visible={onPreview}
        title={targetPlayer ? targetPlayer.name : "None"}
        onCancel={() => {
          setOnPreview(false);
        }}
        footer={[
          <Button
            onClick={() => {
              setOnPreview(false);
            }}
          >
            OK
          </Button>,
        ]}
      >
        <img
          alt="example"
          style={{ width: "100%", display: loadingImage ? "none" : "block" }}
          src={targetPlayer ? targetPlayer.photo : ""}
          onLoadStart={() => setLoadingImage(true)}
          onLoad={() => setLoadingImage(false)}
        />
        <Spin
          style={{ display: loadingImage ? "block" : "none", margin: "0 auto" }}
        />
      </Modal>
    </Drawer>
  );
}

export default InChargeGame;
