const db = require("../../models");
const path = require("path");
const fs = require('fs');
const { spawn } = require("child_process");
const cadaFileServices = require("../../services/cada/file");
const dotenv = require("dotenv");
dotenv.config();

exports.processAdibin = (req, res) => {
  function runScript() {
    return spawn(process.env.PYTHON_PATH, [
      path.join(__dirname, "../../python-scripts/adibin-handler.py"), 
      path.join(process.env.BUCKET_PATH || '', `${req.query.filename}`),
      req.query.offset,
      req.query.range,
    ]);
  }

  const subprocess = runScript();
  //print output of script
  // subprocess.stdout.on('data', (data) => {
  //   console.log(`data:${data}`);
  // });
  subprocess.stderr.on("data", (data) => {
    console.log(`error:${data}`);
  });
  subprocess.on('error', (error) => {
    console.error(`Error spawning subprocess: ${error}`);
    res.status(500).send('Internal Server Error');
  });
  subprocess.stderr.on("close", () => {
    console.log("Closed"); 
  });

  res.set("Content-Type", "text/plain");
  subprocess.stdout.pipe(res);
  subprocess.stderr.pipe(res);
};

exports.processHdf5 = (req, res) => {
  function runScript() {
    return spawn(process.env.PYTHON_PATH, [
      path.join(__dirname, "../../python-scripts/hdf5-handler.py"), 
      path.join(process.env.BUCKET_PATH || '', `${req.query.filename}`),
      req.query.offset,
      req.query.range,
    ]);
  }

  const subprocess = runScript();
  //print output of script
  // subprocess.stdout.on('data', (data) => {
  //   console.log(`data:${data}`);
  // });
  subprocess.stderr.on("data", (data) => {
    console.log(`error:${data}`);
  });
  subprocess.on('error', (error) => {
    console.error(`Error spawning subprocess: ${error}`);
    res.status(500).send('Internal Server Error');
  });
  subprocess.stderr.on("close", () => {
    console.log("Closed"); 
  });

  // json content-type
  res.set("Content-Type", "text/plain");
  subprocess.stdout.pipe(res);
  subprocess.stderr.pipe(res);
}
exports.findAll = (req, res) => {
  let { search } = req.query;

  cadaFileServices
    .findAll(search)
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.bulkCreate = (req, res) => {
  //remove duplicates from files
  let files = [...new Set(req.body)];

  db.sequelize
    .transaction(function (t) {
      return cadaFileServices.findByFiles(t, files).then(function (paths) {
        let existingFiles = paths.map((e) => e.get({ plain: true }).path);
        let promiseArray = [];

        for (let i = 0; i < files.length; i += 1000) {
          let newFiles = [];

          for (let j = i; j < files.length && j < i + 1000; j++) {
            if (
              typeof existingFiles.find((e) => e === files[j]) === "undefined"
            ) {
              newFiles.push({
                path: files[j],
              });
            }
          }

          if (newFiles.length > 0) {
            promiseArray.push(cadaFileServices.bulkCreate(t, newFiles));
          }
        }

        return Promise.all(promiseArray).then(function () {
          return cadaFileServices.findByFiles(t, files).then(function (files) {
            let e = [];
            for (let i = 0; i < files.length; i++) {
              e[i] = files[i].get({ plain: true });
            }
            return e;
          });
        });
      });
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

exports.processPdf = (req, res) => {

  // Construct the full file path
  const pdfPath = path.join(process.env.BUCKET_PATH || '', `${req.query.filename}`);

  // Check if file exists
  fs.access(pdfPath, fs.constants.F_OK, (err) => {
      if (err) {
          // Send an error message if the file does not exist
          return res.status(404).send('File not found');
      }

      // Send the file
      res.sendFile(pdfPath);
  });
};

exports.processJson = (req, res) => {

  // Construct the full json file path
  const jsonPath = path.join(process.env.BUCKET_PATH || '', `${req.query.filename}`);
  // console.log(req.query.filename);
  // Check if file exists
  fs.access(jsonPath, fs.constants.F_OK, (err) => {
      if (err) {
          // Send an error message if the file does not exist
          return res.status(404).send('File not found');
      }

      // Send the file constent as json string
      fs.readFile(jsonPath, 'utf8', (err, data) => {
        if (err) {
          return res.status(500).send('Internal Server Error');
        }
        res.set("Content-Type", "application/json");
        res.send(data);
      });
 });

};