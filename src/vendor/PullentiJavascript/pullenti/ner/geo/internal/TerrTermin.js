/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const Termin = require("./../../core/Termin");

class TerrTermin extends Termin {
    
    constructor(source, _lang = null) {
        super(null, _lang, false);
        this.is_state = false;
        this.is_region = false;
        this.is_adjective = false;
        this.is_always_prefix = false;
        this.is_doubt = false;
        this.is_moscow_region = false;
        this.is_strong = false;
        this.is_specific_prefix = false;
        this.is_sovet = false;
        this.init_by_normal_text(source, _lang);
    }
    
    static _new1191(_arg1, _arg2) {
        let res = new TerrTermin(_arg1);
        res.is_state = _arg2;
        return res;
    }
    
    static _new1192(_arg1, _arg2, _arg3) {
        let res = new TerrTermin(_arg1, _arg2);
        res.is_state = _arg3;
        return res;
    }
    
    static _new1193(_arg1, _arg2, _arg3) {
        let res = new TerrTermin(_arg1);
        res.is_state = _arg2;
        res.is_doubt = _arg3;
        return res;
    }
    
    static _new1194(_arg1, _arg2, _arg3, _arg4) {
        let res = new TerrTermin(_arg1, _arg2);
        res.is_state = _arg3;
        res.is_doubt = _arg4;
        return res;
    }
    
    static _new1197(_arg1, _arg2, _arg3) {
        let res = new TerrTermin(_arg1);
        res.is_state = _arg2;
        res.is_adjective = _arg3;
        return res;
    }
    
    static _new1198(_arg1, _arg2, _arg3, _arg4) {
        let res = new TerrTermin(_arg1, _arg2);
        res.is_state = _arg3;
        res.is_adjective = _arg4;
        return res;
    }
    
    static _new1199(_arg1, _arg2) {
        let res = new TerrTermin(_arg1);
        res.is_region = _arg2;
        return res;
    }
    
    static _new1202(_arg1, _arg2, _arg3) {
        let res = new TerrTermin(_arg1, _arg2);
        res.is_region = _arg3;
        return res;
    }
    
    static _new1203(_arg1, _arg2, _arg3) {
        let res = new TerrTermin(_arg1);
        res.is_region = _arg2;
        res.acronym = _arg3;
        return res;
    }
    
    static _new1204(_arg1, _arg2, _arg3, _arg4) {
        let res = new TerrTermin(_arg1, _arg2);
        res.is_region = _arg3;
        res.acronym = _arg4;
        return res;
    }
    
    static _new1210(_arg1, _arg2, _arg3) {
        let res = new TerrTermin(_arg1);
        res.is_region = _arg2;
        res.is_always_prefix = _arg3;
        return res;
    }
    
    static _new1214(_arg1, _arg2, _arg3, _arg4) {
        let res = new TerrTermin(_arg1, _arg2);
        res.is_region = _arg3;
        res.is_always_prefix = _arg4;
        return res;
    }
    
    static _new1223(_arg1, _arg2, _arg3) {
        let res = new TerrTermin(_arg1);
        res.is_region = _arg2;
        res.is_strong = _arg3;
        return res;
    }
    
    static _new1226(_arg1, _arg2, _arg3, _arg4) {
        let res = new TerrTermin(_arg1, _arg2);
        res.is_region = _arg3;
        res.is_strong = _arg4;
        return res;
    }
    
    static _new1229(_arg1, _arg2, _arg3) {
        let res = new TerrTermin(_arg1);
        res.canonic_text = _arg2;
        res.is_sovet = _arg3;
        return res;
    }
    
    static _new1232(_arg1, _arg2, _arg3) {
        let res = new TerrTermin(_arg1);
        res.is_region = _arg2;
        res.is_adjective = _arg3;
        return res;
    }
    
    static _new1233(_arg1, _arg2, _arg3, _arg4) {
        let res = new TerrTermin(_arg1, _arg2);
        res.is_region = _arg3;
        res.is_adjective = _arg4;
        return res;
    }
    
    static _new1234(_arg1, _arg2, _arg3, _arg4) {
        let res = new TerrTermin(_arg1);
        res.is_region = _arg2;
        res.is_specific_prefix = _arg3;
        res.is_always_prefix = _arg4;
        return res;
    }
    
    static _new1235(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new TerrTermin(_arg1, _arg2);
        res.is_region = _arg3;
        res.is_specific_prefix = _arg4;
        res.is_always_prefix = _arg5;
        return res;
    }
    
    static _new1236(_arg1, _arg2) {
        let res = new TerrTermin(_arg1);
        res.acronym = _arg2;
        return res;
    }
    
    static _new1237(_arg1, _arg2, _arg3) {
        let res = new TerrTermin(_arg1);
        res.acronym = _arg2;
        res.is_region = _arg3;
        return res;
    }
    
    static _new1239(_arg1, _arg2) {
        let res = new TerrTermin(_arg1);
        res.is_moscow_region = _arg2;
        return res;
    }
}


module.exports = TerrTermin