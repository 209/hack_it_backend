/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const ReferentEqualType = require("./../ReferentEqualType");
const Referent = require("./../Referent");
const InstrumentKind = require("./InstrumentKind");
const ReferentClass = require("./../ReferentClass");
const MetaInstrumentBlock = require("./internal/MetaInstrumentBlock");
const DecreeReferent = require("./../decree/DecreeReferent");

/**
 * Представление нормативно-правового документа или его части
 */
class InstrumentBlockReferent extends Referent {
    
    constructor(typename = null) {
        super((typename != null ? typename : InstrumentBlockReferent.OBJ_TYPENAME));
        this.m_children = null;
        this.instance_of = MetaInstrumentBlock.GLOBAL_META;
    }
    
    to_string(short_variant, lang, lev = 0) {
        let res = new StringBuilder();
        let ki = this.kind;
        let str = null;
        str = Utils.asString(MetaInstrumentBlock.GLOBAL_META.kind_feature.convert_inner_value_to_outer_value(ki.toString(), lang));
        if (str !== null) {
            res.append(str);
            if (this.kind2 !== InstrumentKind.UNDEFINED) {
                str = Utils.asString(MetaInstrumentBlock.GLOBAL_META.kind_feature.convert_inner_value_to_outer_value(this.kind2.toString(), lang));
                if (str !== null) 
                    res.append(" (").append(str).append(")");
            }
        }
        if (this.number > 0) {
            if (ki === InstrumentKind.TABLE) 
                res.append(" ").append(this.children.length).append(" строк, ").append(this.number).append(" столбцов");
            else {
                res.append(" №").append(this.number);
                if (this.sub_number > 0) {
                    res.append(".").append(this.sub_number);
                    if (this.sub_number2 > 0) {
                        res.append(".").append(this.sub_number2);
                        if (this.sub_number3 > 0) 
                            res.append(".").append(this.sub_number3);
                    }
                }
                if (this.min_number > 0) {
                    for (let i = res.length - 1; i >= 0; i--) {
                        if (res.charAt(i) === ' ' || res.charAt(i) === '.') {
                            res.insert(i + 1, (String(this.min_number) + "-"));
                            break;
                        }
                    }
                }
            }
        }
        let ignore_ref = false;
        if (this.is_expired) {
            res.append(" (утратить силу)");
            ignore_ref = true;
        }
        else if (ki !== InstrumentKind.EDITIONS && ki !== InstrumentKind.APPROVED && (this.ref instanceof DecreeReferent)) {
            res.append(" (*)");
            ignore_ref = true;
        }
        if ((((str = this.get_string_value(InstrumentBlockReferent.ATTR_NAME)))) === null) 
            str = this.get_string_value(InstrumentBlockReferent.ATTR_VALUE);
        if (str !== null) {
            if (str.length > 100) 
                str = str.substring(0, 0 + 100) + "...";
            res.append(" \"").append(str).append("\"");
        }
        else if (!ignore_ref && (this.ref instanceof Referent) && (lev < 30)) 
            res.append(" \"").append(this.ref.to_string(short_variant, lang, lev + 1)).append("\"");
        return res.toString().trim();
    }
    
    /**
     * [Get] Классификатор
     */
    get kind() {
        let s = this.get_string_value(InstrumentBlockReferent.ATTR_KIND);
        if (s === null) 
            return InstrumentKind.UNDEFINED;
        try {
            if (s === "Part" || s === "Base" || s === "Special") 
                return InstrumentKind.UNDEFINED;
            let res = InstrumentKind.of(s);
            if (res instanceof InstrumentKind) 
                return InstrumentKind.of(res);
        } catch (ex1576) {
        }
        return InstrumentKind.UNDEFINED;
    }
    /**
     * [Set] Классификатор
     */
    set kind(_value) {
        if (_value !== InstrumentKind.UNDEFINED) 
            this.add_slot(InstrumentBlockReferent.ATTR_KIND, _value.toString().toUpperCase(), true, 0);
        return _value;
    }
    
    /**
     * [Get] Классификатор дополнительный
     */
    get kind2() {
        let s = this.get_string_value(InstrumentBlockReferent.ATTR_KIND2);
        if (s === null) 
            return InstrumentKind.UNDEFINED;
        try {
            let res = InstrumentKind.of(s);
            if (res instanceof InstrumentKind) 
                return InstrumentKind.of(res);
        } catch (ex1577) {
        }
        return InstrumentKind.UNDEFINED;
    }
    /**
     * [Set] Классификатор дополнительный
     */
    set kind2(_value) {
        if (_value !== InstrumentKind.UNDEFINED) 
            this.add_slot(InstrumentBlockReferent.ATTR_KIND2, _value.toString().toUpperCase(), true, 0);
        return _value;
    }
    
