/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const DatePointerType = require("./../date/DatePointerType");
const ReferentToken = require("./../ReferentToken");
const DecreeToken = require("./../decree/internal/DecreeToken");
const MetaInstrument = require("./internal/MetaInstrument");
const DateReferent = require("./../date/DateReferent");
const MiscHelper = require("./../core/MiscHelper");
const DecreeReferent = require("./../decree/DecreeReferent");
const ReferentClass = require("./../ReferentClass");
const InstrumentBlockReferent = require("./InstrumentBlockReferent");
const DecreeHelper = require("./../decree/internal/DecreeHelper");

/**
 * Представление нормативно-правового документа или его части
 */
class InstrumentReferent extends InstrumentBlockReferent {
    
    constructor() {
        super(InstrumentReferent.OBJ_TYPENAME);
        this.instance_of = MetaInstrument.GLOBAL_META;
    }
    
    to_string(short_variant, lang, lev = 0) {
        let res = new StringBuilder();
        let str = null;
        if ((((str = this.get_string_value(InstrumentReferent.ATTR_APPENDIX)))) !== null) {
            let strs = this.get_string_values(InstrumentReferent.ATTR_APPENDIX);
            if (strs.length === 1) 
                res.append("Приложение").append((str.length === 0 ? "" : " ")).append(str).append("; ");
            else {
                res.append("Приложения ");
                for (let i = 0; i < strs.length; i++) {
                    if (i > 0) 
                        res.append(",");
                    res.append(strs[i]);
                }
                res.append("; ");
            }
        }
        if ((((str = this.get_string_value(InstrumentReferent.ATTR_PART)))) !== null) 
            res.append("Часть ").append(str).append("; ");
        if (this.typ !== null) 
            res.append(MiscHelper.convert_first_char_upper_and_other_lower(this.typ));
        else 
            res.append("Документ");
        if (this.reg_number !== null) {
            res.append(" №").append(this.reg_number);
            for (const s of this.slots) {
                if (s.type_name === InstrumentReferent.ATTR_REGNUMBER && s.value.toString() !== this.reg_number) 
                    res.append("/").append(s.value);
            }
        }
        if (this.case_number !== null) 
            res.append(" дело №").append(this.case_number);
        let dt = this.get_string_value(InstrumentReferent.ATTR_DATE);
        if (dt !== null) 
            res.append(" от ").append(dt);
        if ((((str = this.get_string_value(InstrumentBlockReferent.ATTR_NAME)))) !== null) {
            if (str.length > 100) 
                str = str.substring(0, 0 + 100) + "...";
            res.append(" \"").append(str).append("\"");
        }
        if ((((str = this.get_string_value(InstrumentReferent.ATTR_GEO)))) !== null) 
            res.append(" (").append(str).append(")");
        return res.toString().trim();
    }
    
    /**
     * [Get] Тип
     */
    get typ() {
        return this.get_string_value(InstrumentReferent.ATTR_TYPE);
    }
    /**
     * [Set] Тип
     */
    set typ(_value) {
        this.add_slot(InstrumentReferent.ATTR_TYPE, _value, true, 0);
        return _value;
    }
    
    /**
     * [Get] Номер
     */
    get reg_number() {
        return this.get_string_value(InstrumentReferent.ATTR_REGNUMBER);
    }
    /**
     * [Set] Номер
     */
    set reg_number(_value) {
        if (Utils.isNullOrEmpty(_value)) {
            this.add_slot(InstrumentReferent.ATTR_REGNUMBER, null, true, 0);
            return _value;
        }
        if (".,".indexOf(_value[_value.length - 1]) >= 0) 
            _value = _value.substring(0, 0 + _value.length - 1);
        this.add_slot(InstrumentReferent.ATTR_REGNUMBER, _value, true, 0);
        return _value;
    }
    
    /**
     * [Get] Номер дела
     */
    get case_number() {
        return this.get_string_value(InstrumentReferent.ATTR_CASENUMBER);
    }
    /**
     * [Set] Номер дела
     */
    set case_number(_value) {
        if (Utils.isNullOrEmpty(_value)) 
            return _value;
        if (".,".indexOf(_value[_value.length - 1]) >= 0) 
            _value = _value.substring(0, 0 + _value.length - 1);
        this.add_slot(InstrumentReferent.ATTR_CASENUMBER, _value, true, 0);
        return _value;
    }
    
    /**
     * [Get] Дата подписания
     */
    get date() {
        let s = this.get_string_value(InstrumentReferent.ATTR_DATE);
        if (s === null) 
            return null;
        return DecreeHelper.parse_date_time(s);
    }
    
    add_date(dt) {
        if (dt === null) 
            return false;
        if (dt instanceof DecreeToken) {
            if ((dt).ref instanceof ReferentToken) 
                return this.add_date(((dt).ref).referent);
            if ((dt).value !== null) {
                this.add_slot(InstrumentReferent.ATTR_DATE, (dt).value, true, 0);
                return true;
            }
            return false;
        }
        if (dt instanceof ReferentToken) 
            return this.add_date((dt).referent);
        if (dt instanceof DateReferent) {
            let dr = Utils.as(dt, DateReferent);
            let year = dr.year;
            let mon = dr.month;
            let day = dr.day;
            if (year === 0) 
                return dr.pointer === DatePointerType.UNDEFINED;
            let ex_date = this.date;
            if (ex_date !== null && ex_date.getFullYear() === year) {
                if (mon === 0 && (ex_date.getMonth() + 1) > 0) 
                    return false;
                if (day === 0 && ex_date.getDate() > 0) 
                    return false;
                let del_exist = false;
                if (mon > 0 && (ex_date.getMonth() + 1) === 0) 
                    del_exist = true;
                if (del_exist) {
                    for (const s of this.slots) {
                        if (s.type_name === InstrumentReferent.ATTR_DATE) {
                            Utils.removeItem(this.slots, s);
                            break;
                        }
                    }
                }
            }
            let tmp = new StringBuilder();
            tmp.append(year);
            if (mon > 0) 
                tmp.append(".").append(Utils.correctToString((mon).toString(10), 2, true));
            if (day > 0) 
                tmp.append(".").append(Utils.correctToString((day).toString(10), 2, true));
            this.add_slot(DecreeReferent.ATTR_DATE, tmp.toString(), false, 0);
            return true;
        }
        if ((typeof dt === 'string' || dt instanceof String)) {
            this.add_slot(InstrumentReferent.ATTR_DATE, Utils.asString(dt), true, 0);
            return true;
        }
        return false;
    }
    
    can_be_equals(obj, _typ) {
        return obj === this;
    }
    
    static static_constructor() {
        InstrumentReferent.OBJ_TYPENAME = "INSTRUMENT";
        InstrumentReferent.ATTR_TYPE = "TYPE";
        InstrumentReferent.ATTR_REGNUMBER = "NUMBER";
        InstrumentReferent.ATTR_CASENUMBER = "CASENUMBER";
        InstrumentReferent.ATTR_DATE = "DATE";
        InstrumentReferent.ATTR_SIGNER = "SIGNER";
        InstrumentReferent.ATTR_SOURCE = "SOURCE";
        InstrumentReferent.ATTR_GEO = "GEO";
        InstrumentReferent.ATTR_PART = "PART";
        InstrumentReferent.ATTR_APPENDIX = "APPENDIX";
        InstrumentReferent.ATTR_PARTICIPANT = "PARTICIPANT";
        InstrumentReferent.ATTR_ARTEFACT = "ARTEFACT";
    }
}


InstrumentReferent.static_constructor();

module.exports = InstrumentReferent