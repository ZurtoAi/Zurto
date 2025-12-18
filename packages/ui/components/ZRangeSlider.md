# ZRangeSlider

A dual-handle range slider component for selecting minimum and maximum values from a continuous or stepped range.

## Interactive Previews

### Basic Range Slider

<ComponentPreview height="180px">

```jsx
import { useState } from "react";

export default function BasicRangeSlider() {
  const [range, setRange] = useState([25, 75]);

  const handleChange = (type, value) => {
    const newValue = parseInt(value);
    if (type === "min") {
      setRange([Math.min(newValue, range[1] - 1), range[1]]);
    } else {
      setRange([range[0], Math.max(newValue, range[0] + 1)]);
    }
  };

  const minPercent = range[0];
  const maxPercent = range[1];

  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        padding: "40px",
        borderRadius: "8px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <div
          style={{
            position: "relative",
            height: "40px",
            marginBottom: "20px",
          }}
        >
          {/* Min value badge */}
          <div
            style={{
              position: "absolute",
              left: `${minPercent}%`,
              top: "-35px",
              transform: "translateX(-50%)",
              backgroundColor: "#df3e53",
              color: "white",
              padding: "4px 12px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              whiteSpace: "nowrap",
            }}
          >
            {range[0]}
          </div>

          {/* Max value badge */}
          <div
            style={{
              position: "absolute",
              left: `${maxPercent}%`,
              top: "-35px",
              transform: "translateX(-50%)",
              backgroundColor: "#df3e53",
              color: "white",
              padding: "4px 12px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "600",
              whiteSpace: "nowrap",
            }}
          >
            {range[1]}
          </div>

          {/* Track background */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "6px",
              backgroundColor: "#2a2a2a",
              borderRadius: "3px",
              transform: "translateY(-50%)",
            }}
          >
            {/* Active track fill */}
            <div
              style={{
                position: "absolute",
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
                height: "100%",
                background: "linear-gradient(90deg, #df3e53 0%, #ff5a6e 100%)",
                borderRadius: "3px",
                transition: "all 0.2s ease",
              }}
            />
          </div>

          {/* Min slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={range[0]}
            onChange={(e) => handleChange("min", e.target.value)}
            style={{
              position: "absolute",
              width: "100%",
              height: "6px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "all",
              appearance: "none",
              background: "transparent",
              outline: "none",
              zIndex: range[0] > 50 ? 5 : 3,
              WebkitAppearance: "none",
              cursor: "pointer",
            }}
            css={`
              &::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                border: 3px solid #df3e53;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
              }
              &::-webkit-slider-thumb:hover {
                transform: scale(1.15);
                box-shadow: 0 4px 12px rgba(223, 62, 83, 0.4);
              }
              &::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                border: 3px solid #df3e53;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
              }
              &::-moz-range-thumb:hover {
                transform: scale(1.15);
                box-shadow: 0 4px 12px rgba(223, 62, 83, 0.4);
              }
            `}
          />

          {/* Max slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={range[1]}
            onChange={(e) => handleChange("max", e.target.value)}
            style={{
              position: "absolute",
              width: "100%",
              height: "6px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "all",
              appearance: "none",
              background: "transparent",
              outline: "none",
              zIndex: range[0] > 50 ? 3 : 5,
              WebkitAppearance: "none",
              cursor: "pointer",
            }}
            css={`
              &::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                border: 3px solid #df3e53;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
              }
              &::-webkit-slider-thumb:hover {
                transform: scale(1.15);
                box-shadow: 0 4px 12px rgba(223, 62, 83, 0.4);
              }
              &::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                border: 3px solid #df3e53;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
              }
              &::-moz-range-thumb:hover {
                transform: scale(1.15);
                box-shadow: 0 4px 12px rgba(223, 62, 83, 0.4);
              }
            `}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#888",
            fontSize: "12px",
            marginTop: "10px",
          }}
        >
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </div>
    </div>
  );
}
```

</ComponentPreview>

### Price Range Filter

<ComponentPreview height="300px">

