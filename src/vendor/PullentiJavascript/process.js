const Stopwatch = require("./pullenti/unisharp/Stopwatch");
const MorphLang = require("./pullenti/morph/MorphLang");
const ProcessorService = require("./pullenti/ner/ProcessorService");
const SourceOfAnalysis = require("./pullenti/ner/SourceOfAnalysis");
const GeoAnalyzer = require("./pullenti/ner/geo/GeoAnalyzer");
const AddressAnalyzer = require("./pullenti/ner/address/AddressAnalyzer");

class Program {
  static init() {
    let sw = new Stopwatch();
    // инициализируются движок и все имеющиеся анализаторы
    ProcessorService.initialize(MorphLang.ooBitor(MorphLang.RU, MorphLang.EN));
    GeoAnalyzer.initialize();
    AddressAnalyzer.initialize();
    sw.stop();
  }

  static process(txt) {
    let proc = ProcessorService.create_processor();
    try {
      // анализируем текст
      let ar = proc.process(new SourceOfAnalysis(txt), null, null);
      // результирующие сущности
      return ar.entities;
    } finally {
      proc.close();
    }

    return [];
  }
}


module.exports = Program
