/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");

const Token = require("./../Token");
const MetaToken = require("./../MetaToken");
const NumberExType = require("./../core/NumberExType");
const TextToken = require("./../TextToken");
const Referent = require("./../Referent");
const ReferentToken = require("./../ReferentToken");
const ReferentEqualType = require("./../ReferentEqualType");
const EpNerBankInternalResourceHelper = require("./../bank/internal/EpNerBankInternalResourceHelper");
const NumberToken = require("./../NumberToken");
const MoneyMeta = require("./internal/MoneyMeta");
const NumberHelper = require("./../core/NumberHelper");
const MoneyReferent = require("./MoneyReferent");
const Analyzer = require("./../Analyzer");
const ProcessorService = require("./../ProcessorService");

/**
 * Анализатор для денежных сумм
 */
class MoneyAnalyzer extends Analyzer {
    
    get name() {
        return MoneyAnalyzer.ANALYZER_NAME;
    }
    
    get caption() {
        return "Деньги";
    }
    
    get description() {
        return "Деньги...";
    }
    
    clone() {
        return new MoneyAnalyzer();
    }
    
    get progress_weight() {
        return 1;
    }
    
    get type_system() {
        return [MoneyMeta.GLOBAL_META];
    }
    
    get images() {
        let res = new Hashtable();
        res.put(MoneyMeta.IMAGE_ID, EpNerBankInternalResourceHelper.get_bytes("money2.png"));
        res.put(MoneyMeta.IMAGE2ID, EpNerBankInternalResourceHelper.get_bytes("moneyerr.png"));
        return res;
    }
    
    get used_extern_object_types() {
        return ["GEO"];
    }
    
    create_referent(type) {
        if (type === MoneyReferent.OBJ_TYPENAME) 
            return new MoneyReferent();
        return null;
    }
    
    /**
     * Основная функция выделения объектов
     * @param container 
     * @param lastStage 
     * @return 
     */
    process(kit) {
        let ad = kit.get_analyzer_data(this);
        for (let t = kit.first_token; t !== null; t = t.next) {
            let mon = MoneyAnalyzer.try_parse(t);
            if (mon !== null) {
                mon.referent = ad.register_referent(mon.referent);
                kit.embed_token(mon);
                t = mon;
                continue;
            }
        }
    }
    
