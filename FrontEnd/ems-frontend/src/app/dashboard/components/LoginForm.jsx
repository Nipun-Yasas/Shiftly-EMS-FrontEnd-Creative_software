'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'Username too short')
      .max(20, 'Username too long')
      .required('Username is required'),
    password: Yup.string()
      .min(6, 'Password too short')
      .required('Password is required'),
  });
  

export default function LoginForm({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            console.log(values);
            onClose(); 
          }}
        >
          {() => (
            <Form className="space-y-4">
              <div>
                <Field name="username" type="text" placeholder="Username" className="w-full p-2 border rounded" />
                <ErrorMessage name="username" component="div" className="text-sm text-red-500 mt-1" />
              </div>
              <div>
                <Field name="password" type="password" placeholder="Password" className="w-full p-2 border rounded" />
                <ErrorMessage name="password" component="div" className="text-sm text-red-500 mt-1" />
              </div>
              <button type="submit" className="w-full bg-black text-white py-2 rounded">Login</button>
            </Form>
          )}
        </Formik>
        <button onClick={onClose} className="mt-4 text-sm text-gray-500 w-full">Close</button>
      </div>
    </div>
  );
}
