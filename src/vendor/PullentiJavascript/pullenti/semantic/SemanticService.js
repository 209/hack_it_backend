/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const MoneyAnalyzer = require("./../ner/money/MoneyAnalyzer");
const SemProcessParams = require("./SemProcessParams");
const AlgoParams = require("./internal/AlgoParams");
const DelimToken = require("./internal/DelimToken");
const AdverbToken = require("./internal/AdverbToken");
const MeasureAnalyzer = require("./../ner/measure/MeasureAnalyzer");

/**
 * Сервис семантического анализа
 */
class SemanticService {
    
    /**
     * Необходимо вызывать в самом начале и только один раз  
     *  (после инициализации ProcessorService)
     */
    static initialize() {
        if (SemanticService.m_inited) 
            return;
        SemanticService.m_inited = true;
        DelimToken.initialize();
        AdverbToken.initialize();
        MeasureAnalyzer.initialize();
        MoneyAnalyzer.initialize();
    }
    
    /**
     * Сделать семантический анализ поверх результатов морфологического анализа и NEER
     * @param ar результат обработки Processor
     * @param pars дополнительные параметры
     * @return результат анализа текста
     */
    static process(ar, pars = null) {
        const AnalyzeHelper = require("./internal/AnalyzeHelper");
        return AnalyzeHelper.process(ar, (pars != null ? pars : new SemProcessParams()));
    }
    
    static static_constructor() {
        SemanticService.VERSION = "0.2";
        SemanticService.m_inited = false;
        SemanticService.PARAMS = new AlgoParams();
    }
}


SemanticService.static_constructor();

module.exports = SemanticService