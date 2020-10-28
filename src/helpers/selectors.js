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