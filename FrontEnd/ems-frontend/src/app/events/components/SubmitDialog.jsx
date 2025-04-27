import React from 'react'

import { Dialog,DialogBackdrop,DialogPanel,DialogTitle } from "@headlessui/react";


const SubmitDialog = (props) => {

  const {openMessage,setOpenMessage,setOpenForm,status} = props

  return (
    <>
    <Dialog
        open={openMessage}
        onClose={setOpenMessage}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in w-full max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white mt-5 pt-5  ">
                <div className="mt-5 pt-5 text-center">
                  <DialogTitle
                    as="h3"
                    className="text-center font-bold text-lg text-(color:--primary)"
                  >
                  {status === "success" ? "EVENT ADDED SUCCESSFULLY" : status}
                  </DialogTitle>
                </div>
              </div>
              <div className="px-4 py-3 flex justify-end ">
                <button
                  type="button"
                  onClick={() => {
                    setOpenForm(false)
                    setOpenMessage(false)
                  }}
                  className="mt-5 rounded-md px-3 py-2 text-(color:--closebtn) font-semibold shadow-xs hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      
    </>
  )
}

export default SubmitDialog