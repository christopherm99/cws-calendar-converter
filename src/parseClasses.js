import flow from "lodash/fp/flow";
import filter from "lodash/fp/filter";
import chunk from "lodash/fp/chunk";
import map from "lodash/fp/map";
import sortBy from "lodash/fp/sortBy";
import merge from "lodash/fp/merge";
import omit from "lodash/fp/omit";
import update from "lodash/fp/update";
import split from "lodash/fp/split";

import moment from "moment";

export default contents =>
  flow(
    filter(["height", 9]),
    filter(
      item =>
        item.fontName ===
        contents.filter(
          item => /^[0-9]{3}-[0-9]{2}$/.test(item.str) // Regex finds all course numbers
        )[0].fontName // Ensure fonts match
    ),
    filter(
      item =>
        !item.str.includes("Recess") && // Ignore all periods which are not classes (Includes Jobs)
        !item.str.includes("Lunch") &&
        !item.str.includes("Meeting") &&
        !item.str.includes("Assembly") &&
        !item.str.includes("Sports")
    ),
    chunk(2),
    map(val => ({
      class: val[0].str,
      day: Math.floor(val[0].transform[4] / 100),
      teacher: val[1].str,
      period: flow(
        split("-"),
        map(item => item.split(":")),
        chunk(2),
        map(item => ({ begin: item[0], end: item[1] }))
      )(
        flow(
          filter(item => item.height === 8),
          sortBy(item =>
            Math.hypot(
              val[1].transform[4] - item.transform[4],
              val[1].transform[5] - item.transform[5]
            )
          )
        )(contents)[0].str
      )[0]
    })),
    map(event =>
      flow(
        merge(event.period),
        update("begin", old =>
          old[0] < 8 || old[0] === "12"
            ? old.join(":") + "PM"
            : old.join(":") + "AM"
        ),
        update("end", old =>
          old[0] < 8 || old[0] === "12"
            ? old.join(":") + "PM"
            : old.join(":") + "AM"
        ),
        update("begin", old =>
          moment("1970-01-01 " + old, "YYYY-MM-DD hh:mm a").day(event.day + 1)
        ),
        update("end", old =>
          moment("1970-01-01 " + old, "YYYY-MM-DD hh:mm a").day(event.day + 1)
        ),
        omit("period")
      )(event)
    ),
    sortBy(["day", "begin"])
  )(contents);
