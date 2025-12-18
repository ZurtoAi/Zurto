import React, { useState, useEffect, useRef } from "react";
import { socketService } from "../services/socket";
import "../styles/CollaborativeCursors.css";

interface UserCursor {
  id: string;
  username: string;
  color: string;
  x: number;
  y: number;
  lastUpdate: number;
}

interface CollaborativeCursorsProps {
  projectId: string;
  transform: { x: number; y: number; scale: number };
  canvasRef: React.RefObject<HTMLElement>;
  enabled?: boolean;
}

// Generate consistent colors for users
const getUserColor = (userId: string): string => {
  const colors = [
    "#5865f2", // Discord blue
    "#10b981", // Green
    "#f59e0b", // Orange
    "#8b5cf6", // Purple
    "#ef4444", // Red
    "#06b6d4", // Cyan
    "#ec4899", // Pink
    "#14b8a6", // Teal
  ];

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const CollaborativeCursors: React.FC<CollaborativeCursorsProps> = ({
  projectId,
  transform,
  canvasRef,
  enabled = true,
}) => {
  const [cursors, setCursors] = useState<Map<string, UserCursor>>(new Map());
  const [currentUserId] = useState(
    () => `user-${Math.random().toString(36).substr(2, 9)}`
  );
  const lastEmitRef = useRef<number>(0);
  const EMIT_THROTTLE = 50; // ms between emissions
  const CURSOR_TIMEOUT = 5000; // Remove cursor after 5s of inactivity

  // Join project room and set up cursor listeners
  useEffect(() => {
    if (!enabled) return;

    const socket = socketService.getSocket();
    if (!socket) return;

    // Join project collaboration
    socket.emit("project:join", { projectId, userId: currentUserId });

    // Listen for other users' cursor movements
    socket.on(
      "user:cursor",
      (data: { userId: string; username: string; x: number; y: number }) => {
        if (data.userId === currentUserId) return;

        setCursors((prev) => {
          const newCursors = new Map(prev);
          newCursors.set(data.userId, {
            id: data.userId,
            username: data.username || `User ${data.userId.slice(-4)}`,
            color: getUserColor(data.userId),
            x: data.x,
            y: data.y,
            lastUpdate: Date.now(),
          });
          return newCursors;
        });
      }
    );

    // Listen for user leaving
    socket.on("user:leave", (data: { userId: string }) => {
      setCursors((prev) => {
        const newCursors = new Map(prev);
        newCursors.delete(data.userId);
        return newCursors;
      });
    });

    return () => {
      socket.emit("project:leave", { projectId, userId: currentUserId });
      socket.off("user:cursor");
      socket.off("user:leave");
    };
  }, [projectId, currentUserId, enabled]);

  // Clean up stale cursors
  useEffect(() => {
    if (!enabled) return;

    const cleanup = setInterval(() => {
      const now = Date.now();
      setCursors((prev) => {
        const newCursors = new Map(prev);
        for (const [id, cursor] of newCursors) {
          if (now - cursor.lastUpdate > CURSOR_TIMEOUT) {
            newCursors.delete(id);
          }
        }
        return newCursors;
      });
    }, 1000);

    return () => clearInterval(cleanup);
  }, [enabled]);

  // Track and emit local cursor position
  useEffect(() => {
    if (!enabled || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const socket = socketService.getSocket();
    if (!socket) return;

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastEmitRef.current < EMIT_THROTTLE) return;
      lastEmitRef.current = now;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - transform.x) / transform.scale;
      const y = (e.clientY - rect.top - transform.y) / transform.scale;

      socket.emit("user:cursor", {
        projectId,
        userId: currentUserId,
        username:
          localStorage.getItem("username") || `User ${currentUserId.slice(-4)}`,
        x,
        y,
      });
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, [projectId, currentUserId, transform, canvasRef, enabled]);

  if (!enabled || cursors.size === 0) return null;

  return (
    <div className="collaborative-cursors">
      {Array.from(cursors.values()).map((cursor) => (
        <div
          key={cursor.id}
          className="user-cursor"
          style={
            {
              left: cursor.x * transform.scale + transform.x,
              top: cursor.y * transform.scale + transform.y,
              "--cursor-color": cursor.color,
            } as React.CSSProperties
          }
        >
          <svg
            className="cursor-pointer"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={cursor.color}
          >
            <path d="M5.5 3.21V20.8l5.5-5.5h9L5.5 3.21z" />
          </svg>
          <span
            className="cursor-label"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.username}
          </span>
        </div>
      ))}
    </div>
  );
};

// Presence indicator component for showing who's online
interface PresenceIndicatorProps {
  projectId: string;
}

export const PresenceIndicator: React.FC<PresenceIndicatorProps> = ({
  projectId,
}) => {
  const [users, setUsers] = useState<
    Array<{ id: string; username: string; color: string }>
  >([]);

  useEffect(() => {
    const socket = socketService.getSocket();
    if (!socket) return;

    socket.on(
      "project:users",
      (data: { users: Array<{ id: string; username: string }> }) => {
        setUsers(
          data.users.map((u) => ({
            ...u,
            color: getUserColor(u.id),
          }))
        );
      }
    );

    // Request current users
    socket.emit("project:get-users", { projectId });

    return () => {
      socket.off("project:users");
    };
  }, [projectId]);

  if (users.length <= 1) return null;

  return (
    <div className="presence-indicator">
      <div className="presence-avatars">
        {users.slice(0, 5).map((user, index) => (
          <div
            key={user.id}
            className="presence-avatar"
            style={{
              backgroundColor: user.color,
              zIndex: users.length - index,
            }}
            title={user.username}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
        ))}
        {users.length > 5 && (
          <div className="presence-more" title={`${users.length - 5} more`}>
            +{users.length - 5}
          </div>
        )}
      </div>
      <span className="presence-count">{users.length} online</span>
    </div>
  );
};
