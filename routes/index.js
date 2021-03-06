const express = require('express');
const router = express.Router();
const User = require('../models/user');
const multer = require('multer');
const path = require('path');
const spawn = require('child_process').spawn;


const helpers = require('./helpers');
var otp_sent;


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'views/uploads/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + path.extname(file.originalname));
    }
});

const tf = require('@tensorflow/tfjs');

const sendgrid = require('@sendgrid/mail');
const SENDGRID_API_KEY = "your api key here"
sendgrid.setApiKey(SENDGRID_API_KEY)

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
					res.send({ "Success": "You are regestered,You can login now." });
				} else {
					res.send({ "Error": "Email is already used." });
				}

			});
		} else {
			res.send({ "Error": "password is not matched" });
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
			res.send({ "Success": "This Email Is not regestered!" });
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

router.post('/profile', (req, res) => {
    // 'xray' is the name of our file input field in the HTML form
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('xray');

    upload(req, res, function(err) {

        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }
        res.redirect('/diagnosis');
    });
});

router.get("/diagnosis", (req, res) => {
  res.render("diagnosis.ejs")
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
});

router.get('/forgetpass', (req, res, next) => {
	res.render("forget.ejs");
});

router.post('/forgetpass', (req, res, next) => {
    User.findOne({ email: req.body.email }, (err, data) => {
        if (!data) {
		    res.send({ "Success": "This Email Is not registered!" });
		} else {
            let otp = (Math.random() + 1).toString(10).substring(2,8); //generate a random otp
            otp_sent = otp
		    const msg = {
                from: 'health.informatics.team@gmail.com',
                to: req.body.email,
                subject: 'HI App: Password Reset OTP',
                text: 'Please find otp: '+otp,
                }
                sendgrid.send(msg).then((resp) => {
                    res.send({ "Success": "E-mail Sent! Enter OTP!" });
                })
                .catch((error) => {
                    res.send({ "Success": "Error, please try again later" });
                })
		    }
	    });
});

router.get('/NTNdy9wdYE', (req, res, next) => {
	res.render("otpform.ejs");
});

router.post('/NTNdy9wdYE', (req, res, next) => {
    let otpInfo = req.body;
    if (otpInfo.otp == otp_sent) {
        res.send({ "Success": "OTP Correct!" });
    } else {
        res.send({ "Success": "OTP InCorrect!" });
    }
});

router.get('/Gpfx9W0sBD', (req, res, next) => {
	res.render("resetpass.ejs");
});

router.post('/Gpfx9W0sBD', (req, res, next) => {
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
					    res.send({ "Success": "Password changed!" });
					    const msg = {
                            from: 'health.informatics.team@gmail.com',
                            to: req.body.email,
                            subject: 'HI App: Password Successfully Changed',
                            text: 'This mail is to inform you that your password has been successfully changed.',
                        }
                        sendgrid.send(msg).then((resp) => {
                        })
                        .catch((error) => {

                        })

				});
			} else {
				res.send({ "Success": "Password do not match! Both Password should be same." });
			}
		}
	});

});
router.get('/explain', (req, res, next) => {
	helpers.explained();
	res.render("explain.ejs");
});

module.exports = router;