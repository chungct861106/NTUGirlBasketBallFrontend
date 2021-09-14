import React from "react";
import { Image, Table } from "antd";
const time = ["12:30-13:30", "18:30-19:30", "19:30-20:30"];

const fieldPicture = {
  0: "https://i.imgur.com/uR9JIRI.png",
  1: "https://i.imgur.com/C378EBB.png",
};

export default function AppointmentTooltip(model) {
  const { appointmentData } = model.data;
  console.log(appointmentData);
  const { startDate, recorder, field, home, away } = appointmentData;
  const columns = [
    { title: "學系", dataIndex: "department" },
    { title: "報名狀態", dataIndex: "status" },
    { title: "預賽編號", dataIndex: "session_preGame" },
  ];
  return (
    <div
      style={{
        height: 300,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        width={200}
        height={200}
        src={fieldPicture[field]}
        preview={false}
      />
      <div>
        <h3>{`比賽日期: ${startDate.toLocaleDateString()} ${
          time[startDate.getHours() - 1]
        }`}</h3>
        <h3>{`${home.name} VS ${away.name}`}</h3>
        <Table columns={columns} dataSource={[home, away]} pagination={false} />
      </div>
    </div>
  );
}
