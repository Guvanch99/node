const router = require('express').Router()
const JobsController = require('../controllers/jobs')

router
  .route('/')
  .post(JobsController.createJob)
  .get(JobsController.getAllJobs)
router
  .route('/:id')
  .get(JobsController.getJob)
  .delete(JobsController.deleteJob)
  .patch(JobsController.updateJob)


module.exports = router
