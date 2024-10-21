export const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

export const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/profile');
    }
};

export const roleAdmin = (req, res, next) => {
    
    if (req.session.user && req.session.user.role === "admin") {
        return next();
    } else {
        return res
            .status(401)
            .send(
                "usted no tiene el rol de administrador."
            );
    }
};

export const roleUser = (req, res, next) => {
    if (req.session.user && req.session.user.role != "admin") {
        return next();
    } else {
        return res
            .status(400)
            .send("usted no tiene el rol de usuario.");
    }
};
