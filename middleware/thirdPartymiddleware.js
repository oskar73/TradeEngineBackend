exports.thirdPartymiddleware = async (req, res, next) => {
    const requestIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    if (requestIP !== "::ffff:127.0.0.1") {
        return res.status(403).json({ message: "Banned IP Address" });
    }

    next();
}
