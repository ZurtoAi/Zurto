import io, { Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "wss://api.zurto.app";

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(SOCKET_URL, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        this.socket.on("connect", () => {
          console.log("✅ Socket.io connected:", this.socket?.id);
          this.emit("_internal:connected");
          resolve();
        });

        this.socket.on("disconnect", () => {
          console.log("❌ Socket.io disconnected");
          this.emit("_internal:disconnected");
        });

        this.socket.on("error", (error) => {
          console.error("Socket.io error:", error);
          this.emit("_internal:error", error);
        });
      } catch (error) {
        console.error("Failed to initialize Socket.io:", error);
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // Register with socket if it exists
    if (this.socket) {
      this.socket.on(event, (...args) => callback(...args));
    }
  }

  off(event: string, callback?: Function): void {
    if (!callback) {
      this.listeners.delete(event);
      if (this.socket) {
        this.socket.off(event);
      }
      return;
    }

    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event: string, ...args: any[]): void {
    // Emit to local listeners
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(...args));
    }

    // Emit to server
    if (this.socket && !event.startsWith("_internal:")) {
      this.socket.emit(event, ...args);
    }
  }

  getId(): string | undefined {
    return this.socket?.id;
  }

  // Convenience methods for common operations
  joinProject(userId: string, userName: string, projectId: string): void {
    this.emit("user:join", { userId, name: userName, projectId });
  }

  leaveProject(): void {
    this.emit("user:leave");
  }

  sendNodeUpdate(
    nodeId: string,
    projectId: string,
    updates: Record<string, any>
  ): void {
    this.emit("node:update", { nodeId, projectId, ...updates });
  }

  sendNodeCreate(
    nodeId: string,
    projectId: string,
    nodeData: Record<string, any>
  ): void {
    this.emit("node:create", { nodeId, projectId, ...nodeData });
  }

  sendNodeDelete(nodeId: string, projectId: string): void {
    this.emit("node:delete", { nodeId, projectId });
  }

  sendNodeMove(nodeId: string, x: number, y: number, projectId: string): void {
    this.emit("node:move", { nodeId, x, y, projectId });
  }

  sendCursorPosition(x: number, y: number, projectId: string): void {
    this.emit("user:cursor", { x, y, projectId });
  }
}

export const socketService = new SocketService();

// Event types for TypeScript
export type SocketEventData = {
  // User presence
  "user:joined": {
    socketId: string;
    userId: string;
    name: string;
    projectId?: string;
    activeUsers: any[];
  };
  "user:left": {
    socketId: string;
    userId: string;
    name: string;
    activeUsers: any[];
  };
  "user:cursor": { socketId: string; x: number; y: number; projectId: string };

  // Node events
  "node:updated": { nodeId: string; projectId: string; [key: string]: any };
  "node:created": { nodeId: string; projectId: string; [key: string]: any };
  "node:deleted": { nodeId: string; projectId: string };
  "node:moved": { nodeId: string; x: number; y: number; projectId: string };

  // Relationship events
  "relationship:created": {
    sourceId: string;
    targetId: string;
    type: string;
    projectId: string;
  };
  "relationship:deleted": { relationshipId: string; projectId: string };

  // Build/sync events
  "build:progress": { projectId: string; progress: number; status: string };
  "project:sync": { projectId: string };

  // Internal events
  "_internal:connected": void;
  "_internal:disconnected": void;
  "_internal:error": Error;
};
