import { AvatarGroup, Avatar, Tooltip } from "@mui/material";
import { red, green, purple, lime, amber } from "@mui/material/colors";
import { participantType } from "./project.interface";

const colorsArray = [red[400], green[400], purple[400], lime[400], amber[400]];
const pickRandomColors = () => {
  const randomIndex = Math.floor(Math.random() * colorsArray.length);
  return colorsArray[randomIndex];
};

const Participants = ({
  participants,
}: {
  participants: participantType[];
}) => {
  const getFirstLetters = (pName: string) => {
    const nameWordsArray = pName.split(" ");
    let name = "";

    if (nameWordsArray.length > 1) {
      name = nameWordsArray[0].charAt(0) + nameWordsArray[1].charAt(0);
    } else if (nameWordsArray.length === 1) {
      name = nameWordsArray[0].charAt(0); // Take the first two letters of the single word
    }

    return name;
  };
  return (
    <AvatarGroup
      max={4}
      // sx={{
      //   "& .MuiAvatar-root": { width: 24, height: 24, fontSize: 15 },
      // }}
    >
      {participants.map((p) => (
        <Tooltip key={p?._id} title={p?.name} placement="top">
          <Avatar sx={{ background: pickRandomColors() }}>
            {getFirstLetters(p.name).toUpperCase()}
          </Avatar>
        </Tooltip>
      ))}
    </AvatarGroup>
  );
};

export default Participants;
