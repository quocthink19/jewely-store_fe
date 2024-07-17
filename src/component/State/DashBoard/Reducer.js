import {
  GET_DASHBOARD_REQUEST,
  GET_DASHBOARD_SUCCESS,
  GET_DASHBOARD_FAILURE,
  GET_DASHBOARD_AREA_REQUEST,
  GET_DASHBOARD_AREA_SUCCESS,
  GET_DASHBOARD_AREA_FAILURE,
  GET_DASHBOARD_AREAS_REQUEST,
  GET_DASHBOARD_AREAS_SUCCESS,
  GET_DASHBOARD_AREAS_FAILURE,
} from './ActionType';

const initialState = {
  all : null,
  area : null,
  areas : null,
  loading: false,
  error: null,
};


const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DASHBOARD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_DASHBOARD_SUCCESS:
      return {
        ...state,
        all : action.payload,
        loading: false,
        error: null,
      };

    case GET_DASHBOARD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case GET_DASHBOARD_AREA_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_DASHBOARD_AREA_SUCCESS:
      return {
        ...state,
        area : action.payload,
        loading: false,
        error: null,
      };

    case GET_DASHBOARD_AREA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    case GET_DASHBOARD_AREAS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_DASHBOARD_AREAS_SUCCESS:
      return {
        ...state,
        areas : action.payload,
        loading: false,
        error: null,
      };

    case GET_DASHBOARD_AREAS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default:
      return state;
  }
};
export default dashboardReducer