    /**
     * [Get] Значение
     */
    get value() {
        return this.get_string_value(InstrumentBlockReferent.ATTR_VALUE);
    }
    /**
     * [Set] Значение
     */
    set value(_value) {
        this.add_slot(InstrumentBlockReferent.ATTR_VALUE, _value, true, 0);
        return _value;
    }
    
    get ref() {
        return Utils.as(this.get_slot_value(InstrumentBlockReferent.ATTR_REF), Referent);
    }
    
    get is_expired() {
        return this.get_string_value(InstrumentBlockReferent.ATTR_EXPIRED) === "true";
    }
    set is_expired(_value) {
        this.add_slot(InstrumentBlockReferent.ATTR_EXPIRED, (_value ? "true" : null), true, 0);
        return _value;
    }
    
    /**
     * [Get] Номер (для диапазона - максимальный номер)
     */
    get number() {
        let str = this.get_string_value(InstrumentBlockReferent.ATTR_NUMBER);
        if (str === null) 
            return 0;
        let i = 0;
        let wrapi1578 = new RefOutArgWrapper();
        let inoutres1579 = Utils.tryParseInt(str, wrapi1578);
        i = wrapi1578.value;
        if (inoutres1579) 
            return i;
        return 0;
    }
    /**
     * [Set] Номер (для диапазона - максимальный номер)
     */
    set number(_value) {
        this.add_slot(InstrumentBlockReferent.ATTR_NUMBER, _value.toString(), true, 0);
        return _value;
    }
    
    /**
     * [Get] Дополнительный номер (через точку за основным)
     */
    get sub_number() {
        let str = this.get_string_value(InstrumentBlockReferent.ATTR_SUBNUMBER);
        if (str === null) 
            return 0;
        let i = 0;
        let wrapi1580 = new RefOutArgWrapper();
        let inoutres1581 = Utils.tryParseInt(str, wrapi1580);
        i = wrapi1580.value;
        if (inoutres1581) 
            return i;
        return 0;
    }
    /**
     * [Set] Дополнительный номер (через точку за основным)
     */
    set sub_number(_value) {
        this.add_slot(InstrumentBlockReferent.ATTR_SUBNUMBER, _value.toString(), true, 0);
        return _value;
    }
    
    /**
     * [Get] Дополнительный второй номер (через точку за дополнительным)
     */
    get sub_number2() {
        let str = this.get_string_value(InstrumentBlockReferent.ATTR_SUB2NUMBER);
        if (str === null) 
            return 0;
        let i = 0;
        let wrapi1582 = new RefOutArgWrapper();
        let inoutres1583 = Utils.tryParseInt(str, wrapi1582);
        i = wrapi1582.value;
        if (inoutres1583) 
            return i;
        return 0;
    }
    /**
     * [Set] Дополнительный второй номер (через точку за дополнительным)
     */
    set sub_number2(_value) {
        this.add_slot(InstrumentBlockReferent.ATTR_SUB2NUMBER, _value.toString(), true, 0);
        return _value;
    }
    
    /**
     * [Get] Дополнительный третий номер (через точку за вторым дополнительным)
     */
    get sub_number3() {
        let str = this.get_string_value(InstrumentBlockReferent.ATTR_SUB3NUMBER);
        if (str === null) 
            return 0;
        let i = 0;
        let wrapi1584 = new RefOutArgWrapper();
        let inoutres1585 = Utils.tryParseInt(str, wrapi1584);
        i = wrapi1584.value;
        if (inoutres1585) 
            return i;
        return 0;
    }
    /**
     * [Set] Дополнительный третий номер (через точку за вторым дополнительным)
     */
    set sub_number3(_value) {
        this.add_slot(InstrumentBlockReferent.ATTR_SUB3NUMBER, _value.toString(), true, 0);
        return _value;
    }
    
