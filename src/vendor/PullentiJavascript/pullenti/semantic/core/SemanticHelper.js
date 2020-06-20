/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const Hashtable = require("./../../unisharp/Hashtable");

const MorphCase = require("./../../morph/MorphCase");
const SemanticLink = require("./SemanticLink");
const MetaToken = require("./../../ner/MetaToken");
const QuestionType = require("./../utils/QuestionType");
const SemanticAbstractSlave = require("./SemanticAbstractSlave");
const SemanticRole = require("./SemanticRole");
const MorphNumber = require("./../../morph/MorphNumber");
const MorphPerson = require("./../../morph/MorphPerson");
const ControlModelQuestion = require("./../utils/ControlModelQuestion");
const MorphBaseInfo = require("./../../morph/MorphBaseInfo");
const MorphGender = require("./../../morph/MorphGender");
const MorphClass = require("./../../morph/MorphClass");
const NounPhraseToken = require("./../../ner/core/NounPhraseToken");
const ControlModelItemType = require("./../utils/ControlModelItemType");
const VerbPhraseToken = require("./../../ner/core/VerbPhraseToken");
const TextToken = require("./../../ner/TextToken");
const Token = require("./../../ner/Token");
const MorphWordForm = require("./../../morph/MorphWordForm");
const VerbPhraseItemToken = require("./../../ner/core/VerbPhraseItemToken");
const Explanatory = require("./../utils/Explanatory");

/**
 * Полезные фукнции для семантического анализа
 */
class SemanticHelper {
    
    static get_keyword(mt) {
        let vpt = Utils.as(mt, VerbPhraseToken);
        if (vpt !== null) 
            return (vpt.last_verb.verb_morph.normal_full != null ? vpt.last_verb.verb_morph.normal_full : vpt.last_verb.verb_morph.normal_case);
        let npt = Utils.as(mt, NounPhraseToken);
        if (npt !== null) 
            return npt.noun.end_token.get_normal_case_text(MorphClass.NOUN, true, MorphGender.UNDEFINED, false);
        return null;
    }
    
    static find_derivates(t) {
        let res = null;
        let cla = null;
        if (t instanceof NounPhraseToken) {
            t = (t).noun.end_token;
            cla = MorphClass.NOUN;
        }
        if (t instanceof TextToken) {
            res = Explanatory.find_derivates((t).lemma, true, null);
            if (res !== null && res.length > 0) 
                return res;
            for (const f of t.morph.items) {
                if (f instanceof MorphWordForm) {
                    if (cla !== null) {
                        if ((MorphClass.ooBitand(cla, f.class0)).is_undefined) 
                            continue;
                    }
                    res = Explanatory.find_derivates(((f).normal_full != null ? (f).normal_full : (f).normal_case), true, null);
                    if (res !== null && res.length > 0) 
                        return res;
                }
            }
            return null;
        }
        if (t instanceof VerbPhraseToken) 
            return SemanticHelper.find_derivates((t).last_verb);
        if (t instanceof VerbPhraseItemToken) {
            let vpt = Utils.as(t, VerbPhraseItemToken);
            if (vpt.verb_morph !== null) {
                res = Explanatory.find_derivates(vpt.verb_morph.normal_full, true, null);
                if (res === null || res.length === 0) 
                    res = Explanatory.find_derivates(vpt.verb_morph.normal_case, true, null);
            }
            return res;
        }
        return null;
    }
    
    static find_control_item(mt, gr) {
        if (gr === null) 
            return null;
        if (mt instanceof NounPhraseToken) {
            let t = (mt).noun.end_token;
            for (const m of gr.model.items) {
                if (m.word !== null) {
                    if (t.is_value(m.word, null)) 
                        return m;
                }
            }
            for (const w of gr.words) {
                if (w.attrs.is_verb_noun) {
                    if (t.is_value(w.spelling, null)) 
                        return gr.model.find_item_by_typ(ControlModelItemType.NOUN);
                }
            }
            return null;
        }
        if (mt instanceof VerbPhraseItemToken) {
            let ti = Utils.as(mt, VerbPhraseItemToken);
            let rev = ti.is_verb_reversive;
            for (const it of gr.model.items) {
                if (rev && it.typ === ControlModelItemType.REFLEXIVE) 
                    return it;
                else if (!rev && it.typ === ControlModelItemType.VERB) 
                    return it;
            }
        }
        return null;
    }
    
