import { useRef, useState } from "react";
import {
  Button,
  Container,
  FloatingLabel,
  Form,
  ProgressBar,
} from "react-bootstrap";
import { useNavigation, Form as RouteForm, useFetcher } from "react-router-dom";
import SelectBox from "../../../components/SelectBox/SelectBox";
import { useGetCategoriesQuery } from "../categories/catApiSlice";
import { createSelector } from "@reduxjs/toolkit";
import {
  productApiSlice,
  useAddImgMutation,
  useDeleteImgMutation,
} from "./productsApiSlice";
import uploadImage from "../../../images/images.png";

export const action = (dispatch) => async () => {
  const formData = {
    category: "",
    title: "dummy",
    description: "dummy",
    price: 0,
    discount: 0,
    About: "dummy",
  };

  try {
    const res = await dispatch(
      productApiSlice.endpoints.addProduct.initiate(formData, {
        track: false,
      })
    ).unwrap();
    return res.id;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const AddProduct = () => {
  const [form, setForm] = useState({
    category: "",
    title: "",
    description: "",
    price: "",
    discount: "",
    About: "",
  });
  const [images, setImages] = useState([]);
  const addFetcher = useFetcher();
  const id = addFetcher.data;
  const checkValidate = Object.keys(form).every((key) => Boolean(form[key]));
  const navigation = useNavigation();
  const imagesRef = useRef();
  const progRef = useRef([]);
  const imagesIdsRef = useRef([]);

  const [addImage] = useAddImgMutation();
  const [deleteImg] = useDeleteImgMutation();

  const getCatOptions = createSelector(
    (data) => data,
    (data) => [
      { text: "choose category", disabled: true, value: "" },
      ...(data?.map((cat) => ({ text: cat.title, value: cat.id })) || []),
    ]
  );
  const { categories = [] } = useGetCategoriesQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => ({
      categories: getCatOptions(data),
      ...rest,
    }),
  });

  const changeHandler = (e) => {
    const key = e.key || e.target.name;
    const value = e.value || e.target.value;
    setForm((prev) => ({
      ...prev,
      [key]: value.replace(/\s{2,}/g, " ").trimStart(),
    }));
    if (key === "category" && !addFetcher.data) {
      addFetcher.submit("", { method: "POST" });
    }
  };
  const changeFileHandler = async (e) => {
    const uploadedImages = [...e.target.files];
    setImages((prev) => [...prev, ...uploadedImages]);
    try {
      const formData = new FormData();
      uploadedImages.forEach(async (img, ind) => {
        formData.append("image", img);
        console.log(id);
        formData.append("product_id", id);
        const onUploadProgress = ({ loaded, total }) => {
          const progValue = Math.floor((loaded * 100) / total);
          const progressBar = progRef.current[images.length + ind].children[0];
          progressBar.style.width = `${progValue}%`;
          progressBar.setAttribute("aria-valuenow", progValue);
          progressBar.innerText = `${progValue}%`;
        };
        const res = await addImage({
          data: formData,
          onUploadProgress,
        }).unwrap();

        imagesIdsRef.current[images.length + ind] = res.id;
      });
    } catch (err) {
      console.log(err);
    }
  };

  const deleteHandler = async (ind) => {
    try {
      await deleteImg(imagesIdsRef.current[ind]).unwrap();
      setImages((prev) => prev.filter((img, id) => id !== ind));
      progRef.current = progRef.current.filter((img, id) => id !== ind);
      imagesIdsRef.current = imagesIdsRef.current.filter(
        (img, id) => id !== ind
      );
    } catch (err) {
      console.log(err);
    }
  };

  const showImages = images.map((image, ind) => (
    <div
      key={image.name + ind}
      className="bg-secondary-subtle
    border rounded overflow-hidden"
    >
      <div className="d-flex  gap-4 ">
        <img
          src={URL.createObjectURL(image)}
          width={"150px"}
          className="rounded"
          style={{ objectFit: "cover" }}
        />
        <div className="p-3  d-flex align-items-start justify-content-between flex-grow-1">
          <div>
            <p className="fw-bold  m-0">{image.name}</p>
            <p className="m-0 text-capitalize ">
              size :{" "}
              {image.size / 1024 < 900
                ? `${(image.size / 1024).toFixed(2)} kb`
                : `${((image.size / 1024) * 1024).toFixed(2)} mb`}
            </p>
          </div>
          <Button
            onClick={() => deleteHandler(ind)}
            className="text-capitalize"
            variant="danger"
            disabled={!imagesIdsRef.current[ind]}
          >
            delete
          </Button>
        </div>
      </div>
      <ProgressBar
        style={{ height: "10px", borderRadius: 0, transition: "0.5s" }}
        variant="success"
        ref={(e) => (e ? (progRef.current[ind] = e) : null)}
      />
    </div>
  ));

  return (
    <Container>
      <div className="mt-5">
        {navigation.state !== "idle" ? (
          <p>loading...</p>
        ) : (
          <Form
            className="border p-3 rounded mx-auto"
            style={{ maxWidth: "700px" }}
            as={RouteForm}
            method="post"
            replace
            encType="multipart/form-data"
            action={`../../products/edit/${id}`}
            relative="path"
          >
            <h2 className="text-center mb-4 text-capitalize">add product</h2>
            <SelectBox
              className="text-capitalize mb-3"
              valueState={[
                form.category,
                (value) => changeHandler({ key: "category", value }),
              ]}
              options={categories}
              name="category"
            />

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
                value={form.title}
                onChange={changeHandler}
                className="mw-100"
                required
                disabled={!id}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="description"
              label="description"
              className="mb-3 text-capitalize text-secondary"
            >
              <Form.Control
                name="description"
                type="text"
                placeholder="write your fullname"
                autoComplete="off"
                value={form.description}
                onChange={changeHandler}
                className="mw-100"
                required
                disabled={!id}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="price"
              label="price"
              className="mb-3 text-capitalize text-secondary"
            >
              <Form.Control
                name="price"
                type="text"
                placeholder="write your fullname"
                autoComplete="off"
                value={form.price}
                onChange={changeHandler}
                className="mw-100"
                required
                disabled={!id}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="discount"
              label="discount"
              className="mb-3 text-capitalize text-secondary"
            >
              <Form.Control
                name="discount"
                type="text"
                placeholder="write your fullname"
                autoComplete="off"
                value={form.discount}
                onChange={changeHandler}
                className="mw-100"
                required
                disabled={!id}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="About"
              label="About"
              className="mb-3 text-capitalize text-secondary"
            >
              <Form.Control
                name="About"
                type="text"
                placeholder="write your fullname"
                autoComplete="off"
                value={form.About}
                onChange={changeHandler}
                className="mw-100"
                required
                disabled={!id}
              />
            </FloatingLabel>
            <div
              style={{
                cursor: "pointer",
                border: form.category
                  ? "1px dashed #1B8ADB"
                  : "1px dashed gray",
                filter: !form.category && "grayScale(1)",
                pointerEvents: !form.category && "none",
              }}
              className="my-4 p-4 rounded d-flex flex-column justify-content-center align-items-center  gap-3"
              onClick={() => {
                imagesRef.current.click();
              }}
              aria-disabled={!id}
            >
              <div className="bg-light rounded-circle">
                <img src={uploadImage} alt="ubload" width={"150px"} />
              </div>
              <p
                className="text-capitalize fw-bold fs-5 m-0"
                style={{ color: "#1B8ADB" }}
              >
                upload images
              </p>
            </div>
            <Form.Control
              type="file"
              onChange={changeFileHandler}
              multiple
              className="mw-100"
              hidden
              ref={imagesRef}
            />
            <div className="d-flex flex-column gap-4">{showImages}</div>

            <Button
              className="d-block mx-auto text-capitalize mt-3"
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

export default AddProduct;
