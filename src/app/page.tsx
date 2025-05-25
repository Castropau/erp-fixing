"use client";

import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { setCookies } from "@/server/action/setCookies";
import { useRouter } from "next/navigation";
import { Field, Form, Formik } from "formik";

export default function Home() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate: login } = useMutation({
    mutationFn: (data: { username: string; password: string }) => {
      const config = {
        url: `http://192.168.0.112:8000/api/v1/users/login/`,
        method: "POST",
        data: {
          username: data.username,
          password: data.password,
        },
      };

      return axios.request(config);
    },
  });

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-6 md:space-y-8 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <Formik
              initialValues={{
                username: "",
                password: "",
              }}
              onSubmit={(values, { setSubmitting }) => {
                login(values, {
                  onSuccess: (data) => {
                    setCookies("token", data.data.token);
                    router.push("/erp-v2/dashboard");
                  },
                  onError: (error) => {
                    if (error instanceof AxiosError) {
                      console.log(error);
                      if (error.code === "ERR_NETWORK") {
                        setErrorMessage("error network");
                      }
                      if (error.status === 401) {
                        setErrorMessage("Username or password is incorrect");
                      }
                    }
                  },
                  onSettled: () => {
                    setSubmitting(false);
                  },
                });
              }}
              className="space-y-6 md:space-y-8"
              action="#"
            >
              {({ isSubmitting }) => (
                <Form>
                  <div style={{ color: "red" }}>{errorMessage}</div>
                  {[
                    {
                      type: "text",
                      name: "username",
                      placeholder: "Enter your username",
                      label: "Username",
                    },
                    {
                      type: "password",
                      name: "password",
                      placeholder: "Enter your password",
                      label: "Password",
                    },
                  ].map((item) => (
                    <div key={item.name} className="space-y-4">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        {item.label}
                      </label>
                      <Field
                        type={item.type}
                        id={item.name}
                        name={item.name}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder={item.placeholder}
                        required
                      />
                    </div>
                  ))}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        {/* <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Your email
                    </label>
                    <Field
                      id="username"
                      name="username"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                    /> */}
                        {/* <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    />
                  </div> */}
                        <Field
                          id="remember"
                          aria-describedby="remember"
                          type="checkbox"
                          className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label className="text-gray-500 dark:text-gray-300">
                          Remember me
                        </label>
                      </div>
                    </div>
                    <a
                      href="#"
                      className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-white bg-info  focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-5 py-2.5 text-center mt-4 hover:shadow-lg transition-all duration-200 ease-in-out"
                  >
                    {isSubmitting ? "Singing in..." : "Sign in"}
                  </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-4">
                    Don’t have an account yet?{" "}
                    <a href="#" className="link link-info">
                      Sign up
                    </a>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
}
