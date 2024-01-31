import { Alert, Button, Container, FloatingLabel, Form } from "react-bootstrap";
import {
  Form as RouteForm,
  json,
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

export const loader =
  (dispatch) =>
  async ({ params }) => {
    const { id } = params;
    try {
      const data = await dispatch(
        usersApiSlice.endpoints.getUser.initiate(id, { track: false })
      ).unwrap();
      return { user: data };
    } catch (err) {
      throw json(undefined, { status: 404 });
    }
  };

export const action =
  (dispatch) =>
  async ({ request, params }) => {
    const { id } = params;
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    try {
      await dispatch(
        usersApiSlice.endpoints.editUser.initiate(
          { id, data },
          { track: false }
        )
      );
      return redirect("/dashboard/users");
    } catch (error) {
      return { error };
    }
  };

const EditUser = () => {
  const roles = useSelector(getRoles);
  const NAME_RGX = /^(?=.{4,24}$)[a-zA-Z]+(\s[a-zA-Z]*)*$/;
  const EMAIL_RGX = /^[a-zA-Z0-9]+@[a-zA-Z]+[.][a-zA-Z]+$/;
  const { user } = useLoaderData();
  const [validation, setValidation] = useState({
    name: true,
    email: true,
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  const checkValidate =
    Object.values(validation).every(Boolean) &&
    JSON.stringify(form) !==
      JSON.stringify({ name: user.name, email: user.email });

  const navigation = useNavigation();

  const error = useActionData();
  const validConditions = {
    name: (value) => ({ name: NAME_RGX.test(value) }),
    email: (value) => ({ email: EMAIL_RGX.test(value) }),
  };

  const changeHandler = (e) => {
    const key = e.key || e?.target?.name;
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

  useEffect(() => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "",
    });
  }, [user.name, user.email, user.role]);

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

            <h2 className="text-center mb-4 text-capitalize">edit user</h2>

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
                isValid={validation.name && form.name !== user.name}
                isInvalid={
                  !validation.name && form.name && form.name !== user.name
                }
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
                isValid={validation.email && form.email !== user.email}
                isInvalid={
                  !validation.email && form.email && form.email !== user.email
                }
              />
              <Form.Control.Feedback type="invalid">
                please write a valid email
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
              save
            </Button>
          </Form>
        )}
      </div>
    </Container>
  );
};

export default EditUser;
