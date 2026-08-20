// Sample extraction dataset for the Publication Extraction Review annotator.
// Source: server/data/pub-llm-eval/ (LLM-extracted fields + reviewer instructions
// from mimic4wdb_ecg_ppg.xlsx, merged with the extraction-review.html prototype).
// Each paper -> attribute groups -> sub-attribute ROWS. `id` is the sheet row number
// (1..N) and is used as the annotation-value `field` key (stable — assign once).

export interface ExtractionRow {
  id: string;
  sub: string;
  value: string;
  hint?: string;
}
export interface ExtractionGroup {
  attribute: string;
  rows: ExtractionRow[];
}
export interface Facsimile {
  venue: string;
  lower?: boolean;
  url: string;
  badge: string;
  title: string;
  authors: string;
  affil: string;
  abstract: string;
  meta: [string, string][];
  section: string;
  body: string[];
  foot: [string, string];
}
export interface Paper {
  label: string;
  short: string;
  groups: ExtractionGroup[];
}

export const SAMPLE_DATA: Record<string, Paper> = {
  "mimic3wdb": {
    "label": "MIMIC-III Waveform DB — ECG/PPG",
    "short": "MIMIC-III WDB",
    "groups": [
      {
        "attribute": "Overall study design",
        "rows": [
          {
            "id": "1",
            "sub": "Study type",
            "value": "Retrospective, observational study of existing ICU patient data",
            "hint": "multicenter, open label, non -randomized study, blinded/non-blinded, pivotal etc."
          },
          {
            "id": "2",
            "sub": "Device or software under test",
            "value": "Bedside patient monitors in adult and neonatal ICUs"
          },
          {
            "id": "3",
            "sub": "Study objective",
            "value": "To create a database of waveform and numerics records for ICU patients"
          },
          {
            "id": "4",
            "sub": "Primary and secondary endpoints",
            "value": "Primary endpoint: creation of a waveform database; secondary endpoint: matching and time-aligning waveform and numerics records with MIMIC-III Clinical Database records"
          },
          {
            "id": "5",
            "sub": "Patient Sample size",
            "value": "Approximately 30,000 ICU patients, with 67,830 record sets",
            "hint": "Justifications for sample size"
          },
          {
            "id": "6",
            "sub": "Type of patients",
            "value": "Adult and neonatal ICU patients",
            "hint": "Clearly mentions real or virtual patients"
          },
          {
            "id": "7",
            "sub": "Special populations",
            "value": "Neonatal patients",
            "hint": "Children, pregnant etc."
          },
          {
            "id": "8",
            "sub": "Statistical Method Used",
            "value": "Not stated directly, but implies use of statistical methods for data analysis"
          },
          {
            "id": "9",
            "sub": "Number of centers",
            "value": "1 center — a single hospital site (Beth Israel Deaconess Medical Center)"
          },
          {
            "id": "10",
            "sub": "Inclusions and exclusions",
            "value": "Inclusion criteria: all ICU patients in certain ICUs; exclusion criteria: not specified",
            "hint": "Defined clear criteria for participant eligibility; documented rationale for exclusions"
          },
          {
            "id": "11",
            "sub": "Specific dates when each record were collected",
            "value": "Not stated directly, but recordings were made during ICU stays (typically a few days, but many are several weeks in duration)"
          },
          {
            "id": "12",
            "sub": "Nature of the center",
            "value": "Large hospitals (e.g. Beth Israel Deaconess Medical Center)",
            "hint": "Large hospitals, medium sized hospitals, small clinics etc."
          }
        ]
      },
      {
        "attribute": "Study Population (changing from patient selection)",
        "rows": [
          {
            "id": "13",
            "sub": "Screening bias",
            "value": "Not stated directly, but implies minimal screening bias due to automated data collection",
            "hint": "Ensure participants represent intended use population with diverse demographics (age, sex, race, ethnicity)"
          },
          {
            "id": "14",
            "sub": "Study center location",
            "value": "Within the US (at Beth Israel Deaconess Medical Center, Boston, MA)",
            "hint": "Within US or outside US"
          },
          {
            "id": "15",
            "sub": "Age",
            "value": "Not stated directly, but includes adult and neonatal patients"
          },
          {
            "id": "16",
            "sub": "Gender",
            "value": "Not stated directly, but includes both male and female patients",
            "hint": "May also include minimum percentages for male and female participants"
          },
          {
            "id": "17",
            "sub": "Ethnic group",
            "value": "Not stated directly"
          },
          {
            "id": "18",
            "sub": "Race",
            "value": "Not stated directly"
          },
          {
            "id": "19",
            "sub": "BMI",
            "value": "Not stated directly"
          },
          {
            "id": "20",
            "sub": "Skin tone",
            "value": "Not stated directly"
          },
          {
            "id": "21",
            "sub": "Clinical conditions",
            "value": "ICU patients with various clinical conditions (e.g. those requiring continuous monitoring of vital signs)",
            "hint": "Afibrillation, history of stroke etc. Comorbidities"
          },
          {
            "id": "22",
            "sub": "Repeat participants",
            "value": "Not stated directly, but implies possibility of repeat participants",
            "hint": "is there an indication when a patient is contributing multiple records to the dataset"
          }
        ]
      },
      {
        "attribute": "Reference Method",
        "rows": [
          {
            "id": "23",
            "sub": "Method applied to presence of condition or value of a physiologic measurement",
            "value": "Not stated directly, but implies use of standard ICU monitoring equipment (e.g. ECG, ABP, SpO2)",
            "hint": "CO-oximetry for SpO2, invasive arterial line for BP"
          },
          {
            "id": "24",
            "sub": "Accuracy",
            "value": "Not stated directly",
            "hint": "Specified accuracy/precision of reference method with maximum permissible error"
          },
          {
            "id": "25",
            "sub": "equipment specifications",
            "value": "Not stated directly",
            "hint": "Make, model, version of reference equipment"
          },
          {
            "id": "26",
            "sub": "Anatomical location of reference measurement",
            "value": "Not stated directly"
          },
          {
            "id": "27",
            "sub": "Annotation procedures",
            "value": "Not stated directly"
          },
          {
            "id": "28",
            "sub": "Quality or consistency evaluation of annotations; methods for adjudicating disagreements",
            "value": "Not stated directly"
          },
          {
            "id": "29",
            "sub": "Handling equivocal results",
            "value": "Not stated directly",
            "hint": "Strategy for addressing cases where reference results are equivocal or missing"
          }
        ]
      },
      {
        "attribute": "Data Management",
        "rows": [
          {
            "id": "30",
            "sub": "Data source origin",
            "value": "Directly from bedside patient monitors in ICUs",
            "hint": "Source of information for database (e.g., direct from device, EMR, clinical notes, study personnel)"
          },
          {
            "id": "31",
            "sub": "Data collection system",
            "value": "Bedside patient monitors (e.g. Philips Healthcare monitors)",
            "hint": "Description of hardware/software system"
          },
          {
            "id": "32",
            "sub": "Data verification",
            "value": "Verification of data acquisition, including timestamps and signal quality",
            "hint": "Verification of data acquisition including timestamps, alignment, distortion, resampling of signals"
          },
          {
            "id": "33",
            "sub": "Data format and metadata",
            "value": "WFDB format with associated metadata",
            "hint": "Specification of data format and associated metadata for each data element"
          },
          {
            "id": "34",
            "sub": "Data storage processes",
            "value": "Methods for storing, archiving, and maintaining data integrity (e.g. on PhysioNet)",
            "hint": "Methods for storing, archiving, and maintaining data integrity"
          },
          {
            "id": "35",
            "sub": "Data cleaning",
            "value": "Methods for data cleaning and quality control (not specified)",
            "hint": "Methods for data cleaning/selection including quality control criteria, handling of missing data"
          },
          {
            "id": "36",
            "sub": "Archiving and access",
            "value": "Storage location: PhysioNet; access controls: Open Data Commons Open Database License v1.0",
            "hint": "Storage location, access controls, maintenance, distribution procedures, ownership"
          },
          {
            "id": "37",
            "sub": "Version control",
            "value": "Version 1.0 of the MIMIC-III Waveform Database",
            "hint": "Dataset version control to track changes and ensure reproducibility"
          },
          {
            "id": "38",
            "sub": "Secruity measures",
            "value": "Open Data Commons Open Database License v1.0; deidentification of protected health information",
            "hint": "Controls to protect data security and patient privacy"
          },
          {
            "id": "39",
            "sub": "Sampling rate alignment with reference",
            "value": "Not stated directly"
          },
          {
            "id": "40",
            "sub": "Simultaneous data capture with reference",
            "value": "Not stated directly"
          }
        ]
      },
      {
        "attribute": "Hardware",
        "rows": [
          {
            "id": "41",
            "sub": "Probe / lead configuration and monitor",
            "value": "ECG leads and PPG probes/monitors (not specified)",
            "hint": "Make and model; ECG lead configuration; PPG probe/monitor"
          },
          {
            "id": "42",
            "sub": "Wavelength information",
            "value": "Not stated directly",
            "hint": "Infra-red, red, green, etc."
          },
          {
            "id": "43",
            "sub": "Mode",
            "value": "Not stated directly",
            "hint": "Reflectance, transmittance"
          },
          {
            "id": "44",
            "sub": "Lead / sensor status",
            "value": "Not stated directly",
            "hint": "Wet/dry electrodes; sensor contact/status"
          }
        ]
      },
      {
        "attribute": "Physiological and Physical Confounders",
        "rows": [
          {
            "id": "45",
            "sub": "Probe / electrode placement",
            "value": "Anatomical placement of ECG leads and PPG probes (not specified)",
            "hint": "Anatomical placement"
          },
          {
            "id": "46",
            "sub": "Melanin / skin tone measurements",
            "value": "Not stated directly",
            "hint": "Skin tone assessment"
          },
          {
            "id": "47",
            "sub": "Movement",
            "value": "Motion/activity (not specified)",
            "hint": "Motion/activity"
          }
        ]
      },
      {
        "attribute": "Interference",
        "rows": [
          {
            "id": "48",
            "sub": "Interference",
            "value": "Noise level; pacemaker interference (not specified)",
            "hint": "Noise level; pacemaker interference"
          }
        ]
      },
      {
        "attribute": "Signal Processing",
        "rows": [
          {
            "id": "49",
            "sub": "On the monitor",
            "value": "Filtering; bandpass, notch, adaptive filtering (not specified)",
            "hint": "Filtering; bandpass, notch, adaptive filtering"
          },
          {
            "id": "50",
            "sub": "Sampling rate and units",
            "value": "125 Hz with 8-, 10-, or 12-bit resolution",
            "hint": "Sampling rate and units"
          },
          {
            "id": "51",
            "sub": "Resolution",
            "value": "8-, 10-, or 12-bit resolution",
            "hint": "Resolution"
          }
        ]
      },
      {
        "attribute": "Artifact and Interference Detection",
        "rows": [
          {
            "id": "52",
            "sub": "Motion, pacemakers etc.",
            "value": "Not stated directly"
          }
        ]
      },
      {
        "attribute": "Nice to have",
        "rows": [
          {
            "id": "53",
            "sub": "Signal quality of sensor",
            "value": "Not stated directly",
            "hint": "Overall sensor signal quality assessment"
          },
          {
            "id": "54",
            "sub": "Nail / skin status",
            "value": "Not stated directly",
            "hint": "Nail/skin status"
          }
        ]
      }
    ]
  },
  "mimic4wdb": {
    "label": "MIMIC-IV Waveform DB — ECG/PPG",
    "short": "MIMIC-IV WDB",
    "groups": [
      {
        "attribute": "Overall study design",
        "rows": [
          {
            "id": "1",
            "sub": "Study type",
            "value": "Retrospective, observational study using existing data from ICU patients",
            "hint": "multicenter, open label, non -randomized study, blinded/non-blinded, pivotal etc."
          },
          {
            "id": "2",
            "sub": "Device or software under test",
            "value": "Bedside monitors in intensive care units"
          },
          {
            "id": "3",
            "sub": "Study objective",
            "value": "To provide a foundation for future improvements to monitoring technology as well as data-driven diagnosis and treatment"
          },
          {
            "id": "4",
            "sub": "Primary and secondary endpoints",
            "value": "Primary endpoint: high-resolution monitoring data; secondary endpoint: clinical information from MIMIC-IV"
          },
          {
            "id": "5",
            "sub": "Patient Sample size",
            "value": "200 records from 198 patients, intended as a technical preview for the community",
            "hint": "Justifications for sample size"
          },
          {
            "id": "6",
            "sub": "Type of patients",
            "value": "Critically ill patients in intensive care units",
            "hint": "Clearly mentions real or virtual patients"
          },
          {
            "id": "7",
            "sub": "Special populations",
            "value": "Not specified, but implied to include a wide range of adult patients",
            "hint": "Children, pregnant etc."
          },
          {
            "id": "8",
            "sub": "Statistical Method Used",
            "value": "Not stated directly, but statistical methods are implied by the collection and analysis of large amounts of data"
          },
          {
            "id": "9",
            "sub": "Number of centers",
            "value": "1 center — a single hospital site where the data was collected"
          },
          {
            "id": "10",
            "sub": "Inclusions and exclusions",
            "value": "Inclusion criteria: all ICU patients; exclusion criteria: patients with missing or incomplete data",
            "hint": "Defined clear criteria for participant eligibility; documented rationale for exclusions"
          },
          {
            "id": "11",
            "sub": "Specific dates when each record were collected",
            "value": "Not specified, but data was collected over several weeks"
          },
          {
            "id": "12",
            "sub": "Nature of the center",
            "value": "Large hospital with intensive care units",
            "hint": "Large hospitals, medium sized hospitals, small clinics etc."
          }
        ]
      },
      {
        "attribute": "Study Population (changing from patient selection)",
        "rows": [
          {
            "id": "13",
            "sub": "Screening bias",
            "value": "Not stated directly, but the database is designed to be representative of the ICU patient population",
            "hint": "Ensure participants represent intended use population with diverse demographics (age, sex, race, ethnicity)"
          },
          {
            "id": "14",
            "sub": "Study center location",
            "value": "Within the US, at a single hospital site",
            "hint": "Within US or outside US"
          },
          {
            "id": "15",
            "sub": "Age",
            "value": "Adults, exact age range not specified"
          },
          {
            "id": "16",
            "sub": "Gender",
            "value": "Not stated directly, but the database includes both male and female patients",
            "hint": "May also include minimum percentages for male and female participants"
          },
          {
            "id": "17",
            "sub": "Ethnic group",
            "value": "Not specified"
          },
          {
            "id": "18",
            "sub": "Race",
            "value": "Not specified"
          },
          {
            "id": "19",
            "sub": "BMI",
            "value": "Not specified"
          },
          {
            "id": "20",
            "sub": "Skin tone",
            "value": "Not specified"
          },
          {
            "id": "21",
            "sub": "Clinical conditions",
            "value": "Critically ill patients with a range of clinical conditions, including those requiring intensive monitoring and life support",
            "hint": "Afibrillation, history of stroke etc. Comorbidities"
          },
          {
            "id": "22",
            "sub": "Repeat participants",
            "value": "Yes, a single patient may contribute multiple records to the dataset",
            "hint": "is there an indication when a patient is contributing multiple records to the dataset"
          }
        ]
      },
      {
        "attribute": "Reference Method",
        "rows": [
          {
            "id": "23",
            "sub": "Method applied to presence of condition or value of a physiologic measurement",
            "value": "Not specified, but reference methods are implied by the use of bedside monitors and clinical measurements",
            "hint": "CO-oximetry for SpO2, invasive arterial line for BP"
          },
          {
            "id": "24",
            "sub": "Accuracy",
            "value": "Not specified",
            "hint": "Specified accuracy/precision of reference method with maximum permissible error"
          },
          {
            "id": "25",
            "sub": "equipment specifications",
            "value": "Not specified",
            "hint": "Make, model, version of reference equipment"
          },
          {
            "id": "26",
            "sub": "Anatomical location of reference measurement",
            "value": "Not specified"
          },
          {
            "id": "27",
            "sub": "Annotation procedures",
            "value": "Not specified"
          },
          {
            "id": "28",
            "sub": "Quality or consistency evaluation of annotations; methods for adjudicating disagreements",
            "value": "Not specified"
          },
          {
            "id": "29",
            "sub": "Handling equivocal results",
            "value": "Not specified",
            "hint": "Strategy for addressing cases where reference results are equivocal or missing"
          }
        ]
      },
      {
        "attribute": "Data Management",
        "rows": [
          {
            "id": "30",
            "sub": "Data source origin",
            "value": "Bedside monitors in intensive care units, with data stored in a relational database",
            "hint": "Source of information for database (e.g., direct from device, EMR, clinical notes, study personnel)"
          },
          {
            "id": "31",
            "sub": "Data collection system",
            "value": "Bedside monitors linked to a local area network, with data transferred to a central station and then to a long-term archive server",
            "hint": "Description of hardware/software system"
          },
          {
            "id": "32",
            "sub": "Data verification",
            "value": "Data verification is implied by the collection and analysis of data, but specific methods are not stated",
            "hint": "Verification of data acquisition including timestamps, alignment, distortion, resampling of signals"
          },
          {
            "id": "33",
            "sub": "Data format and metadata",
            "value": "Data format: WFDB and CSV; metadata: includes patient and hospital admission IDs, and recording date and time",
            "hint": "Specification of data format and associated metadata for each data element"
          },
          {
            "id": "34",
            "sub": "Data storage processes",
            "value": "Data is stored in a relational database and archived on a long-term server",
            "hint": "Methods for storing, archiving, and maintaining data integrity"
          },
          {
            "id": "35",
            "sub": "Data cleaning",
            "value": "Data cleaning methods are not specified, but data is de-identified and curated for the database",
            "hint": "Methods for data cleaning/selection including quality control criteria, handling of missing data"
          },
          {
            "id": "36",
            "sub": "Archiving and access",
            "value": "Data is stored on a long-term archive server, with access controlled through a license agreement",
            "hint": "Storage location, access controls, maintenance, distribution procedures, ownership"
          },
          {
            "id": "37",
            "sub": "Version control",
            "value": "Version 0.1.0 is the first public release of the MIMIC-IV Waveform Database",
            "hint": "Dataset version control to track changes and ensure reproducibility"
          },
          {
            "id": "38",
            "sub": "Secruity measures",
            "value": "Data is de-identified and access is controlled through a license agreement",
            "hint": "Controls to protect data security and patient privacy"
          },
          {
            "id": "39",
            "sub": "Sampling rate alignment with reference",
            "value": "Not specified"
          },
          {
            "id": "40",
            "sub": "Simultaneous data capture with reference",
            "value": "Not specified"
          }
        ]
      },
      {
        "attribute": "Hardware",
        "rows": [
          {
            "id": "41",
            "sub": "Probe / lead configuration and monitor",
            "value": "ECG and PPG monitors, with specific make and model not stated",
            "hint": "Make and model; ECG lead configuration; PPG probe/monitor"
          },
          {
            "id": "42",
            "sub": "Wavelength information",
            "value": "Not specified",
            "hint": "Infra-red, red, green, etc."
          },
          {
            "id": "43",
            "sub": "Mode",
            "value": "Not specified",
            "hint": "Reflectance, transmittance"
          },
          {
            "id": "44",
            "sub": "Lead / sensor status",
            "value": "Not specified",
            "hint": "Wet/dry electrodes; sensor contact/status"
          }
        ]
      },
      {
        "attribute": "Physiological and Physical Confounders",
        "rows": [
          {
            "id": "45",
            "sub": "Probe / electrode placement",
            "value": "Not specified",
            "hint": "Anatomical placement"
          },
          {
            "id": "46",
            "sub": "Melanin / skin tone measurements",
            "value": "Not specified",
            "hint": "Skin tone assessment"
          },
          {
            "id": "47",
            "sub": "Movement",
            "value": "Not specified",
            "hint": "Motion/activity"
          }
        ]
      },
      {
        "attribute": "Interference",
        "rows": [
          {
            "id": "48",
            "sub": "Interference",
            "value": "Not specified",
            "hint": "Noise level; pacemaker interference"
          }
        ]
      },
      {
        "attribute": "Signal Processing",
        "rows": [
          {
            "id": "49",
            "sub": "On the monitor",
            "value": "Filtering and signal processing are implied by the use of bedside monitors, but specific methods are not stated",
            "hint": "Filtering; bandpass, notch, adaptive filtering"
          },
          {
            "id": "50",
            "sub": "Sampling rate and units",
            "value": "Sampling rate not specified, but data is high-resolution and regularly sampled",
            "hint": "Sampling rate and units"
          },
          {
            "id": "51",
            "sub": "Resolution",
            "value": "Resolution not specified",
            "hint": "Resolution"
          }
        ]
      },
      {
        "attribute": "Artifact and Interference Detection",
        "rows": [
          {
            "id": "52",
            "sub": "Motion, pacemakers etc.",
            "value": "Not specified"
          }
        ]
      },
      {
        "attribute": "Nice to have",
        "rows": [
          {
            "id": "53",
            "sub": "Signal quality of sensor",
            "value": "Not specified",
            "hint": "Overall sensor signal quality assessment"
          },
          {
            "id": "54",
            "sub": "Nail / skin status",
            "value": "Not specified",
            "hint": "Nail/skin status"
          }
        ]
      }
    ]
  }
};

