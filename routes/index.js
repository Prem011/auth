var express = require('express');
var router = express.Router();
var user = require("../models/usermodel")
const passport = require("passport");
const LocalStrategy = require("passport-local");
const upload = require("../utils/multer").single("profileImage");
const fs = require('fs');
const path = require("path")
const sendEmail = require("../utils/nodemailer")


passport.use(new LocalStrategy(user.authenticate()))
//this line will gonna authenticate the user for us in backend

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user: req.user });
});

router.get('/about', function(req, res, next) {
  res.render('about', { user: req.user });
});

router.get('/register', function(req, res, next) {
  res.render('register', { user: req.user });
});

router.get('/profile', isLoggedIn, function(req, res, next) {
  // const user1 = user.findOne({username : req.session.possport.user})
  // res.render('profile', {user : user1}); 
  res.render('profile', { user: req.user });
});

router.post("/fileupload/:id", isLoggedIn, upload , async function(req, res, next){
  // res.send("uploaded")
  
  // try{
  //   const user1 = await user.findOne({username : req.user})
  //     if(req.user.profileImage !== "default.jpg"){
  //       fs.unlinkSync(path.join(__dirname, "..", "public", "images", "uploads2", req.user.profileImage));
  //     }
  //   user1.profileImage = req.file.filename;
  //   await user1.save();
  //   res.redirect("/profile");
  //   }
  // catch(err){
  //   res.send(err);
  // }

    try {
        if(req.user.profileImage !== "default.png") {
            fs.unlinkSync(path.join(__dirname,"..","public","images","profileImages",req.user.profileImage));
        }
        req.user.profileImage = req.file.filename;
        await req.user.save();
        res.redirect(`/profile`);
      } catch (error) {
          res.send(error);
      }

});


router.post('/register', async function(req, res, next) {
  // try{
  //   const user1 =  await user(req.body);
  //   await user1.save();
  //   res.redirect('/profile');
  // }
  // catch(err){
  //   res.send(err)
  // }

  try{
      const { username, email, name , password} = req.body;
      await user.register({username, email, name}, password);
      //register method is provided by the plm here to register securely (1st parameters will gonna be the content which we wanna save as it is) (2nd parameter will be use to encrypt that data)
      res.redirect("/login")
  }
  catch(err){
      res.send(err);
  }

});

router.get('/login',  function(req, res, next) {
  res.render('login', { user: req.user });
});

router.get('/edit/:id',  function(req, res, next) {
  res.render('update_profile', { user: req.user });
});


//login CODE
router.post(
    "/login-user",
    passport.authenticate("local", {
        successRedirect: "/profile",
        failureRedirect: "/login",
    }),
    function (req, res, next) {}
);


//AUTHENTICATED ROUTE MIDDLEWARE
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}


//SIGNOUT CODE
router.get("/logout", isLoggedIn, function (req, res, next) {
    req.logout(() => {
        res.redirect("/login");
    });
});

router.get('/resetPassword/:id',isLoggedIn, function(req, res){
  res.render('resetPassword', {user : req.user});
})


router.post('/resetPassword/:id', isLoggedIn, async function(req, res){
  try{
    await req.user.changePassword(req.body.oldPassword, req.body.newPassword)
    req.user.save();
    res.alert("Password changed successfully");
    res.redirect(`/edit/${req.user._id}`);  
  }
  catch(err){
    res.send(err)
  }
})

//forget password
router.get("/forgetEmail", function(req, res, next){
  res.render("forgetEmail", { user : req.user});
})


router.post("/forgetEmail", async function(req, res, next){
  try{
    const user1 = await user.findOne({email : req.body.email});

    if(user1){
      // res.json(user)
      res.redirect(`/forgetPassword/${user1._id}`);
    }
    else{
      res.redirect("/forgetEmail");
    }

  }
  catch(err){
    res.send(err);
  }
})

router.get("/forgetPassword/:id", function(req, res, next){
  res.render("forgetPassword", {user : req.user, id: req.params.id});
})

router.post("/forgetPassword/:id", async function(req, res, next){
  try{
    const user1 = await user.findById(req.params.id);
    await user1.setPassword(req.body.password);
    await user1.save();
    res.redirect("/login");
  }
  catch(err){
    res.send(err);
  }
})

router.get("/deleteAcc/:id",isLoggedIn, async function(req, res, next){
  try{

    const deletedUser = await user.findByIdAndDelete(req.params.id);

    if(deletedUser.profileImage !== "default.png"){
      fs.unlinkSync(path.join(__dirname, "..", "public", "images", "profileImages", deletedUser.profileImage));
    }

    res.redirect("/register")

  }catch(err){
    res.send(err);
  }
})

router.post("/send-email", sendEmail, (req, res) =>{
  res.send("Email sent successfully");
})

module.exports = router;


