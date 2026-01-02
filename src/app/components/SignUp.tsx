import { Button, Container, Paper, Typography, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../redux/features/user/userApi";
import { green } from "@mui/material/colors";
import { useState } from "react";

import { LoadingButton } from "@mui/lab";
import { useEffect } from "react";
import useDocumentTitle from "../../UseDocumentTitle";
const SignUp = () => {
  
  useDocumentTitle({title:'Sign Up'})
  const navigate = useNavigate();

  const [signUp, { isLoading, isSuccess, error }] =
    useSignUpMutation();

  const [signupdata, setSignupdata] = useState({
    name: "",
    email: "",
    password: "",
    isGmail: false,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e:any) => {
    e.preventDefault();

    await signUp(signupdata);
    if (error) {
      console.log("sign up error:", error);
    }
  };
  const [showDuplicateError, setShowDuplicateError] = useState(false);

  useEffect(() => {
    if (error && "status" in error) {
      if (error?.status == 409) {
        setShowDuplicateError(true);
        setTimeout(() => {
          setShowDuplicateError(false);
        }, 1500);
      }
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isSuccess, navigate]);

  function emailIsValid(email: string): boolean {
    if (email == "") return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  console.log(setIsEmailInvalid)
  const [showError, setShowError] = useState(isEmailInvalid);
  const allDataValid = () => {
    if (
      signupdata.name &&
      signupdata.password &&
      emailIsValid(signupdata.email)
    ) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <Container
      sx={{
        width: 400,
        marginTop: "50px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "center",
      }}
    >
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography>Sign Up</Typography>
        <form onSubmit={(e) => handleSubmit(e)}>
          <TextField
            required={true}
            sx={{ marginTop: 3 }}
            fullWidth={true}
            label="Name"
            type="text"
            placeholder="Enter your name"
            onChange={(e) =>
              setSignupdata((data) => ({ ...data, name: e.target.value }))
            }
          />
          <TextField
            error={showError}
            helperText={showError ? "Email invalid" : ""}
            required
            sx={{ marginTop: 3 }}
            fullWidth={true}
            label="Email"
            type="email"
            placeholder="Enter your email"
            onChange={(e) => {
              setShowError(!emailIsValid(e.target.value));
              setSignupdata((data) => ({ ...data, email: e.target.value }));
            }}
          />
          <Typography
            sx={{
              color: "red",
              pl: 1,
              display: showDuplicateError ? "block" : "none",
            }}
          >
            email already exists
          </Typography>
          <TextField
            required
            sx={{ marginTop: 3 }}
            fullWidth={true}
            label="Password"
            type="password"
            placeholder="Enter your name"
            onChange={(e) =>
              setSignupdata((data) => ({ ...data, password: e.target.value }))
            }
          />

          <LoadingButton
            //   onClick={handleSubmit}
            disabled={!allDataValid()}
            loading={isLoading}
            type="submit"
            variant="contained"
            sx={{ marginTop: 2 }}
          >
            <span>Sign Up</span>
          </LoadingButton>
        </form>
        <Typography
          sx={{
            color: green[800],
            visibility: isSuccess ? "visible" : "hidden",
          }}
        >
          Sign up Successful. Redirecting...
        </Typography>
      </Paper>
      <Paper
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Button variant="contained">
          <Link
            style={{
              textDecoration: "none",
              color: "white",
              borderRadius: "5px",
            }}
            to={"/login"}
          >
            Go to Login Page
          </Link>
        </Button>
      </Paper>
    </Container>
  );
};

export default SignUp;
