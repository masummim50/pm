import { blueGrey } from "@mui/material/colors";

const MemberNameCard = ({ name }: { name: string }) => {
  return (
    <span
      style={{
        background: blueGrey[600],
        padding: "0px 10px",
        display: "inline-block",
        color: "white",
        fontSize: 14,
        borderRadius: "5px",
      }}
    >
      {name}
    </span>
  );
};

export default MemberNameCard;
