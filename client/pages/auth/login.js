import React, { useContext } from "react";
import { useRouter } from 'next/router'
const jwt = require('jsonwebtoken');


import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
// layout for this page
import Auth from "layouts/Auth.js";

import { AuthContext } from "../../context/store";

const SignInSchema = Yup.object().shape({
  email: Yup.string().email().required("Email is required"),

  password: Yup.string()
    .required("Password is required"),
});


const Login = () => {

  const router = useRouter();

  const auth = useContext(AuthContext);

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign in with credentials</small>
            </div>
            <Formik
              initialValues={{
                email: "",
                password : ""
              }}
              validationSchema={SignInSchema}
              onSubmit={async (values, actions) => {
                try {
                  const response = await fetch("http://localhost:7000/login", {
                    method: "POST",
                    body: JSON.stringify({
                      email: values.email,
                      password: values.password
                    }),
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });

                  const responseData = await response.json();
                  if (responseData.success === 1) {
                    let decodedToken = jwt.decode(responseData.jwt, { complete: true });
                    const role = decodedToken.payload.payload.organisation_id === null ? "student" : "regulator";
                    auth.login(responseData.jwt, decodedToken.expiresIn, role);
                    // console.log(auth.role);
                    if (role === "student") {
                      router.push('../student/dashboard');
                    }
                    else {
                      router.push('../regulator/dashboard');
                    }
                  } else {
                    actions.setSubmitting(false);
                    actions.setErrors({ email: "Username or password is invalid", password: "Username or password is invalid" });
                  }
                } catch (err) {
                  console.log(err);
                }
              }}
            >
            {(props) => (
            <Form onSubmit={props.handleSubmit}>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    tag={Field}
                    className={props.errors.email && props.touched.email ? 
                      "input-error" : null}
                  />
                </InputGroup>
                {props.errors.email && props.touched.email && (
                  <span className="text-danger">{props.errors.email}</span>
                )}
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Password"
                    type="password"
                    name="password"
                    tag={Field}
                    className={props.errors.password && props.touched.password ? 
                      "input-error" : null}
                  />
                </InputGroup>
                {props.errors.password && props.touched.password && (
                  <span className="text-danger">{props.errors.password}</span>
                )}
              </FormGroup>
              <div className="text-center">
                <Button className="my-4" color="primary" onClick={props.handleSubmit}>
                  Sign in
                </Button>
              </div>
            </Form>
            )}
            </Formik>
          </CardBody>
        </Card>
        <Row className="mt-3">
          <Col xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => { e.preventDefault(); router.push('forgot-password'); }}
            >
              <small>Forgot password?</small>
            </a>
          </Col>
          <Col className="text-right" xs="6">
            <a
              className="text-light"
              href="#pablo"
              onClick={(e) => { e.preventDefault(); router.push('register'); } }
            >
              <small>Create new account</small>
            </a>
          </Col>
        </Row>
      </Col>
    </>
  );
}

Login.layout = Auth;

export default Login;
