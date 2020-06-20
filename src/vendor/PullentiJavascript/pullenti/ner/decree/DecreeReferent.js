/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ReferentEqualType = require("./../ReferentEqualType");
const GeoReferent = require("./../geo/GeoReferent");
const IntOntologyItem = require("./../core/IntOntologyItem");
const Termin = require("./../core/Termin");
const Referent = require("./../Referent");
const ReferentClass = require("./../ReferentClass");
const DateReferent = require("./../date/DateReferent");
const DecreeKind = require("./DecreeKind");
const MetaDecree = require("./internal/MetaDecree");
const MiscHelper = require("./../core/MiscHelper");
const DecreeTokenItemType = require("./internal/DecreeTokenItemType");
const DateRangeReferent = require("./../date/DateRangeReferent");

/**
 * Сущность, представляющая ссылку на НПА
 */
class DecreeReferent extends Referent {
    
    constructor() {
        super(DecreeReferent.OBJ_TYPENAME);
        this.instance_of = MetaDecree.GLOBAL_META;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let res = new StringBuilder();
        let ki = this.kind;
        let out_part = false;
        let nam = this.name;
        if (this.typ !== null) {
            if ((nam !== null && !nam.startsWith("О") && nam.includes(this.typ)) && ki !== DecreeKind.STANDARD) {
                res.append(MiscHelper.convert_first_char_upper_and_other_lower(nam));
                nam = null;
            }
            else if (ki === DecreeKind.STANDARD && (this.typ.length < 6)) 
                res.append(this.typ);
            else 
                res.append(MiscHelper.convert_first_char_upper_and_other_lower(this.typ));
        }
        else 
            res.append("?");
        let out_src = true;
        if (ki === DecreeKind.CONTRACT && this.find_slot(DecreeReferent.ATTR_SOURCE, null, true) !== null) {
            let srcs = new Array();
            for (const s of this.slots) {
                if (s.type_name === DecreeReferent.ATTR_SOURCE) 
                    srcs.push(s.value.toString());
            }
            if (srcs.length > 1) {
                for (let ii = 0; ii < srcs.length; ii++) {
                    if (ii > 0 && ((ii + 1) < srcs.length)) 
                        res.append(", ");
                    else if (ii > 0) 
                        res.append(" и ");
                    else 
                        res.append(" между ");
                    res.append(srcs[ii]);
                    out_src = false;
                }
            }
        }
        let num = this.number;
        if (num !== null) {
            res.append(" № ").append(num);
            for (const s of this.slots) {
                if (s.type_name === DecreeReferent.ATTR_NUMBER) {
                    let nn = s.value.toString();
                    if (nn !== num) 
                        res.append("/").append(nn);
                }
            }
        }
        if ((((num = this.case_number))) !== null) 
            res.append(" по делу № ").append(num);
        if (this.get_string_value(DecreeReferent.ATTR_DATE) !== null) 
            res.append(" ").append((ki === DecreeKind.PROGRAM ? "" : "от ")).append(this.get_string_value(DecreeReferent.ATTR_DATE));
        if (out_src && this.get_slot_value(DecreeReferent.ATTR_SOURCE) !== null) 
            res.append("; ").append(this.get_string_value(DecreeReferent.ATTR_SOURCE));
        if (!short_variant) {
            let s = this.get_string_value(DecreeReferent.ATTR_GEO);
            if (s !== null) 
                res.append("; ").append(s);
            if (nam !== null) {
                s = this._get_short_name();
                if (s !== null) 
                    res.append("; \"").append(s).append("\"");
            }
        }
        return res.toString().trim();
    }
    
    /**
     * [Get] Наименование (если несколько, то самое короткое)
     */
    get name() {
        let nam = null;
        for (const s of this.slots) {
            if (s.type_name === DecreeReferent.ATTR_NAME) {
                let n = s.value.toString();
                if (nam === null || nam.length > n.length) 
                    nam = n;
            }
        }
        return nam;
    }
    
