/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../pullenti/unisharp/Utils");
const Stopwatch = require("./../pullenti/unisharp/Stopwatch");

const MorphGender = require("./../pullenti/morph/MorphGender");
const NounPhraseHelper = require("./../pullenti/ner/core/NounPhraseHelper");
const KeywordReferent = require("./../pullenti/ner/keyword/KeywordReferent");
const GetTextAttr = require("./../pullenti/ner/core/GetTextAttr");
const ReferentToken = require("./../pullenti/ner/ReferentToken");
const MetaToken = require("./../pullenti/ner/MetaToken");
const MorphLang = require("./../pullenti/morph/MorphLang");
const NounPhraseParseAttr = require("./../pullenti/ner/core/NounPhraseParseAttr");
const ProcessorService = require("./../pullenti/ner/ProcessorService");
const SourceOfAnalysis = require("./../pullenti/ner/SourceOfAnalysis");
const MiscHelper = require("./../pullenti/ner/core/MiscHelper");
const KeywordAnalyzer = require("./../pullenti/ner/keyword/KeywordAnalyzer");
const Sdk = require("./../pullenti/ner/Sdk");

const GeoAnalyzer = require("./../pullenti/ner/geo/GeoAnalyzer");
const AddressAnalyzer = require("./../pullenti/ner/address/AddressAnalyzer");

class Program {

    static main(args) {
        let sw = new Stopwatch();
        // инициализация - необходимо проводить один раз до обработки текстов
        process.stdout.write("Initializing ... ");
        // инициализируются движок и все имеющиеся анализаторы
        ProcessorService.initialize(MorphLang.ooBitor(MorphLang.RU, MorphLang.EN));
        GeoAnalyzer.initialize();
        AddressAnalyzer.initialize();
        // Sdk.initialize(MorphLang.ooBitor(MorphLang.RU, MorphLang.EN));
        sw.stop();
        process.stdout.write("OK (by " + (sw.elapsedMilliseconds) + " ms), version " + ProcessorService.get_version() + "\r\n");
        // анализируемый текст
        let txt = "Забрали! https://vk.com/aisiy #спб_фш_хлеб Хлеб от пекарни #ПудХлеба# Санкт-Петербург Метро Удельная, ул. Гаврская Для одного спасателя один набор ( батон и три маленьких кирпичика) Правило недели соблюдаем. Забирать сегодня до 00.30 Запись под постом, точный адрес дам в личку.";
        process.stdout.write("Text: " + txt + "\r\n");
        // запускаем обработку на пустом процессоре (без анализаторов NER)
        let are = ProcessorService.get_empty_processor().process(new SourceOfAnalysis(txt), null, null);
        process.stdout.write("Noun groups: ");
        // перебираем токены
        for (let t = are.first_token; t !== null; t = t.next) {
            // выделяем именную группу с текущего токена
            let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            // не получилось
            if (npt === null)
                continue;
            // получилось, выводим в нормализованном виде
            process.stdout.write("[" + npt.get_source_text() + "=>" + npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false) + "] ");
            // указатель на последний токен именной группы
            t = npt.end_token;
        }
        let proc = null;
        proc = ProcessorService.create_processor();
        try {
            // анализируем текст
            let ar = proc.process(new SourceOfAnalysis(txt), null, null);
            // результирующие сущности
            process.stdout.write("\r\n==========================================\r\nEntities: " + "\r\n");
            for (const e of ar.entities) {
                process.stdout.write(e.type_name + ": " + e.toString() + "\r\n");
                for (const s of e.slots) {
                    process.stdout.write("   " + s.type_name + ": " + s.value + "\r\n");
                }
            }
            // пример выделения именных групп
            process.stdout.write("\r\n==========================================\r\nNoun groups: " + "\r\n");
            for (let t = ar.first_token; t !== null; t = t.next) {
                // токены с сущностями игнорируем
                if (t.get_referent() !== null)
                    continue;
                // пробуем создать именную группу
                let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.ADJECTIVECANBELAST, 0, null);
                // не получилось
                if (npt === null)
                    continue;
                process.stdout.write(String(npt) + "\r\n");
                // указатель перемещаем на последний токен группы
                t = npt.end_token;
            }
        }
        finally {
            proc.close();
        }
        proc = ProcessorService.create_specific_processor(KeywordAnalyzer.ANALYZER_NAME);
        try {
            let ar = proc.process(new SourceOfAnalysis(txt), null, null);
            process.stdout.write("\r\n==========================================\r\nKeywords1: " + "\r\n");
            for (const e of ar.entities) {
                if (e instanceof KeywordReferent)
                    process.stdout.write(String(e) + "\r\n");
            }
            process.stdout.write("\r\n==========================================\r\nKeywords2: " + "\r\n");
            for (let t = ar.first_token; t !== null; t = t.next) {
                if (t instanceof ReferentToken) {
                    let kw = Utils.as(t.get_referent(), KeywordReferent);
                    if (kw === null)
                        continue;
                    let kwstr = MiscHelper.get_text_value_of_meta_token(Utils.as(t, ReferentToken), GetTextAttr.of((GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE.value()) | (GetTextAttr.KEEPREGISTER.value())));
                    process.stdout.write(kwstr + " = " + kw + "\r\n");
                }
            }
        }
        finally {
            proc.close();
        }
        process.stdout.write("Over!" + "\r\n");
    }
}


module.exports = Program
