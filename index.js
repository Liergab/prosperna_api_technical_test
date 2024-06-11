import express           from 'express';
import db                from './config/Db.js';
import rootRouter        from './router/index.js';
import cookieParser      from 'cookie-parser';
import { PageNotFound,
         error       }   from './middleware/ErrorMiddleware.js';

import 'dotenv/config'

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
const PORT = process.env.PORT || 8080;



app.use('/v1/api', rootRouter); //all routes
app.use(PageNotFound);
app.use(error);

app.listen(PORT,() => {
    console.log(`http://localhost:${PORT}`)
    db()
});