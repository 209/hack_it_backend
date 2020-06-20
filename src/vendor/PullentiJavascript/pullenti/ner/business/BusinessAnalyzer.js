/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");

const DateReferent = require("./../date/DateReferent");
const DateRangeReferent = require("./../date/DateRangeReferent");
const MorphGender = require("./../../morph/MorphGender");
const BusinessFactKind = require("./BusinessFactKind");
const Token = require("./../Token");
const TextToken = require("./../TextToken");
const BracketParseAttr = require("./../core/BracketParseAttr");
const FundsItemTyp = require("./internal/FundsItemTyp");
const MoneyReferent = require("./../money/MoneyReferent");
const PersonReferent = require("./../person/PersonReferent");
const ReferentToken = require("./../ReferentToken");
const BusinessFactItemTyp = require("./internal/BusinessFactItemTyp");
const BracketHelper = require("./../core/BracketHelper");
const OrganizationAnalyzer = require("./../org/OrganizationAnalyzer");
const NumberToken = require("./../NumberToken");
const FundsMeta = require("./internal/FundsMeta");
const Referent = require("./../Referent");
const Termin = require("./../core/Termin");
const ProcessorService = require("./../ProcessorService");
const MetaBusinessFact = require("./internal/MetaBusinessFact");
const EpNerCoreInternalResourceHelper = require("./../core/internal/EpNerCoreInternalResourceHelper");
const MetaToken = require("./../MetaToken");
const FundsItemToken = require("./internal/FundsItemToken");
const BusinessFactItem = require("./internal/BusinessFactItem");
const Analyzer = require("./../Analyzer");
const BusinessFactReferent = require("./BusinessFactReferent");
const OrganizationReferent = require("./../org/OrganizationReferent");
const FundsReferent = require("./FundsReferent");

/**
 * Анализатор для бизнес-фактов
 */
class BusinessAnalyzer extends Analyzer {
    
    get name() {
        return BusinessAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Бизнес-объекты";
    }
    
    get description() {
        return "Бизнес факты";
    }
    
    get is_specific() {
        return true;
    }
    
    clone() {
        return new BusinessAnalyzer();
    }
    
