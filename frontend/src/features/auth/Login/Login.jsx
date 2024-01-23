import { Alert, Button, Container, FloatingLabel, Form } from "react-bootstrap";

import {
  Form as RouteForm,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { setCredintials } from "../authSlice";
import { apiSlice } from "../../../app/apiSlice";
import { useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import authApiSlice from "../authApiSlice";

export const action =
  (dispatch) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      const crendentials = await dispatch(
        authApiSlice.endpoints.login.initiate(data, { track: false })
      ).unwrap();

      dispatch(setCredintials(crendentials));

      return redirect("/dashboard");
    } catch (err) {
      console.log(err);
      if (!err.status) {
        return "network err";
      } else if (err.status === 422) {
        return "the email is already exist";
      } else {
        return "register failed";
      }
    }
  };

const Login = () => {
  const EMAIL_RGX = /^[a-zA-Z0-9]+@[a-zA-Z]+[.][a-zA-Z]+$/;
  const [validated, setValidated] = useState(false);

  const navigation = useNavigation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const error = useActionData();

  const changeHandler = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Container>
      <div className="mt-5">
        {navigation.state !== "idle" ? (
          <p>loading...</p>
        ) : (
          <Form
            as={RouteForm}
            className="border p-3 rounded mx-auto"
            style={{ maxWidth: "700px" }}
            method="post"
            replace
            validated={validated}
            onSubmit={(e) => {
              if (!e.currentTarget.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                setValidated(true);
              }
            }}
            noValidate
          >
            {error && (
              <Alert variant="danger">
                <FaCircleInfo
                  className="position-relative"
                  style={{ bottom: "1px" }}
                />{" "}
                <span className="text-capitalize"> {error}</span>
              </Alert>
            )}

            <h2 className="text-center mb-4 text-capitalize">sign in</h2>

            <FloatingLabel
              controlId="email"
              label="email"
              className="mb-3 text-capitalize text-secondary"
            >
              <Form.Control
                name="email"
                type="email"
                placeholder="email@example.com"
                autoComplete="off"
                value={form.email}
                onChange={changeHandler}
                pattern={EMAIL_RGX.toString().replace(/\//g, "")}
                required
              />
              <Form.Control.Feedback type="invalid">
                please write a valid email
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="password"
              label="password"
              className="mb-3 text-capitalize text-secondary"
            >
              <Form.Control
                name="password"
                type="password"
                placeholder="write your password"
                value={form.password}
                onChange={changeHandler}
                required
                minLength={8}
              />
              <Form.Control.Feedback type="invalid">
                password should be more than 8 numbers
              </Form.Control.Feedback>
            </FloatingLabel>

            <Button
              className="d-block mx-auto text-capitalize mt-4"
              type="submit"
            >
              sign in
            </Button>

            <a href="http://127.0.0.1:8000/login-google">login with google</a>
          </Form>
        )}
      </div>
    </Container>
  );
};

export default Login;
