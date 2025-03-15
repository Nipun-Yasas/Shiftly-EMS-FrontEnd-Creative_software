"use client"

import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'

export default function Refer() {

    const vacancy = [
        { id: 1, name: 'Software Engineer' },
        { id: 2, name: 'HR' }
    ]

    const [selected, setSelected] = useState(null) 
    
    const [fileName, setFileName] = useState("No file chosen");
    const [open, setOpen] = useState(false)

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
          setFileName(event.target.files[0].name);
        } else {
          setFileName("No file chosen");
        }
      };

    return (
    <>
      <div>
        <h2 className='text-(color:--my1) text-4xl font-bold'>Refer Candidate</h2>
        <p className='text-gray-500'>Refer Candidate <span className='text-gray-500'>&gt;</span></p>
        <div className="flex flex-col items-center">
          <div className="w-2/4">
            <div className="flex justify-center shadow-2xl rounded-xl mt-5">
                <form className="w-full max-w-xl m-5">
                    <h4 className="text-center font-semibold">Refer Candidate</h4>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 ">

                        <div className="sm:col-span-4">
                          <Listbox value={selected} onChange={setSelected}>
                            <Label className="block text-sm font-medium text-gray-900">Select a vacancy</Label>
                              <div className="relative mt-2">
                                <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm">
                                  <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                                
                                    <span className={`block truncate ${!selected ? 'text-gray-400' : ''}`}>
                                      {selected ? selected.name : 'Select a person'}
                                    </span>
                                  </span>
                                  <ChevronDownIcon aria-hidden="true" className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
                                </ListboxButton>
                        
                                <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden sm:text-sm">
                                  {vacancy.map((person) => (
                                    <ListboxOption
                                      key={person.id}
                                      value={person}
                                      className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-gray-400 data-focus:text-white"
                                    >
                                      <div className="flex items-center">
                                        <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{person.name}</span>
                                      </div>
                                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 group-not-data-selected:hidden group-data-focus:text-white">
                                        <CheckIcon aria-hidden="true" className="size-5" />
                                      </span>
                                </ListboxOption>
                                  ))}
                                </ListboxOptions>
                              </div>
                          </Listbox>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="applicant_name" className="block text-sm/6 font-medium text-gray-900">
                                Applicant Name
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-gray-600">
                                
                                <input
                                    id="applicant_name"
                                    name="applicant_name"
                                    type="text"
                                    placeholder="Enter applicant Name"
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none "
                                />
                                </div>
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="applicant_email" className="block text-sm/6 font-medium text-gray-900">
                                Applicant Email
                            </label>
                            <div className="mt-2">
                                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-gray-600">
                                
                                <input
                                    id="applicant_email"
                                    name="applicant_email"
                                    type="text"
                                    placeholder="Enter applicant email"
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                />
                                </div>
                            </div>
                        </div>

                        <div className="sm:col-span-4">
                            <label htmlFor="message" className="block text-sm/6 font-medium text-gray-900">
                                Your Message
                            </label>
                            <div className="mt-2">
                                <textarea
                                id="message"
                                name="message"
                                placeholder="Enter your message here."
                                rows={3}
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm/6"
                                defaultValue={''}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-4 flex sm:flex-row flex-col">
                            <div className="mr-5 text-sm/6 font-medium text-gray-900 ">Upload resume</div>
                            <div className="flex flex-1 flex-col sm:flex-row items-center border border-gray-300 py-2 px-3 rounded-md ">
                            
                            <input
                                type="file"
                                id="resume"
                                name='resume'
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="resume"
                                className="bg-gray-400 text-white py-1 px-4 rounded-md cursor-pointer hover:bg-gray-500"
                            >
                                Choose File
                            </label>

                            <span className="ml-3 text-gray-600">{fileName}</span>
                            </div>
                        </div>

                        <div className="sm:col-span-4 flex justify-end">
                            <div>
                                <button  onClick={(e) => {
                                    e.preventDefault();
                                    setOpen(true);
                                }} className="rounded-md px-3 py-2 text-(color:--closebtn) font-semibold shadow-xs hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                                Submit</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
          </div>
        </div>
      </div>


        <Dialog  open={open} onClose={() => setOpen(false)} className="relative z-10">
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
                        <DialogTitle as="h3" className="text-center font-bold text-lg text-(color:--my1)">
                          SUBMITTED
                        </DialogTitle>
                      
                      </div>
                    
                  </div>
                  <div className="px-4 py-3 flex justify-end ">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
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