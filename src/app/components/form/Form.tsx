/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm, FormProvider } from "react-hook-form";

type defaultValueTypes = {
  defaultValues?: Record<string, any>;
};

type formProps = {
  children: React.ReactNode;
  submitFormFunction: any;
} & defaultValueTypes;

const Form = ({ children, submitFormFunction, defaultValues }: formProps) => {
  const formConfig: defaultValueTypes = {};
  // eslint-disable-next-line no-extra-boolean-cast
  if (!!defaultValues) formConfig["defaultValues"] = defaultValues;

  const methods = useForm<formProps>(formConfig);

 const onsubmit = (data:any)=> {
  submitFormFunction(data);
  methods.reset();
 }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onsubmit)}>{children}</form>
    </FormProvider>
  );
};

export default Form;
