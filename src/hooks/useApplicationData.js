import { useState, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors";


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

  useEffect(() => {
    let listOfAppointments = getAppointmentsForDay(state, state.day);
    let numOfSpots = listOfAppointments.filter(appointment => !appointment.interview).length;

    let listOfDays = state.days.map(day => {
      if (day.name === state.day) {
        day.spots = numOfSpots;
      }
      return day;
    })
    setState(prev => ({...prev,
      days: listOfDays
    }))
    // console.log(currentDay[0]);
    // console.log(day);
  }, [state.appointments])


  // console.log(state.day)
  // console.log(state);
  
  
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


  // console.log(filteredAppointments);
  // console.log(state);

  // console.log(state.appointments.interview);
  // console.log(listOfAppointments);

  return {state, setDay, bookInterview, cancelInterview}
}