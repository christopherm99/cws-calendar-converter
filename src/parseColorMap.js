import flow from "lodash/fp/flow";
import map from "lodash/fp/map";
import uniqBy from "lodash/fp/uniqBy";
import keyBy from "lodash/fp/keyBy";
import mapValues from "lodash/fp/mapValues";

import colors from "vuetify/lib/util/colors";
let colorOpts = Object.values(colors);

export default classes =>
  flow(
    uniqBy("class"),
    map.convert({ cap: false })((item, i) => ({
      name: item.class,
      color: colorOpts[i]
    })),
    keyBy("name"),
    mapValues("color")
  )(classes);
