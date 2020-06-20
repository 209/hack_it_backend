/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Hashtable = require("./../../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../../unisharp/RefOutArgWrapper");

const SourceOfAnalysis = require("./../../SourceOfAnalysis");
const TextToken = require("./../../TextToken");
const MorphGender = require("./../../../morph/MorphGender");
const AnalysisKit = require("./../../core/AnalysisKit");
const EpNerPersonInternalResourceHelper = require("./EpNerPersonInternalResourceHelper");

class ShortNameHelper {
    
    static get_shortnames_for_name(name) {
        let res = new Array();
        for (const kp of ShortNameHelper.m_shorts_names.entries) {
            for (const v of kp.value) {
                if (v.name === name) {
                    if (!res.includes(kp.key)) 
                        res.push(kp.key);
                }
            }
        }
        return res;
    }
    
    static get_names_for_shortname(shortname) {
        let res = [ ];
        let wrapres2584 = new RefOutArgWrapper();
        let inoutres2585 = ShortNameHelper.m_shorts_names.tryGetValue(shortname, wrapres2584);
        res = wrapres2584.value;
        if (!inoutres2585) 
            return null;
        else 
            return res;
    }
    
    static initialize() {
        if (ShortNameHelper.m_inited) 
            return;
        ShortNameHelper.m_inited = true;
        let obj = EpNerPersonInternalResourceHelper.get_string("ShortNames.txt");
        if (obj !== null) {
            let kit = new AnalysisKit(new SourceOfAnalysis(obj));
            for (let t = kit.first_token; t !== null; t = t.next) {
                if (t.is_newline_before) {
                    let g = (t.is_value("F", null) ? MorphGender.FEMINIE : MorphGender.MASCULINE);
                    t = t.next;
                    let nam = (t).term;
                    let shos = new Array();
                    for (t = t.next; t !== null; t = t.next) {
                        if (t.is_newline_before) 
                            break;
                        else 
                            shos.push((t).term);
                    }
                    for (const s of shos) {
                        let li = null;
                        let wrapli2587 = new RefOutArgWrapper();
                        let inoutres2588 = ShortNameHelper.m_shorts_names.tryGetValue(s, wrapli2587);
                        li = wrapli2587.value;
                        if (!inoutres2588) 
                            ShortNameHelper.m_shorts_names.put(s, (li = new Array()));
                        li.push(ShortNameHelper.ShortnameVar._new2586(nam, g));
                    }
                    if (t === null) 
                        break;
                    t = t.previous;
                }
            }
        }
    }
    
    static static_constructor() {
        ShortNameHelper.m_shorts_names = new Hashtable();
        ShortNameHelper.m_inited = false;
    }
}


ShortNameHelper.ShortnameVar = class  {
    
    constructor() {
        this.name = null;
        this.gender = MorphGender.UNDEFINED;
    }
    
    toString() {
        return this.name;
    }
    
    static _new2586(_arg1, _arg2) {
        let res = new ShortNameHelper.ShortnameVar();
        res.name = _arg1;
        res.gender = _arg2;
        return res;
    }
}


ShortNameHelper.static_constructor();

module.exports = ShortNameHelper