const express=require('express')

const app=express();

app.use('/',(req,res)=>{
    res.send(' fasssyaz')
})
app.use('/hello',(req,res)=>{
    res.send('hello fayaz')
})
app.use('/test',(req,res)=>{
    res.send('hello test')
})
app.use('/test/lo',(req,res)=>{
    res.send('hello test lo')
})



app.listen(3001,()=>{
    console.log(`server running at http://localhost:3000/`)
});