// First-page facsimile shown in the left panel until the reviewer loads the real PDF.
export const SAMPLE_FACS: Record<string, Facsimile> = {
  mimic3wdb: {
    venue: "SCIENTIFIC DATA", lower: false, url: "www.nature.com/scientificdata", badge: "OPEN · DATA DESCRIPTOR",
    title: "MIMIC-III, a freely accessible critical care database",
    authors: "Alistair E. W. Johnson, Tom J. Pollard, Lu Shen, Li-wei H. Lehman, Mengling Feng, Mohammad Ghassemi, Benjamin Moody, Peter Szolovits, Leo Anthony Celi & Roger G. Mark",
    affil: "Laboratory for Computational Physiology, MIT · Beth Israel Deaconess Medical Center, Boston, MA",
    abstract: "MIMIC-III (‘Medical Information Mart for Intensive Care’) is a large, single-center database comprising information relating to patients admitted to critical care units at a large tertiary care hospital. Data includes vital signs, medications, laboratory measurements, observations and notes charted by care providers, fluid balance, procedure and diagnostic codes, imaging reports, length of stay, and survival data.",
    meta: [["Design Type(s)", "data integration objective"], ["Measurement Type(s)", "demographics · clinical measurement · intervention · billing · pharmacotherapy · laboratory test"], ["Technology Type(s)", "electronic medical record · electronic billing system · free-text format"], ["Sample Characteristic(s)", "Homo sapiens"]],
    section: "Background & Summary",
    body: [
      "In recent years there has been a concerted move towards the adoption of digital health record systems in hospitals. Despite this advance, interoperability of digital systems remains an open issue, leading to challenges in data integration.",
      "Here we report the release of the MIMIC-III database, an update to the widely-used MIMIC-II database. MIMIC-III integrates deidentified, comprehensive clinical data of patients admitted to the Beth Israel Deaconess Medical Center in Boston, Massachusetts, and makes it accessible to researchers internationally under a data use agreement.",
      "The database is notable for three reasons: it is freely accessible; it spans more than a decade of detailed individual patient care; and analysis is unrestricted once a data use agreement is accepted.",
    ],
    foot: ["SCIENTIFIC DATA | 3:160035", "DOI: 10.1038/sdata.2016.35"],
  },
  mimic4wdb: {
    venue: "scientific data", lower: true, url: "www.nature.com/scientificdata", badge: "OPEN · DATA DESCRIPTOR",
    title: "MIMIC-IV, a freely accessible electronic health record dataset",
    authors: "Alistair E. W. Johnson, Lucas Bulgarelli, Lu Shen, Alvin Gayles, Ayad Shammout, Steven Horng, Tom J. Pollard, Sicheng Hao, Benjamin Moody, Brian Gow, Li-wei H. Lehman, Leo A. Celi & Roger G. Mark",
    affil: "Massachusetts Institute of Technology · The Hospital for Sick Children, Toronto · Beth Israel Deaconess Medical Center, Boston, MA",
    abstract: "Digital data collection during routine clinical practice is now ubiquitous within hospitals. The data contains valuable information on the care of patients and their response to treatments. Here we present MIMIC-IV, a publicly available database sourced from the electronic health record of the Beth Israel Deaconess Medical Center, covering a decade of admissions between 2008 and 2019.",
    meta: [["Modules", "hosp · icu · note"], ["Records", "431,231 hospital admissions · 73,181 ICU stays"], ["Linked modalities", "diagnostic ECG · chest X-ray · emergency department"], ["Sample Characteristic(s)", "Homo sapiens"]],
    section: "Background",
    body: [
      "Thanks to the widespread adoption of electronic health record systems, data collected during routine clinical practice is now digitally stored in hospitals across the United States. Archiving systems are often not designed to support research, making them difficult to navigate and access.",
      "The intensive care unit is an especially data-rich environment as patients require close monitoring. Uniquely, there are a number of publicly available critical care datasets which have enabled research in this area.",
      "MIMIC-IV is contemporary, incorporates precise digital sources such as the electronic medicine administration record, and establishes a modular organization allowing linkage to external departments and distinct modalities of data.",
    ],
    foot: ["Scientific Data | (2023) 10:1", "https://doi.org/10.1038/s41597-022-01899-x"],
  },
};

// Sample source PDFs bundled under server/data/pub-llm-eval/, served via
// GET /api/cada/file/pdf?filename=... — offered in the "Load PDF" menu.
export const SAMPLE_PDFS: string[] = [
  "pub-llm-eval/10.1038%2Fs41598-022-16517-4.pdf",
  "pub-llm-eval/10.1088%2F1361-6579%2Fabb8bf.pdf",
  "pub-llm-eval/10.1136%2Fheartjnl-2020-316925.pdf",
  "pub-llm-eval/10.1161%2FHYPERTENSIONAHA.119.12756.pdf",
  "pub-llm-eval/10.3389%2Ffcvm.2021.610915.pdf",
  "pub-llm-eval/10.3390%2Fdiagnostics12061474.pdf",
];
