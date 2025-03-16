import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Dialog,DialogBackdrop,DialogPanel,DialogTitle } from "@headlessui/react";

import EventForm from "./EventForm";

export default function FormDialog(props) {
  
  const { openForm, setOpenForm } = props;

  return (
    <>
      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        className="relative z-10 w-full "
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative top-13 sm:top-10 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 w-full sm:w-5/6 lg:w-2/3 md:w-5/6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <div className="flex justify-between">
                    <DialogTitle
                      as="h3"
                      className="text-xl mb-5 font-semibold text-gray-900"
                    >
                      Add events
                    </DialogTitle>
                    <div className="flex justify-end">
                      <button onClick={() => setOpenForm(false)}>
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="w-auto h-auto"
                        />
                      </button>
                    </div>
                  </div>

                  <EventForm openForm={openForm} setOpenForm={setOpenForm} />
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
