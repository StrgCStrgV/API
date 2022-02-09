const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log("entered check-auth try block");
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        console.log("middleware success");
        req.userData = decoded;
    }
    catch (error) {
        console.log("auth failed check auth");
        return res.status(401).json({
            message: "auth failed in check-auth"
        });
    }
    next();
}