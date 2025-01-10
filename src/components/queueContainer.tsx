"use client";

import ChevronIcon from "./dropdown/chevronIcon";
import Dropdown from "./dropdown/dropdownProp";

const QueueContainer = () => {
  return (
    <Dropdown
      title="Scheduled Queue"
      icon={<ChevronIcon isOpen={false} />} // Default not open
      content={<p>This is the dropdown content!</p>} // Example content
    />
  );
};

export default QueueContainer;