```jsx
import { useState } from "react";

export default function PriceRangeFilter() {
  const [priceRange, setPriceRange] = useState([150, 650]);
  const min = 0;
  const max = 1000;
  const step = 50;

  const handleChange = (type, value) => {
    const newValue = parseInt(value);
    if (type === "min") {
      setPriceRange([Math.min(newValue, priceRange[1] - step), priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], Math.max(newValue, priceRange[0] + step)]);
    }
  };

  const formatCurrency = (value) => `$${value.toLocaleString()}`;
  const minPercent = ((priceRange[0] - min) / (max - min)) * 100;
  const maxPercent = ((priceRange[1] - min) / (max - min)) * 100;

  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        padding: "40px",
        borderRadius: "8px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <div
              style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}
            >
              Minimum
            </div>
            <div
              style={{ color: "white", fontSize: "24px", fontWeight: "700" }}
            >
              {formatCurrency(priceRange[0])}
            </div>
          </div>
          <div style={{ color: "#444", fontSize: "20px", margin: "0 20px" }}>
            —
          </div>
          <div>
            <div
              style={{ color: "#888", fontSize: "12px", marginBottom: "4px" }}
            >
              Maximum
            </div>
            <div
              style={{ color: "white", fontSize: "24px", fontWeight: "700" }}
            >
              {formatCurrency(priceRange[1])}
            </div>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            height: "40px",
            marginBottom: "30px",
          }}
        >
          {/* Track background */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "8px",
              backgroundColor: "#2a2a2a",
              borderRadius: "4px",
              transform: "translateY(-50%)",
            }}
          >
            {/* Active track fill with gradient */}
            <div
              style={{
                position: "absolute",
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg, #df3e53 0%, #ff5a6e 50%, #df3e53 100%)",
                borderRadius: "4px",
                transition: "all 0.3s ease",
                boxShadow: "0 0 20px rgba(223, 62, 83, 0.3)",
              }}
            />
          </div>

          {/* Min slider */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={priceRange[0]}
            onChange={(e) => handleChange("min", e.target.value)}
            style={{
              position: "absolute",
              width: "100%",
              height: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "all",
              appearance: "none",
              background: "transparent",
              outline: "none",
              zIndex: priceRange[0] > max / 2 ? 5 : 3,
              WebkitAppearance: "none",
              cursor: "pointer",
            }}
            css={`
              &::-webkit-slider-thumb {
                appearance: none;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: white;
                border: 4px solid #df3e53;
                cursor: pointer;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
                transition: all 0.2s ease;
              }
              &::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 4px 16px rgba(223, 62, 83, 0.5);
              }
              &::-moz-range-thumb {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: white;
                border: 4px solid #df3e53;
                cursor: pointer;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
                transition: all 0.2s ease;
              }
              &::-moz-range-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 4px 16px rgba(223, 62, 83, 0.5);
              }
            `}
          />

          {/* Max slider */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={priceRange[1]}
            onChange={(e) => handleChange("max", e.target.value)}
            style={{
              position: "absolute",
              width: "100%",
              height: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "all",
              appearance: "none",
              background: "transparent",
              outline: "none",
              zIndex: priceRange[0] > max / 2 ? 3 : 5,
              WebkitAppearance: "none",
              cursor: "pointer",
            }}
            css={`
              &::-webkit-slider-thumb {
                appearance: none;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: white;
                border: 4px solid #df3e53;
                cursor: pointer;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
                transition: all 0.2s ease;
              }
              &::-webkit-slider-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 4px 16px rgba(223, 62, 83, 0.5);
              }
              &::-moz-range-thumb {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: white;
                border: 4px solid #df3e53;
                cursor: pointer;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
                transition: all 0.2s ease;
              }
              &::-moz-range-thumb:hover {
                transform: scale(1.2);
                box-shadow: 0 4px 16px rgba(223, 62, 83, 0.5);
              }
            `}
          />
        </div>

        <button
          onClick={() =>
            alert(
              `Filtering products: ${formatCurrency(
                priceRange[0]
              )} - ${formatCurrency(priceRange[1])}`
            )
          }
          style={{
            width: "100%",
            padding: "14px",
            backgroundColor: "#df3e53",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#c92d42")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#df3e53")}
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
}
```

