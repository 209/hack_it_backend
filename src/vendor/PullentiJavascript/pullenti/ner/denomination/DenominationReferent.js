/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const TextToken = require("./../TextToken");
const Referent = require("./../Referent");
const IntOntologyItem = require("./../core/IntOntologyItem");
const Termin = require("./../core/Termin");
const ReferentClass = require("./../ReferentClass");
const NumberToken = require("./../NumberToken");
const MetaDenom = require("./internal/MetaDenom");

/**
 * Сущность, моделирующая непонятные комбинации (например, Си++, СС-300)
 */
class DenominationReferent extends Referent {
    
    constructor() {
        super(DenominationReferent.OBJ_TYPENAME);
        this.m_names = null;
        this.instance_of = MetaDenom.global_meta;
    }
    
    /**
     * [Get] Значение (одно или несколько)
     */
    get value() {
        return this.get_string_value(DenominationReferent.ATTR_VALUE);
    }
    
    to_string(short_variant, lang = null, lev = 0) {
        return Utils.notNull(this.value, "?");
    }
    
    add_value(begin, end) {
        let tmp = new StringBuilder();
        for (let t = begin; t !== null && t.previous !== end; t = t.next) {
            if (t instanceof NumberToken) {
                tmp.append(t.get_source_text());
                continue;
            }
            if (t instanceof TextToken) {
                let s = (t).term;
                if (t.is_char_of("-\\/")) 
                    s = "-";
                tmp.append(s);
            }
        }
        for (let i = 0; i < tmp.length; i++) {
            if (tmp.charAt(i) === '-' && i > 0 && ((i + 1) < tmp.length)) {
                let ch0 = tmp.charAt(i - 1);
                let ch1 = tmp.charAt(i + 1);
                if (Utils.isLetterOrDigit(ch0) && Utils.isLetterOrDigit(ch1)) {
                    if (Utils.isDigit(ch0) && !Utils.isDigit(ch1)) 
                        tmp.remove(i, 1);
                    else if (!Utils.isDigit(ch0) && Utils.isDigit(ch1)) 
                        tmp.remove(i, 1);
                }
            }
        }
        this.add_slot(DenominationReferent.ATTR_VALUE, tmp.toString(), false, 0);
        this.m_names = null;
    }
    
    can_be_equals(obj, typ) {
        let dr = Utils.as(obj, DenominationReferent);
        if (dr === null) 
            return false;
        for (const n of this.name_vars) {
            if (dr.name_vars.includes(n)) 
                return true;
        }
        return false;
    }
    
    get name_vars() {
        if (this.m_names !== null) 
            return this.m_names;
        this.m_names = new Array();
        let nam = this.value;
        if (nam === null) 
            return this.m_names;
        this.m_names.push(nam);
        let items = new Array();
        let i = 0;
        let ty0 = 0;
        let i0 = 0;
        for (i = 0; i <= nam.length; i++) {
            let ty = 0;
            if (i < nam.length) {
                if (Utils.isDigit(nam[i])) 
                    ty = 1;
                else if (Utils.isLetter(nam[i])) 
                    ty = 2;
                else 
                    ty = 3;
            }
            if (ty !== ty0 || ty === 3) {
                if (i > i0) {
                    let vars = new Array();
                    let p = nam.substring(i0, i0 + i - i0);
                    DenominationReferent.add_vars(p, vars);
                    items.push(vars);
                    if (ty === 1 && ty0 === 2) {
                        vars = new Array();
                        vars.push("");
                        vars.push("-");
                        items.push(vars);
                    }
                }
                i0 = i;
                ty0 = ty;
            }
        }
        let inds = new Int32Array(items.length);
        for (i = 0; i < inds.length; i++) {
            inds[i] = 0;
        }
        let tmp = new StringBuilder();
        while (true) {
            tmp.length = 0;
            for (i = 0; i < items.length; i++) {
                tmp.append(items[i][inds[i]]);
            }
            let v = tmp.toString();
            if (!this.m_names.includes(v)) 
                this.m_names.push(v);
            if (this.m_names.length > 20) 
                break;
            for (i = inds.length - 1; i >= 0; i--) {
                inds[i]++;
                if (inds[i] < items[i].length) 
                    break;
            }
            if (i < 0) 
                break;
            for (++i; i < inds.length; i++) {
                inds[i] = 0;
            }
        }
        return this.m_names;
    }
    
