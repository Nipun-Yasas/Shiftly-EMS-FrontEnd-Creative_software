import React from 'react'
import Image from 'next/image'
import url from '../../../../../public/creative_software_logo.png'
import EditIcon from "@mui/icons-material/Edit";

export default function page() {
  return (
    <div className="mt-5 max-w-auto mx-auto bg-white shadow-lg rounded-2xl p-6 border border-black-200">
        <div className="flex items-center gap-4">
            <Image
                src={url}
                alt="Creative Software Logo"
                width={250}
                height={68.99}
                className="rounded"
            />
            <div>
                <h2 className="text-xl font-bold">Software Engineer</h2>
                <p className="text-gray-600">Creative Technology Solutions (Pvt) Ltd</p>
                <p className="text-sm text-gray-500">November 2021 - Present</p>
                <span>
                    <div className=" ml-280  cursor-pointer text-gray-500 hover:text-gray-700">
                        <EditIcon size={20} />
                    </div>
                </span>

            </div>
      </div>

      
      <div className="ml-67 mt-4">
            <h3 className="text-lg font-roboto font-bold text-black">DIPS</h3>
            <p className="text-gray-700 text-m leading-relaxed">
            DIPS AS is Norway&apos;s leading provider of E-healthcare solutions for hospitals. The success of an initial
            collaboration to develop the first mobile applications led to DIPS establishing additional teams to work on
            other areas of their product.
            </p>
      </div>
      
    </div>
  )
}


