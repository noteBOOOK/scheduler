import React from "react";

import "components/Appointment/styles.scss";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "../../hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";



function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";

 

  const {mode, transition, back} = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(res => {
      transition(SHOW);
    })
  };

  function cancel() {
    transition(DELETING);
    props.cancelInterview(props.id)
    .then(() => {
      transition(EMPTY);
    })
  };

  return (
    <article className="appointment">
      <Header time={props.time} />

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === CREATE && (
        <Form 
          bookInterview={props.bookInterview}
          onSave={save}
          interviewers={props.interviewers}
          onCancel={() => back()}
        />
        )}
      {mode === SHOW && (
        <Show 
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onCancel={() => transition(CONFIRM)}
        />
        
      )}
      {mode === SAVING && (
        <Status message={"Saving"}/>
      )}
      {mode === DELETING && (
        <Status message={"Deleting"}/>
      )}
      {mode === CONFIRM && (
        <Confirm 
          message={"Are you sure you would like to delete?"}
          onConfirm={cancel}
          onCancel={() => back()}
        />
      )}


    </article>
  )

}

export default Appointment;