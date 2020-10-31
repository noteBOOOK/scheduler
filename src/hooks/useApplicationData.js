import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData(initial) {

  const setDay = day => setState({ ...state, day});

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      setState(prev => ({...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }))
    })
  }, [])

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const url = `http://localhost:8001/api/appointments/${id}`;
    return axios.put(url, appointments[id])
    .then(response => {
      setState({ 
        ...state,
        appointments 
      });
    })
  };

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const url = `http://localhost:8001/api/appointments/${id}`;
    return axios.delete(url, appointment)
    .then(() => {
      setState({
        ...state,
        appointments
      });
    });
  }

  return {state, setDay, bookInterview, cancelInterview}
}