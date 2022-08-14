import express from 'express'
import { Job } from '../models/jobs.js'
export const jobsRouter = express.Router()

//get all
jobsRouter.get('/', async (req,res)=>{
  try {
    const users = await Job.find()
    res.json(users)
  } catch (error) {
    res.json({message: error.message})
  }
})
//get one
jobsRouter.get('/:id', async (req,res)=>{
  try {
    const user = await getSpecific(req.params.id)
    res.json(user)
  } catch (error) {
    res.json({message: error.message})
  }
})
//add one
jobsRouter.post('/', async (req,res)=>{
  console.log(req.body);
  const {company,role_title,job_requirements,job_description,
    posted_by,location,job_time,job_type,preferences} = req.body.jobObj
  try {
  const newJob = new Job({
    company,
    role_title,
    job_requirements,
    job_description,
    location,
    job_time,
    job_type,
    posted_by,
    preferences,
  })
  await newJob.save()
  res.status(201).json(newJob)
  } catch (error) {
    res.status(400).json({message: error.message})
  }
})
//update one
jobsRouter.patch('/:id', async (req,res)=>{
  const job = await getSpecific(req.params.id);
  if(req.body.prop !== null){
    console.log(job[req.body.prop]);
    job[req.body.prop] = req.body.value
  }
  try {
    const updated = await job.save()
    res.status(200).json(updated)
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

//  add / delete CV / add to approved 
jobsRouter.patch('/', async (req,res)=>{
  const job = await getSpecific(req.body.idOfJob)
  console.log(req.body);
  try {
    if(req.body.action === 'addCV'){
      const updated = await Job.findOneAndUpdate({
        _id: req.body.idOfJob
      },{
        $addToSet:{ applicants: req.body.cvObj }
      })
      res.status(200).json(updated)
    } else if(req.body.action === 'removeCV'){
      const updated = await Job.findOneAndUpdate({
        _id: req.body.idOfJob
      },{
        $pull:{ applicants: req.body.cvObj }
      })
      res.status(200).json(updated)
    } else if(req.body.action === 'addApproved'){
      const updated = await Job.findOneAndUpdate({
        _id: req.body.idOfJob
      },{
        $addToSet:{ approved: req.body.idOfApprovedApplicant }
      })
      res.status(200).json(updated)
    }
  } catch (error) {
    res.status(400).json({error: error.message})
  }
})

//delete one
jobsRouter.delete('/:id',async (req,res)=>{
  try{
   const user = await getSpecific(req.params.id);
   await user.remove()
   res.status(200).json('deleted successfully')
  } catch (error) {
   res.status(500).json({message: error.message})
  }
})

async function getSpecific(id,req,res,next){
  const user = await Job.findById(id)
  console.log(id);
  console.log(user);
  try {  
    if(user == null){
      return res.status(404).json({ message: 'user not found' })
    } else {
      return user
    }
  } catch (error) {
    console.log(error);
  }
}