import express from "express"
import router from "./src/routes";
import cors from "cors"
import { app,server } from "./socket";
const PORT=3000;

app.use("/api/v1",router)
app.use(cors())
app.use(express.json())

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})