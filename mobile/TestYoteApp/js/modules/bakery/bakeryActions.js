/**
 * All Bakery CRUD actions
 *
 * Actions are payloads of information that send data from the application
 * (i.e. Yote server) to the store. They are the _only_ source of information
 * for the store.
 *
 * NOTE: In Yote, we try to keep actions and reducers dealing with CRUD payloads
 * in terms of 'item' or 'items'. This keeps the action payloads consistent and
 * aides various scoping issues with list management in the reducers.
 */

// import api utility
import callAPI from '../../global/utils/api'

const shouldFetchSingle = (state, id) => {
  /**
   * This is helper method to determine whether we should fetch a new single
   * user object from the server, or if a valid one already exists in the store
   *
   * NOTE: Uncomment console logs to help debugging
   */
  // console.log("shouldFetch single");
  const { byId, selected } = state.bakery;
  if(selected.id !== id) {
    // the "selected" id changed, so we _should_ fetch
    // console.log("Y shouldFetch - true: id changed");
    return true;
  } else if(selected.isFetching) {
    // "selected" is already fetching, don't do anything
    // console.log("Y shouldFetch - false: isFetching");
    return false;
  } else if(!byId[id] && !selected.error) {
    // the id is not in the map, fetch from server
    // however, if the api returned an error, then it SHOULDN'T be in the map
    // so re-fetching it will result in an infinite loop
    // console.log("Y shouldFetch - true: not in map");
    return true;
  } else if(new Date().getTime() - selected.lastUpdated > (1000 * 60 * 5)) {
    // it's been longer than 5 minutes since the last fetch, get a new one
    // console.log("Y shouldFetch - true: older than 5 minutes");
    // also, don't automatically invalidate on server error. if server throws an error,
    // that won't change on subsequent requests and we will have an infinite loop
    return true;
  } else {
    // if "selected" is invalidated, fetch a new one, otherwise don't
    // console.log("Y shouldFetch - " + selected.didInvalidate + ": didInvalidate");
    return selected.didInvalidate;
  }
}

export const INVALIDATE_SELECTED_BAKERY = "INVALIDATE_SELECTED_BAKERY"
export function invalidateSelected() {
  return {
    type: INVALIDATE_SELECTED_BAKERY
  }
}

export const fetchSingleIfNeeded = (id) => (dispatch, getState) => {
  if (shouldFetchSingle(getState(), id)) {
    return dispatch(fetchSingleBakeryById(id))
  } else {
    return dispatch(returnSingleBakeryPromise(id)); // return promise that contains bakery
  }
}

export const returnSingleBakeryPromise = (id) => (dispatch, getState) => {
  /**
   * This returns the object from the map so that we can do things with it in
   * the component.
   *
   * For the "fetchIfNeeded()" functionality, we need to return a promised object
   * EVEN IF we don't need to fetch it. this is because if we have any .then()'s
   * in the components, they will fail when we don't need to fetch.
   */
  return new Promise((resolve, reject) => {
    resolve({
      type: "RETURN_SINGLE_BAKERY_WITHOUT_FETCHING"
      , id: id
      , item: getState().bakery.byId[id]
      , success: true
    })
  });
}

export const REQUEST_SINGLE_BAKERY = "REQUEST_SINGLE_BAKERY";
function requestSingleBakery(id) {
  return {
    type: REQUEST_SINGLE_BAKERY
    , id
  }
}

export const RECEIVE_SINGLE_BAKERY = "RECEIVE_SINGLE_BAKERY";
function receiveSingleBakery(json) {
  return {
    type: RECEIVE_SINGLE_BAKERY
    , id: json.bakery ? json.bakery._id : null
    , item: json.bakery
    , success: json.success
    , error: json.message
    , receivedAt: Date.now()
  }
}

export function fetchSingleBakeryById(bakeryId) {
  return dispatch => {
    dispatch(requestSingleBakery(bakeryId))
    return callAPI(`/api/bakeries/${bakeryId}`)
      .then(json => dispatch(receiveSingleBakery(json)))
  }
}

export const ADD_SINGLE_BAKERY_TO_MAP = "ADD_SINGLE_BAKERY_TO_MAP";
export function addSingleBakeryToMap(item) {
  return {
    type: ADD_SINGLE_BAKERY_TO_MAP
    , item
  }
}

export const SET_SELECTED_BAKERY = "SET_SELECTED_BAKERY";
export function setSelectedBakery(item) {
  return {
    type: SET_SELECTED_BAKERY
    , item
  }
}


export const REQUEST_CREATE_BAKERY = "REQUEST_CREATE_BAKERY";
function requestCreateBakery(bakery) {
  return {
    type: REQUEST_CREATE_BAKERY
    , bakery
  }
}

