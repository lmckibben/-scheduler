const getAppointmentsForDay = (state, day) => {
  const dayArray = [];
  const appointmentArray = [];
  for (let dayState of state.days) {
    if (dayState.appointments.length === 0) {
      return dayArray;
    }
    if (dayState.name === day) {
      dayArray.push(...dayState.appointments);
    }
  }

  for (let appointment in state.appointments) {
    for (let day of dayArray) {
      if (day === parseInt(appointment)) {
        appointmentArray.push(state.appointments[appointment]);
      }
    }
  }
  return appointmentArray;
}

export { getAppointmentsForDay };