import React, { useState } from "react"

function IndexPopup() {
  const [isEnabled, setIsEnabled] = useState(true)

  const toggleExtension = () => {
    setIsEnabled(!isEnabled)
    // TODO: Implement actual extension toggle logic
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 16,
        width: "250px",
        textAlign: "center"
      }}>
      <h2>Flags for LinkedIn</h2>
      <p>Fix broken flag emojis automatically</p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 10
        }}>
        <span style={{ marginRight: 10 }}>
          Extension: {isEnabled ? "Enabled" : "Disabled"}
        </span>
        <button
          onClick={toggleExtension}
          style={{
            backgroundColor: isEnabled ? "#4CAF50" : "#F44336",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: 4,
            cursor: "pointer"
          }}>
          {isEnabled ? "Disable" : "Enable"}
        </button>
      </div>
    </div>
  )
}

export default IndexPopup
