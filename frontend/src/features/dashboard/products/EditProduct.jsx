import {
  Form as RouteForm,
  json,
  redirect,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import {
  productApiSlice,
  useAddImgMutation,
  useDeleteImgMutation,
} from "./productsApiSlice";
import { useRef, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { useGetCategoriesQuery } from "../categories/catApiSlice";
import {
  Button,
  Container,
  Form,
  FloatingLabel,
  ProgressBar,
} from "react-bootstrap";
import SelectBox from "../../../components/SelectBox/SelectBox";
import uploadImage from "../../../images/images.png";

export const action =
  (dispatch) =>
  async ({ request, params }) => {
    const { id } = params;
    const formData = await request.formData();
    const { deletedImgs, ...data } = Object.fromEntries(formData);
    try {
      if (deletedImgs) {
        JSON.parse(deletedImgs).forEach(async (id) => {
          const res = await dispatch(
            productApiSlice.endpoints.deleteImg.initiate(id, {
              track: false,
            })
          ).unwrap();
          console.log(res);
        });
      }

      await dispatch(
        productApiSlice.endpoints.editProduct.initiate(
          { data, id },
          { track: false }
        )
      ).unwrap();
      return redirect("/dashboard/products");
    } catch (err) {
      return err;
    }
  };

export const loader =
  (dispatch) =>
  async ({ params }) => {
    const { id } = params;
    console.log("done");
    const { unsubscribe, unwrap } = dispatch(
      productApiSlice.endpoints.getProduct.initiate(id, { subscribe: false })
    );

    const res = await unwrap();
    await unsubscribe();
    if (res?.length > 0) return res[0];
    else throw json(undefined, { status: 404 });
  };

const EditProduct = () => {
  const { images: serverImages = [], ...rest } = useLoaderData();
  const [form, setForm] = useState(rest);
  const [sImages, setSImages] = useState(serverImages);
  const [images, setImages] = useState([]);
  const checkValidate = Object.keys(form).every((key) => Boolean(form[key]));
  const navigation = useNavigation();
  const imagesRef = useRef();
  const progRef = useRef([]);
  const imagesIdsRef = useRef([]);
  const deletedIds = useRef([]);

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
  };
  const changeFileHandler = async (e) => {
    const uploadedImages = [...e.target.files];
    setImages((prev) => [...prev, ...uploadedImages]);
    const formData = new FormData();
    for (let i = 0; i < uploadedImages.length; i++) {
      const img = uploadedImages[i];
      formData.append("product_id", form.id);
      formData.append("image", img);
      const onUploadProgress = ({ loaded, total, ...rest }) => {
        console.log(rest);
        const progValue = Math.floor((loaded * 100) / total);
        const progressBar = progRef.current[images.length + i].children[0];
        progressBar.style.width = `${progValue}%`;
        progressBar.setAttribute("aria-valuenow", progValue);
        progressBar.innerText = `${progValue}%`;
      };
      try {
        const res = await addImage({
          data: formData,
          onUploadProgress,
        }).unwrap();
        imagesIdsRef.current[images.length + i] = res.id;
      } catch (err) {
        console.log(err);
      }
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

  const deleteServerImageHandler = async (id) => {
    try {
      setSImages((prev) => prev.filter((img) => img.id !== id));
      deletedIds.current.push(id);
    } catch (err) {
      console.log(err);
    }
  };

  const showServerImages = sImages.map((img, ind) => (
    <div key={img.id} className="position-relative">
      <img src={img.image} style={{ maxWidth: "100%" }} />
      <Button
        variant="danger"
        className="position-absolute d-flex justify-content-center align-items-center p-1 pb-2 "
        style={{
          top: "0",
          left: "0",
          translate: "-50% -50%",
          width: "23px",
          height: "23px",
          cursor: "pointer",
        }}
        onClick={() => deleteServerImageHandler(img.id)}
      >
        X
      </Button>
    </div>
  ));

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
            relative="path"
          >
            <h2 className="text-center mb-4 text-capitalize">edit product</h2>
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
            <div
              className="d-grid gap-3"
              style={{
                gridTemplateColumns: "repeat(auto-fit,minmax(80px,1fr))",
              }}
            >
              {showServerImages}
            </div>
            <div className="d-flex flex-column gap-4 mt-4">{showImages}</div>

            <input
              type="hidden"
              name="deletedImgs"
              value={JSON.stringify(deletedIds.current)}
            />
            <Button
              className="d-block mx-auto text-capitalize mt-3"
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

export default EditProduct;
