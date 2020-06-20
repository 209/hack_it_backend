/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const StringBuilder = require("./../unisharp/StringBuilder");

const MorphNumber = require("./../morph/MorphNumber");
const DerivateGroup = require("./utils/DerivateGroup");
const SemLinkType = require("./SemLinkType");
const MorphWordForm = require("./../morph/MorphWordForm");
const SemObjectType = require("./SemObjectType");
const MeasureKind = require("./../ner/measure/MeasureKind");

/**
 * Семантический объект
 */
class SemObject {
    
    constructor(_graph) {
        this.graph = null;
        this.morph = new MorphWordForm();
        this.typ = SemObjectType.UNDEFINED;
        this.quantity = null;
        this.concept = null;
        this.attrs = new Array();
        this.measure = MeasureKind.UNDEFINED;
        this.not = false;
        this.tokens = new Array();
        this.links_from = new Array();
        this.links_to = new Array();
        this.tag = null;
        this.graph = _graph;
    }
    
    /**
     * [Get] Начальная позиция первого токена
     */
    get begin_char() {
        return (this.tokens.length > 0 ? this.tokens[0].begin_char : 0);
    }
    
    /**
     * [Get] Последняя позиция последнего токена
     */
    get end_char() {
        return (this.tokens.length > 0 ? this.tokens[this.tokens.length - 1].end_char : 0);
    }
    
    toString() {
        let res = new StringBuilder();
        if (this.not) 
            res.append("НЕ ");
        for (const a of this.attrs) {
            res.append(a.toString().toLowerCase()).append(" ");
        }
        if (this.quantity !== null) 
            res.append(this.quantity).append(" ");
        else if (this.morph.number === MorphNumber.PLURAL && this.typ === SemObjectType.NOUN) 
            res.append("* ");
        res.append((this.morph.normal_case != null ? this.morph.normal_case : "?"));
        return res.toString();
    }
    
    compareTo(other) {
        if (this.tokens.length === 0 || other.tokens.length === 0) 
            return 0;
        if (this.tokens[0].begin_char < other.tokens[0].begin_char) 
            return -1;
        if (this.tokens[0].begin_char > other.tokens[0].begin_char) 
            return 1;
        if (this.tokens[this.tokens.length - 1].end_char < other.tokens[other.tokens.length - 1].end_char) 
            return -1;
        if (this.tokens[this.tokens.length - 1].end_char > other.tokens[other.tokens.length - 1].end_char) 
            return 1;
        return 0;
    }
    
    /**
     * Проверка значения
     * @param word 
     * @param _typ 
     * @return 
     */
    is_value(word, _typ = SemObjectType.UNDEFINED) {
        if (_typ !== SemObjectType.UNDEFINED) {
            if (_typ !== this.typ) 
                return false;
        }
        if (this.morph.normal_full === word || this.morph.normal_case === word) 
            return true;
        let gr = Utils.as(this.concept, DerivateGroup);
        if (gr !== null) {
            if (gr.words[0].spelling === word) 
                return true;
        }
        return false;
    }
    
    /**
     * Найти объект, кторый связан с текущим исходящий связью (Source = this)
     * @param word 
     * @param _typ 
     * @param otyp 
     * @return 
     */
    find_from_object(word, _typ = SemLinkType.UNDEFINED, otyp = SemObjectType.UNDEFINED) {
        for (const li of this.links_from) {
            if (_typ !== SemLinkType.UNDEFINED && _typ !== li.typ) 
                continue;
            if (li.target.is_value(word, otyp)) 
                return li.target;
        }
        return null;
    }
    
    /**
     * Найти атрибут указанного типа
     * @param _typ 
     * @return 
     */
    find_attr(_typ) {
        for (const a of this.attrs) {
            if (a.typ === _typ) 
                return a;
        }
        return null;
    }
    
    static _new2927(_arg1, _arg2) {
        let res = new SemObject(_arg1);
        res.typ = _arg2;
        return res;
    }
}


module.exports = SemObject