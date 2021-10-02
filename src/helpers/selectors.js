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
};

const getInterview = (state, interview) => {
  const interviewObj = {};

  if (interview) {
    for (let inter in state.interviewers) {
      if (state.interviewers[inter].id == interview.interviewer) {
        interviewObj.student = interview.student
        interviewObj.interviewer = state.interviewers[inter]
      }
    }
  } else {
    return null;
  }
  
  return interviewObj;
};

export { getAppointmentsForDay, getInterview };