import type { WidgetDefinition } from '../../shared/types';
import { CohortWidgetConfig, requirePerson } from '../../shared/cohortSettings';
import PersonDemographicsWidget from './widget';
import PersonDemographicsSettings from './settings';

const personDemographics: WidgetDefinition<CohortWidgetConfig> = {
  type: 'person_demographics',
  label: 'Person Demographics',
  description: 'OMOP person record for a subject: age, gender, race, ethnicity',
  icon: 'person',
  category: 'person',
  defaultLayout: { w: 12, h: 'auto' },
  Component: PersonDemographicsWidget,
  Settings: PersonDemographicsSettings,
  validate: requirePerson,
};

export default personDemographics;
