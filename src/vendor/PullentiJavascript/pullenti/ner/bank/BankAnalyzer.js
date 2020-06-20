/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");

const UriReferent = require("./../uri/UriReferent");
const NounPhraseParseAttr = require("./../core/NounPhraseParseAttr");
const Token = require("./../Token");
const TextToken = require("./../TextToken");
const TerminCollection = require("./../core/TerminCollection");
const Referent = require("./../Referent");
const NumberToken = require("./../NumberToken");
const MetaBank = require("./internal/MetaBank");
const EpNerBankInternalResourceHelper = require("./internal/EpNerBankInternalResourceHelper");
const BankDataReferent = require("./BankDataReferent");
const Termin = require("./../core/Termin");
const ProcessorService = require("./../ProcessorService");
const MetaToken = require("./../MetaToken");
const ReferentToken = require("./../ReferentToken");
const NounPhraseHelper = require("./../core/NounPhraseHelper");
const Analyzer = require("./../Analyzer");
const TerminParseAttr = require("./../core/TerminParseAttr");

/**
 * Анализатор банковских данных (счетов, платёжных реквизитов...)
 */
class BankAnalyzer extends Analyzer {
    
    get name() {
        return BankAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Банковские данные";
    }
    
    get description() {
        return "Банковские реквизиты, счета и пр.";
    }
    
    clone() {
        return new BankAnalyzer();
    }
    
    get progress_weight() {
        return 1;
    }
    
