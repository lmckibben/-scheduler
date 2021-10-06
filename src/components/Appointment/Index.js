import React from "react";
import "./styles.scss"
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";


export default function Appointment(props) {
  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING'
  const DELETING = 'DELETE';
  const CONFIRM = 'CONFIRM';
  const EDIT = 'Edit';
  const ERROR_SAVE = 'ERROR_SAVE';
  const ERROR_DELETE = 'ERROR_DELETE';
  const ERROR_INTERVIEWER = 'ERROR_INTERVIEWER';

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    if (interviewer) {
      const interview = {
        student: name,
        interviewer
      };
    
      transition(SAVING);
    
      props
        .bookInterview(props.id, interview)
        .then(() => transition(SHOW))
        .catch(error => transition(ERROR_SAVE, true));
    } else {
      transition(ERROR_INTERVIEWER)
    }
  }
  
  function destroy(event) {
    transition(DELETING, true);
    props
     .cancelInterview(props.id)
     .then(() => transition(EMPTY))
     .catch(error => transition(ERROR_DELETE, true));
   }

  const confirmDelete = () => {
    transition(CONFIRM)
  }

  const onEdit = () => {
    transition(EDIT);
  }

  return (
    <article className = "appointment">
      <Header time = {props.time} />
      {mode === EMPTY && <Empty onAdd = {() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student = {props.interview.student}
          interviewer = {props.interview.interviewer}
          onDelete = { confirmDelete }
          onEdit = { onEdit }
        />
      )}
      {mode === CREATE && (
        <Form
          interviewers = {props.interviewers}
          onCancel = {() => back()}
          onSave = { save }
        />
      )}
      {mode === SAVING && <Status message="Saving"/>}
      {mode === DELETING && <Status message="Deleting"/>}
      {mode === CONFIRM && (
        <Confirm
          onConfirm = {destroy}
          onCancel = {() => back()}
          message = {'Are you sure you want to delete?'}
        />
      )}
      {mode === EDIT && (
        <Form
          name = {props.interview.student}
          day = {props.day}
          interviewer = {props.interview.interviewer.id}
          interviewers = {props.interviewers}
          onSave = { save }
          onCancel = {() => back()}
        />
      )}
      {mode === ERROR_SAVE && <Error message={"There was an error while saving appointment"} onClose={() => back()}/> }
      {mode === ERROR_DELETE && <Error message={"There was an error while deleting appointment"} onClose={() => back()}/>}
      {mode === ERROR_INTERVIEWER && <Error message={"You must select a interviewer to continue"} onClose={() => back()}/>}
    </article>
  );
};