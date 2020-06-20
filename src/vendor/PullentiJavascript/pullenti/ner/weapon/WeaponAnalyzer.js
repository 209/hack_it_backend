/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");

const BracketParseAttr = require("./../core/BracketParseAttr");
const Token = require("./../Token");
const MetaToken = require("./../MetaToken");
const BracketHelper = require("./../core/BracketHelper");
const TerminParseAttr = require("./../core/TerminParseAttr");
const Referent = require("./../Referent");
const WeaponItemTokenTyps = require("./internal/WeaponItemTokenTyps");
const ReferentToken = require("./../ReferentToken");
const TextToken = require("./../TextToken");
const Termin = require("./../core/Termin");
const MetaWeapon = require("./internal/MetaWeapon");
const EpNerCoreInternalResourceHelper = require("./../core/internal/EpNerCoreInternalResourceHelper");
const ProcessorService = require("./../ProcessorService");
const MeasureAnalyzer = require("./../measure/MeasureAnalyzer");
const WeaponReferent = require("./WeaponReferent");
const TerminCollection = require("./../core/TerminCollection");
const WeaponItemToken = require("./internal/WeaponItemToken");
const GeoReferent = require("./../geo/GeoReferent");
const Analyzer = require("./../Analyzer");

/**
 * Анализатор выделения оружия
 */
class WeaponAnalyzer extends Analyzer {
    
    get name() {
        return WeaponAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Оружие";
    }
    
    get description() {
        return "Оружие (пистолеты, пулемёты)";
    }
    
    clone() {
        return new WeaponAnalyzer();
    }
    
