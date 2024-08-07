const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const users = [
    { id: 1, email: 'adminCoder@coder.com', 
        passport: bcrypt.hashSync('adminCod3r123', 10),
        role: 'admin' 
    }
];

passport.use(new LocalStrategy({ usernameField: 'email' }, 
    (email, password, done) => {
        const user = users.find(user => user.email === email);
        if (!user) return done(null, false, 
            { message: 'Incorrect email or password' });


            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect email or password.' }); 
                
                    
                }
            });
    }));


    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        const user = users.find(user => user.id === id);
        done(null, user);
    });


    appendFile.use(require('express-session')
({ secret: 'secret', resave: false, saveUninitialized: false }));
appendFile.use(passport.initialize());
appendFile.use(passport.session());
   
    