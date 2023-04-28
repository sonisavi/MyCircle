const passport= require("passport");
const LocalStrategy = require("passport-local").Strategy;
const md5= require("md5")

module.exports = function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        /**function for login user
        * @param {string} email
        * @param {string} password
        * @param {Function} done
        * @return {[type]}
        */
        async (req, email, password, done) => {
            console.log("username-----------------");
            console.log(email);
            console.log(password);
            await usersModel.findOne({
                'email': {
                    $regex: '^' + email + '$',
                    $options: 'i'
                },
                password: md5(password)
            }, {
                _id: 1,
                firstname: 1,
                lastname: 1,
                gender: 1,
                email: 1,
                password: 1,
            }).then(async function (user) {
                console.log(user);
                // if user not found
                if (!user) {
                    return done(null, false, {
                        message: 'Please enter valid login details'
                    });
                }

                else {
                    console.log("================kjlkm.,m==============success=============");
                    // console.log(user);
                    return done(null, user);
                }
                // handle catch 
            }).catch(function (err) {
                console.log(err);
                return done(null, false, {
                    message: 'Please enter valid login details'
                });
            });
        }));

    passport.serializeUser(function (user, done) {
        console.log("serializeUser");
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        try {
            console.log("deserializeUser");
            done(null, user);
        } catch (error) {
            console.log(error);
        }
    });

}
