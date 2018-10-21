export const globalResSelector = state => state.resources.rootPack;

export const globalResLoadingPercentage = state => globalResSelector(state).percentage;
