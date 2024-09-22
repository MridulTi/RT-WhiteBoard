import express from "express"
import cors from "cors"
import { app,server } from "./socket";
const PORT=3000;

app.use(cors())
app.use(express.json())

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})