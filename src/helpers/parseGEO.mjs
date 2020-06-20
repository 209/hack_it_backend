import ProcessClass from '../vendor/PullentiJavascript/process.js';
import MorphLang from "../vendor/PullentiJavascript/pullenti/morph/MorphLang.js";

export default text => {
  const entities = ProcessClass.process(text);
  const additional = {
    GEO: [],
    STREET: [],
    ADDRESS: [],
  };
  for (const e of entities) {
    additional[e.type_name].push({
      value: e.to_string(false, MorphLang.RU, 0),
      shortValue: e.to_string(true, MorphLang.RU, 0) || '',
    });
  }

  return additional;
}
