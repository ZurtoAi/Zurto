# ZRating

A customizable star rating component for collecting user feedback and displaying ratings.

## Preview

### Basic Star Rating

<ComponentPreview height="180px">

```jsx
import React, { useState } from "react";

export default function BasicRatingDemo() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    setRating(value);
  };

  const handleMouseEnter = (value) => {
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const renderStar = (index) => {
    const value = index + 1;
    const isFilled = value <= (hoverRating || rating);

    return (
      <button
        key={index}
        onClick={() => handleClick(value)}
        onMouseEnter={() => handleMouseEnter(value)}
        onMouseLeave={handleMouseLeave}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "32px",
          padding: "4px",
          transition: "transform 0.2s",
          color: isFilled ? "#ffc107" : "#333",
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.9)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        {isFilled ? "⭐" : "☆"}
      </button>
    );
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#0a0a0a",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", gap: "4px" }}>
        {[0, 1, 2, 3, 4].map(renderStar)}
      </div>

      <div
        style={{
          color: "#fff",
          fontSize: "18px",
          fontWeight: "600",
        }}
      >
        {rating > 0 ? `${rating} out of 5 stars` : "Click to rate"}
      </div>
    </div>
  );
}
```

</ComponentPreview>

### With Half-Stars & Reviews

<ComponentPreview height="280px">

```jsx
import React, { useState } from "react";

export default function HalfStarRatingDemo() {
  const [rating, setRating] = useState(4.5);
  const [hoverRating, setHoverRating] = useState(0);
  const reviewCount = 1234;

  const handleClick = (value) => {
    setRating(value);
  };

  const handleMouseMove = (index, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    setHoverRating(index + (isHalf ? 0.5 : 1));
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const renderStar = (index) => {
    const currentRating = hoverRating || rating;
    const starValue = index + 1;
    const previousStarValue = index + 0.5;

    const isFull = starValue <= currentRating;
    const isHalf =
      previousStarValue <= currentRating && starValue > currentRating;

    return (
      <button
        key={index}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const isHalfClick = x < rect.width / 2;
          handleClick(index + (isHalfClick ? 0.5 : 1));
        }}
        onMouseMove={(e) => handleMouseMove(index, e)}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "relative",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "36px",
          padding: "4px",
          transition: "transform 0.2s",
        }}
      >
        <span style={{ color: "#333" }}>☆</span>
        <span
          style={{
            position: "absolute",
            left: "4px",
            top: "4px",
            overflow: "hidden",
            color: "#ffc107",
            width: isHalf ? "50%" : isFull ? "100%" : "0%",
            transition: "width 0.2s",
          }}
        >
          ⭐
        </span>
      </button>
    );
  };

  return (
    <div
      style={{
        padding: "32px",
        background: "#0a0a0a",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
      }}
    >
      <div
        style={{
          fontSize: "48px",
          fontWeight: "700",
          color: "#ffc107",
          marginBottom: "8px",
        }}
      >
        {(hoverRating || rating).toFixed(1)}
      </div>

      <div style={{ display: "flex", gap: "4px" }}>
        {[0, 1, 2, 3, 4].map(renderStar)}
      </div>

      <div
        style={{
          color: "#888",
          fontSize: "16px",
          textAlign: "center",
        }}
      >
        Based on {reviewCount.toLocaleString()} reviews
      </div>

      {hoverRating > 0 && (
        <div
          style={{
            color: "#fff",
            fontSize: "14px",
            padding: "8px 16px",
            background: "#1a1a1a",
            borderRadius: "4px",
            border: "1px solid #333",
          }}
        >
          Click to rate {hoverRating.toFixed(1)} stars
        </div>
      )}
    </div>
  );
}
```

</ComponentPreview>

### Sizes

<ComponentPreview height="250px">

```jsx
import React, { useState } from "react";

export default function RatingSizesDemo() {
  const [ratings, setRatings] = useState({ sm: 3, md: 4, lg: 5 });

  const StarRating = ({ size, rating, onChange, label }) => {
    const [hover, setHover] = useState(0);

    const sizeMap = {
      sm: { fontSize: "18px", padding: "2px" },
      md: { fontSize: "24px", padding: "3px" },
      lg: { fontSize: "32px", padding: "4px" },
    };

    const style = sizeMap[size];

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div style={{ color: "#888", fontSize: "14px", fontWeight: "500" }}>
          {label}
        </div>
        <div style={{ display: "flex", gap: "2px" }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => onChange(value)}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: style.fontSize,
                padding: style.padding,
                transition: "transform 0.2s",
                color: value <= (hover || rating) ? "#ffc107" : "#333",
              }}
            >
              {value <= (hover || rating) ? "⭐" : "☆"}
            </button>
          ))}
        </div>
        <div style={{ color: "#fff", fontSize: "12px" }}>{rating}/5</div>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "32px",
        background: "#0a0a0a",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        gap: "32px",
      }}
    >
      <StarRating
        size="sm"
        rating={ratings.sm}
        onChange={(value) => setRatings({ ...ratings, sm: value })}
        label="Small"
      />
      <StarRating
        size="md"
        rating={ratings.md}
        onChange={(value) => setRatings({ ...ratings, md: value })}
        label="Medium"
      />
      <StarRating
        size="lg"
        rating={ratings.lg}
        onChange={(value) => setRatings({ ...ratings, lg: value })}
        label="Large"
      />
    </div>
  );
}
```

