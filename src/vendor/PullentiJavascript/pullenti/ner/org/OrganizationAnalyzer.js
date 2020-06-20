/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");
const RefOutArgWrapper = require("./../../unisharp/RefOutArgWrapper");
const StringBuilder = require("./../../unisharp/StringBuilder");

const MorphClass = require("./../../morph/MorphClass");
const CharsInfo = require("./../../morph/CharsInfo");
const TerminParseAttr = require("./../core/TerminParseAttr");
const MorphGender = require("./../../morph/MorphGender");
const BracketParseAttr = require("./../core/BracketParseAttr");
const MorphLang = require("./../../morph/MorphLang");
const NounPhraseHelper = require("./../core/NounPhraseHelper");
const TextAnnotation = require("./../TextAnnotation");
const NumberHelper = require("./../core/NumberHelper");
const NounPhraseParseAttr = require("./../core/NounPhraseParseAttr");
const MorphBaseInfo = require("./../../morph/MorphBaseInfo");
const Morphology = require("./../../morph/Morphology");
const OrgItemNumberToken = require("./internal/OrgItemNumberToken");
const MorphWordForm = require("./../../morph/MorphWordForm");
const MorphCase = require("./../../morph/MorphCase");
const AnalyzerData = require("./../core/AnalyzerData");
const MorphCollection = require("./../MorphCollection");
const NumberSpellingType = require("./../NumberSpellingType");
const OrgGlobal = require("./internal/OrgGlobal");
const MiscLocationHelper = require("./../geo/internal/MiscLocationHelper");
const OrgItemTerminTypes = require("./internal/OrgItemTerminTypes");
const LanguageHelper = require("./../../morph/LanguageHelper");
const NumberToken = require("./../NumberToken");
const MorphNumber = require("./../../morph/MorphNumber");
const Termin = require("./../core/Termin");
const GeoReferent = require("./../geo/GeoReferent");
const TerminCollection = require("./../core/TerminCollection");
const IntOntologyCollection = require("./../core/IntOntologyCollection");
const ProcessorService = require("./../ProcessorService");
const AnalyzerDataWithOntology = require("./../core/AnalyzerDataWithOntology");
const MetaOrganization = require("./internal/MetaOrganization");
const EpNerCoreInternalResourceHelper = require("./../core/internal/EpNerCoreInternalResourceHelper");
const OrgProfile = require("./OrgProfile");
const OrganizationKind = require("./OrganizationKind");
const ReferentEqualType = require("./../ReferentEqualType");
const AddressReferent = require("./../address/AddressReferent");
const OrganizationReferent = require("./OrganizationReferent");
const Token = require("./../Token");
const GetTextAttr = require("./../core/GetTextAttr");
const Referent = require("./../Referent");
const OrganizationAnalyzerAttachType = require("./OrganizationAnalyzerAttachType");
const TextToken = require("./../TextToken");
const MetaToken = require("./../MetaToken");
const ReferentToken = require("./../ReferentToken");
const MiscHelper = require("./../core/MiscHelper");
const Analyzer = require("./../Analyzer");
const OrgItemTypeToken = require("./internal/OrgItemTypeToken");
const BracketHelper = require("./../core/BracketHelper");
const OrgOwnershipHelper = require("./internal/OrgOwnershipHelper");

class OrganizationAnalyzer extends Analyzer {
    
    constructor() {
        super();
        this.text_starts_with_number = false;
    }
    
    get name() {
        return OrganizationAnalyzer.ANALYZER_NAME;
    }
    
    clone() {
        return new OrganizationAnalyzer();
    }
    
    get caption() {
        return "Организации";
    }
    
    get description() {
        return "Организации, предприятия, компании...";
    }
    