    _get_short_name() {
        let nam = this.name;
        if (nam === null) 
            return null;
        if (nam.length > 100) {
            let i = 100;
            for (; i < nam.length; i++) {
                if (!Utils.isLetter(nam[i])) 
                    break;
            }
            if (i < nam.length) 
                nam = nam.substring(0, 0 + i) + "...";
        }
        return MiscHelper.convert_first_char_upper_and_other_lower(nam);
    }
    
    get_compare_strings() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === DecreeReferent.ATTR_NAME || s.type_name === DecreeReferent.ATTR_NUMBER) 
                res.push(s.value.toString());
        }
        if (res.length === 0 && this.typ !== null) {
            for (const s of this.slots) {
                if (s.type_name === DecreeReferent.ATTR_GEO) 
                    res.push((this.typ + " " + s.value.toString()));
            }
        }
        if (this.typ === "КОНСТИТУЦИЯ") 
            res.push(this.typ);
        if (res.length > 0) 
            return res;
        else 
            return super.get_compare_strings();
    }
    
    /**
     * [Get] Дата подписания (для законов дат может быть много - по редакциям)
     */
    get date() {
        const DecreeHelper = require("./internal/DecreeHelper");
        let s = this.get_string_value(DecreeReferent.ATTR_DATE);
        if (s === null) 
            return null;
        return DecreeHelper.parse_date_time(s);
    }
    
    add_date(dt) {
        if (dt === null) 
            return false;
        if (dt.ref !== null && (dt.ref.referent instanceof DateReferent)) {
            let dr = Utils.as(dt.ref.referent, DateReferent);
            let year = dr.year;
            let mon = dr.month;
            let day = dr.day;
            if (year === 0) 
                return false;
            let tmp = new StringBuilder();
            tmp.append(year);
            if (mon > 0) 
                tmp.append(".").append(Utils.correctToString((mon).toString(10), 2, true));
            if (day > 0) 
                tmp.append(".").append(Utils.correctToString((day).toString(10), 2, true));
            this.add_slot(DecreeReferent.ATTR_DATE, tmp.toString(), false, 0);
            return true;
        }
        if (dt.ref !== null && (dt.ref.referent instanceof DateRangeReferent)) {
            this.add_slot(DecreeReferent.ATTR_DATE, dt.ref.referent, false, 0);
            return true;
        }
        if (dt.value !== null) {
            this.add_slot(DecreeReferent.ATTR_DATE, dt.value, false, 0);
            return true;
        }
        return false;
    }
    
    _all_years() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === DecreeReferent.ATTR_DATE) {
                let str = s.value.toString();
                let i = str.indexOf('.');
                if (i === 4) 
                    str = str.substring(0, 0 + 4);
                let wrapi1111 = new RefOutArgWrapper();
                let inoutres1112 = Utils.tryParseInt(str, wrapi1111);
                i = wrapi1111.value;
                if (inoutres1112) 
                    res.push(i);
            }
        }
        return res;
    }
    
    /**
     * [Get] Тип
     */
    get typ() {
        return this.get_string_value(DecreeReferent.ATTR_TYPE);
    }
    /**
     * [Set] Тип
     */
    set typ(value) {
        this.add_slot(DecreeReferent.ATTR_TYPE, value, true, 0);
        return value;
    }
    
    get kind() {
        const DecreeToken = require("./internal/DecreeToken");
        return DecreeToken.get_kind(this.typ);
    }
    
    /**
     * [Get] Признак того, что это именно закон, а не подзаконный акт. 
     *  Для законов возможны несколько номеров и дат (редакций)
     */
    get is_law() {
        const DecreeToken = require("./internal/DecreeToken");
        return DecreeToken.is_law(this.typ);
    }
    
    get typ0() {
        let _typ = this.typ;
        if (_typ === null) 
            return null;
        let i = _typ.lastIndexOf(' ');
        if (i < 0) 
            return _typ;
        if (_typ.startsWith("ПАСПОРТ")) 
            return "ПАСПОРТ";
        if (_typ.startsWith("ОСНОВЫ") || _typ.startsWith("ОСНОВИ")) {
            i = _typ.indexOf(' ');
            return _typ.substring(0, 0 + i);
        }
        return _typ.substring(i + 1);
    }
    
    /**
     * [Get] Номер (для законов номеров может быть много)
     */
    get number() {
        return this.get_string_value(DecreeReferent.ATTR_NUMBER);
    }
    
    get case_number() {
        return this.get_string_value(DecreeReferent.ATTR_CASENUMBER);
    }
    
    add_slot(attr_name, attr_value, clear_old_value, stat_count = 0) {
        const PartToken = require("./internal/PartToken");
        if (attr_value instanceof PartToken.PartValue) 
            attr_value = (attr_value).value;
        let s = super.add_slot(attr_name, attr_value, clear_old_value, stat_count);
        if (attr_value instanceof PartToken.PartValue) 
            s.tag = (attr_value).source_value;
        return s;
    }
    
    add_number(dt) {
        if (dt.typ === DecreeTokenItemType.NUMBER) {
            if (dt.num_year > 0) 
                this.add_slot(DecreeReferent.ATTR_DATE, dt.num_year.toString(), false, 0);
        }
        if (Utils.isNullOrEmpty(dt.value)) 
            return;
        let value = dt.value;
        if (".,".indexOf(value[value.length - 1]) >= 0) 
            value = value.substring(0, 0 + value.length - 1);
        this.add_slot(DecreeReferent.ATTR_NUMBER, value, false, 0);
    }
    
    add_name(dr) {
        let s = dr.find_slot(DecreeReferent.ATTR_NAME, null, true);
        if (s === null) 
            return;
        let ss = this.add_slot(DecreeReferent.ATTR_NAME, s.value, false, 0);
        if (ss !== null && ss.tag === null) 
            ss.tag = s.tag;
    }
    
    add_name_str(_name) {
        if (_name === null || _name.length === 0) 
            return;
        if (_name[_name.length - 1] === '.') {
            if (_name.length > 5 && Utils.isLetter(_name[_name.length - 2]) && !Utils.isLetter(_name[_name.length - 3])) {
            }
            else 
                _name = _name.substring(0, 0 + _name.length - 1);
        }
        _name = _name.trim();
        let uname = _name.toUpperCase();
        let s = this.add_slot(DecreeReferent.ATTR_NAME, uname, false, 0);
        if (uname !== _name) 
            s.tag = _name;
    }
    
    _get_number_digits(num) {
        if (num === null) 
            return "";
        let tmp = new StringBuilder();
        for (let i = 0; i < num.length; i++) {
            if (Utils.isDigit(num[i])) {
                if (num[i] === '0' && tmp.length === 0) {
                }
                else if (num[i] === '3' && tmp.length > 0 && num[i - 1] === 'Ф') {
                }
                else 
                    tmp.append(num[i]);
            }
        }
        return tmp.toString();
    }
    
    _all_number_digits() {
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === DecreeReferent.ATTR_NUMBER) 
                res.push(this._get_number_digits(Utils.asString(s.value)));
        }
        return res;
    }
    
    _all_dates() {
        const DecreeHelper = require("./internal/DecreeHelper");
        let res = new Array();
        for (const s of this.slots) {
            if (s.type_name === DecreeReferent.ATTR_DATE) {
                let dt = DecreeHelper.parse_date_time(Utils.asString(s.value));
                if (dt !== null) 
                    res.push(dt);
            }
        }
        return res;
    }
    
    can_be_equals(obj, _typ) {
        let b = this._can_be_equals(obj, _typ, false);
        return b;
    }
    
    _can_be_equals(obj, _typ, ignore_geo) {
        const DecreeToken = require("./internal/DecreeToken");
        let dr = Utils.as(obj, DecreeReferent);
        if (dr === null) 
            return false;
        if (dr.typ0 !== null && this.typ0 !== null) {
            if (dr.typ0 !== this.typ0) 
                return false;
        }
        let num_eq = 0;
        if (this.number !== null || dr.number !== null) {
            if (this.number !== null && dr.number !== null) {
                let di1 = this._all_number_digits();
                let di2 = dr._all_number_digits();
                for (const d1 of di1) {
                    if (di2.includes(d1)) {
                        num_eq = 1;
                        break;
                    }
                }
                if (num_eq === 0 && !this.is_law) 
                    return false;
                for (const s of this.slots) {
                    if (s.type_name === DecreeReferent.ATTR_NUMBER) {
                        if (dr.find_slot(s.type_name, s.value, true) !== null) {
                            num_eq = 2;
                            break;
                        }
                    }
                }
                if (num_eq === 0) 
                    return false;
            }
        }
        if (this.case_number !== null && dr.case_number !== null) {
            if (this.case_number !== dr.case_number) 
                return false;
        }
        if (this.find_slot(DecreeReferent.ATTR_GEO, null, true) !== null && dr.find_slot(DecreeReferent.ATTR_GEO, null, true) !== null) {
            if (this.get_string_value(DecreeReferent.ATTR_GEO) !== dr.get_string_value(DecreeReferent.ATTR_GEO)) 
                return false;
        }
        let src_eq = false;
        let src_not_eq = false;
        let src = this.find_slot(DecreeReferent.ATTR_SOURCE, null, true);
        if (src !== null && dr.find_slot(DecreeReferent.ATTR_SOURCE, null, true) !== null) {
            if (dr.find_slot(src.type_name, src.value, true) === null) 
                src_not_eq = true;
            else 
                src_eq = true;
        }
        let date_not_eq = false;
        let date_is_equ = false;
        let years_is_equ = false;
        let date1 = this.get_string_value(DecreeReferent.ATTR_DATE);
        let date2 = dr.get_string_value(DecreeReferent.ATTR_DATE);
        if (date1 !== null || date2 !== null) {
            if (this.is_law) {
                let ys1 = this._all_years();
                let ys2 = dr._all_years();
                for (const y1 of ys1) {
                    if (ys2.includes(y1)) {
                        years_is_equ = true;
                        break;
                    }
                }
                if (years_is_equ) {
                    let dts1 = this._all_dates();
                    let dts2 = dr._all_dates();
                    for (const d1 of dts1) {
                        if (dts2.includes(d1)) {
                            date_is_equ = true;
                            break;
                        }
                    }
                }
                if (!date_is_equ) {
                    if (this.typ === "КОНСТИТУЦИЯ") 
                        return false;
                    if (this.date !== null && dr.date !== null) 
                        date_not_eq = true;
                }
            }
            else if (date1 === date2 || ((this.date !== null && dr.date !== null && this.date === dr.date))) {
                if (num_eq > 1) 
                    return true;
                date_is_equ = true;
            }
            else if (this.date !== null && dr.date !== null) {
                if (this.date.getFullYear() !== dr.date.getFullYear()) 
                    return false;
                if (num_eq >= 1) {
                    if (src_eq) 
                        return true;
                    if (src_not_eq) 
                        return false;
                }
                else 
                    return false;
            }
            else if (_typ === ReferentEqualType.DIFFERENTTEXTS || this.kind === DecreeKind.PUBLISHER) 
                date_not_eq = true;
        }
        if (this.find_slot(DecreeReferent.ATTR_NAME, null, true) !== null && dr.find_slot(DecreeReferent.ATTR_NAME, null, true) !== null) {
            for (const s of this.slots) {
                if (s.type_name === DecreeReferent.ATTR_NAME) {
                    if (dr.find_slot(s.type_name, s.value, true) !== null) 
                        return true;
                    for (const ss of dr.slots) {
                        if (ss.type_name === s.type_name) {
                            let n0 = s.value.toString();
                            let n1 = ss.value.toString();
                            if (n0.startsWith(n1) || n1.startsWith(n0)) 
                                return true;
                        }
                    }
                }
            }
            if (date_not_eq) 
                return false;
            if (this.is_law && !date_is_equ) 
                return false;
            if (num_eq > 0) {
                if (src_eq) 
                    return true;
                if (src_not_eq && _typ === ReferentEqualType.DIFFERENTTEXTS) 
                    return false;
                else if ((!src_not_eq && num_eq > 1 && this.date === null) && dr.date === null) 
                    return true;
                return false;
            }
        }
        else if (this.is_law && date_not_eq) 
            return false;
        if (date_not_eq) 
            return false;
        let ty = this.typ;
        if (ty === null) 
            return num_eq > 0;
        let t = DecreeToken.get_kind(ty);
        if (t === DecreeKind.USTAV || ty === "КОНСТИТУЦИЯ") 
            return true;
        if (num_eq > 0) 
            return true;
        if (this.toString() === obj.toString()) 
            return true;
        return false;
    }
    
    can_be_general_for(obj) {
        if (!this._can_be_equals(obj, ReferentEqualType.WITHINONETEXT, true)) 
            return false;
        let g1 = Utils.as(this.get_slot_value(DecreeReferent.ATTR_GEO), GeoReferent);
        let g2 = Utils.as(obj.get_slot_value(DecreeReferent.ATTR_GEO), GeoReferent);
        if (g1 === null && g2 !== null) 
            return true;
        return false;
    }
    
    check_correction(noun_is_doubtful) {
        const DecreeToken = require("./internal/DecreeToken");
        let _typ = this.typ0;
        if (_typ === null) 
            return false;
        if (_typ === "КОНСТИТУЦИЯ" || _typ === "КОНСТИТУЦІЯ") 
            return true;
        if (this.typ === "ЕДИНЫЙ ОТРАСЛЕВОЙ СТАНДАРТ ЗАКУПОК") 
            return true;
        if ((_typ === "КОДЕКС" || _typ === "ОСНОВЫ ЗАКОНОДАТЕЛЬСТВА" || _typ === "ПРОГРАММА") || _typ === "ОСНОВИ ЗАКОНОДАВСТВА" || _typ === "ПРОГРАМА") {
            if (this.find_slot(DecreeReferent.ATTR_NAME, null, true) === null) 
                return false;
            if (this.find_slot(DecreeReferent.ATTR_GEO, null, true) !== null) 
                return true;
            return !noun_is_doubtful;
        }
        if (_typ.startsWith("ОСНОВ")) {
            if (this.find_slot(DecreeReferent.ATTR_GEO, null, true) !== null) 
                return true;
            return false;
        }
        if (_typ.includes("ЗАКОН")) {
            if (this.find_slot(DecreeReferent.ATTR_NAME, null, true) === null && this.number === null) 
                return false;
            return true;
        }
        if ((((_typ.includes("ОПРЕДЕЛЕНИЕ") || _typ.includes("РЕШЕНИЕ") || _typ.includes("ПОСТАНОВЛЕНИЕ")) || _typ.includes("ПРИГОВОР") || _typ.includes("ВИЗНАЧЕННЯ")) || _typ.includes("РІШЕННЯ") || _typ.includes("ПОСТАНОВА")) || _typ.includes("ВИРОК")) {
            if (this.number !== null) {
                if (this.find_slot(DecreeReferent.ATTR_DATE, null, true) !== null || this.find_slot(DecreeReferent.ATTR_SOURCE, null, true) !== null || this.find_slot(DecreeReferent.ATTR_NAME, null, true) !== null) 
                    return true;
            }
            else if (this.find_slot(DecreeReferent.ATTR_DATE, null, true) !== null && this.find_slot(DecreeReferent.ATTR_SOURCE, null, true) !== null) 
                return true;
            return false;
        }
        let ty = DecreeToken.get_kind(_typ);
        if (ty === DecreeKind.USTAV) {
            if (this.find_slot(DecreeReferent.ATTR_SOURCE, null, true) !== null) 
                return true;
        }
        if (ty === DecreeKind.KONVENTION) {
            if (this.find_slot(DecreeReferent.ATTR_NAME, null, true) !== null) {
                if (_typ !== "ДОГОВОР" && _typ !== "ДОГОВІР") 
                    return true;
            }
        }
        if (ty === DecreeKind.STANDARD) {
            if (this.number !== null && this.number.length > 4) 
                return true;
        }
        if (this.number === null) {
            if (this.find_slot(DecreeReferent.ATTR_NAME, null, true) === null || this.find_slot(DecreeReferent.ATTR_SOURCE, null, true) === null || this.find_slot(DecreeReferent.ATTR_DATE, null, true) === null) {
                if (ty === DecreeKind.CONTRACT && this.find_slot(DecreeReferent.ATTR_SOURCE, null, true) !== null && this.find_slot(DecreeReferent.ATTR_DATE, null, true) !== null) {
                }
                else if (this.find_slot(DecreeReferent.ATTR_NAME, "ПРАВИЛА ДОРОЖНОГО ДВИЖЕНИЯ", true) !== null) {
                }
                else if (this.find_slot(DecreeReferent.ATTR_NAME, "ПРАВИЛА ДОРОЖНЬОГО РУХУ", true) !== null) {
                }
                else 
                    return false;
            }
        }
        else {
            if ((_typ === "ПАСПОРТ" || _typ === "ГОСТ" || _typ === "ПБУ") || _typ === "ФОРМА") 
                return true;
            if (this.find_slot(DecreeReferent.ATTR_SOURCE, null, true) === null && this.find_slot(DecreeReferent.ATTR_DATE, null, true) === null && this.find_slot(DecreeReferent.ATTR_NAME, null, true) === null) 
                return false;
        }
        return true;
    }
    
    merge_slots(obj, merge_statistic = true) {
        super.merge_slots(obj, merge_statistic);
        for (let i = 0; i < (this.slots.length - 1); i++) {
            for (let j = i + 1; j < this.slots.length; j++) {
                if (this.slots[i].type_name === this.slots[j].type_name && this.slots[i].value === this.slots[j].value) {
                    this.slots.splice(j, 1);
                    j--;
                }
            }
        }
        let nums = this.get_string_values(DecreeReferent.ATTR_NUMBER);
        if (nums.length > 1) {
            nums.sort();
            for (let i = 0; i < (nums.length - 1); i++) {
                if (nums[i + 1].startsWith(nums[i]) && nums[i + 1].length > nums[i].length && !Utils.isDigit(nums[i + 1][nums[i].length])) {
                    let s = this.find_slot(DecreeReferent.ATTR_NUMBER, nums[i], true);
                    if (s !== null) 
                        Utils.removeItem(this.slots, s);
                    nums.splice(i, 1);
                    i--;
                }
            }
        }
    }
    
    create_ontology_item() {
        let oi = new IntOntologyItem(this);
        let vars = new Array();
        for (const a of this.slots) {
            if (a.type_name === DecreeReferent.ATTR_NAME) {
                let s = a.value.toString();
                if (!vars.includes(s)) 
                    vars.push(s);
            }
        }
        if (this.number !== null) {
            for (const digs of this._all_number_digits()) {
                if (!vars.includes(digs)) 
                    vars.push(digs);
            }
        }
        for (const v of vars) {
            oi.termins.push(new Termin(v));
        }
        return oi;
    }
    
    static _new1099(_arg1) {
        let res = new DecreeReferent();
        res.typ = _arg1;
        return res;
    }
    
    static static_constructor() {
        DecreeReferent.OBJ_TYPENAME = "DECREE";
        DecreeReferent.ATTR_TYPE = "TYPE";
        DecreeReferent.ATTR_NAME = "NAME";
        DecreeReferent.ATTR_NUMBER = "NUMBER";
        DecreeReferent.ATTR_DATE = "DATE";
        DecreeReferent.ATTR_SOURCE = "SOURCE";
        DecreeReferent.ATTR_GEO = "GEO";
        DecreeReferent.ATTR_READING = "READING";
        DecreeReferent.ATTR_CASENUMBER = "CASENUMBER";
        DecreeReferent.ATTR_EDITION = "EDITION";
    }
}


DecreeReferent.static_constructor();

module.exports = DecreeReferent