/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const Termin = require("./../../core/Termin");
const PersonAttrTerminType2 = require("./PersonAttrTerminType2");
const PersonAttrTerminType = require("./PersonAttrTerminType");

class PersonAttrTermin extends Termin {
    
    constructor(v, _lang = null) {
        super(null, _lang, false);
        this.typ = PersonAttrTerminType.OTHER;
        this.typ2 = PersonAttrTerminType2.UNDEFINED;
        this.can_be_unique_identifier = false;
        this.can_has_person_after = 0;
        this.can_be_same_surname = false;
        this.can_be_independant = false;
        this.is_boss = false;
        this.is_kin = false;
        this.is_military_rank = false;
        this.is_nation = false;
        this.is_doubt = false;
        this.init_by_normal_text(v, _lang);
    }
    
    static _new2388(_arg1, _arg2) {
        let res = new PersonAttrTermin(_arg1);
        res.typ = _arg2;
        return res;
    }
    
    static _new2389(_arg1, _arg2, _arg3) {
        let res = new PersonAttrTermin(_arg1, _arg2);
        res.typ = _arg3;
        return res;
    }
    
    static _new2390(_arg1, _arg2, _arg3) {
        let res = new PersonAttrTermin(_arg1);
        res.typ = _arg2;
        res.gender = _arg3;
        return res;
    }
    
    static _new2391(_arg1, _arg2, _arg3, _arg4) {
        let res = new PersonAttrTermin(_arg1, _arg2);
        res.typ = _arg3;
        res.gender = _arg4;
        return res;
    }
    
    static _new2399(_arg1, _arg2, _arg3, _arg4) {
        let res = new PersonAttrTermin(_arg1);
        res.canonic_text = _arg2;
        res.typ2 = _arg3;
        res.typ = _arg4;
        return res;
    }
    
    static _new2400(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new PersonAttrTermin(_arg1, _arg2);
        res.canonic_text = _arg3;
        res.typ2 = _arg4;
        res.typ = _arg5;
        return res;
    }
    
    static _new2405(_arg1, _arg2, _arg3) {
        let res = new PersonAttrTermin(_arg1);
        res.typ2 = _arg2;
        res.typ = _arg3;
        return res;
    }
    
    static _new2406(_arg1, _arg2, _arg3, _arg4) {
        let res = new PersonAttrTermin(_arg1, _arg2);
        res.typ2 = _arg3;
        res.typ = _arg4;
        return res;
    }
    
    static _new2425(_arg1, _arg2, _arg3, _arg4) {
        let res = new PersonAttrTermin(_arg1);
        res.canonic_text = _arg2;
        res.typ = _arg3;
        res.typ2 = _arg4;
        return res;
    }
    
    static _new2427(_arg1, _arg2, _arg3, _arg4) {
        let res = new PersonAttrTermin(_arg1);
        res.typ2 = _arg2;
        res.typ = _arg3;
        res.lang = _arg4;
        return res;
    }
    
    static _new2432(_arg1, _arg2, _arg3) {
        let res = new PersonAttrTermin(_arg1);
        res.typ = _arg2;
        res.lang = _arg3;
        return res;
    }
}


module.exports = PersonAttrTermin