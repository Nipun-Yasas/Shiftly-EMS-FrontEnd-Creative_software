import React from 'react'
import Image from 'next/image'
import EmailIcon from "@mui/icons-material/Email";
import FolderIcon from "@mui/icons-material/Folder";
import EditIcon from "@mui/icons-material/Edit";
import TabBar from "../tabBar";



function page() {
  return (
    <>
      <div className="container w-4/5 mt-20 ml-60 pt-5 pb-5 pl-20 shadow bg-white rounded-xl">
        <div className="text-4xl text-red-600 font-bold ">Profile</div>
        <div className="sub-path">
          <span className="text-gray-400 mx-2 ">Employee <span>›</span> </span> 
          <span className="text-gray-500 mx-2 "> profile <span>›</span></span>
        </div>

      </div>

    <div className="profile-basic h-35  w-4/5 flex item-center justify-between ml-60 mr-0 mt-5 p-1  shadow  bg-white rounded-xl">
           <div className="flex items-center">
           <Image  src="/profilePic.jpg" 
            alt='Employee Profile Picture'
            className='rounded-8xl pb-3 pl-0 pt-5 pr-4 ml-10 mt-4 '
            width={93} height={93}
           />
           <EditIcon className="w-4 h-4 text-gray-500 ml-1 mt-20" />
         
            <div className=" emp-name text-2xl text-gray-800 font-semibold pl-0 pt-5 ml-5 ">Brooklyn Simmons</div>

           </div>
           
           

            <div className="right-container pr-5 pt-5   flex flex-col items-start">
              <div className="emp-id text-gray-500 text-m font-semibold">
                        <span>
                          <FolderIcon className="w-6 h-6 mr-2 text-gray-500" /> 
                          Software Engineer
                        </span>

              </div>
              <div className="emp-department text-gray-500 text-m font-semibold mt-5">
                <span>
                  <EmailIcon className="w-6 h-6  mr-2 text-gray-500" /> 
                  brooklyn.s@example.com

                </span>

              </div>
            </div>
          
    </div>

    <div className="tabs-container shadow ml-60 bg-white rounded-xl">
      <TabBar/>
      

    </div>



    </>
  )
}

export default page
