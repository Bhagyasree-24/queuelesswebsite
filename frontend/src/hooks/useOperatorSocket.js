import { useEffect } from "react";
import { io } from "socket.io-client";

export default function useOperatorSocket({ officeId, onQueueChange }) {
  useEffect(() => {
    if (!officeId) {
      console.warn("[Socket] Waiting for office ID");
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "";
    const socketUrl = apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");

    if (!socketUrl) {
      console.error("[Socket] Missing VITE_API_URL");
      return;
    }

    console.log("[Socket] Connecting to:", socketUrl);

    const socket = io(socketUrl, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket.id);

      socket.emit("office:join", officeId, (result) => {
        console.log("[Socket] Office join response:", result);
      });
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });

    const events = [
      "queue:updated",
      "token:called",
      "token:started",
      "token:completed",
      "token:skipped",
      "token:recalled",
      "counter:updated",
    ];

    const refreshQueue = (payload) => {
      console.log("[Socket] Queue event received:", payload);
      onQueueChange();
    };

    events.forEach((eventName) => {
      socket.on(eventName, refreshQueue);
    });

    return () => {
      socket.disconnect();
    };
  }, [officeId, onQueueChange]);
}