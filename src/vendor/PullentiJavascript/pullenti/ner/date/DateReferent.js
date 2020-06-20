/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ReferentEqualType = require("./../ReferentEqualType");
const MorphLang = require("./../../morph/MorphLang");
const NumberHelper = require("./../core/NumberHelper");
const Referent = require("./../Referent");
const ReferentClass = require("./../ReferentClass");
const DatePointerType = require("./DatePointerType");
const MetaDate = require("./internal/MetaDate");

/**
 * Сущность, представляющая дату
 */
class DateReferent extends Referent {
    
    constructor() {
        super(DateReferent.OBJ_TYPENAME);
        this.instance_of = MetaDate.GLOBAL_META;
    }
    
    /**
     * [Get] Дата в стандартной структуре .NET (null, если что-либо неопределено или дата некорректна)
     */
    get dt() {
        if (this.year > 0 && this.month > 0 && this.day > 0) {
            if (this.month > 12) 
                return null;
            if (this.day > Utils.daysInMonth(this.year, this.month)) 
                return null;
            let h = this.hour;
            let m = this.minute;
            let s = this.second;
            if (h < 0) 
                h = 0;
            if (m < 0) 
                m = 0;
            if (s < 0) 
                s = 0;
            try {
                return new Date(this.year, this.month - 1, this.day, h, m, (s >= 0 && (s < 60) ? s : 0));
            } catch (ex) {
            }
        }
        return null;
    }
    /**
     * [Set] Дата в стандартной структуре .NET (null, если что-либо неопределено или дата некорректна)
     */
    set dt(value) {
        return value;
    }
    
