const jwt = require('jsonwebtoken');
const Account  = require('../model/account.model');

class TokenMiddleware {

    static generate = (userdata) => {

        console.log(userdata);
        return jwt.sign({ userdata }, process.env.JWT_SECRETE, { expiresIn: "90d" });
    }

    static verify = async (req, res, next) => {


        try {

            const token = req.headers['authorization']?.split(' ')[1];

            if (!token) {
                return res.status(401).json({ message: 'Authentication failed. Token missing.' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRETE);
            const email = decoded.userdata.email;

            Account.findOne({ where: { email: email } }).then(async (user) => {

                if (!user) {

                    return res.status(ResponseMessage.code.unauthorized).json({ message: ResponseMessage.fail.unauthorized });

                }
                const encryptedData = decoded.userData;
                const fetchedData = user.dataValues;

                req.userData = fetchedData;

                next();

            }).catch((error) => {

                // console.log([error.message, "here"]);
            });



        } catch (err) {

            return res.status(401).json({ message: 'Authentication failed. Token invalid.' });
        }
    }



    static verifyKey = async (req, res, next) => {


        try {

            const { key, secret } = req.query;

            if (!key) {
                return res.status(ResponseMessage.code.unauthorized).json({ error: true, message: ResponseMessage.fail.unauthorized });
            }

            const findKey = await Validation.findOne({ where: { key: key } })

            if (!findKey) {
                return res.status(ResponseMessage.code.unauthorized).json({ error: true, message: ResponseMessage.fail.invalid });
            }

            next();

        } catch (err) {

            return res.status(401).json({ message: 'Authentication failed. Token invalid.' });
        }
    }




    // static checkAuthorization(requiredAuthorizations) {

    //     return async (req, res, next) => {

    //         const data = req.userData;

    //         const authorization = await Va.findByPk(data.id);

    //         console.log(authorization.permissions);

    //         const userAuthorizations = authorization.permissions || [];

    //         const hasAuthorization = requiredAuthorizations.some((authorization) =>

    //             userAuthorizations.includes(authorization)
    //         );

    //         if (hasAuthorization) {
    //             next();
    //         } else {

    //             res.status(403).json({ error: 'Unauthorized' });
    //         }
    //     };
    // };
}


module.exports = TokenMiddleware;