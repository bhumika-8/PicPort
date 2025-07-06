import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/UIelements/Button";
import ErrorModal from "../../shared/components/UIelements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIelements/LoadingSpinner";
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/utils/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import { AuthContext } from "../../shared/context/auth-context";

import "./Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false }
    },
    false
  );

  const handleSubmission = async event => {
    event.preventDefault();

    if (isLogin) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            "Content-Type": "application/json"
          }
        );
        auth.login(responseData.user.id);
        navigate("/");
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.username.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value); // This is now a File

        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData
        );
console.log("Signup response:", responseData);
        auth.login(responseData.user.id);
        navigate("/");
      } catch (err) {}
    }
  };

  const switchModeHandler = () => {
    if (!isLogin) {
      // Signup → Login: remove username and image
      const updatedInputs = { ...formState.inputs };
      delete updatedInputs.username;
      delete updatedInputs.image;
      setFormData(
        updatedInputs,
        updatedInputs.email.isValid && updatedInputs.password.isValid
      );
    } else {
      // Login → Signup: add username and image
      setFormData(
        {
          ...formState.inputs,
          username: { value: "", isValid: false },
          image: { value: null, isValid: false }
        },
        false
      );
    }

    setIsLogin(prevMode => !prevMode);
  };

  return (
   <React.Fragment>
  <ErrorModal error={error} onClear={clearError} />
  {isLoading && <LoadingSpinner asOverlay />}

  <div className="auth-container">
    <form className="place-form" onSubmit={handleSubmission}>
      {!isLogin && (
        <Input
          id="username"
          element="input"
          type="text"
          validators={[VALIDATOR_REQUIRE()]}
          label="USERNAME"
          errorText="Please enter a username"
          onInput={inputHandler}
          value={formState.inputs.username?.value || ""}
          valid={formState.inputs.username?.isValid || false}
        />
      )}

      {!isLogin && (
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
          center
        />
      )}

      <Input
        id="email"
        element="input"
        type="text"
        validators={[VALIDATOR_EMAIL()]}
        label="EMAIL"
        errorText="Please enter your valid email"
        onInput={inputHandler}
        value={formState.inputs.email.value}
        valid={formState.inputs.email.isValid}
      />

      <Input
        id="password"
        element="input"
        type="password"
        validators={[VALIDATOR_MINLENGTH(6)]}
        label="PASSWORD"
        errorText="Please enter a strong password (at least 6 characters)"
        onInput={inputHandler}
        value={formState.inputs.password.value}
        valid={formState.inputs.password.isValid}
      />

      <Button  type="submit" disabled={!formState.isValid}>
        {isLogin ? "LOGIN" : "SIGNUP"}
      </Button>
    </form>

    {/* This button is now wrapped in a centered container */}
   
      <Button inverse onClick={switchModeHandler}>
        {isLogin ? "SIGN UP" : "LOGIN"}
      </Button>
  
  </div>
</React.Fragment>

  );
};

export default Auth;