    /**
     * [Get] Век (0 - неопределён)
     */
    get century() {
        if (this.higher !== null) 
            return this.higher.century;
        let cent = this.get_int_value(DateReferent.ATTR_CENTURY, 0);
        if (cent !== 0) 
            return cent;
        let _year = this.year;
        if (_year > 0) {
            cent = Utils.intDiv(_year, 100);
            cent++;
            return cent;
        }
        else if (_year < 0) {
            cent = Utils.intDiv(_year, 100);
            cent--;
            return cent;
        }
        return 0;
    }
    /**
     * [Set] Век (0 - неопределён)
     */
    set century(value) {
        this.add_slot(DateReferent.ATTR_CENTURY, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Год (0 - неопределён)
     */
    get year() {
        if (this.higher !== null) 
            return this.higher.year;
        else 
            return this.get_int_value(DateReferent.ATTR_YEAR, 0);
    }
    /**
     * [Set] Год (0 - неопределён)
     */
    set year(value) {
        this.add_slot(DateReferent.ATTR_YEAR, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Месяц (0 - неопределён)
     */
    get month() {
        if (this.find_slot(DateReferent.ATTR_MONTH, null, true) === null && this.higher !== null) 
            return this.higher.month;
        else 
            return this.get_int_value(DateReferent.ATTR_MONTH, 0);
    }
    /**
     * [Set] Месяц (0 - неопределён)
     */
    set month(value) {
        this.add_slot(DateReferent.ATTR_MONTH, value, true, 0);
        return value;
    }
    
    /**
     * [Get] День месяца (0 - неопределён)
     */
    get day() {
        if (this.find_slot(DateReferent.ATTR_DAY, null, true) === null && this.higher !== null) 
            return this.higher.day;
        else 
            return this.get_int_value(DateReferent.ATTR_DAY, 0);
    }
    /**
     * [Set] День месяца (0 - неопределён)
     */
    set day(value) {
        this.add_slot(DateReferent.ATTR_DAY, value, true, 0);
        return value;
    }
    
    /**
     * [Get] День недели (0 - неопределён, 1 - понедельник ...)
     */
    get day_of_week() {
        if (this.find_slot(DateReferent.ATTR_DAYOFWEEK, null, true) === null && this.higher !== null) 
            return this.higher.day_of_week;
        else 
            return this.get_int_value(DateReferent.ATTR_DAYOFWEEK, 0);
    }
    /**
     * [Set] День недели (0 - неопределён, 1 - понедельник ...)
     */
    set day_of_week(value) {
        this.add_slot(DateReferent.ATTR_DAYOFWEEK, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Час (-1 - неопределён)
     */
    get hour() {
        return this.get_int_value(DateReferent.ATTR_HOUR, -1);
    }
    /**
     * [Set] Час (-1 - неопределён)
     */
    set hour(value) {
        this.add_slot(DateReferent.ATTR_HOUR, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Минуты (-1 - неопределён)
     */
    get minute() {
        return this.get_int_value(DateReferent.ATTR_MINUTE, -1);
    }
    /**
     * [Set] Минуты (-1 - неопределён)
     */
    set minute(value) {
        this.add_slot(DateReferent.ATTR_MINUTE, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Секунд (-1 - неопределён)
     */
    get second() {
        return this.get_int_value(DateReferent.ATTR_SECOND, -1);
    }
    /**
     * [Set] Секунд (-1 - неопределён)
     */
    set second(value) {
        this.add_slot(DateReferent.ATTR_SECOND, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Вышестоящая дата
     */
    get higher() {
        return Utils.as(this.get_slot_value(DateReferent.ATTR_HIGHER), DateReferent);
    }
    /**
     * [Set] Вышестоящая дата
     */
    set higher(value) {
        this.add_slot(DateReferent.ATTR_HIGHER, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Дополнительный указатель примерной даты
     */
    get pointer() {
        let s = this.get_string_value(DateReferent.ATTR_POINTER);
        if (s === null) 
            return DatePointerType.NO;
        try {
            let res = DatePointerType.of(s);
            if (res instanceof DatePointerType) 
                return DatePointerType.of(res);
        } catch (ex790) {
        }
        return DatePointerType.NO;
    }
    /**
     * [Set] Дополнительный указатель примерной даты
     */
    set pointer(value) {
        if (value !== DatePointerType.NO) 
            this.add_slot(DateReferent.ATTR_POINTER, value.toString(), true, 0);
        return value;
    }
    
    get parent_referent() {
        return this.higher;
    }
    
    static can_be_higher(hi, lo) {
        if (lo === null || hi === null) 
            return false;
        if (lo.higher === hi) 
            return true;
        if (lo.higher !== null && lo.higher.can_be_equals(hi, ReferentEqualType.WITHINONETEXT)) 
            return true;
        if (lo.higher !== null) 
            return false;
        if (lo.hour >= 0) {
            if (hi.hour >= 0) 
                return false;
            if (lo.day > 0) 
                return false;
            return true;
        }
        if (hi.year > 0 && lo.year <= 0) {
            if (hi.month > 0) 
                return false;
            return true;
        }
        return false;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        return this._to_string(short_variant, lang, lev, 0);
    }
    
    _to_string(short_variant, lang, lev, from_range) {
        let res = new StringBuilder();
        let p = this.pointer;
        if (lang === null) 
            lang = MorphLang.RU;
        if (from_range === 1) 
            res.append((lang.is_ua ? "з" : (lang.is_en ? "from" : "с"))).append(" ");
        else if (from_range === 2) 
            res.append((lang.is_en ? "to " : "по "));
        if (p !== DatePointerType.NO) {
            let val = String(MetaDate.POINTER.convert_inner_value_to_outer_value(p.toString(), lang));
            if (from_range === 0 || lang.is_en) {
            }
            else if (from_range === 1) {
                if (p === DatePointerType.BEGIN) 
                    val = (lang.is_ua ? "початку" : "начала");
                else if (p === DatePointerType.CENTER) 
                    val = (lang.is_ua ? "середини" : "середины");
                else if (p === DatePointerType.END) 
                    val = (lang.is_ua ? "кінця" : "конца");
                else if (p === DatePointerType.TODAY) 
                    val = (lang.is_ua ? "цього часу" : "настоящего времени");
            }
            else if (from_range === 2) {
                if (p === DatePointerType.BEGIN) 
                    val = (lang.is_ua ? "початок" : "начало");
                else if (p === DatePointerType.CENTER) 
                    val = (lang.is_ua ? "середину" : "середину");
                else if (p === DatePointerType.END) 
                    val = (lang.is_ua ? "кінець" : "конец");
                else if (p === DatePointerType.TODAY) 
                    val = (lang.is_ua ? "теперішній час" : "настоящее время");
            }
            res.append(val).append(" ");
        }
        if (this.day_of_week > 0) {
            if (lang.is_en) 
                res.append(DateReferent.m_week_day_en[this.day_of_week - 1]).append(", ");
            else 
                res.append(DateReferent.m_week_day[this.day_of_week - 1]).append(", ");
        }
        let y = this.year;
        let m = this.month;
        let d = this.day;
        let cent = this.century;
        if (y === 0 && cent !== 0) {
            let is_bc = cent < 0;
            if (cent < 0) 
                cent = -cent;
            res.append(NumberHelper.get_number_roman(cent));
            if (lang.is_ua) 
                res.append(" century");
            else if (m > 0 || p !== DatePointerType.NO || from_range === 1) 
                res.append((lang.is_ua ? " віка" : " века"));
            else 
                res.append((lang.is_ua ? " вік" : " век"));
            if (is_bc) 
                res.append((lang.is_ua ? " до н.е." : " до н.э."));
            return res.toString();
        }
        if (d > 0) 
            res.append(d);
        if (m > 0 && m <= 12) {
            if (res.length > 0 && res.charAt(res.length - 1) !== ' ') 
                res.append(' ');
            if (lang.is_ua) 
                res.append((d > 0 || p !== DatePointerType.NO || from_range !== 0 ? DateReferent.m_monthua[m - 1] : DateReferent.m_month0ua[m - 1]));
            else if (lang.is_en) 
                res.append(DateReferent.m_monthen[m - 1]);
            else 
                res.append((d > 0 || p !== DatePointerType.NO || from_range !== 0 ? DateReferent.m_month[m - 1] : DateReferent.m_month0[m - 1]));
        }
        if (y !== 0) {
            let is_bc = y < 0;
            if (y < 0) 
                y = -y;
            if (res.length > 0 && res.charAt(res.length - 1) !== ' ') 
                res.append(' ');
            if (lang !== null && lang.is_en) 
                res.append(y);
            else if (short_variant) 
                res.append(y).append((lang.is_ua ? "р" : "г"));
            else if (m > 0 || p !== DatePointerType.NO || from_range === 1) 
                res.append(y).append(" ").append((lang.is_ua ? "року" : "года"));
            else 
                res.append(y).append(" ").append((lang.is_ua ? "рік" : "год"));
            if (is_bc) 
                res.append((lang.is_ua ? " до н.е." : (lang.is_en ? "BC" : " до н.э.")));
        }
        let h = this.hour;
        let mi = this.minute;
        let se = this.second;
        if (h >= 0 && mi >= 0) {
            if (res.length > 0) 
                res.append(' ');
            res.append(Utils.correctToString((h).toString(10), 2, true)).append(":").append(Utils.correctToString((mi).toString(10), 2, true));
            if (se >= 0) 
                res.append(":").append(Utils.correctToString((se).toString(10), 2, true));
        }
        if (res.length === 0) 
            return "?";
        while (res.charAt(res.length - 1) === ' ' || res.charAt(res.length - 1) === ',') {
            res.length = res.length - 1;
        }
        return res.toString().trim();
    }
    
    can_be_equals(obj, typ) {
        let sd = Utils.as(obj, DateReferent);
        if (sd === null) 
            return false;
        if (sd.century !== this.century) 
            return false;
        if (sd.year !== this.year) 
            return false;
        if (sd.month !== this.month) 
            return false;
        if (sd.day !== this.day) 
            return false;
        if (sd.hour !== this.hour) 
            return false;
        if (sd.minute !== this.minute) 
            return false;
        if (sd.second !== this.second) 
            return false;
        if (sd.pointer !== this.pointer) 
            return false;
        if (sd.day_of_week > 0 && this.day_of_week > 0) {
            if (sd.day_of_week !== this.day_of_week) 
                return false;
        }
        return true;
    }
    
    static compare(d1, d2) {
        if (d1.year < d2.year) 
            return -1;
        if (d1.year > d2.year) 
            return 1;
        if (d1.month < d2.month) 
            return -1;
        if (d1.month > d2.month) 
            return 1;
        if (d1.day < d2.day) 
            return -1;
        if (d1.day > d2.day) 
            return 1;
        if (d1.hour < d2.hour) 
            return -1;
        if (d1.hour > d2.hour) 
            return 1;
        if (d1.minute < d2.minute) 
            return -1;
        if (d1.minute > d2.minute) 
            return 1;
        if (d1.second > d2.second) 
            return -1;
        if (d1.second < d2.second) 
            return 1;
        return 0;
    }
    
    /**
     * Проверка, что дата или диапазон определены с точностью до одного месяца
     * @param obj 
     * @return 
     */
    static is_month_defined(obj) {
        const DateRangeReferent = require("./DateRangeReferent");
        let sd = Utils.as(obj, DateReferent);
        if (sd !== null) 
            return (sd.year > 0 && sd.month > 0);
        let sdr = Utils.as(obj, DateRangeReferent);
        if (sdr !== null) {
            if (sdr.date_from === null || sdr.date_to === null) 
                return false;
            if (sdr.date_from.year === 0 || sdr.date_to.year !== sdr.date_from.year) 
                return false;
            if (sdr.date_from.month === 0 || sdr.date_to.month !== sdr.date_from.month) 
                return false;
            return true;
        }
        return false;
    }
    
    static _new725(_arg1, _arg2) {
        let res = new DateReferent();
        res.higher = _arg1;
        res.day = _arg2;
        return res;
    }
    
    static _new726(_arg1, _arg2) {
        let res = new DateReferent();
        res.month = _arg1;
        res.day = _arg2;
        return res;
    }
    
    static _new727(_arg1) {
        let res = new DateReferent();
        res.year = _arg1;
        return res;
    }
    
    static _new731(_arg1, _arg2) {
        let res = new DateReferent();
        res.hour = _arg1;
        res.minute = _arg2;
        return res;
    }
    
    static _new732(_arg1) {
        let res = new DateReferent();
        res.pointer = _arg1;
        return res;
    }
    
    static _new744(_arg1, _arg2) {
        let res = new DateReferent();
        res.month = _arg1;
        res.higher = _arg2;
        return res;
    }
    
    static _new749(_arg1, _arg2) {
        let res = new DateReferent();
        res.day = _arg1;
        res.higher = _arg2;
        return res;
    }
    
    static _new765(_arg1) {
        let res = new DateReferent();
        res.month = _arg1;
        return res;
    }
    
    static _new766(_arg1) {
        let res = new DateReferent();
        res.century = _arg1;
        return res;
    }
    
    static _new773(_arg1) {
        let res = new DateReferent();
        res.day = _arg1;
        return res;
    }
    
    static _new775(_arg1) {
        let res = new DateReferent();
        res.higher = _arg1;
        return res;
    }
    
    static _new776(_arg1, _arg2) {
        let res = new DateReferent();
        res.higher = _arg1;
        res.month = _arg2;
        return res;
    }
    
    static _new785(_arg1) {
        let res = new DateReferent();
        res.day_of_week = _arg1;
        return res;
    }
    
    static static_constructor() {
        DateReferent.OBJ_TYPENAME = "DATE";
        DateReferent.ATTR_CENTURY = "CENTURY";
        DateReferent.ATTR_YEAR = "YEAR";
        DateReferent.ATTR_MONTH = "MONTH";
        DateReferent.ATTR_DAY = "DAY";
        DateReferent.ATTR_DAYOFWEEK = "DAYOFWEEK";
        DateReferent.ATTR_HOUR = "HOUR";
        DateReferent.ATTR_MINUTE = "MINUTE";
        DateReferent.ATTR_SECOND = "SECOND";
        DateReferent.ATTR_HIGHER = "HIGHER";
        DateReferent.ATTR_POINTER = "POINTER";
        DateReferent.m_month = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
        DateReferent.m_month0 = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
        DateReferent.m_monthen = ["jan", "fab", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        DateReferent.m_monthua = ["січня", "лютого", "березня", "квітня", "травня", "червня", "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"];
        DateReferent.m_month0ua = ["січень", "лютий", "березень", "квітень", "травень", "червень", "липень", "серпень", "вересень", "жовтень", "листопад", "грудень"];
        DateReferent.m_week_day = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
        DateReferent.m_week_day_en = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    }
}


DateReferent.static_constructor();

module.exports = DateReferent