
import { api } from '../../config/api';

import {GET_DASHBOARD_AREA_FAILURE, GET_DASHBOARD_AREA_REQUEST, GET_DASHBOARD_AREA_SUCCESS, GET_DASHBOARD_AREAS_FAILURE, GET_DASHBOARD_AREAS_REQUEST, GET_DASHBOARD_AREAS_SUCCESS, GET_DASHBOARD_FAILURE, GET_DASHBOARD_REQUEST, GET_DASHBOARD_SUCCESS} from './ActionType';


export const getDashboardStats = (start, end, jwt) => async (dispatch) => {
  dispatch({ type: GET_DASHBOARD_REQUEST });

  try {
    const response = await api.get(`/api/dashboard/store`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: { start, end },
    });
    dispatch({
      type: GET_DASHBOARD_SUCCESS,
      payload: response.data,
    });
    console.log("data",response.data)
  } catch (error) {
    dispatch({
      type: GET_DASHBOARD_FAILURE,
      error: error.message,
    });
    console.log("error",error)
  }
};

export const getDashboardStatsByArea = (start, end, areaId, jwt) => async (dispatch) => {
  dispatch({ type: GET_DASHBOARD_AREA_REQUEST });

  try {
    const response = await api.get(`/api/dashboard/area`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: { start, end, areaId },
    });
    dispatch({
      type: GET_DASHBOARD_AREA_SUCCESS,
      payload: response.data,
    });
    console.log("area",response.data)
  } catch (error) {
    dispatch({
      type: GET_DASHBOARD_AREA_FAILURE,
      error: error.message,
    });
  }
};

export const getDashboardStatsByAreas = (start, end, areaIds, jwt) => async (dispatch) => {
  dispatch({ type: GET_DASHBOARD_AREAS_REQUEST});

  try {
    const areaParams = areaIds.map(id => `areaIds=${id}`).join('&');
    const response = await api.get(`/api/dashboard/areas?start=${start}&end=${end}&${areaParams}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch({
      type: GET_DASHBOARD_AREAS_SUCCESS,
      payload: response.data,
    });
    console.log("total area",response.data)
  } catch (error) {
    dispatch({
      type: GET_DASHBOARD_AREAS_FAILURE,
      error: error.message,
    });
    console.log("error",error);
  }
};