</ComponentPreview>

### States

<ComponentPreview height="400px">

```jsx
import React, { useState } from "react";

export default function RatingStatesDemo() {
  const [normalRating, setNormalRating] = useState(0);
  const [requiredRating, setRequiredRating] = useState(0);
  const [showError, setShowError] = useState(false);

  const StarRating = ({
    rating,
    onChange,
    readonly,
    disabled,
    required,
    error,
    label,
  }) => {
    const [hover, setHover] = useState(0);

    const getColor = () => {
      if (disabled) return "#222";
      if (error) return "#df3e53";
      return "#ffc107";
    };

    return (
      <div
        style={{
          padding: "20px",
          background: disabled ? "#0a0a0a" : "#111",
          borderRadius: "8px",
          border: error ? "1px solid #df3e53" : "1px solid #222",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: "14px",
            fontWeight: "500",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {label}
          {required && <span style={{ color: "#df3e53" }}>*</span>}
          {readonly && (
            <span
              style={{
                color: "#888",
                fontSize: "12px",
                fontWeight: "400",
              }}
            >
              (read-only)
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() =>
                !readonly && !disabled && onChange && onChange(value)
              }
              onMouseEnter={() => !readonly && !disabled && setHover(value)}
              onMouseLeave={() => setHover(0)}
              disabled={disabled || readonly}
              style={{
                background: "none",
                border: "none",
                cursor: readonly || disabled ? "default" : "pointer",
                fontSize: "28px",
                padding: "4px",
                transition: "transform 0.2s",
                color: value <= (hover || rating) ? getColor() : "#333",
              }}
            >
              {value <= (hover || rating) ? "⭐" : "☆"}
            </button>
          ))}
        </div>

        {error && (
          <div
            style={{
              color: "#df3e53",
              fontSize: "12px",
              marginTop: "8px",
            }}
          >
            {error}
          </div>
        )}

        {!error && rating > 0 && (
          <div
            style={{
              color: "#888",
              fontSize: "12px",
              marginTop: "8px",
            }}
          >
            Rated {rating} out of 5 stars
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "24px",
        background: "#0a0a0a",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <StarRating
        rating={normalRating}
        onChange={setNormalRating}
        label="Normal Rating"
      />

      <StarRating rating={4} readonly={true} label="Read-only Rating" />

      <StarRating rating={3} disabled={true} label="Disabled Rating" />

      <StarRating
        rating={requiredRating}
        onChange={(value) => {
          setRequiredRating(value);
          setShowError(false);
        }}
        required={true}
        error={showError && requiredRating === 0 ? "Rating is required" : null}
        label="Required Rating"
      />

      <button
        onClick={() => setShowError(requiredRating === 0)}
        style={{
          padding: "12px 24px",
          background: "#df3e53",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#c23547")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#df3e53")}
      >
        Validate Required
      </button>
    </div>
  );
}
```

</ComponentPreview>

### Product Review Form

<ComponentPreview height="450px">

