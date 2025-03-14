// handler/omop/note_nlp.js
const noteNlpService = require("../../services/omop/note_nlp");

/**
 * 1. List All Note NLP Entries
 */
exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  noteNlpService
    .findAll(page, pageSize, sortOrder)
    .then((results) => res.status(200).json(results))
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 2. Get Note NLP by Note ID
 */
exports.findByNoteId = (req, res) => {
  const { note_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;
  noteNlpService
    .findByNoteId(note_id, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: `No note NLP entries found for note_id=${note_id}` });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 3. Get Note NLP by Array of Note IDs
 */
exports.findByNoteIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { note_ids } = req.body;
  noteNlpService
    .findByNoteIds(note_ids, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: "No note NLP entries found for the given note_ids" });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 4. Advanced Search in Note NLP Entries
 */
exports.advancedSearch = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const searchParams = req.body;
  noteNlpService
    .advancedSearch(searchParams, page, pageSize, sortOrder)
    .then((results) => {
      if (results.length > 0) return res.status(200).json(results);
      return res.status(404).json({ message: "No note NLP entries found matching the search criteria." });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
