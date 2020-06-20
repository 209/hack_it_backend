/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");

const GetTextAttr = require("./../ner/core/GetTextAttr");
const MiscHelper = require("./../ner/core/MiscHelper");
const ISemContainer = require("./ISemContainer");
const SemGraph = require("./SemGraph");
const SemFragmentType = require("./SemFragmentType");
const SemObjectType = require("./SemObjectType");

/**
 * Фрагмент блока (предложения)
 */
class SemFragment extends ISemContainer {
    
    constructor(blk) {
        super();
        this.m_graph = new SemGraph();
        this.m_higher = null;
        this.typ = SemFragmentType.UNDEFINED;
        this.is_or = false;
        this.begin_token = null;
        this.end_token = null;
        this.tag = null;
        this.m_higher = blk;
    }
    
    /**
     * [Get] Объекты фрагмента (отметим, что часть объектов, связанных с этими, 
     *  могут находиться в графах вышележащих уровней).
     */
    get graph() {
        return this.m_graph;
    }
    
    get higher() {
        return this.m_higher;
    }
    
    get block() {
        return this.m_higher;
    }
    
    /**
     * [Get] Список объектов, в которые нет связей. При нормальном разборе 
     *  такой объект должен быть один - это обычно предикат
     */
    get root_objects() {
        let res = new Array();
        for (const o of this.m_graph.objects) {
            if (o.links_to.length === 0) 
                res.push(o);
        }
        return res;
    }
    
    get can_be_error_structure() {
        let cou = 0;
        let vcou = 0;
        for (const o of this.m_graph.objects) {
            if (o.links_to.length === 0) {
                if (o.typ === SemObjectType.VERB) 
                    vcou++;
                cou++;
            }
        }
        if (cou <= 1) 
            return false;
        return vcou < cou;
    }
    
    /**
     * [Get] Текст фрагмента (возможно, слегка подкорректированный)
     */
    get spelling() {
        return MiscHelper.get_text_value(this.begin_token, this.end_token, GetTextAttr.KEEPREGISTER);
    }
    
    get begin_char() {
        return (this.begin_token === null ? 0 : this.begin_token.begin_char);
    }
    
    get end_char() {
        return (this.end_token === null ? 0 : this.end_token.end_char);
    }
    
    toString() {
        if (this.typ !== SemFragmentType.UNDEFINED) 
            return (String(this.typ) + ": " + (Utils.notNull(this.spelling, "?")));
        else 
            return Utils.notNull(this.spelling, "?");
    }
}


module.exports = SemFragment