// Routes for showing social media user information like bio, birth date, etc... to other users of this social media application

const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load Validation:
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// Load Profile Model:
const Profile = require("../../models/Profile");
// Load User Model:
const User = require("../../models/User");

//@route GET api/profiles/test
//@desc Tests profiles route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "Profiles Route Works" }));

//@route GET api/profiles
//@desc Get current logged in user's profile
//@access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

//@route GET api/profiles/handle/:handle
//@desc Backend API Route that gets hit by front end for getting profile by handle
//@access Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user.";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) => res.status(404).json(err));
});

//@route GET api/profiles/user/:user_id
//@desc Get profile by user id
//@access Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user.";
        res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch((err) =>
      res.status(404).json({ Profile: "There is no profile for this user." })
    );
});

//@route GET api/profiles/all
//@desc Get all profiles
//@access Public

router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = "There are no profiles.";
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch((err) =>
      res.status(404).json({ Profiles: "There are no profiles." })
    );
});

//@route POST api/profiles
//@desc create user's profile
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation:
    if (!isValid) {
      // Return any errors with 400 status:
      return res.status(400).json(errors);
    }

    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;
    // Skills - Split into an array:
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;

    // Social -
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        // Update the profile
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        // Create:

        // Check for duplicate handles:
        Profile.findOne({ handle: profileFields.handle }).then((profile) => {
          if (profile) {
            errors.handle = "This handle already exists";
            res.status(400).json(errors);
          }

          // Save Profile:
          new Profile(profileFields)
            .save()
            .then((profile) => res.json(profile));
        });
      }
    });
  }
);

//@route POST api/profiles/experience
//@desc Add experience to profile
//@access Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check Validation:
    if (!isValid) {
      // Return any errors with 400 status:
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      // Add to experience arry:
      profile.experience.unshift(newExp);

      profile.save().then((profile) => res.json(profile));
    });
  }
);

//@route POST api/profiles/education
//@desc Add education to profile
//@access Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check Validation:
    if (!isValid) {
      // Return any errors with 400 status:
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };

      // Add to experience arry:
      profile.education.unshift(newEdu);

      profile.save().then((profile) => res.json(profile));
    });
  }
);

//@route DELETE api/profiles/experience/:exp_id
//@desc delete experience from profile
//@access Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get remove index:
        const removeIndex = profile.experience
          .map((item) => item.id)
          .indexOf(req.params.exp_id);

        // Splice out of array:
        profile.experience.splice(removeIndex, 1);

        // Save:
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

//@route DELETE api/profiles/education/:edu_id
//@desc delete education from profile
//@access Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        // Get remove index:
        const removeIndex = profile.experience
          .map((item) => item.id)
          .indexOf(req.params.edu_id);

        // Splice out of array:
        profile.education.splice(removeIndex, 1);

        // Save:
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json(err));
  }
);

//@route DELETE api/profiles
//@desc delete user and profile
//@access Private
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      Profile.findOneAndRemove({ user: req.user.id })
        .then(()=>{
            User.findOneAndRemove({ _id:req.user.id})
                .then(
                    ()=> res.json({ msg: "User and profile successfully deleted."})
                )
        })


    }
  );

module.exports = router;
