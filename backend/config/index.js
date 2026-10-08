import dotenv from "dotenv";
dotenv.config(); 
const config = {
    port: process.env.PORT || 5000, 
    mongoUri: process.env.MONGODB_URI, 
    jwtSecret: process.env.JWT_SECRET, 
}; 
if (!config.mongoUri) throw new Error("Missing MONGODB_URI in .env file"); 
if (!config.jwtSecret) throw new Error("Missing JWT_SECRET in .env file"); 

export default config;