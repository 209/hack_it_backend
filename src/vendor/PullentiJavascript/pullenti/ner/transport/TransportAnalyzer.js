/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");

const Token = require("./../Token");
const MetaToken = require("./../MetaToken");
const Referent = require("./../Referent");
const BracketParseAttr = require("./../core/BracketParseAttr");
const TransItemTokenTyps = require("./internal/TransItemTokenTyps");
const TextToken = require("./../TextToken");
const TerminParseAttr = require("./../core/TerminParseAttr");
const GeoReferent = require("./../geo/GeoReferent");
const ReferentToken = require("./../ReferentToken");
const ProcessorService = require("./../ProcessorService");
const EpNerCoreInternalResourceHelper = require("./../core/internal/EpNerCoreInternalResourceHelper");
const TransportKind = require("./TransportKind");
const MetaTransport = require("./internal/MetaTransport");
const BracketHelper = require("./../core/BracketHelper");
const TerminCollection = require("./../core/TerminCollection");
const TransItemToken = require("./internal/TransItemToken");
const Analyzer = require("./../Analyzer");
const TransportReferent = require("./TransportReferent");
const Termin = require("./../core/Termin");

/**
 * Анализатор транспортных стредств
 */
class TransportAnalyzer extends Analyzer {
    
    get name() {
        return TransportAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Транспорт";
    }
    
    get description() {
        return "Техника, автомобили, самолёты, корабли...";
    }
    
    clone() {
        return new TransportAnalyzer();
    }
    
