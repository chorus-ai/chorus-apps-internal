const formService = require('../../services/form/form');

exports.findAll = async (req, res) => {
  const { page, pageSize, sortOrder } = req.query;

  try {
    const result = await formService.findAll(page, pageSize, sortOrder);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.findById = async (req, res) => {
  const { fid } = req.params;

  try {
    const result = await formService.findById(fid);
    if (result) return res.status(200).json(result);
    return res.status(404).send({ message: 'Form not found.' });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.create = async (req, res) => {
  const { title } = req.body;

  try {
    const result = await formService.create(title);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.createFormField = async (req, res) => {
  const { formId, label, type, required, order, options, triggers } = req.body;

  try {
    const result = await formService.createFormField(
      formId,
      label,
      type,
      required,
      order,
      options
    );

    if (triggers) {
      result.dataValues.formFieldTriggers = [];
      for (const trigger of triggers) {
        const formFieldTriggers = await formService.createFormFieldTrigger(
          trigger.targetFieldId,
          result.dataValues.id,
          trigger.condition,
          trigger.action
        );

        result.dataValues.formFieldTriggers.push(formFieldTriggers.dataValues);
      }
    }

    res.status(201).json(result);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.createFormFieldTrigger = async (req, res) => {
  const { formFieldId, targetFieldId, condition, action } = req.body;

  try {
    const result = await formService.createFormFieldTrigger(
      formFieldId,
      targetFieldId,
      condition,
      action
    );
    res.status(201).json(result);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.createFromJSON = async (req, res) => {
  const { form } = req.body;

  try {
    const newForm = await formService.create(form.title);

    const fields = [];

    for (let i = 0; i < form.fields.length; i++) {
      const field = form.fields[i];
      const newField = await formService.createFormField(
        newForm.dataValues.id,
        field.label,
        field.type,
        field?.required || true,
        i + 1,
        field?.options || null
      );

      fields.push(newField.dataValues);

      if (field.triggers) {
        for (let trigger of field.triggers) {
          const formFieldId = fields.find((f) => f.label === trigger.field).id;
          await formService.createFormFieldTrigger(
            formFieldId,
            newField.dataValues.id,
            trigger.condition,
            trigger.action
          );
        }
      }
    }

    res.status(201).json(newForm);

  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
}

exports.updateForm = async (req, res) => {
  const { fid } = req.params;
  const { title } = req.body;

  try {
    const result = await formService.updateForm(fid, title);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.updateFormField = async (req, res) => {
  const { ffid } = req.params;
  const { content } = req.body;

  try {
    const result = await formService.updateFormField(ffid, content);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.replaceFormField = async (req, res) => {
  const { ffid } = req.params;
  const { content } = req.body;

  try {
    const result = await formService.updateFormField(ffid, { active: false });

    const newField = await formService.createFormField(
      result.dataValues.formId,
      content.label || result.dataValues.label,
      content.type || result.dataValues.type,
      content.required || result.dataValues.required,
      result.dataValues.order,
      content.options || result.dataValues.options,
    );

    res.status(200).json(newField);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.updateFormFieldTrigger = async (req, res) => {
  const { fftid } = req.params;
  const { content } = req.body;

  try {
    const result = await formService.updateFormFieldTrigger(fftid, content);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.updateFormFieldOrder = async (req, res) => {
  const { contents } = req.body;

  try {
    for (let i = 0; i < contents.length; i++) {
      await formService.updateFormField(contents[i].id, { order: contents[i].order });
    }

    res.send({
      message: 'Order updated successfully',
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.removeForm = async (req, res) => {
  const { fid } = req.params;

  try {
    await formService.removeForm(fid);
    res.status(204).send();
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

exports.removeFormField = async (req, res) => {
  const { ffid } = req.params;

  try {
    const formField = await formService.updateFormField(ffid, { active: false });

    await formService.reorderFromOrder(formField.dataValues.formId, formField.dataValues.order);

    res.send({ message: 'Field removed.' });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};