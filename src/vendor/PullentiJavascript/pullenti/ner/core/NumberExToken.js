/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");

const NumberToken = require("./../NumberToken");
const NumberExType = require("./NumberExType");

/**
 * Число с стандартный постфиксом (мерой длины, вес, деньги и т.п.)
 */
class NumberExToken extends NumberToken {
    
    constructor(begin, end, val, _typ, _ex_typ = NumberExType.UNDEFINED) {
        super(begin, end, val, _typ, null);
        this.alt_real_value = 0;
        this.alt_rest_money = 0;
        this.ex_typ = NumberExType.UNDEFINED;
        this.ex_typ2 = NumberExType.UNDEFINED;
        this.ex_typ_param = null;
        this.mult_after = false;
        this.ex_typ = _ex_typ;
    }
    
    normalize_value(ty) {
        let val = this.real_value;
        let ety = this.ex_typ;
        if (ty.value === ety) 
            return val;
        if (this.ex_typ2 !== NumberExType.UNDEFINED) 
            return val;
        if (ty.value === NumberExType.GRAMM) {
            if (this.ex_typ === NumberExType.KILOGRAM) {
                val *= (1000);
                ety = ty.value;
            }
            else if (this.ex_typ === NumberExType.MILLIGRAM) {
                val /= (1000);
                ety = ty.value;
            }
            else if (this.ex_typ === NumberExType.TONNA) {
                val *= (1000000);
                ety = ty.value;
            }
        }
        else if (ty.value === NumberExType.KILOGRAM) {
            if (this.ex_typ === NumberExType.GRAMM) {
                val /= (1000);
                ety = ty.value;
            }
            else if (this.ex_typ === NumberExType.TONNA) {
                val *= (1000);
                ety = ty.value;
            }
        }
        else if (ty.value === NumberExType.TONNA) {
            if (this.ex_typ === NumberExType.KILOGRAM) {
                val /= (1000);
                ety = ty.value;
            }
            else if (this.ex_typ === NumberExType.GRAMM) {
                val /= (1000000);
                ety = ty.value;
            }
        }
        else if (ty.value === NumberExType.MILLIMETER) {
            if (this.ex_typ === NumberExType.SANTIMETER) {
                val *= (10);
                ety = ty.value;
            }
            else if (this.ex_typ === NumberExType.METER) {
                val *= (1000);
                ety = ty.value;
            }
        }
        else if (ty.value === NumberExType.SANTIMETER) {
            if (this.ex_typ === NumberExType.MILLIMETER) {
                val *= (10);
                ety = ty.value;
            }
            else if (this.ex_typ === NumberExType.METER) {
                val *= (100);
                ety = ty.value;
            }
        }
        else if (ty.value === NumberExType.METER) {
            if (this.ex_typ === NumberExType.KILOMETER) {
                val *= (1000);
                ety = ty.value;
            }
        }
        else if (ty.value === NumberExType.LITR) {
            if (this.ex_typ === NumberExType.MILLILITR) {
                val /= (1000);
                ety = ty.value;
            }
        }
        else if (ty.value === NumberExType.MILLILITR) {
            if (this.ex_typ === NumberExType.LITR) {
                val *= (1000);
                ety = ty.value;
            }
        }
        else if (ty.value === NumberExType.GEKTAR) {
            if (this.ex_typ === NumberExType.METER2) {
                val /= (10000);
                ety = ty.value;
            }
            else if (this.ex_typ === NumberExType.AR) {
                val /= (100);
                ety = ty.value;
            }
            else if (this.ex_typ === NumberExType.KILOMETER2) {
                val *= (100);
                ety = ty.value;
            }
        }
        else if (ty.value === NumberExType.KILOMETER2) {
            if (this.ex_typ === NumberExType.GEKTAR) {
                val /= (100);
                ety = ty.value;
            }
            else if (this.ex_typ === NumberExType.AR) {
                val /= (10000);
                ety = ty.value;
            }
            else if (this.ex_typ === NumberExType.METER2) {
                val /= (1000000);
                ety = ty.value;
            }
        }
        else if (ty.value === NumberExType.METER2) {
            if (this.ex_typ === NumberExType.AR) {
                val *= (100);
                ety = ty.value;
            }
            else if (this.ex_typ === NumberExType.GEKTAR) {
                val *= (10000);
                ety = ty.value;
            }
            else if (this.ex_typ === NumberExType.KILOMETER2) {
                val *= (1000000);
                ety = ty.value;
            }
        }
        else if (ty.value === NumberExType.DAY) {
            if (this.ex_typ === NumberExType.YEAR) {
                val *= (365);
                ety = ty.value;
            }
            else if (this.ex_typ === NumberExType.MONTH) {
                val *= (30);
                ety = ty.value;
            }
            else if (this.ex_typ === NumberExType.WEEK) {
                val *= (7);
                ety = ty.value;
            }
        }
        ty.value = ety;
        return val;
    }
    