    get type_system() {
        return [MetaTransport.global_meta];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(TransportKind.FLY.toString(), EpNerCoreInternalResourceHelper.get_bytes("fly.png"));
        res.put(TransportKind.SHIP.toString(), EpNerCoreInternalResourceHelper.get_bytes("ship.png"));
        res.put(TransportKind.SPACE.toString(), EpNerCoreInternalResourceHelper.get_bytes("space.png"));
        res.put(TransportKind.TRAIN.toString(), EpNerCoreInternalResourceHelper.get_bytes("train.png"));
        res.put(TransportKind.AUTO.toString(), EpNerCoreInternalResourceHelper.get_bytes("auto.png"));
        res.put(MetaTransport.IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("transport.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === TransportReferent.OBJ_TYPENAME) 
            return new TransportReferent();
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
            let its = TransItemToken.try_parse_list(t, 10);
            if (its === null) 
                continue;
            let rts = this.try_attach(its, false);
            if (rts !== null) {
                for (const rt of rts) {
                    let cou = 0;
                    for (let tt = t.previous; tt !== null && (cou < 1000); tt = tt.previous,cou++) {
                        let tr = Utils.as(tt.get_referent(), TransportReferent);
                        if (tr === null) 
                            continue;
                        let ok = true;
                        for (const s of rt.referent.slots) {
                            if (tr.find_slot(s.type_name, s.value, true) === null) {
                                ok = false;
                                break;
                            }
                        }
                        if (ok) {
                            rt.referent = tr;
                            break;
                        }
                    }
                    rt.referent = ad.register_referent(rt.referent);
                    kit.embed_token(rt);
                    t = rt;
                    for (const s of rt.referent.slots) {
                        if (s.type_name === TransportReferent.ATTR_MODEL) {
                            let mod = s.value.toString();
                            for (let k = 0; k < 2; k++) {
                                if (!Utils.isDigit(mod[0])) {
                                    let li = [ ];
                                    let wrapli2695 = new RefOutArgWrapper();
                                    let inoutres2696 = objs_by_model.tryGetValue(mod, wrapli2695);
                                    li = wrapli2695.value;
                                    if (!inoutres2696) 
                                        objs_by_model.put(mod, (li = new Array()));
                                    if (!li.includes(rt.referent)) 
                                        li.push(rt.referent);
                                    models.add_str(mod, li, null, false);
                                }
                                if (k > 0) 
                                    break;
                                let brand = rt.referent.get_string_value(TransportReferent.ATTR_BRAND);
                                if (brand === null) 
                                    break;
                                mod = (brand + " " + mod);
                            }
                        }
                        else if (s.type_name === TransportReferent.ATTR_NAME) 
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
                let tit = TransItemToken.try_parse(tok.begin_token.previous, null, false, true);
                if (tit !== null && tit.typ === TransItemTokenTyps.BRAND) {
                    tr.add_slot(TransportReferent.ATTR_BRAND, tit.value, false, 0);
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
        let its = TransItemToken.try_parse_list(begin, 10);
        if (its === null) 
            return null;
        let rr = this.try_attach(its, true);
        if (rr !== null && rr.length > 0) 
            return rr[0];
        return null;
    }
    
    try_attach(its, attach) {
        let tr = new TransportReferent();
        let i = 0;
        let t1 = null;
        let brand_is_doubt = false;
        for (i = 0; i < its.length; i++) {
            if (its[i].typ === TransItemTokenTyps.NOUN) {
                if (tr.find_slot(TransportReferent.ATTR_TYPE, null, true) !== null) 
                    break;
                if (its[i].kind !== TransportKind.UNDEFINED) {
                    if (tr.kind !== TransportKind.UNDEFINED && its[i].kind !== tr.kind) 
                        break;
                    else 
                        tr.kind = its[i].kind;
                }
                tr.add_slot(TransportReferent.ATTR_TYPE, its[i].value, false, 0);
                if (its[i].alt_value !== null) 
                    tr.add_slot(TransportReferent.ATTR_TYPE, its[i].alt_value, false, 0);
                if (its[i].state !== null) 
                    tr.add_geo(its[i].state);
                t1 = its[i].end_token;
                continue;
            }
            if (its[i].typ === TransItemTokenTyps.GEO) {
                if (its[i].state !== null) 
                    tr.add_geo(its[i].state);
                else if (its[i].ref !== null) 
                    tr.add_geo(its[i].ref);
                t1 = its[i].end_token;
                continue;
            }
            if (its[i].typ === TransItemTokenTyps.BRAND) {
                if (tr.find_slot(TransportReferent.ATTR_BRAND, null, true) !== null) {
                    if (tr.find_slot(TransportReferent.ATTR_BRAND, its[i].value, true) === null) 
                        break;
                }
                if (its[i].kind !== TransportKind.UNDEFINED) {
                    if (tr.kind !== TransportKind.UNDEFINED && its[i].kind !== tr.kind) 
                        break;
                    else 
                        tr.kind = its[i].kind;
                }
                tr.add_slot(TransportReferent.ATTR_BRAND, its[i].value, false, 0);
                t1 = its[i].end_token;
                brand_is_doubt = its[i].is_doubt;
                continue;
            }
            if (its[i].typ === TransItemTokenTyps.MODEL) {
                if (tr.find_slot(TransportReferent.ATTR_MODEL, null, true) !== null) 
                    break;
                tr.add_slot(TransportReferent.ATTR_MODEL, its[i].value, false, 0);
                if (its[i].alt_value !== null) 
                    tr.add_slot(TransportReferent.ATTR_MODEL, its[i].alt_value, false, 0);
                t1 = its[i].end_token;
                continue;
            }
            if (its[i].typ === TransItemTokenTyps.CLASS) {
                if (tr.find_slot(TransportReferent.ATTR_CLASS, null, true) !== null) 
                    break;
                tr.add_slot(TransportReferent.ATTR_CLASS, its[i].value, false, 0);
                t1 = its[i].end_token;
                continue;
            }
            if (its[i].typ === TransItemTokenTyps.NAME) {
                if (tr.find_slot(TransportReferent.ATTR_NAME, null, true) !== null) 
                    break;
                tr.add_slot(TransportReferent.ATTR_NAME, its[i].value, false, 0);
                if (its[i].alt_value !== null) 
                    tr.add_slot(TransportReferent.ATTR_NAME, its[i].alt_value, false, 0);
                t1 = its[i].end_token;
                continue;
            }
            if (its[i].typ === TransItemTokenTyps.NUMBER) {
                if (tr.find_slot(TransportReferent.ATTR_NUMBER, null, true) !== null) 
                    break;
                if (its[i].kind !== TransportKind.UNDEFINED) {
                    if (tr.kind !== TransportKind.UNDEFINED && its[i].kind !== tr.kind) 
                        break;
                    else 
                        tr.kind = its[i].kind;
                }
                tr.add_slot(TransportReferent.ATTR_NUMBER, its[i].value, false, 0);
                if (its[i].alt_value !== null) 
                    tr.add_slot(TransportReferent.ATTR_NUMBER_REGION, its[i].alt_value, false, 0);
                t1 = its[i].end_token;
                continue;
            }
            if (its[i].typ === TransItemTokenTyps.ORG) {
                if (tr.find_slot(TransportReferent.ATTR_ORG, null, true) !== null) 
                    break;
                if (!its[i].morph._case.is_undefined && !its[i].morph._case.is_genitive) 
                    break;
                tr.add_slot(TransportReferent.ATTR_ORG, its[i].ref, true, 0);
                t1 = its[i].end_token;
                continue;
            }
            if (its[i].typ === TransItemTokenTyps.DATE) {
                if (tr.find_slot(TransportReferent.ATTR_DATE, null, true) !== null) 
                    break;
                tr.add_slot(TransportReferent.ATTR_DATE, its[i].ref, true, 0);
                t1 = its[i].end_token;
                continue;
            }
            if (its[i].typ === TransItemTokenTyps.ROUTE) {
                if (tr.find_slot(TransportReferent.ATTR_ROUTEPOINT, null, true) !== null) 
                    break;
                for (const o of its[i].route_items) {
                    tr.add_slot(TransportReferent.ATTR_ROUTEPOINT, o, false, 0);
                }
                t1 = its[i].end_token;
                continue;
            }
        }
        if (!tr.check(attach, brand_is_doubt)) 
            return null;
        let res = new Array();
        res.push(new ReferentToken(tr, its[0].begin_token, t1));
        if ((i < its.length) && tr.kind === TransportKind.SHIP && its[i - 1].typ === TransItemTokenTyps.NAME) {
            for (; i < its.length; i++) {
                if (its[i].typ !== TransItemTokenTyps.NAME || !its[i].is_after_conjunction) 
                    break;
                let tr1 = new TransportReferent();
                tr1.merge_slots(tr, true);
                tr1.add_slot(TransportReferent.ATTR_NAME, its[i].value, true, 0);
                res.push(new ReferentToken(tr1, its[i].begin_token, its[i].end_token));
            }
        }
        else if (i === its.length && its[its.length - 1].typ === TransItemTokenTyps.NUMBER) {
            for (let tt = t1.next; tt !== null; tt = tt.next) {
                if (!tt.is_comma_and) 
                    break;
                let nn = TransItemToken._attach_rus_auto_number(tt.next);
                if (nn === null) 
                    nn = TransItemToken._attach_number(tt.next, false);
                if (nn === null || nn.typ !== TransItemTokenTyps.NUMBER) 
                    break;
                let tr1 = new TransportReferent();
                for (const s of tr.slots) {
                    if (s.type_name !== TransportReferent.ATTR_NUMBER) {
                        if (s.type_name === TransportReferent.ATTR_NUMBER_REGION && nn.alt_value !== null) 
                            continue;
                        tr1.add_slot(s.type_name, s.value, false, 0);
                    }
                }
                tr1.add_slot(TransportReferent.ATTR_NUMBER, nn.value, true, 0);
                if (nn.alt_value !== null) 
                    tr1.add_slot(TransportReferent.ATTR_NUMBER_REGION, nn.alt_value, true, 0);
                res.push(new ReferentToken(tr1, nn.begin_token, nn.end_token));
                tt = nn.end_token;
            }
        }
        return res;
    }
    
    static initialize() {
        if (TransportAnalyzer.m_inited) 
            return;
        TransportAnalyzer.m_inited = true;
        MetaTransport.initialize();
        try {
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
            TransItemToken.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        } catch (ex) {
            throw new Error(ex.message);
        }
        ProcessorService.register_analyzer(new TransportAnalyzer());
    }
    
    static static_constructor() {
        TransportAnalyzer.ANALYZER_NAME = "TRANSPORT";
        TransportAnalyzer.m_inited = false;
    }
}


TransportAnalyzer.static_constructor();

module.exports = TransportAnalyzer