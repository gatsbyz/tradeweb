/* eslint no-process-env: "off" */

import { Config } from "@/config";
import pjson from "../package.json";

const load = (): Config => {
  const config = {
    port: 9000,
    version: pjson.version,
    name: pjson.name.replace(/^@[\d-AZa-z-]+\//g, ""),
  };

  return new Config(config);
};

export default { load };
