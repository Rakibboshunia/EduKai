import { FiChevronDown } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useState } from "react";

const EmailIntegration = ({ openSection, toggleSection }) => {

  const [loadingService, setLoadingService] = useState(null);

  const handleConnect = async (service) => {

    setLoadingService(service);

    try {

      // future API call here
      await new Promise((resolve) => setTimeout(resolve, 1500));

    } catch (error) {

      console.error(error);

    } finally {

      setLoadingService(null);

    }
  };

  return (
    <div className=" text-black rounded-xl overflow-hidden">

      <button
        onClick={() => toggleSection("email")}
        className="w-full flex justify-between items-center px-6 py-4 font-semibold cursor-pointer"
      >
        Email Integration

        <FiChevronDown
          className={`transition ${
            openSection === "email" ? "rotate-180" : ""
          }`}
        />
      </button>

      {openSection === "email" && (

        <div className="px-6 pb-6 space-y-6">

          {/* <div className="border border-gray-300 rounded-lg p-4 flex justify-between items-center">

            <div>
              <h4 className="font-semibold">
                Microsoft Outlook
              </h4>

              <p className="text-sm text-gray-500">
                Connected as user@example.com
              </p>
            </div>

            <button
              onClick={() => handleConnect("outlook")}
              disabled={loadingService === "outlook"}
              className="px-4 py-2 bg-[#2D468A] text-white rounded-md cursor-pointer hover:bg-[#3a5ab3] transition flex items-center gap-2"
            >
              {loadingService === "outlook" ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </button>

          </div> */}

          <div className="border border-gray-300 rounded-lg p-4 flex justify-between items-center">

            <div>
              <h4 className="font-semibold">
                Gmail
              </h4>

              <p className="text-sm text-gray-500">
                Not Connected
              </p>
            </div>

            <button
              onClick={() => handleConnect("gmail")}
              disabled={loadingService === "gmail"}
              className="px-4 py-2 bg-[#2D468A] text-white rounded-md cursor-pointer hover:bg-[#3a5ab3] transition flex items-center gap-2"
            >
              {loadingService === "gmail" ? (
                <>
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default EmailIntegration;