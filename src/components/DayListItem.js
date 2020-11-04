import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";


// Component for the Individual Days
export default function DayListItem(props) {
  
  const formatSpots = function(spots) {
    if (spots === 0) {
      return `no spots remaining`
    } else if (spots === 1) {
      return `1 spot remaining`
    } else {
      return `${spots} spots remaining`
    }
  }
  
  const dayItemClass = classNames({
    "day-list__item": true,
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  })
  
  return (
    <li className={dayItemClass} onClick={() => props.setDay(props.name)} data-testid="day">
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}
