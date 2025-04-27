const LetterRequestModal = ({ letterType, onClose }) => {

  const letterTypes = [
    "EPF/ETF Name Change Letter",
    "Letter for Skill Assessment",
    "Salary Undertaking Letter",
    "Salary Confirmation Letter",
    "Employment Confirmation Letter",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">

       
      <div className=" rounded-lg shadow-lg p-6 w-full max-w-lg relative pointer-events-auto"
        style={{
          backgroundColor:'var(--inputFieldColor)',
          border: '1px solid black',
        }}
      >
        <h2 className="text-xl font-semibold mb-4"
          style={{
            color: 'var(--primary)',
          }}
        >
          {letterType}
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Letter Type</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black-300"
            >
              {letterTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Recipient Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black-300"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Additional Details</label>
            <textarea
              placeholder="Your reason..."
              className="w-full border border-gray-300 rounded px-3 py-2 h-24 focus:outline-none focus:ring-1 focus:ring-black-300"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border-none"
              style={{
                color: 'var(--primary)',
                cursor: 'pointer',
              }}
            >
              RESET
            </button>
            <button
              type="submit"
              className="px-4 py-2 border-none"
              style={{
                color:'black',
                cursor: 'pointer',
                
              }}
            >
              GENERATE
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-xl text-gray-500 hover:text-gray-700"
          
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default LetterRequestModal;
