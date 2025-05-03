
import Image from 'next/image'
import EmailIcon from "@mui/icons-material/Email";
import FolderIcon from "@mui/icons-material/Folder";
import EditIcon from "@mui/icons-material/Edit";
import { Paper } from '@mui/material';

import TabBar from "./components/TabBar";

const Employee = () => {
  return (
    <Paper elevation={10}
      sx={{
        height: '100%',
        width: '100%',
      }}>
      <div className="profile-basic   w-auto flex item-center justify-between  mt-5 shadow  bg-white rounded-xl">
        <div className="flex items-center">
           <Image  src="/profilePic.jpg" 
            alt='Employee Profile Picture'
            className='rounded-8xl pb-3 pl-0 pt-5 pr-4 ml-10 mt-4 '
            width={93} height={93}
           />
           <EditIcon className=" cursor-pointer  w-4 h-4 text-gray-500 ml-1 mt-20" />
         
            <div className=" emp-name text-2xl font-semibold pl-0 pt-5 ml-5 " style={{color :'var(--blueDark)', fontFamily: 'var(--font-poppins)'}}>Brooklyn Simmons</div>

           </div>
           
           

            <div className="right-container pr-5 pt-5   flex flex-col items-start" style={{color: 'var(--grayLight2)',fontFamily: 'var(--font-lexend)'}}>
              <div className="emp-id text-m font-semibold" style={{color: 'var(--grayLight2)'}}>
                        <span className='font-light' style={{color: 'var(--grayLight2)'}}>
                          <FolderIcon className="w-6 h-6 mr-2" style={{color: 'var(--grayLight2)'}} /> 
                          Software Engineer
                        </span>

              </div>
              <div className="emp-department  text-m font-semibold mt-5">
                <span className='font-light' style={{color: 'var(--grayLight2)'}}>
                  <EmailIcon className="w-6 h-6  mr-2 " /> 
                  brooklyn.s@example.com

                </span>

              </div>
            </div>
          
    </div>

    <div className="tabs-container shadow bg-white rounded-xl">
      <TabBar/>
      

    </div>



    </Paper>
  )
}

export default Employee;
