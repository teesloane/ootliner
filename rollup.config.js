import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/main.js",
  output: {
    file: "lib/index.js",
    format: "iife",
    name: "ootliner"
  },
  output: [
    {
      file: "lib/index.js",
      format: "iife",
      name: "ootliner"
    },
    {
      file: "lib/index.umd.js",
      format: "umd",
      name: "ootliner"
    },
    {
      file: "lib/index.es.js",
      format: "es",
      name: "ootliner"
    }
  ],
  plugins: [postcss({ extensions: [".css"] }), commonjs(), resolve()]
};
