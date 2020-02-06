export default (state, action) => {
  switch (action.type) {
    case 'ADD_STORY_POINTS':
      return action.data;
    default:
      return state;
  }
};

export const initStoryPoints = [];
