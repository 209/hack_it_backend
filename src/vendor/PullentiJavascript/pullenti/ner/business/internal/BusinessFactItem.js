/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const NounPhraseParseAttr = require("./../../core/NounPhraseParseAttr");
const MorphLang = require("./../../../morph/MorphLang");
const MetaToken = require("./../../MetaToken");
const Termin = require("./../../core/Termin");
const TerminCollection = require("./../../core/TerminCollection");
const TerminParseAttr = require("./../../core/TerminParseAttr");
const BusinessFactKind = require("./../BusinessFactKind");
const BusinessFactItemTyp = require("./BusinessFactItemTyp");
const NounPhraseHelper = require("./../../core/NounPhraseHelper");
const TextToken = require("./../../TextToken");

class BusinessFactItem extends MetaToken {
    
    constructor(b, e) {
        super(b, e, null);
        this.typ = BusinessFactItemTyp.BASE;
        this.base_kind = BusinessFactKind.UNDEFINED;
        this.is_base_passive = false;
    }
    
    static try_parse(t) {
        if (t === null) 
            return null;
        let res = BusinessFactItem._try_parse(t);
        if (res === null) 
            return null;
        for (let tt = res.end_token.next; tt !== null; tt = tt.next) {
            if (tt.morph.class0.is_preposition) 
                continue;
            if (!((tt instanceof TextToken))) 
                break;
            let npt = NounPhraseHelper.try_parse(tt, NounPhraseParseAttr.NO, 0, null);
            if (npt === null) 
                break;
            let rr = BusinessFactItem._try_parse(tt);
            if (rr !== null) {
                if (rr.base_kind === res.base_kind) {
                }
                else if (rr.base_kind === BusinessFactKind.GET && res.base_kind === BusinessFactKind.FINANCE) 
                    res.base_kind = rr.base_kind;
                else 
                    break;
                tt = res.end_token = rr.end_token;
                continue;
            }
            if ((res.base_kind === BusinessFactKind.FINANCE || npt.noun.is_value("РЫНОК", null) || npt.noun.is_value("СДЕЛКА", null)) || npt.noun.is_value("РИНОК", null) || npt.noun.is_value("УГОДА", null)) {
                res.end_token = tt;
                continue;
            }
            break;
        }
        return res;
    }
    
    static _try_parse(t) {
        let tok = BusinessFactItem.m_base_onto.try_parse(t, TerminParseAttr.NO);
        if (tok === null && t.morph.class0.is_verb && t.next !== null) 
            tok = BusinessFactItem.m_base_onto.try_parse(t.next, TerminParseAttr.NO);
        if (tok !== null) {
            let ki = BusinessFactKind.of(tok.termin.tag);
            if (ki !== BusinessFactKind.UNDEFINED) 
                return BusinessFactItem._new403(t, tok.end_token, BusinessFactItemTyp.BASE, ki, tok.morph, tok.termin.tag2 !== null);
            for (let tt = tok.end_token.next; tt !== null; tt = tt.next) {
                if (tt.morph.class0.is_preposition) 
                    continue;
                tok = BusinessFactItem.m_base_onto.try_parse(tt, TerminParseAttr.NO);
                if (tok === null) 
                    continue;
                ki = BusinessFactKind.of(tok.termin.tag);
                if (ki !== BusinessFactKind.UNDEFINED) 
                    return BusinessFactItem._new404(t, tok.end_token, BusinessFactItemTyp.BASE, ki, tok.morph);
                tt = tok.end_token;
            }
        }
        let npt = NounPhraseHelper.try_parse(t, NounPhraseParseAttr.NO, 0, null);
        if (npt !== null) {
            if (((((npt.noun.is_value("АКЦИОНЕР", null) || npt.noun.is_value("ВЛАДЕЛЕЦ", null) || npt.noun.is_value("ВЛАДЕЛИЦА", null)) || npt.noun.is_value("СОВЛАДЕЛЕЦ", null) || npt.noun.is_value("СОВЛАДЕЛИЦА", null)) || npt.noun.is_value("АКЦІОНЕР", null) || npt.noun.is_value("ВЛАСНИК", null)) || npt.noun.is_value("ВЛАСНИЦЯ", null) || npt.noun.is_value("СПІВВЛАСНИК", null)) || npt.noun.is_value("СПІВВЛАСНИЦЯ", null)) 
                return BusinessFactItem._new404(t, npt.end_token, BusinessFactItemTyp.BASE, BusinessFactKind.HAVE, npt.morph);
        }
        if (npt !== null) {
            if ((npt.noun.is_value("ОСНОВАТЕЛЬ", null) || npt.noun.is_value("ОСНОВАТЕЛЬНИЦА", null) || npt.noun.is_value("ЗАСНОВНИК", null)) || npt.noun.is_value("ЗАСНОВНИЦЯ", null)) 
                return BusinessFactItem._new404(t, npt.end_token, BusinessFactItemTyp.BASE, BusinessFactKind.CREATE, npt.morph);
        }
        return null;
    }
    
