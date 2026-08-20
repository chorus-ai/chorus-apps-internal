import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';

const COHORT_DATA = [
  {
    "cohort_definition_id": 3,
    "cohort_definition_name": "[PheLib - 898] [P] Acute renal failure",
    "cohort_definition_description": "Acute renal failure events",
    "definition_type_concept_id": 0,
    "cohort_definition_syntax": "EXTERNAL_SOURCED",
    "subject_concept_id": 0,
    "cohort_initiation_date": "2024-05-01",
    "subject_count": 16437
  },
  {
    "cohort_definition_id": 4,
    "cohort_definition_name": "[PheLib - 10] [P] Nausea or Vomiting",
    "cohort_definition_description": "Nausea or Vomiting",
    "definition_type_concept_id": 0,
    "cohort_definition_syntax": "EXTERNAL_SOURCED",
    "subject_concept_id": 0,
    "cohort_initiation_date": "2024-05-01",
    "subject_count": 8755
  },
  {
    "cohort_definition_id": 5,
    "cohort_definition_name": "[PheLib - 100] [P][R] Alzheimer's disease",
    "cohort_definition_description": "Alzheimer's disease",
    "definition_type_concept_id": 0,
    "cohort_definition_syntax": "EXTERNAL_SOURCED",
    "subject_concept_id": 0,
    "cohort_initiation_date": "2024-05-01",
    "subject_count": 740
  },
  {
    "cohort_definition_id": 6,
    "cohort_definition_name": "[PheLib - 1001] [W] Peripheral edema",
    "cohort_definition_description": "Peripheral edema",
    "definition_type_concept_id": 0,
    "cohort_definition_syntax": "EXTERNAL_SOURCED",
    "subject_concept_id": 0,
    "cohort_initiation_date": "2024-05-01",
    "subject_count": 16742
  },
  {
    "cohort_definition_id": 7,
    "cohort_definition_name": "[PheLib - 1002] [P] Photosensitivity",
    "cohort_definition_description": "Photosensitivity",
    "definition_type_concept_id": 0,
    "cohort_definition_syntax": "EXTERNAL_SOURCED",
    "subject_concept_id": 0,
    "cohort_initiation_date": "2024-05-01",
    "subject_count": 8
  },
  {
    "cohort_definition_id": 8,
    "cohort_definition_name": "[PheLib - 1006] [P] Vomiting symptoms",
    "cohort_definition_description": "Vomiting",
    "definition_type_concept_id": 0,
    "cohort_definition_syntax": "EXTERNAL_SOURCED",
    "subject_concept_id": 0,
    "cohort_initiation_date": "2024-05-01",
    "subject_count": 6064
  },
  {
    "cohort_definition_id": 9,
    "cohort_definition_name": "[PheLib - 1009] [P] Earliest event of Treatment resistant depression (TRD)",
    "cohort_definition_description": "Earliest event of Treatment resistant depression (TRD)",
    "definition_type_concept_id": 0,
    "cohort_definition_syntax": "EXTERNAL_SOURCED",
    "subject_concept_id": 0,
    "cohort_initiation_date": "2024-05-01",
    "subject_count": 315
  },
  {
    "cohort_definition_id": 10,
    "cohort_definition_name": "[PheLib - 1010] [P] Earliest event of Chronic Graft Versus Host Disease (GVHD)",
    "cohort_definition_description": "Earliest event of Chronic Graft Versus Host Disease (GVHD)",
    "definition_type_concept_id": 0,
    "cohort_definition_syntax": "EXTERNAL_SOURCED",
    "subject_concept_id": 0,
    "cohort_initiation_date": "2024-05-01",
    "subject_count": 59
  },
  {
    "cohort_definition_id": 11,
    "cohort_definition_name": "[PheLib - 1013] [P] Earliest event of Ankylosing Spondylitis",
    "cohort_definition_description": "Earliest event of Ankylosing Spondylitis",
    "definition_type_concept_id": 0,
    "cohort_definition_syntax": "EXTERNAL_SOURCED",
    "subject_concept_id": 0,
    "cohort_initiation_date": "2024-05-01",
    "subject_count": 101
  },
  {
    "cohort_definition_id": 12,
    "cohort_definition_name": "[PheLib - 1016] [P] Earliest event of Polyarticular juvenile idiopathic arthritis (JIA)",
    "cohort_definition_description": "Earliest event of Polyarticular juvenile idiopathic arthritis (JIA)",
    "definition_type_concept_id": 0,
    "cohort_definition_syntax": "EXTERNAL_SOURCED",
    "subject_concept_id": 0,
    "cohort_initiation_date": "2024-05-01",
    "subject_count": 1
  },
  {
    "cohort_definition_id": 13,
    "cohort_definition_name": "[PheLib - 1017] [P] Earliest event of Neonatal Thrombocytopenia (NT), less than 1 year old",
    "cohort_definition_description": "Earliest event of Neonatal Thrombocytopenia (NT), less than 1 year old",
    "definition_type_concept_id": 0,
    "cohort_definition_syntax": "EXTERNAL_SOURCED",
    "subject_concept_id": 0,
    "cohort_initiation_date": "2024-05-01",
    "subject_count": 19
  },
  {
    "cohort_definition_id": 14,
    "cohort_definition_name": "[PheLib - 1018] [P] Earliest event of Warm Autoimmune Hemolytic Anemia (wAIHA)",
    "cohort_definition_description": "Earliest event of Warm Autoimmune Hemolytic Anemia (wAIHA)",
    "definition_type_concept_id": 0,
    "cohort_definition_syntax": "EXTERNAL_SOURCED",
    "subject_concept_id": 0,
    "cohort_initiation_date": "2024-05-01",
    "subject_count": 13
  },
  {
    "cohort_definition_id": 15,
    "cohort_definition_name": "[PheLib - 1019] [P] All events of Hemolytic Disease Fetus and Newborn (HDFN), RhD type, with a pregnancy episode",
    "cohort_definition_description": "All events of Hemolytic Disease Fetus and Newborn (HDFN), RhD type, with a pregnancy episode",
    "definition_type_concept_id": 0,
    "cohort_definition_syntax": "EXTERNAL_SOURCED",
    "subject_concept_id": 0,
    "cohort_initiation_date": "2024-05-01",
    "subject_count": 76
  },
  {
    "cohort_definition_id": 16,
    "cohort_definition_name": "[PheLib - 1020] [P] Earliest event of Major depressive disorder, with NO occurrence of certain psychiatric disorder",
    "cohort_definition_description": "Earliest event of Major depressive disorder, with NO occurrence of certain psychiatric disorder",
    "definition_type_concept_id": 0,
    "cohort_definition_syntax": "EXTERNAL_SOURCED",
    "subject_concept_id": 0,
    "cohort_initiation_date": "2024-05-01",
    "subject_count": 892
  },
  {
    "cohort_definition_id": 17,
    "cohort_definition_name": "[PheLib - 1021] [P] Earliest event of Myasthenia Gravis, inpatient, 2nd diagnosis or treatment, age gte 18",
    "cohort_definition_description": "Earliest event of Myasthenia Gravis, inpatient, 2nd diagnosis or treatment, age gte 18",
    "definition_type_concept_id": 0,
    "cohort_definition_syntax": "EXTERNAL_SOURCED",
    "subject_concept_id": 0,
    "cohort_initiation_date": "2024-05-01",
    "subject_count": 234
  }
];

