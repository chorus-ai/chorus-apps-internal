const surveyService = require("../../services/survey/survey");

exports.findAll = (req, res) => {
  const { fid } = req.params;

  surveyService.findAll(fid)
    .then((surveys) => {
      res.status(200).json(surveys);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.findByUser = async (req, res) => {
  try {
    const { uid, fid } = req.params;

    const publicSurveys = await surveyService.findPublicSurveys(fid);
    const userSurveys = await surveyService.findByUser(uid, fid);

    // res.send({
    //   publicSurveys: publicSurveys.map(survey => survey.dataValues),
    //   userSurveys: userSurveys.map(survey => survey.dataValues),
    // });

    res.send([...publicSurveys, ...userSurveys]);

  } catch (err) {
    res.status(500).json(err);
  }
};

exports.findPublic = (req, res) => {
  const { fid } = req.params;

  surveyService.findPublic(fid)
    .then((surveys) => {
      res.send(surveys);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.findAdmin = (req, res) => {
  const { fid } = req.params;

  surveyService.findAdmin(fid)
    .then((surveys) => {
      res.send(surveys);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
};

exports.create = async (req, res) => {
  const { fid, title, link, start, end, frequency, availability, note, uids } = req.body;

  try {
    if (availability === "Selected Users" && !uids) {
      return res.status(400).json({ message: "uids are required for selected users availability" });
    }

    const survey = await surveyService.create(title, link, start, end, frequency, availability, note, fid);

    if (availability === "Selected Users") {
      await surveyService.createSurveyUsers(survey.dataValues.id, uids);
    }

    res.send(survey);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.createSurveyUsers = async (req, res) => {
  const { sid, uids } = req.body;

  try {
    await surveyService.createSurveyUsers(sid, uids);
    res.status(200).json({ message: "Users added to survey successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.update = async (req, res) => {
  const { sid } = req.params;
  const { content, uids } = req.body;

  try {
    // check if content is {}
    if (Object.keys(content).length !== 0) {
      await surveyService.update(sid, content);
    }

    if (uids) {
      await surveyService.removeAllUsers(sid);
      await surveyService.createSurveyUsers(sid, uids);
      return res.status(200).json({ message: "Survey updated successfully" });
    }

    if (content.availability && content.availability !== "Selected Users") {
      await surveyService.removeAllUsers(sid);
      return res.status(200).json({ message: "Survey updated successfully" });
    }

    res.status(200).json({ message: "Survey updated successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.delete = async (req, res) => {
  const { sids } = req.body;

  try {
    await surveyService.removeSurveys(sids);
    res.status(200).json({ message: "Survey removed successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};