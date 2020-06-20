/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const UnitsFactors = require("./UnitsFactors");
const MeasureKind = require("./../MeasureKind");

/**
 * Единица измерения (задаётся в "базе")
 */
class Unit {
    
    constructor(_name_cyr, _name_lat, fname_cyr, fname_lan) {
        this.name_cyr = null;
        this.name_lat = null;
        this.fullname_cyr = null;
        this.fullname_lat = null;
        this.kind = MeasureKind.UNDEFINED;
        this.base_unit = null;
        this.mult_unit = null;
        this.base_multiplier = 0;
        this.factor = UnitsFactors.NO;
        this.keywords = new Array();
        this.psevdo = new Array();
        this.name_cyr = _name_cyr;
        this.name_lat = _name_lat;
        this.fullname_cyr = fname_cyr;
        this.fullname_lat = fname_lan;
    }
    
    toString() {
        return this.name_cyr;
    }
    
    static _new1641(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new Unit(_arg1, _arg2, _arg3, _arg4);
        res.kind = _arg5;
        return res;
    }
    
    static _new1645(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new Unit(_arg1, _arg2, _arg3, _arg4);
        res.base_unit = _arg5;
        res.base_multiplier = _arg6;
        res.kind = _arg7;
        return res;
    }
    
    static _new1692(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new Unit(_arg1, _arg2, _arg3, _arg4);
        res.base_unit = _arg5;
        res.base_multiplier = _arg6;
        return res;
    }
    
    static _new1700(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new Unit(_arg1, _arg2, _arg3, _arg4);
        res.base_unit = _arg5;
        res.mult_unit = _arg6;
        return res;
    }
    
    static _new1727(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7, _arg8, _arg9) {
        let res = new Unit(_arg1, _arg2, _arg3, _arg4);
        res.factor = _arg5;
        res.base_multiplier = _arg6;
        res.base_unit = _arg7;
        res.kind = _arg8;
        res.keywords = _arg9;
        return res;
    }
}


module.exports = Unit