const CohortView: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredData = useMemo(() => {
    return COHORT_DATA.filter(cohort => 
      cohort.cohort_definition_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cohort.cohort_definition_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cohort.cohort_definition_id.toString().includes(searchQuery)
    );
  }, [searchQuery]);

  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950">
      <main className="flex-grow p-8 overflow-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Cohort Explorer</h2>
              <p className="text-slate-500 dark:text-slate-400">Manage and analyze your defined patient populations.</p>
            </div>
            <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 group">
              <span className="material-symbols-outlined text-lg text-primary group-hover:rotate-180 transition-transform duration-500">sync</span>
              Sync
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Total Definitions', value: COHORT_DATA.length.toString(), icon: 'list_alt', color: 'blue' },
              { label: 'External Sourced', value: COHORT_DATA.length.toString(), icon: 'cloud_download', color: 'emerald' },
              { label: 'Public Cohorts', value: '8', icon: 'public', color: 'purple' },
              { label: 'Last Sync', value: '2 hrs ago', icon: 'sync', color: 'amber' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-500`}>
                    <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cohort Definitions</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                  <input 
                    type="text" 
                    placeholder="Search cohorts..." 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary h-9 transition-all w-64"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center">Subject Count</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Syntax</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Initiation Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {currentItems.map((cohort) => (
                    <tr key={cohort.cohort_definition_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">{cohort.cohort_definition_id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{cohort.cohort_definition_name}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{cohort.cohort_definition_description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-bold text-primary bg-primary/5 px-2 py-1 rounded-md">
                          {(cohort as any).subject_count?.toLocaleString() || '0'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          {cohort.cohort_definition_syntax}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{cohort.cohort_initiation_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/ive/cohort/${cohort.cohort_definition_id}`)}
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          >
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all">
                            <span className="material-symbols-outlined text-lg">more_vert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {currentItems.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">No cohorts found matching your criteria</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={filteredData.length}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              pageSizeOptions={[5, 10, 20, 50]}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CohortView;