    get type_system() {
        return [MetaOrganization.global_meta];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(OrgProfile.UNIT.toString(), EpNerCoreInternalResourceHelper.get_bytes("dep.png"));
        res.put(OrgProfile.UNION.toString(), EpNerCoreInternalResourceHelper.get_bytes("party.png"));
        res.put(OrgProfile.COMPETITION.toString(), EpNerCoreInternalResourceHelper.get_bytes("festival.png"));
        res.put(OrgProfile.HOLDING.toString(), EpNerCoreInternalResourceHelper.get_bytes("holding.png"));
        res.put(OrgProfile.STATE.toString(), EpNerCoreInternalResourceHelper.get_bytes("gov.png"));
        res.put(OrgProfile.FINANCE.toString(), EpNerCoreInternalResourceHelper.get_bytes("bank.png"));
        res.put(OrgProfile.EDUCATION.toString(), EpNerCoreInternalResourceHelper.get_bytes("study.png"));
        res.put(OrgProfile.SCIENCE.toString(), EpNerCoreInternalResourceHelper.get_bytes("science.png"));
        res.put(OrgProfile.INDUSTRY.toString(), EpNerCoreInternalResourceHelper.get_bytes("factory.png"));
        res.put(OrgProfile.TRADE.toString(), EpNerCoreInternalResourceHelper.get_bytes("trade.png"));
        res.put(OrgProfile.POLICY.toString(), EpNerCoreInternalResourceHelper.get_bytes("politics.png"));
        res.put(OrgProfile.JUSTICE.toString(), EpNerCoreInternalResourceHelper.get_bytes("justice.png"));
        res.put(OrgProfile.ENFORCEMENT.toString(), EpNerCoreInternalResourceHelper.get_bytes("gov.png"));
        res.put(OrgProfile.ARMY.toString(), EpNerCoreInternalResourceHelper.get_bytes("military.png"));
        res.put(OrgProfile.SPORT.toString(), EpNerCoreInternalResourceHelper.get_bytes("sport.png"));
        res.put(OrgProfile.RELIGION.toString(), EpNerCoreInternalResourceHelper.get_bytes("church.png"));
        res.put(OrgProfile.MUSIC.toString(), EpNerCoreInternalResourceHelper.get_bytes("music.png"));
        res.put(OrgProfile.MEDIA.toString(), EpNerCoreInternalResourceHelper.get_bytes("media.png"));
        res.put(OrgProfile.PRESS.toString(), EpNerCoreInternalResourceHelper.get_bytes("press.png"));
        res.put(OrgProfile.HOTEL.toString(), EpNerCoreInternalResourceHelper.get_bytes("hotel.png"));
        res.put(OrgProfile.MEDICINE.toString(), EpNerCoreInternalResourceHelper.get_bytes("medicine.png"));
        res.put(OrgProfile.TRANSPORT.toString(), EpNerCoreInternalResourceHelper.get_bytes("train.png"));
        res.put(OrganizationKind.BANK.toString(), EpNerCoreInternalResourceHelper.get_bytes("bank.png"));
        res.put(OrganizationKind.CULTURE.toString(), EpNerCoreInternalResourceHelper.get_bytes("culture.png"));
        res.put(OrganizationKind.DEPARTMENT.toString(), EpNerCoreInternalResourceHelper.get_bytes("dep.png"));
        res.put(OrganizationKind.FACTORY.toString(), EpNerCoreInternalResourceHelper.get_bytes("factory.png"));
        res.put(OrganizationKind.GOVENMENT.toString(), EpNerCoreInternalResourceHelper.get_bytes("gov.png"));
        res.put(OrganizationKind.MEDICAL.toString(), EpNerCoreInternalResourceHelper.get_bytes("medicine.png"));
        res.put(OrganizationKind.PARTY.toString(), EpNerCoreInternalResourceHelper.get_bytes("party.png"));
        res.put(OrganizationKind.STUDY.toString(), EpNerCoreInternalResourceHelper.get_bytes("study.png"));
        res.put(OrganizationKind.FEDERATION.toString(), EpNerCoreInternalResourceHelper.get_bytes("federation.png"));
        res.put(OrganizationKind.CHURCH.toString(), EpNerCoreInternalResourceHelper.get_bytes("church.png"));
        res.put(OrganizationKind.MILITARY.toString(), EpNerCoreInternalResourceHelper.get_bytes("military.png"));
        res.put(OrganizationKind.AIRPORT.toString(), EpNerCoreInternalResourceHelper.get_bytes("avia.png"));
        res.put(OrganizationKind.FESTIVAL.toString(), EpNerCoreInternalResourceHelper.get_bytes("festival.png"));
        res.put(MetaOrganization.ORG_IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("org.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === OrganizationReferent.OBJ_TYPENAME) 
            return new OrganizationReferent();
        return null;
    }
    
    get used_extern_object_types() {
        return [GeoReferent.OBJ_TYPENAME, AddressReferent.OBJ_TYPENAME];
    }
    
    get progress_weight() {
        return 45;
    }
    
    create_analyzer_data() {
        return new OrganizationAnalyzer.OrgAnalyzerData();
    }
    
    process(kit) {
        let ad = Utils.as(kit.get_analyzer_data(this), OrganizationAnalyzer.OrgAnalyzerData);
        if (kit.sofa.text.length > 400000) 
            ad.large_text_regim = true;
        else 
            ad.large_text_regim = false;
        for (let t = kit.first_token; t !== null; t = t.next) {
            t.inner_bool = false;
        }
        let steps = 2;
        let max = steps;
        let delta = 100000;
        let parts = Utils.intDiv(((kit.sofa.text.length + delta) - 1), delta);
        if (parts === 0) 
            parts = 1;
        max *= parts;
        let cur = 0;
        for (let step = 0; step < steps; step++) {
            let next_pos = delta;
            for (let t = kit.first_token; t !== null; t = t.next) {
                if (t.begin_char > next_pos) {
                    next_pos += delta;
                    cur++;
                    if (!this.on_progress(cur, max, kit)) 
                        return;
                }
                if (step > 0 && (t instanceof ReferentToken) && (t.get_referent() instanceof OrganizationReferent)) {
                    let mt = OrganizationAnalyzer._check_alias_after(Utils.as(t, ReferentToken), t.next);
                    if (mt !== null) {
                        if (ad !== null) {
                            let term = new Termin();
                            term.init_by(mt.begin_token, mt.end_token.previous, t.get_referent(), false);
                            ad.aliases.add(term);
                        }
                        let rt = new ReferentToken(t.get_referent(), t, mt.end_token);
                        kit.embed_token(rt);
                        t = rt;
                    }
                }
                while (true) {
                    let rts = this.try_attach_orgs(t, ad, step);
                    if (rts === null || rts.length === 0) 
                        break;
                    if (!MetaToken.check(rts)) 
                        break;
                    let emb = false;
                    for (const rt of rts) {
                        if (!(rt.referent).check_correction()) 
                            continue;
                        rt.referent = ad.register_referent(rt.referent);
                        if (rt.begin_token.get_referent() === rt.referent || rt.end_token.get_referent() === rt.referent) 
                            continue;
                        kit.embed_token(rt);
                        emb = true;
                        if (rt.begin_char <= t.begin_char) 
                            t = rt;
                    }
                    if ((rts.length === 1 && t === rts[0] && (t.next instanceof ReferentToken)) && (t.next.get_referent() instanceof OrganizationReferent)) {
                        let org0 = Utils.as(rts[0].referent, OrganizationReferent);
                        let org1 = Utils.as(t.next.get_referent(), OrganizationReferent);
                        if (org1.higher === null && OrgOwnershipHelper.can_be_higher(org0, org1, false) && !OrgOwnershipHelper.can_be_higher(org1, org0, false)) {
                            let rtt = Utils.as(t.next, ReferentToken);
                            kit.debed_token(rtt);
                            org1.higher = org0;
                            let rt1 = ReferentToken._new743(ad.register_referent(org1), t, rtt.end_token, t.next.morph);
                            kit.embed_token(rt1);
                            t = rt1;
                        }
                    }
                    if (emb && !((t instanceof ReferentToken))) 
                        continue;
                    break;
                }
                if (step > 0) {
                    let rt = this.check_ownership(t);
                    if (rt !== null) {
                        kit.embed_token(rt);
                        t = rt;
                    }
                }
                if ((t instanceof ReferentToken) && (t.get_referent() instanceof OrganizationReferent)) {
                    let rt0 = Utils.as(t, ReferentToken);
                    while (rt0 !== null) {
                        rt0 = this.try_attach_org_before(rt0, ad);
                        if (rt0 === null) 
                            break;
                        this._do_post_analyze(rt0, ad);
                        rt0.referent = ad.register_referent(rt0.referent);
                        kit.embed_token(rt0);
                        t = rt0;
                    }
                }
                if (step > 0 && (t instanceof ReferentToken) && (t.get_referent() instanceof OrganizationReferent)) {
                    let mt = OrganizationAnalyzer._check_alias_after(Utils.as(t, ReferentToken), t.next);
                    if (mt !== null) {
                        if (ad !== null) {
                            let term = new Termin();
                            term.init_by(mt.begin_token, mt.end_token.previous, t.get_referent(), false);
                            ad.aliases.add(term);
                        }
                        let rt = new ReferentToken(t.get_referent(), t, mt.end_token);
                        kit.embed_token(rt);
                        t = rt;
                    }
                }
            }
            if (ad.referents.length === 0) {
                if (!kit.misc_data.containsKey("o2step")) 
                    break;
            }
        }
        let list = new Array();
        for (let t = kit.first_token; t !== null; t = t.next) {
            let _org = Utils.as(t.get_referent(), OrganizationReferent);
            if (_org === null) 
                continue;
            let t1 = t.next;
            if (((t1 !== null && t1.is_char('(') && t1.next !== null) && (t1.next.get_referent() instanceof OrganizationReferent) && t1.next.next !== null) && t1.next.next.is_char(')')) {
                let org0 = Utils.as(t1.next.get_referent(), OrganizationReferent);
                if (org0 === _org || _org.higher === org0) {
                    let rt1 = ReferentToken._new743(_org, t, t1.next.next, t.morph);
                    kit.embed_token(rt1);
                    t = rt1;
                    t1 = t.next;
                }
                else if (_org.higher === null && OrgOwnershipHelper.can_be_higher(org0, _org, false) && !OrgOwnershipHelper.can_be_higher(_org, org0, false)) {
                    _org.higher = org0;
                    let rt1 = ReferentToken._new743(_org, t, t1.next.next, t.morph);
                    kit.embed_token(rt1);
                    t = rt1;
                    t1 = t.next;
                }
            }
            let of_tok = null;
            if (t1 !== null) {
                if (t1.is_char_of(",") || t1.is_hiphen) 
                    t1 = t1.next;
                else if (!kit.onto_regime && t1.is_char(';')) 
                    t1 = t1.next;
                else if (t1.is_value("ПРИ", null) || t1.is_value("OF", null) || t1.is_value("AT", null)) {
                    of_tok = Utils.as(t1, TextToken);
                    t1 = t1.next;
                }
            }
            if (t1 === null) 
                break;
            let org1 = Utils.as(t1.get_referent(), OrganizationReferent);
            if (org1 === null) 
                continue;
            if (of_tok === null) {
                if (_org.higher === null) {
                    if (!OrgOwnershipHelper.can_be_higher(org1, _org, false)) {
                        if (t1.previous !== t || t1.whitespaces_after_count > 2) 
                            continue;
                        let pp = t.kit.process_referent("PERSON", t1.next);
                        if (pp !== null) {
                        }
                        else 
                            continue;
                    }
                }
            }
            if (_org.higher !== null) {
                if (!_org.higher.can_be_equals(org1, ReferentEqualType.WITHINONETEXT)) 
                    continue;
            }
            list.splice(0, list.length);
            list.push(Utils.as(t, ReferentToken));
            list.push(Utils.as(t1, ReferentToken));
            if (of_tok !== null && _org.higher === null) {
                for (let t2 = t1.next; t2 !== null; t2 = t2.next) {
                    if (((t2 instanceof TextToken) && (t2).term === of_tok.term && t2.next !== null) && (t2.next.get_referent() instanceof OrganizationReferent)) {
                        t2 = t2.next;
                        if (org1.higher !== null) {
                            if (!org1.higher.can_be_equals(t2.get_referent(), ReferentEqualType.WITHINONETEXT)) 
                                break;
                        }
                        list.push(Utils.as(t2, ReferentToken));
                        org1 = Utils.as(t2.get_referent(), OrganizationReferent);
                    }
                    else 
                        break;
                }
            }
            let rt0 = list[list.length - 1];
            for (let i = list.length - 2; i >= 0; i--) {
                _org = Utils.as(list[i].referent, OrganizationReferent);
                org1 = Utils.as(rt0.referent, OrganizationReferent);
                if (_org.higher === null) {
                    _org.higher = org1;
                    _org = Utils.as(ad.register_referent(_org), OrganizationReferent);
                }
                let rt = new ReferentToken(_org, list[i], rt0);
                kit.embed_token(rt);
                t = rt;
                rt0 = rt;
            }
        }
        let owners = new Hashtable();
        for (let t = kit.first_token; t !== null; t = t.next) {
            let _org = Utils.as(t.get_referent(), OrganizationReferent);
            if (_org === null) 
                continue;
            let hi = _org.higher;
            if (hi === null) 
                continue;
            for (const ty of _org.types) {
                let li = [ ];
                let wrapli2338 = new RefOutArgWrapper();
                let inoutres2339 = owners.tryGetValue(ty, wrapli2338);
                li = wrapli2338.value;
                if (!inoutres2339) 
                    owners.put(ty, (li = new Array()));
                let childs = null;
                if (!li.includes(hi)) {
                    li.push(hi);
                    hi.tag = (childs = new Array());
                }
                else 
                    childs = Utils.as(hi.tag, Array);
                if (childs !== null && !childs.includes(_org)) 
                    childs.push(_org);
            }
        }
        let owns = new Array();
        let last_mvd_org = null;
        for (let t = kit.first_token; t !== null; t = t.next) {
            let _org = Utils.as(t.get_referent(), OrganizationReferent);
            if (_org === null) 
                continue;
            if (OrganizationAnalyzer._is_mvd_org(_org) !== null) 
                last_mvd_org = t;
            if (_org.higher !== null) 
                continue;
            owns.splice(0, owns.length);
            for (const ty of _org.types) {
                let li = [ ];
                let wrapli2340 = new RefOutArgWrapper();
                let inoutres2341 = owners.tryGetValue(ty, wrapli2340);
                li = wrapli2340.value;
                if (!inoutres2341) 
                    continue;
                for (const h of li) {
                    if (!owns.includes(h)) 
                        owns.push(h);
                }
            }
            if (owns.length !== 1) 
                continue;
            if (OrgOwnershipHelper.can_be_higher(owns[0], _org, true)) {
                let childs = Utils.as(owns[0].tag, Array);
                if (childs === null) 
                    continue;
                let has_num = false;
                let has_geo = false;
                for (const oo of childs) {
                    if (oo.find_slot(OrganizationReferent.ATTR_GEO, null, true) !== null) 
                        has_geo = true;
                    if (oo.find_slot(OrganizationReferent.ATTR_NUMBER, null, true) !== null) 
                        has_num = true;
                }
                if (has_num !== ((_org.find_slot(OrganizationReferent.ATTR_NUMBER, null, true) !== null))) 
                    continue;
                if (has_geo !== ((_org.find_slot(OrganizationReferent.ATTR_GEO, null, true) !== null))) 
                    continue;
                _org.higher = owns[0];
                if (_org.kind !== OrganizationKind.DEPARTMENT) 
                    _org.higher = null;
            }
        }
        for (let t = last_mvd_org; t !== null; t = t.previous) {
            if (!((t instanceof ReferentToken))) 
                continue;
            let mvd = OrganizationAnalyzer._is_mvd_org(Utils.as(t.get_referent(), OrganizationReferent));
            if (mvd === null) 
                continue;
            let t1 = null;
            let br = false;
            for (let tt = t.previous; tt !== null; tt = tt.previous) {
                if (tt.is_char(')')) {
                    br = true;
                    continue;
                }
                if (br) {
                    if (tt.is_char('(')) 
                        br = false;
                    continue;
                }
                if (!((tt instanceof TextToken))) 
                    break;
                if (tt.length_char < 2) 
                    continue;
                if (tt.chars.is_all_upper || ((!tt.chars.is_all_upper && !tt.chars.is_all_lower && !tt.chars.is_capital_upper))) 
                    t1 = tt;
                break;
            }
            if (t1 === null) 
                continue;
            let t0 = t1;
            if ((t0.previous instanceof TextToken) && (t0.whitespaces_before_count < 2) && t0.previous.length_char >= 2) {
                if (t0.previous.chars.is_all_upper || ((!t0.previous.chars.is_all_upper && !t0.previous.chars.is_all_lower && !t0.previous.chars.is_capital_upper))) 
                    t0 = t0.previous;
            }
            let nam = MiscHelper.get_text_value(t0, t1, GetTextAttr.NO);
            if ((nam === "ОВД" || nam === "ГУВД" || nam === "УВД") || nam === "ГУ") 
                continue;
            let mc = t0.get_morph_class_in_dictionary();
            if (!mc.is_undefined) 
                continue;
            mc = t1.get_morph_class_in_dictionary();
            if (!mc.is_undefined) 
                continue;
            let _org = new OrganizationReferent();
            _org.add_profile(OrgProfile.UNIT);
            _org.add_name(nam, true, null);
            _org.higher = mvd;
            let rt = new ReferentToken(ad.register_referent(_org), t0, t1);
            kit.embed_token(rt);
            t = rt.next;
            if (t === null) 
                break;
        }
    }
    
    static _is_mvd_org(_org) {
        if (_org === null) 
            return null;
        let res = null;
        for (let i = 0; i < 5; i++) {
            if (res === null) {
                for (const s of _org.slots) {
                    if (s.type_name === OrganizationReferent.ATTR_TYPE) {
                        res = _org;
                        break;
                    }
                }
            }
            if (_org.find_slot(OrganizationReferent.ATTR_NAME, "МВД", true) !== null || _org.find_slot(OrganizationReferent.ATTR_NAME, "ФСБ", true) !== null) 
                return (res != null ? res : _org);
            _org = _org.higher;
            if (_org === null) 
                break;
        }
        return null;
    }
    
    static _check_alias_after(rt, t) {
        if ((t !== null && t.is_char('<') && t.next !== null) && t.next.next !== null && t.next.next.is_char('>')) 
            t = t.next.next.next;
        if (t === null || t.next === null || !t.is_char('(')) 
            return null;
        t = t.next;
        if (t.is_value("ДАЛЕЕ", null) || t.is_value("ДАЛІ", null)) 
            t = t.next;
        else if (t.is_value("HEREINAFTER", null) || t.is_value("ABBREVIATED", null) || t.is_value("HEREAFTER", null)) {
            t = t.next;
            if (t !== null && t.is_value("REFER", null)) 
                t = t.next;
        }
        else 
            return null;
        while (t !== null) {
            if (!((t instanceof TextToken))) 
                break;
            else if (!t.chars.is_letter) 
                t = t.next;
            else if (t.morph.class0.is_preposition || t.morph.class0.is_misc || t.is_value("ИМЕНОВАТЬ", null)) 
                t = t.next;
            else 
                break;
        }
        if (t === null) 
            return null;
        let t1 = null;
        for (let tt = t; tt !== null; tt = tt.next) {
            if (tt.is_newline_before) 
                break;
            else if (tt.is_char(')')) {
                t1 = tt.previous;
                break;
            }
        }
        if (t1 === null) 
            return null;
        let mt = new MetaToken(t, t1.next);
        let nam = MiscHelper.get_text_value(t, t1, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
        mt.tag = nam;
        if (nam.indexOf(' ') < 0) {
            for (let tt = rt.begin_token; tt !== null && tt.end_char <= rt.end_char; tt = tt.next) {
                if (tt.is_value(Utils.asString(mt.tag), null)) 
                    return mt;
            }
            return null;
        }
        return mt;
    }
    
    process_referent(begin, end) {
        const OrgItemEngItem = require("./internal/OrgItemEngItem");
        if (begin === null) 
            return null;
        if (begin.kit.recurse_level > 2) 
            return null;
        begin.kit.recurse_level++;
        let rt = this.try_attach_org(begin, null, OrganizationAnalyzerAttachType.NORMAL, null, false, 0, -1);
        if (rt === null) 
            rt = OrgItemEngItem.try_attach_org(begin, false);
        if (rt === null) 
            rt = OrgItemEngItem.try_attach_org(begin, true);
        if (rt === null) 
            rt = OrgItemTypeToken.try_attach_reference_to_exist_org(begin);
        begin.kit.recurse_level--;
        if (rt === null) 
            return null;
        rt.data = begin.kit.get_analyzer_data(this);
        return rt;
    }
    
    try_attach_orgs(t, ad, step) {
        const OrgItemEngItem = require("./internal/OrgItemEngItem");
        const OrgItemNameToken = require("./internal/OrgItemNameToken");
        if (t === null) 
            return null;
        if (ad !== null && ad.local_ontology.items.length > 1000) 
            ad = null;
        if (t.chars.is_latin_letter && MiscHelper.is_eng_article(t)) {
            let res11 = this.try_attach_orgs(t.next, ad, step);
            if (res11 !== null && res11.length > 0) {
                res11[0].begin_token = t;
                return res11;
            }
        }
        let rt = null;
        let typ = null;
        if (step === 0 || t.inner_bool) {
            typ = OrgItemTypeToken.try_attach(t, false, null);
            if (typ !== null) 
                t.inner_bool = true;
            if (typ === null || typ.chars.is_latin_letter) {
                let ltyp = OrgItemEngItem.try_attach(t, false);
                if (ltyp !== null) 
                    t.inner_bool = true;
                else if (t.chars.is_latin_letter) {
                    let rte = OrgItemEngItem.try_attach_org(t, false);
                    if (rte !== null) {
                        this._do_post_analyze(rte, ad);
                        let ree = new Array();
                        ree.push(rte);
                        return ree;
                    }
                }
            }
        }
        let rt00 = this.try_attach_spec(t, ad);
        if (rt00 === null) 
            rt00 = this._try_attach_org_by_alias(t, ad);
        if (rt00 !== null) {
            let res0 = new Array();
            this._do_post_analyze(rt00, ad);
            res0.push(rt00);
            return res0;
        }
        if (typ !== null) {
            if (typ.root === null || !typ.root.is_pure_prefix) {
                if ((((typ.morph.number.value()) & (MorphNumber.PLURAL.value()))) !== (MorphNumber.UNDEFINED.value())) {
                    let t1 = typ.end_token;
                    let ok = true;
                    let ok1 = false;
                    if (t1.next !== null && t1.next.is_char(',')) {
                        t1 = t1.next;
                        ok1 = true;
                        if (t1.next !== null && t1.next.is_value("КАК", null)) 
                            t1 = t1.next;
                        else 
                            ok = false;
                    }
                    if (t1.next !== null && t1.next.is_value("КАК", null)) {
                        t1 = t1.next;
                        ok1 = true;
                    }
                    if (t1.next !== null && t1.next.is_char(':')) 
                        t1 = t1.next;
                    if (t1 === t && t1.is_newline_after) 
                        ok = false;
                    rt = null;
                    if (ok) {
                        if (!ok1 && typ.coef > 0) 
                            ok1 = true;
                        if (ok1) 
                            rt = this.try_attach_org(t1.next, ad, OrganizationAnalyzerAttachType.MULTIPLE, typ, false, 0, -1);
                    }
                    if (rt !== null) {
                        this._do_post_analyze(rt, ad);
                        let res = new Array();
                        res.push(rt);
                        let _org = Utils.as(rt.referent, OrganizationReferent);
                        if (ok1) 
                            rt.begin_token = t;
                        t1 = rt.end_token.next;
                        ok = true;
                        for (; t1 !== null; t1 = t1.next) {
                            if (t1.is_newline_before) {
                                ok = false;
                                break;
                            }
                            let last = false;
                            if (t1.is_char(',')) {
                            }
                            else if (t1.is_and || t1.is_or) 
                                last = true;
                            else {
                                if (res.length < 2) 
                                    ok = false;
                                break;
                            }
                            t1 = t1.next;
                            let typ1 = OrgItemTypeToken.try_attach(t1, true, ad);
                            if (typ1 !== null) {
                                ok = false;
                                break;
                            }
                            rt = this.try_attach_org(t1, ad, OrganizationAnalyzerAttachType.MULTIPLE, typ, false, 0, -1);
                            if (rt !== null && rt.begin_token === rt.end_token) {
                                if (!rt.begin_token.get_morph_class_in_dictionary().is_undefined && rt.begin_token.chars.is_all_upper) 
                                    rt = null;
                            }
                            if (rt === null) {
                                if (res.length < 2) 
                                    ok = false;
                                break;
                            }
                            this._do_post_analyze(rt, ad);
                            res.push(rt);
                            if (res.length > 100) {
                                ok = false;
                                break;
                            }
                            _org = Utils.as(rt.referent, OrganizationReferent);
                            _org.add_type(typ, false);
                            if (last) 
                                break;
                            t1 = rt.end_token;
                        }
                        if (ok && res.length > 1) 
                            return res;
                    }
                }
            }
        }
        rt = null;
        if (typ !== null && ((typ.is_dep || typ.can_be_dep_before_organization))) {
            rt = this.try_attach_dep_before_org(typ, null);
            if (rt === null) 
                rt = this.try_attach_dep_after_org(typ);
            if (rt === null) 
                rt = this.try_attach_org(typ.end_token.next, ad, OrganizationAnalyzerAttachType.NORMALAFTERDEP, null, false, 0, -1);
        }
        let tt = Utils.as(t, TextToken);
        if (((step === 0 && rt === null && tt !== null) && !tt.chars.is_all_lower && tt.chars.is_cyrillic_letter) && tt.get_morph_class_in_dictionary().is_undefined) {
            let s = tt.term;
            if (((s.startsWith("ГУ") || s.startsWith("РУ"))) && s.length > 3 && ((s.length > 4 || s === "ГУВД"))) {
                tt.term = (s === "ГУВД" ? "МВД" : tt.term.substring(2));
                let inv = tt.invariant_prefix_length;
                tt.invariant_prefix_length = 0;
                let max = tt.max_length;
                tt.max_length = tt.term.length;
                rt = this.try_attach_org(tt, ad, OrganizationAnalyzerAttachType.NORMALAFTERDEP, null, false, 0, -1);
                tt.term = s;
                tt.invariant_prefix_length = inv;
                tt.max_length = max;
                if (rt !== null) {
                    if (ad !== null && ad.loc_orgs.try_attach(tt, null, false) !== null) 
                        rt = null;
                    if (t.kit.ontology !== null && t.kit.ontology.attach_token(OrganizationReferent.OBJ_TYPENAME, tt) !== null) 
                        rt = null;
                }
                if (rt !== null) {
                    typ = new OrgItemTypeToken(tt, tt);
                    typ.typ = (s.startsWith("ГУ") ? "главное управление" : "региональное управление");
                    let rt0 = this.try_attach_dep_before_org(typ, rt);
                    if (rt0 !== null) {
                        if (ad !== null) 
                            rt.referent = ad.register_referent(rt.referent);
                        rt.referent.add_occurence(new TextAnnotation(t, rt.end_token, rt.referent));
                        (rt0.referent).higher = Utils.as(rt.referent, OrganizationReferent);
                        let li2 = new Array();
                        this._do_post_analyze(rt0, ad);
                        li2.push(rt0);
                        return li2;
                    }
                }
            }
            else if ((((((((((s[0] === 'У' && s.length > 3 && tt.get_morph_class_in_dictionary().is_undefined)) || s === "ОВД" || s === "РОВД") || s === "ОМВД" || s === "ОСБ") || s === "УПФ" || s === "УФНС") || s === "ИФНС" || s === "ИНФС") || s === "УВД" || s === "УФМС") || s === "УФСБ" || s === "ОУФМС") || s === "ОФМС" || s === "УФК") || s === "УФССП") {
                if (s === "ОВД" || s === "УВД" || s === "РОВД") 
                    tt.term = "МВД";
                else if (s === "ОСБ") 
                    tt.term = "СБЕРБАНК";
                else if (s === "УПФ") 
                    tt.term = "ПФР";
                else if (s === "УФНС" || s === "ИФНС" || s === "ИНФС") 
                    tt.term = "ФНС";
                else if (s === "УФМС" || s === "ОУФМС" || s === "ОФМС") 
                    tt.term = "ФМС";
                else 
                    tt.term = tt.term.substring(1);
                let inv = tt.invariant_prefix_length;
                tt.invariant_prefix_length = 0;
                let max = tt.max_length;
                tt.max_length = tt.term.length;
                rt = this.try_attach_org(tt, ad, OrganizationAnalyzerAttachType.NORMALAFTERDEP, null, false, 0, -1);
                tt.term = s;
                tt.invariant_prefix_length = inv;
                tt.max_length = max;
                if (rt !== null) {
                    let org1 = Utils.as(rt.referent, OrganizationReferent);
                    if (org1.geo_objects.length === 0 && rt.end_token.next !== null) {
                        let g = Utils.as(rt.end_token.next.get_referent(), GeoReferent);
                        if (g !== null && g.is_state) {
                            org1.add_geo_object(g);
                            rt.end_token = rt.end_token.next;
                        }
                    }
                    typ = new OrgItemTypeToken(tt, tt);
                    typ.typ = (s[0] === 'О' ? "отделение" : ((s[0] === 'И' ? "инспекция" : "управление")));
                    let gen = (s[0] === 'И' ? MorphGender.FEMINIE : MorphGender.NEUTER);
                    if (s.startsWith("ОУ")) 
                        typ.typ = "управление";
                    else if (s.startsWith("РО")) {
                        typ.typ = "отдел";
                        typ.alt_typ = "районный отдел";
                        typ.name_is_name = true;
                        gen = MorphGender.MASCULINE;
                    }
                    let rt0 = this.try_attach_dep_before_org(typ, rt);
                    if (rt0 !== null) {
                        let org0 = Utils.as(rt0.referent, OrganizationReferent);
                        org0.add_profile(OrgProfile.UNIT);
                        if (org0.number === null && !tt.is_newline_after) {
                            let num = OrgItemNumberToken.try_attach(tt.next, true, typ);
                            if (num !== null) {
                                org0.number = num.number;
                                rt0.end_token = num.end_token;
                            }
                        }
                        let _geo = null;
                        if (rt0.referent.find_slot(OrganizationReferent.ATTR_GEO, null, true) === null) {
                            if ((((_geo = this.is_geo(rt0.end_token.next, false)))) !== null) {
                                if ((rt0.referent).add_geo_object(_geo)) 
                                    rt0.end_token = this.get_geo_end_token(_geo, rt0.end_token.next);
                            }
                            else if (rt0.end_token.whitespaces_after_count < 3) {
                                let nam = OrgItemNameToken.try_attach(rt0.end_token.next, null, false, true);
                                if (nam !== null && !nam.value.startsWith("СУБЪЕКТ")) {
                                    if ((((_geo = this.is_geo(nam.end_token.next, false)))) !== null) {
                                        if ((rt0.referent).add_geo_object(_geo)) 
                                            rt0.end_token = this.get_geo_end_token(_geo, nam.end_token.next);
                                        (rt0.referent).add_name(nam.value, true, null);
                                    }
                                }
                            }
                        }
                        if (rt0.referent.slots.length > 3) {
                            if (tt.previous !== null && ((tt.previous.morph.class0.is_adjective && !tt.previous.morph.class0.is_verb)) && tt.whitespaces_before_count === 1) {
                                let adj = Morphology.get_wordform(tt.previous.get_source_text().toUpperCase(), MorphBaseInfo._new2342(MorphClass.ADJECTIVE, gen, tt.previous.morph.language));
                                if (adj !== null && !adj.startsWith("УПОЛНОМОЧ") && !adj.startsWith("ОПЕРУПОЛНОМОЧ")) {
                                    let tyy = (adj.toLowerCase() + " " + typ.typ);
                                    rt0.begin_token = tt.previous;
                                    if (rt0.begin_token.previous !== null && rt0.begin_token.previous.is_hiphen && rt0.begin_token.previous.previous !== null) {
                                        let tt0 = rt0.begin_token.previous.previous;
                                        if (CharsInfo.ooEq(tt0.chars, rt0.begin_token.chars) && (tt0 instanceof TextToken)) {
                                            adj = (tt0).term;
                                            if (tt0.morph.class0.is_adjective && !tt0.morph.contains_attr("неизм.", null)) 
                                                adj = Morphology.get_wordform(adj, MorphBaseInfo._new2342(MorphClass.ADJECTIVE, gen, tt0.morph.language));
                                            tyy = (adj.toLowerCase() + " " + tyy);
                                            rt0.begin_token = tt0;
                                        }
                                    }
                                    if (typ.name_is_name) 
                                        org0.add_name(tyy.toUpperCase(), true, null);
                                    else 
                                        org0.add_type_str(tyy);
                                }
                            }
                            for (const g of org1.geo_objects) {
                                if (!g.is_state) {
                                    let sl = org1.find_slot(OrganizationReferent.ATTR_GEO, g, true);
                                    if (sl !== null) 
                                        Utils.removeItem(org1.slots, sl);
                                    if (rt.begin_token.begin_char < rt0.begin_token.begin_char) 
                                        rt0.begin_token = rt.begin_token;
                                    org0.add_geo_object(g);
                                    org1.move_ext_referent(org0, g);
                                }
                            }
                            if (ad !== null) 
                                rt.referent = ad.register_referent(rt.referent);
                            rt.referent.add_occurence(new TextAnnotation(t, rt.end_token, rt.referent));
                            (rt0.referent).higher = Utils.as(rt.referent, OrganizationReferent);
                            this._do_post_analyze(rt0, ad);
                            let li2 = new Array();
                            li2.push(rt0);
                            return li2;
                        }
                    }
                    rt = null;
                }
            }
        }
        if (rt === null) {
            if (step > 0 && typ === null) {
                if (!BracketHelper.is_bracket(t, false)) {
                    if (!t.chars.is_letter) 
                        return null;
                    if (t.chars.is_all_lower) 
                        return null;
                }
            }
            rt = this.try_attach_org(t, ad, OrganizationAnalyzerAttachType.NORMAL, null, false, 0, step);
            if (rt === null && step === 0) 
                rt = OrgItemEngItem.try_attach_org(t, false);
            if (rt !== null) {
            }
        }
        if (((rt === null && step === 1 && typ !== null) && typ.is_dep && typ.root !== null) && !typ.root.can_be_normal_dep) {
            if (OrgItemTypeToken.check_org_special_word_before(typ.begin_token.previous)) 
                rt = this.try_attach_dep(typ, OrganizationAnalyzerAttachType.HIGH, true);
        }
        if (rt === null && step === 0 && t !== null) {
            let ok = false;
            if (t.length_char > 2 && !t.chars.is_all_lower && t.chars.is_latin_letter) 
                ok = true;
            else if (BracketHelper.can_be_start_of_sequence(t, true, false)) 
                ok = true;
            if (ok && t.whitespaces_before_count !== 1) 
                ok = false;
            if (ok && !OrgItemTypeToken.check_person_property(t.previous)) 
                ok = false;
            if (ok) {
                let _org = new OrganizationReferent();
                rt = new ReferentToken(_org, t, t);
                if (t.chars.is_latin_letter && NumberHelper.try_parse_roman(t) === null) {
                    let nam = OrgItemNameToken.try_attach(t, null, false, true);
                    if (nam !== null) {
                        let _name = new StringBuilder();
                        _name.append(nam.value);
                        rt.end_token = nam.end_token;
                        for (let ttt = nam.end_token.next; ttt !== null; ttt = ttt.next) {
                            if (!ttt.chars.is_latin_letter) 
                                break;
                            nam = OrgItemNameToken.try_attach(ttt, null, false, false);
                            if (nam === null) 
                                break;
                            rt.end_token = nam.end_token;
                            if (!nam.is_std_tail) 
                                _name.append(" ").append(nam.value);
                            else {
                                let ei = OrgItemEngItem.try_attach(nam.begin_token, false);
                                if (ei !== null) {
                                    _org.add_type_str(ei.full_value);
                                    if (ei.short_value !== null) 
                                        _org.add_type_str(ei.short_value);
                                }
                            }
                        }
                        _org.add_name(_name.toString(), true, null);
                    }
                }
                else {
                    let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                    if (br !== null) {
                        let rt11 = this.try_attach_org(t.next, ad, OrganizationAnalyzerAttachType.NORMAL, null, false, 0, -1);
                        if (rt11 !== null && ((rt11.end_token === br.end_token.previous || rt11.end_token === br.end_token))) {
                            rt11.begin_token = t;
                            rt11.end_token = br.end_token;
                            rt = rt11;
                            _org = Utils.as(rt11.referent, OrganizationReferent);
                        }
                        else {
                            _org.add_name(MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE), true, null);
                            _org.add_name(MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO), true, br.begin_token.next);
                            if (br.begin_token.next === br.end_token.previous && br.begin_token.next.get_morph_class_in_dictionary().is_undefined) {
                                for (const wf of br.begin_token.next.morph.items) {
                                    if (wf._case.is_genitive && (wf instanceof MorphWordForm)) 
                                        _org.add_name((wf).normal_case, true, null);
                                }
                            }
                            rt.end_token = br.end_token;
                        }
                    }
                }
                if (_org.slots.length === 0) 
                    rt = null;
            }
        }
        if (rt === null) {
            if (BracketHelper.can_be_start_of_sequence(t, false, false)) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br === null || br.length_char > 100) 
                    br = null;
                if (br !== null) {
                    let t1 = br.end_token.next;
                    if (t1 !== null && t1.is_comma) 
                        t1 = t1.next;
                    if (t1 !== null && (t1.whitespaces_before_count < 3)) {
                        if ((((typ = OrgItemTypeToken.try_attach(t1, false, null)))) !== null && typ.root !== null && typ.root.typ === OrgItemTerminTypes.PREFIX) {
                            let t2 = typ.end_token.next;
                            let ok = false;
                            if (t2 === null || t2.is_newline_before) 
                                ok = true;
                            else if (t2.is_char_of(".,:;")) 
                                ok = true;
                            else if (t2 instanceof ReferentToken) 
                                ok = true;
                            if (ok) {
                                let _org = new OrganizationReferent();
                                rt = new ReferentToken(_org, t, typ.end_token);
                                _org.add_type(typ, false);
                                let nam = MiscHelper.get_text_value(br.begin_token.next, br.end_token.previous, GetTextAttr.NO);
                                _org.add_name(nam, true, null);
                                let rt11 = this.try_attach_org(br.begin_token.next, ad, OrganizationAnalyzerAttachType.NORMAL, null, false, 0, -1);
                                if (rt11 !== null && rt11.end_char <= typ.end_char) 
                                    _org.merge_slots(rt11.referent, true);
                            }
                        }
                    }
                }
            }
            if (rt === null) 
                return null;
        }
        this._do_post_analyze(rt, ad);
        if (step > 0) {
            let mt = OrganizationAnalyzer._check_alias_after(rt, rt.end_token.next);
            if (mt !== null) {
                if (ad !== null) {
                    let term = new Termin();
                    term.init_by(mt.begin_token, mt.end_token.previous, rt.referent, false);
                    ad.aliases.add(term);
                }
                rt.end_token = mt.end_token;
            }
        }
        let li = new Array();
        li.push(rt);
        let tt1 = rt.end_token.next;
        if (tt1 !== null && tt1.is_char('(')) {
            let br = BracketHelper.try_parse(tt1, BracketParseAttr.NO, 100);
            if (br !== null) 
                tt1 = br.end_token.next;
        }
        if (tt1 !== null && tt1.is_comma_and) {
            if (BracketHelper.can_be_start_of_sequence(tt1.next, true, false)) {
                if (BracketHelper.can_be_end_of_sequence(rt.end_token, true, null, false)) {
                    let ok = false;
                    for (let ttt = tt1; ttt !== null; ttt = ttt.next) {
                        if (ttt.is_char('.')) {
                            ok = true;
                            break;
                        }
                        if (ttt.is_char('(')) {
                            let br1 = BracketHelper.try_parse(ttt, BracketParseAttr.NO, 100);
                            if (br1 !== null) {
                                ttt = br1.end_token;
                                continue;
                            }
                        }
                        if (!ttt.is_comma_and) 
                            break;
                        if (!BracketHelper.can_be_start_of_sequence(ttt.next, true, false)) 
                            break;
                        let br = BracketHelper.try_parse(ttt.next, BracketParseAttr.NO, 100);
                        if (br === null) 
                            break;
                        let add_typ = false;
                        let rt1 = this._try_attach_org_(ttt.next.next, ttt.next.next, ad, null, true, OrganizationAnalyzerAttachType.NORMAL, null, false, 0);
                        if (rt1 === null || (rt1.end_char < (br.end_char - 1))) {
                            add_typ = true;
                            rt1 = this._try_attach_org_(ttt.next, ttt.next, ad, null, true, OrganizationAnalyzerAttachType.HIGH, null, false, 0);
                        }
                        if (rt1 === null || (rt1.end_char < (br.end_char - 1))) 
                            break;
                        li.push(rt1);
                        let org1 = Utils.as(rt1.referent, OrganizationReferent);
                        if (typ !== null) 
                            ok = true;
                        if (org1.types.length === 0) 
                            add_typ = true;
                        if (add_typ) {
                            if (typ !== null) 
                                org1.add_type(typ, false);
                            let s = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO);
                            if (s !== null) {
                                let ex = false;
                                for (const n of org1.names) {
                                    if (s.startsWith(n)) {
                                        ex = true;
                                        break;
                                    }
                                }
                                if (!ex) 
                                    org1.add_name(s, true, br.begin_token.next);
                            }
                        }
                        if (ttt.is_and) {
                            ok = true;
                            break;
                        }
                        ttt = rt1.end_token;
                    }
                    if (!ok && li.length > 1) 
                        li.splice(1, li.length - 1);
                }
            }
        }
        return li;
    }
    
    try_attach_spec(t, ad) {
        let rt = this.try_attach_prop_names(t, ad);
        if (rt === null) 
            rt = this.try_attach_politic_party(t, ad, false);
        if (rt === null) 
            rt = this.try_attach_army(t, ad);
        return rt;
    }
    
    static _corr_brackets(rt) {
        if (!BracketHelper.can_be_start_of_sequence(rt.begin_token.previous, true, false) || !BracketHelper.can_be_end_of_sequence(rt.end_token.next, true, null, false)) 
            return false;
        rt.begin_token = rt.begin_token.previous;
        rt.end_token = rt.end_token.next;
        return true;
    }
    
    _do_post_analyze(rt, ad) {
        if (rt.morph._case.is_undefined) {
            if (!rt.begin_token.chars.is_all_upper) {
                let npt1 = NounPhraseHelper.try_parse(rt.begin_token, NounPhraseParseAttr.NO, 0, null);
                if (npt1 === null) 
                    npt1 = NounPhraseHelper.try_parse(rt.begin_token.next, NounPhraseParseAttr.NO, 0, null);
                if (npt1 !== null) 
                    rt.morph = npt1.morph;
            }
        }
        let o = Utils.as(rt.referent, OrganizationReferent);
        if ((rt.kit.ontology !== null && o.ontology_items === null && o.higher === null) && o.m_temp_parent_org === null) {
            let ot = rt.kit.ontology.attach_referent(o);
            if (ot !== null && ot.length === 1 && (ot[0].referent instanceof OrganizationReferent)) {
                let oo = Utils.as(ot[0].referent, OrganizationReferent);
                o.merge_slots(oo, false);
                o.ontology_items = ot;
                for (const sl of o.slots) {
                    if (sl.value instanceof Referent) {
                        let ext = false;
                        for (const ss of oo.slots) {
                            if (ss.value === sl.value) {
                                ext = true;
                                break;
                            }
                        }
                        if (!ext) 
                            continue;
                        let rr = (sl.value).clone();
                        rr.occurrence.splice(0, rr.occurrence.length);
                        o.upload_slot(sl, rr);
                        let rt_ex = new ReferentToken(rr, rt.begin_token, rt.end_token);
                        rt_ex.set_default_local_onto(rt.kit.processor);
                        o.add_ext_referent(rt_ex);
                        for (const sss of rr.slots) {
                            if (sss.value instanceof Referent) {
                                let rrr = (sss.value).clone();
                                rrr.occurrence.splice(0, rrr.occurrence.length);
                                rr.upload_slot(sss, rrr);
                                let rt_ex2 = new ReferentToken(rrr, rt.begin_token, rt.end_token);
                                rt_ex2.set_default_local_onto(rt.kit.processor);
                                (sl.value).add_ext_referent(rt_ex2);
                            }
                        }
                    }
                }
            }
        }
        if (o.higher === null && o.m_temp_parent_org === null) {
            if ((rt.begin_token.previous instanceof ReferentToken) && (rt.begin_token.previous.get_referent() instanceof OrganizationReferent)) {
                let oo = Utils.as(rt.begin_token.previous.get_referent(), OrganizationReferent);
                if (OrgOwnershipHelper.can_be_higher(oo, o, false)) 
                    o.m_temp_parent_org = oo;
            }
            if (o.m_temp_parent_org === null && (rt.end_token.next instanceof ReferentToken) && (rt.end_token.next.get_referent() instanceof OrganizationReferent)) {
                let oo = Utils.as(rt.end_token.next.get_referent(), OrganizationReferent);
                if (OrgOwnershipHelper.can_be_higher(oo, o, false)) 
                    o.m_temp_parent_org = oo;
            }
            if (o.m_temp_parent_org === null) {
                let rt1 = this.try_attach_org(rt.end_token.next, null, OrganizationAnalyzerAttachType.NORMALAFTERDEP, null, false, 0, -1);
                if (rt1 !== null && rt.end_token.next === rt1.begin_token) {
                    if (OrgOwnershipHelper.can_be_higher(Utils.as(rt1.referent, OrganizationReferent), o, false)) 
                        o.m_temp_parent_org = Utils.as(rt1.referent, OrganizationReferent);
                }
            }
        }
        if (rt.end_token.next === null) 
            return;
        OrganizationAnalyzer._corr_brackets(rt);
        if (rt.begin_token.previous !== null && rt.begin_token.previous.morph.class0.is_adjective && (rt.whitespaces_before_count < 2)) {
            if ((rt.referent).geo_objects.length === 0) {
                let _geo = this.is_geo(rt.begin_token.previous, true);
                if (_geo !== null) {
                    if ((rt.referent).add_geo_object(_geo)) 
                        rt.begin_token = rt.begin_token.previous;
                }
            }
        }
        let ttt = rt.end_token.next;
        let errs = 1;
        let br = false;
        if (ttt !== null && ttt.is_char('(')) {
            br = true;
            ttt = ttt.next;
        }
        let refs = new Array();
        let _keyword = false;
        let has_inn = false;
        let has_ok = 0;
        let te = null;
        for (; ttt !== null; ttt = ttt.next) {
            if (ttt.is_char_of(",;") || ttt.morph.class0.is_preposition) 
                continue;
            if (ttt.is_char(')')) {
                if (br) 
                    te = ttt;
                break;
            }
            let rr = ttt.get_referent();
            if (rr !== null) {
                if (rr.type_name === "ADDRESS" || rr.type_name === "DATE" || ((rr.type_name === "GEO" && br))) {
                    if (_keyword || br || (ttt.whitespaces_before_count < 2)) {
                        refs.push(rr);
                        te = ttt;
                        continue;
                    }
                    break;
                }
                if (rr.type_name === "URI") {
                    let sch = rr.get_string_value("SCHEME");
                    if (sch === null) 
                        break;
                    if (sch === "ИНН") {
                        errs = 5;
                        has_inn = true;
                    }
                    else if (sch.startsWith("ОК")) 
                        has_ok++;
                    else if (sch !== "КПП" && sch !== "ОГРН" && !br) 
                        break;
                    refs.push(rr);
                    te = ttt;
                    if (ttt.next !== null && ttt.next.is_char('(')) {
                        let brrr = BracketHelper.try_parse(ttt.next, BracketParseAttr.NO, 100);
                        if (brrr !== null) 
                            ttt = brrr.end_token;
                    }
                    continue;
                }
                else if (rr === rt.referent) 
                    continue;
            }
            if (ttt.is_newline_before && !br) 
                break;
            if (ttt instanceof TextToken) {
                let npt = NounPhraseHelper.try_parse(ttt, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null) {
                    if ((npt.end_token.is_value("ДАТА", null) || npt.end_token.is_value("РЕГИСТРАЦИЯ", null) || npt.end_token.is_value("ЛИЦО", null)) || npt.end_token.is_value("ЮР", null) || npt.end_token.is_value("АДРЕС", null)) {
                        ttt = npt.end_token;
                        _keyword = true;
                        continue;
                    }
                }
                if (ttt.is_value("REGISTRATION", null) && ttt.next !== null && ttt.next.is_value("NUMBER", null)) {
                    let tmp = new StringBuilder();
                    for (let tt3 = ttt.next.next; tt3 !== null; tt3 = tt3.next) {
                        if (tt3.is_whitespace_before && tmp.length > 0) 
                            break;
                        if (((tt3.is_char_of(":") || tt3.is_hiphen)) && tmp.length === 0) 
                            continue;
                        if (tt3 instanceof TextToken) 
                            tmp.append((tt3).term);
                        else if (tt3 instanceof NumberToken) 
                            tmp.append(tt3.get_source_text());
                        else 
                            break;
                        rt.end_token = (ttt = tt3);
                    }
                    if (tmp.length > 0) 
                        rt.referent.add_slot(OrganizationReferent.ATTR_MISC, tmp.toString(), false, 0);
                    continue;
                }
                if ((ttt.is_value("REGISTERED", null) && ttt.next !== null && ttt.next.is_value("IN", null)) && (ttt.next.next instanceof ReferentToken) && (ttt.next.next.get_referent() instanceof GeoReferent)) {
                    rt.referent.add_slot(OrganizationReferent.ATTR_MISC, ttt.next.next.get_referent(), false, 0);
                    rt.end_token = (ttt = ttt.next.next);
                    continue;
                }
                if (br) {
                    let otyp = OrgItemTypeToken.try_attach(ttt, true, null);
                    if (otyp !== null && (ttt.whitespaces_before_count < 2) && otyp.geo === null) {
                        let or1 = new OrganizationReferent();
                        or1.add_type(otyp, false);
                        if (!OrgItemTypeToken.is_types_antagonisticoo(o, or1) && otyp.end_token.next !== null && otyp.end_token.next.is_char(')')) {
                            o.add_type(otyp, false);
                            rt.end_token = (ttt = otyp.end_token);
                            if (br && ttt.next !== null && ttt.next.is_char(')')) {
                                rt.end_token = ttt.next;
                                break;
                            }
                            continue;
                        }
                    }
                }
            }
            _keyword = false;
            if ((--errs) <= 0) 
                break;
        }
        if (te !== null && refs.length > 0 && ((te.is_char(')') || has_inn || has_ok > 0))) {
            for (const rr of refs) {
                if (rr.type_name === OrganizationAnalyzer.geoname) 
                    (rt.referent).add_geo_object(rr);
                else 
                    rt.referent.add_slot(OrganizationReferent.ATTR_MISC, rr, false, 0);
            }
            rt.end_token = te;
        }
        if ((rt.whitespaces_before_count < 2) && (rt.begin_token.previous instanceof TextToken) && rt.begin_token.previous.chars.is_all_upper) {
            let term = (rt.begin_token.previous).term;
            for (const s of o.slots) {
                if ((typeof s.value === 'string' || s.value instanceof String)) {
                    let a = MiscHelper.get_abbreviation(Utils.asString(s.value));
                    if (a !== null && a === term) {
                        rt.begin_token = rt.begin_token.previous;
                        break;
                    }
                }
            }
        }
    }
    
    _try_attach_org_by_alias(t, ad) {
        if (t === null) 
            return null;
        let t0 = t;
        let br = false;
        if (t0.next !== null && BracketHelper.can_be_start_of_sequence(t0, true, false)) {
            t = t0.next;
            br = true;
        }
        if ((t instanceof TextToken) && t.chars.is_letter && !t.chars.is_all_lower) {
            if (t.length_char > 3) {
            }
            else if (t.length_char > 1 && t.chars.is_all_upper) {
            }
            else 
                return null;
        }
        else 
            return null;
        if (ad !== null) {
            let tok = ad.aliases.try_parse(t, TerminParseAttr.NO);
            if (tok !== null) {
                let rt0 = new ReferentToken(Utils.as(tok.termin.tag, Referent), t0, tok.end_token);
                if (br) {
                    if (BracketHelper.can_be_end_of_sequence(tok.end_token.next, true, null, false)) 
                        rt0.end_token = tok.end_token.next;
                    else 
                        return null;
                }
                return rt0;
            }
        }
        if (!br) {
            if (MiscHelper.can_be_start_of_sentence(t)) 
                return null;
            if (!OrgItemTypeToken.check_org_special_word_before(t0.previous)) 
                return null;
            if (t.chars.is_latin_letter) {
                if (t.next !== null && t.next.chars.is_latin_letter) 
                    return null;
            }
            else if (t.next !== null && ((t.next.chars.is_cyrillic_letter || !t.next.chars.is_all_lower))) 
                return null;
        }
        else if (!BracketHelper.can_be_end_of_sequence(t.next, true, null, false)) 
            return null;
        let cou = 0;
        for (let ttt = t.previous; ttt !== null && (cou < 100); ttt = ttt.previous,cou++) {
            let org00 = Utils.as(ttt.get_referent(), OrganizationReferent);
            if (org00 === null) 
                continue;
            for (const n of org00.names) {
                let str = n;
                let ii = n.indexOf(' ');
                if (ii > 0) 
                    str = n.substring(0, 0 + ii);
                if (t.is_value(str, null)) {
                    if (ad !== null) 
                        ad.aliases.add(Termin._new119(str, org00));
                    let term = (t).term;
                    if (ii < 0) 
                        org00.add_name(term, true, t);
                    if (br) 
                        t = t.next;
                    let rt = new ReferentToken(org00, t0, t);
                    return rt;
                }
            }
        }
        return null;
    }
    
    attach_middle_attributes(_org, t) {
        const OrgItemEponymToken = require("./internal/OrgItemEponymToken");
        let te = null;
        for (; t !== null; t = t.next) {
            let ont = OrgItemNumberToken.try_attach(t, false, null);
            if (ont !== null) {
                _org.number = ont.number;
                te = (t = ont.end_token);
                continue;
            }
            let oet = OrgItemEponymToken.try_attach(t, false);
            if (oet !== null) {
                for (const v of oet.eponyms) {
                    _org.add_eponym(v);
                }
                te = (t = oet.end_token);
                continue;
            }
            break;
        }
        return te;
    }
    
    is_geo(t, can_be_adjective = false) {
        if (t === null) 
            return null;
        if (t.is_value("В", null) && t.next !== null) 
            t = t.next;
        let r = t.get_referent();
        if (r !== null) {
            if (r.type_name === OrganizationAnalyzer.geoname) {
                if (t.whitespaces_before_count <= 15 || t.morph._case.is_genitive) 
                    return r;
            }
            if (r instanceof AddressReferent) {
                let tt = (t).begin_token;
                if (tt.get_referent() !== null && tt.get_referent().type_name === OrganizationAnalyzer.geoname) {
                    if (t.whitespaces_before_count < 3) 
                        return tt.get_referent();
                }
            }
            return null;
        }
        if (t.whitespaces_before_count > 15 && !can_be_adjective) 
            return null;
        let rt = t.kit.process_referent("GEO", t);
        if (rt === null) 
            return null;
        if (t.previous !== null && t.previous.is_value("ОРДЕН", null)) 
            return null;
        if (!can_be_adjective) {
            if (rt.morph.class0.is_adjective) 
                return null;
        }
        return rt;
    }
    
    get_geo_end_token(_geo, t) {
        if (_geo instanceof ReferentToken) {
            if ((_geo).get_referent() instanceof AddressReferent) 
                return t.previous;
            return (_geo).end_token;
        }
        else if (t !== null && t.next !== null && t.morph.class0.is_preposition) 
            return t.next;
        else 
            return t;
    }
    
    attach_tail_attributes(_org, t, ad, attach_for_new_org, attach_typ, is_global = false) {
        const OrgItemEngItem = require("./internal/OrgItemEngItem");
        let t1 = null;
        let ki = _org.kind;
        let can_has_geo = true;
        if (!can_has_geo) {
            if (_org._types_contains("комитет") || _org._types_contains("академия") || _org._types_contains("инспекция")) 
                can_has_geo = true;
        }
        for (; t !== null; t = ((t === null ? null : t.next))) {
            if (((t.is_value("ПО", null) || t.is_value("В", null) || t.is_value("IN", null))) && t.next !== null) {
                if (attach_typ === OrganizationAnalyzerAttachType.NORMALAFTERDEP) 
                    break;
                if (!can_has_geo) 
                    break;
                let r = this.is_geo(t.next, false);
                if (r === null) 
                    break;
                if (!_org.add_geo_object(r)) 
                    break;
                t1 = this.get_geo_end_token(r, t.next);
                t = t1;
                continue;
            }
            if (t.is_value("ИЗ", null) && t.next !== null) {
                if (attach_typ === OrganizationAnalyzerAttachType.NORMALAFTERDEP) 
                    break;
                if (!can_has_geo) 
                    break;
                let r = this.is_geo(t.next, false);
                if (r === null) 
                    break;
                if (!_org.add_geo_object(r)) 
                    break;
                t1 = this.get_geo_end_token(r, t.next);
                t = t1;
                continue;
            }
            if (can_has_geo && _org.find_slot(OrganizationReferent.ATTR_GEO, null, true) === null && !t.is_newline_before) {
                let r = this.is_geo(t, false);
                if (r !== null) {
                    if (!_org.add_geo_object(r)) 
                        break;
                    t = (t1 = this.get_geo_end_token(r, t));
                    continue;
                }
                if (t.is_char('(')) {
                    r = this.is_geo(t.next, false);
                    if ((r instanceof ReferentToken) && (r).end_token.next !== null && (r).end_token.next.is_char(')')) {
                        if (!_org.add_geo_object(r)) 
                            break;
                        t = (t1 = (r).end_token.next);
                        continue;
                    }
                    if ((r instanceof GeoReferent) && t.next.next !== null && t.next.next.is_char(')')) {
                        if (!_org.add_geo_object(r)) 
                            break;
                        t = (t1 = t.next.next);
                        continue;
                    }
                }
            }
            if ((t.get_referent() instanceof GeoReferent) && (t.whitespaces_before_count < 2)) {
                if (_org.find_slot(OrganizationReferent.ATTR_GEO, t.get_referent(), true) !== null) {
                    t1 = t;
                    continue;
                }
            }
            if (((t.is_value("ПРИ", null) || t.is_value("В", null))) && t.next !== null && (t.next instanceof ReferentToken)) {
                let r = t.next.get_referent();
                if (r instanceof OrganizationReferent) {
                    if (t.is_value("В", null) && !OrgOwnershipHelper.can_be_higher(Utils.as(r, OrganizationReferent), _org, false)) {
                    }
                    else {
                        _org.higher = Utils.as(r, OrganizationReferent);
                        t1 = t.next;
                        t = t1;
                        continue;
                    }
                }
            }
            if (t.chars.is_latin_letter && (t.whitespaces_before_count < 2)) {
                let has_latin_name = false;
                for (const s of _org.names) {
                    if (LanguageHelper.is_latin_char(s[0])) {
                        has_latin_name = true;
                        break;
                    }
                }
                if (has_latin_name) {
                    let eng = OrgItemEngItem.try_attach(t, false);
                    if (eng !== null) {
                        _org.add_type_str(eng.full_value);
                        if (eng.short_value !== null) 
                            _org.add_type_str(eng.short_value);
                        t = (t1 = eng.end_token);
                        continue;
                    }
                }
            }
            let re = this.is_geo(t, false);
            if (re === null && t.is_char(',')) 
                re = this.is_geo(t.next, false);
            if (re !== null) {
                if (attach_typ !== OrganizationAnalyzerAttachType.NORMALAFTERDEP) {
                    if ((!can_has_geo && ki !== OrganizationKind.BANK && ki !== OrganizationKind.FEDERATION) && !_org.types.includes("университет")) 
                        break;
                    if (!_org.add_geo_object(re)) 
                        break;
                    if (t.is_char(',')) 
                        t = t.next;
                    t1 = this.get_geo_end_token(re, t);
                    if (t1.end_char <= t.end_char) 
                        break;
                    t = t1;
                    continue;
                }
                else 
                    break;
            }
            if (t.is_char('(')) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br === null) 
                    break;
                if (t.next !== null && t.next.get_referent() !== null) {
                    if (t.next.next !== br.end_token) 
                        break;
                    let r = t.next.get_referent();
                    if (r.type_name === OrganizationAnalyzer.geoname) {
                        if (!_org.add_geo_object(r)) 
                            break;
                        t = (t1 = br.end_token);
                        continue;
                    }
                    if ((r instanceof OrganizationReferent) && !is_global) {
                        if (!attach_for_new_org && !_org.can_be_equals(r, ReferentEqualType.WITHINONETEXT)) 
                            break;
                        _org.merge_slots(r, true);
                        t = (t1 = br.end_token);
                        continue;
                    }
                    break;
                }
                if (!is_global) {
                    if (attach_typ !== OrganizationAnalyzerAttachType.EXTONTOLOGY) {
                        let typ = OrgItemTypeToken.try_attach(t.next, true, null);
                        if (typ !== null && typ.end_token === br.end_token.previous && !typ.is_dep) {
                            _org.add_type(typ, false);
                            if (typ.name !== null) 
                                _org.add_type_str(typ.name.toLowerCase());
                            t = (t1 = br.end_token);
                            continue;
                        }
                    }
                    let rte = OrgItemEngItem.try_attach_org(br.begin_token, false);
                    if (rte !== null) {
                        if (_org.can_be_equals(rte.referent, ReferentEqualType.FORMERGING)) {
                            _org.merge_slots(rte.referent, true);
                            t = (t1 = rte.end_token);
                            continue;
                        }
                    }
                    let nam = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO);
                    if (nam !== null) {
                        let eq = false;
                        for (const s of _org.slots) {
                            if (s.type_name === OrganizationReferent.ATTR_NAME) {
                                if (MiscHelper.can_be_equal_cyr_and_latss(nam, String(s.value))) {
                                    _org.add_name(nam, true, br.begin_token.next);
                                    eq = true;
                                    break;
                                }
                            }
                        }
                        if (eq) {
                            t = (t1 = br.end_token);
                            continue;
                        }
                    }
                    let old_name = false;
                    let tt0 = t.next;
                    if (tt0 !== null) {
                        if (tt0.is_value("РАНЕЕ", null)) {
                            old_name = true;
                            tt0 = tt0.next;
                        }
                        else if (tt0.morph.class0.is_adjective && tt0.next !== null && ((tt0.next.is_value("НАЗВАНИЕ", null) || tt0.next.is_value("НАИМЕНОВАНИЕ", null)))) {
                            old_name = true;
                            tt0 = tt0.next.next;
                        }
                        if (old_name && tt0 !== null) {
                            if (tt0.is_hiphen || tt0.is_char_of(",:")) 
                                tt0 = tt0.next;
                        }
                    }
                    let rt = this.try_attach_org(tt0, ad, OrganizationAnalyzerAttachType.HIGH, null, false, 0, -1);
                    if (rt === null) 
                        break;
                    if (!_org.can_be_equals(rt.referent, ReferentEqualType.FORMERGING)) 
                        break;
                    if (rt.end_token !== br.end_token.previous) 
                        break;
                    if (!attach_for_new_org && !_org.can_be_equals(rt.referent, ReferentEqualType.WITHINONETEXT)) 
                        break;
                    if (attach_typ === OrganizationAnalyzerAttachType.NORMAL) {
                        if (!old_name && !OrganizationReferent.can_be_second_definition(_org, Utils.as(rt.referent, OrganizationReferent))) 
                            break;
                        let typ = OrgItemTypeToken.try_attach(t.next, true, null);
                        if (typ !== null && typ.is_douter_org) 
                            break;
                    }
                    _org.merge_slots(rt.referent, true);
                    t = (t1 = br.end_token);
                    continue;
                }
                break;
            }
            else if (attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY && BracketHelper.can_be_start_of_sequence(t, true, false)) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br === null) 
                    break;
                let nam = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO);
                if (nam !== null) 
                    _org.add_name(nam, true, br.begin_token.next);
                let rt1 = this.try_attach_org(t.next, ad, OrganizationAnalyzerAttachType.HIGH, null, true, 0, -1);
                if (rt1 !== null && rt1.end_token.next === br.end_token) {
                    _org.merge_slots(rt1.referent, true);
                    t = (t1 = br.end_token);
                }
            }
            else 
                break;
        }
        if (t !== null && (t.whitespaces_before_count < 2) && ((ki === OrganizationKind.UNDEFINED || ki === OrganizationKind.BANK))) {
            let ty1 = OrgItemTypeToken.try_attach(t, false, null);
            if (ty1 !== null && ty1.root !== null && ty1.root.is_pure_prefix) {
                if (t.kit.recurse_level > 2) 
                    return null;
                t.kit.recurse_level++;
                let rt22 = this.try_attach_org(t, ad, OrganizationAnalyzerAttachType.NORMAL, null, false, 0, -1);
                t.kit.recurse_level--;
                if (rt22 === null) {
                    _org.add_type(ty1, false);
                    t1 = ty1.end_token;
                }
            }
        }
        return t1;
    }
    
    correct_owner_before(res) {
        if (res === null) 
            return;
        if ((res.referent).kind === OrganizationKind.PRESS) {
            if (res.begin_token.is_value("КОРРЕСПОНДЕНТ", null) && res.begin_token !== res.end_token) 
                res.begin_token = res.begin_token.next;
        }
        let _org = Utils.as(res.referent, OrganizationReferent);
        if (_org.higher !== null || _org.m_temp_parent_org !== null) 
            return;
        let hi_before = null;
        let cou_before = 0;
        let t0 = null;
        for (let t = res.begin_token.previous; t !== null; t = t.previous) {
            cou_before += t.whitespaces_after_count;
            if (t.is_char(',')) {
                cou_before += 5;
                continue;
            }
            else if (t.is_value("ПРИ", null)) 
                return;
            if (t.is_referent) {
                if ((((hi_before = Utils.as(t.get_referent(), OrganizationReferent)))) !== null) 
                    t0 = t;
            }
            break;
        }
        if (t0 === null) 
            return;
        if (!OrgOwnershipHelper.can_be_higher(hi_before, _org, false)) 
            return;
        if (OrgOwnershipHelper.can_be_higher(_org, hi_before, false)) 
            return;
        let hi_after = null;
        let cou_after = 0;
        for (let t = res.end_token.next; t !== null; t = t.next) {
            cou_before += t.whitespaces_before_count;
            if (t.is_char(',') || t.is_value("ПРИ", null)) {
                cou_after += 5;
                continue;
            }
            if (t.is_referent) {
                hi_after = Utils.as(t.get_referent(), OrganizationReferent);
                break;
            }
            let rt = this.try_attach_org(t, null, OrganizationAnalyzerAttachType.NORMAL, null, false, 0, -1);
            if (rt !== null) 
                hi_after = Utils.as(rt.referent, OrganizationReferent);
            break;
        }
        if (hi_after !== null) {
            if (OrgOwnershipHelper.can_be_higher(hi_after, _org, false)) {
                if (cou_before >= cou_after) 
                    return;
            }
        }
        if (_org.kind === hi_before.kind && _org.kind !== OrganizationKind.UNDEFINED) {
            if (_org.kind !== OrganizationKind.DEPARTMENT & _org.kind !== OrganizationKind.GOVENMENT) 
                return;
        }
        _org.higher = hi_before;
        res.begin_token = t0;
    }
    
    check_ownership(t) {
        if (t === null) 
            return null;
        let res = null;
        let _org = Utils.as(t.get_referent(), OrganizationReferent);
        if (_org === null) 
            return null;
        let tt0 = t;
        for (; t !== null; ) {
            let tt = t.next;
            let always = false;
            let br = false;
            if (tt !== null && tt.morph.class0.is_preposition) {
                if (tt.is_value("ПРИ", null)) 
                    always = true;
                else if (tt.is_value("В", null)) {
                }
                else 
                    break;
                tt = tt.next;
            }
            if ((tt !== null && tt.is_char('(') && (tt.next instanceof ReferentToken)) && tt.next.next !== null && tt.next.next.is_char(')')) {
                br = true;
                tt = tt.next;
            }
            if (tt instanceof ReferentToken) {
                let org2 = Utils.as(tt.get_referent(), OrganizationReferent);
                if (org2 !== null) {
                    let ok = OrgOwnershipHelper.can_be_higher(org2, _org, false);
                    if (always || ok) 
                        ok = true;
                    else if (OrgOwnershipHelper.can_be_higher(org2, _org, true)) {
                        let t0 = t.previous;
                        if (t0 !== null && t0.is_char(',')) 
                            t0 = t0.previous;
                        let rt = t.kit.process_referent("PERSON", t0);
                        if (rt !== null && rt.referent.type_name === "PERSONPROPERTY" && rt.morph.number === MorphNumber.SINGULAR) 
                            ok = true;
                    }
                    if (ok && ((_org.higher === null || _org.higher.can_be_equals(org2, ReferentEqualType.WITHINONETEXT)))) {
                        _org.higher = org2;
                        if (br) 
                            tt = tt.next;
                        if (_org.higher === org2) {
                            if (res === null) 
                                res = new ReferentToken(_org, t, tt);
                            else 
                                res.end_token = tt;
                            t = tt;
                            if (_org.geo_objects.length === 0) {
                                let ttt = t.next;
                                if (ttt !== null && ttt.is_value("В", null)) 
                                    ttt = ttt.next;
                                if (this.is_geo(ttt, false) !== null) {
                                    _org.add_geo_object(ttt);
                                    res.end_token = ttt;
                                    t = ttt;
                                }
                            }
                            _org = org2;
                            continue;
                        }
                    }
                    if (_org.higher !== null && _org.higher.higher === null && OrgOwnershipHelper.can_be_higher(org2, _org.higher, false)) {
                        _org.higher.higher = org2;
                        res = new ReferentToken(_org, t, tt);
                        if (br) 
                            res.end_token = tt.next;
                        return res;
                    }
                    if ((_org.higher !== null && org2.higher === null && OrgOwnershipHelper.can_be_higher(_org.higher, org2, false)) && OrgOwnershipHelper.can_be_higher(org2, _org, false)) {
                        org2.higher = _org.higher;
                        _org.higher = org2;
                        res = new ReferentToken(_org, t, tt);
                        if (br) 
                            res.end_token = tt.next;
                        return res;
                    }
                }
            }
            break;
        }
        if (res !== null) 
            return res;
        if (_org.kind === OrganizationKind.DEPARTMENT && _org.higher === null && _org.m_temp_parent_org === null) {
            let cou = 0;
            for (let tt = tt0.previous; tt !== null; tt = tt.previous) {
                if (tt.is_newline_after) 
                    cou += 10;
                if ((++cou) > 100) 
                    break;
                let org0 = Utils.as(tt.get_referent(), OrganizationReferent);
                if (org0 === null) 
                    continue;
                let tmp = new Array();
                for (; org0 !== null; org0 = org0.higher) {
                    if (OrgOwnershipHelper.can_be_higher(org0, _org, false)) {
                        _org.higher = org0;
                        break;
                    }
                    if (org0.kind !== OrganizationKind.DEPARTMENT) 
                        break;
                    if (tmp.includes(org0)) 
                        break;
                    tmp.push(org0);
                }
                break;
            }
        }
        return null;
    }
    
    process_ontology_item(begin) {
        if (begin === null) 
            return null;
        let rt = this.try_attach_org(begin, null, OrganizationAnalyzerAttachType.EXTONTOLOGY, null, begin.previous !== null, 0, -1);
        if (rt !== null) {
            let r = Utils.as(rt.referent, OrganizationReferent);
            if (r.higher === null && rt.end_token.next !== null) {
                let h = Utils.as(rt.end_token.next.get_referent(), OrganizationReferent);
                if (h !== null) {
                    if (OrgOwnershipHelper.can_be_higher(h, r, true) || !OrgOwnershipHelper.can_be_higher(r, h, true)) {
                        r.higher = h;
                        rt.end_token = rt.end_token.next;
                    }
                }
            }
            if (rt.begin_token !== begin) {
                let nam = MiscHelper.get_text_value(begin, rt.begin_token.previous, GetTextAttr.NO);
                if (!Utils.isNullOrEmpty(nam)) {
                    let org0 = new OrganizationReferent();
                    org0.add_name(nam, true, begin);
                    org0.higher = r;
                    rt = new ReferentToken(org0, begin, rt.end_token);
                }
            }
            return rt;
        }
        let t = begin;
        let et = begin;
        for (; t !== null; t = t.next) {
            if (t.is_char_of(",;")) 
                break;
            et = t;
        }
        let _name = MiscHelper.get_text_value(begin, et, GetTextAttr.NO);
        if (Utils.isNullOrEmpty(_name)) 
            return null;
        let _org = new OrganizationReferent();
        _org.add_name(_name, true, begin);
        return new ReferentToken(_org, begin, et);
    }
    
    static initialize() {
        const OrgItemEngItem = require("./internal/OrgItemEngItem");
        const OrgItemNameToken = require("./internal/OrgItemNameToken");
        if (OrganizationAnalyzer.m_inited) 
            return;
        OrganizationAnalyzer.m_inited = true;
        MetaOrganization.initialize();
        try {
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
            OrganizationAnalyzer._init_sport();
            OrganizationAnalyzer._init_politic();
            OrgItemTypeToken.initialize();
            OrgItemEngItem.initialize();
            OrgItemNameToken.initialize();
            OrgGlobal.initialize();
            Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        } catch (ex) {
            throw new Error(ex.message);
        }
        ProcessorService.register_analyzer(new OrganizationAnalyzer());
    }
    
    try_attach_org(t, ad, attach_typ, mult_typ = null, is_additional_attach = false, level = 0, step = -1) {
        if (level > 2 || t === null) 
            return null;
        if (t.chars.is_latin_letter && MiscHelper.is_eng_article(t)) {
            let re = this.try_attach_org(t.next, ad, attach_typ, mult_typ, is_additional_attach, level, step);
            if (re !== null) {
                re.begin_token = t;
                return re;
            }
        }
        let _org = null;
        let types = null;
        if (mult_typ !== null) {
            types = new Array();
            types.push(mult_typ);
        }
        let t0 = t;
        let t1 = t;
        let ot_ex_li = null;
        let typ = null;
        let hiph = false;
        let spec_word_before = false;
        let ok = false;
        let in_brackets = false;
        let rt0 = null;
        for (; t !== null; t = t.next) {
            if (t.get_referent() instanceof OrganizationReferent) 
                break;
            rt0 = this.attach_global_org(t, attach_typ, ad, null);
            if ((rt0 === null && typ !== null && typ.geo !== null) && typ.begin_token.next === typ.end_token) {
                rt0 = this.attach_global_org(typ.end_token, attach_typ, ad, typ.geo);
                if (rt0 !== null) 
                    rt0.begin_token = typ.begin_token;
            }
            if (rt0 !== null) {
                if (attach_typ === OrganizationAnalyzerAttachType.MULTIPLE) {
                    if (types === null || types.length === 0) 
                        return null;
                    if (!OrgItemTypeToken.is_type_accords(Utils.as(rt0.referent, OrganizationReferent), types[0])) 
                        return null;
                    (rt0.referent).add_type(types[0], false);
                    if ((rt0.begin_token.begin_char - types[0].end_token.next.end_char) < 3) 
                        rt0.begin_token = types[0].begin_token;
                    break;
                }
                if (typ !== null && !typ.end_token.morph.class0.is_verb) {
                    if (OrganizationAnalyzer._is_mvd_org(Utils.as(rt0.referent, OrganizationReferent)) !== null && typ.typ !== null && typ.typ.includes("служба")) {
                        rt0 = null;
                        break;
                    }
                    if (OrgItemTypeToken.is_type_accords(Utils.as(rt0.referent, OrganizationReferent), typ)) {
                        rt0.begin_token = typ.begin_token;
                        (rt0.referent).add_type(typ, false);
                    }
                }
                break;
            }
            if (t.is_hiphen) {
                if (t === t0 || types === null) {
                    if (ot_ex_li !== null) 
                        break;
                    return null;
                }
                if ((typ !== null && typ.root !== null && typ.root.can_has_number) && (t.next instanceof NumberToken)) {
                }
                else 
                    hiph = true;
                continue;
            }
            if (ad !== null && ot_ex_li === null) {
                let ok1 = false;
                let tt = t;
                if (t.inner_bool) 
                    ok1 = true;
                else if (t.chars.is_all_lower) {
                }
                else if (t.chars.is_letter) 
                    ok1 = true;
                else if (t.previous !== null && BracketHelper.is_bracket(t.previous, false)) 
                    ok1 = true;
                else if (BracketHelper.can_be_start_of_sequence(t, true, false) && t.next !== null) {
                    ok1 = true;
                    tt = t.next;
                }
                if (ok1 && tt !== null) {
                    ot_ex_li = ad.loc_orgs.try_attach(tt, null, false);
                    if (ot_ex_li === null && t.kit.ontology !== null) {
                        if ((((ot_ex_li = t.kit.ontology.attach_token(OrganizationReferent.OBJ_TYPENAME, tt)))) !== null) {
                        }
                    }
                    if (ot_ex_li === null && tt.length_char === 2 && tt.chars.is_all_upper) {
                        ot_ex_li = ad.local_ontology.try_attach(tt, null, false);
                        if (ot_ex_li !== null) {
                            if (tt.kit.sofa.text.length > 300) 
                                ot_ex_li = null;
                        }
                    }
                }
                if (ot_ex_li !== null) 
                    t.inner_bool = true;
            }
            if ((step >= 0 && !t.inner_bool && t === t0) && (t instanceof TextToken)) 
                typ = null;
            else {
                typ = OrgItemTypeToken.try_attach(t, attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY, ad);
                if (typ === null && BracketHelper.can_be_start_of_sequence(t, false, false)) {
                    let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                    if (br !== null) {
                        typ = OrgItemTypeToken.try_attach(t.next, attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY, ad);
                        if (typ !== null && typ.end_token === br.end_token.previous && ((BracketHelper.can_be_start_of_sequence(br.end_token.next, true, false) || t.is_char('(')))) {
                            typ.end_token = br.end_token;
                            typ.begin_token = t;
                        }
                        else 
                            typ = null;
                    }
                }
            }
            if (typ === null) 
                break;
            if (types === null) {
                if ((((typ.typ === "главное управление" || typ.typ === "главное территориальное управление" || typ.typ === "головне управління") || typ.typ === "головне територіальне управління" || typ.typ === "пограничное управление")) && ot_ex_li !== null) 
                    break;
                types = new Array();
                t0 = typ.begin_token;
                if (typ.is_not_typ && typ.end_token.next !== null) 
                    t0 = typ.end_token.next;
                if (OrgItemTypeToken.check_org_special_word_before(typ.begin_token.previous)) 
                    spec_word_before = true;
            }
            else {
                ok = true;
                for (const ty of types) {
                    if (OrgItemTypeToken.is_types_antagonistictt(ty, typ)) {
                        ok = false;
                        break;
                    }
                }
                if (!ok) 
                    break;
                if (typ.is_dep) 
                    break;
                if (in_brackets) 
                    break;
                let typ0 = OrganizationAnalyzer._last_typ(types);
                if (hiph && ((t.whitespaces_before_count > 0 && ((typ0 !== null && typ0.is_doubt_root_word))))) 
                    break;
                if (typ.end_token === typ.begin_token) {
                    if (typ.is_value("ОРГАНИЗАЦИЯ", "ОРГАНІЗАЦІЯ") || typ.is_value("УПРАВЛІННЯ", "")) 
                        break;
                }
                if (typ0.is_dep || typ0.typ === "департамент") 
                    break;
                if ((typ0.root !== null && typ0.root.is_pure_prefix && typ.root !== null) && !typ.root.is_pure_prefix && !typ.begin_token.chars.is_all_lower) {
                    if (typ0.typ.includes("НИИ")) 
                        break;
                }
                let pref0 = typ0.root !== null && typ0.root.is_pure_prefix;
                let pref = typ.root !== null && typ.root.is_pure_prefix;
                if (!pref0 && !pref) {
                    if (typ0.name !== null && typ0.name.length !== typ0.typ.length) {
                        if (t.whitespaces_before_count > 1) 
                            break;
                    }
                    if (!typ0.morph._case.is_undefined && !typ.morph._case.is_undefined) {
                        if (!(MorphCase.ooBitand(typ0.morph._case, typ.morph._case)).is_nominative && !hiph) {
                            if (!typ.morph._case.is_nominative) 
                                break;
                        }
                    }
                    if (typ0.morph.number !== MorphNumber.UNDEFINED && typ.morph.number !== MorphNumber.UNDEFINED) {
                        if ((((typ0.morph.number.value()) & (typ.morph.number.value()))) === (MorphNumber.UNDEFINED.value())) 
                            break;
                    }
                }
                if (!pref0 && pref && !hiph) {
                    let nom = false;
                    for (const m of typ.morph.items) {
                        if (m.number === MorphNumber.SINGULAR && m._case.is_nominative) {
                            nom = true;
                            break;
                        }
                    }
                    if (!nom) {
                        if (LanguageHelper.ends_with(typ0.typ, "фракция") || LanguageHelper.ends_with(typ0.typ, "фракція")) {
                        }
                        else 
                            break;
                    }
                }
                for (const ty of types) {
                    if (OrgItemTypeToken.is_types_antagonistictt(ty, typ)) 
                        return null;
                }
            }
            types.push(typ);
            in_brackets = false;
            if (typ.name !== null) {
                if (BracketHelper.can_be_start_of_sequence(typ.begin_token.previous, true, false) && BracketHelper.can_be_end_of_sequence(typ.end_token.next, false, null, false)) {
                    typ.begin_token = typ.begin_token.previous;
                    typ.end_token = typ.end_token.next;
                    if (typ.begin_token.end_char < t0.begin_char) 
                        t0 = typ.begin_token;
                    in_brackets = true;
                }
            }
            t = typ.end_token;
            hiph = false;
        }
        if ((types === null && ot_ex_li === null && ((attach_typ === OrganizationAnalyzerAttachType.NORMAL || attach_typ === OrganizationAnalyzerAttachType.NORMALAFTERDEP))) && rt0 === null) {
            ok = false;
            if (!ok) {
                if (t0 !== null && t0.morph.class0.is_adjective && t0.next !== null) {
                    if ((((rt0 = this.try_attach_org(t0.next, ad, attach_typ, mult_typ, is_additional_attach, level + 1, step)))) !== null) {
                        if (rt0.begin_token === t0) 
                            return rt0;
                    }
                }
                if (attach_typ === OrganizationAnalyzerAttachType.NORMAL) {
                    if ((((rt0 = this.try_attach_org_med(t, ad)))) !== null) 
                        return rt0;
                }
                if ((((t0.kit.recurse_level < 4) && (t0 instanceof TextToken) && t0.previous !== null) && t0.length_char > 2 && !t0.chars.is_all_lower) && !t0.is_newline_after && !MiscHelper.can_be_start_of_sentence(t0)) {
                    typ = OrgItemTypeToken.try_attach(t0.next, false, null);
                    if (typ !== null) {
                        t0.kit.recurse_level++;
                        let rrr = this.try_attach_org(t0.next, ad, attach_typ, mult_typ, is_additional_attach, level + 1, step);
                        t0.kit.recurse_level--;
                        if (rrr === null) {
                            if (spec_word_before || t0.previous.is_value("ТЕРРИТОРИЯ", null)) {
                                let org0 = new OrganizationReferent();
                                org0.add_type(typ, false);
                                org0.add_name((t0).term, false, t0);
                                t1 = typ.end_token;
                                t1 = Utils.notNull(this.attach_tail_attributes(org0, t1.next, ad, false, OrganizationAnalyzerAttachType.NORMAL, false), t1);
                                return new ReferentToken(org0, t0, t1);
                            }
                        }
                    }
                }
                for (let tt = t; tt !== null; tt = tt.next) {
                    if (tt.is_and) {
                        if (tt === t) 
                            break;
                        continue;
                    }
                    if ((((tt instanceof TextToken) && tt.chars.is_letter && !tt.chars.is_all_lower) && !tt.chars.is_capital_upper && tt.length_char > 1) && (tt.whitespaces_after_count < 2)) {
                        let mc = tt.get_morph_class_in_dictionary();
                        if (mc.is_undefined) {
                        }
                        else if (((tt.length_char < 5) && !mc.is_conjunction && !mc.is_preposition) && !mc.is_noun) {
                        }
                        else if ((tt.length_char <= 3 && (tt.previous instanceof TextToken) && tt.previous.chars.is_letter) && !tt.previous.chars.is_all_upper) {
                        }
                        else 
                            break;
                    }
                    else 
                        break;
                    if ((tt.next instanceof ReferentToken) && (tt.next.get_referent() instanceof OrganizationReferent)) {
                        let ttt = t.previous;
                        if ((((ttt instanceof TextToken) && tt.chars.is_letter && !ttt.chars.is_all_lower) && !ttt.chars.is_capital_upper && ttt.length_char > 1) && ttt.get_morph_class_in_dictionary().is_undefined && (ttt.whitespaces_after_count < 2)) 
                            break;
                        let tt0 = t;
                        for (t = t.previous; t !== null; t = t.previous) {
                            if (!((t instanceof TextToken)) || t.whitespaces_after_count > 2) 
                                break;
                            else if (t.is_and) {
                            }
                            else if ((t.chars.is_letter && !t.chars.is_all_lower && !t.chars.is_capital_upper) && t.length_char > 1 && t.get_morph_class_in_dictionary().is_undefined) 
                                tt0 = t;
                            else 
                                break;
                        }
                        let nam = MiscHelper.get_text_value(tt0, tt, GetTextAttr.NO);
                        if (nam === "СЭД" || nam === "ЕОСЗ") 
                            break;
                        let own = Utils.as(tt.next.get_referent(), OrganizationReferent);
                        if (own.profiles.includes(OrgProfile.UNIT)) 
                            break;
                        if (nam === "НК" || nam === "ГК") 
                            return new ReferentToken(own, t, tt.next);
                        let org0 = new OrganizationReferent();
                        org0.add_profile(OrgProfile.UNIT);
                        org0.add_name(nam, true, null);
                        if (nam.indexOf(' ') > 0) 
                            org0.add_name(Utils.replaceString(nam, " ", ""), true, null);
                        org0.higher = own;
                        t1 = tt.next;
                        let ttt1 = this.attach_tail_attributes(org0, t1, ad, true, attach_typ, false);
                        if (tt0.kit.ontology !== null) {
                            let li = tt0.kit.ontology.attach_token(OrganizationReferent.OBJ_TYPENAME, tt0);
                            if (li !== null) {
                                for (const v of li) {
                                }
                            }
                        }
                        return new ReferentToken(org0, tt0, (ttt1 != null ? ttt1 : t1));
                    }
                }
                if (((t instanceof TextToken) && t.is_newline_before && t.length_char > 1) && !t.chars.is_all_lower && t.get_morph_class_in_dictionary().is_undefined) {
                    t1 = t.next;
                    if (t1 !== null && !t1.is_newline_before && (t1 instanceof TextToken)) 
                        t1 = t1.next;
                    if (t1 !== null && t1.is_newline_before) {
                        let typ0 = OrgItemTypeToken.try_attach(t1, false, null);
                        if ((typ0 !== null && typ0.root !== null && typ0.root.typ === OrgItemTerminTypes.PREFIX) && typ0.is_newline_after) {
                            if (this.try_attach_org(t1, ad, OrganizationAnalyzerAttachType.NORMAL, null, false, 0, -1) === null) {
                                _org = new OrganizationReferent();
                                _org.add_type(typ0, false);
                                _org.add_name(MiscHelper.get_text_value(t, t1.previous, GetTextAttr.NO), true, null);
                                t1 = typ0.end_token;
                                let ttt1 = this.attach_tail_attributes(_org, t1.next, ad, true, attach_typ, false);
                                return new ReferentToken(_org, t, (ttt1 != null ? ttt1 : t1));
                            }
                        }
                        if (t1.is_char('(')) {
                            if ((((typ0 = OrgItemTypeToken.try_attach(t1.next, false, null)))) !== null) {
                                if (typ0.end_token.next !== null && typ0.end_token.next.is_char(')') && typ0.end_token.next.is_newline_after) {
                                    _org = new OrganizationReferent();
                                    _org.add_type(typ0, false);
                                    _org.add_name(MiscHelper.get_text_value(t, t1.previous, GetTextAttr.NO), true, null);
                                    t1 = typ0.end_token.next;
                                    let ttt1 = this.attach_tail_attributes(_org, t1.next, ad, true, attach_typ, false);
                                    return new ReferentToken(_org, t, (ttt1 != null ? ttt1 : t1));
                                }
                            }
                        }
                    }
                }
                if ((t instanceof TextToken) && t.is_newline_before && BracketHelper.can_be_start_of_sequence(t, false, false)) {
                    let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                    if (br !== null && br.is_newline_after && (br.length_char < 100)) {
                        t1 = br.end_token.next;
                        let typ0 = OrgItemTypeToken.try_attach(t1, false, null);
                        if ((typ0 !== null && typ0.root !== null && typ0.root.typ === OrgItemTerminTypes.PREFIX) && typ0.is_newline_after) {
                            if (this.try_attach_org(t1, ad, OrganizationAnalyzerAttachType.NORMAL, null, false, 0, -1) === null) {
                                _org = new OrganizationReferent();
                                _org.add_type(typ0, false);
                                _org.add_name(MiscHelper.get_text_value(t, t1.previous, GetTextAttr.NO), true, null);
                                t1 = typ0.end_token;
                                let ttt1 = this.attach_tail_attributes(_org, t1.next, ad, true, attach_typ, false);
                                return new ReferentToken(_org, t, (ttt1 != null ? ttt1 : t1));
                            }
                        }
                        if (t1 !== null && t1.is_char('(') && (((typ0 = OrgItemTypeToken.try_attach(t1.next, false, null)))) !== null) {
                            if (typ0.end_token.next !== null && typ0.end_token.next.is_char(')') && typ0.end_token.next.is_newline_after) {
                                _org = new OrganizationReferent();
                                _org.add_type(typ0, false);
                                _org.add_name(MiscHelper.get_text_value(t, t1.previous, GetTextAttr.NO), true, null);
                                t1 = typ0.end_token.next;
                                let ttt1 = this.attach_tail_attributes(_org, t1.next, ad, true, attach_typ, false);
                                return new ReferentToken(_org, t, (ttt1 != null ? ttt1 : t1));
                            }
                        }
                    }
                }
                return null;
            }
        }
        if (types !== null && types.length > 1 && attach_typ !== OrganizationAnalyzerAttachType.EXTONTOLOGY) {
            if (types[0].typ === "предприятие" || types[0].typ === "підприємство") {
                types.splice(0, 1);
                t0 = types[0].begin_token;
            }
        }
        if (rt0 === null) {
            rt0 = this._try_attach_org_(t0, t, ad, types, spec_word_before, attach_typ, mult_typ, is_additional_attach, level);
            if (rt0 !== null && ot_ex_li !== null) {
                for (const ot of ot_ex_li) {
                    if ((ot.end_char > rt0.end_char && ot.item !== null && ot.item.owner !== null) && ot.item.owner.is_ext_ontology) {
                        rt0 = null;
                        break;
                    }
                    else if (ot.end_char < rt0.begin_char) {
                        ot_ex_li = null;
                        break;
                    }
                    else if (ot.end_char < rt0.end_char) {
                        if (ot.end_token.next.get_morph_class_in_dictionary().is_preposition) {
                            rt0 = null;
                            break;
                        }
                    }
                }
            }
            if (rt0 !== null) {
                if (types !== null && rt0.begin_token === types[0].begin_token) {
                    for (const ty of types) {
                        (rt0.referent).add_type(ty, true);
                    }
                }
                if ((rt0.begin_token === t0 && t0.previous !== null && t0.previous.morph.class0.is_adjective) && (t0.whitespaces_before_count < 2)) {
                    if ((rt0.referent).geo_objects.length === 0) {
                        let _geo = this.is_geo(t0.previous, true);
                        if (_geo !== null) {
                            if ((rt0.referent).add_geo_object(_geo)) 
                                rt0.begin_token = t0.previous;
                        }
                    }
                }
            }
        }
        if (ot_ex_li !== null && rt0 === null && (ot_ex_li.length < 10)) {
            for (const ot of ot_ex_li) {
                let org0 = Utils.as(ot.item.referent, OrganizationReferent);
                if (org0 === null) 
                    continue;
                if (org0.names.length === 0 && org0.eponyms.length === 0) 
                    continue;
                let tyty = OrgItemTypeToken.try_attach(ot.begin_token, true, null);
                if (tyty !== null && tyty.begin_token === ot.end_token) 
                    continue;
                let ts = ot.begin_token;
                let te = ot.end_token;
                let is_quots = false;
                let is_very_doubt = false;
                let name_eq = false;
                if (BracketHelper.can_be_start_of_sequence(ts.previous, false, false) && BracketHelper.is_bracket(ts.previous, false)) {
                    if (BracketHelper.can_be_end_of_sequence(te.next, false, null, false)) {
                        if (ot.length_char < 2) 
                            continue;
                        if (ot.length_char === 2 && !org0.names.includes(te.get_source_text())) {
                        }
                        else {
                            is_quots = true;
                            ts = ts.previous;
                            te = te.next;
                        }
                    }
                    else 
                        continue;
                }
                ok = types !== null;
                if (ot.end_token.next !== null && (ot.end_token.next.get_referent() instanceof OrganizationReferent)) 
                    ok = true;
                else if (ot.end_token !== ot.begin_token) {
                    if (step === 0) {
                        if (!t.kit.misc_data.containsKey("o2step")) 
                            t.kit.misc_data.put("o2step", null);
                        continue;
                    }
                    if (!ot.begin_token.chars.is_all_lower) 
                        ok = true;
                    else if (spec_word_before || is_quots) 
                        ok = true;
                }
                else if (ot.begin_token instanceof TextToken) {
                    if (step === 0) {
                        if (!t.kit.misc_data.containsKey("o2step")) 
                            t.kit.misc_data.put("o2step", null);
                        continue;
                    }
                    ok = false;
                    let len = ot.begin_token.length_char;
                    if (!ot.chars.is_all_lower) {
                        if (!ot.chars.is_all_upper && ot.morph.class0.is_preposition) 
                            continue;
                        for (const n of org0.names) {
                            if (ot.begin_token.is_value(n, null)) {
                                name_eq = true;
                                break;
                            }
                        }
                        let ano = org0.find_near_occurence(ot.begin_token);
                        if (ano === null) {
                            if (!ot.item.owner.is_ext_ontology) {
                                if (len < 3) 
                                    continue;
                                else 
                                    is_very_doubt = true;
                            }
                        }
                        else {
                            if (len === 2 && !t.chars.is_all_upper) 
                                continue;
                            let d = ano.begin_char - ot.begin_token.begin_char;
                            if (d < 0) 
                                d = -d;
                            if (d > 2000) {
                                if (len < 3) 
                                    continue;
                                else if (len < 5) 
                                    is_very_doubt = true;
                            }
                            else if (d > 300) {
                                if (len < 3) 
                                    continue;
                            }
                            else if (len < 3) {
                                if (d > 100 || !ot.begin_token.chars.is_all_upper) 
                                    is_very_doubt = true;
                            }
                        }
                        if (((ot.begin_token.chars.is_all_upper || ot.begin_token.chars.is_last_lower)) && ((len > 3 || ((len === 3 && ((name_eq || ano !== null))))))) 
                            ok = true;
                        else if ((spec_word_before || types !== null || is_quots) || name_eq) 
                            ok = true;
                        else if ((ot.length_char < 3) && is_very_doubt) 
                            continue;
                        else if (ot.item.owner.is_ext_ontology && ot.begin_token.get_morph_class_in_dictionary().is_undefined && ((len > 3 || ((len === 3 && ((name_eq || ano !== null))))))) 
                            ok = true;
                        else if (ot.begin_token.chars.is_latin_letter) 
                            ok = true;
                        else if ((name_eq && !ot.chars.is_all_lower && !ot.item.owner.is_ext_ontology) && !MiscHelper.can_be_start_of_sentence(ot.begin_token)) 
                            ok = true;
                    }
                }
                else if (ot.begin_token instanceof ReferentToken) {
                    let r = ot.begin_token.get_referent();
                    if (r.type_name !== "DENOMINATION" && !is_quots) 
                        ok = false;
                }
                if (!ok) {
                }
                if (ok) {
                    ok = false;
                    _org = new OrganizationReferent();
                    if (types !== null) {
                        for (const ty of types) {
                            _org.add_type(ty, false);
                        }
                        if (!_org.can_be_equals(org0, ReferentEqualType.FORMERGING)) 
                            continue;
                    }
                    else 
                        for (const ty of org0.types) {
                            _org.add_type_str(ty);
                        }
                    if (org0.number !== null && (ot.begin_token.previous instanceof NumberToken) && _org.number === null) {
                        if (org0.number !== (ot.begin_token.previous).value.toString() && (ot.begin_token.whitespaces_before_count < 2)) {
                            if (_org.names.length > 0 || _org.higher !== null) {
                                is_very_doubt = false;
                                ok = true;
                                _org.number = (ot.begin_token.previous).value.toString();
                                if (org0.higher !== null) 
                                    _org.higher = org0.higher;
                                t0 = ot.begin_token.previous;
                            }
                        }
                    }
                    if (_org.number === null) {
                        let ttt = ot.end_token.next;
                        let nnn = OrgItemNumberToken.try_attach(ttt, (org0.number !== null || !ot.is_whitespace_after), null);
                        if (nnn === null && !ot.is_whitespace_after && ttt !== null) {
                            if (ttt.is_hiphen && ttt.next !== null) 
                                ttt = ttt.next;
                            if (ttt instanceof NumberToken) 
                                nnn = OrgItemNumberToken._new1818(ot.end_token.next, ttt, (ttt).value.toString());
                        }
                        if (nnn !== null) {
                            _org.number = nnn.number;
                            te = nnn.end_token;
                        }
                    }
                    let norm = (ot.end_token.end_char - ot.begin_token.begin_char) > 5;
                    let s = MiscHelper.get_text_value_of_meta_token(ot, GetTextAttr.of((((norm ? GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE : GetTextAttr.NO)).value()) | (GetTextAttr.IGNOREARTICLES.value())));
                    _org.add_name(s, true, (norm ? null : ot.begin_token));
                    if (types === null || types.length === 0) {
                        let s1 = MiscHelper.get_text_value_of_meta_token(ot, GetTextAttr.IGNOREARTICLES);
                        if (s1 !== s && norm) 
                            _org.add_name(s1, true, ot.begin_token);
                    }
                    t1 = te;
                    if (t1.is_char(')') && t1.is_newline_after) {
                    }
                    else {
                        t1 = Utils.notNull(this.attach_middle_attributes(_org, t1.next), t1);
                        if (attach_typ !== OrganizationAnalyzerAttachType.NORMALAFTERDEP) 
                            t1 = Utils.notNull(this.attach_tail_attributes(_org, t1.next, ad, false, OrganizationAnalyzerAttachType.NORMAL, false), t1);
                    }
                    let hi = null;
                    if (t1.next !== null) 
                        hi = Utils.as(t1.next.get_referent(), OrganizationReferent);
                    if (org0.higher !== null && hi !== null && ot_ex_li.length === 1) {
                        if (hi.can_be_equals(org0.higher, ReferentEqualType.WITHINONETEXT)) {
                            _org.higher = hi;
                            t1 = t1.next;
                        }
                    }
                    if ((_org.eponyms.length === 0 && _org.number === null && is_very_doubt) && !name_eq && types === null) 
                        continue;
                    if (!_org.can_be_equals_ex(org0, true, ReferentEqualType.WITHINONETEXT)) {
                        if (t !== null && OrgItemTypeToken.check_org_special_word_before(t.previous)) 
                            ok = true;
                        else if (!is_very_doubt && ok) {
                        }
                        else {
                            if (!is_very_doubt) {
                                if (_org.eponyms.length > 0 || _org.number !== null || _org.higher !== null) 
                                    ok = true;
                            }
                            ok = false;
                        }
                    }
                    else if (_org.can_be_equals(org0, ReferentEqualType.DIFFERENTTEXTS)) {
                        _org.merge_slots(org0, false);
                        ok = true;
                    }
                    else if (org0.higher === null || _org.higher !== null || ot.item.owner.is_ext_ontology) {
                        ok = true;
                        _org.merge_slots(org0, false);
                    }
                    else if (!ot.item.owner.is_ext_ontology && _org.can_be_equals(org0, ReferentEqualType.WITHINONETEXT)) {
                        if (org0.higher === null) 
                            _org.merge_slots(org0, false);
                        ok = true;
                    }
                    if (!ok) 
                        continue;
                    if (ts.begin_char < t0.begin_char) 
                        t0 = ts;
                    rt0 = new ReferentToken(_org, t0, t1);
                    if (_org.kind === OrganizationKind.DEPARTMENT) 
                        this.correct_dep_attrs(rt0, typ, false);
                    this._correct_after(rt0);
                    if (ot.item.owner.is_ext_ontology) {
                        for (const sl of _org.slots) {
                            if (sl.value instanceof Referent) {
                                let ext = false;
                                for (const ss of org0.slots) {
                                    if (ss.value === sl.value) {
                                        ext = true;
                                        break;
                                    }
                                }
                                if (!ext) 
                                    continue;
                                let rr = (sl.value).clone();
                                rr.occurrence.splice(0, rr.occurrence.length);
                                _org.upload_slot(sl, rr);
                                let rt_ex = new ReferentToken(rr, t0, t1);
                                rt_ex.set_default_local_onto(t0.kit.processor);
                                _org.add_ext_referent(rt_ex);
                                for (const sss of rr.slots) {
                                    if (sss.value instanceof Referent) {
                                        let rrr = (sss.value).clone();
                                        rrr.occurrence.splice(0, rrr.occurrence.length);
                                        rr.upload_slot(sss, rrr);
                                        let rt_ex2 = new ReferentToken(rrr, t0, t1);
                                        rt_ex2.set_default_local_onto(t0.kit.processor);
                                        (sl.value).add_ext_referent(rt_ex2);
                                    }
                                }
                            }
                        }
                    }
                    this._correct_after(rt0);
                    return rt0;
                }
            }
        }
        if ((rt0 === null && types !== null && types.length === 1) && types[0].name === null) {
            let tt0 = null;
            if (MiscHelper.is_eng_article(types[0].begin_token)) 
                tt0 = types[0].begin_token;
            else if (MiscHelper.is_eng_adj_suffix(types[0].end_token.next)) 
                tt0 = types[0].begin_token;
            else {
                let tt00 = types[0].begin_token.previous;
                if (tt00 !== null && (tt00.whitespaces_after_count < 2) && tt00.chars.is_latin_letter === types[0].chars.is_latin_letter) {
                    if (MiscHelper.is_eng_article(tt00)) 
                        tt0 = tt00;
                    else if (tt00.morph.class0.is_preposition || tt00.morph.class0.is_pronoun) 
                        tt0 = tt00.next;
                }
            }
            let cou = 100;
            if (tt0 !== null) {
                for (let tt00 = tt0.previous; tt00 !== null && cou > 0; tt00 = tt00.previous,cou--) {
                    if (tt00.get_referent() instanceof OrganizationReferent) {
                        if (OrgItemTypeToken.is_type_accords((Utils.as(tt00.get_referent(), OrganizationReferent)), types[0])) {
                            if ((types[0].whitespaces_after_count < 3) && OrgItemTypeToken.try_attach(types[0].end_token.next, true, null) !== null) {
                            }
                            else 
                                rt0 = new ReferentToken(tt00.get_referent(), tt0, types[0].end_token);
                        }
                        break;
                    }
                }
            }
        }
        if (rt0 !== null) 
            this.correct_owner_before(rt0);
        if (hiph && !in_brackets && ((attach_typ === OrganizationAnalyzerAttachType.NORMAL || attach_typ === OrganizationAnalyzerAttachType.NORMALAFTERDEP))) {
            let ok1 = false;
            if (rt0 !== null && BracketHelper.can_be_end_of_sequence(rt0.end_token, true, null, false)) {
                if (types.length > 0) {
                    let ty = types[types.length - 1];
                    if (ty.end_token.next !== null && ty.end_token.next.is_hiphen && BracketHelper.can_be_start_of_sequence(ty.end_token.next.next, true, false)) 
                        ok1 = true;
                }
            }
            else if (rt0 !== null && rt0.end_token.next !== null && rt0.end_token.next.is_hiphen) {
                let ty = OrgItemTypeToken.try_attach(rt0.end_token.next.next, false, null);
                if (ty === null) 
                    ok1 = true;
            }
            if (!ok1) 
                return null;
        }
        if (attach_typ === OrganizationAnalyzerAttachType.MULTIPLE && t !== null) {
            if (t.chars.is_all_lower) 
                return null;
        }
        if (rt0 === null) 
            return rt0;
        let doubt = rt0.tag !== null;
        _org = Utils.as(rt0.referent, OrganizationReferent);
        if (doubt && ad !== null) {
            let rli = ad.local_ontology.try_attach_by_referent(_org, null, true);
            if (rli !== null && rli.length > 0) 
                doubt = false;
            else 
                for (const it of ad.local_ontology.items) {
                    if (it.referent !== null) {
                        if (it.referent.can_be_equals(_org, ReferentEqualType.WITHINONETEXT)) {
                            doubt = false;
                            break;
                        }
                    }
                }
        }
        if ((ad !== null && t !== null && t.kit.ontology !== null) && attach_typ === OrganizationAnalyzerAttachType.NORMAL && doubt) {
            let rli = t.kit.ontology.attach_referent(_org);
            if (rli !== null) {
                if (rli.length >= 1) 
                    doubt = false;
            }
        }
        if (doubt) 
            return null;
        this._correct_after(rt0);
        return rt0;
    }
    
    _correct_after(rt0) {
        if (rt0 === null) 
            return;
        if (!rt0.is_newline_after && rt0.end_token.next !== null && rt0.end_token.next.is_char('(')) {
            let tt = rt0.end_token.next.next;
            if (tt instanceof TextToken) {
                if (tt.is_char(')')) 
                    rt0.end_token = tt;
                else if ((tt.length_char > 2 && (tt.length_char < 7) && tt.chars.is_latin_letter) && tt.chars.is_all_upper) {
                    let act = tt.get_source_text().toUpperCase();
                    if ((tt.next instanceof NumberToken) && !tt.is_whitespace_after && (tt.next).typ === NumberSpellingType.DIGIT) {
                        tt = tt.next;
                        act += tt.get_source_text();
                    }
                    if (tt.next !== null && tt.next.is_char(')')) {
                        rt0.referent.add_slot(OrganizationReferent.ATTR_MISC, act, false, 0);
                        rt0.end_token = tt.next;
                    }
                }
                else {
                    let _org = Utils.as(rt0.referent, OrganizationReferent);
                    if (_org.kind === OrganizationKind.BANK && tt.chars.is_latin_letter) {
                    }
                }
            }
        }
        if (rt0.is_newline_before && rt0.is_newline_after && rt0.end_token.next !== null) {
            let t1 = rt0.end_token.next;
            let typ1 = OrgItemTypeToken.try_attach(t1, false, null);
            if ((typ1 !== null && typ1.is_newline_after && typ1.root !== null) && typ1.root.typ === OrgItemTerminTypes.PREFIX) {
                if (this.try_attach_org(t1, null, OrganizationAnalyzerAttachType.NORMAL, null, false, 0, -1) === null) {
                    (rt0.referent).add_type(typ1, false);
                    rt0.end_token = typ1.end_token;
                }
            }
            if (t1.is_char('(')) {
                if ((((typ1 = OrgItemTypeToken.try_attach(t1.next, false, null)))) !== null) {
                    if ((typ1.root !== null && typ1.root.typ === OrgItemTerminTypes.PREFIX && typ1.end_token.next !== null) && typ1.end_token.next.is_char(')') && typ1.end_token.next.is_newline_after) {
                        (rt0.referent).add_type(typ1, false);
                        rt0.end_token = typ1.end_token.next;
                    }
                }
            }
        }
    }
    
    static _last_typ(types) {
        if (types === null) 
            return null;
        for (let i = types.length - 1; i >= 0; i--) {
            return types[i];
        }
        return null;
    }
    
    _try_attach_org_(t0, t, ad, types, spec_word_before, attach_typ, mult_typ, is_additional_attach, level) {
        const OrgItemEngItem = require("./internal/OrgItemEngItem");
        const OrgItemEponymToken = require("./internal/OrgItemEponymToken");
        const OrgItemNameToken = require("./internal/OrgItemNameToken");
        if (t0 === null) 
            return null;
        let t1 = t;
        let typ = OrganizationAnalyzer._last_typ(types);
        if (typ !== null) {
            if (typ.is_dep) {
                let rt0 = this.try_attach_dep(typ, attach_typ, spec_word_before);
                if (rt0 !== null) 
                    return rt0;
                if (typ.typ === "группа" || typ.typ === "група") 
                    typ.is_dep = false;
                else 
                    return null;
            }
            if (typ.is_newline_after && typ.name === null) {
                if (t1 !== null && (t1.get_referent() instanceof GeoReferent) && typ.profiles.includes(OrgProfile.STATE)) {
                }
                else if (typ.root !== null && ((typ.root.coeff >= 3 || typ.root.is_pure_prefix))) {
                }
                else if (typ.coef >= 4) {
                }
                else if ((typ.coef >= 3 && (typ.newlines_after_count < 2) && typ.end_token.next !== null) && typ.end_token.next.morph.class0.is_preposition) {
                }
                else 
                    return null;
            }
            if (typ !== mult_typ && ((typ.morph.number === MorphNumber.PLURAL && !Utils.isUpperCase(typ.typ[0])))) {
                if (BracketHelper.can_be_start_of_sequence(t, true, false)) {
                }
                else if (typ.end_token.is_value("ВЛАСТЬ", null)) {
                }
                else 
                    return null;
            }
            if (attach_typ === OrganizationAnalyzerAttachType.NORMAL || attach_typ === OrganizationAnalyzerAttachType.NORMALAFTERDEP) {
                if (((typ.typ === "предприятие" || typ.typ === "підприємство")) && !spec_word_before && types.length === 1) 
                    return null;
            }
        }
        let _org = new OrganizationReferent();
        if (types !== null) {
            for (const ty of types) {
                _org.add_type(ty, false);
            }
        }
        if (typ !== null && typ.root !== null && typ.root.is_pure_prefix) {
            if ((t instanceof TextToken) && t.chars.is_all_upper && !t.is_newline_after) {
                let b = BracketHelper.try_parse(t.next, BracketParseAttr.NO, 100);
                if (b !== null && b.is_quote_type) {
                    _org.add_type_str((t).term);
                    t = t.next;
                }
                else {
                    let s = (t).term;
                    if (s.length === 2 && s[s.length - 1] === 'К') {
                        _org.add_type_str(s);
                        t = t.next;
                    }
                    else if (((t.get_morph_class_in_dictionary().is_undefined && t.next !== null && (t.next instanceof TextToken)) && t.next.chars.is_capital_upper && t.next.next !== null) && !t.next.is_newline_after) {
                        if (t.next.next.is_char_of(",.;") || BracketHelper.can_be_end_of_sequence(t.next.next, false, null, false)) {
                            _org.add_type_str(s);
                            t = t.next;
                        }
                    }
                }
            }
            else if ((t instanceof TextToken) && t.morph.class0.is_adjective && !t.chars.is_all_lower) {
                let rtg = Utils.as(this.is_geo(t, true), ReferentToken);
                if (rtg !== null && BracketHelper.can_be_start_of_sequence(rtg.end_token.next, false, false)) {
                    _org.add_geo_object(rtg);
                    t = rtg.end_token.next;
                }
            }
            else if ((t !== null && (t.get_referent() instanceof GeoReferent) && t.next !== null) && BracketHelper.can_be_start_of_sequence(t.next, true, false)) {
                _org.add_geo_object(t.get_referent());
                t = t.next;
            }
        }
        let te = null;
        let ki0 = _org.kind;
        if (((((ki0 === OrganizationKind.GOVENMENT || ki0 === OrganizationKind.AIRPORT || ki0 === OrganizationKind.FACTORY) || ki0 === OrganizationKind.SEAPORT || ki0 === OrganizationKind.PARTY) || ki0 === OrganizationKind.JUSTICE || ki0 === OrganizationKind.MILITARY)) && t !== null) {
            let g = this.is_geo(t, false);
            if (g === null && t.morph.class0.is_preposition && t.next !== null) 
                g = this.is_geo(t.next, false);
            if (g !== null) {
                if (_org.add_geo_object(g)) {
                    te = (t1 = this.get_geo_end_token(g, t));
                    t = t1.next;
                    let gt = OrgGlobal.GLOBAL_ORGS.try_attach(t, null, false);
                    if (gt === null && t !== null && t.kit.base_language.is_ua) 
                        gt = OrgGlobal.GLOBAL_ORGS_UA.try_attach(t, null, false);
                    if (gt !== null && gt.length === 1) {
                        if (_org.can_be_equals(gt[0].item.referent, ReferentEqualType.FORMERGING)) {
                            _org.merge_slots(gt[0].item.referent, false);
                            return new ReferentToken(_org, t0, gt[0].end_token);
                        }
                    }
                }
            }
        }
        if (typ !== null && typ.root !== null && ((typ.root.can_be_single_geo && !typ.root.can_has_single_name))) {
            if (_org.geo_objects.length > 0 && te !== null) 
                return new ReferentToken(_org, t0, te);
            let r = null;
            te = (t1 = (typ !== mult_typ ? typ.end_token : t0.previous));
            if (t !== null && t1.next !== null) {
                r = this.is_geo(t1.next, false);
                if (r === null && t1.next.morph.class0.is_preposition) 
                    r = this.is_geo(t1.next.next, false);
            }
            if (r !== null) {
                if (!_org.add_geo_object(r)) 
                    return null;
                te = this.get_geo_end_token(r, t1.next);
            }
            if (_org.geo_objects.length > 0 && te !== null) {
                let npt11 = NounPhraseHelper.try_parse(te.next, NounPhraseParseAttr.NO, 0, null);
                if (npt11 !== null && (te.whitespaces_after_count < 2) && npt11.noun.is_value("ДЕПУТАТ", null)) {
                }
                else {
                    let res11 = new ReferentToken(_org, t0, te);
                    if (_org.find_slot(OrganizationReferent.ATTR_TYPE, "посольство", true) !== null) {
                        if (te.next !== null && te.next.is_value("В", null)) {
                            r = this.is_geo(te.next.next, false);
                            if (_org.add_geo_object(r)) 
                                res11.end_token = this.get_geo_end_token(r, te.next.next);
                        }
                    }
                    return res11;
                }
            }
        }
        if (typ !== null && (((typ.typ === "милиция" || typ.typ === "полиция" || typ.typ === "міліція") || typ.typ === "поліція"))) {
            if (_org.geo_objects.length > 0 && te !== null) 
                return new ReferentToken(_org, t0, te);
            else 
                return null;
        }
        if (t !== null && t.morph.class0.is_proper_name) {
            let rt1 = t.kit.process_referent("PERSON", t);
            if (rt1 !== null && (rt1.whitespaces_after_count < 2)) {
                if (BracketHelper.can_be_start_of_sequence(rt1.end_token.next, true, false)) 
                    t = rt1.end_token.next;
                else if (rt1.end_token.next !== null && rt1.end_token.next.is_hiphen && BracketHelper.can_be_start_of_sequence(rt1.end_token.next.next, true, false)) 
                    t = rt1.end_token.next.next;
            }
        }
        else if ((t !== null && t.chars.is_capital_upper && t.morph.class0.is_proper_surname) && t.next !== null && (t.whitespaces_after_count < 2)) {
            if (BracketHelper.can_be_start_of_sequence(t.next, true, false)) 
                t = t.next;
            else if (((t.next.is_char_of(":") || t.next.is_hiphen)) && BracketHelper.can_be_start_of_sequence(t.next.next, true, false)) 
                t = t.next.next;
        }
        let tmax = null;
        let br = null;
        if (t !== null) {
            br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
            if (typ !== null && br === null && BracketHelper.can_be_start_of_sequence(t, false, false)) {
                if (t.next !== null && (t.next.get_referent() instanceof OrganizationReferent)) {
                    let org0 = Utils.as(t.next.get_referent(), OrganizationReferent);
                    if (!OrgItemTypeToken.is_types_antagonisticoo(_org, org0)) {
                        org0.merge_slots(_org, false);
                        return new ReferentToken(org0, t0, t.next);
                    }
                }
                if (((typ.typ === "компания" || typ.typ === "предприятие" || typ.typ === "организация") || typ.typ === "компанія" || typ.typ === "підприємство") || typ.typ === "організація") {
                    if (OrgItemTypeToken.is_decree_keyword(t0.previous, 1)) 
                        return null;
                }
                let ty2 = OrgItemTypeToken.try_attach(t.next, false, null);
                if (ty2 !== null) {
                    let typs2 = new Array();
                    typs2.push(ty2);
                    let rt2 = this._try_attach_org_(t.next, ty2.end_token.next, ad, typs2, true, OrganizationAnalyzerAttachType.HIGH, null, is_additional_attach, level + 1);
                    if (rt2 !== null) {
                        let org0 = Utils.as(rt2.referent, OrganizationReferent);
                        if (!OrgItemTypeToken.is_types_antagonisticoo(_org, org0)) {
                            org0.merge_slots(_org, false);
                            rt2.begin_token = t0;
                            if (BracketHelper.can_be_end_of_sequence(rt2.end_token.next, false, null, false)) 
                                rt2.end_token = rt2.end_token.next;
                            return rt2;
                        }
                    }
                }
            }
        }
        if (br !== null && typ !== null && _org.kind === OrganizationKind.GOVENMENT) {
            if (typ.root !== null && !typ.root.can_has_single_name) 
                br = null;
        }
        if (br !== null && br.is_quote_type) {
            if (br.begin_token.next.is_value("О", null) || br.begin_token.next.is_value("ОБ", null)) 
                br = null;
            else if (br.begin_token.previous !== null && br.begin_token.previous.is_char(':')) 
                br = null;
        }
        if (br !== null && br.is_quote_type && ((br.open_char !== '<' || ((typ !== null && typ.root !== null && typ.root.is_pure_prefix))))) {
            if (t.is_newline_before && ((attach_typ === OrganizationAnalyzerAttachType.NORMAL || attach_typ === OrganizationAnalyzerAttachType.NORMALAFTERDEP))) {
                if (!br.is_newline_after) 
                    return null;
            }
            if (_org.find_slot(OrganizationReferent.ATTR_TYPE, "организация", true) !== null || _org.find_slot(OrganizationReferent.ATTR_TYPE, "організація", true) !== null) {
                if (typ.begin_token === typ.end_token) {
                    if (!spec_word_before) 
                        return null;
                }
            }
            if (typ !== null && ((((typ.typ === "компания" || typ.typ === "предприятие" || typ.typ === "организация") || typ.typ === "компанія" || typ.typ === "підприємство") || typ.typ === "організація"))) {
                if (OrgItemTypeToken.is_decree_keyword(t0.previous, 1)) 
                    return null;
            }
            let nn = OrgItemNameToken.try_attach(t.next, null, false, true);
            if (nn !== null && nn.is_ignored_part) 
                t = nn.end_token;
            let org0 = Utils.as(t.next.get_referent(), OrganizationReferent);
            if (org0 !== null) {
                if (!OrgItemTypeToken.is_types_antagonisticoo(_org, org0) && t.next.next !== null) {
                    if (BracketHelper.can_be_end_of_sequence(t.next.next, false, null, false)) {
                        org0.merge_slots(_org, false);
                        return new ReferentToken(org0, t0, t.next.next);
                    }
                    if ((t.next.next.get_referent() instanceof OrganizationReferent) && BracketHelper.can_be_end_of_sequence(t.next.next.next, false, null, false)) {
                        org0.merge_slots(_org, false);
                        return new ReferentToken(org0, t0, t.next);
                    }
                }
                return null;
            }
            let na0 = OrgItemNameToken.try_attach(br.begin_token.next, null, false, true);
            if (na0 !== null && na0.is_empty_word && na0.end_token.next === br.end_token) 
                return null;
            let rt0 = this.try_attach_org(t.next, null, attach_typ, null, is_additional_attach, level + 1, -1);
            if (br.internal.length > 1) {
                if (rt0 !== null && BracketHelper.can_be_end_of_sequence(rt0.end_token, false, null, false)) 
                    br.end_token = rt0.end_token;
                else 
                    return null;
            }
            let abbr = null;
            let tt00 = (rt0 === null ? null : rt0.begin_token);
            if (((rt0 === null && t.next !== null && (t.next instanceof TextToken)) && t.next.chars.is_all_upper && t.next.length_char > 2) && t.next.chars.is_cyrillic_letter) {
                rt0 = this.try_attach_org(t.next.next, null, attach_typ, null, is_additional_attach, level + 1, -1);
                if (rt0 !== null && rt0.begin_token === t.next.next) {
                    tt00 = t.next;
                    abbr = t.next.get_source_text();
                }
                else 
                    rt0 = null;
            }
            let ok2 = false;
            if (rt0 !== null) {
                if (rt0.end_token === br.end_token.previous || rt0.end_token === br.end_token) 
                    ok2 = true;
                else if (BracketHelper.can_be_end_of_sequence(rt0.end_token, false, null, false) && rt0.end_char > br.end_char) {
                    let br2 = BracketHelper.try_parse(br.end_token.next, BracketParseAttr.NO, 100);
                    if (br2 !== null && rt0.end_token === br2.end_token) 
                        ok2 = true;
                }
            }
            if (ok2 && (rt0.referent instanceof OrganizationReferent)) {
                org0 = Utils.as(rt0.referent, OrganizationReferent);
                if (typ !== null && typ.typ === "служба" && ((org0.kind === OrganizationKind.MEDIA || org0.kind === OrganizationKind.PRESS))) {
                    if (br.begin_token === rt0.begin_token && br.end_token === rt0.end_token) 
                        return rt0;
                }
                let typ1 = null;
                if (tt00 !== t.next) {
                    typ1 = OrgItemTypeToken.try_attach(t.next, false, ad);
                    if (typ1 !== null && typ1.end_token.next === tt00) 
                        _org.add_type(typ1, false);
                }
                let hi = false;
                if (OrgOwnershipHelper.can_be_higher(org0, _org, true)) {
                    if (OrgItemTypeToken.is_types_antagonisticoo(org0, _org)) 
                        hi = true;
                }
                if (hi) {
                    _org.higher = org0;
                    rt0.set_default_local_onto(t.kit.processor);
                    _org.add_ext_referent(rt0);
                    if (typ1 !== null) 
                        _org.add_type(typ1, true);
                    if (abbr !== null) 
                        _org.add_name(abbr, true, null);
                }
                else if (!OrgItemTypeToken.is_types_antagonisticoo(org0, _org)) {
                    _org.merge_slots(org0, true);
                    if (abbr !== null) {
                        for (const s of _org.slots) {
                            if (s.type_name === OrganizationReferent.ATTR_NAME) 
                                _org.upload_slot(s, (abbr + " " + s.value));
                        }
                    }
                }
                else 
                    rt0 = null;
                if (rt0 !== null) {
                    let t11 = br.end_token;
                    if (rt0.end_char > t11.end_char) 
                        t11 = rt0.end_token;
                    let ep11 = OrgItemEponymToken.try_attach(t11.next, true);
                    if (ep11 !== null) {
                        t11 = ep11.end_token;
                        for (const e of ep11.eponyms) {
                            _org.add_eponym(e);
                        }
                    }
                    t1 = this.attach_tail_attributes(_org, t11.next, null, true, attach_typ, false);
                    if (t1 === null) 
                        t1 = t11;
                    if (typ !== null) {
                        if ((typ.name !== null && typ.geo === null && _org.names.length > 0) && !_org.names.includes(typ.name)) 
                            _org.add_type_str(typ.name.toLowerCase());
                    }
                    return new ReferentToken(_org, t0, t1);
                }
            }
            if (rt0 !== null && (rt0.end_char < br.end_token.previous.end_char)) {
                let rt1 = this.try_attach_org(rt0.end_token.next, null, attach_typ, null, is_additional_attach, level + 1, -1);
                if (rt1 !== null && rt1.end_token.next === br.end_token) 
                    return rt1;
                let org1 = Utils.as(rt0.end_token.next.get_referent(), OrganizationReferent);
                if (org1 !== null && br.end_token.previous === rt0.end_token) {
                }
            }
            for (let step = 0; step < 2; step++) {
                let tt0 = t.next;
                let tt1 = null;
                let pref = true;
                let not_empty = 0;
                for (t1 = t.next; t1 !== null && t1 !== br.end_token; t1 = t1.next) {
                    if (t1.is_char('(')) {
                        if (not_empty === 0) 
                            break;
                        let r = null;
                        if (t1.next !== null) 
                            r = t1.next.get_referent();
                        if (r !== null && t1.next.next !== null && t1.next.next.is_char(')')) {
                            if (r.type_name === OrganizationAnalyzer.geoname) {
                                _org.add_geo_object(r);
                                break;
                            }
                        }
                        if (level === 0) {
                            let rt = this.try_attach_org(t1.next, null, OrganizationAnalyzerAttachType.HIGH, null, false, level + 1, -1);
                            if (rt !== null && rt.end_token.next !== null && rt.end_token.next.is_char(')')) {
                                if (!OrganizationReferent.can_be_second_definition(_org, Utils.as(rt.referent, OrganizationReferent))) 
                                    break;
                                _org.merge_slots(rt.referent, false);
                            }
                        }
                        break;
                    }
                    else if ((((org0 = Utils.as(t1.get_referent(), OrganizationReferent)))) !== null) {
                        if (((t1.previous instanceof NumberToken) && t1.previous.previous === br.begin_token && !OrgItemTypeToken.is_types_antagonisticoo(_org, org0)) && org0.number === null) {
                            org0.number = (t1.previous).value.toString();
                            org0.merge_slots(_org, false);
                            if (BracketHelper.can_be_end_of_sequence(t1.next, false, null, false)) 
                                t1 = t1.next;
                            return new ReferentToken(org0, t0, t1);
                        }
                        let ne = OrgItemNameToken.try_attach(br.begin_token.next, null, attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY, true);
                        if (ne !== null && ne.is_ignored_part && ne.end_token.next === t1) {
                            org0.merge_slots(_org, false);
                            if (BracketHelper.can_be_end_of_sequence(t1.next, false, null, false)) 
                                t1 = t1.next;
                            return new ReferentToken(org0, t0, t1);
                        }
                        return null;
                    }
                    else {
                        typ = OrgItemTypeToken.try_attach(t1, false, null);
                        if (typ !== null && types !== null) {
                            for (const ty of types) {
                                if (OrgItemTypeToken.is_types_antagonistictt(ty, typ)) {
                                    typ = null;
                                    break;
                                }
                            }
                        }
                        if (typ !== null) {
                            if (typ.is_doubt_root_word && ((typ.end_token.next === br.end_token || ((typ.end_token.next !== null && typ.end_token.next.is_hiphen))))) 
                                typ = null;
                            else if (typ.morph.number === MorphNumber.PLURAL) 
                                typ = null;
                            else if (!typ.morph._case.is_undefined && !typ.morph._case.is_nominative) 
                                typ = null;
                            else if (typ.begin_token === typ.end_token) {
                                let ttt = typ.end_token.next;
                                if (ttt !== null && ttt.is_hiphen) 
                                    ttt = ttt.next;
                                if (ttt !== null) {
                                    if (ttt.is_value("БАНК", null)) 
                                        typ = null;
                                }
                            }
                        }
                        let _ep = null;
                        if (typ === null) 
                            _ep = OrgItemEponymToken.try_attach(t1, false);
                        let nu = OrgItemNumberToken.try_attach(t1, false, null);
                        if (nu !== null && !((t1 instanceof NumberToken))) {
                            _org.number = nu.number;
                            tt1 = t1.previous;
                            t1 = nu.end_token;
                            not_empty += 2;
                            continue;
                        }
                        let br_spec = false;
                        if ((br.internal.length === 0 && (br.end_token.next instanceof TextToken) && ((!br.end_token.next.chars.is_all_lower && br.end_token.next.chars.is_letter))) && BracketHelper.can_be_end_of_sequence(br.end_token.next.next, true, null, false)) 
                            br_spec = true;
                        if (typ !== null && ((pref || !typ.is_dep))) {
                            if (not_empty > 1) {
                                let rrr = this.try_attach_org(typ.begin_token, ad, OrganizationAnalyzerAttachType.NORMAL, null, false, level + 1, -1);
                                if (rrr !== null) {
                                    br.end_token = (t1 = typ.begin_token.previous);
                                    break;
                                }
                            }
                            if (((attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY || attach_typ === OrganizationAnalyzerAttachType.HIGH)) && ((typ.root === null || !typ.root.is_pure_prefix))) 
                                pref = false;
                            else if (typ.name === null) {
                                _org.add_type(typ, false);
                                if (pref) 
                                    tt0 = typ.end_token.next;
                                else if (typ.root !== null && typ.root.is_pure_prefix) {
                                    tt1 = typ.begin_token.previous;
                                    break;
                                }
                            }
                            else if (typ.end_token.next !== br.end_token) {
                                _org.add_type(typ, false);
                                if (typ.typ === "банк") 
                                    pref = false;
                                else {
                                    _org.add_type_str(typ.name.toLowerCase());
                                    _org.add_type_str(typ.alt_typ);
                                    if (pref) 
                                        tt0 = typ.end_token.next;
                                }
                            }
                            else if (br_spec) {
                                _org.add_type(typ, false);
                                _org.add_type_str(typ.name.toLowerCase());
                                not_empty += 2;
                                tt0 = br.end_token.next;
                                t1 = tt0.next;
                                br.end_token = t1;
                                break;
                            }
                            if (typ !== mult_typ) {
                                t1 = typ.end_token;
                                if (typ.geo !== null) 
                                    _org.add_type(typ, false);
                            }
                        }
                        else if (_ep !== null) {
                            for (const e of _ep.eponyms) {
                                _org.add_eponym(e);
                            }
                            not_empty += 3;
                            t1 = _ep.begin_token.previous;
                            break;
                        }
                        else if (t1 === t.next && (t1 instanceof TextToken) && t1.chars.is_all_lower) 
                            return null;
                        else if (t1.chars.is_letter || (t1 instanceof NumberToken)) {
                            if (br_spec) {
                                tt0 = br.begin_token;
                                t1 = br.end_token.next.next;
                                let ss = MiscHelper.get_text_value(br.end_token, t1, GetTextAttr.NO);
                                if (!Utils.isNullOrEmpty(ss)) {
                                    _org.add_name(ss, true, br.end_token.next);
                                    br.end_token = t1;
                                }
                                break;
                            }
                            pref = false;
                            not_empty++;
                        }
                    }
                }
                let can_has_num = false;
                let can_has_latin_name = false;
                if (types !== null) {
                    for (const ty of types) {
                        if (ty.root !== null) {
                            if (ty.root.can_has_number) 
                                can_has_num = true;
                            if (ty.root.can_has_latin_name) 
                                can_has_latin_name = true;
                        }
                    }
                }
                te = (tt1 != null ? tt1 : t1);
                if (te !== null && tt0 !== null && (tt0.begin_char < te.begin_char)) {
                    for (let ttt = tt0; ttt !== te && ttt !== null; ttt = ttt.next) {
                        let oin = OrgItemNameToken.try_attach(ttt, null, attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY, ttt === tt0);
                        if (oin !== null) {
                            if (oin.is_ignored_part && ttt === tt0) {
                                tt0 = oin.end_token.next;
                                if (tt0 === null) 
                                    break;
                                ttt = tt0.previous;
                                continue;
                            }
                            if (oin.is_std_tail) {
                                let ei = OrgItemEngItem.try_attach(oin.begin_token, false);
                                if (ei === null && oin.begin_token.is_comma) 
                                    ei = OrgItemEngItem.try_attach(oin.begin_token.next, false);
                                if (ei !== null) {
                                    _org.add_type_str(ei.full_value);
                                    if (ei.short_value !== null) 
                                        _org.add_type_str(ei.short_value);
                                }
                                te = ttt.previous;
                                break;
                            }
                        }
                        if ((ttt !== tt0 && (ttt instanceof ReferentToken) && ttt.next === te) && (ttt.get_referent() instanceof GeoReferent)) {
                            if (ttt.previous !== null && ttt.previous.get_morph_class_in_dictionary().is_adjective) 
                                continue;
                            let npt = NounPhraseHelper.try_parse(ttt.previous, NounPhraseParseAttr.REFERENTCANBENOUN, 0, null);
                            if (npt !== null && npt.end_token === ttt) {
                            }
                            else {
                                te = ttt.previous;
                                if (te.morph.class0.is_preposition && te.previous !== null) 
                                    te = te.previous;
                            }
                            _org.add_geo_object(ttt.get_referent());
                            break;
                        }
                    }
                }
                if (te !== null && tt0 !== null && (tt0.begin_char < te.begin_char)) {
                    if ((te.previous instanceof NumberToken) && can_has_num) {
                        let err = false;
                        let num1 = Utils.as(te.previous, NumberToken);
                        if (_org.number !== null && _org.number !== num1.value.toString()) 
                            err = true;
                        else if (te.previous.previous === null) 
                            err = true;
                        else if (!te.previous.previous.is_hiphen && !te.previous.previous.chars.is_letter) 
                            err = true;
                        else if (num1.value === "0") 
                            err = true;
                        if (!err) {
                            _org.number = num1.value.toString();
                            te = te.previous.previous;
                            if (te !== null && ((te.is_hiphen || te.is_value("N", null) || te.is_value("№", null)))) 
                                te = te.previous;
                        }
                    }
                }
                let s = (te === null ? null : MiscHelper.get_text_value(tt0, te, GetTextAttr.NO));
                let s1 = (te === null ? null : MiscHelper.get_text_value(tt0, te, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE));
                if ((te !== null && (te.previous instanceof NumberToken) && can_has_num) && _org.number === null) {
                    _org.number = (te.previous).value.toString();
                    let tt11 = te.previous;
                    if (tt11.previous !== null && tt11.previous.is_hiphen) 
                        tt11 = tt11.previous;
                    if (tt11.previous !== null) {
                        s = MiscHelper.get_text_value(tt0, tt11.previous, GetTextAttr.NO);
                        s1 = MiscHelper.get_text_value(tt0, tt11.previous, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
                    }
                }
                if (!Utils.isNullOrEmpty(s)) {
                    if (tt0.morph.class0.is_preposition && tt0 !== br.begin_token.next) {
                        for (const ty of _org.types) {
                            if (!ty.includes(" ") && Utils.isLowerCase(ty[0])) {
                                s = (ty.toUpperCase() + " " + s);
                                s1 = null;
                                break;
                            }
                        }
                    }
                    if (s.length > OrganizationAnalyzer.max_org_name) 
                        return null;
                    if (s1 !== null && s1 !== s && s1.length <= s.length) 
                        _org.add_name(s1, true, null);
                    _org.add_name(s, true, tt0);
                    typ = OrganizationAnalyzer._last_typ(types);
                    if (typ !== null && typ.root !== null && typ.root.canonic_text.startsWith("ИНДИВИДУАЛЬН")) {
                        let pers = typ.kit.process_referent("PERSON", tt0);
                        if (pers !== null && pers.end_token.next === te) {
                            _org.add_ext_referent(pers);
                            _org.add_slot(OrganizationReferent.ATTR_OWNER, pers.referent, false, 0);
                        }
                    }
                    let ok1 = false;
                    for (const c of s) {
                        if (Utils.isLetterOrDigit(c)) {
                            ok1 = true;
                            break;
                        }
                    }
                    if (!ok1) 
                        return null;
                    if (br.begin_token.next.chars.is_all_lower) 
                        return null;
                    if (_org.types.length === 0) {
                        let ty = OrganizationAnalyzer._last_typ(types);
                        if (ty !== null && ty.coef >= 4) {
                        }
                        else {
                            if (attach_typ === OrganizationAnalyzerAttachType.NORMAL) 
                                return null;
                            if (_org.names.length === 1 && (_org.names[0].length < 2) && (br.length_char < 5)) 
                                return null;
                        }
                    }
                }
                else if (BracketHelper.can_be_start_of_sequence(t1, false, false)) {
                    let br1 = BracketHelper.try_parse(t1, BracketParseAttr.NO, 100);
                    if (br1 === null) 
                        break;
                    t = br1.begin_token;
                    br = br1;
                    continue;
                }
                else if (((_org.number !== null || _org.eponyms.length > 0)) && t1 === br.end_token) {
                }
                else if (_org.geo_objects.length > 0 && _org.types.length > 2) {
                }
                else 
                    return null;
                t1 = br.end_token;
                if (_org.number === null && t1.next !== null && (t1.whitespaces_after_count < 2)) {
                    let num1 = (OrgItemTypeToken.is_decree_keyword(t0.previous, 1) ? null : OrgItemNumberToken.try_attach(t1.next, false, typ));
                    if (num1 !== null) {
                        _org.number = num1.number;
                        t1 = num1.end_token;
                    }
                    else 
                        t1 = this.attach_tail_attributes(_org, t1.next, null, true, attach_typ, false);
                }
                else 
                    t1 = this.attach_tail_attributes(_org, t1.next, null, true, attach_typ, false);
                if (t1 === null) 
                    t1 = br.end_token;
                let ok0 = false;
                if (types !== null) {
                    for (const ty of types) {
                        if (ty.name !== null) 
                            _org.add_type_str(ty.name.toLowerCase());
                        if (attach_typ !== OrganizationAnalyzerAttachType.MULTIPLE && (ty.begin_char < t0.begin_char) && !ty.is_not_typ) 
                            t0 = ty.begin_token;
                        if (!ty.is_doubt_root_word || ty.coef > 0 || ty.geo !== null) 
                            ok0 = true;
                        else if (ty.typ === "движение" && ((!br.begin_token.next.chars.is_all_lower || !ty.chars.is_all_lower))) {
                            if (!br.begin_token.next.morph._case.is_genitive) 
                                ok0 = true;
                        }
                        else if (ty.typ === "АО") {
                            if (ty.begin_token.chars.is_all_upper && (ty.whitespaces_after_count < 2) && BracketHelper.is_bracket(ty.end_token.next, true)) 
                                ok0 = true;
                            else 
                                for (let tt2 = t1.next; tt2 !== null; tt2 = tt2.next) {
                                    if (tt2.is_comma) 
                                        continue;
                                    if (tt2.is_value("ИМЕНОВАТЬ", null)) 
                                        ok0 = true;
                                    if (tt2.is_value("В", null) && tt2.next !== null) {
                                        if (tt2.next.is_value("ЛИЦО", null) || tt2.next.is_value("ДАЛЬШЕЙШЕМ", null) || tt2.next.is_value("ДАЛЕЕ", null)) 
                                            ok0 = true;
                                    }
                                    break;
                                }
                        }
                    }
                }
                if (_org.eponyms.length === 0 && (t1.whitespaces_after_count < 2)) {
                    let _ep = OrgItemEponymToken.try_attach(t1.next, false);
                    if (_ep !== null) {
                        for (const e of _ep.eponyms) {
                            _org.add_eponym(e);
                        }
                        ok0 = true;
                        t1 = _ep.end_token;
                    }
                }
                if (_org.names.length === 0) {
                    s = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO);
                    s1 = (te === null ? null : MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE));
                    _org.add_name(s, true, br.begin_token.next);
                    _org.add_name(s1, true, null);
                }
                if (!ok0) {
                    if (OrgItemTypeToken.check_org_special_word_before(t0.previous)) 
                        ok0 = true;
                }
                if (!ok0 && attach_typ !== OrganizationAnalyzerAttachType.NORMAL) 
                    ok0 = true;
                typ = OrganizationAnalyzer._last_typ(types);
                if (typ !== null && typ.begin_token !== typ.end_token) 
                    ok0 = true;
                if (ok0) 
                    return new ReferentToken(_org, t0, t1);
                else 
                    return ReferentToken._new745(_org, t0, t1, _org);
            }
        }
        let num = null;
        let _num = null;
        let epon = null;
        let _epon = null;
        let names = null;
        let pr = null;
        let own_org = null;
        if (t1 === null) 
            t1 = t0;
        else if (t !== null && t.previous !== null && t.previous.begin_char >= t0.begin_char) 
            t1 = t.previous;
        br = null;
        let ok = false;
        for (; t !== null; t = t.next) {
            if (t.get_referent() instanceof OrganizationReferent) {
            }
            let rt = null;
            if ((((rt = this.attach_global_org(t, attach_typ, ad, null)))) !== null) {
                if (t === t0) {
                    if (!t.chars.is_all_lower) 
                        return rt;
                    return null;
                }
                if (level === 0) {
                    rt = this.try_attach_org(t, null, attach_typ, mult_typ, is_additional_attach, level + 1, -1);
                    if (rt !== null) 
                        return rt;
                }
            }
            if ((((_num = OrgItemNumberToken.try_attach(t, typ !== null && typ.root !== null && typ.root.can_has_number, typ)))) !== null) {
                if ((typ === null || typ.root === null || !typ.root.can_has_number) || num !== null) 
                    break;
                if (t.whitespaces_before_count > 2) {
                    if (typ.end_token.next === t && MiscHelper.check_number_prefix(t) !== null) {
                    }
                    else 
                        break;
                }
                if (typ.root.canonic_text === "СУД" && typ.name !== null) {
                    if ((((typ.name.startsWith("ВЕРХОВНЫЙ") || typ.name.startsWith("АРБИТРАЖНЫЙ") || typ.name.startsWith("ВЫСШИЙ")) || typ.name.startsWith("КОНСТИТУЦИОН") || typ.name.startsWith("ВЕРХОВНИЙ")) || typ.name.startsWith("АРБІТРАЖНИЙ") || typ.name.startsWith("ВИЩИЙ")) || typ.name.startsWith("КОНСТИТУЦІЙН")) {
                        typ.coef = 3;
                        break;
                    }
                }
                num = _num;
                t1 = (t = num.end_token);
                continue;
            }
            if ((((_epon = OrgItemEponymToken.try_attach(t, false)))) !== null) {
                epon = _epon;
                t1 = (t = epon.end_token);
                continue;
            }
            if ((((typ = OrgItemTypeToken.try_attach(t, false, ad)))) !== null) {
                if (typ.morph._case.is_genitive) {
                    if (typ.end_token.is_value("СЛУЖБА", null) || typ.end_token.is_value("УПРАВЛЕНИЕ", "УПРАВЛІННЯ") || typ.end_token.is_value("ХОЗЯЙСТВО", null)) 
                        typ = null;
                }
                if (typ !== null) {
                    if (!typ.is_doubt_root_word && attach_typ !== OrganizationAnalyzerAttachType.EXTONTOLOGY) 
                        break;
                    if (types === null && t0 === t) 
                        break;
                    if (OrganizationAnalyzer._last_typ(types) !== null && attach_typ !== OrganizationAnalyzerAttachType.EXTONTOLOGY) {
                        if (OrgItemTypeToken.is_types_antagonistictt(typ, OrganizationAnalyzer._last_typ(types))) {
                            if (names !== null && ((typ.morph._case.is_genitive || typ.morph._case.is_instrumental)) && (t.whitespaces_before_count < 2)) {
                            }
                            else 
                                break;
                        }
                    }
                }
            }
            if ((((br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100)))) !== null) {
                if (own_org !== null && !(own_org.referent).is_from_global_ontos) 
                    break;
                if (t.is_newline_before && ((attach_typ === OrganizationAnalyzerAttachType.NORMAL || attach_typ === OrganizationAnalyzerAttachType.NORMALAFTERDEP))) 
                    break;
                typ = OrganizationAnalyzer._last_typ(types);
                if ((_org.find_slot(OrganizationReferent.ATTR_TYPE, "организация", true) !== null || _org.find_slot(OrganizationReferent.ATTR_TYPE, "движение", true) !== null || _org.find_slot(OrganizationReferent.ATTR_TYPE, "організація", true) !== null) || _org.find_slot(OrganizationReferent.ATTR_TYPE, "рух", true) !== null) {
                    if (((typ === null || (typ.coef < 2))) && !spec_word_before) 
                        return null;
                }
                if (br.is_quote_type) {
                    if (br.open_char === '<' || br.whitespaces_before_count > 1) 
                        break;
                    rt = this.try_attach_org(t, null, OrganizationAnalyzerAttachType.HIGH, null, false, level + 1, -1);
                    if (rt === null) 
                        break;
                    let org0 = Utils.as(rt.referent, OrganizationReferent);
                    if (names !== null && names.length === 1) {
                        if (((!names[0].is_noun_phrase && names[0].chars.is_all_upper)) || org0.names.length > 0) {
                            if (!names[0].begin_token.morph.class0.is_preposition) {
                                if (org0.names.length === 0) 
                                    _org.add_type_str(names[0].value);
                                else {
                                    for (const n of org0.names) {
                                        _org.add_name((names[0].value + " " + n), true, null);
                                        if (typ !== null && typ.root !== null && typ.root.typ !== OrgItemTerminTypes.PREFIX) 
                                            _org.add_name((typ.typ.toUpperCase() + " " + MiscHelper.get_text_value_of_meta_token(names[0], GetTextAttr.NO) + " " + n), true, null);
                                    }
                                    if (typ !== null) 
                                        typ.coef = 4;
                                }
                                names = null;
                            }
                        }
                    }
                    if (names !== null && names.length > 0 && !spec_word_before) 
                        break;
                    if (!_org.can_be_equals(org0, ReferentEqualType.FORMERGING)) 
                        break;
                    _org.merge_slots(org0, true);
                    t1 = (tmax = (t = rt.end_token));
                    ok = true;
                    continue;
                }
                else if (br.open_char === '(') {
                    if (t.next.get_referent() !== null && t.next.next === br.end_token) {
                        let r = t.next.get_referent();
                        if (r.type_name === OrganizationAnalyzer.geoname) {
                            _org.add_geo_object(r);
                            tmax = (t1 = (t = br.end_token));
                            continue;
                        }
                    }
                    else if (((t.next instanceof TextToken) && t.next.chars.is_letter && !t.next.chars.is_all_lower) && t.next.next === br.end_token) {
                        typ = OrgItemTypeToken.try_attach(t.next, true, null);
                        if (typ !== null) {
                            let or0 = new OrganizationReferent();
                            or0.add_type(typ, false);
                            if (or0.kind !== OrganizationKind.UNDEFINED && _org.kind !== OrganizationKind.UNDEFINED) {
                                if (_org.kind !== or0.kind) 
                                    break;
                            }
                            if (MiscHelper.test_acronym(t.next, t0, t.previous)) 
                                _org.add_name(t.next.get_source_text(), true, null);
                            else 
                                _org.add_type(typ, false);
                            t1 = (t = (tmax = br.end_token));
                            continue;
                        }
                        else {
                            let nam = OrgItemNameToken.try_attach(t.next, null, attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY, true);
                            if (nam !== null && nam.is_empty_word) 
                                break;
                            if (attach_typ === OrganizationAnalyzerAttachType.NORMAL) {
                                let org0 = new OrganizationReferent();
                                org0.add_name((t.next).term, true, t.next);
                                if (!OrganizationReferent.can_be_second_definition(_org, org0)) 
                                    break;
                            }
                            _org.add_name((t.next).term, true, t.next);
                            tmax = (t1 = (t = br.end_token));
                            continue;
                        }
                    }
                }
                break;
            }
            if (own_org !== null) {
                if (names === null && t.is_value("ПО", null)) {
                }
                else if (names !== null && t.is_comma_and) {
                }
                else 
                    break;
            }
            typ = OrganizationAnalyzer._last_typ(types);
            if (typ !== null && typ.root !== null && typ.root.is_pure_prefix) {
                if (pr === null && names === null) {
                    pr = new OrgItemNameToken(t, t);
                    pr.morph._case = MorphCase.NOMINATIVE;
                }
            }
            let na = OrgItemNameToken.try_attach(t, pr, attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY, names === null);
            if (na === null && t !== null) {
                if (_org.kind === OrganizationKind.CHURCH || ((typ !== null && typ.typ !== null && typ.typ.includes("фермер")))) {
                    let prt = t.kit.process_referent("PERSON", t);
                    if (prt !== null) {
                        na = OrgItemNameToken._new2347(t, prt.end_token, true);
                        na.value = MiscHelper.get_text_value_of_meta_token(na, GetTextAttr.NO);
                        na.chars = CharsInfo._new2348(true);
                        na.morph = prt.morph;
                        let sur = prt.referent.get_string_value("LASTNAME");
                        if (sur !== null) {
                            for (let tt = t; tt !== null && tt.end_char <= prt.end_char; tt = tt.next) {
                                if (tt.is_value(sur, null)) {
                                    na.value = MiscHelper.get_text_value(tt, tt, GetTextAttr.NO);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            if (na === null) {
                if (attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY) {
                    if (t.is_char(',') || t.is_and) 
                        continue;
                }
                if (t.get_referent() instanceof OrganizationReferent) {
                    own_org = Utils.as(t, ReferentToken);
                    continue;
                }
                if (t.is_value("ПРИ", null) && (t.next instanceof ReferentToken) && (t.next.get_referent() instanceof OrganizationReferent)) {
                    t = t.next;
                    own_org = Utils.as(t, ReferentToken);
                    continue;
                }
                if ((((names === null && t.is_char('/') && (t.next instanceof TextToken)) && !t.is_whitespace_after && t.next.chars.is_all_upper) && t.next.length_char >= 3 && (t.next.next instanceof TextToken)) && !t.next.is_whitespace_after && t.next.next.is_char('/')) 
                    na = OrgItemNameToken._new2349(t, t.next.next, t.next.get_source_text().toUpperCase(), t.next.chars);
                else if (names === null && typ !== null && ((typ.typ === "движение" || _org.kind === OrganizationKind.PARTY))) {
                    let tt1 = null;
                    if (t.is_value("ЗА", null) || t.is_value("ПРОТИВ", null)) 
                        tt1 = t.next;
                    else if (t.is_value("В", null) && t.next !== null) {
                        if (t.next.is_value("ЗАЩИТА", null) || t.next.is_value("ПОДДЕРЖКА", null)) 
                            tt1 = t.next;
                    }
                    else if (typ.chars.is_capital_upper && !MiscHelper.can_be_start_of_sentence(typ.begin_token)) {
                        let mc = t.get_morph_class_in_dictionary();
                        if ((mc.is_adverb || mc.is_pronoun || mc.is_personal_pronoun) || mc.is_verb || mc.is_conjunction) {
                        }
                        else if (t.chars.is_letter) 
                            tt1 = t;
                        else if (typ.begin_token !== typ.end_token) 
                            typ.coef = typ.coef + (3);
                    }
                    if (tt1 !== null) {
                        na = OrgItemNameToken.try_attach(tt1, pr, true, false);
                        if (na !== null) {
                            na.begin_token = t;
                            typ.coef = typ.coef + (3);
                        }
                    }
                }
                if (na === null) 
                    break;
            }
            if (num !== null || epon !== null) 
                break;
            if (attach_typ === OrganizationAnalyzerAttachType.MULTIPLE || attach_typ === OrganizationAnalyzerAttachType.NORMAL || attach_typ === OrganizationAnalyzerAttachType.NORMALAFTERDEP) {
                if (!na.is_std_tail && !na.chars.is_latin_letter && na.std_org_name_nouns === 0) {
                    if (t.morph.class0.is_proper_name) 
                        break;
                    let cla = t.get_morph_class_in_dictionary();
                    if (cla.is_proper_surname || ((t.morph.language.is_ua && t.morph.class0.is_proper_surname))) {
                        if (names === null && ((_org.kind === OrganizationKind.AIRPORT || _org.kind === OrganizationKind.SEAPORT))) {
                        }
                        else if (typ !== null && typ.root !== null && typ.root.acronym === "ФОП") {
                        }
                        else if (typ !== null && typ.typ.includes("фермер")) {
                        }
                        else 
                            break;
                    }
                    if (cla.is_undefined && na.chars.is_cyrillic_letter && na.chars.is_capital_upper) {
                        if ((t.previous !== null && !t.previous.morph.class0.is_preposition && !t.previous.morph.class0.is_conjunction) && t.previous.chars.is_all_lower) {
                            if ((t.next !== null && (t.next instanceof TextToken) && t.next.chars.is_letter) && !t.next.chars.is_all_lower) 
                                break;
                        }
                    }
                    if (typ !== null && typ.typ === "союз" && !t.morph._case.is_genitive) 
                        break;
                    let pit = t.kit.process_referent("PERSONPROPERTY", t);
                    if (pit !== null) {
                        if (pit.morph.number === MorphNumber.SINGULAR && pit.begin_token !== pit.end_token) 
                            break;
                    }
                    pit = t.kit.process_referent("DECREE", t);
                    if (pit !== null) {
                        let nptt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
                        if (nptt !== null && nptt.end_token.is_value("РЕШЕНИЕ", null)) {
                        }
                        else 
                            break;
                    }
                    if (t.newlines_before_count > 1) 
                        break;
                }
            }
            if (t.is_value("ИМЕНИ", "ІМЕНІ") || t.is_value("ИМ", "ІМ")) 
                break;
            pr = na;
            if (attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY) {
                if (names === null) 
                    names = new Array();
                names.push(na);
                t1 = (t = na.end_token);
                continue;
            }
            if (names === null) {
                if (tmax !== null) 
                    break;
                if (t.previous !== null && t.is_newline_before && attach_typ !== OrganizationAnalyzerAttachType.EXTONTOLOGY) {
                    if (typ !== null && typ.end_token.next === t && typ.is_newline_before) {
                    }
                    else {
                        if (t.newlines_after_count > 1 || !t.chars.is_all_lower) 
                            break;
                        if (t.morph.class0.is_preposition && typ !== null && (((typ.typ === "комитет" || typ.typ === "комиссия" || typ.typ === "комітет") || typ.typ === "комісія"))) {
                        }
                        else if (na.std_org_name_nouns > 0) {
                        }
                        else 
                            break;
                    }
                }
                else if (t.previous !== null && t.whitespaces_before_count > 1 && attach_typ !== OrganizationAnalyzerAttachType.EXTONTOLOGY) {
                    if (t.whitespaces_before_count > 10) 
                        break;
                    if (CharsInfo.ooNoteq(t.chars, t.previous.chars)) 
                        break;
                }
                if (t.chars.is_all_lower && _org.kind === OrganizationKind.JUSTICE) {
                    if (t.is_value("ПО", null) && t.next !== null && t.next.is_value("ПРАВО", null)) {
                    }
                    else if (t.is_value("З", null) && t.next !== null && t.next.is_value("ПРАВ", null)) {
                    }
                    else 
                        break;
                }
                if (_org.kind === OrganizationKind.FEDERATION) {
                    if (t.morph.class0.is_preposition || t.morph.class0.is_conjunction) 
                        break;
                }
                if (t.chars.is_all_lower && ((_org.kind === OrganizationKind.AIRPORT || _org.kind === OrganizationKind.SEAPORT || _org.kind === OrganizationKind.HOTEL))) 
                    break;
                if ((typ !== null && typ.length_char === 2 && ((typ.typ === "АО" || typ.typ === "СП"))) && !spec_word_before && attach_typ === OrganizationAnalyzerAttachType.NORMAL) {
                    if (!na.chars.is_latin_letter) 
                        break;
                }
                if (t.chars.is_latin_letter && typ !== null && LanguageHelper.ends_with_ex(typ.typ, "служба", "сервис", "сервіс", null)) 
                    break;
                if (typ !== null && ((typ.root === null || !typ.root.is_pure_prefix))) {
                    if (typ.chars.is_latin_letter && na.chars.is_latin_letter) {
                        if (!t.is_value("OF", null)) 
                            break;
                    }
                    if ((na.is_in_dictionary && na.morph.language.is_cyrillic && na.chars.is_all_lower) && !na.morph._case.is_undefined) {
                        if (na.preposition === null) {
                            if (!na.morph._case.is_genitive) 
                                break;
                            if (_org.kind === OrganizationKind.PARTY && !spec_word_before) {
                                if (typ.typ === "лига") {
                                }
                                else 
                                    break;
                            }
                            if (na.morph.number !== MorphNumber.PLURAL) {
                                let prr = t.kit.process_referent("PERSONPROPERTY", t);
                                if (prr !== null) {
                                    if (OrgItemEponymToken.try_attach(na.end_token.next, false) !== null) {
                                    }
                                    else 
                                        break;
                                }
                            }
                        }
                    }
                    if (na.preposition !== null) {
                        if (_org.kind === OrganizationKind.PARTY) {
                            if (na.preposition === "ЗА" || na.preposition === "ПРОТИВ") {
                            }
                            else if (na.preposition === "В") {
                                if (na.value.startsWith("ЗАЩИТ") && na.value.startsWith("ПОДДЕРЖ")) {
                                }
                                else 
                                    break;
                            }
                            else 
                                break;
                        }
                        else {
                            if (na.preposition === "В") 
                                break;
                            if (typ.is_doubt_root_word) {
                                if (LanguageHelper.ends_with_ex(typ.typ, "комитет", "комиссия", "комітет", "комісія") && ((t.is_value("ПО", null) || t.is_value("З", null)))) {
                                }
                                else if (names === null && na.std_org_name_nouns > 0) {
                                }
                                else 
                                    break;
                            }
                        }
                    }
                    else if (na.chars.is_capital_upper && na.chars.is_cyrillic_letter) {
                        let prt = na.kit.process_referent("PERSON", na.begin_token);
                        if (prt !== null) {
                            if (_org.kind === OrganizationKind.CHURCH) {
                                na.end_token = prt.end_token;
                                na.is_std_name = true;
                                na.value = MiscHelper.get_text_value_of_meta_token(na, GetTextAttr.NO);
                            }
                            else if ((typ !== null && typ.typ !== null && typ.typ.includes("фермер")) && names === null) 
                                na.end_token = prt.end_token;
                            else 
                                break;
                        }
                    }
                }
                if (na.is_empty_word) 
                    break;
                if (na.is_std_tail) {
                    if (na.chars.is_latin_letter && na.chars.is_all_upper && (na.length_char < 4)) {
                        na.is_std_tail = false;
                        na.value = na.get_source_text().toUpperCase();
                    }
                    else 
                        break;
                }
                names = new Array();
            }
            else {
                let na0 = names[names.length - 1];
                if (na0.is_std_tail) 
                    break;
                if (na.preposition === null) {
                    if ((!na.chars.is_latin_letter && na.chars.is_all_lower && !na.is_after_conjunction) && !na.morph._case.is_genitive) 
                        break;
                }
            }
            names.push(na);
            t1 = (t = na.end_token);
        }
        typ = OrganizationAnalyzer._last_typ(types);
        let do_higher_always = false;
        if (typ !== null) {
            if (((attach_typ === OrganizationAnalyzerAttachType.NORMAL || attach_typ === OrganizationAnalyzerAttachType.NORMALAFTERDEP)) && typ.morph.number === MorphNumber.PLURAL) 
                return null;
            if (LanguageHelper.ends_with_ex(typ.typ, "комитет", "комиссия", "комітет", "комісія")) {
            }
            else if (typ.typ === "служба" && own_org !== null && typ.name !== null) {
                let ki = (own_org.referent).kind;
                if (ki === OrganizationKind.PRESS || ki === OrganizationKind.MEDIA) {
                    typ.coef = typ.coef + (3);
                    do_higher_always = true;
                }
                else 
                    own_org = null;
            }
            else if ((typ.typ === "служба" && own_org !== null && num === null) && OrganizationAnalyzer._is_mvd_org(Utils.as(own_org.referent, OrganizationReferent)) !== null && (((((typ.begin_token.previous instanceof NumberToken) && (typ.whitespaces_before_count < 3))) || names !== null))) {
                typ.coef = typ.coef + (4);
                if (typ.begin_token.previous instanceof NumberToken) {
                    t0 = typ.begin_token.previous;
                    num = OrgItemNumberToken._new1818(t0, t0, (typ.begin_token.previous).value);
                }
            }
            else if ((((typ.is_doubt_root_word || typ.typ === "организация" || typ.typ === "управление") || typ.typ === "служба" || typ.typ === "общество") || typ.typ === "союз" || typ.typ === "організація") || typ.typ === "керування" || typ.typ === "суспільство") 
                own_org = null;
            if (_org.kind === OrganizationKind.GOVENMENT) {
                if (names === null && ((typ.name === null || Utils.compareStrings(typ.name, typ.typ, true) === 0))) {
                    if ((attach_typ !== OrganizationAnalyzerAttachType.EXTONTOLOGY && typ.typ !== "следственный комитет" && typ.typ !== "кабинет министров") && typ.typ !== "слідчий комітет") {
                        if (((typ.typ === "администрация" || typ.typ === "адміністрація")) && (typ.end_token.next instanceof TextToken)) {
                            let rt1 = typ.kit.process_referent("PERSONPROPERTY", typ.end_token.next);
                            if (rt1 !== null && typ.end_token.next.morph._case.is_genitive) {
                                let _geo = Utils.as(rt1.referent.get_slot_value("REF"), GeoReferent);
                                if (_geo !== null) {
                                    _org.add_name("АДМИНИСТРАЦИЯ " + (typ.end_token.next).term, true, null);
                                    _org.add_geo_object(_geo);
                                    return new ReferentToken(_org, typ.begin_token, rt1.end_token);
                                }
                            }
                        }
                        if ((typ.coef < 5) || typ.chars.is_all_lower) 
                            return null;
                    }
                }
            }
        }
        else if (names !== null && names[0].chars.is_all_lower) {
            if (attach_typ !== OrganizationAnalyzerAttachType.EXTONTOLOGY) 
                return null;
        }
        let always = false;
        let _name = null;
        if (((num !== null || _org.number !== null || epon !== null) || attach_typ === OrganizationAnalyzerAttachType.HIGH || attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY) || own_org !== null) {
            if (names !== null) {
                if ((names.length === 1 && names[0].chars.is_all_upper && attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY) && is_additional_attach) 
                    _org.add_name(MiscHelper.get_text_value(names[0].begin_token, names[names.length - 1].end_token, GetTextAttr.NO), true, names[0].begin_token);
                else {
                    _name = MiscHelper.get_text_value(names[0].begin_token, names[names.length - 1].end_token, GetTextAttr.NO);
                    if ((names[0].is_noun_phrase && typ !== null && typ.root !== null) && !typ.root.is_pure_prefix && mult_typ === null) 
                        _name = (((typ.name != null ? typ.name : (typ !== null && typ.typ !== null ? typ.typ.toUpperCase() : null))) + " " + _name);
                }
            }
            else if (typ !== null && typ.name !== null && ((typ.root === null || !typ.root.is_pure_prefix))) {
                if (typ.chars.is_all_lower && !typ.can_be_organization && (typ.name_words_count < 3)) 
                    _org.add_type_str(typ.name.toLowerCase());
                else 
                    _name = typ.name;
                if (typ !== mult_typ) {
                    if (t1.end_char < typ.end_token.end_char) 
                        t1 = typ.end_token;
                }
            }
            if (_name !== null) {
                if (_name.length > OrganizationAnalyzer.max_org_name) 
                    return null;
                _org.add_name(_name, true, null);
            }
            if (num !== null) 
                _org.number = num.number;
            if (epon !== null) {
                for (const e of epon.eponyms) {
                    _org.add_eponym(e);
                }
            }
            ok = attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY;
            if (typ !== null && typ.root !== null && typ.root.can_be_normal_dep) 
                ok = true;
            for (const a of _org.slots) {
                if (a.type_name === OrganizationReferent.ATTR_NUMBER) {
                    if (typ !== null && typ.typ === "корпус") {
                    }
                    else 
                        ok = true;
                }
                else if (a.type_name !== OrganizationReferent.ATTR_TYPE && a.type_name !== OrganizationReferent.ATTR_PROFILE) {
                    ok = true;
                    break;
                }
            }
            if (attach_typ === OrganizationAnalyzerAttachType.NORMAL) {
                if (typ === null) 
                    ok = false;
                else if ((typ.end_char - typ.begin_char) < 2) {
                    if (num === null && epon === null) 
                        ok = false;
                    else if (epon === null) {
                        if (t1.is_whitespace_after || t1.next === null) {
                        }
                        else if (t1.next.is_char_of(".,;") && t1.next.is_whitespace_after) {
                        }
                        else 
                            ok = false;
                    }
                }
            }
            if ((!ok && typ !== null && typ.can_be_dep_before_organization) && own_org !== null) {
                _org.add_type_str((own_org.kit.base_language.is_ua ? "підрозділ" : "подразделение"));
                _org.higher = Utils.as(own_org.referent, OrganizationReferent);
                t1 = own_org;
                ok = true;
            }
            else if (typ !== null && own_org !== null && OrgOwnershipHelper.can_be_higher((Utils.as(own_org.referent, OrganizationReferent)), _org, true)) {
                if (OrgItemTypeToken.is_types_antagonisticoo(Utils.as(own_org.referent, OrganizationReferent), _org)) {
                    if (_org.kind === OrganizationKind.DEPARTMENT && !typ.can_be_dep_before_organization) {
                    }
                    else {
                        _org.higher = Utils.as(own_org.referent, OrganizationReferent);
                        if (t1.end_char < own_org.end_char) 
                            t1 = own_org;
                        ok = true;
                    }
                }
                else if (typ.root !== null && typ.root.can_be_normal_dep) {
                    _org.higher = Utils.as(own_org.referent, OrganizationReferent);
                    if (t1.end_char < own_org.end_char) 
                        t1 = own_org;
                    ok = true;
                }
            }
        }
        else if (names !== null) {
            if (typ === null) {
                if (names[0].is_std_name && spec_word_before) {
                    _org.add_name(names[0].value, true, null);
                    t1 = names[0].end_token;
                    t = this.attach_tail_attributes(_org, t1.next, null, true, attach_typ, false);
                    if (t !== null) 
                        t1 = t;
                    return new ReferentToken(_org, t0, t1);
                }
                return null;
            }
            if (typ.root !== null && typ.root.must_has_capital_name) {
                if (names[0].chars.is_all_lower) 
                    return null;
            }
            if (names[0].chars.is_latin_letter) {
                if (typ.root !== null && !typ.root.can_has_latin_name) {
                    if (!typ.chars.is_latin_letter) 
                        return null;
                }
                if (names[0].chars.is_all_lower && !typ.chars.is_latin_letter) 
                    return null;
                let tmp = new StringBuilder();
                tmp.append(names[0].value);
                t1 = names[0].end_token;
                for (let j = 1; j < names.length; j++) {
                    if (!names[j].is_std_tail && ((names[j].is_newline_before || !names[j].chars.is_latin_letter))) {
                        tmax = names[j].begin_token.previous;
                        if (typ.geo === null && _org.find_slot(OrganizationReferent.ATTR_GEO, null, true) !== null) 
                            Utils.removeItem(_org.slots, _org.find_slot(OrganizationReferent.ATTR_GEO, null, true));
                        break;
                    }
                    else {
                        t1 = names[j].end_token;
                        if (names[j].is_std_tail) {
                            let ei = OrgItemEngItem.try_attach(names[j].begin_token, false);
                            if (ei !== null) {
                                _org.add_type_str(ei.full_value);
                                if (ei.short_value !== null) 
                                    _org.add_type_str(ei.short_value);
                            }
                            break;
                        }
                        if (names[j - 1].end_token.is_char('.') && !names[j - 1].value.endsWith(".")) 
                            tmp.append(".").append(names[j].value);
                        else 
                            tmp.append(" ").append(names[j].value);
                    }
                }
                if (tmp.length > OrganizationAnalyzer.max_org_name) 
                    return null;
                let nnn = tmp.toString();
                if (nnn.startsWith("OF ") || nnn.startsWith("IN ")) 
                    tmp.insert(0, ((typ.name != null ? typ.name : typ.typ)).toUpperCase() + " ");
                if (tmp.length < 3) {
                    if (tmp.length < 2) 
                        return null;
                    if (types !== null && names[0].chars.is_all_upper) {
                    }
                    else 
                        return null;
                }
                ok = true;
                _org.add_name(tmp.toString(), true, null);
            }
            else if (typ.root !== null && typ.root.is_pure_prefix) {
                let tt = Utils.as(typ.end_token, TextToken);
                if (tt === null) 
                    return null;
                if (tt.is_newline_after) {
                    if (names[0].is_newline_after && typ.is_newline_before) {
                    }
                    else 
                        return null;
                }
                if (typ.begin_token === typ.end_token && tt.chars.is_all_lower) 
                    return null;
                if (names[0].chars.is_all_lower) {
                    if (!names[0].morph._case.is_genitive) 
                        return null;
                }
                t1 = names[0].end_token;
                for (let j = 1; j < names.length; j++) {
                    if (names[j].is_newline_before || CharsInfo.ooNoteq(names[j].chars, names[0].chars)) 
                        break;
                    else 
                        t1 = names[j].end_token;
                }
                ok = true;
                _name = MiscHelper.get_text_value(names[0].begin_token, t1, GetTextAttr.NO);
                if (num === null && (t1 instanceof NumberToken) && (t1).typ === NumberSpellingType.DIGIT) {
                    let tt1 = t1.previous;
                    if (tt1 !== null && tt1.is_hiphen) 
                        tt1 = tt1.previous;
                    if (tt1 !== null && tt1.end_char > names[0].begin_char && (tt1 instanceof TextToken)) {
                        _name = MiscHelper.get_text_value(names[0].begin_token, tt1, GetTextAttr.NO);
                        _org.number = (t1).value.toString();
                    }
                }
                if (_name.length > OrganizationAnalyzer.max_org_name) 
                    return null;
                _org.add_name(_name, true, names[0].begin_token);
            }
            else {
                if (typ.is_dep) 
                    return null;
                if (typ.morph.number === MorphNumber.PLURAL && attach_typ !== OrganizationAnalyzerAttachType.MULTIPLE) 
                    return null;
                let tmp = new StringBuilder();
                let koef = typ.coef;
                if (koef >= 4) 
                    always = true;
                if (_org.find_slot(OrganizationReferent.ATTR_GEO, null, true) !== null) 
                    koef += (1);
                if (spec_word_before) 
                    koef += (1);
                if (names[0].chars.is_all_lower && typ.chars.is_all_lower && !spec_word_before) {
                    if (koef >= 3) {
                        if (t !== null && (t.get_referent() instanceof GeoReferent)) {
                        }
                        else 
                            koef -= (3);
                    }
                }
                if (typ.chars_root.is_capital_upper) 
                    koef += (0.5);
                if (types.length > 1) 
                    koef += (types.length - 1);
                if (typ.name !== null) {
                    for (let to = typ.begin_token; to !== typ.end_token && to !== null; to = to.next) {
                        if (OrgItemTypeToken.is_std_adjective(to, false)) 
                            koef += (2);
                        if (to.chars.is_capital_upper) 
                            koef += (0.5);
                    }
                }
                let ki = _org.kind;
                if (attach_typ === OrganizationAnalyzerAttachType.MULTIPLE && ((typ.name === null || typ.name.length === typ.typ.length))) {
                }
                else if ((((((ki === OrganizationKind.MEDIA || ki === OrganizationKind.PARTY || ki === OrganizationKind.PRESS) || ki === OrganizationKind.FACTORY || ki === OrganizationKind.AIRPORT) || ki === OrganizationKind.SEAPORT || ((typ.root !== null && typ.root.must_has_capital_name))) || ki === OrganizationKind.BANK || typ.typ.includes("предприятие")) || typ.typ.includes("организация") || typ.typ.includes("підприємство")) || typ.typ.includes("організація")) {
                    if (typ.name !== null) 
                        _org.add_type_str(typ.name.toLowerCase());
                }
                else 
                    tmp.append((typ.name != null ? typ.name : (typ !== null && typ.typ !== null ? typ.typ.toUpperCase() : null)));
                if (typ !== mult_typ) 
                    t1 = typ.end_token;
                for (let j = 0; j < names.length; j++) {
                    if (((names[j].is_newline_before && j > 0)) || names[j].is_noun_phrase !== names[0].is_noun_phrase) 
                        break;
                    else if (CharsInfo.ooNoteq(names[j].chars, names[0].chars) && CharsInfo.ooNoteq(names[j].begin_token.chars, names[0].chars)) 
                        break;
                    else {
                        if (j === 0 && names[j].preposition === null && names[j].is_in_dictionary) {
                            if (!names[j].morph._case.is_genitive && ((typ.root !== null && !typ.root.can_has_single_name))) 
                                break;
                        }
                        if (j === 0 && names[0].preposition === "ПО" && (((typ.typ === "комитет" || typ.typ === "комиссия" || typ.typ === "комітет") || typ.typ === "комісія"))) 
                            koef += 2.5;
                        if ((j === 0 && names[j].whitespaces_before_count > 2 && names[j].newlines_before_count === 0) && names[j].begin_token.previous !== null) 
                            koef -= (((names[j].whitespaces_before_count)) / (2));
                        if (names[j].is_std_name) 
                            koef += (4);
                        else if (names[j].std_org_name_nouns > 0 && ((ki === OrganizationKind.GOVENMENT || LanguageHelper.ends_with(typ.typ, "центр")))) 
                            koef += (names[j].std_org_name_nouns);
                        if (((ki === OrganizationKind.AIRPORT || ki === OrganizationKind.SEAPORT)) && j === 0) 
                            koef++;
                        t1 = names[j].end_token;
                        if (names[j].is_noun_phrase) {
                            if (!names[j].chars.is_all_lower) {
                                let ca = names[j].morph._case;
                                if ((ca.is_dative || ca.is_genitive || ca.is_instrumental) || ca.is_prepositional) 
                                    koef += (0.5);
                                else 
                                    continue;
                            }
                            else if (((j === 0 || names[j].is_after_conjunction)) && names[j].morph._case.is_genitive && names[j].preposition === null) 
                                koef += (0.5);
                            if (j === (names.length - 1)) {
                                if (names[j].end_token.next instanceof TextToken) {
                                    if (names[j].end_token.next.get_morph_class_in_dictionary().is_verb) 
                                        koef += 0.5;
                                }
                            }
                        }
                        for (let to = names[j].begin_token; to !== null; to = to.next) {
                            if (to instanceof TextToken) {
                                if (attach_typ === OrganizationAnalyzerAttachType.NORMAL || attach_typ === OrganizationAnalyzerAttachType.NORMALAFTERDEP) {
                                    if (to.chars.is_capital_upper) 
                                        koef += (0.5);
                                    else if ((j === 0 && ((to.chars.is_all_upper || to.chars.is_last_lower)) && to.length_char > 2) && typ.root !== null && typ.root.can_has_latin_name) 
                                        koef += (1);
                                }
                                else if (to.chars.is_all_upper || to.chars.is_capital_upper) 
                                    koef += (1);
                            }
                            if (to === names[j].end_token) 
                                break;
                        }
                    }
                }
                for (let ttt = typ.begin_token.previous; ttt !== null; ttt = ttt.previous) {
                    if (ttt.get_referent() instanceof OrganizationReferent) {
                        koef += (1);
                        break;
                    }
                    else if (!((ttt instanceof TextToken))) 
                        break;
                    else if (ttt.chars.is_letter) 
                        break;
                }
                let oki = _org.kind;
                if (oki === OrganizationKind.GOVENMENT || oki === OrganizationKind.STUDY || oki === OrganizationKind.PARTY) 
                    koef += (names.length);
                if (attach_typ !== OrganizationAnalyzerAttachType.NORMAL && attach_typ !== OrganizationAnalyzerAttachType.NORMALAFTERDEP) 
                    koef += (3);
                let br1 = null;
                if ((t1.whitespaces_after_count < 2) && BracketHelper.can_be_start_of_sequence(t1.next, true, false)) {
                    br1 = BracketHelper.try_parse(t1.next, BracketParseAttr.NO, 100);
                    if (br1 !== null && (br1.length_char < 30)) {
                        let sss = MiscHelper.get_text_value_of_meta_token(br1, GetTextAttr.NO);
                        if (sss !== null && sss.length > 2) {
                            _org.add_name(sss, true, br1.begin_token.next);
                            koef += (1);
                            t1 = br1.end_token;
                        }
                        else 
                            br1 = null;
                    }
                }
                if (koef >= 3 && t1.next !== null) {
                    let r = t1.next.get_referent();
                    if (r !== null && ((r.type_name === OrganizationAnalyzer.geoname || r.type_name === OrganizationReferent.OBJ_TYPENAME))) 
                        koef += (1);
                    else if (this.is_geo(t1.next, false) !== null) 
                        koef += (1);
                    else if (t1.next.is_char('(') && this.is_geo(t1.next.next, false) !== null) 
                        koef += (1);
                    else if (spec_word_before && t1.kit.process_referent("PERSON", t1.next) !== null) 
                        koef += (1);
                }
                if (koef >= 4) 
                    ok = true;
                if (!ok) {
                    if ((oki === OrganizationKind.PRESS || oki === OrganizationKind.FEDERATION || _org.types.includes("агентство")) || ((oki === OrganizationKind.PARTY && OrgItemTypeToken.check_org_special_word_before(t0.previous)))) {
                        if (!names[0].is_newline_before && !names[0].morph.class0.is_proper) {
                            if (names[0].morph._case.is_genitive && names[0].is_in_dictionary) {
                                if (typ.chars.is_all_lower && !names[0].chars.is_all_lower) {
                                    ok = true;
                                    t1 = names[0].end_token;
                                }
                            }
                            else if (!names[0].is_in_dictionary && names[0].chars.is_all_upper) {
                                ok = true;
                                tmp.length = 0;
                                t1 = names[0].end_token;
                            }
                        }
                    }
                }
                if ((!ok && oki === OrganizationKind.FEDERATION && names[0].morph._case.is_genitive) && koef > 0) {
                    if (this.is_geo(names[names.length - 1].end_token.next, false) !== null) 
                        ok = true;
                }
                if (!ok && typ !== null && typ.root !== null) {
                    if (names.length === 1 && ((names[0].chars.is_all_upper || names[0].chars.is_last_lower))) {
                        if ((ki === OrganizationKind.BANK || ki === OrganizationKind.CULTURE || ki === OrganizationKind.HOTEL) || ki === OrganizationKind.MEDIA || ki === OrganizationKind.MEDICAL) 
                            ok = true;
                    }
                }
                if (ok) {
                    let tt1 = t1;
                    if (br1 !== null) 
                        tt1 = br1.begin_token.previous;
                    if ((tt1.get_referent() instanceof GeoReferent) && (tt1.get_referent()).is_state) {
                        if (names[0].begin_token !== tt1) {
                            tt1 = t1.previous;
                            _org.add_geo_object(t1.get_referent());
                        }
                    }
                    let s = MiscHelper.get_text_value(names[0].begin_token, tt1, GetTextAttr.NO);
                    if ((tt1 === names[0].end_token && typ !== null && typ.typ !== null) && typ.typ.includes("фермер") && names[0].value !== null) 
                        s = names[0].value;
                    let cla = tt1.get_morph_class_in_dictionary();
                    if ((names[0].begin_token === t1 && s !== null && t1.morph._case.is_genitive) && t1.chars.is_capital_upper) {
                        if (cla.is_undefined || cla.is_proper_geo) {
                            if (ki === OrganizationKind.MEDICAL || ki === OrganizationKind.JUSTICE) {
                                let _geo = new GeoReferent();
                                _geo.add_slot(GeoReferent.ATTR_NAME, t1.get_normal_case_text(null, false, MorphGender.UNDEFINED, false), false, 0);
                                _geo.add_slot(GeoReferent.ATTR_TYPE, (t1.kit.base_language.is_ua ? "місто" : "город"), false, 0);
                                let rt = new ReferentToken(_geo, t1, t1);
                                rt.data = ad;
                                _org.add_geo_object(rt);
                                s = null;
                            }
                        }
                    }
                    if (s !== null) {
                        if (tmp.length === 0) {
                            if (names[0].morph._case.is_genitive || names[0].preposition !== null) {
                                if (names[0].chars.is_all_lower) 
                                    tmp.append((typ.name != null ? typ.name : typ.typ));
                            }
                        }
                        if (tmp.length > 0) 
                            tmp.append(' ');
                        tmp.append(s);
                    }
                    if (tmp.length > OrganizationAnalyzer.max_org_name) 
                        return null;
                    _org.add_name(tmp.toString(), true, names[0].begin_token);
                    if (types.length > 1 && types[0].name !== null) 
                        _org.add_type_str(types[0].name.toLowerCase());
                }
            }
        }
        else {
            if (typ === null) 
                return null;
            if (types.length === 2 && types[0].coef > typ.coef) 
                typ = types[0];
            if ((typ.typ === "банк" && (t instanceof ReferentToken) && !t.is_newline_before) && typ.morph.number === MorphNumber.SINGULAR) {
                if (typ.name !== null) {
                    if (typ.begin_token.chars.is_all_lower) 
                        _org.add_type_str(typ.name.toLowerCase());
                    else {
                        _org.add_name(typ.name, true, null);
                        let s0 = MiscHelper.get_text_value_of_meta_token(typ, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
                        if (s0 !== typ.name) 
                            _org.add_name(s0, true, null);
                    }
                }
                let r = t.get_referent();
                if (r.type_name === OrganizationAnalyzer.geoname && MorphCase.ooNoteq(t.morph._case, MorphCase.NOMINATIVE)) {
                    _org.add_geo_object(r);
                    return new ReferentToken(_org, t0, t);
                }
            }
            if (((typ.root !== null && typ.root.is_pure_prefix)) && (typ.coef < 4)) 
                return null;
            if (typ.root !== null && typ.root.must_has_capital_name) 
                return null;
            if (typ.name === null) {
                if (((typ.typ.endsWith("университет") || typ.typ.endsWith("університет"))) && this.is_geo(typ.end_token.next, false) !== null) 
                    always = true;
                else if (((_org.kind === OrganizationKind.JUSTICE || _org.kind === OrganizationKind.AIRPORT || _org.kind === OrganizationKind.SEAPORT)) && _org.find_slot(OrganizationReferent.ATTR_GEO, null, true) !== null) {
                }
                else if (typ.coef >= 4) 
                    always = true;
                else if (typ.chars.is_capital_upper) {
                    if (typ.end_token.next !== null && ((typ.end_token.next.is_hiphen || typ.end_token.next.is_char_of(":")))) {
                    }
                    else {
                        let li = (ad === null ? null : ad.local_ontology.try_attach_by_item(_org.create_ontology_item()));
                        if (li !== null && li.length > 0) {
                            for (const ll of li) {
                                let r = (ll.referent != null ? ll.referent : ((Utils.as(ll.tag, Referent))));
                                if (r !== null) {
                                    if (_org.can_be_equals(r, ReferentEqualType.FORMERGING)) {
                                        let ttt = typ.end_token;
                                        let nu = OrgItemNumberToken.try_attach(ttt.next, true, null);
                                        if (nu !== null) {
                                            if ((r).number !== nu.number) 
                                                ttt = null;
                                            else {
                                                _org.number = nu.number;
                                                ttt = nu.end_token;
                                            }
                                        }
                                        else if (li.length > 1) 
                                            ttt = null;
                                        if (ttt !== null) 
                                            return new ReferentToken(r, typ.begin_token, ttt);
                                    }
                                }
                            }
                        }
                    }
                    return null;
                }
                else {
                    let cou = 0;
                    for (let tt = typ.begin_token.previous; tt !== null && (cou < 200); tt = tt.previous,cou++) {
                        let org0 = Utils.as(tt.get_referent(), OrganizationReferent);
                        if (org0 === null) 
                            continue;
                        if (!org0.can_be_equals(_org, ReferentEqualType.WITHINONETEXT)) 
                            continue;
                        tt = Utils.notNull(this.attach_tail_attributes(_org, typ.end_token.next, ad, false, attach_typ, false), (typ !== null ? typ.end_token : null));
                        if (!org0.can_be_equals(_org, ReferentEqualType.WITHINONETEXT)) 
                            break;
                        _org.merge_slots(org0, true);
                        return new ReferentToken(_org, typ.begin_token, tt);
                    }
                    if (typ.root !== null && typ.root.can_be_single_geo && t1.next !== null) {
                        let ggg = this.is_geo(t1.next, false);
                        if (ggg !== null) {
                            _org.add_geo_object(ggg);
                            t1 = this.get_geo_end_token(ggg, t1.next);
                            return new ReferentToken(_org, t0, t1);
                        }
                    }
                    return null;
                }
            }
            if (typ.morph.number === MorphNumber.PLURAL || typ === mult_typ) 
                return null;
            let koef = typ.coef;
            if (typ.name_words_count === 1 && typ.name !== null && typ.name.length > typ.typ.length) 
                koef++;
            if (spec_word_before) 
                koef += (1);
            ok = false;
            if (typ.chars_root.is_capital_upper) {
                koef += (0.5);
                if (typ.name_words_count === 1) 
                    koef += (0.5);
            }
            if (epon !== null) 
                koef += (2);
            let has_nonstd_words = false;
            for (let to = typ.begin_token; to !== typ.end_token && to !== null; to = to.next) {
                if (OrgItemTypeToken.is_std_adjective(to, false)) {
                    if (typ.root !== null && typ.root.coeff > 0) 
                        koef += ((OrgItemTypeToken.is_std_adjective(to, true) ? 1 : Math.floor(0.5)));
                }
                else 
                    has_nonstd_words = true;
                if (to.chars.is_capital_upper && !to.morph.class0.is_pronoun) 
                    koef += (0.5);
            }
            if (!has_nonstd_words && _org.kind === OrganizationKind.GOVENMENT) 
                koef -= (2);
            if (typ.chars.is_all_lower && (typ.coef < 4)) 
                koef -= (2);
            if (koef > 1 && typ.name_words_count > 2) 
                koef += (2);
            for (let ttt = typ.begin_token.previous; ttt !== null; ttt = ttt.previous) {
                if (ttt.get_referent() instanceof OrganizationReferent) {
                    koef += (1);
                    break;
                }
                else if (!((ttt instanceof TextToken))) 
                    break;
                else if (ttt.chars.is_letter) 
                    break;
            }
            for (let ttt = typ.end_token.next; ttt !== null; ttt = ttt.next) {
                if (ttt.get_referent() instanceof OrganizationReferent) {
                    koef += (1);
                    break;
                }
                else if (!((ttt instanceof TextToken))) 
                    break;
                else if (ttt.chars.is_letter) 
                    break;
            }
            if (typ.whitespaces_before_count > 4 && typ.whitespaces_after_count > 4) 
                koef += (0.5);
            if (typ.can_be_organization) {
                for (const s of _org.slots) {
                    if ((s.type_name === OrganizationReferent.ATTR_EPONYM || s.type_name === OrganizationReferent.ATTR_NAME || s.type_name === OrganizationReferent.ATTR_GEO) || s.type_name === OrganizationReferent.ATTR_NUMBER) {
                        koef += (3);
                        break;
                    }
                }
            }
            _org.add_type(typ, false);
            if (((_org.kind === OrganizationKind.BANK || _org.kind === OrganizationKind.JUSTICE)) && typ.name !== null && typ.name.length > typ.typ.length) 
                koef += (1);
            if (_org.kind === OrganizationKind.JUSTICE && _org.geo_objects.length > 0) 
                always = true;
            if (_org.kind === OrganizationKind.AIRPORT || _org.kind === OrganizationKind.SEAPORT) {
                for (const g of _org.geo_objects) {
                    if (g.is_city) 
                        always = true;
                }
            }
            if (koef > 3 || always) 
                ok = true;
            if (((_org.kind === OrganizationKind.PARTY || _org.kind === OrganizationKind.JUSTICE)) && typ.morph.number === MorphNumber.SINGULAR) {
                if (_org.find_slot(OrganizationReferent.ATTR_GEO, null, true) !== null && typ.name !== null && typ.name.length > typ.typ.length) 
                    ok = true;
                else if (typ.coef >= 4) 
                    ok = true;
                else if (typ.name_words_count > 2) 
                    ok = true;
            }
            if (ok) {
                if (typ.name !== null && !typ.is_not_typ) {
                    if (typ.name.length > OrganizationAnalyzer.max_org_name || Utils.compareStrings(typ.name, typ.typ, true) === 0) 
                        return null;
                    _org.add_name(typ.name, true, null);
                }
                t1 = typ.end_token;
            }
        }
        if (!ok || _org.slots.length === 0) 
            return null;
        if (attach_typ === OrganizationAnalyzerAttachType.NORMAL || attach_typ === OrganizationAnalyzerAttachType.NORMALAFTERDEP) {
            ok = always;
            for (const s of _org.slots) {
                if (s.type_name !== OrganizationReferent.ATTR_TYPE && s.type_name !== OrganizationReferent.ATTR_PROFILE) {
                    ok = true;
                    break;
                }
            }
            if (!ok) 
                return null;
        }
        if (tmax !== null && (t1.end_char < tmax.begin_char)) 
            t1 = tmax;
        t = this.attach_tail_attributes(_org, t1.next, null, true, attach_typ, false);
        if (t !== null) 
            t1 = t;
        if (own_org !== null && _org.higher === null) {
            if (do_higher_always || OrgOwnershipHelper.can_be_higher(Utils.as(own_org.referent, OrganizationReferent), _org, false)) {
                _org.higher = Utils.as(own_org.referent, OrganizationReferent);
                if (own_org.begin_char > t1.begin_char) {
                    t1 = own_org;
                    t = this.attach_tail_attributes(_org, t1.next, null, true, attach_typ, false);
                    if (t !== null) 
                        t1 = t;
                }
            }
        }
        if (t1.is_newline_after && t0.is_newline_before) {
            let typ1 = OrgItemTypeToken.try_attach(t1.next, false, null);
            if (typ1 !== null && typ1.is_newline_after) {
                if (this.try_attach_org(t1.next, ad, OrganizationAnalyzerAttachType.NORMAL, null, false, 0, -1) === null) {
                    _org.add_type(typ1, false);
                    t1 = typ1.end_token;
                }
            }
            if (t1.next !== null && t1.next.is_char('(') && (((typ1 = OrgItemTypeToken.try_attach(t1.next.next, false, null)))) !== null) {
                if (typ1.end_token.next !== null && typ1.end_token.next.is_char(')') && typ1.end_token.next.is_newline_after) {
                    _org.add_type(typ1, false);
                    t1 = typ1.end_token.next;
                }
            }
        }
        if (attach_typ === OrganizationAnalyzerAttachType.NORMAL && ((typ === null || (typ.coef < 4)))) {
            if (_org.find_slot(OrganizationReferent.ATTR_GEO, null, true) === null || ((typ !== null && typ.geo !== null))) {
                let is_all_low = true;
                for (t = t0; t !== t1.next; t = t.next) {
                    if (t.chars.is_letter) {
                        if (!t.chars.is_all_lower) 
                            is_all_low = false;
                    }
                    else if (!((t instanceof TextToken))) 
                        is_all_low = false;
                }
                if (is_all_low && !spec_word_before) 
                    return null;
            }
        }
        let res = new ReferentToken(_org, t0, t1);
        if (types !== null && types.length > 0) {
            res.morph = types[0].morph;
            if (types[0].is_not_typ && types[0].begin_token === t0 && (types[0].end_char < t1.end_char)) 
                res.begin_token = types[0].end_token.next;
        }
        else 
            res.morph = t0.morph;
        if ((_org.number === null && t1.next !== null && (t1.whitespaces_after_count < 2)) && typ !== null && ((typ.root === null || typ.root.can_has_number))) {
            let num1 = OrgItemNumberToken.try_attach(t1.next, false, typ);
            if (num1 === null && t1.next.is_hiphen) 
                num1 = OrgItemNumberToken.try_attach(t1.next.next, false, typ);
            if (num1 !== null) {
                if (OrgItemTypeToken.is_decree_keyword(t0.previous, 2)) {
                }
                else {
                    _org.number = num1.number;
                    t1 = num1.end_token;
                    res.end_token = t1;
                }
            }
        }
        return res;
    }
    
    try_attach_org_before(t, ad) {
        if (t === null || t.previous === null) 
            return null;
        let min_end_char = t.previous.end_char;
        let max_end_char = t.end_char;
        let t0 = t.previous;
        if ((t0 instanceof ReferentToken) && (t0.get_referent() instanceof OrganizationReferent) && t0.previous !== null) {
            min_end_char = t0.previous.end_char;
            t0 = t0.previous;
        }
        let res = null;
        for (; t0 !== null; t0 = t0.previous) {
            if (t0.whitespaces_after_count > 1) 
                break;
            let cou = 0;
            let tt0 = t0;
            let num = null;
            let num_et = null;
            for (let ttt = t0; ttt !== null; ttt = ttt.previous) {
                if (ttt.whitespaces_after_count > 1) 
                    break;
                if (ttt.is_hiphen || ttt.is_char('.')) 
                    continue;
                if (ttt instanceof NumberToken) {
                    if (num !== null) 
                        break;
                    num = (ttt).value.toString();
                    num_et = ttt;
                    tt0 = ttt.previous;
                    continue;
                }
                let nn = OrgItemNumberToken.try_attach(ttt, false, null);
                if (nn !== null) {
                    num = nn.number;
                    num_et = nn.end_token;
                    tt0 = ttt.previous;
                    continue;
                }
                if ((++cou) > 10) 
                    break;
                if (ttt.is_value("НАПРАВЛЕНИЕ", "НАПРЯМОК")) {
                    if (num !== null || (((ttt.previous instanceof NumberToken) && (ttt.whitespaces_before_count < 3)))) {
                        let oo = new OrganizationReferent();
                        oo.add_profile(OrgProfile.UNIT);
                        oo.add_type_str(((ttt.morph.language.is_ua ? "НАПРЯМОК" : "НАПРАВЛЕНИЕ")).toLowerCase());
                        let rt0 = new ReferentToken(oo, ttt, ttt);
                        if (num_et !== null && num !== null) {
                            oo.add_slot(OrganizationReferent.ATTR_NUMBER, num, false, 0);
                            rt0.end_token = num_et;
                            return rt0;
                        }
                        if (ttt.previous instanceof NumberToken) {
                            rt0.begin_token = ttt.previous;
                            oo.add_slot(OrganizationReferent.ATTR_NUMBER, (ttt.previous).value.toString(), false, 0);
                            return rt0;
                        }
                    }
                }
                let typ1 = OrgItemTypeToken.try_attach(ttt, true, null);
                if (typ1 === null) {
                    if (cou === 1) 
                        break;
                    continue;
                }
                if (typ1.end_token === tt0) 
                    t0 = ttt;
            }
            let rt = this.try_attach_org(t0, ad, OrganizationAnalyzerAttachType.NORMAL, null, false, 0, -1);
            if (rt !== null) {
                if (rt.end_char >= min_end_char && rt.end_char <= max_end_char) {
                    let oo = Utils.as(rt.referent, OrganizationReferent);
                    if (oo.higher !== null && oo.higher.higher !== null && oo.higher === rt.end_token.get_referent()) 
                        return rt;
                    if (rt.begin_char < t.begin_char) 
                        return rt;
                    res = rt;
                }
                else 
                    break;
            }
            else if (!((t0 instanceof TextToken))) 
                break;
            else if (!t0.chars.is_letter) {
                if (!BracketHelper.is_bracket(t0, false)) 
                    break;
            }
        }
        if (res !== null) 
            return null;
        let typ = null;
        for (t0 = t.previous; t0 !== null; t0 = t0.previous) {
            if (t0.whitespaces_after_count > 1) 
                break;
            if (t0 instanceof NumberToken) 
                continue;
            if (t0.is_char('.') || t0.is_hiphen) 
                continue;
            if (!((t0 instanceof TextToken))) 
                break;
            if (!t0.chars.is_letter) 
                break;
            let ty = OrgItemTypeToken.try_attach(t0, true, ad);
            if (ty !== null) {
                let nn = OrgItemNumberToken.try_attach(ty.end_token.next, true, ty);
                if (nn !== null) {
                    ty.end_token = nn.end_token;
                    ty.number = nn.number;
                }
                else if ((ty.end_token.next instanceof NumberToken) && (ty.whitespaces_after_count < 2)) {
                    ty.end_token = ty.end_token.next;
                    ty.number = (ty.end_token).value.toString();
                }
                if (ty.end_char >= min_end_char && ty.end_char <= max_end_char) 
                    typ = ty;
                else 
                    break;
            }
        }
        if (typ !== null && typ.is_dep) 
            res = this.try_attach_dep_before_org(typ, null);
        return res;
    }
    
    try_attach_dep_before_org(typ, rt_org) {
        if (typ === null) 
            return null;
        let _org = (rt_org === null ? null : Utils.as(rt_org.referent, OrganizationReferent));
        let t = typ.end_token;
        if (_org === null) {
            t = t.next;
            if (t !== null && ((t.is_value("ПРИ", null) || t.is_value("AT", null) || t.is_value("OF", null)))) 
                t = t.next;
            if (t === null) 
                return null;
            _org = Utils.as(t.get_referent(), OrganizationReferent);
        }
        else 
            t = rt_org.end_token;
        if (_org === null) 
            return null;
        let t1 = t;
        if (t1.next instanceof ReferentToken) {
            let geo0 = Utils.as(t1.next.get_referent(), GeoReferent);
            if (geo0 !== null && geo0.alpha2 === "RU") 
                t1 = t1.next;
        }
        let dep = new OrganizationReferent();
        dep.add_type(typ, false);
        if (typ.name !== null) {
            let nam = typ.name;
            if (Utils.isDigit(nam[0])) {
                let i = nam.indexOf(' ');
                if (i > 0) {
                    dep.number = nam.substring(0, 0 + i);
                    nam = nam.substring(i + 1).trim();
                }
            }
            dep.add_name(nam, true, null);
        }
        let ttt = (typ.root !== null ? typ.root.canonic_text : typ.typ.toUpperCase());
        if ((((ttt === "ОТДЕЛЕНИЕ" || ttt === "ИНСПЕКЦИЯ" || ttt === "ВІДДІЛЕННЯ") || ttt === "ІНСПЕКЦІЯ")) && !t1.is_newline_after) {
            let num = OrgItemNumberToken.try_attach(t1.next, false, null);
            if (num !== null) {
                dep.number = num.number;
                t1 = num.end_token;
            }
        }
        if (dep.types.includes("главное управление") || dep.types.includes("головне управління") || dep.type_name.includes("пограничное управление")) {
            if (typ.begin_token === typ.end_token) {
                if (_org.kind !== OrganizationKind.GOVENMENT && _org.kind !== OrganizationKind.BANK) 
                    return null;
            }
        }
        if (!OrgOwnershipHelper.can_be_higher(_org, dep, false) && ((typ.root === null || !typ.root.can_be_normal_dep))) {
            if (dep.types.length > 0 && _org.types.includes(dep.types[0]) && dep.can_be_equals(_org, ReferentEqualType.FORMERGING)) 
                dep.merge_slots(_org, false);
            else if (typ.typ === "управление" || typ.typ === "управління") 
                dep.higher = _org;
            else 
                return null;
        }
        else 
            dep.higher = _org;
        let res = new ReferentToken(dep, typ.begin_token, t1);
        this.correct_dep_attrs(res, typ, false);
        if (typ.root !== null && !typ.root.can_be_normal_dep && dep.number === null) {
            if (typ.name !== null && typ.name.includes(" ")) {
            }
            else if (dep.find_slot(OrganizationReferent.ATTR_GEO, null, true) !== null) {
            }
            else if (typ.root.coeff > 0 && typ.morph.number !== MorphNumber.PLURAL) {
            }
            else 
                return null;
        }
        return res;
    }
    
    try_attach_dep_after_org(typ) {
        if (typ === null) 
            return null;
        let t = typ.begin_token.previous;
        if (t !== null && t.is_char_of(":(")) 
            t = t.previous;
        if (t === null) 
            return null;
        let _org = Utils.as(t.get_referent(), OrganizationReferent);
        if (_org === null) 
            return null;
        let t1 = typ.end_token;
        let dep = new OrganizationReferent();
        dep.add_type(typ, false);
        if (typ.name !== null) 
            dep.add_name(typ.name, true, null);
        if (OrgOwnershipHelper.can_be_higher(_org, dep, false)) 
            dep.higher = _org;
        else if (OrgOwnershipHelper.can_be_higher(dep, _org, false) && _org.higher === null) {
            _org.higher = dep;
            t = t.next;
        }
        else 
            t = t.next;
        let res = new ReferentToken(dep, t, t1);
        this.correct_dep_attrs(res, typ, false);
        if (dep.find_slot(OrganizationReferent.ATTR_GEO, null, true) === null) 
            return null;
        return res;
    }
    
    try_attach_dep(typ, attach_typ, spec_word_before) {
        const OrgItemEponymToken = require("./internal/OrgItemEponymToken");
        const OrgItemNameToken = require("./internal/OrgItemNameToken");
        if (typ === null) 
            return null;
        let after_org = null;
        let after_org_temp = false;
        if ((typ.is_newline_after && typ.name === null && typ.typ !== "курс") && ((typ.root === null || !typ.root.can_be_normal_dep))) {
            let tt2 = typ.end_token.next;
            if (!spec_word_before || tt2 === null) 
                return null;
            if (BracketHelper.can_be_start_of_sequence(tt2, false, false)) {
            }
            else 
                return null;
        }
        if (typ.end_token.next !== null && (typ.end_token.whitespaces_after_count < 2)) {
            let na0 = OrgItemNameToken.try_attach(typ.end_token.next, null, false, true);
            let in_br = false;
            if (na0 !== null && ((na0.std_org_name_nouns > 0 || na0.is_std_name))) 
                spec_word_before = true;
            else {
                let rt00 = this.try_attach_org(typ.end_token.next, null, OrganizationAnalyzerAttachType.NORMALAFTERDEP, null, false, 0, -1);
                if (rt00 === null && BracketHelper.can_be_start_of_sequence(typ.end_token.next, true, false)) {
                    rt00 = this.try_attach_org(typ.end_token.next.next, null, OrganizationAnalyzerAttachType.NORMALAFTERDEP, null, false, 0, -1);
                    if (rt00 !== null) {
                        in_br = true;
                        if (rt00.end_token.next === null) {
                        }
                        else if (BracketHelper.can_be_end_of_sequence(rt00.end_token, true, null, false)) {
                        }
                        else if (BracketHelper.can_be_end_of_sequence(rt00.end_token.next, true, null, false)) 
                            rt00.end_token = rt00.end_token.next;
                        else 
                            rt00 = null;
                        if (rt00 !== null) 
                            rt00.begin_token = typ.end_token.next;
                    }
                }
                if (rt00 !== null) {
                    after_org = Utils.as(rt00.referent, OrganizationReferent);
                    spec_word_before = true;
                    after_org_temp = true;
                    if (after_org.contains_profile(OrgProfile.UNIT) && in_br) {
                        after_org = null;
                        after_org_temp = false;
                    }
                }
                else if ((typ.end_token.next instanceof TextToken) && typ.end_token.next.chars.is_all_upper) {
                    let rrr = this.try_attach_orgs(typ.end_token.next, null, 0);
                    if (rrr !== null && rrr.length === 1) {
                        after_org = Utils.as(rrr[0].referent, OrganizationReferent);
                        spec_word_before = true;
                        after_org_temp = true;
                    }
                }
            }
        }
        if (((((((typ.root !== null && typ.root.can_be_normal_dep && !spec_word_before) && typ.typ !== "отделение" && typ.typ !== "инспекция") && typ.typ !== "филиал" && typ.typ !== "аппарат") && typ.typ !== "відділення" && typ.typ !== "інспекція") && typ.typ !== "філія" && typ.typ !== "апарат") && typ.typ !== "совет" && typ.typ !== "рада") && (typ.typ.indexOf(' ') < 0) && attach_typ !== OrganizationAnalyzerAttachType.EXTONTOLOGY) 
            return null;
        if (typ.morph.number === MorphNumber.PLURAL) {
            if (!typ.begin_token.is_value("ОСП", null)) 
                return null;
        }
        let dep = null;
        let t0 = typ.begin_token;
        let t1 = typ.end_token;
        dep = new OrganizationReferent();
        dep.add_type_str(typ.typ.toLowerCase());
        dep.add_profile(OrgProfile.UNIT);
        if (typ.number !== null) 
            dep.number = typ.number;
        else if (typ.typ === "курс" && !typ.is_newline_before) {
            let nnn = NumberHelper.try_parse_roman_back(typ.begin_token.previous);
            if (nnn !== null && nnn.int_value !== null) {
                if (nnn.int_value >= 1 && nnn.int_value <= 6) {
                    dep.number = nnn.value.toString();
                    t0 = nnn.begin_token;
                }
            }
        }
        let t = typ.end_token.next;
        t1 = typ.end_token;
        if ((t instanceof TextToken) && after_org === null && (((LanguageHelper.ends_with(typ.typ, "аппарат") || LanguageHelper.ends_with(typ.typ, "апарат") || LanguageHelper.ends_with(typ.typ, "совет")) || LanguageHelper.ends_with(typ.typ, "рада")))) {
            let tt1 = t;
            if (tt1.is_value("ПРИ", null)) 
                tt1 = tt1.next;
            let pr1 = t.kit.process_referent("PERSON", tt1);
            if (pr1 !== null && pr1.referent.type_name === "PERSONPROPERTY") {
                dep.add_slot(OrganizationReferent.ATTR_OWNER, pr1.referent, true, 0);
                pr1.set_default_local_onto(t.kit.processor);
                dep.add_ext_referent(pr1);
                if (LanguageHelper.ends_with(typ.typ, "рат")) 
                    return new ReferentToken(dep, t0, pr1.end_token);
                t1 = pr1.end_token;
                t = t1.next;
            }
        }
        let before_org = null;
        for (let ttt = typ.begin_token.previous; ttt !== null; ttt = ttt.previous) {
            if (ttt.get_referent() instanceof OrganizationReferent) {
                before_org = ttt.get_referent();
                break;
            }
            else if (!((ttt instanceof TextToken))) 
                break;
            else if (ttt.chars.is_letter) 
                break;
        }
        let num = null;
        let names = null;
        let br = null;
        let br00 = null;
        let pr = null;
        let ty0 = null;
        let is_pure_org = false;
        let is_pure_dep = false;
        if (typ.typ === "операционное управление" || typ.typ === "операційне управління") 
            is_pure_dep = true;
        let after_org_tok = null;
        let br_name = null;
        let coef = typ.coef;
        for (; t !== null; t = t.next) {
            if (after_org_temp) 
                break;
            if (t.is_char(':')) {
                if (t.is_newline_after) 
                    break;
                if (names !== null || typ.name !== null) 
                    break;
                continue;
            }
            if ((((num = OrgItemNumberToken.try_attach(t, false, typ)))) !== null) {
                if (t.is_newline_before || typ.number !== null) 
                    break;
                if ((typ.begin_token.previous instanceof NumberToken) && (typ.whitespaces_before_count < 2)) {
                    let typ2 = OrgItemTypeToken.try_attach(num.end_token.next, true, null);
                    if (typ2 !== null && typ2.root !== null && ((typ2.root.can_has_number || typ2.is_dep))) {
                        typ.begin_token = typ.begin_token.previous;
                        typ.number = (typ.begin_token).value;
                        dep.number = typ.number;
                        num = null;
                        coef += (1);
                        break;
                    }
                }
                t1 = num.end_token;
                t = num.end_token.next;
                break;
            }
            else if ((((ty0 = OrgItemTypeToken.try_attach(t, true, null)))) !== null && ty0.morph.number !== MorphNumber.PLURAL && !ty0.is_doubt_root_word) 
                break;
            else if ((((br00 = BracketHelper.try_parse(t, BracketParseAttr.NO, 100)))) !== null && names === null) {
                br = br00;
                if (!br.is_quote_type || br_name !== null) 
                    br = null;
                else if (t.is_newline_before && !spec_word_before) 
                    br = null;
                else {
                    let ok1 = true;
                    for (let tt = br.begin_token; tt !== br.end_token; tt = tt.next) {
                        if (tt instanceof ReferentToken) {
                            ok1 = false;
                            break;
                        }
                    }
                    if (ok1) {
                        br_name = br;
                        t1 = br.end_token;
                        t = t1.next;
                    }
                    else 
                        br = null;
                }
                break;
            }
            else {
                let r = t.get_referent();
                if ((r === null && t.morph.class0.is_preposition && t.next !== null) && (t.next.get_referent() instanceof GeoReferent)) {
                    dep.add_geo_object(t.next.get_referent());
                    t = t.next;
                    break;
                }
                if (r !== null) {
                    if (r instanceof OrganizationReferent) {
                        after_org = Utils.as(r, OrganizationReferent);
                        after_org_tok = t;
                        break;
                    }
                    if ((r instanceof GeoReferent) && names !== null && t.previous !== null) {
                        let is_name = false;
                        if (t.previous.is_value("СУБЪЕКТ", null) || t.previous.is_value("СУБЄКТ", null)) 
                            is_name = true;
                        if (!is_name) 
                            break;
                    }
                    else 
                        break;
                }
                let epo = OrgItemEponymToken.try_attach(t, true);
                if (epo !== null) {
                    for (const e of epo.eponyms) {
                        dep.add_eponym(e);
                    }
                    t1 = epo.end_token;
                    break;
                }
                if (!typ.chars.is_all_upper && t.chars.is_all_upper) {
                    let na1 = OrgItemNameToken.try_attach(t, pr, attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY, false);
                    if (na1 !== null && ((na1.is_std_name || na1.std_org_name_nouns > 0))) {
                    }
                    else 
                        break;
                }
                if ((t instanceof NumberToken) && typ.root !== null && dep.number === null) {
                    if (t.whitespaces_before_count > 1) 
                        break;
                    if ((typ.begin_token.previous instanceof NumberToken) && (typ.whitespaces_before_count < 2)) {
                        let typ2 = OrgItemTypeToken.try_attach(t.next, true, null);
                        if (typ2 !== null && typ2.root !== null && ((typ2.root.can_has_number || typ2.is_dep))) {
                            typ.begin_token = typ.begin_token.previous;
                            dep.number = (typ.number = (typ.begin_token).value);
                            coef += (1);
                            break;
                        }
                    }
                    dep.number = (t).value.toString();
                    t1 = t;
                    continue;
                }
                if (is_pure_dep) 
                    break;
                if (!t.chars.is_all_lower) {
                    let rtp = t.kit.process_referent("PERSON", t);
                    if (rtp !== null && rtp.referent.type_name === "PERSONPROPERTY") {
                        if (rtp.morph._case.is_genitive && t === typ.end_token.next && (t.whitespaces_before_count < 4)) 
                            rtp = null;
                    }
                    if (rtp !== null) 
                        break;
                }
                if (typ.typ === "генеральный штаб" || typ.typ === "генеральний штаб") {
                    let rtp = t.kit.process_referent("PERSONPROPERTY", t);
                    if (rtp !== null) 
                        break;
                }
                let na = OrgItemNameToken.try_attach(t, pr, attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY, names === null);
                if (t.is_value("ПО", null) && t.next !== null && t.next.is_value("РАЙОН", null)) 
                    na = OrgItemNameToken.try_attach(t.next.next, pr, attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY, true);
                if (t.morph.class0.is_preposition && ((t.is_value("ПРИ", null) || t.is_value("OF", null) || t.is_value("AT", null)))) {
                    if ((t.next instanceof ReferentToken) && (t.next.get_referent() instanceof OrganizationReferent)) {
                        after_org = Utils.as(t.next.get_referent(), OrganizationReferent);
                        break;
                    }
                    let rt0 = this.try_attach_org(t.next, null, OrganizationAnalyzerAttachType.NORMALAFTERDEP, null, false, 0, -1);
                    if (rt0 !== null) {
                        after_org = Utils.as(rt0.referent, OrganizationReferent);
                        after_org_temp = true;
                        break;
                    }
                }
                if (na === null) 
                    break;
                if (names === null) {
                    if (t.is_newline_before) 
                        break;
                    if (NumberHelper.try_parse_roman(t) !== null) 
                        break;
                    let rt0 = this.try_attach_org(t, null, OrganizationAnalyzerAttachType.NORMALAFTERDEP, null, false, 0, -1);
                    if (rt0 !== null) {
                        after_org = Utils.as(rt0.referent, OrganizationReferent);
                        after_org_temp = true;
                        break;
                    }
                    names = new Array();
                }
                else {
                    if (t.whitespaces_before_count > 2 && CharsInfo.ooNoteq(na.chars, pr.chars)) 
                        break;
                    if (t.newlines_before_count > 2) 
                        break;
                }
                names.push(na);
                pr = na;
                t1 = (t = na.end_token);
            }
        }
        if (after_org === null) {
            for (let ttt = t; ttt !== null; ttt = ttt.next) {
                if (ttt.get_referent() instanceof OrganizationReferent) {
                    after_org = Utils.as(ttt.get_referent(), OrganizationReferent);
                    break;
                }
                else if (!((ttt instanceof TextToken))) 
                    break;
                else if ((ttt.chars.is_letter && !ttt.is_value("ПРИ", null) && !ttt.is_value("В", null)) && !ttt.is_value("OF", null) && !ttt.is_value("AT", null)) 
                    break;
            }
        }
        if ((after_org === null && t !== null && t !== t0) && (t.whitespaces_before_count < 2)) {
            let rt0 = this.try_attach_org(t, null, OrganizationAnalyzerAttachType.NORMALAFTERDEP, null, false, 0, -1);
            if (rt0 === null && (((t.is_value("В", null) || t.is_value("ПРИ", null) || t.is_value("OF", null)) || t.is_value("AT", null)))) 
                rt0 = this.try_attach_org(t.next, null, OrganizationAnalyzerAttachType.NORMALAFTERDEP, null, false, 0, -1);
            if (rt0 !== null) {
                after_org = Utils.as(rt0.referent, OrganizationReferent);
                after_org_temp = true;
            }
        }
        if (typ.chars.is_capital_upper) 
            coef += 0.5;
        if (br !== null && names === null) {
            let nam = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO);
            if (!Utils.isNullOrEmpty(nam)) {
                if (nam.length > 100) 
                    return null;
                coef += (3);
                let na = OrgItemNameToken.try_attach(br.begin_token.next, null, false, true);
                if (na !== null && na.is_std_name) {
                    coef += (1);
                    if (typ.typ === "группа") {
                        dep.slots.splice(0, dep.slots.length);
                        typ.typ = "группа компаний";
                        is_pure_org = true;
                    }
                    else if (typ.typ === "група") {
                        dep.slots.splice(0, dep.slots.length);
                        typ.typ = "група компаній";
                        is_pure_org = true;
                    }
                }
                if (is_pure_org) {
                    dep.add_type(typ, false);
                    dep.add_name(nam, true, null);
                }
                else 
                    dep.add_name_str(nam, typ, 1);
            }
        }
        else if (names !== null) {
            let j = 0;
            if (after_org !== null || attach_typ === OrganizationAnalyzerAttachType.HIGH) {
                coef += (3);
                j = names.length;
            }
            else 
                for (j = 0; j < names.length; j++) {
                    if (((names[j].is_newline_before && !typ.is_newline_before && !names[j].is_after_conjunction)) || ((CharsInfo.ooNoteq(names[j].chars, names[0].chars) && names[j].std_org_name_nouns === 0))) 
                        break;
                    else {
                        if (CharsInfo.ooEq(names[j].chars, typ.chars) && !typ.chars.is_all_lower) 
                            coef += (0.5);
                        if (names[j].is_std_name) 
                            coef += (2);
                        if (names[j].std_org_name_nouns > 0) {
                            if (!typ.chars.is_all_lower) 
                                coef += (names[j].std_org_name_nouns);
                        }
                    }
                }
            t1 = names[j - 1].end_token;
            let s = MiscHelper.get_text_value(names[0].begin_token, t1, GetTextAttr.NO);
            if (!Utils.isNullOrEmpty(s)) {
                if (s.length > 150 && attach_typ !== OrganizationAnalyzerAttachType.EXTONTOLOGY) 
                    return null;
                dep.add_name_str(s, typ, 1);
            }
            if (num !== null) {
                dep.number = num.number;
                coef += (2);
                t1 = num.end_token;
            }
        }
        else if (num !== null) {
            dep.number = num.number;
            coef += (2);
            t1 = num.end_token;
            if (typ !== null && ((typ.typ === "лаборатория" || typ.typ === "лабораторія"))) 
                coef += (1);
            if (typ.name !== null) 
                dep.add_name_str(null, typ, 1);
        }
        else if (typ.name !== null) {
            if (typ.typ === "курс" && Utils.isDigit(typ.name[0])) 
                dep.number = typ.name.substring(0, 0 + typ.name.indexOf(' '));
            else 
                dep.add_name_str(null, typ, 1);
        }
        else if (typ.typ === "кафедра" || typ.typ === "факультет") {
            t = typ.end_token.next;
            if (t !== null && t.is_char(':')) 
                t = t.next;
            if ((t !== null && (t instanceof TextToken) && !t.is_newline_before) && t.morph.class0.is_adjective) {
                if (typ.morph.gender === t.morph.gender) {
                    let s = t.get_normal_case_text(MorphClass.ADJECTIVE, false, MorphGender.UNDEFINED, false);
                    if (s !== null) {
                        dep.add_name_str((s + " " + typ.typ.toUpperCase()), null, 1);
                        coef += (2);
                        t1 = t;
                    }
                }
            }
        }
        else if (typ.typ === "курс") {
            t = typ.end_token.next;
            if (t !== null && t.is_char(':')) 
                t = t.next;
            if (t !== null && !t.is_newline_before) {
                let val = 0;
                if (t instanceof NumberToken) {
                    if (!t.morph.class0.is_noun && (t).int_value !== null) {
                        if (t.is_whitespace_after || t.next.is_char_of(";,")) 
                            val = (t).int_value;
                    }
                }
                else {
                    let nt = NumberHelper.try_parse_roman(t);
                    if (nt !== null && nt.int_value !== null) {
                        val = nt.int_value;
                        t = nt.end_token;
                    }
                }
                if (val > 0 && (val < 8)) {
                    dep.number = val.toString();
                    t1 = t;
                    coef += (4);
                }
            }
            if (dep.number === null) {
                t = typ.begin_token.previous;
                if (t !== null && !t.is_newline_after) {
                    let val = 0;
                    if (t instanceof NumberToken) {
                        if (!t.morph.class0.is_noun && (t).int_value !== null) {
                            if (t.is_whitespace_before || t.previous.is_char_of(",")) 
                                val = (t).int_value;
                        }
                    }
                    else {
                        let nt = NumberHelper.try_parse_roman_back(t);
                        if (nt !== null && nt.int_value !== null) {
                            val = nt.int_value;
                            t = nt.begin_token;
                        }
                    }
                    if (val > 0 && (val < 8)) {
                        dep.number = val.toString();
                        t0 = t;
                        coef += (4);
                    }
                }
            }
        }
        else if (typ.root !== null && typ.root.can_be_normal_dep && after_org !== null) {
            coef += (3);
            if (!after_org_temp) 
                dep.higher = Utils.as(after_org, OrganizationReferent);
            else 
                dep.m_temp_parent_org = Utils.as(after_org, OrganizationReferent);
            if (after_org_tok !== null) 
                t1 = after_org_tok;
        }
        else if (typ.typ === "генеральный штаб" || typ.typ === "генеральний штаб") 
            coef += (3);
        if (before_org !== null) 
            coef += (1);
        if (after_org !== null) {
            coef += (2);
            if (((typ.name !== null || ((typ.root !== null && typ.root.can_be_normal_dep)))) && OrgOwnershipHelper.can_be_higher(Utils.as(after_org, OrganizationReferent), dep, false)) {
                coef += (1);
                if (!typ.chars.is_all_lower) 
                    coef += 0.5;
            }
        }
        if (typ.typ === "курс" || typ.typ === "группа" || typ.typ === "група") {
            if (dep.number === null) 
                coef = 0;
            else if (typ.typ === "курс") {
                let n = 0;
                let wrapn2351 = new RefOutArgWrapper();
                let inoutres2352 = Utils.tryParseInt(dep.number, wrapn2351);
                n = wrapn2351.value;
                if (inoutres2352) {
                    if (n > 0 && (n < 9)) 
                        coef += (2);
                }
            }
        }
        if (t1.next !== null && t1.next.is_char('(')) {
            let ttt = t1.next.next;
            if ((ttt !== null && ttt.next !== null && ttt.next.is_char(')')) && (ttt instanceof TextToken)) {
                if (dep.name_vars.containsKey((ttt).term)) {
                    coef += (2);
                    dep.add_name((ttt).term, true, ttt);
                    t1 = ttt.next;
                }
            }
        }
        let _ep = OrgItemEponymToken.try_attach(t1.next, false);
        if (_ep !== null) {
            coef += (2);
            for (const e of _ep.eponyms) {
                dep.add_eponym(e);
            }
            t1 = _ep.end_token;
        }
        if (br_name !== null) {
            let str1 = MiscHelper.get_text_value(br_name.begin_token.next, br_name.end_token.previous, GetTextAttr.NO);
            if (str1 !== null) 
                dep.add_name(str1, true, null);
        }
        if (dep.slots.length === 0) 
            return null;
        let res = new ReferentToken(dep, t0, t1);
        this.correct_dep_attrs(res, typ, after_org_temp);
        if (dep.number !== null) 
            coef += (2);
        if (is_pure_dep) 
            coef += (2);
        if (spec_word_before) {
            if (dep.find_slot(OrganizationReferent.ATTR_NAME, null, true) !== null) 
                coef += (2);
        }
        if (coef > 3 || attach_typ === OrganizationAnalyzerAttachType.EXTONTOLOGY) 
            return res;
        else 
            return null;
    }
    
    correct_dep_attrs(res, typ, after_temp_org = false) {
        let t0 = res.begin_token;
        let dep = Utils.as(res.referent, OrganizationReferent);
        if ((((((((typ !== null && typ.root !== null && typ.root.can_has_number)) || dep.types.includes("офис") || dep.types.includes("офіс")) || dep.types.includes("отдел") || dep.types.includes("отделение")) || dep.types.includes("инспекция") || dep.types.includes("лаборатория")) || dep.types.includes("управление") || dep.types.includes("управління")) || dep.types.includes("відділ") || dep.types.includes("відділення")) || dep.types.includes("інспекція") || dep.types.includes("лабораторія")) {
            if (((t0.previous instanceof NumberToken) && (t0.whitespaces_before_count < 3) && !t0.previous.morph.class0.is_noun) && t0.previous.is_whitespace_before) {
                let nn = (t0.previous).value.toString();
                if (dep.number === null || dep.number === nn) {
                    dep.number = nn;
                    t0 = t0.previous;
                    res.begin_token = t0;
                }
            }
            if (MiscHelper.check_number_prefix(res.end_token.next) !== null && (res.end_token.whitespaces_after_count < 3) && dep.number === null) {
                let num = OrgItemNumberToken.try_attach(res.end_token.next, false, typ);
                if (num !== null) {
                    dep.number = num.number;
                    res.end_token = num.end_token;
                }
            }
        }
        if (dep.types.includes("управление") || dep.types.includes("департамент") || dep.types.includes("управління")) {
            for (const s of dep.slots) {
                if (s.type_name === OrganizationReferent.ATTR_GEO && (s.value instanceof GeoReferent)) {
                    let g = Utils.as(s.value, GeoReferent);
                    if (g.is_state && g.alpha2 === "RU") {
                        Utils.removeItem(dep.slots, s);
                        break;
                    }
                }
            }
        }
        let t1 = res.end_token;
        if (t1.next === null || after_temp_org) 
            return;
        let br = BracketHelper.try_parse(t1.next, BracketParseAttr.NO, 100);
        if (br !== null && (t1.whitespaces_after_count < 2) && br.is_quote_type) {
            let g = this.is_geo(br.begin_token.next, false);
            if (g instanceof ReferentToken) {
                if ((g).end_token.next === br.end_token) {
                    dep.add_geo_object(g);
                    t1 = res.end_token = br.end_token;
                }
            }
            else if ((g instanceof Referent) && br.begin_token.next.next === br.end_token) {
                dep.add_geo_object(g);
                t1 = res.end_token = br.end_token;
            }
            else if (br.begin_token.next.is_value("О", null) || br.begin_token.next.is_value("ОБ", null)) {
            }
            else {
                let nam = MiscHelper.get_text_value_of_meta_token(br, GetTextAttr.NO);
                if (nam !== null) {
                    dep.add_name(nam, true, br.begin_token.next);
                    t1 = res.end_token = br.end_token;
                }
            }
        }
        let prep = false;
        if (t1.next !== null) {
            if (t1.next.morph.class0.is_preposition) {
                if (t1.next.is_value("В", null) || t1.next.is_value("ПО", null)) {
                    t1 = t1.next;
                    prep = true;
                }
            }
            if (t1.next !== null && (t1.next.whitespaces_before_count < 3)) {
                if (t1.next.is_value("НА", null) && t1.next.next !== null && t1.next.next.is_value("ТРАНСПОРТ", null)) 
                    res.end_token = (t1 = t1.next.next);
            }
        }
        for (let k = 0; k < 2; k++) {
            if (t1.next === null) 
                return;
            let _geo = Utils.as(t1.next.get_referent(), GeoReferent);
            let ge = false;
            if (_geo !== null) {
                if (!dep.add_geo_object(_geo)) 
                    return;
                res.end_token = t1.next;
                ge = true;
            }
            else {
                let rgeo = t1.kit.process_referent("GEO", t1.next);
                if (rgeo !== null) {
                    if (!rgeo.morph.class0.is_adjective) {
                        if (!dep.add_geo_object(rgeo)) 
                            return;
                        res.end_token = rgeo.end_token;
                        ge = true;
                    }
                }
            }
            if (!ge) 
                return;
            t1 = res.end_token;
            if (t1.next === null) 
                return;
            let is_and = false;
            if (t1.next.is_and) 
                t1 = t1.next;
            if (t1 === null) 
                return;
        }
    }
    
    attach_global_org(t, attach_typ, ad, ext_geo = null) {
        const OrgItemEponymToken = require("./internal/OrgItemEponymToken");
        const OrgItemNameToken = require("./internal/OrgItemNameToken");
        if ((t instanceof TextToken) && t.chars.is_latin_letter) {
            if (MiscHelper.is_eng_article(t)) {
                let res11 = this.attach_global_org(t.next, attach_typ, ad, ext_geo);
                if (res11 !== null) {
                    res11.begin_token = t;
                    return res11;
                }
            }
        }
        let rt00 = this.try_attach_politic_party(t, Utils.as(ad, OrganizationAnalyzer.OrgAnalyzerData), true);
        if (rt00 !== null) 
            return rt00;
        if (!((t instanceof TextToken))) {
            if (t !== null && t.get_referent() !== null && t.get_referent().type_name === "URI") {
                let rt = this.attach_global_org((t).begin_token, attach_typ, ad, null);
                if (rt !== null && rt.end_char === t.end_char) {
                    rt.begin_token = rt.end_token = t;
                    return rt;
                }
            }
            return null;
        }
        let term = (t).term;
        if (t.chars.is_all_upper && term === "ВС") {
            if (t.previous !== null) {
                if (t.previous.is_value("ПРЕЗИДИУМ", null) || t.previous.is_value("ПЛЕНУМ", null) || t.previous.is_value("СЕССИЯ", null)) {
                    let org00 = new OrganizationReferent();
                    org00.add_name("ВЕРХОВНЫЙ СОВЕТ", true, null);
                    org00.add_name("ВС", true, null);
                    org00.add_type_str("совет");
                    org00.add_profile(OrgProfile.STATE);
                    let te = this.attach_tail_attributes(org00, t.next, null, false, OrganizationAnalyzerAttachType.NORMAL, true);
                    return new ReferentToken(org00, t, (te != null ? te : t));
                }
            }
            if (t.next !== null && (t.next.get_referent() instanceof GeoReferent)) {
                let is_vc = false;
                if (t.previous !== null && (t.previous.get_referent() instanceof OrganizationReferent) && (t.previous.get_referent()).kind === OrganizationKind.MILITARY) 
                    is_vc = true;
                else if (ad !== null) {
                    for (const r of ad.referents) {
                        if (r.find_slot(OrganizationReferent.ATTR_NAME, "ВООРУЖЕННЫЕ СИЛЫ", true) !== null) {
                            is_vc = true;
                            break;
                        }
                    }
                }
                if (is_vc) {
                    let org00 = new OrganizationReferent();
                    org00.add_name("ВООРУЖЕННЫЕ СИЛЫ", true, null);
                    org00.add_name("ВС", true, null);
                    org00.add_type_str("армия");
                    org00.add_profile(OrgProfile.ARMY);
                    let te = this.attach_tail_attributes(org00, t.next, null, false, OrganizationAnalyzerAttachType.NORMAL, true);
                    return new ReferentToken(org00, t, (te != null ? te : t));
                }
            }
        }
        if ((t.chars.is_all_upper && ((term === "АН" || term === "ВАС")) && t.next !== null) && (t.next.get_referent() instanceof GeoReferent)) {
            let org00 = new OrganizationReferent();
            if (term === "АН") {
                org00.add_name("АКАДЕМИЯ НАУК", true, null);
                org00.add_type_str("академия");
                org00.add_profile(OrgProfile.SCIENCE);
            }
            else {
                org00.add_name("ВЫСШИЙ АРБИТРАЖНЫЙ СУД", true, null);
                org00.add_name("ВАС", true, null);
                org00.add_type_str("суд");
                org00.add_profile(OrgProfile.JUSTICE);
            }
            let te = this.attach_tail_attributes(org00, t.next, null, false, OrganizationAnalyzerAttachType.NORMAL, true);
            return new ReferentToken(org00, t, (te != null ? te : t));
        }
        if (t.chars.is_all_upper && term === "ГД" && t.previous !== null) {
            let rt = t.kit.process_referent("PERSONPROPERTY", t.previous);
            if (rt !== null && rt.referent !== null && rt.referent.type_name === "PERSONPROPERTY") {
                let org00 = new OrganizationReferent();
                org00.add_name("ГОСУДАРСТВЕННАЯ ДУМА", true, null);
                org00.add_name("ГОСДУМА", true, null);
                org00.add_name("ГД", true, null);
                org00.add_type_str("парламент");
                org00.add_profile(OrgProfile.STATE);
                let te = this.attach_tail_attributes(org00, t.next, null, false, OrganizationAnalyzerAttachType.NORMAL, true);
                return new ReferentToken(org00, t, (te != null ? te : t));
            }
        }
        if (t.chars.is_all_upper && term === "МЮ") {
            let ok = false;
            if ((t.previous !== null && t.previous.is_value("В", null) && t.previous.previous !== null) && t.previous.previous.is_value("ЗАРЕГИСТРИРОВАТЬ", null)) 
                ok = true;
            else if (t.next !== null && (t.next.get_referent() instanceof GeoReferent)) 
                ok = true;
            if (ok) {
                let org00 = new OrganizationReferent();
                org00.add_type_str("министерство");
                org00.add_profile(OrgProfile.STATE);
                org00.add_name("МИНИСТЕРСТВО ЮСТИЦИИ", true, null);
                org00.add_name("МИНЮСТ", true, null);
                let t1 = t;
                if (t.next !== null && (t.next.get_referent() instanceof GeoReferent)) {
                    t1 = t.next;
                    org00.add_geo_object(t1.get_referent());
                }
                return new ReferentToken(org00, t, t1);
            }
        }
        if (t.chars.is_all_upper && term === "ФС") {
            if (t.next !== null && (t.next.get_referent() instanceof GeoReferent)) {
                let org00 = new OrganizationReferent();
                org00.add_type_str("парламент");
                org00.add_profile(OrgProfile.STATE);
                org00.add_name("ФЕДЕРАЛЬНОЕ СОБРАНИЕ", true, null);
                org00.add_geo_object(t.next.get_referent());
                return new ReferentToken(org00, t, t.next);
            }
        }
        if (t.chars.is_all_upper && term === "МП") {
            let tt0 = t.previous;
            if (tt0 !== null && tt0.is_char('(')) 
                tt0 = tt0.previous;
            let org0 = null;
            let prev = false;
            if (tt0 !== null) {
                org0 = Utils.as(tt0.get_referent(), OrganizationReferent);
                if (org0 !== null) 
                    prev = true;
            }
            if (t.next !== null && org0 === null) 
                org0 = Utils.as(t.next.get_referent(), OrganizationReferent);
            if (org0 !== null && org0.kind === OrganizationKind.CHURCH) {
                let glob = new OrganizationReferent();
                glob.add_type_str("патриархия");
                glob.add_name("МОСКОВСКАЯ ПАТРИАРХИЯ", true, null);
                glob.higher = org0;
                glob.add_profile(OrgProfile.RELIGION);
                let res = new ReferentToken(glob, t, t);
                if (!prev) 
                    res.end_token = t.next;
                else {
                    res.begin_token = tt0;
                    if (tt0 !== t.previous && res.end_token.next !== null && res.end_token.next.is_char(')')) 
                        res.end_token = res.end_token.next;
                }
                return res;
            }
        }
        if (t.chars.is_all_upper && term === "ГШ") {
            if (t.next !== null && (t.next.get_referent() instanceof OrganizationReferent) && (t.next.get_referent()).kind === OrganizationKind.MILITARY) {
                let org00 = new OrganizationReferent();
                org00.add_type_str("генеральный штаб");
                org00.add_profile(OrgProfile.ARMY);
                org00.higher = Utils.as(t.next.get_referent(), OrganizationReferent);
                return new ReferentToken(org00, t, t.next);
            }
        }
        if (t.chars.is_all_upper && term === "ЗС") {
            if (t.next !== null && (t.next.get_referent() instanceof GeoReferent)) {
                let org00 = new OrganizationReferent();
                org00.add_type_str("парламент");
                org00.add_profile(OrgProfile.STATE);
                org00.add_name("ЗАКОНОДАТЕЛЬНОЕ СОБРАНИЕ", true, null);
                org00.add_geo_object(t.next.get_referent());
                return new ReferentToken(org00, t, t.next);
            }
        }
        if (t.chars.is_all_upper && term === "СФ") {
            t.inner_bool = true;
            if (t.next !== null && (t.next.get_referent() instanceof GeoReferent)) {
                let org00 = new OrganizationReferent();
                org00.add_type_str("совет");
                org00.add_profile(OrgProfile.STATE);
                org00.add_name("СОВЕТ ФЕДЕРАЦИИ", true, null);
                org00.add_geo_object(t.next.get_referent());
                return new ReferentToken(org00, t, t.next);
            }
            if (t.next !== null) {
                if (t.next.is_value("ФС", null) || (((t.next.get_referent() instanceof OrganizationReferent) && t.next.get_referent().find_slot(OrganizationReferent.ATTR_NAME, "ФЕДЕРАЛЬНОЕ СОБРАНИЕ", true) !== null))) {
                    let org00 = new OrganizationReferent();
                    org00.add_type_str("совет");
                    org00.add_profile(OrgProfile.STATE);
                    org00.add_name("СОВЕТ ФЕДЕРАЦИИ", true, null);
                    return new ReferentToken(org00, t, t);
                }
            }
        }
        if (t.chars.is_all_upper && term === "ФК") {
            if (t.next !== null && (t.next.get_referent() instanceof GeoReferent)) {
                let org00 = new OrganizationReferent();
                org00.add_type_str("казначейство");
                org00.add_profile(OrgProfile.FINANCE);
                org00.add_name("ФЕДЕРАЛЬНОЕ КАЗНАЧЕЙСТВО", true, null);
                org00.add_geo_object(t.next.get_referent());
                return new ReferentToken(org00, t, t.next);
            }
            if (attach_typ === OrganizationAnalyzerAttachType.NORMALAFTERDEP) {
                let org00 = new OrganizationReferent();
                org00.add_type_str("казначейство");
                org00.add_profile(OrgProfile.FINANCE);
                org00.add_name("ФЕДЕРАЛЬНОЕ КАЗНАЧЕЙСТВО", true, null);
                return new ReferentToken(org00, t, t);
            }
        }
        if (t.chars.is_all_upper && ((term === "СК" || term === "CK"))) {
            if (t.next !== null && (t.next.get_referent() instanceof GeoReferent)) {
                for (let tt = t.previous; tt !== null; tt = tt.previous) {
                    if (tt instanceof TextToken) {
                        if (tt.is_comma_and) 
                            continue;
                        if (tt instanceof NumberToken) 
                            continue;
                        if (!tt.chars.is_letter) 
                            continue;
                        if ((tt.is_value("ЧАСТЬ", null) || tt.is_value("СТАТЬЯ", null) || tt.is_value("ПУНКТ", null)) || tt.is_value("СТ", null) || tt.is_value("П", null)) 
                            return null;
                        break;
                    }
                }
                let org00 = new OrganizationReferent();
                org00.add_type_str("комитет");
                org00.add_profile(OrgProfile.UNIT);
                org00.add_name("СЛЕДСТВЕННЫЙ КОМИТЕТ", true, null);
                org00.add_geo_object(t.next.get_referent());
                return new ReferentToken(org00, t, t.next);
            }
            let gt1 = OrgGlobal.GLOBAL_ORGS.try_attach(t.next, null, false);
            if (gt1 === null && t.next !== null && t.kit.base_language.is_ua) 
                gt1 = OrgGlobal.GLOBAL_ORGS_UA.try_attach(t.next, null, false);
            let ok = false;
            if (gt1 !== null && gt1[0].item.referent.find_slot(OrganizationReferent.ATTR_NAME, "МВД", true) !== null) 
                ok = true;
            if (ok) {
                let org00 = new OrganizationReferent();
                org00.add_type_str("комитет");
                org00.add_name("СЛЕДСТВЕННЫЙ КОМИТЕТ", true, null);
                org00.add_profile(OrgProfile.UNIT);
                return new ReferentToken(org00, t, t);
            }
        }
        let gt = OrgGlobal.GLOBAL_ORGS.try_attach(t, null, true);
        if (gt === null) 
            gt = OrgGlobal.GLOBAL_ORGS.try_attach(t, null, false);
        if (gt === null && t !== null && t.kit.base_language.is_ua) {
            gt = OrgGlobal.GLOBAL_ORGS_UA.try_attach(t, null, true);
            if (gt === null) 
                gt = OrgGlobal.GLOBAL_ORGS_UA.try_attach(t, null, false);
        }
        if (gt === null) 
            return null;
        for (const ot of gt) {
            let org0 = Utils.as(ot.item.referent, OrganizationReferent);
            if (org0 === null) 
                continue;
            if (ot.begin_token === ot.end_token) {
                if (gt.length === 1) {
                    if ((ot.begin_token instanceof TextToken) && (ot.begin_token).term === "МГТУ") {
                        let ty = OrgItemTypeToken.try_attach(ot.begin_token, false, null);
                        if (ty !== null) 
                            continue;
                    }
                }
                else {
                    if (ad === null) 
                        return null;
                    let ok = false;
                    for (const o of ad.referents) {
                        if (o.can_be_equals(org0, ReferentEqualType.DIFFERENTTEXTS)) {
                            ok = true;
                            break;
                        }
                    }
                    if (!ok) 
                        return null;
                }
            }
            if (((t.chars.is_all_lower && attach_typ !== OrganizationAnalyzerAttachType.EXTONTOLOGY && ext_geo === null) && !t.is_value("МИД", null) && !org0._types_contains("факультет")) && org0.kind !== OrganizationKind.JUSTICE) {
                if (ot.begin_token === ot.end_token) 
                    continue;
                if (ot.morph.number === MorphNumber.PLURAL) 
                    continue;
                let tyty = OrgItemTypeToken.try_attach(t, true, null);
                if (tyty !== null && tyty.end_token === ot.end_token) 
                    continue;
                if (t.next !== null && (t.next.get_referent() instanceof GeoReferent)) {
                }
                else if (OrgItemTypeToken.check_org_special_word_before(t.previous)) {
                }
                else 
                    continue;
            }
            if ((ot.begin_token === ot.end_token && (t.length_char < 6) && !t.chars.is_all_upper) && !t.chars.is_last_lower) {
                if (org0.find_slot(OrganizationReferent.ATTR_NAME, (t).term, true) === null) {
                    if (t.is_value("МИД", null)) {
                    }
                    else 
                        continue;
                }
                else if (t.chars.is_all_lower) 
                    continue;
                else if (t.length_char < 3) 
                    continue;
                else if (t.length_char === 4) {
                    let has_vow = false;
                    for (const ch of (t).term) {
                        if (LanguageHelper.is_cyrillic_vowel(ch) || LanguageHelper.is_latin_vowel(ch)) 
                            has_vow = true;
                    }
                    if (has_vow) 
                        continue;
                }
            }
            if (ot.begin_token === ot.end_token && term === "МЭР") 
                continue;
            if (ot.begin_token === ot.end_token) {
                if (t.previous === null || t.is_whitespace_before) {
                }
                else if ((t.previous instanceof TextToken) && ((t.previous.is_char_of(",:") || BracketHelper.can_be_start_of_sequence(t.previous, false, false)))) {
                }
                else 
                    continue;
                if (t.next === null || t.is_whitespace_after) {
                }
                else if ((t.next instanceof TextToken) && ((t.next.is_char_of(",.") || BracketHelper.can_be_end_of_sequence(t.next, false, null, false)))) {
                }
                else 
                    continue;
                if (t instanceof TextToken) {
                    let has_name = false;
                    for (const n of org0.names) {
                        if (t.is_value(n, null)) {
                            has_name = true;
                            break;
                        }
                    }
                    if (!has_name) 
                        continue;
                    if (t.length_char < 3) {
                        let ok1 = true;
                        if (t.next !== null && !t.is_newline_before) {
                            if (MiscHelper.check_number_prefix(t.next) !== null) 
                                ok1 = false;
                            else if (t.next.is_hiphen || (t.next instanceof NumberToken)) 
                                ok1 = false;
                        }
                        if (!ok1) 
                            continue;
                    }
                }
                let rt = t.kit.process_referent("TRANSPORT", t);
                if (rt !== null) 
                    continue;
            }
            let _org = null;
            if (t instanceof TextToken) {
                if ((t.is_value("ДЕПАРТАМЕНТ", null) || t.is_value("КОМИТЕТ", "КОМІТЕТ") || t.is_value("МИНИСТЕРСТВО", "МІНІСТЕРСТВО")) || t.is_value("КОМИССИЯ", "КОМІСІЯ")) {
                    let nnn = OrgItemNameToken.try_attach(t.next, null, true, true);
                    if (nnn !== null && nnn.end_char > ot.end_char) {
                        _org = new OrganizationReferent();
                        for (const p of org0.profiles) {
                            _org.add_profile(p);
                        }
                        _org.add_type_str((t).lemma.toLowerCase());
                        _org.add_name(MiscHelper.get_text_value(t, nnn.end_token, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVESINGLE), true, null);
                        ot.end_token = nnn.end_token;
                    }
                }
            }
            if (_org === null) {
                _org = Utils.as(org0.clone(), OrganizationReferent);
                if (_org.geo_objects.length > 0) {
                    for (const s of _org.slots) {
                        if (s.type_name === OrganizationReferent.ATTR_GEO && (s.value instanceof GeoReferent)) {
                            let gg = (s.value).clone();
                            gg.occurrence.splice(0, gg.occurrence.length);
                            let rtg = new ReferentToken(gg, t, t);
                            rtg.data = t.kit.get_analyzer_data_by_analyzer_name("GEO");
                            Utils.removeItem(_org.slots, s);
                            _org.add_geo_object(rtg);
                            break;
                        }
                    }
                }
                _org.add_name(ot.termin.canonic_text, true, null);
            }
            if (ext_geo !== null) 
                _org.add_geo_object(ext_geo);
            _org.is_from_global_ontos = true;
            for (let tt = ot.begin_token; tt !== null && (tt.end_char < ot.end_char); tt = tt.next) {
                if (tt.get_referent() instanceof GeoReferent) {
                    _org.add_geo_object(tt);
                    break;
                }
            }
            if ((t.previous instanceof TextToken) && (t.whitespaces_before_count < 2) && t.previous.morph.class0.is_adjective) {
                let gg = t.kit.process_referent("GEO", t.previous);
                if (gg !== null && gg.morph.class0.is_adjective) {
                    t = t.previous;
                    _org.add_geo_object(gg);
                }
            }
            let t1 = null;
            if (!org0.types.includes("академия") && attach_typ !== OrganizationAnalyzerAttachType.NORMALAFTERDEP && attach_typ !== OrganizationAnalyzerAttachType.EXTONTOLOGY) 
                t1 = this.attach_tail_attributes(_org, ot.end_token.next, null, false, OrganizationAnalyzerAttachType.NORMAL, true);
            else if ((((((org0.types.includes("министерство") || org0.types.includes("парламент") || org0.types.includes("совет")) || org0.kind === OrganizationKind.SCIENCE || org0.kind === OrganizationKind.GOVENMENT) || org0.kind === OrganizationKind.STUDY || org0.kind === OrganizationKind.JUSTICE) || org0.kind === OrganizationKind.MILITARY)) && (ot.end_token.next instanceof ReferentToken)) {
                let _geo = Utils.as(ot.end_token.next.get_referent(), GeoReferent);
                if (_geo !== null && _geo.is_state) {
                    _org.add_geo_object(_geo);
                    t1 = ot.end_token.next;
                }
            }
            if (t1 === null) 
                t1 = ot.end_token;
            let epp = OrgItemEponymToken.try_attach(t1.next, false);
            if (epp !== null) {
                let exi = false;
                for (const v of epp.eponyms) {
                    if (_org.find_slot(OrganizationReferent.ATTR_EPONYM, v, true) !== null) {
                        exi = true;
                        break;
                    }
                }
                if (!exi) {
                    for (let i = _org.slots.length - 1; i >= 0; i--) {
                        if (_org.slots[i].type_name === OrganizationReferent.ATTR_EPONYM) 
                            _org.slots.splice(i, 1);
                    }
                    for (const vv of epp.eponyms) {
                        _org.add_eponym(vv);
                    }
                }
                t1 = epp.end_token;
            }
            if (t1.whitespaces_after_count < 2) {
                let typ = OrgItemTypeToken.try_attach(t1.next, false, null);
                if (typ !== null) {
                    if (OrgItemTypeToken.is_type_accords(_org, typ)) {
                        if (typ.chars.is_latin_letter && typ.root !== null && typ.root.can_be_normal_dep) {
                        }
                        else {
                            _org.add_type(typ, false);
                            t1 = typ.end_token;
                        }
                    }
                }
            }
            if (_org.geo_objects.length === 0 && t.previous !== null && t.previous.morph.class0.is_adjective) {
                let grt = t.kit.process_referent("GEO", t.previous);
                if (grt !== null && grt.end_token.next === t) {
                    _org.add_geo_object(grt);
                    t = t.previous;
                }
            }
            if (_org.find_slot(OrganizationReferent.ATTR_NAME, "ВТБ", true) !== null && t1.next !== null) {
                let tt = t1.next;
                if (tt.is_hiphen && tt.next !== null) 
                    tt = tt.next;
                if (tt instanceof NumberToken) {
                    _org.number = (tt).value.toString();
                    t1 = tt;
                }
            }
            if (!t.is_whitespace_before && !t1.is_whitespace_after) {
                if (BracketHelper.can_be_start_of_sequence(t.previous, true, false) && BracketHelper.can_be_end_of_sequence(t1.next, true, null, false)) {
                    t = t.previous;
                    t1 = t1.next;
                }
            }
            return new ReferentToken(_org, t, t1);
        }
        return null;
    }
    
    static _try_attach_org_med_typ(t) {
        if (!((t instanceof TextToken))) 
            return null;
        let s = (t).term;
        if (((t !== null && s === "Г" && t.next !== null) && t.next.is_char_of("\\/.") && t.next.next !== null) && t.next.next.is_value("Б", null)) {
            let t1 = t.next.next;
            if (t.next.is_char('.') && t1.next !== null && t1.next.is_char('.')) 
                t1 = t1.next;
            return MetaToken._new2354(t, t1, "городская больница", MorphCollection._new2353(MorphGender.FEMINIE));
        }
        if ((s === "ИН" && t.next !== null && t.next.is_hiphen) && t.next.next !== null && t.next.next.is_value("Т", null)) 
            return MetaToken._new2354(t, t.next.next, "институт", MorphCollection._new2353(MorphGender.MASCULINE));
        if ((s === "Б" && t.next !== null && t.next.is_hiphen) && (t.next.next instanceof TextToken) && ((t.next.next.is_value("ЦА", null) || t.next.next.is_value("ЦУ", null)))) 
            return MetaToken._new2354(t, t.next.next, "больница", MorphCollection._new2353(MorphGender.FEMINIE));
        if (s === "ГКБ") 
            return MetaToken._new2354(t, t, "городская клиническая больница", MorphCollection._new2353(MorphGender.FEMINIE));
        if (t.is_value("ПОЛИКЛИНИКА", null)) 
            return MetaToken._new2354(t, t, "поликлиника", MorphCollection._new2353(MorphGender.FEMINIE));
        if (t.is_value("БОЛЬНИЦА", null)) 
            return MetaToken._new2354(t, t, "больница", MorphCollection._new2353(MorphGender.FEMINIE));
        if (t.is_value("ДЕТСКИЙ", null)) {
            let mt = OrganizationAnalyzer._try_attach_org_med_typ(t.next);
            if (mt !== null) {
                mt.begin_token = t;
                mt.tag = ((mt.morph.gender === MorphGender.FEMINIE ? "детская" : "детский") + " " + mt.tag);
                return mt;
            }
        }
        return null;
    }
    
    try_attach_org_med(t, ad) {
        const OrgItemEponymToken = require("./internal/OrgItemEponymToken");
        if (t === null) 
            return null;
        if (t.previous === null || t.previous.previous === null) 
            return null;
        if ((t.previous.morph.class0.is_preposition && t.previous.previous.is_value("ДОСТАВИТЬ", null)) || t.previous.previous.is_value("ПОСТУПИТЬ", null)) {
        }
        else 
            return null;
        if (t.is_value("ТРАВМПУНКТ", null)) 
            t = t.next;
        else if (t.is_value("ТРАВМ", null)) {
            if ((t.next !== null && t.next.is_char('.') && t.next.next !== null) && t.next.next.is_value("ПУНКТ", null)) 
                t = t.next.next.next;
        }
        if (t instanceof NumberToken) {
            let tt = OrganizationAnalyzer._try_attach_org_med_typ(t.next);
            if (tt !== null) {
                let org1 = new OrganizationReferent();
                org1.add_type_str((tt.tag).toLowerCase());
                org1.number = (t).value.toString();
                return new ReferentToken(org1, t, tt.end_token);
            }
        }
        let typ = OrganizationAnalyzer._try_attach_org_med_typ(t);
        let adj = null;
        if (typ === null && t.chars.is_capital_upper && t.morph.class0.is_adjective) {
            typ = OrganizationAnalyzer._try_attach_org_med_typ(t.next);
            if (typ !== null) 
                adj = t.get_normal_case_text(MorphClass.ADJECTIVE, true, typ.morph.gender, false);
        }
        if (typ === null) 
            return null;
        let _org = new OrganizationReferent();
        let s = (Utils.asString(typ.tag));
        _org.add_type_str(s.toLowerCase());
        if (adj !== null) 
            _org.add_name((adj + " " + s.toUpperCase()), true, null);
        let t1 = typ.end_token;
        let epo = OrgItemEponymToken.try_attach(t1.next, false);
        if (epo !== null) {
            for (const v of epo.eponyms) {
                _org.add_eponym(v);
            }
            t1 = epo.end_token;
        }
        if (t1.next instanceof TextToken) {
            if (t1.next.is_value("СКЛИФОСОФСКОГО", null) || t1.next.is_value("СЕРБСКОГО", null) || t1.next.is_value("БОТКИНА", null)) {
                _org.add_eponym((t1.next).term);
                t1 = t1.next;
            }
        }
        let num = OrgItemNumberToken.try_attach(t1.next, false, null);
        if (num !== null) {
            _org.number = num.number;
            t1 = num.end_token;
        }
        if (_org.slots.length > 1) 
            return new ReferentToken(_org, t, t1);
        return null;
    }
    
    try_attach_prop_names(t, ad) {
        let rt = this._try_attach_org_sport_associations(t, ad);
        if (rt === null) 
            rt = this._try_attach_org_names(t, ad);
        if (rt === null) 
            return null;
        let t0 = rt.begin_token.previous;
        if ((t0 instanceof TextToken) && (t0.whitespaces_after_count < 2) && t0.morph.class0.is_adjective) {
            let rt0 = t0.kit.process_referent("GEO", t0);
            if (rt0 !== null && rt0.morph.class0.is_adjective) {
                rt.begin_token = rt0.begin_token;
                (rt.referent).add_geo_object(rt0);
            }
        }
        if (rt.end_token.whitespaces_after_count < 2) {
            let tt1 = this.attach_tail_attributes(Utils.as(rt.referent, OrganizationReferent), rt.end_token.next, ad, true, OrganizationAnalyzerAttachType.NORMAL, true);
            if (tt1 !== null) 
                rt.end_token = tt1;
        }
        return rt;
    }
    
    _try_attach_org_names(t, ad) {
        const OrgItemEngItem = require("./internal/OrgItemEngItem");
        const OrgItemNameToken = require("./internal/OrgItemNameToken");
        if (t === null) 
            return null;
        let t0 = t;
        let br = null;
        let tname1 = null;
        let prof = OrgProfile.UNDEFINED;
        let prof2 = OrgProfile.UNDEFINED;
        let typ = null;
        let ok = false;
        let uri = null;
        if (!((t instanceof TextToken)) || !t.chars.is_letter) {
            if (BracketHelper.can_be_start_of_sequence(t, true, false)) {
                if ((((br = BracketHelper.try_parse(t, BracketParseAttr.NO, 15)))) !== null) 
                    t = t0.next;
                else 
                    return null;
            }
            else if (t.get_referent() !== null && t.get_referent().type_name === "URI") {
                let r = t.get_referent();
                let s = r.get_string_value("SCHEME");
                if (s === "HTTP") {
                    prof = OrgProfile.MEDIA;
                    tname1 = t;
                }
            }
            else if ((t.get_referent() instanceof GeoReferent) && t.chars.is_letter) {
                if ((t.next !== null && (t.next.whitespaces_after_count < 3) && t.next.chars.is_latin_letter) && ((t.next.is_value("POST", null) || t.next.is_value("TODAY", null)))) {
                    tname1 = t.next;
                    if (OrganizationAnalyzer._is_std_press_end(tname1)) 
                        prof = OrgProfile.MEDIA;
                }
                else 
                    return null;
            }
            else 
                return null;
        }
        else if (t.chars.is_all_upper && (t).term === "ИА") {
            prof = OrgProfile.MEDIA;
            t = t.next;
            typ = "информационное агенство";
            if (t === null || t.whitespaces_before_count > 2) 
                return null;
            let re = this._try_attach_org_names(t, ad);
            if (re !== null) {
                re.begin_token = t0;
                (re.referent).add_type_str(typ);
                return re;
            }
            if (t.chars.is_latin_letter) {
                let nam = OrgItemEngItem.try_attach(t, false);
                if (nam !== null) {
                    ok = true;
                    tname1 = nam.end_token;
                }
                else {
                    let nam1 = OrgItemNameToken.try_attach(t, null, false, true);
                    if (nam1 !== null) {
                        ok = true;
                        tname1 = nam1.end_token;
                    }
                }
            }
        }
        else if (((t.chars.is_latin_letter && t.next !== null && t.next.is_char('.')) && !t.next.is_whitespace_after && t.next.next !== null) && t.next.next.chars.is_latin_letter) {
            tname1 = t.next.next;
            prof = OrgProfile.MEDIA;
            if (tname1.next === null) {
            }
            else if (tname1.whitespaces_after_count > 0) {
            }
            else if (tname1.next.is_char(',')) {
            }
            else if (tname1.length_char > 1 && tname1.next.is_char_of(".") && tname1.next.is_whitespace_after) {
            }
            else if (br !== null && br.end_token.previous === tname1) {
            }
            else 
                return null;
        }
        else if (t.chars.is_all_lower && br === null) 
            return null;
        let t00 = t0.previous;
        if (t00 !== null && t00.morph.class0.is_adjective) 
            t00 = t00.previous;
        if (t00 !== null && t00.morph.class0.is_preposition) 
            t00 = t00.previous;
        let tok = OrganizationAnalyzer.m_prop_names.try_parse(t, TerminParseAttr.NO);
        if (tok === null && t.chars.is_latin_letter && t.is_value("THE", null)) 
            tok = OrganizationAnalyzer.m_prop_names.try_parse(t.next, TerminParseAttr.NO);
        if (tok !== null && t.is_value("ВЕДУЩИЙ", null) && tok.begin_token === tok.end_token) 
            tok = null;
        if (tok !== null) 
            prof = OrgProfile.of(tok.termin.tag);
        if (br !== null) {
            let t1 = br.end_token.previous;
            for (let tt = br.begin_token; tt !== null && tt.end_char <= br.end_char; tt = tt.next) {
                let mc = tt.get_morph_class_in_dictionary();
                if (MorphClass.ooEq(mc, MorphClass.VERB)) 
                    return null;
                if (MorphClass.ooEq(mc, MorphClass.ADVERB)) 
                    return null;
                if (tt.is_char_of("?:")) 
                    return null;
                if (tt === br.begin_token.next || tt === br.end_token.previous) {
                    if (((tt.is_value("ЖУРНАЛ", null) || tt.is_value("ГАЗЕТА", null) || tt.is_value("ПРАВДА", null)) || tt.is_value("ИЗВЕСТИЯ", null) || tt.is_value("НОВОСТИ", null)) || tt.is_value("ВЕДОМОСТИ", null)) {
                        ok = true;
                        prof = OrgProfile.MEDIA;
                        prof2 = OrgProfile.PRESS;
                    }
                }
            }
            if (!ok && OrganizationAnalyzer._is_std_press_end(t1)) {
                if (br.begin_token.next.chars.is_capital_upper && (br.length_char < 15)) {
                    ok = true;
                    prof = OrgProfile.MEDIA;
                    prof2 = OrgProfile.PRESS;
                }
            }
            else if (t1.is_value("FM", null)) {
                ok = true;
                prof = OrgProfile.MEDIA;
                typ = "радиостанция";
            }
            else if (((t1.is_value("РУ", null) || t1.is_value("RU", null) || t1.is_value("NET", null))) && t1.previous !== null && t1.previous.is_char('.')) 
                prof = OrgProfile.MEDIA;
            let b = br.begin_token.next;
            if (b.is_value("THE", null)) 
                b = b.next;
            if (OrganizationAnalyzer._is_std_press_end(b) || b.is_value("ВЕЧЕРНИЙ", null)) {
                ok = true;
                prof = OrgProfile.MEDIA;
            }
        }
        if ((tok === null && !ok && tname1 === null) && prof === OrgProfile.UNDEFINED) {
            if (br === null || !t.chars.is_capital_upper) 
                return null;
            let tok1 = OrganizationAnalyzer.m_prop_pref.try_parse(t00, TerminParseAttr.NO);
            if (tok1 !== null) {
                let pr = OrgProfile.of(tok1.termin.tag);
                if (prof !== OrgProfile.UNDEFINED && prof !== pr) 
                    return null;
            }
            else {
                if (t.chars.is_letter && !t.chars.is_cyrillic_letter) {
                    for (let tt = t.next; tt !== null; tt = tt.next) {
                        if (tt.get_referent() instanceof GeoReferent) 
                            continue;
                        if (tt.whitespaces_before_count > 2) 
                            break;
                        if (!tt.chars.is_letter || tt.chars.is_cyrillic_letter) 
                            break;
                        if (OrganizationAnalyzer._is_std_press_end(tt)) {
                            tname1 = tt;
                            prof = OrgProfile.MEDIA;
                            ok = true;
                            break;
                        }
                    }
                }
                if (tname1 === null) 
                    return null;
            }
        }
        if (tok !== null) {
            if (tok.begin_token.chars.is_all_lower && br === null) {
            }
            else if (tok.begin_token !== tok.end_token) 
                ok = true;
            else if (MiscHelper.can_be_start_of_sentence(tok.begin_token)) 
                return null;
            else if (br === null && BracketHelper.can_be_start_of_sequence(tok.begin_token.previous, false, false)) 
                return null;
            else if (tok.chars.is_all_upper) 
                ok = true;
        }
        if (!ok) {
            let cou = 0;
            for (let tt = t0.previous; tt !== null && (cou < 100); tt = tt.previous,cou++) {
                if (MiscHelper.can_be_start_of_sentence(tt.next)) 
                    break;
                let tok1 = OrganizationAnalyzer.m_prop_pref.try_parse(tt, TerminParseAttr.NO);
                if (tok1 !== null) {
                    let pr = OrgProfile.of(tok1.termin.tag);
                    if (prof !== OrgProfile.UNDEFINED && prof !== pr) 
                        continue;
                    if (tok1.termin.tag2 !== null && prof === OrgProfile.UNDEFINED) 
                        continue;
                    prof = pr;
                    ok = true;
                    break;
                }
                let org1 = Utils.as(tt.get_referent(), OrganizationReferent);
                if (org1 !== null && org1.find_slot(OrganizationReferent.ATTR_PROFILE, null, true) !== null) {
                    if ((org1.contains_profile(prof) || prof === OrgProfile.UNDEFINED)) {
                        ok = true;
                        prof = org1.profiles[0];
                        break;
                    }
                }
            }
            cou = 0;
            if (!ok) {
                for (let tt = t.next; tt !== null && (cou < 10); tt = tt.next,cou++) {
                    if (MiscHelper.can_be_start_of_sentence(tt) && prof !== OrgProfile.SPORT) 
                        break;
                    let tok1 = OrganizationAnalyzer.m_prop_pref.try_parse(tt, TerminParseAttr.NO);
                    if (tok1 !== null) {
                        let pr = OrgProfile.of(tok1.termin.tag);
                        if (prof !== OrgProfile.UNDEFINED && prof !== pr) 
                            continue;
                        if (tok1.termin.tag2 !== null && prof === OrgProfile.UNDEFINED) 
                            continue;
                        prof = pr;
                        ok = true;
                        break;
                    }
                    let org1 = Utils.as(tt.get_referent(), OrganizationReferent);
                    if (org1 !== null && org1.find_slot(OrganizationReferent.ATTR_PROFILE, null, true) !== null) {
                        if ((org1.contains_profile(prof) || prof === OrgProfile.UNDEFINED)) {
                            ok = true;
                            prof = org1.profiles[0];
                            break;
                        }
                    }
                }
            }
            if (!ok) 
                return null;
        }
        if (prof === OrgProfile.UNDEFINED) 
            return null;
        let _org = new OrganizationReferent();
        _org.add_profile(prof);
        if (prof2 !== OrgProfile.UNDEFINED) 
            _org.add_profile(prof2);
        if (prof === OrgProfile.SPORT) 
            _org.add_type_str("спортивный клуб");
        if (typ !== null) 
            _org.add_type_str(typ);
        if (br !== null && ((tok === null || tok.end_token !== br.end_token.previous))) {
            let nam = null;
            if (tok !== null) {
                nam = MiscHelper.get_text_value(tok.end_token.next, br.end_token, GetTextAttr.NO);
                if (nam !== null) 
                    nam = (tok.termin.canonic_text + " " + nam);
                else 
                    nam = tok.termin.canonic_text;
            }
            else 
                nam = MiscHelper.get_text_value(br.begin_token, br.end_token, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
            if (nam !== null) 
                _org.add_name(nam, true, null);
        }
        else if (tname1 !== null) {
            let nam = MiscHelper.get_text_value(t, tname1, GetTextAttr.NO);
            if (nam !== null) 
                nam = Utils.replaceString(nam, ". ", ".");
            _org.add_name(nam, true, null);
        }
        else if (tok !== null) {
            _org.add_name(tok.termin.canonic_text, true, null);
            if (tok.termin.acronym !== null) 
                _org.add_name(tok.termin.acronym, true, null);
            if (tok.termin.additional_vars !== null) {
                for (const v of tok.termin.additional_vars) {
                    _org.add_name(v.canonic_text, true, null);
                }
            }
        }
        else 
            return null;
        if ((((((prof.value()) & (OrgProfile.MEDIA.value()))) !== (OrgProfile.UNDEFINED.value()))) && t0.previous !== null) {
            if ((t0.previous.is_value("ЖУРНАЛ", null) || t0.previous.is_value("ИЗДАНИЕ", null) || t0.previous.is_value("ИЗДАТЕЛЬСТВО", null)) || t0.previous.is_value("АГЕНТСТВО", null)) {
                t0 = t0.previous;
                _org.add_type_str(t0.get_normal_case_text(MorphClass.NOUN, true, MorphGender.UNDEFINED, false).toLowerCase());
                if (!t0.previous.is_value("АГЕНТСТВО", null)) 
                    _org.add_profile(OrgProfile.PRESS);
            }
        }
        let res = new ReferentToken(_org, t0, t);
        if (br !== null) 
            res.end_token = br.end_token;
        else if (tok !== null) 
            res.end_token = tok.end_token;
        else if (tname1 !== null) 
            res.end_token = tname1;
        else 
            return null;
        return res;
    }
    
    static _is_std_press_end(t) {
        if (!((t instanceof TextToken))) 
            return false;
        let str = (t).term;
        if ((((((((str === "NEWS" || str === "PRESS" || str === "PRESSE") || str === "ПРЕСС" || str === "НЬЮС") || str === "TIMES" || str === "TIME") || str === "ТАЙМС" || str === "POST") || str === "ПОСТ" || str === "TODAY") || str === "ТУДЕЙ" || str === "DAILY") || str === "ДЕЙЛИ" || str === "ИНФОРМ") || str === "INFORM") 
            return true;
        return false;
    }
    
    _try_attach_org_sport_associations(t, ad) {
        if (t === null) 
            return null;
        let cou = 0;
        let typ = null;
        let t1 = null;
        let _geo = null;
        if (t.get_referent() instanceof GeoReferent) {
            let rt = Utils.as(t, ReferentToken);
            if (rt.end_token.is_value("ФЕДЕРАЦИЯ", null) || rt.begin_token.is_value("ФЕДЕРАЦИЯ", null)) {
                typ = "федерация";
                _geo = Utils.as(t.get_referent(), GeoReferent);
            }
            t1 = t;
            if (t.previous !== null && t.previous.morph.class0.is_adjective) {
                if (OrganizationAnalyzer.m_sports.try_parse(t.previous, TerminParseAttr.NO) !== null) {
                    cou++;
                    t = t.previous;
                }
            }
        }
        else {
            let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
            if (npt === null) 
                return null;
            if (npt.morph.number === MorphNumber.PLURAL) 
                return null;
            if (((npt.noun.is_value("АССОЦИАЦИЯ", null) || npt.noun.is_value("ФЕДЕРАЦИЯ", null) || npt.noun.is_value("СОЮЗ", null)) || npt.noun.is_value("СБОРНАЯ", null) || npt.noun.is_value("КОМАНДА", null)) || npt.noun.is_value("КЛУБ", null)) 
                typ = npt.noun.get_normal_case_text(MorphClass.NOUN, true, MorphGender.UNDEFINED, false).toLowerCase();
            else if ((t instanceof TextToken) && t.chars.is_all_upper && (t).term === "ФК") 
                typ = "команда";
            else 
                return null;
            if (typ === "команда") 
                cou--;
            for (const a of npt.adjectives) {
                let tok = OrganizationAnalyzer.m_sports.try_parse(a.begin_token, TerminParseAttr.NO);
                if (tok !== null) 
                    cou++;
                else if (a.begin_token.is_value("ОЛИМПИЙСКИЙ", null)) 
                    cou++;
            }
            if (t1 === null) 
                t1 = npt.end_token;
        }
        let t11 = t1;
        let propname = null;
        let del_word = null;
        for (let tt = t1.next; tt !== null; tt = tt.next) {
            if (tt.whitespaces_before_count > 3) 
                break;
            if (tt.is_comma_and) 
                continue;
            if (tt.morph.class0.is_preposition && !tt.morph.class0.is_adverb && !tt.morph.class0.is_verb) 
                continue;
            if (tt.get_referent() instanceof GeoReferent) {
                t1 = tt;
                _geo = Utils.as(tt.get_referent(), GeoReferent);
                if (typ === "сборная") 
                    cou++;
                continue;
            }
            if (tt.is_value("СТРАНА", null) && (tt instanceof TextToken)) {
                t1 = (t11 = tt);
                del_word = (tt).term;
                continue;
            }
            let tok = OrganizationAnalyzer.m_sports.try_parse(tt, TerminParseAttr.NO);
            if (tok !== null) {
                cou++;
                t1 = (t11 = (tt = tok.end_token));
                continue;
            }
            if (tt.chars.is_all_lower || tt.get_morph_class_in_dictionary().is_verb) {
            }
            else 
                tok = OrganizationAnalyzer.m_prop_names.try_parse(tt, TerminParseAttr.NO);
            if (tok !== null) {
                propname = tok.termin.canonic_text;
                cou++;
                t1 = (tt = tok.end_token);
                if (cou === 0 && typ === "команда") 
                    cou++;
                continue;
            }
            if (BracketHelper.can_be_start_of_sequence(tt, true, false)) {
                let br = BracketHelper.try_parse(tt, BracketParseAttr.NO, 100);
                if (br === null) 
                    break;
                tok = OrganizationAnalyzer.m_prop_names.try_parse(tt.next, TerminParseAttr.NO);
                if (tok !== null || cou > 0) {
                    propname = MiscHelper.get_text_value(tt.next, br.end_token, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
                    cou++;
                    tt = (t1 = br.end_token);
                    continue;
                }
                break;
            }
            let npt1 = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
            if (npt1 === null) 
                break;
            tok = OrganizationAnalyzer.m_sports.try_parse(npt1.noun.begin_token, TerminParseAttr.NO);
            if (tok === null) 
                break;
            cou++;
            t1 = (t11 = (tt = tok.end_token));
        }
        if (cou <= 0) 
            return null;
        let _org = new OrganizationReferent();
        _org.add_type_str(typ);
        if (typ === "федерация") 
            _org.add_type_str("ассоциация");
        let _name = MiscHelper.get_text_value(t, t11, GetTextAttr.of((GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE.value()) | (GetTextAttr.IGNOREGEOREFERENT.value())));
        if (_name !== null && del_word !== null) {
            if (_name.includes(" " + del_word)) 
                _name = Utils.replaceString(_name, " " + del_word, "");
        }
        if (_name !== null) 
            _name = Utils.replaceString(Utils.replaceString(_name, " РОССИЯ", ""), " РОССИИ", "");
        if (propname !== null) {
            _org.add_name(propname, true, null);
            if (_name !== null) 
                _org.add_type_str(_name.toLowerCase());
        }
        else if (_name !== null) 
            _org.add_name(_name, true, null);
        if (_geo !== null) 
            _org.add_geo_object(_geo);
        _org.add_profile(OrgProfile.SPORT);
        return new ReferentToken(_org, t, t1);
    }
    
    static _init_sport() {
        OrganizationAnalyzer.m_sports = new TerminCollection();
        for (const s of ["акробатика;акробатический;акробат", "бадминтон;бадминтонный;бадминтонист", "баскетбол;баскетбольный;баскетболист", "бейсбол;бейсбольный;бейсболист", "биатлон;биатлонный;биатлонист", "бильярд;бильярдный;бильярдист", "бобслей;бобслейный;бобслеист", "боулинг", "боевое искуство", "бокс;боксерский;боксер", "борьба;борец", "водное поло", "волейбол;волейбольный;волейболист", "гандбол;гандбольный;гандболист", "гольф;гольфный;гольфист", "горнолыжный спорт", "слалом;;слаломист", "сквош", "гребля", "дзюдо;дзюдоистский;дзюдоист", "карате;;каратист", "керлинг;;керлингист", "коньки;конькобежный;конькобежец", "легкая атлетика;легкоатлетический;легкоатлет", "лыжных гонок", "мотоцикл;мотоциклетный;мотоциклист", "тяжелая атлетика;тяжелоатлетический;тяжелоатлет", "ориентирование", "плавание;;пловец", "прыжки", "регби;;регбист", "пятиборье", "гимнастика;гимнастический;гимнаст", "самбо;;самбист", "сумо;;сумист", "сноуборд;сноубордический;сноубордист", "софтбол;софтбольный;софтболист", "стрельба;стрелковый", "спорт;спортивный", "теннис;теннисный;теннисист", "триатлон", "тхэквондо", "ушу;;ушуист", "фехтование;фехтовальный;фехтовальщик", "фигурное катание;;фигурист", "фристайл;фристальный", "футбол;футбольный;футболист", "мини-футбол", "хоккей;хоккейный;хоккеист", "хоккей на траве", "шахматы;шахматный;шахматист", "шашки;шашечный"]) {
            let pp = Utils.splitString(s.toUpperCase(), ';', false);
            let t = new Termin();
            t.init_by_normal_text(pp[0], MorphLang.RU);
            if (pp.length > 1 && !Utils.isNullOrEmpty(pp[1])) 
                t.add_variant(pp[1], true);
            if (pp.length > 2 && !Utils.isNullOrEmpty(pp[2])) 
                t.add_variant(pp[2], true);
            OrganizationAnalyzer.m_sports.add(t);
        }
        for (const s of ["байдарка", "каноэ", "лук", "трава", "коньки", "трамплин", "двоеборье", "батут", "вода", "шпага", "сабля", "лыжи", "скелетон"]) {
            OrganizationAnalyzer.m_sports.add(Termin._new2365(s.toUpperCase(), s));
        }
        OrganizationAnalyzer.m_prop_names = new TerminCollection();
        for (const s of ["СПАРТАК", "ЦСКА", "ЗЕНИТ!", "ТЕРЕК", "КРЫЛЬЯ СОВЕТОВ", "ДИНАМО", "АНЖИ", "КУБАНЬ", "АЛАНИЯ", "ТОРПЕДО", "АРСЕНАЛ!", "ЛОКОМОТИВ", "МЕТАЛЛУРГ!", "РОТОР", "СКА", "СОКОЛ!", "ХИМИК!", "ШИННИК", "РУБИН", "ШАХТЕР", "САЛАВАТ ЮЛАЕВ", "ТРАКТОР!", "АВАНГАРД!", "АВТОМОБИЛИСТ!", "АТЛАНТ!", "ВИТЯЗЬ!", "НАЦИОНАЛЬНАЯ ХОККЕЙНАЯ ЛИГА;НХЛ", "КОНТИНЕНТАЛЬНАЯ ХОККЕЙНАЯ ЛИГА;КХЛ", "СОЮЗ ЕВРОПЕЙСКИХ ФУТБОЛЬНЫХ АССОЦИАЦИЙ;УЕФА;UEFA", "Женская теннисная ассоциация;WTA", "Международная федерация бокса;IBF", "Всемирная боксерская организация;WBO", "РЕАЛ", "МАНЧЕСТЕР ЮНАЙТЕД", "манчестер сити", "БАРСЕЛОНА!", "БАВАРИЯ!", "ЧЕЛСИ", "ЛИВЕРПУЛЬ!", "ЮВЕНТУС", "НАПОЛИ", "БОЛОНЬЯ", "ФУЛХЭМ", "ЭВЕРТОН", "ФИЛАДЕЛЬФИЯ", "ПИТТСБУРГ", "ИНТЕР!", "Аякс", "ФЕРРАРИ;FERRARI", "РЕД БУЛЛ;RED BULL", "МАКЛАРЕН;MCLAREN", "МАКЛАРЕН-МЕРСЕДЕС;MCLAREN-MERCEDES"]) {
            let ss = s.toUpperCase();
            let is_bad = false;
            if (ss.endsWith("!")) {
                is_bad = true;
                ss = ss.substring(0, 0 + ss.length - 1);
            }
            let pp = Utils.splitString(ss, ';', false);
            let t = Termin._new119(pp[0], OrgProfile.SPORT);
            if (!is_bad) 
                t.tag2 = ss;
            if (pp.length > 1) {
                if (pp[1].length < 4) 
                    t.acronym = pp[1];
                else 
                    t.add_variant(pp[1], false);
            }
            OrganizationAnalyzer.m_prop_names.add(t);
        }
        for (const s of ["ИТАР ТАСС;ТАСС;Телеграфное агентство советского союза", "Интерфакс;Interfax", "REGNUM", "ЛЕНТА.РУ;Lenta.ru", "Частный корреспондент;ЧасКор", "РИА Новости;Новости!;АПН", "Росбалт;RosBalt", "УНИАН", "ИНФОРОС;inforos", "Эхо Москвы", "Сноб!", "Серебряный дождь", "Вечерняя Москва;Вечерка", "Московский Комсомолец;Комсомолка", "Коммерсантъ;Коммерсант", "Афиша", "Аргументы и факты;АИФ", "Викиновости", "РосБизнесКонсалтинг;РБК", "Газета.ру", "Русский Репортер!", "Ведомости", "Вести!", "Рамблер Новости", "Живой Журнал;ЖЖ;livejournal;livejournal.ru", "Новый Мир", "Новая газета", "Правда!", "Известия!", "Бизнес!", "Русская жизнь!", "НТВ Плюс", "НТВ", "ВГТРК", "ТНТ", "Муз ТВ;МузТВ", "АСТ", "Эксмо", "Астрель", "Терра!", "Финанс!", "Собеседник!", "Newsru.com", "Nature!", "Россия сегодня;Russia Today;RT!", "БЕЛТА", "Ассошиэйтед Пресс;Associated Press", "France Press;France Presse;Франс пресс;Agence France Presse;AFP", "СИНЬХУА", "Gallup", "Cable News Network;CNN", "CBS News", "ABC News", "GoogleNews;Google News", "FoxNews;Fox News", "Reuters;Рейтер", "British Broadcasting Corporation;BBC;БиБиСи;BBC News", "MSNBC", "Голос Америки", "Аль Джазира;Al Jazeera", "Радио Свобода", "Радио Свободная Европа", "Guardian;Гардиан", "Daily Telegraph", "Times;Таймс!", "Independent!", "Financial Times", "Die Welt", "Bild!", "La Pepublica;Република!", "Le Monde", "People Daily", "BusinessWeek", "Economist!", "Forbes;Форбс", "Los Angeles Times", "New York Times", "Wall Street Journal;WSJ", "Washington Post", "Le Figaro;Фигаро", "Bloomberg", "DELFI!"]) {
            let ss = s.toUpperCase();
            let is_bad = false;
            if (ss.endsWith("!")) {
                is_bad = true;
                ss = ss.substring(0, 0 + ss.length - 1);
            }
            let pp = Utils.splitString(ss, ';', false);
            let t = Termin._new119(pp[0], OrgProfile.MEDIA);
            if (!is_bad) 
                t.tag2 = ss;
            for (let ii = 1; ii < pp.length; ii++) {
                if ((pp[ii].length < 4) && t.acronym === null) 
                    t.acronym = pp[ii];
                else 
                    t.add_variant(pp[ii], false);
            }
            OrganizationAnalyzer.m_prop_names.add(t);
        }
        for (const s of ["Машина времени!", "ДДТ", "Биттлз;Bittles", "ABBA;АББА", "Океан Эльзы;Океан Эльзи", "Аквариум!", "Крематорий!", "Наутилус;Наутилус Помпилиус!", "Пусси Райот;Пусси Риот;Pussy Riot", "Кино!", "Алиса!", "Агата Кристи!", "Чайф", "Ария!", "Земфира!", "Браво!", "Черный кофе!", "Воскресение!", "Урфин Джюс", "Сплин!", "Пикник!", "Мумий Троль", "Коррозия металла", "Арсенал!", "Ночные снайперы!", "Любэ", "Ласковый май!", "Noize MC", "Linkin Park", "ac dc", "green day!", "Pink Floyd;Пинк Флойд", "Depeche Mode", "Bon Jovi", "Nirvana;Нирвана!", "Queen;Квин!", "Nine Inch Nails", "Radioheads", "Pet Shop Boys", "Buggles"]) {
            let ss = s.toUpperCase();
            let is_bad = false;
            if (ss.endsWith("!")) {
                is_bad = true;
                ss = ss.substring(0, 0 + ss.length - 1);
            }
            let pp = Utils.splitString(ss, ';', false);
            let t = Termin._new119(pp[0], OrgProfile.MUSIC);
            if (!is_bad) 
                t.tag2 = ss;
            for (let ii = 1; ii < pp.length; ii++) {
                if ((pp[ii].length < 4) && t.acronym === null) 
                    t.acronym = pp[ii];
                else 
                    t.add_variant(pp[ii], false);
            }
            OrganizationAnalyzer.m_prop_names.add(t);
        }
        OrganizationAnalyzer.m_prop_pref = new TerminCollection();
        for (const s of ["ФАНАТ", "БОЛЕЛЬЩИК", "гонщик", "вратарь", "нападающий", "голкипер", "полузащитник", "полу-защитник", "центрфорвард", "центр-форвард", "форвард", "игрок", "легионер", "спортсмен"]) {
            OrganizationAnalyzer.m_prop_pref.add(Termin._new119(s.toUpperCase(), OrgProfile.SPORT));
        }
        for (const s of ["защитник", "капитан", "пилот", "игра", "поле", "стадион", "гонка", "чемпионат", "турнир", "заезд", "матч", "кубок", "олипмиада", "финал", "полуфинал", "победа", "поражение", "разгром", "дивизион", "олипмиада", "финал", "полуфинал", "играть", "выигрывать", "выиграть", "проигрывать", "проиграть", "съиграть"]) {
            OrganizationAnalyzer.m_prop_pref.add(Termin._new121(s.toUpperCase(), OrgProfile.SPORT, s));
        }
        for (const s of ["корреспондент", "фотокорреспондент", "репортер", "журналист", "тележурналист", "телеоператор", "главный редактор", "главред", "телеведущий", "редколлегия", "обозреватель", "сообщать", "сообщить", "передавать", "передать", "писать", "написать", "издавать", "пояснить", "пояснять", "разъяснить", "разъяснять", "сказать", "говорить", "спрашивать", "спросить", "отвечать", "ответить", "выяснять", "выяснить", "цитировать", "процитировать", "рассказать", "рассказывать", "информировать", "проинформировать", "поведать", "напечатать", "напоминать", "напомнить", "узнать", "узнавать", "репортаж", "интервью", "информации", "сведение", "ИА", "информагенство", "информагентство", "информационный", "газета", "журнал"]) {
            OrganizationAnalyzer.m_prop_pref.add(Termin._new119(s.toUpperCase(), OrgProfile.MEDIA));
        }
        for (const s of ["сообщение", "статья", "номер", "журнал", "издание", "издательство", "агентство", "цитата", "редактор", "комментатор", "по данным", "оператор", "вышедший", "отчет", "вопрос", "читатель", "слушатель", "телезритель", "источник", "собеедник"]) {
            OrganizationAnalyzer.m_prop_pref.add(Termin._new121(s.toUpperCase(), OrgProfile.MEDIA, s));
        }
        for (const s of ["музыкант", "певец", "певица", "ударник", "гитарист", "клавишник", "солист", "солистка", "исполнитель", "исполнительница", "исполнять", "исполнить", "концерт", "гастроль", "выступление", "известный", "известнейший", "популярный", "популярнейший", "рокгруппа", "панкгруппа", "группа", "альбом", "пластинка", "грампластинка", "концертный", "музыка", "песня", "сингл", "хит", "суперхит", "запись", "студия"]) {
            OrganizationAnalyzer.m_prop_pref.add(Termin._new119(s.toUpperCase(), OrgProfile.MEDIA));
        }
    }
    
    try_attach_army(t, ad) {
        if (!((t instanceof NumberToken)) || t.whitespaces_after_count > 2) 
            return null;
        let typ = OrgItemTypeToken.try_attach(t.next, true, ad);
        if (typ === null) 
            return null;
        if (typ.root !== null && typ.root.profiles.includes(OrgProfile.ARMY)) {
            let rt = this.try_attach_org(t.next, ad, OrganizationAnalyzerAttachType.HIGH, null, false, 0, -1);
            if (rt !== null) {
                if (rt.begin_token === typ.begin_token) {
                    rt.begin_token = t;
                    (rt.referent).number = (t).value.toString();
                }
                return rt;
            }
            let _org = new OrganizationReferent();
            _org.add_type(typ, true);
            _org.number = (t).value.toString();
            return new ReferentToken(_org, t, typ.end_token);
        }
        return null;
    }
    
    try_attach_politic_party(t, ad, only_abbrs = false) {
        if (!((t instanceof TextToken))) 
            return null;
        let name_tok = null;
        let root = null;
        let prev_toks = null;
        let prev_words = 0;
        let _geo = null;
        let t0 = t;
        let t1 = t;
        let coef = 0;
        let words_after = 0;
        let is_fraction = false;
        let is_politic = false;
        for (; t !== null; t = t.next) {
            if (t !== t0 && t.is_newline_before) 
                break;
            if (only_abbrs) 
                break;
            if (t.is_hiphen) {
                if (prev_toks === null) 
                    return null;
                continue;
            }
            let tokn = OrganizationAnalyzer.m_politic_names.try_parse(t, TerminParseAttr.NO);
            if (tokn !== null) {
                if (!t.chars.is_all_lower) 
                    break;
                t1 = tokn.end_token;
            }
            let tok = OrganizationAnalyzer.m_politic_prefs.try_parse(t, TerminParseAttr.NO);
            if (tok === null) {
                if (t.morph.class0.is_adjective) {
                    let rt = t.kit.process_referent("GEO", t);
                    if (rt !== null) {
                        _geo = rt;
                        t1 = (t = rt.end_token);
                        coef += 0.5;
                        continue;
                    }
                }
                if (t.end_char < t1.end_char) 
                    continue;
                break;
            }
            if (tok.termin.tag !== null && tok.termin.tag2 !== null) {
                if (t.end_char < t1.end_char) 
                    continue;
                break;
            }
            if (tok.termin.tag === null && tok.termin.tag2 === null) 
                is_politic = true;
            if (prev_toks === null) 
                prev_toks = new Array();
            prev_toks.push(tok);
            if (tok.termin.tag === null) {
                coef += (1);
                prev_words++;
            }
            else if (tok.morph.class0.is_adjective) 
                coef += 0.5;
            t = tok.end_token;
            if (t.end_char > t1.end_char) 
                t1 = t;
        }
        if (t === null) 
            return null;
        if (t.is_value("ПАРТИЯ", null) || t.is_value("ФРОНТ", null) || t.is_value("ГРУППИРОВКА", null)) {
            if (!t.is_value("ПАРТИЯ", null)) 
                is_politic = true;
            root = t;
            coef += 0.5;
            if (t.chars.is_capital_upper && !MiscHelper.can_be_start_of_sentence(t)) 
                coef += 0.5;
            t1 = t;
            t = t.next;
        }
        else if (t.is_value("ФРАКЦИЯ", null)) {
            root = (t1 = t);
            is_fraction = true;
            if (t.next !== null && (t.next.get_referent() instanceof OrganizationReferent)) 
                coef += (2);
            else 
                return null;
        }
        let br = null;
        if ((((name_tok = OrganizationAnalyzer.m_politic_names.try_parse(t, TerminParseAttr.NO)))) !== null && !t.chars.is_all_lower) {
            coef += 0.5;
            is_politic = true;
            if (!t.chars.is_all_lower) 
                coef += 0.5;
            if (name_tok.length_char > 10) 
                coef += 0.5;
            else if (t.chars.is_all_upper) 
                coef += 0.5;
            t1 = name_tok.end_token;
            t = t1.next;
        }
        else if ((((br = BracketHelper.try_parse(t, BracketParseAttr.NO, 10)))) !== null) {
            if (!BracketHelper.can_be_start_of_sequence(t, true, false)) 
                return null;
            if ((((name_tok = OrganizationAnalyzer.m_politic_names.try_parse(t.next, TerminParseAttr.NO)))) !== null) 
                coef += 1.5;
            else if (only_abbrs) 
                return null;
            else if (t.next !== null && t.next.is_value("О", null)) 
                return null;
            else 
                for (let tt = t.next; tt !== null && tt.end_char <= br.end_char; tt = tt.next) {
                    let tok2 = OrganizationAnalyzer.m_politic_prefs.try_parse(tt, TerminParseAttr.NO);
                    if (tok2 !== null && tok2.termin.tag === null) {
                        if (tok2.termin.tag2 === null) 
                            is_politic = true;
                        coef += 0.5;
                        words_after++;
                    }
                    else if (OrganizationAnalyzer.m_politic_suffs.try_parse(tt, TerminParseAttr.NO) !== null) {
                        coef += 0.5;
                        words_after++;
                    }
                    else if (tt.get_referent() instanceof GeoReferent) 
                        coef += 0.5;
                    else if (tt instanceof ReferentToken) {
                        coef = 0;
                        break;
                    }
                    else {
                        let mc = tt.get_morph_class_in_dictionary();
                        if ((MorphClass.ooEq(mc, MorphClass.VERB) || MorphClass.ooEq(mc, MorphClass.ADVERB) || mc.is_pronoun) || mc.is_personal_pronoun) {
                            coef = 0;
                            break;
                        }
                        if (mc.is_noun || mc.is_undefined) 
                            coef -= 0.5;
                    }
                }
            t1 = br.end_token;
            t = t1.next;
        }
        else if (only_abbrs) 
            return null;
        else if (root !== null) {
            for (let tt = t; tt !== null; tt = tt.next) {
                if (tt.get_referent() instanceof GeoReferent) 
                    break;
                if (tt.whitespaces_before_count > 2) 
                    break;
                if (tt.morph.class0.is_preposition) {
                    if (tt !== root.next) 
                        break;
                    continue;
                }
                if (tt.is_and) {
                    let npt2 = NounPhraseHelper.try_parse(tt.next, NounPhraseParseAttr.REFERENTCANBENOUN, 0, null);
                    if (npt2 !== null && OrganizationAnalyzer.m_politic_suffs.try_parse(npt2.end_token, TerminParseAttr.NO) !== null && CharsInfo.ooEq(npt2.end_token.chars, tt.previous.chars)) 
                        continue;
                    break;
                }
                let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.REFERENTCANBENOUN, 0, null);
                if (npt === null) 
                    break;
                if (npt.noun.is_value("ПАРТИЯ", null) || npt.noun.is_value("ФРОНТ", null)) 
                    break;
                let co = 0;
                for (let ttt = tt; ttt !== null && ttt.end_char <= npt.end_char; ttt = ttt.next) {
                    let tok2 = OrganizationAnalyzer.m_politic_prefs.try_parse(ttt, TerminParseAttr.NO);
                    if (tok2 !== null && tok2.termin.tag === null) {
                        if (tok2.termin.tag2 === null) 
                            is_politic = true;
                        co += 0.5;
                        words_after++;
                    }
                    else if (OrganizationAnalyzer.m_politic_suffs.try_parse(ttt, TerminParseAttr.NO) !== null) {
                        co += 0.5;
                        words_after++;
                    }
                    else if (ttt.get_referent() instanceof GeoReferent) 
                        co += 0.5;
                }
                if (co === 0) {
                    if (!npt.morph._case.is_genitive) 
                        break;
                    let last_suf = OrganizationAnalyzer.m_politic_suffs.try_parse(tt.previous, TerminParseAttr.NO);
                    if (((words_after > 0 && CharsInfo.ooEq(npt.end_token.chars, tt.previous.chars))) || ((last_suf !== null && last_suf.termin.tag !== null)) || ((tt.previous === root && npt.end_token.chars.is_all_lower && npt.morph.number === MorphNumber.PLURAL) && root.chars.is_capital_upper)) {
                        let pp = tt.kit.process_referent("PERSON", tt);
                        if (pp !== null) 
                            break;
                        words_after++;
                    }
                    else 
                        break;
                }
                t1 = (tt = npt.end_token);
                t = t1.next;
                coef += co;
            }
        }
        if (t !== null && (t.get_referent() instanceof GeoReferent) && (t.whitespaces_before_count < 3)) {
            t1 = t;
            coef += 0.5;
        }
        for (let tt = t0.previous; tt !== null; tt = tt.previous) {
            if (!((tt instanceof TextToken))) {
                let org1 = Utils.as(tt.get_referent(), OrganizationReferent);
                if (org1 !== null && org1.contains_profile(OrgProfile.POLICY)) 
                    coef += 0.5;
                continue;
            }
            if (!tt.chars.is_letter) 
                continue;
            if (tt.morph.class0.is_preposition || tt.morph.class0.is_conjunction) 
                continue;
            if (OrganizationAnalyzer.m_politic_prefs.try_parse(tt, TerminParseAttr.NO) !== null) {
                coef += 0.5;
                if (tt.is_value("ФРАКЦИЯ", null)) 
                    coef += 0.5;
            }
            else 
                break;
        }
        if (coef < 1) 
            return null;{
                if (root === null) {
                    if (name_tok === null && br === null) 
                        return null;
                }
                else if ((name_tok === null && words_after === 0 && br === null) && !is_fraction) {
                    if ((coef < 2) || prev_words === 0) 
                        return null;
                }
            }
        let _org = new OrganizationReferent();
        if (br !== null && name_tok !== null && (name_tok.end_char < br.end_token.previous.end_char)) 
            name_tok = null;
        if (name_tok !== null) 
            is_politic = true;
        if (is_fraction) {
            _org.add_profile(OrgProfile.POLICY);
            _org.add_profile(OrgProfile.UNIT);
        }
        else if (is_politic) {
            _org.add_profile(OrgProfile.POLICY);
            _org.add_profile(OrgProfile.UNION);
        }
        else 
            _org.add_profile(OrgProfile.UNION);
        if (name_tok !== null) {
            is_politic = true;
            _org.add_name(name_tok.termin.canonic_text, true, null);
            if (name_tok.termin.additional_vars !== null) {
                for (const v of name_tok.termin.additional_vars) {
                    _org.add_name(v.canonic_text, true, null);
                }
            }
            if (name_tok.termin.acronym !== null) {
                let geo1 = Utils.as(name_tok.termin.tag, GeoReferent);
                if (geo1 === null) 
                    _org.add_name(name_tok.termin.acronym, true, null);
                else if (_geo !== null) {
                    if (geo1.can_be_equals(_geo.referent, ReferentEqualType.WITHINONETEXT)) 
                        _org.add_name(name_tok.termin.acronym, true, null);
                }
                else if (t1.get_referent() instanceof GeoReferent) {
                    if (geo1.can_be_equals(t1.get_referent(), ReferentEqualType.WITHINONETEXT)) 
                        _org.add_name(name_tok.termin.acronym, true, null);
                }
                else if (name_tok.begin_token === name_tok.end_token && name_tok.begin_token.is_value(name_tok.termin.acronym, null)) {
                    _org.add_name(name_tok.termin.acronym, true, null);
                    let rtg = new ReferentToken(geo1.clone(), name_tok.begin_token, name_tok.end_token);
                    rtg.set_default_local_onto(t0.kit.processor);
                    _org.add_geo_object(rtg);
                }
            }
        }
        else if (br !== null) {
            let nam = MiscHelper.get_text_value(br.begin_token, br.end_token, GetTextAttr.NO);
            _org.add_name(nam, true, null);
            if (root === null) {
                let nam2 = MiscHelper.get_text_value(br.begin_token, br.end_token, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
                if (nam2 !== nam) 
                    _org.add_name(nam, true, null);
            }
        }
        if (root !== null) {
            let typ1 = root;
            if (_geo !== null) 
                typ1 = _geo.begin_token;
            if (prev_toks !== null) {
                for (const p of prev_toks) {
                    if (p.termin.tag === null) {
                        if (p.begin_char < typ1.begin_char) 
                            typ1 = p.begin_token;
                        break;
                    }
                }
            }
            let typ = MiscHelper.get_text_value(typ1, root, GetTextAttr.FIRSTNOUNGROUPTONOMINATIVE);
            if (typ !== null) {
                if (br === null) {
                    let nam = null;
                    let t2 = t1;
                    if (t2.get_referent() instanceof GeoReferent) 
                        t2 = t2.previous;
                    if (t2.end_char > root.end_char) {
                        nam = (typ + " " + MiscHelper.get_text_value(root.next, t2, GetTextAttr.NO));
                        _org.add_name(nam, true, null);
                    }
                }
                if (_org.names.length === 0 && typ1 !== root) 
                    _org.add_name(typ, true, null);
                else 
                    _org.add_type_str(typ.toLowerCase());
            }
            if (is_fraction && (t1.next instanceof ReferentToken)) {
                _org.add_type_str("фракция");
                t1 = t1.next;
                _org.higher = Utils.as(t1.get_referent(), OrganizationReferent);
                if (t1.next !== null && t1.next.is_value("В", null) && (t1.next.next instanceof ReferentToken)) {
                    let oo = Utils.as(t1.next.next.get_referent(), OrganizationReferent);
                    if (oo !== null && oo.kind === OrganizationKind.GOVENMENT) {
                        t1 = t1.next.next;
                        _org.add_slot(OrganizationReferent.ATTR_MISC, oo, false, 0);
                    }
                    else if (t1.next.next.get_referent() instanceof GeoReferent) {
                        t1 = t1.next.next;
                        _org.add_slot(OrganizationReferent.ATTR_MISC, t1.get_referent(), false, 0);
                    }
                }
            }
        }
        if (_geo !== null) 
            _org.add_geo_object(_geo);
        else if (t1.get_referent() instanceof GeoReferent) 
            _org.add_geo_object(t1.get_referent());
        return new ReferentToken(_org, t0, t1);
    }
    
    static _init_politic() {
        OrganizationAnalyzer.m_politic_prefs = new TerminCollection();
        for (const s of ["либеральный", "либерал", "лейбористский", "демократический", "коммунистрический", "большевистский", "социальный", "социал", "национал", "националистическая", "свободный", "радикальный", "леворадикальный", "радикал", "революционная", "левый", "правый", "социалистический", "рабочий", "трудовой", "республиканский", "народный", "аграрный", "монархический", "анархический", "прогрессивый", "прогрессистский", "консервативный", "гражданский", "фашистский", "марксистский", "ленинский", "маоистский", "имперский", "славянский", "анархический", "баскский", "конституционный", "пиратский", "патриотический", "русский"]) {
            OrganizationAnalyzer.m_politic_prefs.add(new Termin(s.toUpperCase()));
        }
        for (const s of ["объединенный", "всероссийский", "общероссийский", "христианский", "независимый", "альтернативный"]) {
            OrganizationAnalyzer.m_politic_prefs.add(Termin._new2365(s.toUpperCase(), s));
        }
        for (const s of ["политический", "правящий", "оппозиционный", "запрешенный", "террористический", "запрещенный", "экстремистский"]) {
            OrganizationAnalyzer.m_politic_prefs.add(Termin._new119(s.toUpperCase(), s));
        }
        for (const s of ["активист", "член", "руководство", "лидер", "глава", "демонстрация", "фракция", "съезд", "пленум", "террорист", "парламент", "депутат", "парламентарий", "оппозиция", "дума", "рада"]) {
            OrganizationAnalyzer.m_politic_prefs.add(Termin._new121(s.toUpperCase(), s, s));
        }
        OrganizationAnalyzer.m_politic_suffs = new TerminCollection();
        for (const s of ["коммунист", "социалист", "либерал", "республиканец", "националист", "радикал", "лейборист", "анархист", "патриот", "консерватор", "левый", "правый", "новый", "зеленые", "демократ", "фашист", "защитник", "труд", "равенство", "прогресс", "жизнь", "мир", "родина", "отечество", "отчизна", "республика", "революция", "революционер", "народовластие", "фронт", "сила", "платформа", "воля", "справедливость", "преображение", "преобразование", "солидарность", "управление", "демократия", "народ", "гражданин", "предприниматель", "предпринимательство", "бизнес", "пенсионер", "христианин"]) {
            OrganizationAnalyzer.m_politic_suffs.add(new Termin(s.toUpperCase()));
        }
        for (const s of ["реформа", "свобода", "единство", "развитие", "освобождение", "любитель", "поддержка", "возрождение", "независимость"]) {
            OrganizationAnalyzer.m_politic_suffs.add(Termin._new119(s.toUpperCase(), s));
        }
        OrganizationAnalyzer.m_politic_names = new TerminCollection();
        for (const s of ["Республиканская партия", "Демократическая партия;Демпартия", "Христианско демократический союз;ХДС", "Свободная демократическая партия;СвДП", "ЯБЛОКО", "ПАРНАС", "ПАМЯТЬ", "Движение против нелегальной иммиграции;ДПНИ", "НАЦИОНАЛ БОЛЬШЕВИСТСКАЯ ПАРТИЯ;НБП", "НАЦИОНАЛЬНЫЙ ФРОНТ;НАЦФРОНТ", "Национальный патриотический фронт;НПФ", "Батькивщина;Батькiвщина", "НАРОДНАЯ САМООБОРОНА", "Гражданская платформа", "Народная воля", "Славянский союз", "ПРАВЫЙ СЕКТОР", "ПЕГИДА;PEGIDA", "Венгерский гражданский союз;ФИДЕС", "БЛОК ЮЛИИ ТИМОШЕНКО;БЮТ", "Аль Каида;Аль Каеда;Аль Кайда;Al Qaeda;Al Qaida", "Талибан;движение талибан", "Бригады мученников Аль Аксы", "Хезболла;Хезбалла;Хизбалла", "Народный фронт освобождения палестины;НФОП", "Организация освобождения палестины;ООП", "Союз исламского джихада;Исламский джихад", "Аль-Джихад;Египетский исламский джихад", "Братья-мусульмане;Аль Ихван альМуслимун", "ХАМАС", "Движение за освобождение Палестины;ФАТХ", "Фронт Аль Нусра;Аль Нусра", "Джабхат ан Нусра"]) {
            let pp = Utils.splitString(s.toUpperCase(), ';', false);
            let t = Termin._new119(pp[0], OrgProfile.POLICY);
            for (let i = 0; i < pp.length; i++) {
                if ((pp[i].length < 5) && t.acronym === null) {
                    t.acronym = pp[i];
                    if (t.acronym.endsWith("Р") || t.acronym.endsWith("РФ")) 
                        t.tag = MiscLocationHelper.get_geo_referent_by_name("RU");
                    else if (t.acronym.endsWith("У")) 
                        t.tag = MiscLocationHelper.get_geo_referent_by_name("UA");
                    else if (t.acronym.endsWith("СС")) 
                        t.tag = MiscLocationHelper.get_geo_referent_by_name("СССР");
                }
                else 
                    t.add_variant(pp[i], false);
            }
            OrganizationAnalyzer.m_politic_names.add(t);
        }
    }
    
    static static_constructor() {
        OrganizationAnalyzer.ANALYZER_NAME = "ORGANIZATION";
        OrganizationAnalyzer.geoname = "GEO";
        OrganizationAnalyzer.m_inited = false;
        OrganizationAnalyzer.max_org_name = 200;
        OrganizationAnalyzer.m_sports = null;
        OrganizationAnalyzer.m_prop_names = null;
        OrganizationAnalyzer.m_prop_pref = null;
        OrganizationAnalyzer.m_politic_prefs = null;
        OrganizationAnalyzer.m_politic_suffs = null;
        OrganizationAnalyzer.m_politic_names = null;
    }
}


OrganizationAnalyzer.OrgAnalyzerData = class  extends AnalyzerDataWithOntology {
    
    constructor() {
        const TerminCollection = require("./../core/TerminCollection");
        const IntOntologyCollection = require("./../core/IntOntologyCollection");
        super();
        this.loc_orgs = new IntOntologyCollection();
        this.org_pure_names = new TerminCollection();
        this.aliases = new TerminCollection();
        this.large_text_regim = false;
    }
    
    register_referent(referent) {
        const Termin = require("./../core/Termin");
        const OrganizationReferent = require("./OrganizationReferent");
        if (referent instanceof OrganizationReferent) 
            (referent).final_correction();
        let slots = referent.slots.length;
        let res = super.register_referent(referent);
        if (!this.large_text_regim && (res instanceof OrganizationReferent) && ((res === referent || res.slots.length !== slots))) {
            let ioi = (res).create_ontology_item_ex(2, true, false);
            if (ioi !== null) 
                this.loc_orgs.add_item(ioi);
            let names = (res)._get_pure_names();
            if (names !== null) {
                for (const n of names) {
                    this.org_pure_names.add(new Termin(n));
                }
            }
        }
        return res;
    }
}


OrganizationAnalyzer.static_constructor();

module.exports = OrganizationAnalyzer