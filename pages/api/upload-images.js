import fs from "fs";
import path from "path";
import url from "url";

export default async function (req, res) {      
    let file = req.body;  
    var parsedUrl = url.parse(req.url, true); // true to get query as object
    var params = parsedUrl.query;   
    console.log(params);
    var base = path.resolve('.');
    let newpath = base+"/temp/" + params.name;      
    fs.writeFile(newpath, file, function (err) {
        if (err) return console.log(err);
        console.log('file saved');
    });   
    console.log("newpath",newpath);    
    return {result:newpath};
}