```jsx
import React, { useState } from "react";

export default function ProductReviewFormDemo() {
  const [formData, setFormData] = useState({
    rating: 0,
    name: "",
    comment: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.comment.trim()) {
      newErrors.comment = "Comment is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ rating: 0, name: "", comment: "" });
    }, 3000);
  };

  const renderStar = (index) => {
    const value = index + 1;
    const isFilled = value <= (hoverRating || formData.rating);

    return (
      <button
        key={index}
        type="button"
        onClick={() => {
          setFormData({ ...formData, rating: value });
          setErrors({ ...errors, rating: null });
        }}
        onMouseEnter={() => setHoverRating(value)}
        onMouseLeave={() => setHoverRating(0)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "36px",
          padding: "4px",
          transition: "transform 0.2s",
          color: isFilled ? "#ffc107" : "#333",
        }}
      >
        {isFilled ? "⭐" : "☆"}
      </button>
    );
  };

  if (submitted) {
    return (
      <div
        style={{
          padding: "40px",
          background: "#0a0a0a",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          minHeight: "450px",
        }}
      >
        <div style={{ fontSize: "48px" }}>✅</div>
        <div
          style={{
            color: "#fff",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          Thank you for your review!
        </div>
        <div style={{ color: "#888", fontSize: "14px" }}>
          Your feedback helps us improve
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "32px",
        background: "#0a0a0a",
        borderRadius: "8px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <div>
          <h3
            style={{
              color: "#fff",
              fontSize: "20px",
              fontWeight: "600",
              marginBottom: "20px",
            }}
          >
            Write a Review
          </h3>
        </div>

        <div>
          <label
            style={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "12px",
              display: "block",
            }}
          >
            Your Rating <span style={{ color: "#df3e53" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
            {[0, 1, 2, 3, 4].map(renderStar)}
          </div>
          {errors.rating && (
            <div style={{ color: "#df3e53", fontSize: "12px" }}>
              {errors.rating}
            </div>
          )}
        </div>

        <div>
          <label
            style={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "8px",
              display: "block",
            }}
          >
            Your Name <span style={{ color: "#df3e53" }}>*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setErrors({ ...errors, name: null });
            }}
            placeholder="John Doe"
            style={{
              width: "100%",
              padding: "12px",
              background: "#111",
              border: errors.name ? "1px solid #df3e53" : "1px solid #333",
              borderRadius: "6px",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
            }}
          />
          {errors.name && (
            <div
              style={{ color: "#df3e53", fontSize: "12px", marginTop: "4px" }}
            >
              {errors.name}
            </div>
          )}
        </div>

        <div>
          <label
            style={{
              color: "#fff",
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "8px",
              display: "block",
            }}
          >
            Your Review <span style={{ color: "#df3e53" }}>*</span>
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => {
              setFormData({ ...formData, comment: e.target.value });
              setErrors({ ...errors, comment: null });
            }}
            placeholder="Share your experience..."
            rows={4}
            style={{
              width: "100%",
              padding: "12px",
              background: "#111",
              border: errors.comment ? "1px solid #df3e53" : "1px solid #333",
              borderRadius: "6px",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit",
            }}
          />
          {errors.comment && (
            <div
              style={{ color: "#df3e53", fontSize: "12px", marginTop: "4px" }}
            >
              {errors.comment}
            </div>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: "14px 32px",
            background: "#df3e53",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#c23547")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#df3e53")}
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}
```

</ComponentPreview>

## Props

| Prop         | Type                      | Default     | Description                        |
| ------------ | ------------------------- | ----------- | ---------------------------------- |
| `value`      | `number`                  | `0`         | Current rating value (0-5)         |
| `onChange`   | `(value: number) => void` | -           | Callback when rating changes       |
| `max`        | `number`                  | `5`         | Maximum number of stars            |
| `allowHalf`  | `boolean`                 | `false`     | Enable half-star ratings           |
| `size`       | `'sm' \| 'md' \| 'lg'`    | `'md'`      | Size of the stars                  |
| `readonly`   | `boolean`                 | `false`     | Disable interaction (display only) |
| `disabled`   | `boolean`                 | `false`     | Disable the component              |
| `required`   | `boolean`                 | `false`     | Mark as required field             |
| `error`      | `string`                  | -           | Error message to display           |
| `showValue`  | `boolean`                 | `true`      | Show numeric value below stars     |
| `icon`       | `ReactNode`               | `⭐`        | Custom icon for filled stars       |
| `emptyIcon`  | `ReactNode`               | `☆`         | Custom icon for empty stars        |
| `color`      | `string`                  | `'#ffc107'` | Color for filled stars             |
| `emptyColor` | `string`                  | `'#333'`    | Color for empty stars              |
| `onHover`    | `(value: number) => void` | -           | Callback when hovering over stars  |
| `label`      | `string`                  | -           | Label text                         |
| `name`       | `string`                  | -           | Form field name                    |

## Accessibility

- ✅ **Keyboard Navigation**: Navigate with arrow keys, select with Enter/Space
- ✅ **Screen Reader Support**: Announces current rating and total stars
- ✅ **ARIA Labels**: Proper role="slider" with aria-valuenow, aria-valuemin, aria-valuemax
- ✅ **Focus Indicators**: Clear visual focus state for keyboard users
- ✅ **Error Announcements**: Error messages linked with aria-describedby
- ✅ **Required Fields**: aria-required="true" for required ratings
- ✅ **Touch Targets**: Minimum 44x44px touch target size for mobile
- ✅ **High Contrast**: Works with high contrast mode, color is not the only indicator
- ✅ **Hover Feedback**: Visual preview of rating before committing
- ✅ **Readonly State**: Proper cursor and interaction disabling for display-only mode

## Usage Examples

### Basic Rating

```jsx
<ZRating value={rating} onChange={setRating} />
```

### Half-Star Rating

```jsx
<ZRating value={4.5} onChange={setRating} allowHalf showValue />
```

### Read-only Display

```jsx
<ZRating value={4.2} readonly allowHalf label="Average Rating" />
```

### Required with Validation

```jsx
<ZRating
  value={rating}
  onChange={setRating}
  required
  error={!rating ? "Rating is required" : null}
  label="Rate this product"
/>
```

### Custom Size and Color

```jsx
<ZRating
  value={rating}
  onChange={setRating}
  size="lg"
  color="#ff6b6b"
  emptyColor="#2a2a2a"
/>
```
