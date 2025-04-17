const AvailableLeaves = ({ leaves }) => {
    return (
      <div className="bg-white  shadow-lg rounded-xl p-6 w-full">
        <h3 className="!text-lg !font-bold text-gray-800 !mb-4 px-5">Available Leaves</h3>
        <div className="flex flex-wrap gap-4 px-5">
          {leaves.map((leave, i) => (
            <div
              key={i}
              className={`flex items-center ${leave.color} text-white px-4 py-2 rounded-xl text-sm`}
            >
              <span className="bg-white text-black rounded-xl w-6 h-6 flex items-center justify-center mr-2 text-xs font-bold">
                {leave.count}
              </span>
              {leave.type}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default AvailableLeaves;
  