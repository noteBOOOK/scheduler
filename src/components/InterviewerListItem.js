import React from "react";

import classNames from "classnames";

import "components/InterviewerListItem.scss";

export default function InterviewerListItem(props) {


  const InterviewerItemClass = classNames({
    "interviewers__item": true,
    "interviewers__item--selected": props.selected
  })

  const displayName = function (props) {
    if (props.selected) {
      return props.name;
    }
  }

  return(
    <li className={InterviewerItemClass}>
      <img
        className="interviewers__item-image"
        src={props.avatar}
        alt={props.name}
      />
      
      <p>{displayName(props)}</p>
    </li>
  );
}