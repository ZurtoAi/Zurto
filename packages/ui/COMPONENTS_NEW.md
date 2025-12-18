# New Components - ZDataGrid, ZCalendar, ZTree

## ZDataGrid

### Preview 1: Basic Table

```tsx
import React from "react";

function ZDataGridBasic() {
  const data = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active" },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Alice Williams",
      email: "alice@example.com",
      status: "Active",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        height: "280px",
        backgroundColor: "#1a1a1a",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          color: "#ffffff",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#242424",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              ID
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              Name
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              Email
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
                color: "rgba(255, 255, 255, 0.9)",
              }}
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              style={{
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#242424")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <td
                style={{
                  padding: "12px 16px",
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                {row.id}
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  fontSize: "14px",
                  color: "#ffffff",
                }}
              >
                {row.name}
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                {row.email}
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  fontSize: "14px",
                }}
              >
                <span
                  style={{
                    padding: "4px 10px",
                    backgroundColor:
                      row.status === "Active"
                        ? "rgba(81, 207, 102, 0.1)"
                        : "rgba(255, 255, 255, 0.1)",
                    color:
                      row.status === "Active"
                        ? "#51cf66"
                        : "rgba(255, 255, 255, 0.7)",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Preview 2: With Actions

```tsx
import React, { useState } from "react";

