/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ReferentEqualType = require("./../ReferentEqualType");
const StreetKind = require("./StreetKind");
const Termin = require("./../core/Termin");
const IntOntologyItem = require("./../core/IntOntologyItem");
const Referent = require("./../Referent");
const ReferentClass = require("./../ReferentClass");
const MetaStreet = require("./internal/MetaStreet");
const MiscHelper = require("./../core/MiscHelper");
const GeoReferent = require("./../geo/GeoReferent");

/**
 * Улица, проспект, площадь, шоссе и т.п.
 */
class StreetReferent extends Referent {
    
    constructor() {
        super(StreetReferent.OBJ_TYPENAME);
        this.instance_of = MetaStreet.global_meta;
    }
    
    /**
     * [Get] Тип(ы)
     */
    get typs() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === StreetReferent.ATTR_TYP) 
                res.push(String(s.value));
        }
        return res;
    }
    
    /**
     * [Get] Наименования
     */
    get names() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === StreetReferent.ATTR_NAME) 
                res.push(String(s.value));
        }
        return res;
    }
    
    /**
     * [Get] Номер улицы (16-я Парковая)
     */
    get number() {
        return this.get_string_value(StreetReferent.ATTR_NUMBER);
    }
    /**
     * [Set] Номер улицы (16-я Парковая)
     */
    set number(value) {
        this.add_slot(StreetReferent.ATTR_NUMBER, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Дополнительный номер (3-я 1 Мая)
     */
    get sec_number() {
        return this.get_string_value(StreetReferent.ATTR_SECNUMBER);
    }
    /**
     * [Set] Дополнительный номер (3-я 1 Мая)
     */
    set sec_number(value) {
        this.add_slot(StreetReferent.ATTR_SECNUMBER, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Ссылка на географические объекты
     */
    get geos() {
        let res = new Array();
        for (const a of this.slots) {
            if (a.type_name === StreetReferent.ATTR_GEO && (a.value instanceof GeoReferent)) 
                res.push(Utils.as(a.value, GeoReferent));
        }
        return res;
    }
    
    /**
     * [Get] Город
     */
    get city() {
        for (const g of this.geos) {
            if (g.is_city) 
                return g;
            else if (g.higher !== null && g.higher.is_city) 
                return g.higher;
        }
        return null;
    }
    
    get parent_referent() {
        return Utils.as(this.get_slot_value(StreetReferent.ATTR_GEO), GeoReferent);
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let tmp = new StringBuilder();
        let nam = this.get_string_value(StreetReferent.ATTR_NAME);
        let _typs = this.typs;
        if (_typs.length > 0) {
            for (let i = 0; i < _typs.length; i++) {
                if (nam !== null && nam.includes(_typs[i].toUpperCase())) 
                    continue;
                if (tmp.length > 0) 
                    tmp.append('/');
                tmp.append(_typs[i]);
            }
        }
        else 
            tmp.append((lang !== null && lang.is_ua ? "вулиця" : "улица"));
        if (this.number !== null) {
            tmp.append(" ").append(this.number);
            if (this.sec_number !== null) 
                tmp.append(" ").append(this.sec_number);
        }
        if (nam !== null) 
            tmp.append(" ").append(MiscHelper.convert_first_char_upper_and_other_lower(nam));
        if (!short_variant) {
            let kladr = this.get_slot_value(StreetReferent.ATTR_FIAS);
            if (kladr instanceof Referent) {
                tmp.append(" (ФИАС: ").append((Utils.notNull((kladr).get_string_value("GUID"), "?")));
                for (const s of this.slots) {
                    if (s.type_name === StreetReferent.ATTR_FIAS && (s.value instanceof Referent) && s.value !== kladr) 
                        tmp.append(", ").append((Utils.notNull((s.value).get_string_value("GUID"), "?")));
                }
                tmp.append(')');
            }
            let bti = this.get_string_value(StreetReferent.ATTR_BTI);
            if (bti !== null) 
                tmp.append(" (БТИ ").append(bti).append(")");
            let okm = this.get_string_value(StreetReferent.ATTR_OKM);
            if (okm !== null) 
                tmp.append(" (ОКМ УМ ").append(okm).append(")");
        }
        if (!short_variant && this.city !== null) 
            tmp.append("; ").append(this.city.to_string(true, lang, lev + 1));
        return tmp.toString();
    }
    
    /**
     * [Get] Классификатор
     */
    get kind() {
        for (const t of this.typs) {
            if (t.includes("дорога")) 
                return StreetKind.ROAD;
            else if (t.includes("метро")) 
                return StreetKind.METRO;
        }
        return StreetKind.UNDEFINED;
    }
    
    can_be_equals(obj, typ = ReferentEqualType.WITHINONETEXT) {
        return this._can_be_equals(obj, typ, false);
    }
    
    _can_be_equals(obj, typ, ignore_geo) {
        let stri = Utils.as(obj, StreetReferent);
        if (stri === null) 
            return false;
        if (this.kind !== stri.kind) 
            return false;
        let typs1 = this.typs;
        let typs2 = stri.typs;
        let ok = false;
        if (typs1.length > 0 && typs2.length > 0) {
            for (const t of typs1) {
                if (typs2.includes(t)) {
                    ok = true;
                    break;
                }
            }
            if (!ok) 
                return false;
        }
        let num = this.number;
        let num1 = stri.number;
        if (num !== null || num1 !== null) {
            if (num === null || num1 === null) 
                return false;
            let sec = this.sec_number;
            let sec1 = stri.sec_number;
            if (sec === null && sec1 === null) {
                if (num !== num1) 
                    return false;
            }
            else if (num === num1) {
                if (sec !== sec1) 
                    return false;
            }
            else if (sec === num1 && sec1 === num) {
            }
            else 
                return false;
        }
        let names1 = this.names;
        let names2 = stri.names;
        if (names1.length > 0 || names2.length > 0) {
            ok = false;
            for (const n of names1) {
                if (names2.includes(n)) {
                    ok = true;
                    break;
                }
            }
            if (!ok) 
                return false;
        }
        if (ignore_geo) 
            return true;
        let geos1 = this.geos;
        let geos2 = stri.geos;
        if (geos1.length > 0 && geos2.length > 0) {
            ok = false;
            for (const g1 of geos1) {
                for (const g2 of geos2) {
                    if (g1.can_be_equals(g2, typ)) {
                        ok = true;
                        break;
                    }
                }
            }
            if (!ok) {
                if (this.city !== null && stri.city !== null) 
                    ok = this.city.can_be_equals(stri.city, typ);
            }
            if (!ok) 
                return false;
        }
        return true;
    }
    
    add_slot(attr_name, attr_value, clear_old_value, stat_count = 0) {
        if (attr_name === StreetReferent.ATTR_NAME && ((typeof attr_value === 'string' || attr_value instanceof String))) {
            let str = Utils.asString(attr_value);
            if (str.indexOf('.') > 0) {
                for (let i = 1; i < (str.length - 1); i++) {
                    if (str[i] === '.' && str[i + 1] !== ' ') 
                        str = str.substring(0, 0 + i + 1) + " " + str.substring(i + 1);
                }
            }
            attr_value = str;
        }
        return super.add_slot(attr_name, attr_value, clear_old_value, stat_count);
    }
    
    merge_slots(obj, merge_statistic = true) {
        super.merge_slots(obj, merge_statistic);
    }
    
    can_be_general_for(obj) {
        if (!this._can_be_equals(obj, ReferentEqualType.WITHINONETEXT, true)) 
            return false;
        let geos1 = this.geos;
        let geos2 = (obj).geos;
        if (geos2.length === 0 || geos1.length > 0) 
            return false;
        return true;
    }
    
    create_ontology_item() {
        let oi = new IntOntologyItem(this);
        let _names = this.names;
        for (const n of _names) {
            oi.termins.push(new Termin(n));
        }
        return oi;
    }
    
    correct() {
        let _names = this.names;
        for (let i = _names.length - 1; i >= 0; i--) {
            let ss = _names[i];
            let jj = ss.indexOf(' ');
            if (jj < 0) 
                continue;
            if (ss.lastIndexOf(' ') !== jj) 
                continue;
            let pp = Utils.splitString(ss, ' ', false);
            if (pp.length === 2) {
                let ss2 = (pp[1] + " " + pp[0]);
                if (!_names.includes(ss2)) 
                    this.add_slot(StreetReferent.ATTR_NAME, ss2, false, 0);
            }
        }
    }
    
    static static_constructor() {
        StreetReferent.OBJ_TYPENAME = "STREET";
        StreetReferent.ATTR_TYP = "TYP";
        StreetReferent.ATTR_NAME = "NAME";
        StreetReferent.ATTR_NUMBER = "NUMBER";
        StreetReferent.ATTR_SECNUMBER = "SECNUMBER";
        StreetReferent.ATTR_GEO = "GEO";
        StreetReferent.ATTR_FIAS = "FIAS";
        StreetReferent.ATTR_BTI = "BTI";
        StreetReferent.ATTR_OKM = "OKM";
    }
}


StreetReferent.static_constructor();

module.exports = StreetReferent