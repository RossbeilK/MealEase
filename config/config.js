// config/config.js
/*const config = {
  port: process.env.PORT || 3000,
  mongoUri:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/food_ordering_app",
  jwtSecret: process.env.JWT_SECRET || "super_secret_for_food_app"
};

export default config;*/



const config = {
  port: process.env.PORT || 3000,
  mongoUri:
    "mongodb+srv://2602842404jrf_db_user:9UQ2P-ghZ.t6.En@cluster0.gmnrrpi.mongodb.net/MealEase?retryWrites=true&w=majority&appName=Cluster0",
  jwtSecret: process.env.JWT_SECRET || "super_secret_for_food_app"
};


export default config;