    static add_vars(str, vars) {
        vars.push(str);
        for (let k = 0; k < 2; k++) {
            let i = 0;
            let tmp = new StringBuilder();
            for (i = 0; i < str.length; i++) {
                let v = null;
                let wrapv1121 = new RefOutArgWrapper();
                let inoutres1122 = DenominationReferent.m_var_chars.tryGetValue(str[i], wrapv1121);
                v = wrapv1121.value;
                if (!inoutres1122) 
                    break;
                if ((v.length < 2) || v[k] === '-') 
                    break;
                tmp.append(v[k]);
            }
            if (i >= str.length) {
                let v = tmp.toString();
                if (!vars.includes(v)) 
                    vars.push(v);
            }
        }
    }
    
    create_ontology_item() {
        let oi = new IntOntologyItem(this);
        for (const v of this.name_vars) {
            oi.termins.push(new Termin(v));
        }
        return oi;
    }
    
    static static_constructor() {
        DenominationReferent.OBJ_TYPENAME = "DENOMINATION";
        DenominationReferent.ATTR_VALUE = "VALUE";
        DenominationReferent.m_var_chars = null;
        DenominationReferent.m_var_chars = new Hashtable();
        DenominationReferent.m_var_chars.put('A', "АА");
        DenominationReferent.m_var_chars.put('B', "БВ");
        DenominationReferent.m_var_chars.put('C', "ЦС");
        DenominationReferent.m_var_chars.put('D', "ДД");
        DenominationReferent.m_var_chars.put('E', "ЕЕ");
        DenominationReferent.m_var_chars.put('F', "Ф-");
        DenominationReferent.m_var_chars.put('G', "Г-");
        DenominationReferent.m_var_chars.put('H', "ХН");
        DenominationReferent.m_var_chars.put('I', "И-");
        DenominationReferent.m_var_chars.put('J', "Ж-");
        DenominationReferent.m_var_chars.put('K', "КК");
        DenominationReferent.m_var_chars.put('L', "Л-");
        DenominationReferent.m_var_chars.put('M', "ММ");
        DenominationReferent.m_var_chars.put('N', "Н-");
        DenominationReferent.m_var_chars.put('O', "ОО");
        DenominationReferent.m_var_chars.put('P', "ПР");
        DenominationReferent.m_var_chars.put('Q', "--");
        DenominationReferent.m_var_chars.put('R', "Р-");
        DenominationReferent.m_var_chars.put('S', "С-");
        DenominationReferent.m_var_chars.put('T', "ТТ");
        DenominationReferent.m_var_chars.put('U', "У-");
        DenominationReferent.m_var_chars.put('V', "В-");
        DenominationReferent.m_var_chars.put('W', "В-");
        DenominationReferent.m_var_chars.put('X', "ХХ");
        DenominationReferent.m_var_chars.put('Y', "УУ");
        DenominationReferent.m_var_chars.put('Z', "З-");
        DenominationReferent.m_var_chars.put('А', "AA");
        DenominationReferent.m_var_chars.put('Б', "B-");
        DenominationReferent.m_var_chars.put('В', "VB");
        DenominationReferent.m_var_chars.put('Г', "G-");
        DenominationReferent.m_var_chars.put('Д', "D-");
        DenominationReferent.m_var_chars.put('Е', "EE");
        DenominationReferent.m_var_chars.put('Ж', "J-");
        DenominationReferent.m_var_chars.put('З', "Z-");
        DenominationReferent.m_var_chars.put('И', "I-");
        DenominationReferent.m_var_chars.put('Й', "Y-");
        DenominationReferent.m_var_chars.put('К', "KK");
        DenominationReferent.m_var_chars.put('Л', "L-");
        DenominationReferent.m_var_chars.put('М', "MM");
        DenominationReferent.m_var_chars.put('Н', "NH");
        DenominationReferent.m_var_chars.put('О', "OO");
        DenominationReferent.m_var_chars.put('П', "P-");
        DenominationReferent.m_var_chars.put('Р', "RP");
        DenominationReferent.m_var_chars.put('С', "SC");
        DenominationReferent.m_var_chars.put('Т', "TT");
        DenominationReferent.m_var_chars.put('У', "UY");
        DenominationReferent.m_var_chars.put('Ф', "F-");
        DenominationReferent.m_var_chars.put('Х', "HX");
        DenominationReferent.m_var_chars.put('Ц', "C-");
        DenominationReferent.m_var_chars.put('Ч', "--");
        DenominationReferent.m_var_chars.put('Ш', "--");
        DenominationReferent.m_var_chars.put('Щ', "--");
        DenominationReferent.m_var_chars.put('Ы', "--");
        DenominationReferent.m_var_chars.put('Э', "A-");
        DenominationReferent.m_var_chars.put('Ю', "U-");
        DenominationReferent.m_var_chars.put('Я', "--");
    }
}


DenominationReferent.static_constructor();

module.exports = DenominationReferent