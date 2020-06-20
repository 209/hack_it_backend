/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const StringBuilder = require("./../unisharp/StringBuilder");

/**
 * Результат анализа
 */
class AnalysisResult {
    
    constructor() {
        this.m_sofas = new Array();
        this.m_entities = new Array();
        this.first_token = null;
        this.ontology = null;
        this.base_language = null;
        this.m_log = new Array();
        this.exceptions = new Array();
        this.is_timeout_breaked = false;
    }
    
    /**
     * [Get] Входные анализируемые тексты
     */
    get sofas() {
        return this.m_sofas;
    }
    
    /**
     * [Get] Выделенные сущности
     */
    get entities() {
        return this.m_entities;
    }
    
    /**
     * [Get] Это некоторые информационные сообщения
     */
    get log() {
        return this.m_log;
    }
    
    add_exception(ex) {
        let str = ex.toString();
        for (const e of this.exceptions) {
            if (e.toString() === str) 
                return;
        }
        this.exceptions.push(ex);
    }
    
    toString() {
        let res = new StringBuilder();
        let len = 0;
        for (const s of this.sofas) {
            len += s.text.length;
        }
        res.append("Общая длина ").append(len).append(" знаков");
        if (this.sofas.length > 1) 
            res.append(" в ").append(this.sofas.length).append(" текстах");
        if (this.base_language !== null) 
            res.append(", базовый язык ").append(this.base_language.toString());
        res.append(", найдено ").append(this.entities.length).append(" сущностей");
        if (this.is_timeout_breaked) 
            res.append(", прервано по таймауту");
        return res.toString();
    }
}


module.exports = AnalysisResult