import { Alert, Button, Container, FloatingLabel, Form } from "react-bootstrap";
import {
  Form as RouteForm,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import usersApiSlice from "./usersApiSlice";
import { useSelector } from "react-redux";
import { getRoles } from "../../auth/authSlice";
import SelectBox from "../../../components/SelectBox/SelectBox";

export const action =
  (dispatch) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    console.log(data);
    try {
      await dispatch(
        usersApiSlice.endpoints.addUser.initiate(data, { track: false })
      ).unwrap();
      return redirect("/dashboard/users");
    } catch (error) {
      return { error };
    }
  };

const AddUser = () => {
  const roles = useSelector(getRoles);
  const NAME_RGX = /^(?=.{4,24}$)[a-zA-Z]+(\s[a-zA-Z]*)*$/;
  const EMAIL_RGX = /^[a-zA-Z0-9]+@[a-zA-Z]+[.][a-zA-Z]+$/;
  const PASS_RGX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%/]).{8,24}$/;

  const [validation, setValidation] = useState({
    name: false,
    email: false,
    password: false,
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const checkValidate = Object.values(validation).every(Boolean) && form.role;

  const navigation = useNavigation();

  const error = useActionData();
  const validConditions = {
    name: (value) => ({ name: NAME_RGX.test(value) }),
    email: (value) => ({ email: EMAIL_RGX.test(value) }),
    password: (value) => ({
      password: PASS_RGX.test(value),
    }),
  };

  const changeHandler = (e) => {
    const key = e.key || e.target.name;
    const value = e.value !== undefined ? e.value : e.target.value;

    setForm((prev) => ({ ...prev, [key]: value }));
    setValidation((prev) => ({
      ...prev,
      ...(validConditions[key] ? validConditions[key](value) : {}),
    }));
  };

  const rolesOptions = [
    { text: "choose role", value: "", disabled: true },
    ...Object.keys(roles).map((role) => ({
      text: roles[role],
      value: role,
    })),
  ];
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

            <h2 className="text-center mb-4 text-capitalize">add user</h2>
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
                isValid={validation.name && form.name}
                isInvalid={!validation.name && form.name}
                className="mw-100"
              />
              <Form.Control.Feedback
                type="invalid"
                style={{ maxWidth: "100%", paddingInline: "10px" }}
              >
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
                isValid={validation.email && form.email}
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
            <SelectBox
              className="text-capitalize"
              valueState={[
                form.role,
                (value) => changeHandler({ key: "role", value }),
              ]}
              options={rolesOptions}
              name="role"
            />
            <Button
              className="d-block mx-auto text-capitalize mt-4"
              disabled={!checkValidate || navigation.state !== "idle"}
              type="submit"
            >
              add
            </Button>
          </Form>
        )}
      </div>
    </Container>
  );
};

export default AddUser;
