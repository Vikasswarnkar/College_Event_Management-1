const express = require('express');
router = express.Router();
const User = require('../../models/admin');
const {loginValidate_admin} = require('../../validation/user_validate');
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const verifyAdmin = require('../verify_admin')
const decode = require('jwt-decode')

router.get('/', verifyAdmin, async (req, res) => {
  try {
    
    
    const user = await User.findById(req.admin._id).select("-password");
    console.log(user);
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
 

router.post('/', async (req, res) => {


   //Validate login
  const {error} = loginValidate_admin(req.body);
  if(error) return res.status(400).json({ errors: [{ msg: error.message }] });



   // Email checking here 

   try {
     const user = await User.findOne({ "name": req.body.name });
     console.log(user)
     if (!user) return res
                  .status(400)
                  .json({ errors: [{ msg: "Invalid Credentials" }] });

     //Password validation
    //  const valid_password = await bcrypt.compare(
    //    req.body.password,
    //    user.password
    //  );
     if (user.password!=req.body.password)  return res
                                              .status(400)
                                              .json({
                                                errors: [
                                                  { msg: "Invalid Credentials" }
                                                ]
                                              });

     // create and assign a token here

     const token = jwt.sign(
       { _id: user._id },
       process.env.ADMIN_TOKEN_SECRET,
       { expiresIn: 60*30}, 
       (err, token) => {
       
         if (err) throw err;
         res.json({ token });
       }
     );
    
   } catch (error) {
     console.error(err.message);
     res.status(500).send("Server error");
   }

  

//   res.send("Logged in successfully");



})

module.exports = router;