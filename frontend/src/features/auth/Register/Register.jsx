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

export const action =
  (dispatch) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    delete data["passConfirm"];
    try {
      const crendentials = await dispatch(
        apiSlice.endpoints.register.initiate(data, { track: false })
      ).unwrap();

      dispatch(setCredintials(crendentials));
      return redirect("/");
    } catch (err) {
      if (!err.status) {
        return "network err";
      } else if (err.status === 422) {
        return "the email is already exist";
      } else {
        return "register failed";
      }
    }
  };

const Register = () => {
  const NAME_RGX = /^(?=.{4,24}$)[a-zA-Z]+(\s[a-zA-Z]*)*$/;
  const EMAIL_RGX = /^[a-zA-Z0-9]+@[a-zA-Z]+[.][a-zA-Z]+$/;
  const PASS_RGX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%/]).{8,24}$/;
  const navigation = useNavigation();

  const [validation, setValidation] = useState({
    name: false,
    email: false,
    password: false,
    passConfirm: false,
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passConfirm: "",
  });
  const error = useActionData();
  const checkValidate = Object.values(validation).every(Boolean);

  const validConditions = {
    name: (value) => ({ name: NAME_RGX.test(value) }),
    email: (value) => ({ email: EMAIL_RGX.test(value) }),
    password: (value) => ({
      password: PASS_RGX.test(value),
      passConfirm: form.passConfirm === value,
    }),
    passConfirm: (value) => ({
      passConfirm: form.password === value,
    }),
  };

  const changeHandler = (e) => {
    const key = e.target.name;
    const value = e.target.value;

    setForm((prev) => ({ ...prev, [key]: value }));
    setValidation((prev) => ({
      ...prev,
      ...validConditions[key](value),
    }));
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

            <h2 className="text-center mb-4 text-capitalize">sign up</h2>

            <FloatingLabel
              controlId="name"
              label="full name"
              className="mb-3 text-capitalize text-secondary"
            >
              <Form.Control
                name="name"
                type="text"
                placeholder="write your fullname"
                autoComplete="off"
                value={form.name}
                onChange={(e) => {
                  e.target.value = e.target.value
                    .replace(/\s{2,}/g, " ")
                    .trimStart();
                  changeHandler(e);
                }}
                isValid={validation.name}
                isInvalid={!validation.name && form.name}
              />
              <Form.Control.Feedback type="invalid">
                the name should contain only letters or space and should start
                with letter and contain 4-23 characters
              </Form.Control.Feedback>
            </FloatingLabel>
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
                isValid={validation.email}
                isInvalid={!validation.email && form.email}
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
                isValid={validation.password}
                isInvalid={!validation.password && form.password}
              />
              <Form.Control.Feedback type="invalid">
                password should contain capital and small letters , numbers ,
                @#$%^&+/= and should be between 8 to 20 character
              </Form.Control.Feedback>
            </FloatingLabel>
            <FloatingLabel
              controlId="passConfirm"
              label="confirm password"
              className="mb-3 text-capitalize text-secondary"
            >
              <Form.Control
                name="passConfirm"
                type="password"
                placeholder="rewrite your password"
                onChange={changeHandler}
                value={form.passConfirm}
                isValid={validation.passConfirm && form.passConfirm}
                isInvalid={!validation.passConfirm && form.passConfirm}
              />
              <Form.Control.Feedback type="invalid">
                confirm password should match the first password
              </Form.Control.Feedback>
            </FloatingLabel>
            <Button
              className="d-block mx-auto text-capitalize mt-4"
              disabled={!checkValidate}
              type="submit"
            >
              sign up
            </Button>
          </Form>
        )}
      </div>
    </Container>
  );
};

export default Register;