    get type_system() {
        return [MetaBusinessFact.GLOBAL_META, FundsMeta.GLOBAL_META];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaBusinessFact.IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("businessfact.png"));
        res.put(FundsMeta.IMAGE_ID, EpNerCoreInternalResourceHelper.get_bytes("creditcards.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === BusinessFactReferent.OBJ_TYPENAME) 
            return new BusinessFactReferent();
        if (type === FundsReferent.OBJ_TYPENAME) 
            return new FundsReferent();
        return null;
    }
    
    get progress_weight() {
        return 1;
    }
    
    process(kit) {
        let ad = kit.get_analyzer_data(this);
        for (let t = kit.first_token; t !== null; t = t.next) {
            let rt = FundsItemToken.try_attach(t);
            if (rt !== null) {
                rt.referent = ad.register_referent(rt.referent);
                kit.embed_token(rt);
                t = rt;
            }
        }
        for (let t = kit.first_token; t !== null; t = t.next) {
            let rt = this.analize_fact(t);
            if (rt !== null) {
                rt.referent = ad.register_referent(rt.referent);
                kit.embed_token(rt);
                t = rt;
                let rts = this._analize_likelihoods(rt);
                if (rts !== null) {
                    for (const rt0 of rts) {
                        for (const s of rt0.referent.slots) {
                            if (s.type_name === BusinessFactReferent.ATTR_WHAT && (s.value instanceof FundsReferent)) 
                                rt0.referent.upload_slot(s, ad.register_referent(Utils.as(s.value, Referent)));
                        }
                        rt0.referent = ad.register_referent(rt0.referent);
                        kit.embed_token(rt0);
                        t = rt0;
                    }
                }
                continue;
            }
        }
    }
    
    analize_fact(t) {
        if (t === null) 
            return null;
        let bfi = BusinessFactItem.try_parse(t);
        if (bfi === null) 
            return null;
        if (bfi.typ === BusinessFactItemTyp.BASE) {
            if (bfi.base_kind === BusinessFactKind.GET || bfi.base_kind === BusinessFactKind.SELL) 
                return this._analize_get(bfi);
            if (bfi.base_kind === BusinessFactKind.HAVE) {
                if (bfi.is_base_passive || bfi.morph.class0.is_noun) {
                    let re = this._analize_have(bfi);
                    if (re !== null) 
                        return re;
                }
                return this._analize_get(bfi);
            }
            if (bfi.base_kind === BusinessFactKind.PROFIT || bfi.base_kind === BusinessFactKind.DAMAGES) 
                return this._analize_profit(bfi);
            if (bfi.base_kind === BusinessFactKind.AGREEMENT || bfi.base_kind === BusinessFactKind.LAWSUIT) 
                return this._analize_agreement(bfi);
            if (bfi.base_kind === BusinessFactKind.SUBSIDIARY) 
                return this._analize_subsidiary(bfi);
            if (bfi.base_kind === BusinessFactKind.FINANCE) 
                return this._analize_finance(bfi);
        }
        return null;
    }
    
    _find_ref_before(t) {
        if (t === null) 
            return null;
        let points = 0;
        let t0 = null;
        let t1 = t;
        for (; t !== null; t = t.previous) {
            if (t.is_newline_after) 
                break;
            if (t.morph.class0.is_adverb || t.morph.class0.is_preposition || t.is_comma) 
                continue;
            if (t.morph.class0.is_personal_pronoun) 
                break;
            if (t.is_value("ИНФОРМАЦИЯ", null) || t.is_value("ДАННЫЕ", null)) 
                continue;
            if (t.is_value("ІНФОРМАЦІЯ", null) || t.is_value("ДАНІ", null)) 
                continue;
            if (t instanceof TextToken) {
                if (t.morph.class0.is_verb) 
                    break;
                if (t.is_char('.')) 
                    break;
                continue;
            }
            let r = t.get_referent();
            if ((r instanceof DateReferent) || (r instanceof DateRangeReferent)) 
                continue;
            break;
        }
        if (t === null) 
            return null;
        if (t.morph.class0.is_personal_pronoun) {
            t0 = t;
            points = 1;
            t = t.previous;
        }
        else {
            if (t.morph.class0.is_pronoun) {
                t = t.previous;
                if (t !== null && t.is_char(',')) 
                    t = t.previous;
            }
            if (t === null) 
                return null;
            let refs = t.get_referents();
            if (refs !== null) {
                for (const r of refs) {
                    if ((r instanceof PersonReferent) || (r instanceof OrganizationReferent) || (r instanceof FundsReferent)) 
                        return new ReferentToken(r, t, t1);
                }
            }
            return null;
        }
        for (; t !== null; t = t.previous) {
            if (t.is_char('.')) {
                if ((--points) < 0) 
                    break;
                continue;
            }
            let refs = t.get_referents();
            if (refs !== null) {
                for (const r of refs) {
                    if ((r instanceof PersonReferent) || (r instanceof OrganizationReferent)) 
                        return new ReferentToken(r, t0, t1);
                }
            }
        }
        return null;
    }
    
    _find_sec_ref_before(rt) {
        let t = (rt === null ? null : rt.begin_token.previous);
        if (t === null || t.whitespaces_after_count > 2) 
            return null;
        if ((rt.get_referent() instanceof PersonReferent) && (t.get_referent() instanceof OrganizationReferent)) 
            return Utils.as(t, ReferentToken);
        return null;
    }
    
    _find_date(bfr, t) {
        for (let tt = t; tt !== null; tt = tt.previous) {
            let r = tt.get_referent();
            if ((r instanceof DateReferent) || (r instanceof DateRangeReferent)) {
                bfr.when = r;
                return true;
            }
            if (tt.is_char('.')) 
                break;
            if (tt.is_newline_before) 
                break;
        }
        for (let tt = t; tt !== null; tt = tt.next) {
            if (tt !== t && tt.is_newline_before) 
                break;
            let r = tt.get_referent();
            if ((r instanceof DateReferent) || (r instanceof DateRangeReferent)) {
                bfr.when = r;
                return true;
            }
            if (tt.is_char('.')) 
                break;
        }
        return false;
    }
    
    _find_sum(bfr, t) {
        for (; t !== null; t = t.next) {
            if (t.is_char('.') || t.is_newline_before) 
                break;
            let r = t.get_referent();
            if (r instanceof MoneyReferent) {
                let fu = Utils.as(bfr.get_slot_value(BusinessFactReferent.ATTR_WHAT), FundsReferent);
                if (fu !== null) {
                    if (fu.sum === null) {
                        fu.sum = Utils.as(r, MoneyReferent);
                        return true;
                    }
                }
                bfr.add_slot(BusinessFactReferent.ATTR_MISC, r, false, 0);
                return true;
            }
        }
        return false;
    }
    
    _analize_get(bfi) {
        let bef = this._find_ref_before(bfi.begin_token.previous);
        if (bef === null) 
            return null;
        let t1 = bfi.end_token.next;
        if (t1 === null) 
            return null;
        for (; t1 !== null; t1 = t1.next) {
            if (t1.morph.class0.is_adverb) 
                continue;
            if (t1.is_value("ПРАВО", null) || t1.is_value("РАСПОРЯЖАТЬСЯ", null) || t1.is_value("РОЗПОРЯДЖАТИСЯ", null)) 
                continue;
            break;
        }
        if (t1 === null) 
            return null;
        if ((t1.get_referent() instanceof FundsReferent) && !((bef.referent instanceof FundsReferent))) {
            let fr = Utils.as(t1.get_referent(), FundsReferent);
            let bfr = BusinessFactReferent._new437(bfi.base_kind);
            bfr.who = bef.referent;
            let bef2 = this._find_sec_ref_before(bef);
            if (bef2 !== null) {
                bfr.add_slot(BusinessFactReferent.ATTR_WHO, bef2.referent, false, 0);
                bef = bef2;
            }
            if (fr.source === bef.referent && bef2 === null) {
                bef2 = this._find_ref_before(bef.begin_token.previous);
                if (bef2 !== null) {
                    bef = bef2;
                    bfr.who = bef.referent;
                }
            }
            if (fr.source === bef.referent) {
                let cou = 0;
                for (let tt = bef.begin_token.previous; tt !== null; tt = tt.previous) {
                    if ((++cou) > 100) 
                        break;
                    let refs = tt.get_referents();
                    if (refs === null) 
                        continue;
                    for (const r of refs) {
                        if ((r instanceof OrganizationReferent) && r !== bef.referent) {
                            cou = 1000;
                            fr.source = Utils.as(r, OrganizationReferent);
                            break;
                        }
                    }
                }
            }
            bfr.add_what(fr);
            bfr.typ = (bfi.base_kind === BusinessFactKind.GET ? "покупка ценных бумаг" : ((bfi.base_kind === BusinessFactKind.SELL ? "продажа ценных бумаг" : "владение ценными бумагами")));
            this._find_date(bfr, bef.begin_token);
            this._find_sum(bfr, bef.end_token);
            return new ReferentToken(bfr, bef.begin_token, t1);
        }
        if ((bfi.morph.class0.is_noun && ((bfi.base_kind === BusinessFactKind.GET || bfi.base_kind === BusinessFactKind.SELL)) && (t1.get_referent() instanceof OrganizationReferent)) || (t1.get_referent() instanceof PersonReferent)) {
            if ((bef.referent instanceof FundsReferent) || (bef.referent instanceof OrganizationReferent)) {
                let bfr = BusinessFactReferent._new437(bfi.base_kind);
                if (bfi.base_kind === BusinessFactKind.GET) 
                    bfr.typ = (bef.referent instanceof FundsReferent ? "покупка ценных бумаг" : "покупка компании");
                else if (bfi.base_kind === BusinessFactKind.SELL) 
                    bfr.typ = (bef.referent instanceof FundsReferent ? "продажа ценных бумаг" : "продажа компании");
                bfr.who = t1.get_referent();
                bfr.add_what(bef.referent);
                this._find_date(bfr, bef.begin_token);
                this._find_sum(bfr, bef.end_token);
                t1 = BusinessAnalyzer._add_whos_list(t1, bfr);
                return new ReferentToken(bfr, bef.begin_token, t1);
            }
        }
        if ((bef.referent instanceof OrganizationReferent) || (bef.referent instanceof PersonReferent)) {
            let tt = t1;
            if (tt !== null && tt.morph.class0.is_preposition) 
                tt = tt.next;
            let slav = (tt === null ? null : tt.get_referent());
            if ((((slav instanceof PersonReferent) || (slav instanceof OrganizationReferent))) && tt.next !== null && (tt.next.get_referent() instanceof FundsReferent)) {
                let bfr = BusinessFactReferent._new437(bfi.base_kind);
                bfr.typ = (bfi.base_kind === BusinessFactKind.GET ? "покупка ценных бумаг" : "продажа ценных бумаг");
                bfr.who = bef.referent;
                let bef2 = this._find_sec_ref_before(bef);
                if (bef2 !== null) {
                    bfr.add_slot(BusinessFactReferent.ATTR_WHO, bef2.referent, false, 0);
                    bef = bef2;
                }
                bfr.whom = slav;
                bfr.add_what(tt.next.get_referent());
                this._find_date(bfr, bef.begin_token);
                this._find_sum(bfr, bef.end_token);
                return new ReferentToken(bfr, bef.begin_token, tt.next);
            }
            else if (slav instanceof OrganizationReferent) {
                let bfr = BusinessFactReferent._new437(bfi.base_kind);
                bfr.typ = (bfi.base_kind === BusinessFactKind.GET ? "покупка компании" : "продажа компании");
                bfr.who = bef.referent;
                let bef2 = this._find_sec_ref_before(bef);
                if (bef2 !== null) {
                    bfr.add_slot(BusinessFactReferent.ATTR_WHO, bef2.referent, false, 0);
                    bef = bef2;
                }
                bfr.add_what(slav);
                this._find_date(bfr, bef.begin_token);
                this._find_sum(bfr, bef.end_token);
                return new ReferentToken(bfr, bef.begin_token, tt.next);
            }
        }
        if ((bef.referent instanceof FundsReferent) && (((t1.get_referent() instanceof OrganizationReferent) || (t1.get_referent() instanceof PersonReferent)))) {
            let bfr = BusinessFactReferent._new437(bfi.base_kind);
            bfr.typ = (bfi.base_kind === BusinessFactKind.GET ? "покупка ценных бумаг" : ((bfi.base_kind === BusinessFactKind.SELL ? "продажа ценных бумаг" : "владение ценными бумагами")));
            bfr.who = t1.get_referent();
            bfr.add_what(bef.referent);
            this._find_date(bfr, bef.begin_token);
            this._find_sum(bfr, bef.end_token);
            return new ReferentToken(bfr, bef.begin_token, t1);
        }
        return null;
    }
    
    static _add_whos_list(t1, bfr) {
        if (t1 === null) 
            return null;
        if ((t1.next !== null && t1.next.is_comma_and && (t1.next.next instanceof ReferentToken)) && t1.next.next.get_referent().type_name === t1.get_referent().type_name) {
            let li = new Array();
            li.push(t1.next.next.get_referent());
            if (t1.next.is_and) 
                t1 = t1.next.next;
            else {
                let ok = false;
                for (let tt = t1.next.next.next; tt !== null; tt = tt.next) {
                    if (!tt.is_comma_and) 
                        break;
                    if (!((tt.next instanceof ReferentToken))) 
                        break;
                    if (tt.next.get_referent().type_name !== t1.get_referent().type_name) 
                        break;
                    li.push(tt.next.get_referent());
                    if (tt.is_and) {
                        ok = true;
                        t1 = tt.next;
                        break;
                    }
                }
                if (!ok) 
                    li = null;
            }
            if (li !== null) {
                for (const r of li) {
                    bfr.add_slot(BusinessFactReferent.ATTR_WHO, r, false, 0);
                }
            }
        }
        return t1;
    }
    
    _analize_get2(t) {
        if (t === null) 
            return null;
        let tt = t.previous;
        let ts = t;
        if (tt !== null && tt.is_comma) 
            tt = tt.previous;
        let bef = this._find_ref_before(tt);
        let master = null;
        let slave = null;
        if (bef !== null && (bef.referent instanceof FundsReferent)) {
            slave = bef.referent;
            ts = bef.begin_token;
        }
        tt = t.next;
        if (tt === null) 
            return null;
        let te = tt;
        let r = tt.get_referent();
        if ((r instanceof PersonReferent) || (r instanceof OrganizationReferent)) {
            master = r;
            if (slave === null && tt.next !== null) {
                if ((((r = tt.next.get_referent()))) !== null) {
                    if ((r instanceof FundsReferent) || (r instanceof OrganizationReferent)) {
                        slave = Utils.as(r, FundsReferent);
                        te = tt.next;
                    }
                }
            }
        }
        if (master !== null && slave !== null) {
            let bfr = BusinessFactReferent._new437(BusinessFactKind.HAVE);
            bfr.who = master;
            if (slave instanceof OrganizationReferent) {
                bfr.add_what(slave);
                bfr.typ = "владение компанией";
            }
            else if (slave instanceof FundsReferent) {
                bfr.add_what(slave);
                bfr.typ = "владение ценными бумагами";
            }
            else 
                return null;
            return new ReferentToken(bfr, ts, te);
        }
        return null;
    }
    
    _analize_have(bfi) {
        let t = bfi.end_token.next;
        let t1 = null;
        if (t !== null && ((t.is_value("КОТОРЫЙ", null) || t.is_value("ЯКИЙ", null)))) 
            t1 = t.next;
        else {
            for (let tt = bfi.begin_token; tt !== bfi.end_token; tt = tt.next) {
                if (tt.morph.class0.is_pronoun) 
                    t1 = t;
            }
            if (t1 === null) {
                if (bfi.is_base_passive && t !== null && (((t.get_referent() instanceof PersonReferent) || (t.get_referent() instanceof OrganizationReferent)))) {
                    t1 = t;
                    if (t.next !== null && (t.next.get_referent() instanceof FundsReferent)) {
                        let bfr = BusinessFactReferent._new437(BusinessFactKind.HAVE);
                        bfr.who = t.get_referent();
                        bfr.add_what(t.next.get_referent());
                        bfr.typ = "владение ценными бумагами";
                        return new ReferentToken(bfr, bfi.begin_token, t.next);
                    }
                }
            }
        }
        let t0 = null;
        let slave = null;
        let mus_be_verb = false;
        if (t1 !== null) {
            let tt0 = bfi.begin_token.previous;
            if (tt0 !== null && tt0.is_char(',')) 
                tt0 = tt0.previous;
            let bef = this._find_ref_before(tt0);
            if (bef === null) 
                return null;
            if (!((bef.referent instanceof OrganizationReferent))) 
                return null;
            t0 = bef.begin_token;
            slave = bef.referent;
        }
        else if (bfi.end_token.get_morph_class_in_dictionary().is_noun && (t.get_referent() instanceof OrganizationReferent)) {
            slave = t.get_referent();
            t1 = t.next;
            t0 = bfi.begin_token;
            mus_be_verb = true;
        }
        if (t0 === null || t1 === null || slave === null) 
            return null;
        if ((t1.is_hiphen || t1.is_value("ЯВЛЯТЬСЯ", null) || t1.is_value("БУТИ", null)) || t1.is_value("Є", null)) 
            t1 = t1.next;
        else if (mus_be_verb) 
            return null;
        let r = (t1 === null ? null : t1.get_referent());
        if ((r instanceof OrganizationReferent) || (r instanceof PersonReferent)) {
            let bfr = BusinessFactReferent._new437(BusinessFactKind.HAVE);
            bfr.who = r;
            bfr.add_what(slave);
            if (bfi.end_token.is_value("АКЦИОНЕР", null) || bfi.end_token.is_value("АКЦІОНЕР", null)) 
                bfr.typ = "владение ценными бумагами";
            else 
                bfr.typ = "владение компанией";
            t1 = BusinessAnalyzer._add_whos_list(t1, bfr);
            return new ReferentToken(bfr, t0, t1);
        }
        return null;
    }
    
    _analize_profit(bfi) {
        if (bfi.end_token.next === null) 
            return null;
        let t0 = bfi.begin_token;
        let t1 = bfi.end_token;
        let typ = t1.get_normal_case_text(null, true, MorphGender.UNDEFINED, false).toLowerCase();
        let org = null;
        org = Utils.as(t1.next.get_referent(), OrganizationReferent);
        let t = t1;
        if (org !== null) 
            t = t.next;
        else {
            let rt = t.kit.process_referent(OrganizationAnalyzer.ANALYZER_NAME, t.next);
            if (rt !== null) {
                org = Utils.as(rt.referent, OrganizationReferent);
                t = rt.end_token;
            }
        }
        let dt = null;
        let sum = null;
        for (t = t.next; t !== null; t = t.next) {
            if (t.is_char('.')) 
                break;
            if (t.is_char('(')) {
                let br = BracketHelper.try_parse(t, BracketParseAttr.NO, 100);
                if (br !== null) {
                    t = br.end_token;
                    continue;
                }
            }
            if ((((t.morph.class0.is_verb || t.is_value("ДО", null) || t.is_hiphen) || t.is_value("РАЗМЕР", null) || t.is_value("РОЗМІР", null))) && t.next !== null && (t.next.get_referent() instanceof MoneyReferent)) {
                if (sum !== null) 
                    break;
                sum = Utils.as(t.next.get_referent(), MoneyReferent);
                t1 = (t = t.next);
                continue;
            }
            let r = t.get_referent();
            if ((r instanceof DateRangeReferent) || (r instanceof DateReferent)) {
                if (dt === null) {
                    dt = r;
                    t1 = t;
                }
            }
            else if ((r instanceof OrganizationReferent) && org === null) {
                org = Utils.as(r, OrganizationReferent);
                t1 = t;
            }
        }
        if (sum === null) 
            return null;
        if (org === null) {
            for (let tt = t0.previous; tt !== null; tt = tt.previous) {
                if (tt.is_char('.')) 
                    break;
                let b0 = Utils.as(tt.get_referent(), BusinessFactReferent);
                if (b0 !== null) {
                    org = Utils.as(b0.who, OrganizationReferent);
                    break;
                }
                if ((((org = Utils.as(tt.get_referent(), OrganizationReferent)))) !== null) 
                    break;
            }
        }
        if (org === null) 
            return null;
        let bfr = BusinessFactReferent._new437(bfi.base_kind);
        bfr.who = org;
        bfr.typ = typ;
        bfr.add_slot(BusinessFactReferent.ATTR_MISC, sum, false, 0);
        if (dt !== null) 
            bfr.when = dt;
        else 
            this._find_date(bfr, bfi.begin_token);
        return new ReferentToken(bfr, t0, t1);
    }
    
    _analize_agreement(bfi) {
        let first = null;
        let second = null;
        let t0 = bfi.begin_token;
        let t1 = bfi.end_token;
        let max_lines = 1;
        for (let t = bfi.begin_token.previous; t !== null; t = t.previous) {
            if (t.is_char('.') || t.is_newline_after) {
                if ((--max_lines) === 0) 
                    break;
                continue;
            }
            if (t.is_value("СТОРОНА", null) && t.previous !== null && ((t.previous.is_value("МЕЖДУ", null) || t.previous.is_value("МІЖ", null)))) {
                max_lines = 2;
                t0 = (t = t.previous);
                continue;
            }
            let r = t.get_referent();
            if (r instanceof BusinessFactReferent) {
                let b = Utils.as(r, BusinessFactReferent);
                if (b.who !== null && ((b.who2 !== null || b.whom !== null))) {
                    first = b.who;
                    second = Utils.notNull(b.who2, b.whom);
                    break;
                }
            }
            if (!((r instanceof OrganizationReferent))) 
                continue;
            if ((t.previous !== null && ((t.previous.is_and || t.previous.is_value("К", null))) && t.previous.previous !== null) && (t.previous.previous.get_referent() instanceof OrganizationReferent)) {
                t0 = t.previous.previous;
                first = t0.get_referent();
                second = r;
                break;
            }
            else {
                t0 = t;
                first = r;
                break;
            }
        }
        if (second === null) {
            for (let t = bfi.end_token.next; t !== null; t = t.next) {
                if (t.is_char('.')) 
                    break;
                if (t.is_newline_before) 
                    break;
                let r = t.get_referent();
                if (!((r instanceof OrganizationReferent))) 
                    continue;
                if ((t.next !== null && ((t.next.is_and || t.next.is_value("К", null))) && t.next.next !== null) && (t.next.next.get_referent() instanceof OrganizationReferent)) {
                    t1 = t.next.next;
                    first = r;
                    second = t1.get_referent();
                    break;
                }
                else {
                    t1 = t;
                    second = r;
                    break;
                }
            }
        }
        if (first === null || second === null) 
            return null;
        let bf = BusinessFactReferent._new437(bfi.base_kind);
        bf.who = first;
        if (bfi.base_kind === BusinessFactKind.LAWSUIT) 
            bf.whom = second;
        else 
            bf.who2 = second;
        this._find_date(bf, bfi.begin_token);
        this._find_sum(bf, bfi.begin_token);
        return new ReferentToken(bf, t0, t1);
    }
    
    _analize_subsidiary(bfi) {
        let t1 = bfi.end_token.next;
        if (t1 === null || !((t1.get_referent() instanceof OrganizationReferent))) 
            return null;
        let t = null;
        let org0 = null;
        for (t = bfi.begin_token.previous; t !== null; t = t.previous) {
            if (t.is_char('(') || t.is_char('%')) 
                continue;
            if (t.morph.class0.is_verb) 
                continue;
            if (t instanceof NumberToken) 
                continue;
            org0 = Utils.as(t.get_referent(), OrganizationReferent);
            if (org0 !== null) 
                break;
        }
        if (org0 === null) 
            return null;
        let bfr = BusinessFactReferent._new437(bfi.base_kind);
        bfr.who = org0;
        bfr.whom = t1.get_referent();
        return new ReferentToken(bfr, t, t1);
    }
    
    _analize_finance(bfi) {
        let bef = this._find_ref_before(bfi.begin_token.previous);
        if (bef === null) 
            return null;
        if (!((bef.referent instanceof OrganizationReferent)) && !((bef.referent instanceof PersonReferent))) 
            return null;
        let whom = null;
        let sum = null;
        let funds = null;
        for (let t = bfi.end_token.next; t !== null; t = t.next) {
            if (t.is_newline_before || t.is_char('.')) 
                break;
            let r = t.get_referent();
            if (r instanceof OrganizationReferent) {
                if (whom === null) 
                    whom = Utils.as(t, ReferentToken);
            }
            else if (r instanceof MoneyReferent) {
                if (sum === null) 
                    sum = Utils.as(r, MoneyReferent);
            }
            else if (r instanceof FundsReferent) {
                if (funds === null) 
                    funds = Utils.as(r, FundsReferent);
            }
        }
        if (whom === null) 
            return null;
        let bfr = new BusinessFactReferent();
        if (funds === null) 
            bfr.kind = BusinessFactKind.FINANCE;
        else {
            bfr.kind = BusinessFactKind.GET;
            bfr.typ = "покупка ценных бумаг";
        }
        bfr.who = bef.referent;
        bfr.whom = whom.referent;
        if (funds !== null) 
            bfr.add_what(funds);
        if (sum !== null) 
            bfr.add_slot(BusinessFactReferent.ATTR_MISC, sum, false, 0);
        this._find_date(bfr, bef.begin_token);
        return new ReferentToken(bfr, bef.begin_token, whom.end_token);
    }
    
    _analize_likelihoods(rt) {
        let bfr0 = Utils.as(rt.referent, BusinessFactReferent);
        if (bfr0 === null || bfr0.whats.length !== 1 || !((bfr0.whats[0] instanceof FundsReferent))) 
            return null;
        let funds0 = Utils.as(bfr0.whats[0], FundsReferent);
        let t = null;
        let whos = new Array();
        let funds = new Array();
        for (t = rt.end_token.next; t !== null; t = t.next) {
            if (t.is_newline_before || t.is_char('.')) 
                break;
            if (t.morph.class0.is_adverb) 
                continue;
            if (t.is_hiphen || t.is_comma_and) 
                continue;
            if (t.morph.class0.is_conjunction || t.morph.class0.is_preposition || t.morph.class0.is_misc) 
                continue;
            let r = t.get_referent();
            if ((r instanceof OrganizationReferent) || (r instanceof PersonReferent)) {
                whos.push(Utils.as(t, ReferentToken));
                continue;
            }
            if (r instanceof FundsReferent) {
                funds0 = Utils.as(r, FundsReferent);
                funds.push(funds0);
                continue;
            }
            let it = FundsItemToken.try_parse(t, null);
            if (it === null) 
                break;
            let fu = Utils.as(funds0.clone(), FundsReferent);
            fu.occurrence.splice(0, fu.occurrence.length);
            fu.add_occurence_of_ref_tok(new ReferentToken(fu, it.begin_token, it.end_token));
            if (it.typ === FundsItemTyp.PERCENT && it.num_val !== null) 
                fu.percent = it.num_val.real_value;
            else if (it.typ === FundsItemTyp.COUNT && it.num_val !== null && it.num_val.int_value !== null) 
                fu.count = it.num_val.int_value;
            else if (it.typ === FundsItemTyp.SUM) 
                fu.sum = Utils.as(it.ref, MoneyReferent);
            else 
                break;
            funds.push(fu);
            t = it.end_token;
        }
        if (whos.length === 0 || whos.length !== funds.length) 
            return null;
        let res = new Array();
        for (let i = 0; i < whos.length; i++) {
            let bfr = BusinessFactReferent._new448(bfr0.kind, bfr0.typ);
            bfr.who = whos[i].referent;
            bfr.add_what(funds[i]);
            for (const s of bfr0.slots) {
                if (s.type_name === BusinessFactReferent.ATTR_MISC || s.type_name === BusinessFactReferent.ATTR_WHEN) 
                    bfr.add_slot(s.type_name, s.value, false, 0);
            }
            res.push(new ReferentToken(bfr, whos[i].begin_token, whos[i].end_token));
        }
        return res;
    }
    
    static initialize() {
        if (BusinessAnalyzer.m_inited) 
            return;
        BusinessAnalyzer.m_inited = true;
        MetaBusinessFact.initialize();
        FundsMeta.initialize();
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = true;
        BusinessFactItem.initialize();
        Termin.ASSIGN_ALL_TEXTS_AS_NORMAL = false;
        ProcessorService.register_analyzer(new BusinessAnalyzer());
    }
    
    static static_constructor() {
        BusinessAnalyzer.ANALYZER_NAME = "BUSINESS";
        BusinessAnalyzer.m_inited = false;
    }
}


BusinessAnalyzer.static_constructor();

module.exports = BusinessAnalyzer