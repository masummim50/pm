import { createTheme } from "@mui/material";
import { useState } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";
export const whiteInputTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fffff",
    },
  },
});

const TestingPage = () => {
 
  const [parent] = useAutoAnimate({duration:200});
 

  const [show, setShow] = useState(false);

  const divStyle = {
    background: show ? 'red' : 'green',
    padding:'10px',
    borderRadius:'5px'
  }


  return (
      <>
      <button onClick={()=> setShow(!show)}>toggle</button>
      <ul ref={parent}>
        {
          show && <div style={divStyle}>showing result</div> 
        }
        {
          !show &&  <div style={divStyle}>Hidden the previous result</div>
        }
      </ul>
    </>
  );
};

export default TestingPage;
