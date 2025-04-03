import AutoResizeInput from "../AutoResizeInput";

export default function PersonalInfoForm(){

    return(
        <div className="space-y-4">
             <AutoResizeInput label="Full Name" defaultValue="Brooklyn Simmons" />
             <AutoResizeInput label="Email" defaultValue="brooklyn.s@example.com" />
             <AutoResizeInput label="Gender" defaultValue="Male" />
             <AutoResizeInput label="Birthday" defaultValue="01 Nov 1990" />

        </div>
    )
}