    get type_system() {
        return [MetaWeapon.global_meta];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaWeapon.IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("weapon.jpg"));
        return res;
    }
    
    create_referent(type) {
        if (type === WeaponReferent.OBJ_TYPENAME) 
            return new WeaponReferent();
        return null;
    }
    
    get used_extern_object_types() {
        return [GeoReferent.OBJ_TYPENAME, "ORGANIZATION"];
    }
    
    get progress_weight() {
        return 5;
    }
    
    process(kit) {
        let ad = kit.get_analyzer_data(this);
        let models = new TerminCollection();
        let objs_by_model = new Hashtable();
        let obj_by_names = new TerminCollection();
        for (let t = kit.first_token; t !== null; t = t.next) {
            let its = WeaponItemToken.try_parse_list(t, 10);
            if (its === null) 
                continue;
            let rts = this.try_attach(its, false);
            if (rts !== null) {
                for (const rt of rts) {
                    rt.referent = ad.register_referent(rt.referent);
                    kit.embed_token(rt);
                    t = rt;
                    for (const s of rt.referent.slots) {
                        if (s.type_name === WeaponReferent.ATTR_MODEL) {
                            let mod = s.value.toString();
                            for (let k = 0; k < 2; k++) {
                                if (!Utils.isDigit(mod[0])) {
                                    let li = [ ];
                                    let wrapli2797 = new RefOutArgWrapper();
                                    let inoutres2798 = objs_by_model.tryGetValue(mod, wrapli2797);
                                    li = wrapli2797.value;
                                    if (!inoutres2798) 
                                        objs_by_model.put(mod, (li = new Array()));
                                    if (!li.includes(rt.referent)) 
                                        li.push(rt.referent);
                                    models.add_str(mod, li, null, false);
                                }
                                if (k > 0) 
                                    break;
                                let brand = rt.referent.get_string_value(WeaponReferent.ATTR_BRAND);
                                if (brand === null) 
                                    break;
                                mod = (brand + " " + mod);
                            }
                        }
                        else if (s.type_name === WeaponReferent.ATTR_NAME) 
                            obj_by_names.add(Termin._new119(s.value.toString(), rt.referent));
                    }
                }
            }
        }
        if (objs_by_model.length === 0 && obj_by_names.termins.length === 0) 
            return;
        for (let t = kit.first_token; t !== null; t = t.next) {
            let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 10);
            if (br !== null) {
                let toks = obj_by_names.try_parse(t.next, TerminParseAttr.NO);
                if (toks !== null && toks.end_token.next === br.end_token) {
                    let rt0 = new ReferentToken(Utils.as(toks.termin.tag, Referent), br.begin_token, br.end_token);
                    kit.embed_token(rt0);
                    t = rt0;
                    continue;
                }
            }
            if (!((t instanceof TextToken))) 
                continue;
            if (!t.chars.is_letter) 
                continue;
            let tok = models.try_parse(t, TerminParseAttr.NO);
            if (tok === null) {
                if (!t.chars.is_all_lower) 
                    tok = obj_by_names.try_parse(t, TerminParseAttr.NO);
                if (tok === null) 
                    continue;
            }
            if (!tok.is_whitespace_after) {
                if (tok.end_token.next === null || !tok.end_token.next.is_char_of(",.)")) {
                    if (!BracketHelper.is_bracket(tok.end_token.next, false)) 
                        continue;
                }
            }
            let tr = null;
            let li = Utils.as(tok.termin.tag, Array);
            if (li !== null && li.length === 1) 
                tr = li[0];
            else 
                tr = Utils.as(tok.termin.tag, Referent);
            if (tr !== null) {
                let tit = WeaponItemToken.try_parse(tok.begin_token.previous, null, false, true);
                if (tit !== null && tit.typ === WeaponItemTokenTyps.BRAND) {
                    tr.add_slot(WeaponReferent.ATTR_BRAND, tit.value, false, 0);
                    tok.begin_token = tit.begin_token;
                }
                let rt0 = new ReferentToken(tr, tok.begin_token, tok.end_token);
                kit.embed_token(rt0);
                t = rt0;
                continue;
            }
        }
    }
    
    process_referent(begin, end) {
        let its = WeaponItemToken.try_parse_list(begin, 10);
        if (its === null) 
            return null;
        let rr = this.try_attach(its, true);
        if (rr !== null && rr.length > 0) 
            return rr[0];
        return null;
    }
    
    try_attach(its, attach) {
        let tr = new WeaponReferent();
        let i = 0;
        let t1 = null;
        let noun = null;
        let brand = null;
        let model = null;
        for (i = 0; i < its.length; i++) {
            if (its[i].typ === WeaponItemTokenTyps.NOUN) {
                if (its.length === 1) 
                    return null;
                if (tr.find_slot(WeaponReferent.ATTR_TYPE, null, true) !== null) {
                    if (tr.find_slot(WeaponReferent.ATTR_TYPE, its[i].value, true) === null) 
                        break;
                }
                if (!its[i].is_internal) 
                    noun = its[i];
                tr.add_slot(WeaponReferent.ATTR_TYPE, its[i].value, false, 0);
                if (its[i].alt_value !== null) 
                    tr.add_slot(WeaponReferent.ATTR_TYPE, its[i].alt_value, false, 0);
                t1 = its[i].end_token;
                continue;
            }
            if (its[i].typ === WeaponItemTokenTyps.BRAND) {
                if (tr.find_slot(WeaponReferent.ATTR_BRAND, null, true) !== null) {
                    if (tr.find_slot(WeaponReferent.ATTR_BRAND, its[i].value, true) === null) 
                        break;
                }
                if (!its[i].is_internal) {
                    if (noun !== null && noun.is_doubt) 
                        noun.is_doubt = false;
                }
                brand = its[i];
                tr.add_slot(WeaponReferent.ATTR_BRAND, its[i].value, false, 0);
                t1 = its[i].end_token;
                continue;
            }
            if (its[i].typ === WeaponItemTokenTyps.MODEL) {
                if (tr.find_slot(WeaponReferent.ATTR_MODEL, null, true) !== null) {
                    if (tr.find_slot(WeaponReferent.ATTR_MODEL, its[i].value, true) === null) 
                        break;
                }
                model = its[i];
                tr.add_slot(WeaponReferent.ATTR_MODEL, its[i].value, false, 0);
                if (its[i].alt_value !== null) 
                    tr.add_slot(WeaponReferent.ATTR_MODEL, its[i].alt_value, false, 0);
                t1 = its[i].end_token;
                continue;
            }
            if (its[i].typ === WeaponItemTokenTyps.NAME) {
                if (tr.find_slot(WeaponReferent.ATTR_NAME, null, true) !== null) 
                    break;
                tr.add_slot(WeaponReferent.ATTR_NAME, its[i].value, false, 0);
                if (its[i].alt_value !== null) 
                    tr.add_slot(WeaponReferent.ATTR_NAME, its[i].alt_value, false, 0);
                t1 = its[i].end_token;
                continue;
            }
            if (its[i].typ === WeaponItemTokenTyps.NUMBER) {
                if (tr.find_slot(WeaponReferent.ATTR_NUMBER, null, true) !== null) 
                    break;
                tr.add_slot(WeaponReferent.ATTR_NUMBER, its[i].value, false, 0);
                if (its[i].alt_value !== null) 
                    tr.add_slot(WeaponReferent.ATTR_NUMBER, its[i].alt_value, false, 0);
                t1 = its[i].end_token;
                continue;
            }
            if (its[i].typ === WeaponItemTokenTyps.CALIBER) {
                if (tr.find_slot(WeaponReferent.ATTR_CALIBER, null, true) !== null) 
                    break;
                tr.add_slot(WeaponReferent.ATTR_CALIBER, its[i].value, false, 0);
                if (its[i].alt_value !== null) 
                    tr.add_slot(WeaponReferent.ATTR_CALIBER, its[i].alt_value, false, 0);
                t1 = its[i].end_token;
                continue;
            }
            if (its[i].typ === WeaponItemTokenTyps.DEVELOPER) {
                tr.add_slot(WeaponReferent.ATTR_REF, its[i].ref, false, 0);
                t1 = its[i].end_token;
                continue;
            }
            if (its[i].typ === WeaponItemTokenTyps.DATE) {
                if (tr.find_slot(WeaponReferent.ATTR_DATE, null, true) !== null) 
                    break;
                tr.add_slot(WeaponReferent.ATTR_DATE, its[i].ref, true, 0);
                t1 = its[i].end_token;
                continue;
            }
        }
        let has_good_noun = (noun === null ? false : !noun.is_doubt);
        let prev = null;
        if (noun === null) {
            for (let tt = its[0].begin_token.previous; tt !== null; tt = tt.previous) {
                if ((((prev = Utils.as(tt.get_referent(), WeaponReferent)))) !== null) {
                    let add_slots = new Array();
                    for (const s of prev.slots) {
                        if (s.type_name === WeaponReferent.ATTR_TYPE) 
                            tr.add_slot(s.type_name, s.value, false, 0);
                        else if (s.type_name === WeaponReferent.ATTR_BRAND || s.type_name === WeaponReferent.ATTR_BRAND || s.type_name === WeaponReferent.ATTR_MODEL) {
                            if (tr.find_slot(s.type_name, null, true) === null) 
                                add_slots.push(s);
                        }
                    }
                    for (const s of add_slots) {
                        tr.add_slot(s.type_name, s.value, false, 0);
                    }
                    has_good_noun = true;
                    break;
                }
                else if ((tt instanceof TextToken) && ((!tt.chars.is_letter || tt.morph.class0.is_conjunction))) {
                }
                else 
                    break;
            }
        }
        if (noun === null && model !== null) {
            let cou = 0;
            for (let tt = its[0].begin_token.previous; tt !== null && (cou < 100); tt = tt.previous,cou++) {
                if ((((prev = Utils.as(tt.get_referent(), WeaponReferent)))) !== null) {
                    if (prev.find_slot(WeaponReferent.ATTR_MODEL, model.value, true) === null) 
                        continue;
                    let add_slots = new Array();
                    for (const s of prev.slots) {
                        if (s.type_name === WeaponReferent.ATTR_TYPE) 
                            tr.add_slot(s.type_name, s.value, false, 0);
                        else if (s.type_name === WeaponReferent.ATTR_BRAND || s.type_name === WeaponReferent.ATTR_BRAND) {
                            if (tr.find_slot(s.type_name, null, true) === null) 
                                add_slots.push(s);
                        }
                    }
                    for (const s of add_slots) {
                        tr.add_slot(s.type_name, s.value, false, 0);
                    }
                    has_good_noun = true;
                    break;
                }
            }
        }
        if (has_good_noun) {
        }
        else if (noun !== null) {
            if (model !== null || ((brand !== null && !brand.is_doubt))) {
            }
            else 
                return null;
        }
        else {
            if (model === null) 
                return null;
            let cou = 0;
            let ok = false;
            for (let tt = t1.previous; tt !== null && (cou < 20); tt = tt.previous,cou++) {
                if ((tt.is_value("ОРУЖИЕ", null) || tt.is_value("ВООРУЖЕНИЕ", null) || tt.is_value("ВЫСТРЕЛ", null)) || tt.is_value("ВЫСТРЕЛИТЬ", null)) {
                    ok = true;
                    break;
                }
            }
            if (!ok) 
                return null;
        }
        let res = new Array();
        res.push(new ReferentToken(tr, its[0].begin_token, t1));
        return res;
    }
    
    static initialize() {
        if (WeaponAnalyzer.m_inited) 
            return;
        WeaponAnalyzer.m_inited = true;
        MeasureAnalyzer.initialize();
        MetaWeapon.initialize();
        try {
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
            WeaponItemToken.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        } catch (ex) {
            throw new Error(ex.message);
        }
        ProcessorService.register_analyzer(new WeaponAnalyzer());
    }
    
    static static_constructor() {
        WeaponAnalyzer.ANALYZER_NAME = "WEAPON";
        WeaponAnalyzer.m_inited = false;
    }
}


WeaponAnalyzer.static_constructor();

module.exports = WeaponAnalyzer