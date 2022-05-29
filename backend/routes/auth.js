const express = require('express');
const router = express.Router();
const upmetricUser = require('../models/upmetricUser');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = 'thisissecurity';
var nodemailer = require('nodemailer');
const path = require('path');

// fuction for email  verify and reset password
async function sendVerificationEmail(gmail, name, id, type) {
  try {
    //  Please use customize email and password
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'admin@gmail.com',// Please use here  sender  mail
        pass: 'admin'// Please use here  sender  password
      }
    });
    // for email verification
    if (type === "verify") {
      var mailOptions = {
        from: 'admin@gmail.com', // Please use here  sender  mail
        to: gmail, // Please use here reciver mail
        subject: 'Upmetrics.com -Please verify Email',
        html: `<p>Mr ${name}Please verify your account using this link <a href=http://127.0.0.1:5000/api/auth/verify?id=${id}> verify </a> your mail.</p>`,
      };
      // for user timout to verify
      setTimeout(async () => {
        let user = await upmetricUser.findById({ _id: id })
        if (user) {
          if (user.isverified) {
            console.log("verified")
          } else {
            // if user not verify his/her email then email is deleted from datbase after three minute
            upmetricUser.findByIdAndDelete({ _id: id }, () => {
              console.log("not verified")
              success = false
            })
          }
        }
      }, 180000)
    } else {
      //  for forgot password
      var mailOptions = {
        from: 'sk26481012@gmail.com',
        to: gmail,
        subject: 'Upmetrics.com -Set up new password by using this link',
        html: `<p>Mr ${name}Please verify your account using this link <a href=http://127.0.0.1:5000/api/auth/reset> rest password </a> .</p>`,
      };
      // sending form for rest password enter when user click on email link
      router.get("/reset", (req, res) => {
        res.sendFile(path.join(__dirname + '/rest.html'));
      })
      // for restting password
      router.post("/reset", async (req, res) => {
        let password = req.body.password
        try {
          if (password) {
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(password, salt);
            await upmetricUser.findByIdAndUpdate({ _id: id }, { password: secPass }, { new: true })
            res.send("your Password is reseted")
          } else {
            res.sendFile(path.join(__dirname + '/rest.html'));

          }
        } catch (error) {
          console.log(error)
          res.status(400).send("please enter new password and try again by forgot")
        }
      })
    }
    // sending mail to user
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("into eror")
        console.log(error.message);
      } else {
        console.log(info);
        console.log("not erorr")
      }
    });
  } catch (error) {
    console.log(error)

  }
}
"use strict";


// user sign up by using name email password 
router.post('/createuser', [
  body('gmail', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
  body('name', 'Password can not be blank')], async (req, res) => {

    const { gmail, name, password } = req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = errors.array()
      return res.status(400).json(error);
    }
    try {
      // Check whether the user with this email exists already
      let user = await upmetricUser.findOne({ gmail });
      if (user) {
        let success = false
        return res.status(200).json({ success, error: "Sorry a user with this email already exists" })
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);
      // Create a new user
      user = new upmetricUser({
        name: name,
        password: secPass,
        gmail: gmail,
      });
      const userData = await user.save()
      if (userData) {
        type = "verify"
        sendVerificationEmail(gmail, name, userData._id, type)
        success = true
        return res.status(200).json({ success, mes: "you registered succesfully,Please authenticate your data by click on link that share on your mail that expires in three minute" })
      } else {
        success = false
        return res.status(200).json({ success, mes: "your registration failed " })
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error createuser");
    }
  })

// for veryfy new user
router.get("/verify", async (req, res) => {
  try {
    const update = await upmetricUser.updateOne({ _id: req.query.id }, { $set: { isverified: true } })
    res.status(200).send("email verified now you can login")
  } catch (error) {
    console.log(error)
  }

})

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
  body('gmail', 'Enter a valid email').isEmail(),
  body('password', 'Password can not be blank').exists(),
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { gmail, password } = req.body;
  try {
    let user = await upmetricUser.findOne({ gmail });
    if (!user) {
      success = false
      return res.status(200).json({ success, error: "Please try to login with correct credentials" });
    } else if (user) {
      if (user.isverified) {
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
          success = false
          return res.status(200).json({ success, error: "Please try to login with correct credentials" });
        }

        const data = {
          user: {
            id: user.id
          }
        }

        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        message = "You are logined succesfully"
        res.json({ success, authtoken, message })
      } else {
        success = false
        return res.status(200).json({ success, error: "Please verify your email to login with correct credentials" });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// ROUTE 3: Get loggedin User Details using: get "/api/auth/getuser". Login required
router.get('/getuser', fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const guser = await upmetricUser.findById(userId).select("-password")
    if (guser) {
      success = true
      res.status(200).json({ success, guser })
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
/// ROUTE 3: Update an existing User using: PUT "/api/auth/updateUSer". Login required
router.put('/updateuser/:id', fetchuser, async (req, res) => {
  const { name, img, dob } = req.body;
  try {
    // Create a userupdate object
    const newUser = {};
    if (name) { newUser.name = name };
    if (img) { newUser.img = img };
    if (dob) { newUser.dob = dob };
    // Find the user to be updated and update it
    if (name || img || dob) {
      let user = await upmetricUser.findById({ _id: req.params.id });
      if (!user) { return res.status(404).send("Not Found") }
      updateuser = await upmetricUser.findByIdAndUpdate({ _id: req.params.id }, { $set: newUser }, { new: true }).select("-password")
      res.json({ updateuser, mes: "your data is updated" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
// Forgot password link
router.post('/forgot', async (req, res) => {
  try {
    const { gmail, name, dob } = req.body
    if (gmail && name && dob) {
      const guser = await upmetricUser.findOne({ gmail })
      if (guser) {
        if (guser.name !== name) {
          success = false
          return res.status(200).json({ success, mes: "try to forgot with correct credential" })
        }
        if (guser.dob !== dob) {
          success = false
          return res.status(200).json({ success, mes: "try to forgot with correct credential" })
        }
        type = "forgot"
        sendVerificationEmail(gmail, name, guser._id, type)
        success = true
        return res.status(200).json({ success, mes: "Reset password link shared on you male" })
      }
    } else {
      success = false
      return res.status(200).json({ success, mes: "try to forgot with all details with correct credential" })
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
module.exports = router