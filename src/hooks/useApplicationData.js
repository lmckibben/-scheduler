import { useState, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState({ ...state, day });
 
  const updateSpot = (state, day, action) => {
    let spotsLeft = 0;
    const appointment = getAppointmentsForDay(state, day)
    for (const i in appointment) {
      if (!appointment[i].interview) {
        spotsLeft++
      }
    }
    for (const index in state.days) {
      if (state.days[index].name === day) {
        if (action === 'add') {
          spotsLeft--
        }
        if (action === 'destroy') {
          spotsLeft++
        }
        state.days[index].spots = spotsLeft
      }
    }
    return state.days
  };
  updateSpot(state, state.day)

  function bookInterview(id, interview) {
    //console.log('interview', interview);
    updateSpot(state, state.day, 'add')
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios
    .put(`/api/appointments/${id}`, appointment)
    .then(() => {
      const days = updateSpot(state, state.day, 'destroy')
      setState({...state, appointments, days})
    })
  }

  const cancelInterview = (id, interview) => {
    updateSpot(state, state.day, 'destroy')
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    return axios
    .delete(`/api/appointments/${id}`, appointment)
    .then(() => {
      const days = updateSpot(state, state.day, 'destroy')
      setState({...state, appointments, days})
    })
  
  };
  
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
  }, []);

  return {state, setDay, bookInterview, cancelInterview}
};