export const RECEIVE_CREATE_BAKERY = "RECEIVE_CREATE_BAKERY";
function receiveCreateBakery(json) {
  return {
    type: RECEIVE_CREATE_BAKERY
    , id: json.bakery ? json.bakery._id : null
    , item: json.bakery
    , success: json.success
    , error: json.message
    , receivedAt: Date.now()
  }
}

export function sendCreateBakery(data) {
  return dispatch => {
    dispatch(requestCreateBakery(data))
    return callAPI('/api/bakeries', 'POST', data)
      .then(json => dispatch(receiveCreateBakery(json)))
  }
}

export const REQUEST_UPDATE_BAKERY = "REQUEST_UPDATE_BAKERY";
function requestUpdateBakery(bakery) {
  return {
    id: bakery ? bakery._id : null
    , bakery
    , type: REQUEST_UPDATE_BAKERY
  }
}

export const RECEIVE_UPDATE_BAKERY = "RECEIVE_UPDATE_BAKERY";
function receiveUpdateBakery(json) {
  return {
    type: RECEIVE_UPDATE_BAKERY
    , id: json.bakery ? json.bakery._id : null
    , item: json.bakery
    , success: json.success
    , error: json.message
    , receivedAt: Date.now()
  }
}

export function sendUpdateBakery(data) {
  return dispatch => {
    dispatch(requestUpdateBakery(data))
    return callAPI(`/api/bakeries/${data._id}`, 'PUT', data)
      .then(json => dispatch(receiveUpdateBakery(json)))
  }
}

export const REQUEST_DELETE_BAKERY = "REQUEST_DELETE_BAKERY";
function requestDeleteBakery(id) {
  return {
    type: REQUEST_DELETE_BAKERY
    , id
  }
}

export const RECEIVE_DELETE_BAKERY = "RECEIVE_DELETE_BAKERY";
function receiveDeleteBakery(id, json) {
  return {
    id
    , error: json.message
    , receivedAt: Date.now()
    , success: json.success
    , type: RECEIVE_DELETE_BAKERY
  }
}

export function sendDelete(id) {
  return dispatch => {
    dispatch(requestDeleteBakery(id))
    return callAPI(`/api/bakeries/${id}`, 'DELETE')
      .then(json => dispatch(receiveDeleteBakery(id, json)))
  }
}


/**
 * BAKERY LIST ACTIONS
 */

const findListFromArgs = (state, listArgs) => {
  /**
   * Helper method to find appropriate list from listArgs.
   *
   * Because we nest bakeryLists to arbitrary locations/depths,
   * finding the correct list becomes a little bit harder
   */
  // let list = Object.assign({}, state.bakery.lists, {});
  let list = { ...state.bakery.lists }
  for(let i = 0; i < listArgs.length; i++) {
    list = list[listArgs[i]];
    if(!list) {
      return false;
    }
  }
  return list;
}

const shouldFetchList = (state, listArgs) => {
  /**
   * Helper method to determine whether to fetch the list or not from arbitrary
   * listArgs
   *
   * NOTE: Uncomment console logs to help debugging
   */
  // console.log("shouldFetchList with these args ", listArgs, "?");
  const list = findListFromArgs(state, listArgs);
  // console.log("LIST in question: ", list);
  if(!list || !list.items) {
    // yes, the list we're looking for wasn't found
    // console.log("X shouldFetch - true: list not found");
    return true;
  } else if(list.isFetching) {
    // no, this list is already fetching
    // console.log("X shouldFetch - false: fetching");
    return false
  } else if(new Date().getTime() - list.lastUpdated > (1000 * 60 * 5)) {
    // yes, it's been longer than 5 minutes since the last fetch
    // console.log("X shouldFetch - true: older than 5 minutes");
    return true;
  } else {
    // maybe, depends on if the list was invalidated
    // console.log("X shouldFetch - " + list.didInvalidate + ": didInvalidate");
    return list.didInvalidate;
  }
}

export const fetchListIfNeeded = (...listArgs) => (dispatch, getState) => {
  if(listArgs.length === 0) {
    // If no arguments passed, make the list we want "all"
    listArgs = ["all"];
  }
  if(shouldFetchList(getState(), listArgs)) {
    return dispatch(fetchList(...listArgs));
  } else {
    return dispatch(returnBakeryListPromise(...listArgs));
  }
}

export const returnBakeryListPromise = (...listArgs) => (dispatch, getState) => {
  /**
   * This returns the list object from the reducer so that we can do things with it in
   * the component.
   *
   * For the "fetchIfNeeded()" functionality, we need to return a promised object
   * EVEN IF we don't need to fetch it. This is because if we have any .then()'s
   * in the components, they will fail when we don't need to fetch.
   */

  // return the array of objects just like the regular fetch
  const state = getState();
  const listItemIds = findListFromArgs(state, listArgs).items
  const listItems = listItemIds.map(id => state.bakery.byId[id]);

  return new Promise((resolve) => {
    resolve({
      list: listItems
      , listArgs: listArgs
      , success: true
      , type: "RETURN_BAKERY_LIST_WITHOUT_FETCHING"
    })
  });
}

