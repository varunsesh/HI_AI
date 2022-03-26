const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require("multer");
const path = require('path');
const fs = require("fs");


const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "./upload"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});



router.get('/', (req, res, next) => {
	return res.render('index.ejs');
});


router.post('/', (req, res, next) => {
	let personInfo = req.body;

	if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({ email: personInfo.email }, (err, data) => {
				if (!data) {
					let c;
					User.findOne({}, (err, data) => {

						if (data) {
							c = data.unique_id + 1;
						} else {
							c = 1;
						}

						let newPerson = new User({
							unique_id: c,
							email: personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save((err, Person) => {
							if (err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({ _id: -1 }).limit(1);
					res.send({ "Success": "You are registered,You can login now." });
				} else {
					res.send({ "Success": "Email is already used." });
				}

			});
		} else {
			res.send({ "Success": "password is not matched" });
		}
	}
});

router.get('/login', (req, res, next) => {
	return res.render('login.ejs');
});

router.post('/login', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, data) => {
		if (data) {

			if (data.password == req.body.password) {
				req.session.userId = data.unique_id;
				res.send({ "Success": "Success!" });
			} else {
				res.send({ "Success": "Wrong password!" });
			}
		} else {
			res.send({ "Success": "This Email Is not registered!" });
		}
	});
});

router.get('/profile', (req, res, next) => {
	User.findOne({ unique_id: req.session.userId }, (err, data) => {
		if (!data) {
			res.redirect('/');
		} else {
			return res.render('data.ejs', { "name": data.username, "email": data.email });
		}
	});
});

router.get('/logout', (req, res, next) => {
	if (req.session) {
		// delete session object
		req.session.destroy((err) => {
			if (err) {
				return next(err);
			} else {
				return res.redirect('/');
			}
		});
	}
});

router.get('/about', (req, res, next)=>{
	res.render("about.ejs")
})

router.get('/forgetpass', (req, res, next) => {
	res.render("forget.ejs");
});

router.post('/forgetpass', (req, res, next) => {
	User.findOne({ email: req.body.email }, (err, data) => {
		if (!data) {
			res.send({ "Success": "This Email Is not registered!" });
		} else {
			if (req.body.password == req.body.passwordConf) {
				data.password = req.body.password;
				data.passwordConf = req.body.passwordConf;

				data.save((err, Person) => {
					if (err)
						console.log(err);
					else
						console.log('Success');
					res.send({ "Success": "Password changed!" });
				});
			} else {
				res.send({ "Success": "Password do not match! Both Password should be same." });
			}
		}
	});

});

router.post(
	"/predict",
	upload.single("file" /* name attribute of <file> element in your form */),
	(req, res) => {
	  const tempPath = req.file.path;
	  const targetPath = path.join(__dirname, "./uploads/image.png");
  
	//   if (path.extname(req.file.originalname).toLowerCase() === ".png") {
	// 	fs.rename(tempPath, targetPath, err => {
	// 	  if (err) return handleError(err, res);
		  
		// })
	// 	  res
	// 		.status(200)
	// 		.contentType("text/plain")
	// 		.end("File uploaded!");
	// 		res.render("data.ejs")
	// 	});
	//   } else {
	// 	fs.unlink(tempPath, err => {
	// 	  if (err) return handleError(err, res);
  
	// 	  res
	// 		.status(403)
	// 		.contentType("text/plain")
	// 		.end("Only .png files are allowed!");
	// 	});
		
	 //  }
	
	   res.render("upload.ejs");
	}
  );

  router.get("/image.png", (req, res) => {
	res.sendFile(path.join(__dirname, "./uploads/image.png"));
  });

module.exports = router;