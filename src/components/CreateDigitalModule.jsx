import React, { useState } from "react";
import RichTextEditor from "./RichTextEditor";

const CreateDigitalModule = () => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    console.log("Module Content:", content);
    // 👉 backend এ পাঠাবে
  };

  return (
    <div>
      <RichTextEditor value={content} onChange={setContent} />

      {/* <button
        onClick={handleSubmit}
        className="mt-4 bg-[#F6A62D] text-white px-4 py-2 rounded-md"
      >
        Save Module
      </button> */}
    </div>
  );
};

export default CreateDigitalModule;