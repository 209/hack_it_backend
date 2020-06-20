/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const GetTextAttr = require("./../core/GetTextAttr");
const GeoReferent = require("./../geo/GeoReferent");
const DateReferent = require("./../date/DateReferent");
const OrganizationReferent = require("./../org/OrganizationReferent");
const BracketParseAttr = require("./../core/BracketParseAttr");
const Referent = require("./../Referent");
const ReferentClass = require("./../ReferentClass");
const MetaTitleInfo = require("./internal/MetaTitleInfo");
const MiscHelper = require("./../core/MiscHelper");
const BracketHelper = require("./../core/BracketHelper");
const Termin = require("./../core/Termin");

/**
 * Сущность, описывающая информацию из заголовков статей, книг, диссертация и пр.
 */
class TitlePageReferent extends Referent {
    
    constructor(name = null) {
        super((name != null ? name : TitlePageReferent.OBJ_TYPENAME));
        this.instance_of = MetaTitleInfo.global_meta;
    }
    
    to_string(short_variant, lang, lev = 0) {
        let res = new StringBuilder();
        let str = this.get_string_value(TitlePageReferent.ATTR_NAME);
        res.append("\"").append(((str != null ? str : "?"))).append("\"");
        if (!short_variant) {
            for (const r of this.slots) {
                if (r.type_name === TitlePageReferent.ATTR_TYPE) {
                    res.append(" (").append(r.value).append(")");
                    break;
                }
            }
            for (const r of this.slots) {
                if (r.type_name === TitlePageReferent.ATTR_AUTHOR && (r.value instanceof Referent)) 
                    res.append(", ").append((r.value).to_string(true, lang, 0));
            }
        }
        if (this.city !== null && !short_variant) 
            res.append(", ").append(this.city.to_string(true, lang, 0));
        if (this.date !== null) {
            if (!short_variant) 
                res.append(", ").append(this.date.to_string(true, lang, 0));
            else 
                res.append(", ").append(this.date.year);
        }
        return res.toString();
    }
    
    /**
     * [Get] Список типов
     */
    get types() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === TitlePageReferent.ATTR_TYPE) 
                res.push(s.value.toString());
        }
        return res;
    }
    
    add_type(typ) {
        if (!Utils.isNullOrEmpty(typ)) {
            this.add_slot(TitlePageReferent.ATTR_TYPE, typ.toLowerCase(), false, 0);
            this.correct_data();
        }
    }
    
    /**
     * [Get] Названия (одно или несколько)
     */
    get names() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === TitlePageReferent.ATTR_NAME) 
                res.push(s.value.toString());
        }
        return res;
    }
    
    add_name(begin, end) {
        if (BracketHelper.can_be_start_of_sequence(begin, true, false)) {
            let br = BracketHelper.try_parse(begin, BracketParseAttr.NO, 100);
            if (br !== null && br.end_token === end) {
                begin = begin.next;
                end = end.previous;
            }
        }
        let val = MiscHelper.get_text_value(begin, end, GetTextAttr.of((GetTextAttr.KEEPREGISTER.value()) | (GetTextAttr.KEEPQUOTES.value())));
        if (val === null) 
            return null;
        if (val.endsWith(".") && !val.endsWith("..")) 
            val = val.substring(0, 0 + val.length - 1).trim();
        this.add_slot(TitlePageReferent.ATTR_NAME, val, false, 0);
        return new Termin(val.toUpperCase());
    }
    
    correct_data() {
        
    }
    
    /**
     * [Get] Дата
     */
    get date() {
        return Utils.as(this.get_slot_value(TitlePageReferent.ATTR_DATE), DateReferent);
    }
    /**
     * [Set] Дата
     */
    set date(value) {
        if (value === null) 
            return value;
        if (this.date === null) {
            this.add_slot(TitlePageReferent.ATTR_DATE, value, true, 0);
            return value;
        }
        if (this.date.month > 0 && value.month === 0) 
            return value;
        if (this.date.day > 0 && value.day === 0) 
            return value;
        this.add_slot(TitlePageReferent.ATTR_DATE, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Номер курса (для студентов)
     */
    get student_year() {
        return this.get_int_value(TitlePageReferent.ATTR_STUDENTYEAR, 0);
    }
    /**
     * [Set] Номер курса (для студентов)
     */
    set student_year(value) {
        this.add_slot(TitlePageReferent.ATTR_STUDENTYEAR, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Организация
     */
    get org() {
        return Utils.as(this.get_slot_value(TitlePageReferent.ATTR_ORG), OrganizationReferent);
    }
    /**
     * [Set] Организация
     */
    set org(value) {
        this.add_slot(TitlePageReferent.ATTR_ORG, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Город
     */
    get city() {
        return Utils.as(this.get_slot_value(TitlePageReferent.ATTR_CITY), GeoReferent);
    }
    /**
     * [Set] Город
     */
    set city(value) {
        this.add_slot(TitlePageReferent.ATTR_CITY, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Специальность
     */
    get speciality() {
        return this.get_string_value(TitlePageReferent.ATTR_SPECIALITY);
    }
    /**
     * [Set] Специальность
     */
    set speciality(value) {
        this.add_slot(TitlePageReferent.ATTR_SPECIALITY, value, true, 0);
        return value;
    }
    
    static static_constructor() {
        TitlePageReferent.OBJ_TYPENAME = "TITLEPAGE";
        TitlePageReferent.ATTR_NAME = "NAME";
        TitlePageReferent.ATTR_TYPE = "TYPE";
        TitlePageReferent.ATTR_AUTHOR = "AUTHOR";
        TitlePageReferent.ATTR_SUPERVISOR = "SUPERVISOR";
        TitlePageReferent.ATTR_EDITOR = "EDITOR";
        TitlePageReferent.ATTR_CONSULTANT = "CONSULTANT";
        TitlePageReferent.ATTR_OPPONENT = "OPPONENT";
        TitlePageReferent.ATTR_TRANSLATOR = "TRANSLATOR";
        TitlePageReferent.ATTR_AFFIRMANT = "AFFIRMANT";
        TitlePageReferent.ATTR_ORG = "ORGANIZATION";
        TitlePageReferent.ATTR_DEP = "DEPARTMENT";
        TitlePageReferent.ATTR_STUDENTYEAR = "STUDENTYEAR";
        TitlePageReferent.ATTR_DATE = "DATE";
        TitlePageReferent.ATTR_CITY = "CITY";
        TitlePageReferent.ATTR_SPECIALITY = "SPECIALITY";
        TitlePageReferent.ATTR_ATTR = "ATTR";
    }
}


TitlePageReferent.static_constructor();

module.exports = TitlePageReferent