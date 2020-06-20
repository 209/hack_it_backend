/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");

const DefinitionKind = require("./DefinitionKind");
const Referent = require("./../Referent");
const ReferentClass = require("./../ReferentClass");
const MetaDefin = require("./internal/MetaDefin");

/**
 * Сущность, моделирующая определение (утверждение, тезис)
 */
class DefinitionReferent extends Referent {
    
    constructor() {
        super(DefinitionReferent.OBJ_TYPENAME);
        this.instance_of = MetaDefin.global_meta;
    }
    
    /**
     * [Get] Термин
     */
    get termin() {
        return this.get_string_value(DefinitionReferent.ATTR_TERMIN);
    }
    
    /**
     * [Get] Дополнительный атрибут термина ("как наука", "в широком смысле" ...)
     */
    get termin_add() {
        return this.get_string_value(DefinitionReferent.ATTR_TERMIN_ADD);
    }
    
    /**
     * [Get] Собственно определение (правая часть)
     */
    get value() {
        return this.get_string_value(DefinitionReferent.ATTR_VALUE);
    }
    
    /**
     * [Get] Тип определение
     */
    get kind() {
        let s = this.get_string_value(DefinitionReferent.ATTR_KIND);
        if (s === null) 
            return DefinitionKind.UNDEFINED;
        try {
            let res = DefinitionKind.of(s);
            if (res instanceof DefinitionKind) 
                return DefinitionKind.of(res);
        } catch (ex1120) {
        }
        return DefinitionKind.UNDEFINED;
    }
    /**
     * [Set] Тип определение
     */
    set kind(_value) {
        this.add_slot(DefinitionReferent.ATTR_KIND, _value.toString(), true, 0);
        return _value;
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        let misc = this.get_string_value(DefinitionReferent.ATTR_TERMIN_ADD);
        if (misc === null) 
            misc = this.get_string_value(DefinitionReferent.ATTR_MISC);
        return ("[" + this.kind.toString() + "] " + (Utils.notNull(this.termin, "?")) + (misc === null ? "" : (" (" + misc + ")")) + " = " + (Utils.notNull(this.value, "?")));
    }
    
    can_be_equals(obj, typ) {
        let dr = Utils.as(obj, DefinitionReferent);
        if (dr === null) 
            return false;
        if (this.termin !== dr.termin) 
            return false;
        if (this.value !== dr.value) 
            return false;
        if (this.termin_add !== dr.termin_add) 
            return false;
        return true;
    }
    
    static _new1116(_arg1) {
        let res = new DefinitionReferent();
        res.kind = _arg1;
        return res;
    }
    
    static static_constructor() {
        DefinitionReferent.OBJ_TYPENAME = "THESIS";
        DefinitionReferent.ATTR_TERMIN = "TERMIN";
        DefinitionReferent.ATTR_TERMIN_ADD = "TERMINADD";
        DefinitionReferent.ATTR_VALUE = "VALUE";
        DefinitionReferent.ATTR_MISC = "MISC";
        DefinitionReferent.ATTR_KIND = "KIND";
        DefinitionReferent.ATTR_DECREE = "DECREE";
    }
}


DefinitionReferent.static_constructor();

module.exports = DefinitionReferent