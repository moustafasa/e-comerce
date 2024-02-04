import { useEffect, useRef, useState } from "react";
import { Alert, Button, Container, FloatingLabel, Form } from "react-bootstrap";
import { FaCircleInfo } from "react-icons/fa6";
import {
  Form as RouteForm,
  json,
  redirect,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import { catApiSlice } from "./catApiSlice";

export const loader =
  (dispatch) =>
  async ({ params }) => {
    const { id } = params;
    try {
      const { unwrap, unsubscribe } = dispatch(
        catApiSlice.endpoints.getCategory.initiate(id)
      );
      const cat = await unwrap();
      await unsubscribe();
      return { cat };
    } catch (err) {
      console.log(err);
      throw json(undefined, { status: 404 });
    }
  };

export const action =
  (dispatch) =>
  async ({ request, params }) => {
    const formData = await request.formData();
    const { id } = params;
    try {
      await dispatch(
        catApiSlice.endpoints.editCategory.initiate(
          { data: formData, id },
          { track: false }
        )
      ).unwrap();
      return redirect("/dashboard/categories");
    } catch (err) {
      console.log(err);
      return "error";
    }
  };

const EditCategory = () => {
  const { cat } = useLoaderData();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const ref = useRef();

  const checkValidate = (title && title !== cat.title) || image;

  const navigation = useNavigation();

  const error = useActionData();

  useEffect(() => {
    setTitle(cat.title);
  }, [cat]);

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
            encType="multipart/form-data"
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

            <h2 className="text-center mb-4 text-capitalize">edit category</h2>
            <FloatingLabel
              controlId="title"
              label="title"
              className="mb-3 text-capitalize text-secondary"
            >
              <Form.Control
                name="title"
                type="text"
                placeholder="write your fullname"
                autoComplete="off"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value.replace(/\s{2,}/g, " ").trimStart());
                }}
                className="mw-100"
                required
              />
            </FloatingLabel>
            <Form.Group
              controlId="image"
              label="image"
              className="mb-3 pt-4 text-capitalize text-secondary"
            >
              <Form.Label>image :</Form.Label>
              <Form.Control
                name="image"
                type="file"
                placeholder="write your fullname"
                autoComplete="off"
                onChange={(e) => setImage(e.target.files.item(0))}
                className="mw-100"
                ref={ref}
              />
            </Form.Group>

            <Button
              className="d-block mx-auto text-capitalize mt-4"
              disabled={!checkValidate || navigation.state !== "idle"}
              type="submit"
            >
              edit
            </Button>
          </Form>
        )}
      </div>
    </Container>
  );
};

export default EditCategory;
