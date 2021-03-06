import React from 'react'
import { Link } from "react-router-dom";
import moment from 'moment';
import Buttons from "./Buttons"
import { useAuth } from "../auth/useAuth";



// styles
import "./../styles/eventscard.css"

export default function EventsCard({ event,history, clbk }) {
    const { isLoading, currentUser } = useAuth();
    var remainingPlaces = event.maxParticipants - event.participants.length;

var creator = false
var participant = false

if (currentUser) {
    creator =  currentUser._id === event.creator._id;
    participant = event.participants.map((p) => p._id).includes(currentUser._id);
}


    return (
        <div className="cardOfevent">
  
            <img className="backimg" src={event.sport.image} alt="" />
            <div className="eventdate">
                <div >{moment(event.date).format("MMMM Do YYYY")} - {event.time}</div>
                {creator ? (<div className={"creatorCard corner-ribbon top-right red"}>Created</div>) : participant ? (<div className={"participantCard corner-ribbon top-right green"}>Joined</div>) : false}
            </div>

            <hr className="separation"></hr>
            <div className="information">
                {event.sport && <div>{event.sport.name} {event.sport.logo}</div>}
                <div>{event.name}</div>
                <div className="ellipsis">{event.localisation}</div>
                <div>Remaining places : <span>{remainingPlaces}</span></div>
                <div className="seemoreandjoin">

                    <Link className="seemore action-button" to={`/events/${event._id}`}>Details</Link>
                    <Buttons remainingPlaces={remainingPlaces} event={event} history={history} clbk={clbk}/>
                </div>
            </div>
        </div>
    )
}