    /**
     * Попробовать создать семантическую связь между элементами. 
     *  Элементом м.б. именная (NounPhraseToken) или глагольная группа (VerbPhraseToken).
     * @param master основной элемент
     * @param slave стыкуемый элемент (также м.б. SemanticAbstractSlave)
     * @param onto дополнительный онтологический словарь
     * @return список вариантов (возможно, пустой)
     */
    static try_create_link(master, slave, onto = null) {
        let res = new Array();
        let vpt1 = Utils.as(master, VerbPhraseToken);
        let vpt2 = Utils.as(slave, VerbPhraseToken);
        let npt1 = Utils.as(master, NounPhraseToken);
        if (slave instanceof NounPhraseToken) 
            slave = SemanticAbstractSlave.create_from_noun(Utils.as(slave, NounPhraseToken));
        let sla2 = Utils.as(slave, SemanticAbstractSlave);
        if (vpt2 !== null) {
            if (!vpt2.first_verb.is_verb_infinitive || !vpt2.last_verb.is_verb_infinitive) 
                return res;
        }
        let grs = SemanticHelper.find_derivates(master);
        if (grs === null || grs.length === 0) {
            let rl = (vpt1 !== null ? SemanticHelper._try_create_verb(vpt1, slave, null) : SemanticHelper._try_create_noun(npt1, slave, null));
            if (rl !== null) 
                res.splice(res.length, 0, ...rl);
            if (npt1 !== null && sla2 !== null && res.length === 0) {
                if (sla2.morph._case.is_genitive && sla2.preposition === null) {
                    if (npt1.end_token.next === sla2.begin_token) 
                        res.push(SemanticLink._new2862(npt1, sla2, 0.5, MorphCase.GENITIVE, "какой"));
                }
            }
        }
        else 
            for (const gr of grs) {
                let rl = (vpt1 !== null ? SemanticHelper._try_create_verb(vpt1, slave, gr) : SemanticHelper._try_create_noun(npt1, slave, gr));
                if (rl !== null) 
                    res.splice(res.length, 0, ...rl);
            }
        if (onto !== null) {
            let str1 = SemanticHelper.get_keyword(master);
            let str2 = SemanticHelper.get_keyword(slave);
            if (str2 !== null) {
                if (onto.check_link(str1, str2)) {
                    if (res.length > 0) {
                        for (const r of res) {
                            r.rank += (3);
                        }
                    }
                    else 
                        res.push(SemanticLink._new2863(master, slave, 3));
                }
            }
        }
        if (npt1 !== null) {
            if (((npt1.adjectives.length > 0 && npt1.adjectives[0].begin_token.morph.class0.is_pronoun)) || npt1.anafor !== null) {
                for (const r of res) {
                    if (r.slave_preposition === null && r.slave_case !== null && r.slave_case.is_genitive) 
                        r.rank -= 0.5;
                }
            }
        }
        for (let i = 0; i < res.length; i++) {
            if (res[i].role === SemanticRole.AGENTORINSTRUMENT) {
                res[i].role = SemanticRole.AGENT;
                let r = SemanticLink._new2864(SemanticRole.INSTRUMENT, res[i].rank, res[i].slave_case);
                res.splice(i + 1, 0, r);
            }
        }
        for (let i = 0; i < res.length; i++) {
            for (let j = 0; j < (res.length - 1); j++) {
                if (res[j].compareTo(res[j + 1]) > 0) {
                    let r = res[j];
                    res[j] = res[j + 1];
                    res[j + 1] = r;
                }
            }
        }
        for (const r of res) {
            r.master = master;
            r.slave = slave;
        }
        return res;
    }
    
