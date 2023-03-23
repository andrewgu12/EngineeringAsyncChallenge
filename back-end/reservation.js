"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
exports.routes = (0, express_1.Router)();
const reservationStorage = {};
exports.routes.get('/', (req, res) => {
    var _a;
    const user = req.query.user;
    console.log({ user });
    if (!user)
        res.status(500).send('Please include an username to see the reservations');
    const reservations = (_a = reservationStorage[user]) !== null && _a !== void 0 ? _a : [];
    res.send(reservations);
});
exports.routes.post('/', (req, res) => {
    var _a;
    const { user, event, startTime, endTime } = req.body;
    // step 1: make sure all fields are filled out
    if (!user || !event || !startTime || !endTime)
        res.status(500).send('Please include all the required fields in the body - user, event, startTime, endTime');
    // step 2: make sure the event hasn't already passed
    const today = new Date();
    const startTimeDate = new Date(startTime);
    const endTimeDate = new Date(endTime);
    if (today >= startTimeDate) {
        return res.status(500).send('The event has already passed');
    }
    ;
    // step 3: make sure the event doesn't overlap with the existing events
    const existingReservations = (_a = reservationStorage[user]) !== null && _a !== void 0 ? _a : [];
    const anyOverlap = existingReservations.some((resy) => {
        const doesStartTimeOverlap = startTimeDate > resy.startTime && startTimeDate < resy.endTime;
        const doesEndTimeOverlap = endTimeDate > resy.startTime && endTimeDate < resy.endTime;
        return doesStartTimeOverlap || doesEndTimeOverlap;
    });
    if (anyOverlap)
        return res.status(500).send('The event overlaps with one of the existing events');
    const newEvent = {
        event,
        startTime: startTimeDate,
        endTime: endTimeDate
    };
    if (reservationStorage[user]) {
        reservationStorage[user].push(newEvent);
    }
    else {
        reservationStorage[user] = [newEvent];
    }
    return res.status(200).send('Successfully added');
});