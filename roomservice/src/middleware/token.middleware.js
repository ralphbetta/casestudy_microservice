const jwt = require('jsonwebtoken');
const {Account}  = require('../model/database');
const httpservice = require('../service/http.service');
const config = require('../config/site');


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

            const IP = config.site.HOST;

            const userInstance = await httpservice.get('http://authservice:8080/api/profile', token);

            if(!userInstance){
                return res.status(ResponseMessage.code.unauthorized).json({ message: ResponseMessage.fail.unauthorized });
            }


            if(userInstance.data.data.email != email){
                return res.status(ResponseMessage.code.unauthorized).json({ message: ResponseMessage.fail.invalid });
            }


            req.userData = userInstance.data.data;


           next();


         


        } catch (err) {

            return res.status(401).json({ message: 'Authentication failed. Token invalid.' });
        }
    }


}


module.exports = TokenMiddleware;