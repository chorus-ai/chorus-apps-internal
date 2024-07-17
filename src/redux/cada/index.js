
const initialState = {
  alert: null,
  userProjects: {},
  userRoles: [],
  annotators: {},
  adjudicators: {},
  files: {},
  ann_events: {},
  adj_events: {},
  ann_events_count: {},
  adj_events_count: {},
  ann_values: {},
  adj_values: {},

  projects: [],
  users: [],
  userProjectRoles: {},
  events: {},
  events_count: {},
  buckets: {},
  reports: {},
};

export default function cadaReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_USER_PROJECTS": {
      console.log(action);
      return {
        ...state,
        userProjects: action.userProjects,
      };
    }
    case "GET_USER_ROLES": {
      console.log(action);
      return {
        ...state,
        userRoles: action.userRoles,
      };
    }
    case "GET_ANNOTATORS": {
      console.log(action);
      const currAnnotators = { ...state.annotators };

      action.users.forEach((user) => {
        if (!currAnnotators.hasOwnProperty(user.id)) {
          currAnnotators[user.id] = user;
        }
      });

      return {
        ...state,
        annotators: currAnnotators,
      };
    }
    case "GET_ADJUDICATORS": {
      console.log(action);
      return {
        ...state,
        adjudicators: action.adjudicators,
      };
    }
    case "GET_ANN_EVENTS": {
      console.log(action);
  
      // const annotationValues =  action.events.filter((e) => e.cadaAnnotations[0].cadaAnnotationValues.length > 0)
      // .reduce((annValues, event) => {
      //   const groupedByField =
      //     event.cadaAnnotations[0].cadaAnnotationValues.reduce((acc, values) => {
      //       const field = values.field;

      //       if (!acc[field] || values.id > acc[field].id) {
      //         acc[field] = values; 
      //       }
      //       return acc;
      //     }, {});

      //     annValues[event.id] = Object.values(groupedByField).reduce((acc, values) => {
      //       try {
      //         acc[values.field] = JSON.parse(values.value);
      //       } catch (error) {
      //         acc[values.field] = values.value;
      //       }
      //       return acc;
      //     }, {});
          

      //   return annValues;
      // }, {});

      // console.log("temp: ", temp);
      // console.log("annotationValues: ", annotationValues);

      return {
        ...state,
        ann_events: {
          ...state.ann_events,
          // if sinceId is provided, append to the existing events
          [action.projectId]: action.sinceId ? {
            ...state.ann_events[action.projectId],
            false: [...state.ann_events[action.projectId].false, ...action.events.filter((d) => !d.cadaAnnotations[0].completed)],
            true: [...state.ann_events[action.projectId].true, ...action.events.filter((d) => d.cadaAnnotations[0].completed)],
          } : {
            false: action.events.filter((d) => !d.cadaAnnotations[0].completed),
            true: action.events.filter((d) => d.cadaAnnotations[0].completed),
          },
        },
        // ann_values: {
        //   ...state.ann_values,
        //   [action.projectId]: annotationValues,
        // },
      };
    }
    case "GET_ANN_EVENTS_COUNT": {
      console.log(action);
      return {
        ...state,
        ann_events_count: {
          ...state.ann_events_count,
          [action.projectId]: action.payload,
        },
      };
    }
    case "GET_ADJ_EVENTS": {
      console.log(action);
      return {
        ...state,
        adj_events: {
          ...state.adj_events,
          [action.projectId]: action.events,
        },
      };
    }
    case "GET_ADJ_EVENTS_COUNT": {
      console.log(action);
      return {
        ...state,
        adj_events_count: {
          ...state.adj_events_count,
          [action.projectId]: action.payload,
        },
      };
    }
    case "UPDATE_ANNOTATION": {
      console.log(action);
      let temp = Object.assign({}, state.ann_events[action.projectId]);
      let targetObj = {}
      for (const isCompleted in temp) {
        if (temp.hasOwnProperty(isCompleted)) {
          const eventObjects = temp[isCompleted];
          for (const obj of eventObjects) {
            if (obj.id === action.eventId) {
              targetObj = obj; 
              obj.cadaAnnotations[0].cadaAnnotationValues.push(action.annotation);
              break;
            }
          }
        }
      }

      //update the count
      let annCount = state.ann_events_count[action.projectId];
      if (action.completed === false ) {
        annCount[0] = annCount[0] - 1;
        annCount[1] = annCount[1] + 1;
      }

      if (action.completed === false) {
        temp[false] =  temp[false].filter((d) => d.id !== action.eventId);
        temp[true].push(targetObj);
      }

      return {
        ...state,
        ann_events: {
          ...state.ann_events,
          [action.projectId]: temp,
          ann_events_count:
          {
            ...state.ann_events_count,
            [action.projectId]: annCount
          }
        }
      };
    }
    case "UPDATE_ADJUDICATION": {
      console.log(action);
      let temp = Object.assign([], state.adj_events[action.projectId]);
      let tempEvent = temp.filter((d) => d.id === action.eventId)[0];
      console.log("tempEvent: ", tempEvent);
      tempEvent.cadaAdjudicationValues.push(action.adjudication);

      return {
        ...state,
        adj_events: {
          ...state.adj_events,
          [action.projectId]: temp,
        },
      };
    }
    case "GET_USERS": {
      console.log(action);
      return {
        ...state,
        users: action.users,
      };
    }
    case "ADD_USER": {
      console.log(action);
      return {
        ...state,
        users: [...state.users, action.user],
      };
    }
    case "REMOVE_USER": {
      console.log(action);
      return {
        ...state,
        users: state.users.filter(({ id }) => id !== action.userId),
      };
    }
    case "ADD_PROJECT_USER": {
      console.log(action);
      return {
        ...state,
        userProjectRoles: {
          ...state.userProjectRoles,
          [action.userId]: action.payload,
        },
      };
    }
    case "REMOVE_PROJECT_USER": {
      console.log(action);
      return {
        ...state,
        userProjectRoles: {
          ...state.userProjectRoles,
          [action.userId]: state.userProjectRoles[action.userId].map(project => {
            // Filtering out the project user with the specified ID
            project.cadaProjectUsers = project.cadaProjectUsers.filter(pUser => pUser.id !== action.payload.id);
            return project;
          }),
        },
      };
    }
    case "GET_PROJECTS": {
      console.log(action);
      return {
        ...state,
        projects: action.projects,
      };
    }
    case "ADD_PROJECT": {
      console.log(action);
      return {
        ...state,
        projects: [...state.projects, action.project],
      };
    }
    case "UPDATE_PROJECT": {
      console.log(action);
      let temp = Object.assign([], state.projects);
      let objIndex = temp.findIndex((obj) => obj.id === action.project.id);
      temp[objIndex] = action.project;

      return {
        ...state,
        projects: temp,
      };
    }
    case "REMOVE_PROJECT": {
      console.log(action);
      return {
        ...state,
        projects: state.projects.filter(({ id }) => id !== action.projectId),
      };
    }
    case "GET_EVENTS": {
      console.log(action);
      const temp = {
        false: action.events.filter((d) => !d.cadaAnnotations[0].completed),
        true: action.events.filter((d) => d.cadaAnnotations[0].completed),
      };
      return {
        ...state,
        events: {
          ...state.events,
          [action.projectId]: temp,
        },
      };
    }
    
    case "GET_EVENTS_COUNT": {
      console.log(action);
      return {
        ...state,
        events_count: {
          ...state.events_count,
          [action.projectId]: action.payload,
        },
      };
    }
    case "GET_BUCKETS": {
      console.log(action);
      return {
        ...state,
        buckets: {
          ...state.buckets,
          [action.path]: action.buckets,
        },
      };
    }
    case "UPDATE_ALERT": {
      return {
        ...state,
        alert: action.alert,
      };
    }
    case "RESET_ALERT": {
      return {
        ...state,
        alert: null,
      };
    }

    default:
      return state;
  }
}
