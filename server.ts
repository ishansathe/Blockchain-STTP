import express, {NextFunction, Request, Response} from 'express';
import * as cheerio from 'https://esm.sh/cheerio@1.0.0';
import fs from 'node:fs'
import formidable, {Fields, Files} from 'formidable'

const homePageData = fs.readFileSync('./src/home.html');
const $h = cheerio.load(homePageData); 

const viewPageData = fs.readFileSync('./src/views.html');
const $o = cheerio.load(viewPageData);

const app = express();

app.use(express.static('./src'));

app.get('/', (_req: Request, res: Response ) => {

    res.send($h.html())
}) 

app.post('/', (req: Request, res: Response) => {
    formidable().parse(req, (err: any, fields: Fields, files: Files) => {
        if(err){
            console.log(err)
        }
        else {
            console.log(fields.publicKey[0])
        }
    })

    res.send($h.html());
})

app.listen(8090, ()=> {
    console.log("Listening on port 8090")
})