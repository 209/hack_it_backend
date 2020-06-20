/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const Referent = require("./../Referent");
const NumberHelper = require("./../core/NumberHelper");
const ReferentEqualType = require("./../ReferentEqualType");
const FundsKind = require("./FundsKind");
const ReferentClass = require("./../ReferentClass");
const FundsMeta = require("./internal/FundsMeta");
const OrganizationReferent = require("./../org/OrganizationReferent");
const MiscHelper = require("./../core/MiscHelper");
const MoneyReferent = require("./../money/MoneyReferent");

/**
 * Ценные бумаги (акции, доли в уставном капитале и пр.)
 */
class FundsReferent extends Referent {
    
    constructor() {
        super(FundsReferent.OBJ_TYPENAME);
        this.instance_of = FundsMeta.GLOBAL_META;
    }
    
    to_string(short_variant, lang, lev = 0) {
        let res = new StringBuilder();
        if (this.typ !== null) 
            res.append(MiscHelper.convert_first_char_upper_and_other_lower(this.typ));
        else {
            let _kind = this.get_string_value(FundsReferent.ATTR_KIND);
            if (_kind !== null) 
                _kind = Utils.asString(FundsMeta.GLOBAL_META.kind_feature.convert_inner_value_to_outer_value(_kind, null));
            if (_kind !== null) 
                res.append(MiscHelper.convert_first_char_upper_and_other_lower(_kind));
            else 
                res.append("?");
        }
        if (this.source !== null) 
            res.append("; ").append(this.source.to_string(short_variant, lang, 0));
        if (this.count > 0) 
            res.append("; кол-во ").append(this.count);
        if (this.percent > 0) 
            res.append("; ").append(this.percent).append("%");
        if (!short_variant) {
            if (this.sum !== null) 
                res.append("; ").append(this.sum.to_string(false, lang, 0));
            if (this.price !== null) 
                res.append("; номинал ").append(this.price.to_string(false, lang, 0));
        }
        return res.toString();
    }
    
    get parent_referent() {
        return this.source;
    }
    
    /**
     * [Get] Классификатор ценной бумаги
     */
    get kind() {
        let s = this.get_string_value(FundsReferent.ATTR_KIND);
        if (s === null) 
            return FundsKind.UNDEFINED;
        try {
            let res = FundsKind.of(s);
            if (res instanceof FundsKind) 
                return FundsKind.of(res);
        } catch (ex450) {
        }
        return FundsKind.UNDEFINED;
    }
    /**
     * [Set] Классификатор ценной бумаги
     */
    set kind(value) {
        if (value !== FundsKind.UNDEFINED) 
            this.add_slot(FundsReferent.ATTR_KIND, value.toString(), true, 0);
        else 
            this.add_slot(FundsReferent.ATTR_KIND, null, true, 0);
        return value;
    }
    
    /**
     * [Get] Эмитент
     */
    get source() {
        return Utils.as(this.get_slot_value(FundsReferent.ATTR_SOURCE), OrganizationReferent);
    }
    /**
     * [Set] Эмитент
     */
    set source(value) {
        this.add_slot(FundsReferent.ATTR_SOURCE, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Тип (например, привелигированная акция)
     */
    get typ() {
        return this.get_string_value(FundsReferent.ATTR_TYPE);
    }
    /**
     * [Set] Тип (например, привелигированная акция)
     */
    set typ(value) {
        this.add_slot(FundsReferent.ATTR_TYPE, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Процент от общего количества
     */
    get percent() {
        let val = this.get_string_value(FundsReferent.ATTR_PERCENT);
        if (val === null) 
            return 0;
        let res = NumberHelper.string_to_double(val);
        if (res === null) 
            return 0;
        return res;
    }
    /**
     * [Set] Процент от общего количества
     */
    set percent(value) {
        if (value > 0) 
            this.add_slot(FundsReferent.ATTR_PERCENT, NumberHelper.double_to_string(value), true, 0);
        else 
            this.add_slot(FundsReferent.ATTR_PERCENT, null, true, 0);
        return value;
    }
    
    /**
     * [Get] Количество
     */
    get count() {
        let val = this.get_string_value(FundsReferent.ATTR_COUNT);
        if (val === null) 
            return 0;
        let v = 0;
        let wrapv451 = new RefOutArgWrapper();
        let inoutres452 = Utils.tryParseInt(val, wrapv451);
        v = wrapv451.value;
        if (!inoutres452) 
            return 0;
        return v;
    }
    /**
     * [Set] Количество
     */
    set count(value) {
        this.add_slot(FundsReferent.ATTR_COUNT, value.toString(), true, 0);
        return value;
    }
    
    /**
     * [Get] Сумма за все акции
     */
    get sum() {
        return Utils.as(this.get_slot_value(FundsReferent.ATTR_SUM), MoneyReferent);
    }
    /**
     * [Set] Сумма за все акции
     */
    set sum(value) {
        this.add_slot(FundsReferent.ATTR_SUM, value, true, 0);
        return value;
    }
    
    /**
     * [Get] Сумма за одну акцию
     */
    get price() {
        return Utils.as(this.get_slot_value(FundsReferent.ATTR_PRICE), MoneyReferent);
    }
    /**
     * [Set] Сумма за одну акцию
     */
    set price(value) {
        this.add_slot(FundsReferent.ATTR_PRICE, value, true, 0);
        return value;
    }
    
    can_be_equals(obj, _typ = ReferentEqualType.WITHINONETEXT) {
        let f = Utils.as(obj, FundsReferent);
        if (f === null) 
            return false;
        if (this.kind !== f.kind) 
            return false;
        if (this.typ !== null && f.typ !== null) {
            if (this.typ !== f.typ) 
                return false;
        }
        if (this.source !== f.source) 
            return false;
        if (this.count !== f.count) 
            return false;
        if (this.percent !== f.percent) 
            return false;
        if (this.sum !== f.sum) 
            return false;
        return true;
    }
    
    check_correct() {
        if (this.kind === FundsKind.UNDEFINED) 
            return false;
        for (const s of this.slots) {
            if (s.type_name !== FundsReferent.ATTR_TYPE && s.type_name !== FundsReferent.ATTR_KIND) 
                return true;
        }
        return false;
    }
    
    static static_constructor() {
        FundsReferent.OBJ_TYPENAME = "FUNDS";
        FundsReferent.ATTR_KIND = "KIND";
        FundsReferent.ATTR_TYPE = "TYPE";
        FundsReferent.ATTR_SOURCE = "SOURCE";
        FundsReferent.ATTR_PERCENT = "PERCENT";
        FundsReferent.ATTR_COUNT = "COUNT";
        FundsReferent.ATTR_SUM = "SUM";
        FundsReferent.ATTR_PRICE = "PRICE";
    }
}


FundsReferent.static_constructor();

module.exports = FundsReferent