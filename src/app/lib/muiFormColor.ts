export const formColor = (Color: string) => {
  return {
    color: Color,
    input: { color: Color },
    label: {
      color: Color,
    },
    outline: {
      color: Color,
    },
    borderRadius: "5px",
    "& .Mui-focused": {
      color: Color,
    },
    "& .MuiOutlinedInput-root": {
      color: Color,
      "&.Mui-focused fieldset": { borderColor: Color },
    },
    borderColor: Color,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: Color,
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: Color,
      outline: {
        color: Color,
      },
    },
  };
};

// export const formColor = (Color: string) => {
//   return {
//     color: Color,
//     input: { ...{ color: Color } }, // Spread nested object
//     label: {
//       ...{ color: Color },
//     },
//     outline: {
//       ...{ color: Color },
//     },
//     borderRadius: "5px",
//     "& .Mui-focused": {
//       color: Color,
//     },
//     "& .MuiOutlinedInput-root": {
//       color: Color,
//       "&.Mui-focused fieldset": { borderColor: Color },
//     },
//     borderColor: Color,
//     "& .MuiOutlinedInput-notchedOutline": {
//       borderColor: Color,
//     },
//     "&:hover .MuiOutlinedInput-notchedOutline": {
//       borderColor: Color,
//       outline: {
//         ...{ color: Color }, // Spread nested object
//       },
//     },
//   };
// };

export const whiteInput = {
  color: "white",
  input: { color: "white" },
  label: {
    color: "white",
  },
  borderRadius: "5px",
  "& .Mui-focused": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": { borderColor: "white" },
  },
  borderColor: "white",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "white",
  },
};
