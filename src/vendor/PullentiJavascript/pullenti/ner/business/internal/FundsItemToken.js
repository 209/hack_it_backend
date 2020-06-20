/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../../unisharp/Utils");
const StringBuilder = require("./../../../unisharp/StringBuilder");

const FundsReferent = require("./../FundsReferent");
const MorphGender = require("./../../../morph/MorphGender");
const MetaToken = require("./../../MetaToken");
const OrganizationKind = require("./../../org/OrganizationKind");
const Referent = require("./../../Referent");
const NumberExType = require("./../../core/NumberExType");
const NumberToken = require("./../../NumberToken");
const OrganizationReferent = require("./../../org/OrganizationReferent");
const FundsKind = require("./../FundsKind");
const FundsItemTyp = require("./FundsItemTyp");
const ReferentToken = require("./../../ReferentToken");
const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const MoneyReferent = require("./../../money/MoneyReferent");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const NumberHelper = require("./../../core/NumberHelper");
const OrganizationAnalyzer = require("./../../org/OrganizationAnalyzer");

class FundsItemToken extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.typ = FundsItemTyp.UNDEFINED;
        this.kind = FundsKind.UNDEFINED;
        this.ref = null;
        this.num_val = null;
        this.string_val = null;
    }
    
    toString() {
        let res = new StringBuilder();
        res.append(this.typ);
        if (this.kind !== FundsKind.UNDEFINED) 
            res.append(" K=").append(String(this.kind));
        if (this.num_val !== null) 
            res.append(" N=").append(this.num_val.value);
        if (this.ref !== null) 
            res.append(" R=").append(this.ref.toString());
        if (this.string_val !== null) 
            res.append(" S=").append(this.string_val);
        return res.toString();
    }
    
    static try_parse(t, prev = null) {
        if (t === null) 
            return null;
        let typ0 = FundsItemTyp.UNDEFINED;
        for (let tt = t; tt !== null; tt = tt.next) {
            if (tt.morph.class0.is_preposition || tt.morph.class0.is_adverb) 
                continue;
            if ((tt.is_value("СУММА", null) || tt.is_value("ОКОЛО", null) || tt.is_value("БОЛЕЕ", null)) || tt.is_value("МЕНЕЕ", null) || tt.is_value("СВЫШЕ", null)) 
                continue;
            if ((tt.is_value("НОМИНАЛ", null) || tt.is_value("ЦЕНА", null) || tt.is_value("СТОИМОСТЬ", null)) || tt.is_value("СТОИТЬ", null)) {
                typ0 = FundsItemTyp.PRICE;
                continue;
            }
            if (tt.is_value("НОМИНАЛЬНАЯ", null) || tt.is_value("ОБЩАЯ", null)) 
                continue;
            if (tt.is_value("СОСТАВЛЯТЬ", null)) 
                continue;
            let re = tt.get_referent();
            if (re instanceof OrganizationReferent) 
                return FundsItemToken._new429(t, tt, FundsItemTyp.ORG, re);
            if (re instanceof MoneyReferent) {
                if (typ0 === FundsItemTyp.UNDEFINED) 
                    typ0 = FundsItemTyp.SUM;
                if ((tt.next !== null && tt.next.is_value("ЗА", null) && tt.next.next !== null) && ((tt.next.next.is_value("АКЦИЯ", null) || tt.next.next.is_value("АКЦІЯ", null)))) 
                    typ0 = FundsItemTyp.PRICE;
                let res = FundsItemToken._new429(t, tt, typ0, re);
                return res;
            }
            if (re !== null) 
                break;
            let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null && npt.noun.is_value("ПАКЕТ", null)) 
                npt = NounPhraseHelper.try_parse(npt.end_token.next, NounPhraseParseAttr.NO, 0, null);
            if (npt !== null) {
                let res = null;
                if (npt.noun.is_value("АКЦІЯ", null) || npt.noun.is_value("АКЦИЯ", null)) {
                    res = FundsItemToken._new431(t, npt.end_token, FundsItemTyp.NOUN, FundsKind.STOCK);
                    if (npt.adjectives.length > 0) {
                        for (const v of FundsItemToken.m_act_types) {
                            if (npt.adjectives[0].is_value(v, null)) {
                                res.string_val = npt.get_normal_case_text(null, true, MorphGender.UNDEFINED, false).toLowerCase();
                                if (res.string_val === "голосовавшая акция") 
                                    res.string_val = "голосующая акция";
                                break;
                            }
                        }
                    }
                }
                else if (((npt.noun.is_value("БУМАГА", null) || npt.noun.is_value("ПАПІР", null))) && npt.end_token.previous !== null && ((npt.end_token.previous.is_value("ЦЕННЫЙ", null) || npt.end_token.previous.is_value("ЦІННИЙ", null)))) 
                    res = FundsItemToken._new432(t, npt.end_token, FundsItemTyp.NOUN, FundsKind.STOCK, "ценные бумаги");
                else if (((npt.noun.is_value("КАПИТАЛ", null) || npt.noun.is_value("КАПІТАЛ", null))) && npt.adjectives.length > 0 && ((npt.adjectives[0].is_value("УСТАВНОЙ", null) || npt.adjectives[0].is_value("УСТАВНЫЙ", null) || npt.adjectives[0].is_value("СТАТУТНИЙ", null)))) 
                    res = FundsItemToken._new431(t, npt.end_token, FundsItemTyp.NOUN, FundsKind.CAPITAL);
                if (res !== null) {
                    let rt = res.kit.process_referent(OrganizationAnalyzer.ANALYZER_NAME, res.end_token.next);
                    if (rt !== null) {
                        res.ref = rt.referent;
                        res.end_token = rt.end_token;
                    }
                    return res;
                }
            }
            if (prev !== null && prev.typ === FundsItemTyp.COUNT) {
                let val = null;
                for (const v of FundsItemToken.m_act_types) {
                    if (tt.is_value(v, null)) {
                        val = v;
                        break;
                    }
                }
                if (val !== null) {
                    let cou = 0;
                    let ok = false;
                    for (let ttt = tt.previous; ttt !== null; ttt = ttt.previous) {
                        if ((++cou) > 100) 
                            break;
                        let refs = ttt.get_referents();
                        if (refs === null) 
                            continue;
                        for (const r of refs) {
                            if (r instanceof FundsReferent) {
                                ok = true;
                                break;
                            }
                        }
                        if (ok) 
                            break;
                    }
                    cou = 0;
                    if (!ok) {
                        for (let ttt = tt.next; ttt !== null; ttt = ttt.next) {
                            if ((++cou) > 100) 
                                break;
                            let fi = FundsItemToken.try_parse(ttt, null);
                            if (fi !== null && fi.kind === FundsKind.STOCK) {
                                ok = true;
                                break;
                            }
                        }
                    }
                    if (ok) {
                        let res = FundsItemToken._new434(t, tt, FundsKind.STOCK, FundsItemTyp.NOUN);
                        res.string_val = (val.substring(0, 0 + val.length - 2).toLowerCase() + "ая акция");
                        return res;
                    }
                }
            }
            if (tt instanceof NumberToken) {
                let num = NumberHelper.try_parse_number_with_postfix(tt);
                if (num !== null) {
                    if (tt.previous !== null && tt.previous.is_value("НА", null)) 
                        break;
                    if (num.ex_typ === NumberExType.PERCENT) {
                        let res = FundsItemToken._new435(t, num.end_token, FundsItemTyp.PERCENT, num);
                        t = num.end_token.next;
                        if (t !== null && ((t.is_char('+') || t.is_value("ПЛЮС", null))) && (t.next instanceof NumberToken)) {
                            res.end_token = t.next;
                            t = res.end_token.next;
                        }
                        if ((t !== null && t.is_hiphen && t.next !== null) && t.next.chars.is_all_lower && !t.is_whitespace_after) 
                            t = t.next.next;
                        if (t !== null && ((t.is_value("ДОЛЯ", null) || t.is_value("ЧАСТКА", null)))) 
                            res.end_token = t;
                        return res;
                    }
                    break;
                }
                let t1 = tt;
                if (t1.next !== null && t1.next.is_value("ШТУКА", null)) 
                    t1 = t1.next;
                return FundsItemToken._new435(t, t1, FundsItemTyp.COUNT, Utils.as(tt, NumberToken));
            }
            break;
        }
        return null;
    }
    
    static try_attach(t) {
        if (t === null) 
            return null;
        let f = FundsItemToken.try_parse(t, null);
        if (f === null) 
            return null;
        if (f.typ === FundsItemTyp.ORG) 
            return null;
        if (f.typ === FundsItemTyp.PRICE || f.typ === FundsItemTyp.PERCENT || f.typ === FundsItemTyp.COUNT) {
            if (t.previous !== null && t.previous.is_char_of(",.") && (t.previous.previous instanceof NumberToken)) 
                return null;
        }
        let li = new Array();
        li.push(f);
        let is_in_br = false;
        for (let tt = f.end_token.next; tt !== null; tt = tt.next) {
            if ((tt.is_whitespace_before && tt.previous !== null && tt.previous.is_char('.')) && tt.chars.is_capital_upper) 
                break;
            let f0 = FundsItemToken.try_parse(tt, f);
            if (f0 !== null) {
                if (f0.kind === FundsKind.CAPITAL && is_in_br) {
                    for (const l_ of li) {
                        if (l_.typ === FundsItemTyp.NOUN) {
                            f0.kind = l_.kind;
                            break;
                        }
                    }
                }
                li.push((f = f0));
                tt = f.end_token;
                continue;
            }
            if (tt.is_char('(')) {
                is_in_br = true;
                continue;
            }
            if (tt.is_char(')')) {
                if (is_in_br || ((t.previous !== null && t.previous.is_char('(')))) {
                    is_in_br = false;
                    li[li.length - 1].end_token = tt;
                    continue;
                }
            }
            if (tt.morph.class0.is_verb || tt.morph.class0.is_adverb) 
                continue;
            break;
        }
        let funds = new FundsReferent();
        let res = new ReferentToken(funds, t, t);
        let org_prob = null;
        for (let i = 0; i < li.length; i++) {
            if (li[i].typ === FundsItemTyp.NOUN) {
                funds.kind = li[i].kind;
                if (li[i].string_val !== null) 
                    funds.typ = li[i].string_val;
                if (li[i].ref instanceof OrganizationReferent) 
                    org_prob = Utils.as(li[i].ref, OrganizationReferent);
                res.end_token = li[i].end_token;
            }
            else if (li[i].typ === FundsItemTyp.COUNT) {
                if (funds.count > 0 || li[i].num_val === null || li[i].num_val.int_value === null) 
                    break;
                funds.count = li[i].num_val.int_value;
                res.end_token = li[i].end_token;
            }
            else if (li[i].typ === FundsItemTyp.ORG) {
                if (funds.source !== null && funds.source !== li[i].ref) 
                    break;
                funds.source = Utils.as(li[i].ref, OrganizationReferent);
                res.end_token = li[i].end_token;
            }
            else if (li[i].typ === FundsItemTyp.PERCENT) {
                if (funds.percent > 0 || li[i].num_val === null || li[i].num_val.real_value === 0) 
                    break;
                funds.percent = li[i].num_val.real_value;
                res.end_token = li[i].end_token;
            }
            else if (li[i].typ === FundsItemTyp.SUM) {
                if (funds.sum !== null) 
                    break;
                funds.sum = Utils.as(li[i].ref, MoneyReferent);
                res.end_token = li[i].end_token;
            }
            else if (li[i].typ === FundsItemTyp.PRICE) {
                if (funds.price !== null) 
                    break;
                funds.price = Utils.as(li[i].ref, MoneyReferent);
                res.end_token = li[i].end_token;
            }
            else 
                break;
        }
        if (funds.percent > 0 && funds.source !== null && funds.kind === FundsKind.UNDEFINED) 
            funds.kind = FundsKind.STOCK;
        if (!funds.check_correct()) 
            return null;
        if (funds.source === null) {
            let cou = 0;
            for (let tt = res.begin_token.previous; tt !== null; tt = tt.previous) {
                if ((++cou) > 500) 
                    break;
                if (tt.is_newline_after) 
                    cou += 10;
                let fr = Utils.as(tt.get_referent(), FundsReferent);
                if (fr !== null && fr.source !== null) {
                    funds.source = fr.source;
                    break;
                }
            }
        }
        if (funds.source === null && org_prob !== null) 
            funds.source = org_prob;
        if (funds.source === null) {
            let cou = 0;
            for (let tt = res.begin_token.previous; tt !== null; tt = tt.previous) {
                if ((++cou) > 300) 
                    break;
                if (tt.is_newline_after) 
                    cou += 10;
                let refs = tt.get_referents();
                if (refs !== null) {
                    for (const r of refs) {
                        if (r instanceof OrganizationReferent) {
                            let ki = (r).kind;
                            if (ki === OrganizationKind.JUSTICE || ki === OrganizationKind.GOVENMENT) 
                                continue;
                            funds.source = Utils.as(r, OrganizationReferent);
                            cou = 10000;
                            break;
                        }
                    }
                }
            }
        }
        return res;
    }
    
    static _new429(_arg1, _arg2, _arg3, _arg4) {
        let res = new FundsItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.ref = _arg4;
        return res;
    }
    
    static _new431(_arg1, _arg2, _arg3, _arg4) {
        let res = new FundsItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.kind = _arg4;
        return res;
    }
    
    static _new432(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new FundsItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.kind = _arg4;
        res.string_val = _arg5;
        return res;
    }
    
    static _new434(_arg1, _arg2, _arg3, _arg4) {
        let res = new FundsItemToken(_arg1, _arg2);
        res.kind = _arg3;
        res.typ = _arg4;
        return res;
    }
    
    static _new435(_arg1, _arg2, _arg3, _arg4) {
        let res = new FundsItemToken(_arg1, _arg2);
        res.typ = _arg3;
        res.num_val = _arg4;
        return res;
    }
    
    static static_constructor() {
        FundsItemToken.m_act_types = Array.from(["ОБЫКНОВЕННЫЙ", "ПРИВИЛЕГИРОВАННЫЙ", "ГОЛОСУЮЩИЙ", "ЗВИЧАЙНИЙ", "ПРИВІЛЕЙОВАНОГО", "ГОЛОСУЄ"]);
    }
}


FundsItemToken.static_constructor();

module.exports = FundsItemToken