    static _try_create_inf(master, vpt2, gr) {
        let cit = SemanticHelper.find_control_item(master, gr);
        let cit0 = null;
        let res = new Array();
        if (cit !== null && cit.check_inf()) 
            res.push(SemanticLink._new2865(QuestionType.WHATTODO, 1, "что делать"));
        else if (cit0 !== null && cit0.check_inf()) 
            res.push(SemanticLink._new2865(QuestionType.WHATTODO, 1, "что делать"));
        return res;
    }
    
    static _try_create_noun(npt1, slave, gr) {
        if (slave instanceof VerbPhraseToken) 
            return SemanticHelper._try_create_inf(npt1, Utils.as(slave, VerbPhraseToken), gr);
        let sla2 = Utils.as(slave, SemanticAbstractSlave);
        let res = new Array();
        if (sla2 === null) 
            return res;
        let cit = SemanticHelper.find_control_item(npt1, gr);
        SemanticHelper._create_roles(cit, sla2.preposition, sla2.morph._case, res, false, false);
        return res;
    }
    
    static _try_create_verb(vpt1, slave, gr) {
        if (slave instanceof VerbPhraseToken) 
            return SemanticHelper._try_create_inf(vpt1, Utils.as(slave, VerbPhraseToken), gr);
        let sla2 = Utils.as(slave, SemanticAbstractSlave);
        let res = new Array();
        if (sla2 === null) 
            return res;
        let cit = SemanticHelper.find_control_item(vpt1.last_verb, gr);
        let prep = sla2.preposition;
        let _morph = sla2.morph;
        let is_rev1 = vpt1.last_verb.is_verb_reversive;
        let no_nomin = false;
        let no_instr = false;
        if (prep === null && _morph._case.is_nominative && !vpt1.first_verb.is_participle) {
            let ok = true;
            let vm = vpt1.first_verb.verb_morph;
            if (vm.number === MorphNumber.SINGULAR) {
                if (_morph.number === MorphNumber.PLURAL) 
                    ok = false;
            }
            if (!SemanticHelper.check_morph_accord(_morph, false, vm, false)) 
                ok = false;
            else if (vm.misc.person !== MorphPerson.UNDEFINED) {
                if ((((vm.misc.person.value()) & (MorphPerson.THIRD.value()))) === (MorphPerson.UNDEFINED.value())) {
                    if ((((vm.misc.person.value()) & (MorphPerson.FIRST.value()))) === (MorphPerson.FIRST.value())) {
                        if (!_morph.contains_attr("1 л.", null)) 
                            ok = false;
                    }
                    if ((((vm.misc.person.value()) & (MorphPerson.SECOND.value()))) === (MorphPerson.SECOND.value())) {
                        if (!_morph.contains_attr("2 л.", null)) 
                            ok = false;
                    }
                }
            }
            if (ok) {
                no_nomin = true;
                let cit00 = cit;
                let sl = null;
                if (cit00 === null) 
                    sl = SemanticLink._new2864((is_rev1 ? SemanticRole.PACIENT : SemanticRole.AGENT), 1, MorphCase.NOMINATIVE);
                else 
                    for (const kp of cit00.links.entries) {
                        if (kp.key.check(null, MorphCase.NOMINATIVE)) 
                            sl = SemanticLink._new2864(kp.value, 2, MorphCase.NOMINATIVE);
                    }
                if (sl !== null) {
                    if (cit00 === null && _morph._case.is_instrumental && is_rev1) 
                        sl.rank -= 0.5;
                    if (_morph._case.is_accusative) 
                        sl.rank -= 0.5;
                    if (sla2.begin_char > vpt1.begin_char) 
                        sl.rank -= 0.5;
                    res.push(sl);
                }
            }
        }
        if (prep === null && is_rev1 && _morph._case.is_instrumental) {
            no_instr = true;
            let cit00 = cit;
            if (vpt1.first_verb !== vpt1.last_verb) {
                cit00 = null;
                let grs = SemanticHelper.find_derivates(vpt1.first_verb);
                if (grs !== null) {
                    for (const gg of grs) {
                        if ((((cit00 = SemanticHelper.find_control_item(vpt1.first_verb, gg)))) !== null) 
                            break;
                    }
                }
            }
            let sl = null;
            if (cit00 === null) 
                sl = SemanticLink._new2864(SemanticRole.AGENT, 1, MorphCase.INSTRUMENTAL);
            else 
                for (const kp of cit00.links.entries) {
                    if (kp.key.check(null, MorphCase.INSTRUMENTAL)) 
                        sl = SemanticLink._new2864(kp.value, 2, MorphCase.INSTRUMENTAL);
                }
            if (sl !== null) {
                if (cit00 === null && _morph._case.is_nominative) 
                    sl.rank -= 0.5;
                if (_morph._case.is_accusative) 
                    sl.rank -= 0.5;
                if (sla2.begin_char < vpt1.begin_char) 
                    sl.rank -= 0.5;
                res.push(sl);
            }
        }
        if (prep === null && _morph._case.is_dative && ((cit === null || !cit.links.containsKey(ControlModelQuestion.DATIVE)))) {
            let sl = SemanticLink._new2864(SemanticRole.INSTRUMENT, 1, MorphCase.DATIVE);
            if (_morph._case.is_accusative || _morph._case.is_nominative) 
                sl.rank -= 0.5;
            if (vpt1.end_token.next !== sla2.begin_token) 
                sl.rank -= 0.5;
            if (cit !== null) 
                sl.rank -= 0.5;
            res.push(sl);
        }
        SemanticHelper._create_roles(cit, prep, _morph._case, res, no_nomin, no_instr);
        return res;
    }
    