function ZDataGridActions() {
  const [data, setData] = useState([
    {
      id: 1,
      task: "Update API documentation",
      priority: "High",
      assignee: "John",
      progress: 75,
    },
    {
      id: 2,
      task: "Fix login bug",
      priority: "Critical",
      assignee: "Jane",
      progress: 90,
    },
    {
      id: 3,
      task: "Design new dashboard",
      priority: "Medium",
      assignee: "Bob",
      progress: 30,
    },
  ]);

  const handleDelete = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        height: "280px",
        backgroundColor: "#1a1a1a",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        overflow: "auto",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          color: "#ffffff",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#242424",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              position: "sticky",
              top: 0,
            }}
          >
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Task
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Priority
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Assignee
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Progress
            </th>
            <th
              style={{
                padding: "12px 16px",
                textAlign: "center",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}
            >
              <td
                style={{
                  padding: "12px 16px",
                  fontSize: "14px",
                  color: "#ffffff",
                }}
              >
                {row.task}
              </td>
              <td style={{ padding: "12px 16px", fontSize: "14px" }}>
                <span
                  style={{
                    padding: "4px 10px",
                    backgroundColor:
                      row.priority === "Critical"
                        ? "rgba(223, 62, 83, 0.1)"
                        : row.priority === "High"
                        ? "rgba(255, 212, 59, 0.1)"
                        : "rgba(81, 207, 102, 0.1)",
                    color:
                      row.priority === "Critical"
                        ? "#df3e53"
                        : row.priority === "High"
                        ? "#ffd43b"
                        : "#51cf66",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: "500",
                  }}
                >
                  {row.priority}
                </span>
              </td>
              <td
                style={{
                  padding: "12px 16px",
                  fontSize: "14px",
                  color: "rgba(255, 255, 255, 0.7)",
                }}
              >
                {row.assignee}
              </td>
              <td style={{ padding: "12px 16px", fontSize: "14px" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: "6px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${row.progress}%`,
                        height: "100%",
                        backgroundColor: "#df3e53",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "rgba(255, 255, 255, 0.7)",
                      minWidth: "35px",
                    }}
                  >
                    {row.progress}%
                  </span>
                </div>
              </td>
              <td style={{ padding: "12px 16px", textAlign: "center" }}>
                <button
                  onClick={() => handleDelete(row.id)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "rgba(223, 62, 83, 0.1)",
                    color: "#df3e53",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(223, 62, 83, 0.2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(223, 62, 83, 0.1)")
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## ZCalendar

### Preview 1: Basic Month View

```tsx
import React, { useState } from "react";

function ZCalendarBasic() {
  const [currentDate] = useState(new Date(2025, 11, 18)); // December 18, 2025

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "400px",
        height: "300px",
        backgroundColor: "#1a1a1a",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        padding: "16px",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <button
          style={{
            padding: "8px",
            backgroundColor: "transparent",
            color: "#ffffff",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          ←
        </button>
        <div style={{ fontSize: "16px", fontWeight: "600" }}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button
          style={{
            padding: "8px",
            backgroundColor: "transparent",
            color: "#ffffff",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          →
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
          marginBottom: "8px",
        }}
      >
        {weekDays.map((day) => (
          <div
            key={day}
            style={{
              textAlign: "center",
              fontSize: "12px",
              fontWeight: "600",
              color: "rgba(255, 255, 255, 0.5)",
              padding: "8px 0",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "4px",
        }}
      >
        {days.map((day, index) => (
          <div
            key={index}
            style={{
              aspectRatio: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              color: day ? "#ffffff" : "transparent",
              backgroundColor: day === 18 ? "#df3e53" : "transparent",
              borderRadius: "6px",
              cursor: day ? "pointer" : "default",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              if (day && day !== 18)
                e.currentTarget.style.backgroundColor = "#242424";
            }}
            onMouseLeave={(e) => {
              if (day && day !== 18)
                e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Preview 2: With Events

```tsx
import React, { useState } from "react";

function ZCalendarEvents() {
  const [currentDate] = useState(new Date(2025, 11, 18));
  const [selectedDay, setSelectedDay] = useState(18);

  const events = {
    18: [{ title: "Team Meeting", time: "10:00 AM", color: "#df3e53" }],
    20: [{ title: "Project Deadline", time: "5:00 PM", color: "#ffd43b" }],
    25: [{ title: "Holiday", time: "All day", color: "#51cf66" }],
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        height: "300px",
        backgroundColor: "#1a1a1a",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        padding: "16px",
        color: "#ffffff",
        display: "flex",
        gap: "16px",
      }}
    >
      <div style={{ flex: "2" }}>
        <div
          style={{
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          December 2025
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "4px",
          }}
        >
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                fontSize: "11px",
                color: "rgba(255, 255, 255, 0.5)",
                padding: "4px 0",
              }}
            >
              {day}
            </div>
          ))}

          {days.map((day, index) => (
            <div
              key={index}
              onClick={() => day && setSelectedDay(day)}
              style={{
                aspectRatio: "1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                position: "relative",
                color: day ? "#ffffff" : "transparent",
                backgroundColor:
                  day === selectedDay ? "#df3e53" : "transparent",
                borderRadius: "6px",
                cursor: day ? "pointer" : "default",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (day && day !== selectedDay)
                  e.currentTarget.style.backgroundColor = "#242424";
              }}
              onMouseLeave={(e) => {
                if (day && day !== selectedDay)
                  e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {day}
              {day && events[day] && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    width: "4px",
                    height: "4px",
                    backgroundColor: events[day][0].color,
                    borderRadius: "50%",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: "1",
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
          paddingLeft: "16px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "12px",
            color: "rgba(255, 255, 255, 0.9)",
          }}
        >
          Dec {selectedDay}
        </div>
        {events[selectedDay] ? (
          events[selectedDay].map((event, i) => (
            <div
              key={i}
              style={{
                padding: "8px",
                backgroundColor: "#242424",
                borderRadius: "6px",
                borderLeft: `3px solid ${event.color}`,
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  marginBottom: "4px",
                }}
              >
                {event.title}
              </div>
              <div
                style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)" }}
              >
                {event.time}
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.5)",
              fontStyle: "italic",
            }}
          >
            No events
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## ZTree

### Preview 1: Basic File Tree

```tsx
import React, { useState } from "react";

function ZTreeBasic() {
  const [expanded, setExpanded] = useState({ src: true });

  const toggleNode = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const treeData = [
    {
      id: "src",
      label: "src",
      type: "folder",
      children: [
        {
          id: "src/components",
          label: "components",
          type: "folder",
          children: [
            {
              id: "src/components/Button.tsx",
              label: "Button.tsx",
              type: "file",
            },
            {
              id: "src/components/Input.tsx",
              label: "Input.tsx",
              type: "file",
            },
          ],
        },
        {
          id: "src/utils",
          label: "utils",
          type: "folder",
          children: [
            { id: "src/utils/helpers.ts", label: "helpers.ts", type: "file" },
          ],
        },
        { id: "src/App.tsx", label: "App.tsx", type: "file" },
      ],
    },
    { id: "package.json", label: "package.json", type: "file" },
    { id: "README.md", label: "README.md", type: "file" },
  ];

  const renderNode = (node, level = 0) => (
    <div key={node.id}>
      <div
        onClick={() => node.type === "folder" && toggleNode(node.id)}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "6px 12px",
          paddingLeft: `${12 + level * 20}px`,
          cursor: node.type === "folder" ? "pointer" : "default",
          fontSize: "14px",
          color: "#ffffff",
          transition: "background-color 0.2s",
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#242424")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "transparent")
        }
      >
        {node.type === "folder" && (
          <span
            style={{
              marginRight: "8px",
              fontSize: "12px",
              color: "rgba(255, 255, 255, 0.7)",
              transition: "transform 0.2s",
              transform: expanded[node.id] ? "rotate(90deg)" : "rotate(0deg)",
              display: "inline-block",
            }}
          >
            ▶
          </span>
        )}
        {node.type === "file" && (
          <span
            style={{ marginRight: "8px", marginLeft: "20px", fontSize: "12px" }}
          >
            📄
          </span>
        )}
        <span
          style={{
            color:
              node.type === "folder" ? "#ffffff" : "rgba(255, 255, 255, 0.8)",
          }}
        >
          {node.label}
        </span>
      </div>
      {node.type === "folder" && expanded[node.id] && node.children && (
        <div>{node.children.map((child) => renderNode(child, level + 1))}</div>
      )}
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "400px",
        height: "280px",
        backgroundColor: "#1a1a1a",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        overflow: "auto",
        color: "#ffffff",
      }}
    >
      {treeData.map((node) => renderNode(node))}
    </div>
  );
}
```

### Preview 2: With Selection & Icons

```tsx
import React, { useState } from "react";

function ZTreeWithSelection() {
  const [expanded, setExpanded] = useState({
    project: true,
    "project/src": true,
  });
  const [selected, setSelected] = useState("project/src/App.tsx");

  const toggleNode = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const treeData = [
    {
      id: "project",
      label: "📦 Project Root",
      type: "folder",
      children: [
        {
          id: "project/src",
          label: "📁 src",
          type: "folder",
          children: [
            {
              id: "project/src/App.tsx",
              label: "⚛️ App.tsx",
              type: "file",
              lang: "tsx",
            },
            {
              id: "project/src/index.ts",
              label: "📘 index.ts",
              type: "file",
              lang: "ts",
            },
            {
              id: "project/src/styles.css",
              label: "🎨 styles.css",
              type: "file",
              lang: "css",
            },
          ],
        },
        {
          id: "project/public",
          label: "📁 public",
          type: "folder",
          children: [
            {
              id: "project/public/index.html",
              label: "📄 index.html",
              type: "file",
              lang: "html",
            },
          ],
        },
        {
          id: "project/package.json",
          label: "📦 package.json",
          type: "file",
          lang: "json",
        },
        {
          id: "project/tsconfig.json",
          label: "⚙️ tsconfig.json",
          type: "file",
          lang: "json",
        },
      ],
    },
  ];

  const renderNode = (node, level = 0) => (
    <div key={node.id}>
      <div
        onClick={() => {
          if (node.type === "folder") {
            toggleNode(node.id);
          } else {
            setSelected(node.id);
          }
        }}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "8px 12px",
          paddingLeft: `${12 + level * 24}px`,
          cursor: "pointer",
          fontSize: "14px",
          color: "#ffffff",
          transition: "background-color 0.2s",
          backgroundColor:
            selected === node.id ? "rgba(223, 62, 83, 0.15)" : "transparent",
          borderLeft:
            selected === node.id
              ? "3px solid #df3e53"
              : "3px solid transparent",
        }}
        onMouseEnter={(e) => {
          if (selected !== node.id)
            e.currentTarget.style.backgroundColor = "#242424";
        }}
        onMouseLeave={(e) => {
          if (selected !== node.id)
            e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        {node.type === "folder" && (
          <span
            style={{
              marginRight: "8px",
              fontSize: "10px",
              color: "rgba(255, 255, 255, 0.7)",
              transition: "transform 0.2s",
              transform: expanded[node.id] ? "rotate(90deg)" : "rotate(0deg)",
              display: "inline-block",
            }}
          >
            ▶
          </span>
        )}
        {node.type === "file" && (
          <span style={{ marginRight: "8px", marginLeft: "18px" }}></span>
        )}
        <span
          style={{
            color:
              selected === node.id
                ? "#df3e53"
                : node.type === "folder"
                ? "#ffffff"
                : "rgba(255, 255, 255, 0.8)",
            fontWeight: selected === node.id ? "500" : "400",
          }}
        >
          {node.label}
        </span>
      </div>
      {node.type === "folder" && expanded[node.id] && node.children && (
        <div>{node.children.map((child) => renderNode(child, level + 1))}</div>
      )}
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "450px",
        height: "300px",
        backgroundColor: "#1a1a1a",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        overflow: "auto",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          padding: "12px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          fontSize: "13px",
          fontWeight: "600",
          color: "rgba(255, 255, 255, 0.9)",
          backgroundColor: "#242424",
          position: "sticky",
          top: 0,
        }}
      >
        File Explorer
      </div>
      {treeData.map((node) => renderNode(node))}
    </div>
  );
}
```
