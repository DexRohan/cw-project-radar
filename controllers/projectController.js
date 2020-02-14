//
// IMPORTS
//
// libraries
// modules
const AppError = require('../utils/AppError')
const { Classification } = require('../models/classificationModel')
const { MTRLScore } = require('../models/mtrlScoreModel')
const { Project } = require('../models/projectModel')

//
// get by CW ID
//
exports.getByCWId = async cwid => {
    return await Project.findOne({ cw_id: cwid })
}

//
// Add a MTRL score to a project
//
exports.addCategory = async (cwid, data) => {
    // 1) Get the corresponding project
    const project = await this.getByCWId(cwid)
    if (!project) {
        throw new AppError(`No project found with id ${cwid}`, 404)
    }

    // 2) Create new classification object
    const classification = await Classification.create({
        classification: data.classification,
        project: project._id,
        classifiedOn: data.classifiedOn,
        classifiedBy: data.classifiedBy,
        changeSummary: data.changeSummary
    })
    classification.project = project

    // 3) Set the project's current category
    //      Re-categorisation hasn't happened at all yet, so this is safe.
    //      The current category helps tremendously with filtering projects
    //      for a radar, saving a lot of database queries.
    //      Currently, we MUST NOT OFFER RE-CATEGORISATION!!!
    project.classification = data.classification
    await project.save()

    return classification
}

//
// Add a MTRL score to a project
//
exports.addMTRLScore = async (cwid, data) => {
    // 1) Get the corresponding project
    const project = await this.getByCWId(cwid)
    if (!project) {
        throw new AppError(`No project found with id ${cwid}`, 404)
    }
    // 2) Create new score object
    const score = await MTRLScore.create({
        project: project._id,
        scoringDate: data.scoringDate,
        mrl: data.mrl,
        trl: data.trl
    })
    score.project = project

    // 3) return the project as a sign of success
    return score
}