    static try_parse(t) {
        if (t === null) 
            return null;
        if (!((t instanceof NumberToken)) && t.length_char !== 1) 
            return null;
        let nex = NumberHelper.try_parse_number_with_postfix(t);
        if (nex === null || nex.ex_typ !== NumberExType.MONEY) {
            if ((t instanceof NumberToken) && (t.next instanceof TextToken) && (t.next.next instanceof NumberToken)) {
                if (t.next.is_hiphen || t.next.morph.class0.is_preposition) {
                    let res1 = NumberHelper.try_parse_number_with_postfix(t.next.next);
                    if (res1 !== null && res1.ex_typ === NumberExType.MONEY) {
                        let res0 = new MoneyReferent();
                        if ((t.next.is_hiphen && res1.real_value === 0 && res1.end_token.next !== null) && res1.end_token.next.is_char('(')) {
                            let nex2 = NumberHelper.try_parse_number_with_postfix(res1.end_token.next.next);
                            if ((nex2 !== null && nex2.ex_typ_param === res1.ex_typ_param && nex2.end_token.next !== null) && nex2.end_token.next.is_char(')')) {
                                if (nex2.value === (t).value) {
                                    res0.currency = nex2.ex_typ_param;
                                    res0.add_slot(MoneyReferent.ATTR_VALUE, nex2.value, true, 0);
                                    return new ReferentToken(res0, t, nex2.end_token.next);
                                }
                                if (t.previous instanceof NumberToken) {
                                    if (nex2.value === (((String((t.previous).real_value * (1000))) + (t).value))) {
                                        res0.currency = nex2.ex_typ_param;
                                        res0.add_slot(MoneyReferent.ATTR_VALUE, nex2.value, true, 0);
                                        return new ReferentToken(res0, t.previous, nex2.end_token.next);
                                    }
                                    else if (t.previous.previous instanceof NumberToken) {
                                        if (nex2.real_value === ((((t.previous.previous).real_value * (1000000)) + ((t.previous).real_value * (1000)) + (t).real_value))) {
                                            res0.currency = nex2.ex_typ_param;
                                            res0.add_slot(MoneyReferent.ATTR_VALUE, nex2.value, true, 0);
                                            return new ReferentToken(res0, t.previous.previous, nex2.end_token.next);
                                        }
                                    }
                                }
                            }
                        }
                        res0.currency = res1.ex_typ_param;
                        res0.add_slot(MoneyReferent.ATTR_VALUE, (t).value, false, 0);
                        return new ReferentToken(res0, t, t);
                    }
                }
            }
            return null;
        }
        let res = new MoneyReferent();
        res.currency = nex.ex_typ_param;
        let val = nex.value;
        if (val.indexOf('.') > 0) 
            val = val.substring(0, 0 + val.indexOf('.'));
        res.add_slot(MoneyReferent.ATTR_VALUE, val, true, 0);
        let re = Math.floor(Utils.mathRound(((nex.real_value - res.value)) * (100), 6));
        if (re !== 0) 
            res.add_slot(MoneyReferent.ATTR_REST, re.toString(), true, 0);
        if (nex.real_value !== nex.alt_real_value) {
            if (Math.floor(res.value) !== Math.floor(nex.alt_real_value)) {
                val = NumberHelper.double_to_string(nex.alt_real_value);
                if (val.indexOf('.') > 0) 
                    val = val.substring(0, 0 + val.indexOf('.'));
                res.add_slot(MoneyReferent.ATTR_ALTVALUE, val, true, 0);
            }
            re = Math.floor(Utils.mathRound(((nex.alt_real_value - (Math.floor(nex.alt_real_value)))) * (100), 6));
            if (re !== res.rest && re !== 0) 
                res.add_slot(MoneyReferent.ATTR_ALTREST, (re).toString(), true, 0);
        }
        if (nex.alt_rest_money > 0) 
            res.add_slot(MoneyReferent.ATTR_ALTREST, nex.alt_rest_money.toString(), true, 0);
        let t1 = nex.end_token;
        if (t1.next !== null && t1.next.is_char('(')) {
            let rt = MoneyAnalyzer.try_parse(t1.next.next);
            if ((rt !== null && rt.referent.can_be_equals(res, ReferentEqualType.WITHINONETEXT) && rt.end_token.next !== null) && rt.end_token.next.is_char(')')) 
                t1 = rt.end_token.next;
            else {
                rt = MoneyAnalyzer.try_parse(t1.next);
                if (rt !== null && rt.referent.can_be_equals(res, ReferentEqualType.WITHINONETEXT)) 
                    t1 = rt.end_token;
            }
        }
        if (res.alt_value !== null && res.alt_value > res.value) {
            if (t.whitespaces_before_count === 1 && (t.previous instanceof NumberToken)) {
                let delt = Math.floor((res.alt_value - res.value));
                if ((((res.value < 1000) && ((delt % 1000)) === 0)) || (((res.value < 1000000) && ((delt % 1000000)) === 0))) {
                    t = t.previous;
                    res.add_slot(MoneyReferent.ATTR_VALUE, res.get_string_value(MoneyReferent.ATTR_ALTVALUE), true, 0);
                    res.add_slot(MoneyReferent.ATTR_ALTVALUE, null, true, 0);
                }
            }
        }
        return new ReferentToken(res, t, t1);
    }
    
    process_referent(begin, end) {
        return MoneyAnalyzer.try_parse(begin);
    }
    
    static initialize() {
        if (MoneyAnalyzer.m_inited) 
            return;
        MoneyAnalyzer.m_inited = true;
        MoneyMeta.initialize();
        ProcessorService.register_analyzer(new MoneyAnalyzer());
    }
    
    static static_constructor() {
        MoneyAnalyzer.ANALYZER_NAME = "MONEY";
        MoneyAnalyzer.m_inited = false;
    }
}


MoneyAnalyzer.static_constructor();

module.exports = MoneyAnalyzer