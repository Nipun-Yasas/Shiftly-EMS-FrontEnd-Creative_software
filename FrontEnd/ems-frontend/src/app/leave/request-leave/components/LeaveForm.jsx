'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

const leaveOptions = [
  { id: 1, name: 'Casual Leave', value: 'casual' },
  { id: 2, name: 'Sick Leave', value: 'sick' },
  { id: 3, name: 'Vacation Leave', value: 'vacation' },
  { id: 4, name: 'Maternity Leave', value: 'maternity' },
  { id: 5, name: 'Other', value: 'other' },
];

const LeaveForm = ({ onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(leaveOptions[0]);

  const initialValues = {
    leaveType: leaveOptions[0].value,
    leaveFrom: '',
    leaveTo: '',
    leaveDuration: '',
    coverPerson: '',
    reportPerson: '',
    reason: '',
  };

  const validationSchema = Yup.object({
    leaveType: Yup.string().required('Leave Type is required'),
    leaveFrom: Yup.date().required('Start date is required'),
    leaveTo: Yup.date()
      .min(Yup.ref('leaveFrom'), 'End date must be after start date')
      .required('End date is required'),
    leaveDuration: Yup.number().typeError('Must be a number').required('Duration is required'),
    coverPerson: Yup.string().required('Cover person is required'),
    reportPerson: Yup.string().required('Report person is required'),
    reason: Yup.string().required('Leave reason is required'),
  });

  const calculateDuration = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);
    if (from && to && start <= end) {
      const diffTime = Math.abs(end - start);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return '';
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-10 w-full">

      <h2 className="!text-lg !font-bold mb-6  text-gray-800 ">Request Leave</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            setIsSubmitting(true);
            values.leaveType = selectedLeave.value;
            console.log('Submitted:', values);
            await new Promise((res) => setTimeout(res, 1000));
            resetForm();
            setSelectedLeave(leaveOptions[0]);
            onSubmitSuccess(); 
          } catch (error) {
            console.error('Submit error:', error);
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue }) => {
          useEffect(() => {
            const duration = calculateDuration(values.leaveFrom, values.leaveTo);
            if (duration !== '') {
              setFieldValue('leaveDuration', duration);
            }
          }, [values.leaveFrom, values.leaveTo, setFieldValue]);

          return (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div>
                  <label className="block text-sm font-medium mb-1">Leave Type</label>
                  <Listbox value={selectedLeave} onChange={setSelectedLeave}>
                    <div className="relative">
                      <Listbox.Button className="w-full rounded-lg border border-gray-300 bg-white p-2 text-left shadow-sm focus:ring-2 focus:ring-pink-500">
                        <span className="block truncate">{selectedLeave.name}</span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {leaveOptions.map((option) => (
                          <Listbox.Option
                            key={option.id}
                            value={option}
                            className={({ active }) =>
                              `cursor-pointer select-none px-4 py-2 ${
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                              }`
                            }
                          >
                            {option.name}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>

              
                <div>
                  <label className="block text-sm font-medium mb-1">Leave From</label>
                  <Field
                    name="leaveFrom"
                    type="date"
                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-pink-500"
                  />
                  <ErrorMessage name="leaveFrom" className="text-red-500 text-sm" component="div" />
                </div>

               
                <div>
                  <label className="block text-sm font-medium mb-1">Leave To</label>
                  <Field
                    name="leaveTo"
                    type="date"
                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-pink-500"
                  />
                  <ErrorMessage name="leaveTo" className="text-red-500 text-sm" component="div" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Leave Duration</label>
                  <Field
                    name="leaveDuration"
                    disabled
                    className="w-full rounded-lg border border-gray-200 p-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                  <ErrorMessage name="leaveDuration" className="text-red-500 text-sm" component="div" />
                </div>

               
                <div>
                  <label className="block text-sm font-medium mb-1">Cover Person</label>
                  <Field
                    name="coverPerson"
                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-pink-500"
                  />
                  <ErrorMessage name="coverPerson" className="text-red-500 text-sm" component="div" />
                </div>

                
                <div>
                  <label className="block text-sm font-medium mb-1">Report to Person</label>
                  <Field
                    name="reportPerson"
                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-pink-500"
                  />
                  <ErrorMessage name="reportPerson" className="text-red-500 text-sm" component="div" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Leave Reason</label>
                <Field
                  as="textarea"
                  name="reason"
                  rows="3"
                  className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-pink-500"
                />
                <ErrorMessage name="reason" className="text-red-500 text-sm" component="div" />
              </div>

             
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-[#E80A4D] text-white px-5 py-2 rounded-lg hover:bg-[#c40844] transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Request Leave'}
                </button>
                <button type="reset" className="text-gray-600 hover:underline">
                  Cancel
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default LeaveForm;
