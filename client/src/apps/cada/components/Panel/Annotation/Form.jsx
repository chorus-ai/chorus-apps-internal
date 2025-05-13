import React from 'react'
import FormBuilder from '../../../../../common/Form/FormBuilder';

export default function Form({ eIdx, form, values, setValues }) {

  return (
    <>
      <FormBuilder form={form} values={values} setValues={setValues} />
    </>
  )
}
