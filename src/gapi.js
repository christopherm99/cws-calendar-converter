import moment from "moment";
// TODO: Switch to webpack-ified official gapi or node-gapi
export function createCalendar(gapi, summary) {
  gapi.client.calendar.calendars
    .insert({
      summary,
      timeZone: "America/New_York"
    })
    .execute(res => {
      console.log(`Created calendar ${res}`);
    });
}
export function sendReq(gapi, events, calendarId) {
  events.forEach(event => {
    gapi.client.calendar.events.insert({
      calendarId,
      resource: {
        summary: event.class,
        description: event.teacher,
        start: {
          dateTime: event.begin.format(),
          timeZone: "America/New_York"
        },
        end: {
          dateTime: event.end.format(),
          timeZone: "America/New_York"
        },
        recurrence: [
          `RRULE:FREQ=WEEKLY;UNTIL=${moment("May 28 2020").format()}`
        ]
      }
    });
  });
}