    get type_system() {
        return [MetaBank.global_meta];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MetaBank.IMAGE_ID, EpNerBankInternalResourceHelper.get_bytes("dollar.png"));
        return res;
    }
    
    create_referent(type) {
        if (type === BankDataReferent.OBJ_TYPENAME) 
            return new BankDataReferent();
        return null;
    }
    
    get used_extern_object_types() {
        return ["URI", "ORGANIZATION"];
    }
    
    process(kit) {
        let ad = kit.get_analyzer_data(this);
        for (let t = kit.first_token; t !== null; t = t.next) {
            let rt = null;
            if (t.chars.is_letter) {
                let tok = BankAnalyzer.m_ontology.try_parse(t, TerminParseAttr.NO);
                if (tok !== null) {
                    let tt = tok.end_token.next;
                    if (tt !== null && tt.is_char(':')) 
                        tt = tt.next;
                    rt = this.try_attach(tt, true);
                    if (rt !== null) 
                        rt.begin_token = t;
                }
            }
            if (rt === null && (((t instanceof ReferentToken) || t.is_newline_before))) 
                rt = this.try_attach(t, false);
            if (rt !== null) {
                rt.referent = ad.register_referent(rt.referent);
                kit.embed_token(rt);
                t = rt;
            }
        }
    }
    
    static _is_bank_req(txt) {
        if (((((((txt === "Р/С" || txt === "К/С" || txt === "Л/С") || txt === "ОКФС" || txt === "ОКАТО") || txt === "ОГРН" || txt === "БИК") || txt === "SWIFT" || txt === "ОКПО") || txt === "ОКВЭД" || txt === "ОКОНХ") || txt === "КБК" || txt === "ИНН") || txt === "КПП") 
            return true;
        else 
            return false;
    }
    
    try_attach(t, key_word) {
        if (t === null) 
            return null;
        let t0 = t;
        let t1 = t;
        let uris_keys = null;
        let uris = null;
        let org = null;
        let cor_org = null;
        let org_is_bank = false;
        let empty = 0;
        let last_uri = null;
        for (; t !== null; t = t.next) {
            if (t.is_table_control_char && t !== t0) 
                break;
            if (t.is_comma || t.morph.class0.is_preposition || t.is_char_of("/\\")) 
                continue;
            let bank_keyword = false;
            if (t.is_value("ПОЛНЫЙ", null) && t.next !== null && ((t.next.is_value("НАИМЕНОВАНИЕ", null) || t.next.is_value("НАЗВАНИЕ", null)))) {
                t = t.next.next;
                if (t === null) 
                    break;
            }
            if (t.is_value("БАНК", null)) {
                if ((t instanceof ReferentToken) && t.get_referent().type_name === "ORGANIZATION") 
                    bank_keyword = true;
                let tt = t.next;
                let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
                if (npt !== null) 
                    tt = npt.end_token.next;
                if (tt !== null && tt.is_char(':')) 
                    tt = tt.next;
                if (tt !== null) {
                    if (!bank_keyword) {
                        t = tt;
                        bank_keyword = true;
                    }
                    else if (tt.get_referent() !== null && tt.get_referent().type_name === "ORGANIZATION") 
                        t = tt;
                }
            }
            let r = t.get_referent();
            if (r !== null && r.type_name === "ORGANIZATION") {
                let is_bank = false;
                let kk = 0;
                for (let rr = r; rr !== null && (kk < 4); rr = rr.parent_referent,kk++) {
                    is_bank = Utils.compareStrings(Utils.notNull(rr.get_string_value("KIND"), ""), "Bank", true) === 0;
                    if (is_bank) 
                        break;
                }
                if (!is_bank && bank_keyword) 
                    is_bank = true;
                if (!is_bank && uris !== null && uris_keys.includes("ИНН")) 
                    return null;
                if ((last_uri !== null && last_uri.scheme === "К/С" && t.previous !== null) && t.previous.is_value("В", null)) {
                    cor_org = r;
                    t1 = t;
                }
                else if (org === null || ((!org_is_bank && is_bank))) {
                    org = r;
                    t1 = t;
                    org_is_bank = is_bank;
                    if (is_bank) 
                        continue;
                }
                if (uris === null && !key_word) 
                    return null;
                continue;
            }
            if (r instanceof UriReferent) {
                let u = Utils.as(r, UriReferent);
                if (uris === null) {
                    if (!BankAnalyzer._is_bank_req(u.scheme)) 
                        return null;
                    if (u.scheme === "ИНН" && t.is_newline_after) 
                        return null;
                    uris = new Array();
                    uris_keys = new Array();
                }
                else {
                    if (!BankAnalyzer._is_bank_req(u.scheme)) 
                        break;
                    if (uris_keys.includes(u.scheme)) 
                        break;
                    if (u.scheme === "ИНН") {
                        if (empty > 0) 
                            break;
                    }
                }
                uris_keys.push(u.scheme);
                uris.push(u);
                last_uri = u;
                t1 = t;
                empty = 0;
                continue;
            }
            else if (uris === null && !key_word && !org_is_bank) 
                return null;
            if (r !== null && ((r.type_name === "GEO" || r.type_name === "ADDRESS"))) {
                empty++;
                continue;
            }
            if (t instanceof TextToken) {
                if (t.is_value("ПОЛНЫЙ", null) || t.is_value("НАИМЕНОВАНИЕ", null) || t.is_value("НАЗВАНИЕ", null)) {
                }
                else if (t.chars.is_letter) {
                    let tok = BankAnalyzer.m_ontology.try_parse(t, TerminParseAttr.NO);
                    if (tok !== null) {
                        t = tok.end_token;
                        empty = 0;
                    }
                    else {
                        empty++;
                        if (t.is_newline_before) {
                            let nnn = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
                            if (nnn !== null && nnn.end_token.next !== null && nnn.end_token.next.is_char(':')) 
                                break;
                        }
                    }
                    if (uris === null) 
                        break;
                }
            }
            if (empty > 2) 
                break;
            if (empty > 0 && t.is_char(':') && t.is_newline_after) 
                break;
            if (((t instanceof NumberToken) && t.is_newline_before && t.next !== null) && !t.next.chars.is_letter) 
                break;
        }
        if (uris === null) 
            return null;
        if (!uris_keys.includes("Р/С") && !uris_keys.includes("Л/С")) 
            return null;
        let ok = false;
        if ((uris.length < 2) && org === null) 
            return null;
        let bdr = new BankDataReferent();
        for (const u of uris) {
            bdr.add_slot(BankDataReferent.ATTR_ITEM, u, false, 0);
        }
        if (org !== null) 
            bdr.add_slot(BankDataReferent.ATTR_BANK, org, false, 0);
        if (cor_org !== null) 
            bdr.add_slot(BankDataReferent.ATTR_CORBANK, cor_org, false, 0);
        let org0 = (t0.previous === null ? null : t0.previous.get_referent());
        if (org0 !== null && org0.type_name === "ORGANIZATION") {
            for (const s of org0.slots) {
                if (s.value instanceof UriReferent) {
                    let u = Utils.as(s.value, UriReferent);
                    if (BankAnalyzer._is_bank_req(u.scheme)) {
                        if (!uris_keys.includes(u.scheme)) 
                            bdr.add_slot(BankDataReferent.ATTR_ITEM, u, false, 0);
                    }
                }
            }
        }
        return new ReferentToken(bdr, t0, t1);
    }
    
    static initialize() {
        if (BankAnalyzer.m_ontology !== null) 
            return;
        MetaBank.initialize();
        BankAnalyzer.m_ontology = new TerminCollection();
        let t = new Termin("БАНКОВСКИЕ РЕКВИЗИТЫ", null, true);
        t.add_variant("ПЛАТЕЖНЫЕ РЕКВИЗИТЫ", false);
        t.add_variant("РЕКВИЗИТЫ", false);
        BankAnalyzer.m_ontology.add(t);
        ProcessorService.register_analyzer(new BankAnalyzer());
    }
    
    static static_constructor() {
        BankAnalyzer.ANALYZER_NAME = "BANKDATA";
        BankAnalyzer.m_ontology = null;
    }
}


BankAnalyzer.static_constructor();

module.exports = BankAnalyzer