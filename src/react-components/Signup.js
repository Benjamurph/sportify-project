import React, { useRef, useState } from "react";
import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../react-contexts/AuthenticationContext";
import "./signup.css";

const SignUp = ({ setLoginComponent }) => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const navigate = useNavigate();
  const { signUp } = useAuth();


  function switchComponent() {
    setLoginComponent("Log In");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match.");
    }

    try {
      setError("");
      setLoading(true);
      await signUp(emailRef.current.value, passwordRef.current.value)
      .then(({ user }) => {
        
        navigate(`/users/${user.uid}`);
      })
      
      
    } catch {
      setError("Failed to create an account, please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <header className="loginHeader">
        <h2 className="text-center mb-4">Sign Up</h2>

        <div className="loginHeaderDiv">
          <div className="loginHeaderButtons">
            <button
              onClick={switchComponent}
              style={{
                background: "transparent",
                border: "none",
                padding: "10px",
              }}
            >
              Log In
            </button>
          </div>
          <div className="loginHeaderButtons">
            <button
              style={{
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #000",
                padding: "10px",
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={emailRef} required></Form.Control>
          </Form.Group>
          <Form.Group id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              ref={passwordRef}
              required
            ></Form.Control>
          </Form.Group>
          <Form.Group id="password">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              ref={passwordConfirmRef}
              required
            ></Form.Control>
          </Form.Group>
          <Button disabled={loading} type="submit">
            Sign Up
          </Button>
        </Form>
      </Modal.Body>
    </>
  );
};

export default SignUp;