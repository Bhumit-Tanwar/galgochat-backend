import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.routes.js";

dotenv.config({ path: "./.env" });

const app = express();
const server = http.createServer(app);

// ================= MIDDLEWARE =================
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("GalgoChat backend running");
});

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB error:", err));

// ================= SOCKET.IO =================
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});

let waitingSocket = null;

io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);
    //typing...
    socket.on("typing", () => {
        if (socket.roomId) {
            socket.to(socket.roomId).emit("typing");
        }
    });

    socket.on("stopTyping", () => {
        if (socket.roomId) {
            socket.to(socket.roomId).emit("stopTyping");
        }
    });
    //   /---/

    
    socket.on("start", () => {
        if (waitingSocket && waitingSocket.id !== socket.id) {
            const roomId = `room-${waitingSocket.id}-${socket.id}`;

            socket.join(roomId);
            waitingSocket.join(roomId);

            socket.roomId = roomId;
            waitingSocket.roomId = roomId;

            socket.emit("matched");
            waitingSocket.emit("matched");

            waitingSocket = null;
        } else {
            waitingSocket = socket;
            socket.emit("waiting");
        }
    });

    // ✅ MESSAGE (ONLY SERVER SENDS UI UPDATE)
    socket.on("message", (msg) => {
        if (!socket.roomId) return;

        io.to(socket.roomId).emit("message", {
            from: socket.id,
            text: msg,
        });
    });

    socket.on("next", () => {
        if (socket.roomId) {
            socket.to(socket.roomId).emit("ended");
            socket.leave(socket.roomId);
            socket.roomId = null;
        }
        waitingSocket = socket;
        socket.emit("waiting");
    });

    socket.on("disconnect", () => {
        if (waitingSocket?.id === socket.id) {
            waitingSocket = null;
        }
        if (socket.roomId) {
            socket.to(socket.roomId).emit("ended");
        }
    });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🔥 Server running on port ${PORT}`);
});
