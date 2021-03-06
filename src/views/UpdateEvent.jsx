import React, { Component } from "react";
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

export default class UpdateEvent extends Component {
  state = {
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
    isRequesting: false
  };

  handleSubmit = async e => {
    e.preventDefault();
    try {
      await APIHandler.patch(`/events/edit/${this.props.match.params.id}`, {
        name: this.state.name,
        date: this.state.date,
        time: this.state.time,
        lat: this.state.lat,
        lng: this.state.lng,
        localisation: this.state.localisation,
        maxParticipants: this.state.maxParticipants,
        description: this.state.description,
        sport: this.state.sport,
        sports: this.state.sports,
        isRequesting: false
      });
      this.props.history.push({
      pathname: '/events',
      search: '?sport=AllSports'
      })
    } catch (err) {
      //
    }
  };

  handleDayChange = e => {
    this.setState(prevValues => ({
      ...prevValues,
      date: e
    }));
  };

  handleAddressChange = e => {
    geocodeByAddress(e.description)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        this.setState({ lat, lng, localisation: e.description });
      });
  };

  handleChange = e => {
    e.persist();
    this.setState(prevValues => ({
      ...prevValues,
      [e.target.id]: e.target.value
    }));
  };


  componentDidMount() {
    APIHandler.get(`/events/${this.props.match.params.id}`)
      .then(apiRes => {
        this.setState(apiRes.data);
      })
      .catch(apiErr => console.error(apiErr));
    APIHandler.get("/sports")
      .then(apiRes => {
        this.setState({ sports: apiRes.data.sports });
      })
      .catch(apiErr => console.error(apiErr));
  }
  render() {
    return (
      <div className="toute">
        <p className="createevent">Update an event</p>

        <form className="form" onSubmit={this.handleSubmit}>
          <div className="all">
            <div className="nameinput">
              <label className="label" htmlFor="sport">
                Sport
              </label>
              <select
                id="sport"
                value={this.state.sport._id}
                onChange={this.handleChange}
              >
                <option value="" disabled>
                  Select a sport
                </option>
                {this.state.sports.map((sport, i) => {
                  return (
                    <option value={sport._id} key={i}>
                      {sport.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="nameinput">
              <label className="label" htmlFor="name">
                Name
              </label>
              <input
                onChange={this.handleChange}
                className="input"
                id="name"
                type="text"
                defaultValue={this.state.name}
                required
              />
            </div>

            <div className="nameinput">
            <label className="label" htmlFor="date">
              Date
            </label>
            <DayPickerInput
              onDayChange={this.handleDayChange}
              className="input"
              id="date"
              value={moment(this.state.date).format("MMMM Do YYYY")}
            />
          </div>

            <div className="nameinput">
              <label className="label" htmlFor="time">
                Time
              </label>
              <input
                onChange={this.handleChange}
                className="input"
                id="time"
                type="time"
                defaultValue={this.state.time}
                placeholder="00:00"
              />
            </div>

            <div className="nameinput">
              <label className="label" htmlFor="maxParticipants">
                Maximum number of participants
              </label>
              <input
                onChange={this.handleChange}
                className="input"
                id="maxParticipants"
                type="text"
                defaultValue={this.state.maxParticipants}
                required
              />
            </div>
            <div className="nameinput">
              <label className="label" htmlFor="description">
                Description
              </label>
              <input
                onChange={this.handleChange}
                className="input"
                id="description"
                type="text"
                defaultValue={this.state.description}
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
                onSelect={this.handleAddressChange}
                placeholder="Localisation"
                initialValue={this.state.localisation}
                autocompletionRequest={{
                  componentRestrictions: {
                    country: ["fr"]
                  }
                }}
              />
            </div>

            <div className="nameinput">
              <button className="btn" disabled={this.state.isRequesting}>
                {" "}
                Edit Event
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
