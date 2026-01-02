import { Button, Container, Paper, Typography } from "@mui/material";
import Form from "./form/Form";
import FormInput from "./form/FormInput";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../redux/features/user/userApi";
import {green} from '@mui/material/colors'

import {LoadingButton} from '@mui/lab';
import { useEffect } from "react";
const Register = () => {
  const navigate = useNavigate();

  const [signUp, {isLoading,  isSuccess, error}] = useSignUpMutation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (data: any) => {
    data.isGmail = false;
    await signUp(data);
    if(error){
      console.log(error)
    }

  };

  useEffect(()=> {
    if(isSuccess){
        navigate('/')
      }
    
  },[isSuccess, navigate])

 
  

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
        <Form submitFormFunction={handleSubmit}>
        <FormInput
            name="name"
            placeHolder="Enter your Name"
            label="Name"
            type="Name"
          />
          <FormInput
            name="email"
            placeHolder="Enter your Email"
            label="Email"
            error
            helperText="Not a valid email"
            runOnchange
          />
          <FormInput
            name="password"
            placeHolder="Enter your Password"
            label="Password"
            type="password"
          />

          <LoadingButton disabled={isSuccess} loading={isLoading} type="submit" variant="contained" sx={{ marginTop: 2 }}>
            <span>Sign Up</span>
          </LoadingButton>
        </Form>
        <Typography sx={{color:green[800], visibility: isSuccess ? 'visible' : 'hidden'}}>Sign up Successful. Redirecting...</Typography>
        
      </Paper>
      <Paper sx={{ width: "100%", display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-between', p:2 }}>
        
        
        <Button  variant="contained">
        <Link style={{textDecoration:'none', color:'white', borderRadius:'5px'}} to={'/login'}>Go to Login Page</Link>
          </Button>
      </Paper>
      
    </Container>
  );
};

export default Register;
