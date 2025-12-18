require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs-extra");

const dashboardRoutes = require ("./dashboard");

const app = express();
app.use(express.json());


/* AUTH: /getToken */
app.post("/getToken", async (req, res, next) => {
    try {
        const { username, password } = req.body; 
        const users = await fs.readJson("./data/users.json");
        
        const user = users.find(
            u => u.username === username && u.password === password 
        );

        if (!user) {
            return res.status(401).json({
                errorMessage: "Invalid username or password"
            });
        }
        const token = jwt.sign(
            {username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h"}
        );
        res.json({
            successMessage: "Authentication successful",
            token
        });
    } catch (err) {
        next(err);
    }
});

/* card route  */
app.use("/", dashboardRoutes);

app.use((err, req, res, next) => {
    console.error(err);

    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
            errorMessage: "Invalid token"
        });
    }

    res.status(500).json({
        errorMessage: "Server error"
      });
    });
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Card API running on http://localhost:${PORT}`);
    });