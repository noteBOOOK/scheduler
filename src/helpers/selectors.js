export function getAppointmentsForDay(state, day) {
  let result = [];

  const filteredDay = state.days.filter(listDay => listDay.name === day);
  if (filteredDay[0]) {
    const listOfAppointments = filteredDay[0].appointments;
    for (let appointment of listOfAppointments) {
      if (state.appointments[appointment]) {
        result.push(state.appointments[appointment]);
      }
    }
  }
  return result;
}

export function getInterviewersForDay(state, day) {
  let result = [];

  const filteredDay = state.days.filter(listDay => listDay.name === day);
  if (filteredDay[0]) {
    const listOfInterviewers = filteredDay[0].interviewers;
    for (let interviewer of listOfInterviewers) {
      if (state.interviewers[interviewer]) {
        result.push(state.interviewers[interviewer]);
      }
    }
  }
  return result;
}

export function getInterview(state, interview) {
  let result = null;

  if (interview) {
    result = {student: interview.student};
    for (let interviewer in state.interviewers) {
      if (interview.interviewer === state.interviewers[interviewer].id) {
        result.interviewer = state.interviewers[interviewer];
      }
    }
  }
  return result;
}