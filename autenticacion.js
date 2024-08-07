app.post('/login',
passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/login'
}));

app.get('/logout', (req, res) => {
 req.logout();
 res.redirct('/login');
});