import React from "react";
import "./styles.scss"
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import useVisualMode from "hooks/useVisualMode";


export default function Appointment(props) {
  console.log('index-props', props)
  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING'
  const DELETE = 'DELETE';
  const CONFIRM = 'CONFIRM';

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = async (name, interviewer) => {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING)

    setTimeout(() => {
      props.bookInterview(props.id, interview)
      transition(SHOW);
    }, 1500);
  }
  
  const deleteInt = () => {
    transition(DELETE);

    setTimeout(() => {
      props.cancelInterview(props.id);
      transition(EMPTY);
    },2000)
  };

  const confirmDelete = () => {
    transition(CONFIRM)
  }

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete = {confirmDelete}
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
      {mode === DELETE && <Status message="Deleting"/>}
      {mode === CONFIRM && <Confirm onConfirm={deleteInt} onCancel={() => back()} message={'Are you sure you want to delete?'}/>}
    </article>
  );
};