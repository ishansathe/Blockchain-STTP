import { Application } from "@oak/oak/application";
import { Router } from "@oak/oak/router";
import { send } from "@oak/oak/send";
import { Status } from "jsr:@oak/commons@1/status";
import { Body } from "@oak/oak/body";

import fs from 'node:fs';

const pubKey_array : string[] = [];

const router = new Router();

router.get('/', (ctx) => {
    
    ctx.response.body = fs.readFileSync('./src/home.html', 'utf-8');
})

async function formReader(ok : Body) : Promise<FormData> {
    return await ok.formData()
}

router.post('/',  (ctx) => {
    console.log("Received post request.");
    
    // const formData = await ctx.request.body.formData();

    let formData: FormData;
    formReader(ctx.request.body).then (
        (success) => {
            formData = success
            const pubKey = formData.get('publicKey')
            pubKey_array.push(String(pubKey))
        },
        (error) => {
            console.log(error);
        }
    )

    ctx.response.body = fs.readFileSync('./src/home.html', 'utf-8');

})

const app = new Application();

app.use(async (ctx, next) => {

    // Removing that special case.
    if(ctx.request.url.pathname != '/.well-known/appspecific/com.chrome.devtools.json') {

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