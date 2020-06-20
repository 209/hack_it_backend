/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const MorphNumber = require("./../../morph/MorphNumber");
const MorphGender = require("./../../morph/MorphGender");
const SemObjectType = require("./../SemObjectType");
const SemLinkType = require("./../SemLinkType");

class AnaforHelper {
    
    static process_anafors(objs) {
        for (let i = objs.length - 1; i >= 0; i--) {
            let it = objs[i];
            if (it.typ === SemObjectType.PERSONALPRONOUN) {
            }
            else if (it.morph.normal_full === "КОТОРЫЙ" && it.links_from.length === 0) {
            }
            else 
                continue;
            let vars = new Array();
            for (let j = i - 1; j >= 0; j--) {
                let a = AnaforHelper.AnaforLink.try_create(it, objs[j]);
                if (a === null) 
                    continue;
                vars.push(a);
                a.correct();
            }
            if (vars.length < 1) 
                continue;
            AnaforHelper.AnaforLink.sort(vars);
            if (vars[0].coef <= 0.1) 
                continue;
            if (vars[0].target_list !== null) {
                for (const tgt of vars[0].target_list) {
                    it.graph.add_link(SemLinkType.ANAFOR, it, tgt, null, false, null);
                }
            }
            else {
                let li = it.graph.add_link(SemLinkType.ANAFOR, it, vars[0].target, null, false, null);
                if (vars.length > 1 && vars[0].coef <= (vars[1].coef * (2)) && vars[1].target_list === null) {
                    let li1 = it.graph.add_link(SemLinkType.ANAFOR, it, vars[1].target, null, false, null);
                    li1.alt_link = li;
                    li.alt_link = li1;
                }
            }
        }
        return false;
    }
}


AnaforHelper.AnaforLink = class  {
    
    constructor() {
        this.coef = 0;
        this.target = null;
        this.target_list = null;
    }
    
    toString() {
        if (this.target_list === null) 
            return (String(this.coef) + ": " + this.target);
        let tmp = new StringBuilder();
        tmp.append(this.coef).append(": ");
        for (const v of this.target_list) {
            tmp.append(v).append("; ");
        }
        return tmp.toString();
    }
    
    static try_create(src, tgt) {
        const MorphGender = require("./../../morph/MorphGender");
        const MorphNumber = require("./../../morph/MorphNumber");
        const SemObjectType = require("./../SemObjectType");
        if (tgt.typ !== SemObjectType.NOUN) 
            return null;
        if ((((src.morph.number.value()) & (MorphNumber.PLURAL.value()))) === (MorphNumber.PLURAL.value())) {
            if ((((tgt.morph.number.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) 
                return AnaforHelper.AnaforLink._new2893(1, tgt);
            let res = AnaforHelper.AnaforLink._new2893(0.5, tgt);
            res.target_list = new Array();
            for (const li of tgt.links_to) {
                let frm = li.source;
                for (let i = 0; i < frm.links_from.length; i++) {
                    res.target_list.splice(0, res.target_list.length);
                    let li0 = frm.links_from[i];
                    if (li0.target.typ !== SemObjectType.NOUN) 
                        continue;
                    res.target_list.push(li0.target);
                    for (let j = i + 1; j < frm.links_from.length; j++) {
                        let li1 = frm.links_from[j];
                        if (li1.typ === li0.typ && li1.preposition === li0.preposition && li1.target.typ === li0.target.typ) 
                            res.target_list.push(li1.target);
                    }
                    if (res.target_list.length > 1) 
                        return res;
                }
            }
            return null;
        }
        if (tgt.morph.number !== MorphNumber.UNDEFINED && (((tgt.morph.number.value()) & (MorphNumber.SINGULAR.value()))) === (MorphNumber.UNDEFINED.value())) 
            return null;
        if (tgt.morph.gender !== MorphGender.UNDEFINED) {
            if ((((tgt.morph.gender.value()) & (src.morph.gender.value()))) === (MorphGender.UNDEFINED.value())) 
                return null;
            return AnaforHelper.AnaforLink._new2893(1, tgt);
        }
        return AnaforHelper.AnaforLink._new2893(0.1, tgt);
    }
    
    static sort(li) {
        for (let i = 0; i < li.length; i++) {
            let ch = false;
            for (let j = 0; j < (li.length - 1); j++) {
                if (li[j].compareTo(li[j + 1]) > 0) {
                    let a = li[j];
                    li[j] = li[j + 1];
                    li[j + 1] = a;
                    ch = true;
                }
            }
            if (!ch) 
                break;
        }
    }
    
    correct() {
        const SemLinkType = require("./../SemLinkType");
        for (const li of this.target.links_to) {
            if (li.typ === SemLinkType.NAMING) 
                this.coef = 0;
            else if (li.typ === SemLinkType.AGENT) 
                this.coef *= (2);
            else if (li.typ === SemLinkType.PACIENT) {
                if (li.alt_link === null) 
                    this.coef *= (2);
            }
            else if (!Utils.isNullOrEmpty(li.preposition)) 
                this.coef /= (2);
        }
    }
    
    compareTo(other) {
        if (this.coef > other.coef) 
            return -1;
        if (this.coef < other.coef) 
            return 1;
        return 0;
    }
    
    static _new2893(_arg1, _arg2) {
        let res = new AnaforHelper.AnaforLink();
        res.coef = _arg1;
        res.target = _arg2;
        return res;
    }
}


module.exports = AnaforHelper