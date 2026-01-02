import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useState } from "react";
type inputPropTypes = {
  name: string;
  type?: string;
  label?: string;
  value?: string;
  id?: string;
  placeHolder?: string;
  error?: boolean;
  helperText?: string;
  runOnchange?: boolean;
};

const FormInput = (props: inputPropTypes) => {
  const { control } = useFormContext();

  function emailIsValid(email: string): boolean {
    if (email == "") return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  const [showError, setShowError] = useState(props.error && isEmailInvalid);

  console.log(setIsEmailInvalid)
  return (
    <>
      <Controller
        control={control}
        name={props.name}
        rules={{
          validate: (v)=> emailIsValid(v)
        }}
        render={({ field }) => {
          return (
            <TextField
              required
              error={showError}
              helperText={showError ? props.helperText : ""}
              sx={{ marginTop: 3 }}
              fullWidth={true}
              label={props?.label}
              type={props.type}
              placeholder={props.placeHolder}
              {...field}
              onChange={(e) => {
                props.runOnchange
                  ? setShowError(props.error && !emailIsValid(e.target.value))
                  : null;
              }}
            />
          );
        }}
      />
    </>
  );
};

export default FormInput;