</ComponentPreview>

### With Step Marks

<ComponentPreview height="280px">

```jsx
import { useState } from "react";

export default function RangeWithStepMarks() {
  const [ageRange, setAgeRange] = useState([25, 45]);
  const min = 18;
  const max = 65;
  const step = 1;
  const marks = [18, 25, 35, 45, 55, 65];

  const handleChange = (type, value) => {
    const newValue = parseInt(value);
    if (type === "min") {
      setAgeRange([Math.min(newValue, ageRange[1] - 1), ageRange[1]]);
    } else {
      setAgeRange([ageRange[0], Math.max(newValue, ageRange[0] + 1)]);
    }
  };

  const getPercent = (value) => ((value - min) / (max - min)) * 100;
  const minPercent = getPercent(ageRange[0]);
  const maxPercent = getPercent(ageRange[1]);

  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        padding: "40px",
        borderRadius: "8px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ color: "#888", fontSize: "14px", marginBottom: "8px" }}>
            Age Range
          </div>
          <div style={{ color: "white", fontSize: "20px", fontWeight: "600" }}>
            {ageRange[0]} - {ageRange[1]} years
          </div>
        </div>

        <div
          style={{
            position: "relative",
            height: "40px",
            marginBottom: "40px",
            marginTop: "20px",
          }}
        >
          {/* Track background */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "6px",
              backgroundColor: "#2a2a2a",
              borderRadius: "3px",
              transform: "translateY(-50%)",
            }}
          >
            {/* Active track fill */}
            <div
              style={{
                position: "absolute",
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
                height: "100%",
                background: "linear-gradient(90deg, #df3e53 0%, #ff5a6e 100%)",
                borderRadius: "3px",
                transition: "all 0.2s ease",
              }}
            />
          </div>

          {/* Min slider */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={ageRange[0]}
            onChange={(e) => handleChange("min", e.target.value)}
            style={{
              position: "absolute",
              width: "100%",
              height: "6px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "all",
              appearance: "none",
              background: "transparent",
              outline: "none",
              zIndex: ageRange[0] > (min + max) / 2 ? 5 : 3,
              WebkitAppearance: "none",
              cursor: "pointer",
            }}
            css={`
              &::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                border: 3px solid #df3e53;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
              }
              &::-webkit-slider-thumb:hover {
                transform: scale(1.15);
              }
              &::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                border: 3px solid #df3e53;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
              }
              &::-moz-range-thumb:hover {
                transform: scale(1.15);
              }
            `}
          />

          {/* Max slider */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={ageRange[1]}
            onChange={(e) => handleChange("max", e.target.value)}
            style={{
              position: "absolute",
              width: "100%",
              height: "6px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "all",
              appearance: "none",
              background: "transparent",
              outline: "none",
              zIndex: ageRange[0] > (min + max) / 2 ? 3 : 5,
              WebkitAppearance: "none",
              cursor: "pointer",
            }}
            css={`
              &::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                border: 3px solid #df3e53;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
              }
              &::-webkit-slider-thumb:hover {
                transform: scale(1.15);
              }
              &::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                border: 3px solid #df3e53;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
              }
              &::-moz-range-thumb:hover {
                transform: scale(1.15);
              }
            `}
          />
        </div>

        {/* Step marks */}
        <div style={{ position: "relative", height: "30px" }}>
          {marks.map((mark) => {
            const percent = getPercent(mark);
            const isInRange = mark >= ageRange[0] && mark <= ageRange[1];
            return (
              <div
                key={mark}
                style={{
                  position: "absolute",
                  left: `${percent}%`,
                  transform: "translateX(-50%)",
                }}
              >
                <div
                  style={{
                    width: "2px",
                    height: "12px",
                    backgroundColor: isInRange ? "#df3e53" : "#444",
                    marginBottom: "6px",
                    transition: "background-color 0.2s ease",
                  }}
                />
                <div
                  style={{
                    color: isInRange ? "#df3e53" : "#666",
                    fontSize: "12px",
                    fontWeight: isInRange ? "600" : "400",
                    whiteSpace: "nowrap",
                    transition: "color 0.2s ease",
                  }}
                >
                  {mark}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

</ComponentPreview>

### States

<ComponentPreview height="420px">

```jsx
import { useState } from "react";

