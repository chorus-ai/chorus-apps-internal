// handler/omop/note.js
const noteService = require("../../services/omop/note");

/**
 * 1. List All Notes
 */
exports.findAll = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  noteService
    .findAll(page, pageSize, sortOrder)
    .then((notes) => res.status(200).json(notes))
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 2. Get Note by Person ID
 */
exports.findByPersonId = (req, res) => {
  const { person_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  noteService
    .findByPersonId(person_id, page, pageSize, sortOrder)
    .then((notes) => {
      if (notes.length > 0) return res.status(200).json(notes);
      return res
        .status(404)
        .json({ message: `No notes found for person_id=${person_id}` });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 3. Get Notes by Array of Person IDs
 */
exports.findByPersonIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { person_ids } = req.body;

  noteService
    .findByPersonIds(person_ids, page, pageSize, sortOrder)
    .then((notes) => {
      if (notes.length > 0) return res.status(200).json(notes);
      return res
        .status(404)
        .json({ message: "No notes found for the provided person_ids" });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 4. Get Note by Visit Occurrence ID
 */
exports.findByVisitOccurrenceId = (req, res) => {
  const { visit_occurrence_id } = req.params;
  const { page, pageSize, sortOrder } = req.query;

  noteService
    .findByVisitOccurrenceId(visit_occurrence_id, page, pageSize, sortOrder)
    .then((notes) => {
      if (notes.length > 0) return res.status(200).json(notes);
      return res
        .status(404)
        .json({ message: `No notes found for visit_occurrence_id=${visit_occurrence_id}` });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 5. Get Notes by Array of Visit Occurrence IDs
 */
exports.findByVisitOccurrenceIds = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const { visit_occurrence_ids } = req.body;

  noteService
    .findByVisitOccurrenceIds(visit_occurrence_ids, page, pageSize, sortOrder)
    .then((notes) => {
      if (notes.length > 0) return res.status(200).json(notes);
      return res.status(404).json({
        message: "No notes found for the provided visit_occurrence_ids"
      });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

/**
 * 6. Search Notes by various attributes
 */
exports.advancedSearch = (req, res) => {
  const { page, pageSize, sortOrder } = req.query;
  const searchParams = req.body;

  noteService
    .advancedSearch(searchParams, page, pageSize, sortOrder)
    .then((notes) => {
      if (notes.length > 0) return res.status(200).json(notes);
      return res
        .status(404)
        .json({ message: "No notes found matching the given search criteria." });
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};