    static _create_roles(cit, prep, cas, res, ignore_nomin_case = false, ignore_instr_case = false) {
        let roles = null;
        for (const li of cit.links.entries) {
            if (li.key.check(prep, cas)) {
                if (ignore_nomin_case && li.key._case.is_nominative && li.key.preposition === null) 
                    continue;
                if (ignore_instr_case && li.key._case.is_instrumental && li.key.preposition === null) 
                    continue;
                if (roles === null) 
                    roles = new Hashtable();
                if (!roles.containsKey(li.key)) 
                    roles.put(li.key, li.value);
                else if (li.value !== SemanticRole.UNDEFINED) 
                    roles.put(li.key, li.value);
            }
        }
        if (roles !== null) {
            for (const kp of roles.entries) {
                let sl = SemanticLink._new2872(kp.value, 2, kp.key.spelling_ex, kp.key.question, kp.key._case, kp.key.preposition);
                if (kp.value !== SemanticRole.UNDEFINED) 
                    sl.rank++;
                res.push(sl);
            }
        }
    }
    
    static check_morph_accord(m, plural, vf, check_case = false) {
        if (check_case && !m._case.is_undefined && !vf._case.is_undefined) {
            if ((MorphCase.ooBitand(m._case, vf._case)).is_undefined) 
                return false;
        }
        let coef = 0;
        if (vf.number === MorphNumber.PLURAL) {
            if (plural) 
                coef++;
            else if (m.number !== MorphNumber.UNDEFINED) {
                if ((((m.number.value()) & (MorphNumber.PLURAL.value()))) === (MorphNumber.PLURAL.value())) 
                    coef++;
                else 
                    return false;
            }
        }
        else if (vf.number === MorphNumber.SINGULAR) {
            if (plural) 
                return false;
            if (m.number !== MorphNumber.UNDEFINED) {
                if ((((m.number.value()) & (MorphNumber.SINGULAR.value()))) === (MorphNumber.SINGULAR.value())) 
                    coef++;
                else 
                    return false;
            }
            if (m.gender !== MorphGender.UNDEFINED) {
                if (vf.gender !== MorphGender.UNDEFINED) {
                    if (m.gender === MorphGender.FEMINIE) {
                        if ((((vf.gender.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value())) 
                            coef++;
                        else 
                            return false;
                    }
                    else if ((((m.gender.value()) & (vf.gender.value()))) !== (MorphGender.UNDEFINED.value())) 
                        coef++;
                    else if (m.gender === MorphGender.MASCULINE && vf.gender === MorphGender.FEMINIE) {
                    }
                    else 
                        return false;
                }
            }
        }
        return coef >= 0;
    }
}


module.exports = SemanticHelper