export default function RangeSliderStates() {
  const [normalRange, setNormalRange] = useState([30, 70]);
  const [errorRange, setErrorRange] = useState([60, 40]); // Invalid: min > max
  const [successRange, setSuccessRange] = useState([20, 80]);

  const RangeSlider = ({ range, setRange, state, label }) => {
    const handleChange = (type, value) => {
      const newValue = parseInt(value);
      if (type === "min") {
        setRange([newValue, range[1]]);
      } else {
        setRange([range[0], newValue]);
      }
    };

    const isError = range[0] >= range[1];
    const minPercent = range[0];
    const maxPercent = range[1];

    const colors = {
      normal: { track: "#df3e53", text: "#fff" },
      disabled: { track: "#444", text: "#666" },
      error: { track: "#ff4444", text: "#ff4444" },
      success: { track: "#00cc88", text: "#00cc88" },
    };

    const currentColor =
      state === "error" && isError ? colors.error : colors[state];
    const isDisabled = state === "disabled";

    return (
      <div style={{ marginBottom: "30px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              color: currentColor.text,
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {label}
          </div>
          <div
            style={{
              color: currentColor.text,
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            {range[0]} - {range[1]}
          </div>
        </div>

        {state === "error" && isError && (
          <div
            style={{
              color: "#ff4444",
              fontSize: "12px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>⚠️</span>
            <span>Invalid range: minimum cannot be greater than maximum</span>
          </div>
        )}

        {state === "success" && (
          <div
            style={{
              color: "#00cc88",
              fontSize: "12px",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>✓</span>
            <span>Valid range selected</span>
          </div>
        )}

        <div
          style={{
            position: "relative",
            height: "40px",
            opacity: isDisabled ? 0.5 : 1,
            cursor: isDisabled ? "not-allowed" : "default",
          }}
        >
          {/* Track background */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "6px",
              backgroundColor: "#2a2a2a",
              borderRadius: "3px",
              transform: "translateY(-50%)",
            }}
          >
            {/* Active track fill */}
            {!isError && (
              <div
                style={{
                  position: "absolute",
                  left: `${Math.min(minPercent, maxPercent)}%`,
                  width: `${Math.abs(maxPercent - minPercent)}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${currentColor.track} 0%, ${currentColor.track} 100%)`,
                  borderRadius: "3px",
                  transition: "all 0.2s ease",
                }}
              />
            )}
          </div>

          {/* Min slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={range[0]}
            onChange={(e) => handleChange("min", e.target.value)}
            disabled={isDisabled}
            style={{
              position: "absolute",
              width: "100%",
              height: "6px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: isDisabled ? "none" : "all",
              appearance: "none",
              background: "transparent",
              outline: "none",
              zIndex: range[0] > 50 ? 5 : 3,
              WebkitAppearance: "none",
              cursor: isDisabled ? "not-allowed" : "pointer",
            }}
            css={`
              &::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                border: 3px solid ${currentColor.track};
                cursor: ${isDisabled ? "not-allowed" : "pointer"};
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
              }
              &::-webkit-slider-thumb:hover {
                transform: ${isDisabled ? "none" : "scale(1.15)"};
              }
              &::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                border: 3px solid ${currentColor.track};
                cursor: ${isDisabled ? "not-allowed" : "pointer"};
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
              }
              &::-moz-range-thumb:hover {
                transform: ${isDisabled ? "none" : "scale(1.15)"};
              }
            `}
          />

          {/* Max slider */}
          <input
            type="range"
            min="0"
            max="100"
            value={range[1]}
            onChange={(e) => handleChange("max", e.target.value)}
            disabled={isDisabled}
            style={{
              position: "absolute",
              width: "100%",
              height: "6px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: isDisabled ? "none" : "all",
              appearance: "none",
              background: "transparent",
              outline: "none",
              zIndex: range[0] > 50 ? 3 : 5,
              WebkitAppearance: "none",
              cursor: isDisabled ? "not-allowed" : "pointer",
            }}
            css={`
              &::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                border: 3px solid ${currentColor.track};
                cursor: ${isDisabled ? "not-allowed" : "pointer"};
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
              }
              &::-webkit-slider-thumb:hover {
                transform: ${isDisabled ? "none" : "scale(1.15)"};
              }
              &::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: white;
                border: 3px solid ${currentColor.track};
                cursor: ${isDisabled ? "not-allowed" : "pointer"};
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
              }
              &::-moz-range-thumb:hover {
                transform: ${isDisabled ? "none" : "scale(1.15)"};
              }
            `}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        padding: "40px",
        borderRadius: "8px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <RangeSlider
          range={normalRange}
          setRange={setNormalRange}
          state="normal"
          label="Normal State"
        />
        <RangeSlider
          range={[40, 60]}
          setRange={() => {}}
          state="disabled"
          label="Disabled State"
        />
        <RangeSlider
          range={errorRange}
          setRange={setErrorRange}
          state="error"
          label="Error State (Try adjusting)"
        />
        <RangeSlider
          range={successRange}
          setRange={setSuccessRange}
          state="success"
          label="Success State"
        />
      </div>
    </div>
  );
}
```

</ComponentPreview>

### Filter Panel Example

<ComponentPreview height="450px">

```jsx
import { useState, useMemo } from "react";

export default function FilterPanelExample() {
  const [priceRange, setPriceRange] = useState([200, 800]);
  const [category, setCategory] = useState("all");
  const [ratingRange, setRatingRange] = useState([3, 5]);

  // Mock product data
  const products = useMemo(
    () => [
      {
        id: 1,
        name: "Wireless Headphones",
        price: 299,
        category: "electronics",
        rating: 4.5,
      },
      {
        id: 2,
        name: "Smart Watch",
        price: 499,
        category: "electronics",
        rating: 4.8,
      },
      {
        id: 3,
        name: "Running Shoes",
        price: 159,
        category: "sports",
        rating: 4.2,
      },
      { id: 4, name: "Coffee Maker", price: 89, category: "home", rating: 3.9 },
      {
        id: 5,
        name: "Laptop Stand",
        price: 45,
        category: "electronics",
        rating: 4.6,
      },
      { id: 6, name: "Yoga Mat", price: 35, category: "sports", rating: 4.3 },
      { id: 7, name: "Desk Lamp", price: 65, category: "home", rating: 4.1 },
      {
        id: 8,
        name: "Bluetooth Speaker",
        price: 129,
        category: "electronics",
        rating: 4.7,
      },
      {
        id: 9,
        name: "Water Bottle",
        price: 25,
        category: "sports",
        rating: 3.8,
      },
      {
        id: 10,
        name: "Gaming Mouse",
        price: 79,
        category: "electronics",
        rating: 4.9,
      },
      {
        id: 11,
        name: "Backpack",
        price: 99,
        category: "accessories",
        rating: 4.4,
      },
      {
        id: 12,
        name: "Phone Case",
        price: 29,
        category: "accessories",
        rating: 3.7,
      },
      {
        id: 13,
        name: "Monitor",
        price: 349,
        category: "electronics",
        rating: 4.6,
      },
      {
        id: 14,
        name: "Keyboard",
        price: 119,
        category: "electronics",
        rating: 4.5,
      },
      {
        id: 15,
        name: "Camping Tent",
        price: 189,
        category: "sports",
        rating: 4.2,
      },
    ],
    []
  );

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.price >= priceRange[0] &&
        p.price <= priceRange[1] &&
        (category === "all" || p.category === category) &&
        p.rating >= ratingRange[0] &&
        p.rating <= ratingRange[1]
    );
  }, [products, priceRange, category, ratingRange]);

  const handlePriceChange = (type, value) => {
    const newValue = parseInt(value);
    if (type === "min") {
      setPriceRange([Math.min(newValue, priceRange[1] - 50), priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], Math.max(newValue, priceRange[0] + 50)]);
    }
  };

  const handleRatingChange = (type, value) => {
    const newValue = parseFloat(value);
    if (type === "min") {
      setRatingRange([
        Math.min(newValue, ratingRange[1] - 0.5),
        ratingRange[1],
      ]);
    } else {
      setRatingRange([
        ratingRange[0],
        Math.max(newValue, ratingRange[0] + 0.5),
      ]);
    }
  };

  const handleReset = () => {
    setPriceRange([200, 800]);
    setCategory("all");
    setRatingRange([3, 5]);
  };

  const RangeSlider = ({ range, onChange, min, max, step, label, format }) => {
    const minPercent = ((range[0] - min) / (max - min)) * 100;
    const maxPercent = ((range[1] - min) / (max - min)) * 100;

    return (
      <div style={{ marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "12px",
            color: "#888",
            fontSize: "13px",
          }}
        >
          <span>{label}</span>
          <span style={{ color: "white", fontWeight: "600" }}>
            {format(range[0])} - {format(range[1])}
          </span>
        </div>

        <div style={{ position: "relative", height: "30px" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "4px",
              backgroundColor: "#2a2a2a",
              borderRadius: "2px",
              transform: "translateY(-50%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
                height: "100%",
                background: "linear-gradient(90deg, #df3e53 0%, #ff5a6e 100%)",
                borderRadius: "2px",
                transition: "all 0.2s ease",
              }}
            />
          </div>

          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={range[0]}
            onChange={(e) => onChange("min", e.target.value)}
            style={{
              position: "absolute",
              width: "100%",
              height: "4px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "all",
              appearance: "none",
              background: "transparent",
              outline: "none",
              zIndex: range[0] > (min + max) / 2 ? 5 : 3,
              WebkitAppearance: "none",
              cursor: "pointer",
            }}
            css={`
              &::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: white;
                border: 2px solid #df3e53;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
              }
              &::-webkit-slider-thumb:hover {
                transform: scale(1.15);
              }
              &::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: white;
                border: 2px solid #df3e53;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
              }
              &::-moz-range-thumb:hover {
                transform: scale(1.15);
              }
            `}
          />

          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={range[1]}
            onChange={(e) => onChange("max", e.target.value)}
            style={{
              position: "absolute",
              width: "100%",
              height: "4px",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "all",
              appearance: "none",
              background: "transparent",
              outline: "none",
              zIndex: range[0] > (min + max) / 2 ? 3 : 5,
              WebkitAppearance: "none",
              cursor: "pointer",
            }}
            css={`
              &::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: white;
                border: 2px solid #df3e53;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
              }
              &::-webkit-slider-thumb:hover {
                transform: scale(1.15);
              }
              &::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: white;
                border: 2px solid #df3e53;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                transition: all 0.2s ease;
              }
              &::-moz-range-thumb:hover {
                transform: scale(1.15);
              }
            `}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        backgroundColor: "#0a0a0a",
        padding: "40px",
        borderRadius: "8px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h3
          style={{
            color: "white",
            fontSize: "20px",
            fontWeight: "700",
            marginBottom: "24px",
          }}
        >
          Product Filters
        </h3>

        {/* Category Filter */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              color: "#888",
              fontSize: "13px",
              display: "block",
              marginBottom: "8px",
            }}
          >
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              backgroundColor: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "6px",
              color: "white",
              fontSize: "14px",
              cursor: "pointer",
              outline: "none",
            }}
          >
            <option value="all">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="sports">Sports</option>
            <option value="home">Home</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        {/* Price Range Slider */}
        <RangeSlider
          range={priceRange}
          onChange={handlePriceChange}
          min={0}
          max={1000}
          step={50}
          label="Price Range"
          format={(val) => `$${val}`}
        />

        {/* Rating Range Slider */}
        <RangeSlider
          range={ratingRange}
          onChange={handleRatingChange}
          min={1}
          max={5}
          step={0.5}
          label="Minimum Rating"
          format={(val) => `${val}★`}
        />

        {/* Results & Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px",
            backgroundColor: "#1a1a1a",
            borderRadius: "8px",
            marginTop: "24px",
          }}
        >
          <div style={{ color: "white", fontSize: "16px", fontWeight: "600" }}>
            {filteredProducts.length} products found
          </div>
          <button
            onClick={handleReset}
            style={{
              padding: "8px 16px",
              backgroundColor: "transparent",
              border: "1px solid #df3e53",
              color: "#df3e53",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#df3e53";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#df3e53";
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
```

</ComponentPreview>

## Props

| Prop            | Type                                  | Default         | Description                          |
| --------------- | ------------------------------------- | --------------- | ------------------------------------ |
| `min`           | `number`                              | `0`             | Minimum value of the range           |
| `max`           | `number`                              | `100`           | Maximum value of the range           |
| `step`          | `number`                              | `1`             | Step increment for values            |
| `value`         | `[number, number]`                    | `[0, 100]`      | Current range values [min, max]      |
| `onChange`      | `(value: [number, number]) => void`   | -               | Callback when range changes          |
| `disabled`      | `boolean`                             | `false`         | Disables both handles                |
| `marks`         | `number[]`                            | -               | Array of values to show marks at     |
| `showLabels`    | `boolean`                             | `true`          | Show min/max labels                  |
| `formatLabel`   | `(value: number) => string`           | `String(value)` | Format displayed values              |
| `color`         | `string`                              | `'#df3e53'`     | Color of active track and thumbs     |
| `trackHeight`   | `number`                              | `6`             | Height of the track in pixels        |
| `thumbSize`     | `number`                              | `20`            | Size of thumb handles in pixels      |
| `className`     | `string`                              | -               | Additional CSS class                 |
| `error`         | `boolean \| string`                   | `false`         | Error state or message               |
| `success`       | `boolean \| string`                   | `false`         | Success state or message             |
| `ariaLabel`     | `string`                              | -               | Accessibility label                  |
| `ariaValueText` | `(value: [number, number]) => string` | -               | Custom value text for screen readers |

## Accessibility

- ✅ **Keyboard Support**: Both handles navigable with Tab, adjustable with Arrow keys
- ✅ **ARIA Labels**: `role="slider"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- ✅ **Screen Reader**: Announces current range "X to Y" on change
- ✅ **Focus Indicators**: Clear visual focus on active handle
- ✅ **Touch Targets**: Minimum 44×44px touch area on handles
- ✅ **Color Contrast**: WCAG AA compliant (handles and track)
- ✅ **Error Announcements**: Screen readers announce validation errors
- ✅ **Disabled State**: Proper `aria-disabled` and visual feedback

## Usage Guidelines

**Do:**

- Use for selecting numeric ranges (price, age, dates)
- Ensure minimum handle separation (prevent overlap)
- Show current values prominently
- Validate min < max constraint
- Use step increments appropriate for the range
- Provide clear labels and units

**Don't:**

- Use for very large ranges (>1000 steps) without proper scaling
- Allow handles to cross or overlap
- Hide the current values
- Use tiny touch targets on mobile
- Forget to show range boundaries (min/max labels)

## Examples

### Currency Range

```jsx
<ZRangeSlider
  min={0}
  max={10000}
  step={100}
  value={[2000, 7000]}
  formatLabel={(v) => `$${v.toLocaleString()}`}
  onChange={(range) => console.log(range)}
/>
```

### Date Range (Years)

```jsx
<ZRangeSlider
  min={1900}
  max={2024}
  step={1}
  value={[1990, 2010]}
  marks={[1900, 1950, 2000, 2024]}
  onChange={(range) => console.log(range)}
/>
```

### Temperature Range

```jsx
<ZRangeSlider
  min={-20}
  max={50}
  step={1}
  value={[18, 24]}
  formatLabel={(v) => `${v}°C`}
  color="#00cc88"
  onChange={(range) => console.log(range)}
/>
```
