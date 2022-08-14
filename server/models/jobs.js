import mongoose from "mongoose";

const jobScheme = new mongoose.Schema({
  company: {type: Object, required: true},
  role_title: {type: String, required: true, maxlength: 30},
  job_description: {type: String, required: true, unique: true, maxlength: 200},
  job_requirements: {type: String, required: true, maxlength: 200},
  location: {type: String, required: true},
  posted_by: {type: String},
  applicants: [Object],
  approved: [Object],
  preferences: 
    {
      type: Array,
      'default': ['name', 'experience', 'education','skills','languages']
    }
})
// ['name','education','experience','skills','languages']

export const Job = mongoose.model('jobs', jobScheme)