const express=require('express');
const app=express();
const bcrypt=require('bcrypt');
const fs=require('fs');
const path=require('path');

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));

let hashedPass="";

app.get('/',(req,res)=>{
    res.render('index',{pass:""});
})
app.get('/compare',(req,res)=>{
    res.render('compare');
})
app.post('/hashPass',async (req,res)=>{
    hashedPass=await bcrypt.hash(req.body.pass,10)
    console.log(req.body.pass+'\n'+hashedPass);
    // res.send("Generated: "+ hashedPass)
    const randomId=function(length=6){
        return Math.random().toString(36).sub(2,length+2);
    }
    // console.log(randomId(10));
    fs.readFile('data.json','utf-8',(err,data)=>{
        let oldData;
        oldData=JSON.parse(data);
        // console.log("olddata"+oldData);
    
    let details=[{
        id:randomId(),
        name:req.body.username,
        password:hashedPass,
    }]
    oldData.push(details);
    
    fs.writeFile('data.json',JSON.stringify(oldData),(err)=>{
        if(err) throw err;
        else
        console.log("new data uploaded");
        // res.sendFile(path.join(__dirname,'/data.json'))
        res.render('index',{pass:details.password})
    })
})
})
app.post('/comparePass',async(req,res)=>{
    let isEqual=await bcrypt.compare(req.body.pass,hashedPass);
    if(isEqual){
        res.send("Equal");
    }else{
        res.send("Different");
    }
})

app.listen(3000);