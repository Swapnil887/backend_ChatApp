require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars')
const bcrypt = require('bcrypt');
const fs = require('fs')
const userRoute = express.Router()
const { authenticate } = require("../middleware/authonticate");
const { BlackListModel } = require("../models/blacklist.model");
const { UserModel } = require('../models/user.model');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASS,
    },
  });
userRoute.post('/signup', async (req, res) => {
    
    console.log(req.body);
    let { name, email, password } = req.body
    let userexists = await UserModel.findOne({ email })
  
    if (userexists !== null) res.json("exists");
    else {
      const directory = path.join(__dirname, "..", "verify.html");
      console.log(directory)
      const fileRead = fs.readFileSync(directory, "utf-8");
      const template = handlebars.compile(fileRead);
      const htmlToSend = template({ name, email });
      let mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: "Verify Account",
        html: htmlToSend,
      };
      transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
          console.log(err);
          res.json("Invalid Email")
        } else {
          console.log(info);
          let hash = bcrypt.hashSync(password, 10)
          let obj = {
            name,
            email,
            password: hash
          }
          let user = new UserModel(obj)
          await user.save()
          res.json("Email Sent")
        }
      });
    }
  });
  userRoute.get('/status/:email', async (req, res) => {
    let email = req.params.email
    console.log(email);
    await UserModel.findOneAndUpdate({ email }, { status: true })
    const userData = JSON.stringify(email);
  
    // Encode the serialized JSON as a URL-safe string
    const encodedData = encodeURIComponent(userData);
  
    res.redirect(`https://front-end-chatapp.vercel.app/login.html?user=${encodedData}`)
  });


  userRoute.post("/login", async (req, res) => {
    let { email, password } = req.body
    let user = await UserModel.findOne({ email })
    if (user == null) res.json("NotFound")
    else if (user.status == false) res.json("Confirm your Account")
    else {
      let hash = bcrypt.compareSync(password, user.password)
      if (hash) {
        res.json(user)
      } else {
        res.json("Incorrect Password")
      }
    }
  })
  
userRoute.get("/p",authenticate,(req,res)=>{
    res.json(req.body)
})

userRoute.get("/logout",authenticate,async (req,res)=>{
    const token = req.headers.authorization;
    try {
        var x =  BlackListModel({"blacklist":token})
        var data =await x.save()
        res.json("logout")
    } catch (error) {
        console.log(error)
        res.json("something went wrong while login")
    }
})

module.exports = {userRoute}
