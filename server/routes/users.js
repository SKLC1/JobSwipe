import express from 'express'
import { User } from '../models/users.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
export const usersRouter = express.Router()
import dotenv from 'dotenv'
dotenv.config()
//get all
usersRouter.get('/', async (req,res)=>{
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.json({message: error.message})
  }
})
//get one
usersRouter.get('/:id',async (req,res)=>{
  try {
    const user = await getSpecific(req.params.id)
    res.json(user)
  } catch (error) {
    res.json({message: error.message})
  }
})
//add one
usersRouter.post('/', async (req,res)=>{
  console.log(req.body);
  try {
  const newUser = new User({
    first: req.body.first,
    last: req.body.last,
    password: req.body.password,
    email: req.body.email,
    userType: req.body.userType,
  })
  await newUser.save()
  res.status(201).json(newUser)
  } catch (error) {
    res.status(400).json({message: error.message})
  }
})
//update one
usersRouter.patch('/:id', async (req,res)=>{
  const user = await getSpecific(req.params.id);
  if(req.body.prop !== null){
    console.log(user[req.body.prop]);
    user[req.body.prop] = req.body.value
  }
  try {
    const updated = await user.save()
    res.status(200).json(updated)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})
// ADD CV TO USER 
usersRouter.patch('/addCV/:id', async (req,res)=>{
  try {
    const updated = await User.findOneAndUpdate({
      _id: req.params.id
    },{
      cv: req.body.cv 
    })
    res.status(200).json(updated)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})
//add match to user
usersRouter.patch('/addMatch/:id', async (req,res)=>{
  try {
    const updated = await User.findOneAndUpdate({
      _id: req.params.id
    },{
      $addToSet:{ matches: req.body.match }
    })
    res.status(200).json(updated)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

//delete one
usersRouter.delete('/:id',async (req,res)=>{
  try{
   const user = await getSpecific(req.params.id);
   await user.remove()
   res.status(200).json('deleted successfully')
  } catch (error) {
   res.status(500).json({message: error.message})
  }
})

usersRouter.post('/login',async(req,res)=>{
  const pass = (req.body.password)
  console.log(req.body);
  const users = await User.findOne({email: req.body.email})
  console.log(users);
  if(users === null){
    return res.status(400).send('Invalid Email or Password.')
  }
  console.log(users);
  console.log(users.password);
  console.log(pass);
  const validPassword = await bcrypt.compare(pass, users.password);
  try {
    if (!validPassword){
      return res.status(400).send('Invalid Email or Password.')
    } else {
      const accessToken = jwt.sign(users.toJSON(), `${process.env.ACCESS_TOKEN_SECRET}`)
      res.status(200).send({loggedUser: users ,accessToken: accessToken})
    }
} catch (error) {
    console.log(error);
  }
})

async function getSpecific(id,req,res,next){
  const user = await User.findById(id)
  console.log(user);
  try {  
    if(user == null){
      return res.status(404).json({ message: 'user not found' })
    } else {
      return user
    }
  } catch (error) {
    return res.status(500).json({message: error.message})
  }
}

//auth jwt

function authenticateToken(req,res,next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]
  if(token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
    if(err) return res.send(403)
    req.user = user
    next()
  })
}