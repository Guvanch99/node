const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

class JobsController{

  async createJob(req, res){
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json(job)
  }
  async updateJob(req, res){
    const {
      user: { userId },
      params: { id: jobId },
      body : {company, position}
    } = req

    if(!company || !position){
      throw new BadRequestError('Company or position fields can not be empty')
    }

    const job = await Job.findByIdAndUpdate(
      {_id:jobId, createdBy:userId},
      req.body,
      {new: true, runValidators: true}
    )

    if(!job){
      throw  new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json(job)
  }
  async deleteJob(req, res){
    const {
      user: { userId },
      params: { id: jobId },
      body : {company, position}
    } = req

    const job = await Job.findByIdAndRemove(
      {_id:jobId, createdBy:userId},
      req.body,
    )

    if(!job){
      throw  new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json({msg:'success'})
  }
  async getAllJobs(req, res){
    const jobs = await Job.find({ createdBy:req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs, jobsCount: jobs.length})
  }

  async getJob(req, res){
    const { user: { userId }, params: { id:jobId } } = req

    const job = await Job.findOne({createdBy:userId, _id: jobId})

    if(!job){
      throw  new NotFoundError(`No job with id ${jobId}`)
    }

    res.status(StatusCodes.OK).json(job)
  }
}

module.exports = new JobsController()
