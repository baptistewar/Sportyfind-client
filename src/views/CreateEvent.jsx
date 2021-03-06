import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import "react-google-places-autocomplete/dist/assets/index.css";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";

import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import moment from 'moment';

// custom tools
import APIHandler from "../api/APIHandler";

// styles
import "../styles/CreateEvent.css";

export default withRouter(function CreateEvent({
  mode = "create",
  _id,
  history,
  match
}) {
  const [state, setState] = useState({
    name: "",
    date: "",
    time: "",
    lat: "",
    lng: "",
    localisation: "",
    maxParticipants: "",
    description: "",
    sport: "",
    sports: [],
  });

  const [errMessage, setErrMessage]=useState("")

  useEffect(() => {
    const getData = async () => {
      try  {
        let newState = { ...state };
        const sportsRes = await APIHandler.get(`/sports`);
        newState.sports = sportsRes.data.sports;

        moment.updateLocale(moment.locale(), { invalidDate: "Choose your date" })
        
        setState(newState);
      } catch (err) {
        console.log(err);
      }
    };

    getData();
  }, []);

  const handleDayChange = e => {
    setState({ ...state, date: e });
  };

  const handleAddressChange = e => {
    geocodeByAddress(e.description)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        setState({ ...state, lat: lat, lng: lng, localisation: e.description });
      });
  };

  const handleChange = e => {
    e.persist();
    setState({ ...state, [e.target.id]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setState({ ...state, isRequesting: true });

    try {
       await APIHandler.post("/events/create", state);
      history.push({
        pathname: "/events",
        search: "?sport=AllSports"
      });
    } catch (apiErr) {
      console.error(apiErr);
      setErrMessage(apiErr.response.data)
    }
  };
  
 
  
  return (
    <div className="toute">
      <p className="createevent">Create an event</p>

      <form className="form" onSubmit={handleSubmit}>
        <div className="all">
          <div className="nameinput">
            <label className="label" htmlFor="sport">
              Sport
            </label>
            <select id="sport" value={state.sport} onChange={handleChange}>
              <option value="" disabled>
                Select a sport
              </option>
              {state.sports.map((sport, i) => (
                <option value={sport._id} key={i}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>

          <div className="nameinput">
            <label className="label" htmlFor="name">
              Name
            </label>
            <input
              onChange={handleChange}
              className="input"
              id="name"
              type="text"
              defaultValue={state.name}
              placeholder="Name"
              required
            />
          </div>

          <div className="nameinput">
            <label className="label" htmlFor="date">
              Date
            </label>
            <DayPickerInput
              onDayChange={handleDayChange}
              className="input"
              id="date"
              placeholder= {"Choose your date"}
              value={moment(state.date).format("MMMM Do YYYY")}
            />
          </div>

          <div className="nameinput">
            <label className="label" htmlFor="time">
              Time
            </label>
            <input
              onChange={handleChange}
              className="input"
              id="time"
              type="time"
              defaultValue={state.time}
              placeholder="00:00"
            />
          </div>

          <div className="nameinput">
            <label className="label" htmlFor="maxParticipants">
              Maximum number of participants
            </label>
            <input
              onChange={handleChange}
              className="input"
              id="maxParticipants"
              type="text"
              defaultValue={state.maxParticipants}
              placeholder="10"
              required
            />
          </div>

          <div className="nameinput">
            <label className="label" htmlFor="description">
              Description
            </label>
            <input
              onChange={handleChange}
              className="input"
              id="description"
              type="text"
              defaultValue={state.description}
              placeholder="Description"
              required
            />
          </div>

          <div className="nameinput">
            <label className="label" htmlFor="localisation">
              Localisation
            </label>
            <GooglePlacesAutocomplete
              inputClassName="input"
              id="localisation"
              type="text"
              onSelect={handleAddressChange}
              placeholder="Localisation"
              autocompletionRequest={{
                componentRestrictions: {
                  country: ["fr"]
                }
              }}
            />
          </div>

          <div className="nameinput">

          {errMessage && (<div className="errMessage">{errMessage}</div>)}

            <button className="btn" >
              Create Event
            </button>
          </div>
        </div>
      </form>
    </div>
  );
});
