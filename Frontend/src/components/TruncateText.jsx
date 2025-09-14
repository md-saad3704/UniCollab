// src/components/TruncateText.jsx
import React, { useState } from "react";

const TruncateText = ({ text, limit = 160 }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);
  const isTruncated = text.length > limit;

  const displayText = expanded ? text : `${text.slice(0, limit)}${isTruncated ? "..." : ""}`;

  return (
    <div className="text-light">
      <p className="mb-2">{displayText}</p>
      {isTruncated && (
        <button
          className="btn btn-sm btn-outline-info"
          onClick={toggleExpanded}
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
    </div>
  );
};

export default TruncateText;
