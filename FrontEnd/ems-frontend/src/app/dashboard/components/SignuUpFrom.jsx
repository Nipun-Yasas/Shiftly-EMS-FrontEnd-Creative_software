'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password too short').required('Required'),
});

export default function SignupForm({ onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            console.log(values);
            onClose(); // Close on successful submission
          }}
        >
          {() => (
            <Form className="space-y-4">
              <div>
                <Field name="name" type="text" placeholder="Full Name" className="w-full p-2 border rounded" />
                <ErrorMessage name="name" component="div" className="text-sm text-red-500 mt-1" />
              </div>
              <div>
                <Field name="email" type="email" placeholder="Email" className="w-full p-2 border rounded" />
                <ErrorMessage name="email" component="div" className="text-sm text-red-500 mt-1" />
              </div>
              <div>
                <Field name="password" type="password" placeholder="Password" className="w-full p-2 border rounded" />
                <ErrorMessage name="password" component="div" className="text-sm text-red-500 mt-1" />
              </div>
              <button type="submit" className="w-full bg-black text-white py-2 rounded">Sign Up</button>
            </Form>
          )}
        </Formik>
        <button onClick={onClose} className="mt-4 text-sm text-gray-500 w-full">Close</button>
      </div>
    </div>
  );
}
