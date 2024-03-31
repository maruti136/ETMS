const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const Admin = require("./Models/Admin");
const User = require("./Models/User");
const intTrainingPlan = require("./Models/intTrainingPlan");
const empTrainingPlan = require("./Models/empTrainingPlan");
const PersonalInfo = require("./Models/personalInfo");
const Performance = require("./Models/performance");

const app = express();

// middleware setup

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const withAuth = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  if (token.startsWith("Bearer ")) {
    // Check if it's a Bearer token
    // Remove 'Bearer ' to get the actual token
    token = token.slice(7, token.length);
  }

  jwt.verify(token, "MY_SECRET_KEY", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    } else {
      req.userId = decoded.userId;
      next();
    }
  });
};

mongoose
  .connect(
    "mongodb+srv://mihir:1234@cluster0.7os7mbu.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(error));

// Route for creating an admin
app.post("/admin", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    const personalInfo = await PersonalInfo.create({ email, password });
    const admin = await Admin.create({
      credId: personalInfo._id,
      fullName: fullName,
    });
    res.status(200).send(admin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Send email
const transporter = nodemailer.createTransport(
  smtpTransport({
    host: "smtp.gmail.com",
    port: 587,
    service: "gmail",
    auth: {
      user: "mail2sudatra@gmail.com", // Enter your email
      pass: "tafm wuew vucu ekkv", // Enter your password
    },
  })
);

const mailOptions = {
  from: "mail2sudatra@gmail.com", // Enter your email
  subject: "Account creation successful",
};

// Route for creating an user
app.post("/user", async (req, res) => {
  try {
    console.log("Hello............................");
    for (let i = 0; i < req.body.file.length - 1; i++) {
      let { email, userType, name: fullName } = req.body.file[i];

      // const { email, userType, fullName } = req.body;
      const defaultPassword = Math.random().toString(36).slice(-8);
      const personalInfo = await PersonalInfo.create({
        email: email,
        password: defaultPassword,
      });
      const user = await User.create({
        credId: personalInfo._id,
        fullName: fullName,
        userType: userType,
      });

      const performance = await Performance.create({
        userId: user._id,
      });

      const token = crypto.randomBytes(20).toString("hex");

      mailOptions.to = email;
      mailOptions.text = `Welcome ${fullName[0]}! Your ${userType} account has been created. \n 
    Username: ${email} \n
    Default password: ${defaultPassword}. \n 
    Password reset token: ${token} 
    Click the link to reset your password: http://localhost:3000/reset-password \n
    Token is valid for 1 hour`;

      // sending email to the user
      await User.findOneAndUpdate(
        { credId: personalInfo._id },
        {
          $set: {
            resetPasswordToken: token,
            resetPasswordExpires: Date.now() + 3600000, // Token expires in 1 hour (3600000 milliseconds)
          },
        }
      );

      await transporter.sendMail(mailOptions);
    }

    res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    res.status(400).json({ message: "User creation failed" });
  }
});

// // Route for admin sending email intimation to the user
// app.post("/send-email", async (req, res) => {
//   const { email } = req.body;
//   try {
//     // Generate default password
//     // const defaultPassword = Math.random().toString(36).slice(-8);
//     const cred = await PersonalInfo.findOne({ email });

//     if (!cred) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.json({ message: "Email sent successfully from backend" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Failed to send email from backend" });
//   }
// });

// Route for updating the user's password
app.post("/reset-password", async (req, res) => {
  const { email, token, newPassword } = req.body;

  try {
    const cred = PersonalInfo.findOne({ email });

    if (!cred) {
      return res.status(404).json({ error: "Invalid email" });
    }

    const user = await User.findOne({
      credId: cred._id,
    });

    if (user.isPasswordSet) {
      return res.redirect("/login"); //give the react router url here
    }

    if (!user.token === token || user.resetPasswordExpires < new Date()) {
      return res.status(404).json({ error: "Invalid token" });
    }

    cred.password = newPassword;
    user.isPasswordSet = true;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await cred.save();
    await user.save();

    res.json({ message: "Password updated Successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update password" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password: inputPassword } = req.body;

  try {
    // Find the user
    const foundCred = await PersonalInfo.findOne({ email });
    if (!foundCred) {
      return res.status(401).json({ error: "No user found with this email" });
    }

    // Determine user type
    let foundUser = await Admin.findOne({ credId: foundCred._id });
    let isAdmin = !!foundUser; // Convert to boolean
    if (!isAdmin) {
      foundUser = await User.findOne({ credId: foundCred._id });
    }

    // Check password (PLAIN TEXT - Not recommended)
    if (foundCred.password !== inputPassword) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: foundUser._id,
        userType: isAdmin ? "admin" : "user",
      },
      "MY_SECRET_KEY",
      { expiresIn: "24h" }
    );

    // Respond with token and user type
    res.json({
      message: "Logged in successfully",
      token,
      userType: isAdmin ? "admin" : "user",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to fetch user-details
app.get("/user-details", withAuth, async (req, res) => {
  try {
    console.log(req);
    let user = await Admin.findById(req.userId);
    let type = "admin";

    if (!user) {
      user = await User.findById(req.userId);
      type = user.userType;
    }

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    const cred = await PersonalInfo.findById(user.credId);

    const infoStatus = {
      type: type,
      phoneNumber: cred.phoneNumber ? cred.phoneNumber : false,
      linkedInProfile: cred.linkedInProfile ? cred.linkedInProfile : false,
      skills: cred.skills ? cred.skills : false,
      location: cred.location ? cred.location : false,
      collegeName: cred.collegeName ? cred.collegeName : false,
      program: cred.program ? cred.program : false,
      stream: cred.stream ? cred.stream : false,
    };

    res.status(200).json(infoStatus);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log("server running on port 3000");
});

app.get("/intSchedules", async (req, res) => {
  try {
    // Fetch schedules from the database
    const schedules = await intTrainingPlan.find();
    res.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/empSchedules", async (req, res) => {
  try {
    // Fetch schedules from the database
    const schedules = await empTrainingPlan.find();
    res.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ADDING THE TRAINING PLAN FOR INTERNS
app.post("/internal-training-plan", async (req, res) => {
  try {
    console.log(req.body);
    const { date, time, trainingName: planName, trainerName } = req.body;
    const newPlan = new intTrainingPlan({ date, time, planName, trainerName });
    await newPlan.save();
    res
      .status(201)
      .json({ message: "Internal training plan created successfully" });
  } catch (error) {
    console.error("Error creating internal training plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ADDING THE TRAINING PLAN FOR EMPLOYEES
app.post("/employee-training-plan", async (req, res) => {
  try {
    const { date, time, trainingName: planName, trainerName } = req.body;
    const newPlan = new empTrainingPlan({
      date,
      time,
      planName,
      trainerName,
    });
    await newPlan.save();
    res
      .status(201)
      .json({ message: "Employee training plan created successfully" });
  } catch (error) {
    console.error("Error creating employee training plan:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/performance", async (req, res) => {
  try {
    console.log("perfor---------------------------------------");
    for (let i = 0; i < req.body.file.length - 1; i++) {
      let { email, topic, evaluatedScore, totalScore } = req.body.file[i];
      console.log(email);
      // Create or update performance data for the user
      const cred = await PersonalInfo.findOne({ email });
      console.log(cred);
      const user = await User.findOne({ credId: cred._id });
      console.log(user);

      const performance = await Performance.findOneAndUpdate(
        { userId: user._id },
        { $set: { [`score.${topic}`]: [evaluatedScore, totalScore] } },
        { upsert: true, new: true }
      );
    }

    res
      .status(200)
      .json({ message: "Performance data added successfully", performance });
  } catch (error) {
    console.error("Error adding performance data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/personal-info/:email", async (req, res) => {
  console.log("Raaand");
  try {
    console.log(req.params.email);
    // Create personal info document
    const updatedCred = await PersonalInfo.updateOne(
      { email: req.params.email }, // Filter for the document to update
      { $set: req.body } // Fields to update
    );

    if (updatedCred.nModified === 0) {
      return res
        .status(404)
        .json({ message: "PersonalInfo not found with this email" });
    }

    const newCred = await PersonalInfo.findOne({
      email: req.params.email,
    });

    // console.log(newc);

    res
      .status(200)
      .json({ data: newCred, message: "PersonalInfo updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/getPerformance/:type", async (req, res) => {
  try {
    // Joining the Performance collection with the User collection
    const performances = await Performance.find().populate({
      path: "userId",
    });
    const internPerformances = performances.filter((performance) => {
      return performance.userId.userType === req.params.type;
    });

    // Map the filtered data to include only the required fields
    const result = internPerformances.map((performance) => ({
      score: performance.score,
      fullName: performance.userId.fullName,
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
