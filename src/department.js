import DepartmentInfo from "./department.json";

const translateDepartment = (department) =>
  DepartmentInfo.info[department]["zh"];

const DepartmentOptions = Object.keys(DepartmentInfo.info).map((sign) => ({
  text: DepartmentInfo.info[sign]["zh"],
  value: sign,
}));

export { translateDepartment, DepartmentOptions };
