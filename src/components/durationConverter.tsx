import React, { useState } from "react";

export const DurationConverter = () => {
  const [inputTime, setInputTime] = useState("");
  const [convertedDuration, setConvertedDuration] = useState("");

  const convertToDuration = (timeString: string): string => {
    const timeInHours = parseFloat(timeString);

    if (isNaN(timeInHours)) {
      return "Invalid input";
    }

    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);

    let result = "";

    if (hours > 0) {
      result += `${hours} hour${hours > 1 ? "s" : ""}`;
    }

    if (minutes > 0) {
      if (result) result += " ";
      result += `${minutes} minute${minutes > 1 ? "s" : ""}`;
    }

    if (!result) {
      result = "0 minutes";
    }

    return result;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputTime(e.target.value);
  };

  const handleConvert = () => {
    const result = convertToDuration(inputTime);
    setConvertedDuration(result);
  };

  return (
    <div>
      <h2>Duration Converter</h2>
      <input
        type="text"
        value={inputTime}
        onChange={handleChange}
        placeholder="Enter time in hours (e.g., 1.5)"
        className="p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleConvert}
        className="ml-2 p-2 bg-blue-500 text-white rounded"
      >
        Convert
      </button>
      <div className="mt-4">
        <strong>Converted Duration: </strong>
        {convertedDuration}
      </div>
    </div>
  );
};

export default DurationConverter;
