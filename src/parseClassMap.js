import flow from "lodash/fp/flow";
import map from "lodash/fp/map";
import set from "lodash/fp/set";
import groupBy from "lodash/fp/groupBy";
import mapValues from "lodash/fp/mapValues";

export default classes =>
  flow(
    map(
      flow(
        set("duration", 0),
        mapValues.convert({ cap: false })((val, key, obj) => {
          switch (key) {
            case "duration":
              return obj.end.diff(obj.begin, "minute");
            case "day":
              return obj.begin.date();
            case "begin":
              return { hour: val.hour(), minute: val.minute() };
            default:
              return val;
          }
        })
      )
    ),
    groupBy("day")
  )(classes);