    static initialize() {
        if (BusinessFactItem.m_base_onto !== null) 
            return;
        BusinessFactItem.m_base_onto = new TerminCollection();
        for (const s of ["КУПИТЬ", "ПОКУПАТЬ", "ПРИОБРЕТАТЬ", "ПРИОБРЕСТИ", "ПОКУПКА", "ПРИОБРЕТЕНИЕ"]) {
            BusinessFactItem.m_base_onto.add(Termin._new119(s, BusinessFactKind.GET));
        }
        for (const s of ["КУПИТИ", "КУПУВАТИ", "КУПУВАТИ", "ПРИДБАТИ", "ПОКУПКА", "ПРИДБАННЯ"]) {
            BusinessFactItem.m_base_onto.add(Termin._new120(s, BusinessFactKind.GET, MorphLang.UA));
        }
        for (const s of ["ПРОДАТЬ", "ПРОДАВАТЬ", "ПРОДАЖА"]) {
            BusinessFactItem.m_base_onto.add(Termin._new119(s, BusinessFactKind.SELL));
        }
        for (const s of ["ПРОДАТИ", "ПРОДАВАТИ", "ПРОДАЖ"]) {
            BusinessFactItem.m_base_onto.add(Termin._new120(s, BusinessFactKind.SELL, MorphLang.UA));
        }
        for (const s of ["ФИНАНСИРОВАТЬ", "СПОНСИРОВАТЬ", "ПРОФИНАНСИРОВАТЬ"]) {
            BusinessFactItem.m_base_onto.add(Termin._new119(s, BusinessFactKind.FINANCE));
        }
        for (const s of ["ФІНАНСУВАТИ", "СПОНСОРУВАТИ", "ПРОФІНАНСУВАТИ"]) {
            BusinessFactItem.m_base_onto.add(Termin._new120(s, BusinessFactKind.FINANCE, MorphLang.UA));
        }
        for (const s of ["ВЛАДЕТЬ", "РАСПОРЯЖАТЬСЯ", "КОНТРОЛИРОВАТЬ", "ПРИНАДЛЕЖАТЬ", "СТАТЬ ВЛАДЕЛЬЦЕМ", "КОНСОЛИДИРОВАТЬ"]) {
            BusinessFactItem.m_base_onto.add(Termin._new119(s, BusinessFactKind.HAVE));
        }
        for (const s of ["ВОЛОДІТИ", "РОЗПОРЯДЖАТИСЯ", "КОНТРОЛЮВАТИ", "НАЛЕЖАТИ", "СТАТИ ВЛАСНИКОМ", "КОНСОЛІДУВАТИ"]) {
            BusinessFactItem.m_base_onto.add(Termin._new120(s, BusinessFactKind.HAVE, MorphLang.UA));
        }
        for (const s of ["ПРИНАДЛЕЖАЩИЙ", "КОНТРОЛИРУЕМЫЙ", "ВЛАДЕЕМЫЙ", "ПЕРЕЙТИ ПОД КОНТРОЛЬ"]) {
            BusinessFactItem.m_base_onto.add(Termin._new121(s, BusinessFactKind.HAVE, s));
        }
        for (const s of ["НАЛЕЖНИЙ", "КОНТРОЛЬОВАНИЙ", "ВЛАДЕЕМЫЙ", "ПЕРЕЙТИ ПІД КОНТРОЛЬ"]) {
            BusinessFactItem.m_base_onto.add(Termin._new416(s, BusinessFactKind.HAVE, s, MorphLang.UA));
        }
        for (const s of ["ЗАКРЫТЬ СДЕЛКУ", "СОВЕРШИТЬ СДЕЛКУ", "ЗАВЕРШИТЬ СДЕЛКУ", "ЗАКЛЮЧИТЬ"]) {
            BusinessFactItem.m_base_onto.add(Termin._new119(s, BusinessFactKind.UNDEFINED));
        }
        for (const s of ["ЗАКРИТИ ОПЕРАЦІЮ", "ЗДІЙСНИТИ ОПЕРАЦІЮ", "ЗАВЕРШИТИ ОПЕРАЦІЮ", "УКЛАСТИ"]) {
            BusinessFactItem.m_base_onto.add(Termin._new120(s, BusinessFactKind.UNDEFINED, MorphLang.UA));
        }
        for (const s of ["ДОХОД", "ПРИБЫЛЬ", "ВЫРУЧКА"]) {
            BusinessFactItem.m_base_onto.add(Termin._new119(s, BusinessFactKind.PROFIT));
        }
        for (const s of ["ДОХІД", "ПРИБУТОК", "ВИРУЧКА"]) {
            BusinessFactItem.m_base_onto.add(Termin._new120(s, BusinessFactKind.PROFIT, MorphLang.UA));
        }
        for (const s of ["УБЫТОК"]) {
            BusinessFactItem.m_base_onto.add(Termin._new119(s, BusinessFactKind.DAMAGES));
        }
        for (const s of ["ЗБИТОК"]) {
            BusinessFactItem.m_base_onto.add(Termin._new120(s, BusinessFactKind.DAMAGES, MorphLang.UA));
        }
        for (const s of ["СОГЛАШЕНИЕ", "ДОГОВОР"]) {
            BusinessFactItem.m_base_onto.add(Termin._new119(s, BusinessFactKind.AGREEMENT));
        }
        for (const s of ["УГОДА", "ДОГОВІР"]) {
            BusinessFactItem.m_base_onto.add(Termin._new120(s, BusinessFactKind.AGREEMENT, MorphLang.UA));
        }
        for (const s of ["ИСК", "СУДЕБНЫЙ ИСК"]) {
            BusinessFactItem.m_base_onto.add(Termin._new119(s, BusinessFactKind.LAWSUIT));
        }
        for (const s of ["ПОЗОВ", "СУДОВИЙ ПОЗОВ"]) {
            BusinessFactItem.m_base_onto.add(Termin._new120(s, BusinessFactKind.LAWSUIT, MorphLang.UA));
        }
        for (const s of ["ДОЧЕРНЕЕ ПРЕДПРИЯТИЕ", "ДОЧЕРНЕЕ ПОДРАЗДЕЛЕНИЕ", "ДОЧЕРНЯЯ КОМПАНИЯ"]) {
            BusinessFactItem.m_base_onto.add(Termin._new119(s, BusinessFactKind.SUBSIDIARY));
        }
        for (const s of ["ДОЧІРНЄ ПІДПРИЄМСТВО", "ДОЧІРНІЙ ПІДРОЗДІЛ", "ДОЧІРНЯ КОМПАНІЯ"]) {
            BusinessFactItem.m_base_onto.add(Termin._new120(s, BusinessFactKind.SUBSIDIARY, MorphLang.UA));
        }
    }
    
    static _new403(_arg1, _arg2, _arg3, _arg4, _arg5, _arg6) {
        let res = new BusinessFactItem(_arg1, _arg2);
        res.typ = _arg3;
        res.base_kind = _arg4;
        res.morph = _arg5;
        res.is_base_passive = _arg6;
        return res;
    }
    
    static _new404(_arg1, _arg2, _arg3, _arg4, _arg5) {
        let res = new BusinessFactItem(_arg1, _arg2);
        res.typ = _arg3;
        res.base_kind = _arg4;
        res.morph = _arg5;
        return res;
    }
    
    static static_constructor() {
        BusinessFactItem.m_base_onto = null;
    }
}


BusinessFactItem.static_constructor();

module.exports = BusinessFactItem