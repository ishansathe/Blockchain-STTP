import { Application } from "@oak/oak/application";
import { Router, RouterContext } from "@oak/oak/router";
import { send } from "@oak/oak/send";
import * as cheerio from "https://esm.sh/cheerio@1.0.0";

import fs from 'node:fs';

const pubKey_array : string[] = [];
const message_signature_array : {message: string, signature: string} [] = [];


const viewPageData = fs.readFileSync('./src/views.html');
const $o = cheerio.load(viewPageData);

const homePageData = fs.readFileSync('./src/home.html');
const $h = cheerio.load(homePageData);

const router = new Router();

router.get('/', (ctx) => {
    
    // ctx.response.body = fs.readFileSync('./src/home.html', 'utf-8');
    ctx.response.body = $h.html()
})

router.get('/views.html', (ctx) => {

    // console.log(pubKey_array[0])
    // console.log("Bo")
    // $o('#pub_keys').after(`<key>${pubKey_array[-1]}</key>`)
    ctx.response.body = $o.html();
})


router.post('/', (ctx) => {
    console.log("Received post request.");
    
    // const formData = await ctx.request.body.formData();

     ctx.request.body.formData().then (
        (success) => {
            const pubKey = success.get('publicKey')
            pubKey_array.push(String(pubKey))
            console.log(pubKey_array)
        },
        (error) => {
            console.log(error);
        }
    )


    ctx.response.body = $h.html();

})

const app = new Application();

app.use(async (ctx, next) => {

    // Removing that special case.
    if(ctx.request.url.pathname != '/.well-known/appspecific/com.chrome.devtools.json') {

        // const last_four_chars = ctx.request.url.pathname.slice(-4)
        
        // if(last_four_chars != ".html" && last_four_chars != '/') {
        //     ctx.request.url.pathname += '.html';
        // }

        // Special send function from oak which is used to serve static files.
        await send(ctx, ctx.request.url.pathname, {
            root: './src'
        });
    }

    next(); 
})

app.use(router.routes());
app.use(router.allowedMethods());

console.log("Now listening on port 8090")
app.listen({port: 8090})