    static ex_typ_to_string(ty, ty2 = NumberExType.UNDEFINED) {
        const NumberExHelper = require("./internal/NumberExHelper");
        if (ty2 !== NumberExType.UNDEFINED) 
            return (NumberExToken.ex_typ_to_string(ty, NumberExType.UNDEFINED) + "/" + NumberExToken.ex_typ_to_string(ty2, NumberExType.UNDEFINED));
        let res = null;
        let wrapres572 = new RefOutArgWrapper();
        let inoutres573 = NumberExHelper.m_normals_typs.tryGetValue(ty, wrapres572);
        res = wrapres572.value;
        if (inoutres573) 
            return res;
        return "?";
    }
    
    toString() {
        return (String(this.real_value) + ((this.ex_typ_param != null ? this.ex_typ_param : NumberExToken.ex_typ_to_string(this.ex_typ, this.ex_typ2))));
    }
    
    static _new472(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7) {
        let res = new NumberExToken(_arg1, _arg2, _arg3, _arg4, _arg5);
        res.alt_real_value = _arg6;
        res.morph = _arg7;
        return res;
    }
    
    static _new473(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new NumberExToken(_arg1, _arg2, _arg3, _arg4, _arg5);
        res.morph = _arg6;
        return res;
    }
    
    static _new474(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7, _arg8) {
        let res = new NumberExToken(_arg1, _arg2, _arg3, _arg4, _arg5);
        res.real_value = _arg6;
        res.alt_real_value = _arg7;
        res.morph = _arg8;
        return res;
    }
    
    static _new475(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7, _arg8) {
        let res = new NumberExToken(_arg1, _arg2, _arg3, _arg4, _arg5);
        res.real_value = _arg6;
        res.alt_real_value = _arg7;
        res.ex_typ_param = _arg8;
        return res;
    }
    
    static _new477(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7, _arg8, _arg9) {
        let res = new NumberExToken(_arg1, _arg2, _arg3, _arg4, _arg5);
        res.real_value = _arg6;
        res.alt_real_value = _arg7;
        res.ex_typ2 = _arg8;
        res.ex_typ_param = _arg9;
        return res;
    }
    
    static _new478(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6, _arg7, _arg8) {
        let res = new NumberExToken(_arg1, _arg2, _arg3, _arg4, _arg5);
        res.real_value = _arg6;
        res.alt_real_value = _arg7;
        res.mult_after = _arg8;
        return res;
    }
    
    static _new479(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new NumberExToken(_arg1, _arg2, _arg3, _arg4, _arg5);
        res.tag = _arg6;
        return res;
    }
    
    static _new480(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new NumberExToken(_arg1, _arg2, _arg3, _arg4, _arg5);
        res.ex_typ_param = _arg6;
        return res;
    }
    
    static _new591(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new NumberExToken(_arg1, _arg2, _arg3, _arg4, _arg5);
        res.real_value = _arg6;
        return res;
    }
}


module.exports = NumberExToken