    /**
     * [Get] Минимальный номер, если задан диапазон
     */
    get min_number() {
        let str = this.get_string_value(InstrumentBlockReferent.ATTR_MINNUMBER);
        if (str === null) 
            return 0;
        let i = 0;
        let wrapi1586 = new RefOutArgWrapper();
        let inoutres1587 = Utils.tryParseInt(str, wrapi1586);
        i = wrapi1586.value;
        if (inoutres1587) 
            return i;
        return 0;
    }
    /**
     * [Set] Минимальный номер, если задан диапазон
     */
    set min_number(_value) {
        this.add_slot(InstrumentBlockReferent.ATTR_MINNUMBER, _value.toString(), true, 0);
        return _value;
    }
    
    /**
     * [Get] Наименование
     */
    get name() {
        return this.get_string_value(InstrumentBlockReferent.ATTR_NAME);
    }
    /**
     * [Set] Наименование
     */
    set name(_value) {
        this.add_slot(InstrumentBlockReferent.ATTR_NAME, _value, true, 0);
        return _value;
    }
    
    /**
     * [Get] Внутреннее содержимое
     */
    get children() {
        if (this.m_children === null) {
            this.m_children = new Array();
            for (const s of this.slots) {
                if (s.type_name === InstrumentBlockReferent.ATTR_CHILD) {
                    if (s.value instanceof InstrumentBlockReferent) 
                        this.m_children.push(Utils.as(s.value, InstrumentBlockReferent));
                }
            }
        }
        return this.m_children;
    }
    
    add_slot(attr_name, attr_value, clear_old_value, stat_count = 0) {
        this.m_children = null;
        return super.add_slot(attr_name, attr_value, clear_old_value, stat_count);
    }
    
    can_be_equals(obj, typ = ReferentEqualType.WITHINONETEXT) {
        return obj === this;
    }
    
    static kind_to_rus_string(typ, short_val) {
        if (typ === InstrumentKind.APPENDIX) 
            return (short_val ? "прил." : "Приложение");
        if (typ === InstrumentKind.CLAUSE) 
            return (short_val ? "ст." : "Статья");
        if (typ === InstrumentKind.CHAPTER) 
            return (short_val ? "гл." : "Глава");
        if (typ === InstrumentKind.ITEM) 
            return (short_val ? "п." : "Пункт");
        if (typ === InstrumentKind.PARAGRAPH) 
            return (short_val ? "§" : "Параграф");
        if (typ === InstrumentKind.SUBPARAGRAPH) 
            return (short_val ? "подпарагр." : "Подпараграф");
        if (typ === InstrumentKind.DOCPART) 
            return (short_val ? "ч." : "Часть");
        if (typ === InstrumentKind.SECTION) 
            return (short_val ? "раздел" : "Раздел");
        if (typ === InstrumentKind.INTERNALDOCUMENT) 
            return "Документ";
        if (typ === InstrumentKind.SUBITEM) 
            return (short_val ? "пп." : "Подпункт");
        if (typ === InstrumentKind.SUBSECTION) 
            return (short_val ? "подразд." : "Подраздел");
        if (typ === InstrumentKind.CLAUSEPART) 
            return (short_val ? "ч." : "Часть");
        if (typ === InstrumentKind.INDENTION) 
            return (short_val ? "абз." : "Абзац");
        if (typ === InstrumentKind.PREAMBLE) 
            return (short_val ? "преамб." : "Преамбула");
        return null;
    }
    
    static static_constructor() {
        InstrumentBlockReferent.OBJ_TYPENAME = "INSTRBLOCK";
        InstrumentBlockReferent.ATTR_KIND = "KIND";
        InstrumentBlockReferent.ATTR_KIND2 = "KIND_SEC";
        InstrumentBlockReferent.ATTR_CHILD = "CHILD";
        InstrumentBlockReferent.ATTR_VALUE = "VALUE";
        InstrumentBlockReferent.ATTR_REF = "REF";
        InstrumentBlockReferent.ATTR_EXPIRED = "EXPIRED";
        InstrumentBlockReferent.ATTR_NAME = "NAME";
        InstrumentBlockReferent.ATTR_NUMBER = "NUMBER";
        InstrumentBlockReferent.ATTR_MINNUMBER = "MINNUMBER";
        InstrumentBlockReferent.ATTR_SUBNUMBER = "ADDNUMBER";
        InstrumentBlockReferent.ATTR_SUB2NUMBER = "ADDSECNUMBER";
        InstrumentBlockReferent.ATTR_SUB3NUMBER = "ADDTHIRDNUMBER";
    }
}


InstrumentBlockReferent.static_constructor();

module.exports = InstrumentBlockReferent