export const REQUEST_BAKERY_LIST = "REQUEST_BAKERY_LIST"
function requestBakeryList(listArgs) {
  return {
    type: REQUEST_BAKERY_LIST
    , listArgs
  }
}

export const RECEIVE_BAKERY_LIST = "RECEIVE_BAKERY_LIST"
function receiveBakeryList(json, listArgs) {
  return {
    type: RECEIVE_BAKERY_LIST
    , listArgs
    , list: json.bakeries
    , success: json.success
    , error: json.message
    , receivedAt: Date.now()
  }
}

export const ADD_BAKERY_TO_LIST = "ADD_BAKERY_TO_LIST";
export function addBakeryToList(id, ...listArgs) {
  // console.log("Add bakery to list", id);
  if(listArgs.length === 0) {
    listArgs = ["all"];
  }
  return {
    type: ADD_BAKERY_TO_LIST
    , id
    , listArgs
  }
}

export const REMOVE_BAKERY_FROM_LIST = "REMOVE_BAKERY_FROM_LIST"
export function removeBakeryFromList(id, ...listArgs) {
  if(listArgs.length === 0) {
    listArgs = ['all'];
  }
  return {
    type: REMOVE_BAKERY_FROM_LIST
    , id
    , listArgs
  }
}

export function fetchList(...listArgs) {
  return dispatch => {
    if(listArgs.length === 0) {
      // default to "all" list if we don't pass any listArgs
      listArgs = ["all"];
    }
    dispatch(requestBakeryList(listArgs))
    /**
     * determine what api route we want to hit
     *
     * NOTE: use listArgs to determine what api call to make.
     * if listArgs[0] == null or "all", return list
     *
     * if listArgs has 1 arg, return "/api/bakeries/by-[ARG]"
     *
     * if 2 args, additional checks required.
     *  if 2nd arg is a string, return "/api/bakeries/by-[ARG1]/[ARG2]".
     *    ex: /api/bakeries/by-category/:category
     *  if 2nd arg is an array, though, return "/api/bakeries/by-[ARG1]-list" with additional query string
     *
     * TODO:  make this accept arbitrary number of args. Right now if more
     * than 2, it requires custom checks on server
     */
    let apiTarget = "/api/bakeries";
    if(listArgs.length == 1 && listArgs[0] !== "all") {
      apiTarget += `/by-${listArgs[0]}`;
    } else if(listArgs.length == 2 && Array.isArray(listArgs[1])) {
      // length == 2 has it's own check, specifically if the second param is an array
      // if so, then we need to call the "listByValues" api method instead of the regular "listByRef" call
      // this can be used for querying for a list of bakeries given an array of bakery id's, among other things
      apiTarget += `/by-${listArgs[0]}-list?`;
      // build query string
      for(let i = 0; i < listArgs[1].length; i++) {
        apiTarget += `${listArgs[0]}=${listArgs[1][i]}&`
      }
    } else if(listArgs.length == 2) {
      // ex: ("author","12345")
      apiTarget += `/by-${listArgs[0]}/${listArgs[1]}`;
    } else if(listArgs.length > 2) {
      apiTarget += `/by-${listArgs[0]}/${listArgs[1]}`;
      for(let i = 2; i < listArgs.length; i++) {
        apiTarget += `/${listArgs[i]}`;
      }
    }
    return callAPI(apiTarget).then(
      json => dispatch(receiveBakeryList(json, listArgs))
    )
  }
}

/**
 * LIST UTIL METHODS
 */
export const SET_BAKERY_FILTER = "SET_BAKERY_FILTER"
export function setFilter(filter, ...listArgs) {
  if(listArgs.length === 0) {
    listArgs = ["all"];
  }
  return {
    type: SET_BAKERY_FILTER
    , filter
    , listArgs
  }
}

export const SET_BAKERY_PAGINATION = "SET_BAKERY_PAGINATION"
export function setPagination(pagination, ...listArgs) {
  if(listArgs.length === 0) {
    listArgs = ["all"];
  }
  return {
    type: SET_BAKERY_PAGINATION
    , pagination
    , listArgs
  }
}

export const INVALIDATE_BAKERY_LIST = "INVALIDATE_BAKERY_LIST"
export function invalidateList(...listArgs) {
  if(listArgs.length === 0) {
    listArgs = ["all"];
  }
  return {
    type: INVALIDATE_BAKERY_LIST
    , listArgs
  }
}
