// Module authentification
// recupère le token dans l'entète de la requète, essaye de le décoder
// avec la clé présente dans le fichier .env.  Insére alors la clé auth : userId
// dans req et transmet au module suivant (next)

const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
dotenv.config()
 
module.exports = (req, res, next) => {
   try {
    
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, process.env.APP_SECRET);
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};