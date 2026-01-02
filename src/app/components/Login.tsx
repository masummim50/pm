/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Button,
  Container,
  Paper,
  Typography,
  TextField,
  Box,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { LoadingButton } from "@mui/lab";
import { Controller, useForm } from "react-hook-form";
import {
  useSignInMutation,
  useSignInWithGmailMutation,
} from "../redux/features/user/userApi";
import { useEffect, useState } from "react";
import { setUser } from "../redux/features/user/userSlice";
import { jwtDecode } from "jwt-decode";
import { orange } from "@mui/material/colors";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { firebaseConfig } from "../../firebase/firebaseConfig";
import { initializeApp } from "firebase/app";
import useDocumentTitle from "../../UseDocumentTitle";

type signInError = {
  data: {
    message: string;
  };
};

const Login = () => {
  useDocumentTitle({ title: "Log In" });

  const dispatch = useAppDispatch();
  const [signin, { data: logindata, isLoading, isSuccess, error }] =
    useSignInMutation();
  const [showError, setShowError] = useState(false);
  useEffect(() => {
    if (error) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 1500);
    }
  }, [error]);

  const [
    signInWithGmail,
    { data: gmailLoginData, isSuccess: gmailLoginSuccess },
  ] = useSignInWithGmailMutation();
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  const { handleSubmit, control,setValue } = useForm();

  const signinFunction = (data: any) => {
    signin(data);
  };

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem("project-m-token", logindata.token);
      dispatch(
        setUser({
          id: logindata.data.id,
          name: logindata.data.name,
          email: logindata.data.email,
          token: logindata.token,
        })
      );
      navigate("/dashboard");
    }
    if (gmailLoginSuccess) {
      const decoded: { _id: string; name: string; email: string } = jwtDecode(
        gmailLoginData.token
      );
      localStorage.setItem("project-m-token", gmailLoginData.token);
      dispatch(
        setUser({
          id: decoded?._id,
          name: decoded?.name,
          email: decoded?.email,
          token: gmailLoginData.token,
        })
      );
      navigate("/dashboard");
    }
  }, [isSuccess, gmailLoginSuccess]);

  const googleAuthProvider = new GoogleAuthProvider();
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleGoogleSignIn = async () => {
    signInWithPopup(auth, googleAuthProvider)
      .then((result) => {
        const data = {
          email: result?.user?.email,
          name: result?.user?.displayName,
          isGmail: true,
        };
        signInWithGmail(data);
      })
      .catch((error) => {
        console.log("sign in with google error: ", error);
      });
  };

  const handleTestingAccountSignIn = () => {
    setValue('email', 'johndoe@gmail.com');
    setValue('password', '1234');
  };

  return (
    <Container
      sx={{
        maxWidth: 400,
        marginTop: "50px",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Paper elevation={3} sx={{ p: 2, maxWidth: "500px", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography>Login</Typography>
          <Button
            onClick={handleTestingAccountSignIn}
            variant="contained"
            size="small"
            color="secondary"
          >
            Use Testing account
          </Button>
        </Box>
        {/* <Form submitFormFunction={handleSubmit}>
          <FormInput
            name="Email"
            placeHolder="Enter your Email"
            label="Email"
          />
          <FormInput
            name="Password"
            placeHolder="Enter your Password"
            label="Password"
            type="password"
          />

          <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
            Log In
          </Button>
        </Form> */}

        <form onSubmit={handleSubmit((data) => signinFunction(data))}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange,value } }) => (
              <TextField
                onChange={onChange}
                required
                value={value}
                sx={{ marginTop: 3 }}
                fullWidth={true}
                label="Email"
                type="email"
                placeholder="Enter your name"
                InputLabelProps={{shrink:true}}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange,value } }) => (
              <TextField
                required
                value={value}
                onChange={onChange}
                sx={{ marginTop: 3 }}
                fullWidth={true}
                label="Password"
                type="password"
                placeholder="Enter your name"
                InputLabelProps={{shrink:true}}
              />
            )}
          />
          <Typography sx={{ opacity: showError ? 1 : 0, color: "red" }}>
            {error &&
            "data" in error &&
            (error as signInError).data?.message ? (
              <p>
                {(error as signInError)?.data.message
                  ? (error as signInError)?.data?.message
                  : "something went wrong"}
              </p>
            ) : (
              ""
            )}
          </Typography>
          <LoadingButton
            loading={isLoading}
            type="submit"
            variant="contained"
            sx={{ marginTop: 2 }}
          >
            <span>Login</span>
          </LoadingButton>
        </form>
      </Paper>
      <Typography color="orange">Or</Typography>
      <Paper
        sx={{
          width: "100%",
          maxWidth: "500px",
          display: "flex",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <IconButton
          onClick={handleGoogleSignIn}
          sx={{ color: orange[800] }}
          size="large"
        >
          <GoogleIcon />
        </IconButton>
        <IconButton>
          <FacebookIcon />
        </IconButton>
        <IconButton>
          <GitHubIcon />
        </IconButton>
        <IconButton>
          <TwitterIcon />
        </IconButton>
      </Paper>
      <Paper
        sx={{
          width: "100%",
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
        }}
      >
        <Typography>New here?</Typography>

        <Button type="submit" variant="contained">
          <Link
            style={{
              textDecoration: "none",
              color: "white",
              borderRadius: "5px",
            }}
            to={"/signup"}
          >
            Sign Up
          </Link>
        </Button>
      </Paper>
    </Container>
  );
};

export default Login;
