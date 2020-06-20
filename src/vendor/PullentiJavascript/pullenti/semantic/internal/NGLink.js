/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../../unisharp/Utils");
const StringBuilder = require("./../../unisharp/StringBuilder");

const MorphGender = require("./../../morph/MorphGender");
const MorphCase = require("./../../morph/MorphCase");
const MorphNumber = require("./../../morph/MorphNumber");
const MorphBaseInfo = require("./../../morph/MorphBaseInfo");
const MorphPerson = require("./../../morph/MorphPerson");
const TextToken = require("./../../ner/TextToken");
const NounPhraseToken = require("./../../ner/core/NounPhraseToken");
const MorphVoice = require("./../../morph/MorphVoice");
const MorphMood = require("./../../morph/MorphMood");
const QuestionType = require("./../utils/QuestionType");
const MeasureKind = require("./../../ner/measure/MeasureKind");
const Explanatory = require("./../utils/Explanatory");
const SentItemType = require("./SentItemType");
const NGLinkType = require("./NGLinkType");
const UnitsHelper = require("./../../ner/measure/internal/UnitsHelper");
const Token = require("./../../ner/Token");
const SemanticService = require("./../SemanticService");
const VerbPhraseToken = require("./../../ner/core/VerbPhraseToken");
const UnitToken = require("./../../ner/measure/internal/UnitToken");
const NumbersWithUnitToken = require("./../../ner/measure/internal/NumbersWithUnitToken");

class NGLink {
    
    constructor() {
        this.typ = NGLinkType.UNDEFINED;
        this.from = null;
        this.to = null;
        this.to_verb = null;
        this.coef = 0;
        this.plural = -1;
        this.from_is_plural = false;
        this.reverce = false;
        this.to_all_list_items = false;
        this.can_be_pacient = false;
        this.can_be_participle = false;
        this.alt_link = null;
    }
    
    get from_morph() {
        if (this.from.source.source !== null) 
            return this.from.source.source.morph;
        return null;
    }
    
    get from_prep() {
        return (this.from.source.prep != null ? this.from.source.prep : "");
    }
    
    get to_morph() {
        if (this.to !== null && this.to.source.source !== null) 
            return this.to.source.source.morph;
        return null;
    }
    
    toString() {
        let tmp = new StringBuilder();
        tmp.append(this.coef).append(": ").append(this.typ.toString()).append(" ");
        if (this.plural === 1) 
            tmp.append(" PLURAL ");
        else if (this.plural === 0) 
            tmp.append(" SINGLE ");
        if (this.reverce) 
            tmp.append(" REVERCE ");
        tmp.append(this.from.source.toString());
        if (this.to_all_list_items) 
            tmp.append(" ALLLISTITEMS ");
        if (this.to !== null) 
            tmp.append(" -> ").append(this.to.source.toString());
        else if (this.to_verb !== null) 
            tmp.append(" -> ").append(this.to_verb.toString());
        if (this.alt_link !== null) 
            tmp.append(" / ALTLINK: ").append(this.alt_link.toString());
        return tmp.toString();
    }
    
    compareTo(other) {
        if (this.coef > other.coef) 
            return -1;
        if (this.coef < other.coef) 
            return 1;
        return 0;
    }
    
    calc_coef(noplural = false) {
        this.coef = -1;
        this.can_be_pacient = false;
        this.to_all_list_items = false;
        this.plural = -1;
        if (this.typ === NGLinkType.GENETIVE && this.to !== null) 
            this._calc_genetive();
        else if (this.typ === NGLinkType.NAME && this.to !== null) 
            this._calc_name(noplural);
        else if (this.typ === NGLinkType.BE && this.to !== null) 
            this._calc_be();
        else if (this.typ === NGLinkType.LIST) 
            this._calc_list();
        else if (this.typ === NGLinkType.PARTICIPLE && this.to !== null) 
            this._calc_participle(noplural);
        else if (this.to_verb !== null && this.to_verb.first_verb !== null) {
            if (this.typ === NGLinkType.AGENT) 
                this._calc_agent(noplural);
            else if (this.typ === NGLinkType.PACIENT) 
                this._calc_pacient(noplural);
            else if (this.typ === NGLinkType.ACTANT) 
                this._calc_actant();
        }
        else if (this.typ === NGLinkType.ADVERB) 
            this._calc_adverb();
    }
    
    _calc_genetive() {
        if (!this.from.source.can_be_noun) 
            return;
        if (this.from.source.typ === SentItemType.FORMULA) {
            if (this.to.source.typ !== SentItemType.NOUN) 
                return;
            this.coef = SemanticService.PARAMS.transitive_coef;
            return;
        }
        let frmorph = this.from_morph;
        if (this.to.source.typ === SentItemType.FORMULA) {
            if (this.from.source.typ !== SentItemType.NOUN) 
                return;
            if (frmorph._case.is_genitive) 
                this.coef = SemanticService.PARAMS.transitive_coef;
            else if (frmorph._case.is_undefined) 
                this.coef = 0;
            return;
        }
        if (this.from.source.source instanceof NumbersWithUnitToken) {
            if (this.from.order !== (this.to.order + 1)) 
                return;
            let num = Utils.as(this.from.source.source, NumbersWithUnitToken);
            let ki = UnitToken.calc_kind(num.units);
            if (ki !== MeasureKind.UNDEFINED) {
                if (UnitsHelper.check_keyword(ki, this.to.source.source)) {
                    this.coef = SemanticService.PARAMS.next_model * (3);
                    return;
                }
            }
            if (this.to.source.source instanceof NumbersWithUnitToken) 
                return;
        }
        let non_gen_text = false;
        if (Utils.isNullOrEmpty(this.from_prep) && !((this.from.source.source instanceof VerbPhraseToken))) {
            if (this.from.order !== (this.to.order + 1)) 
                non_gen_text = true;
        }
        if (this.to.source.dr_groups !== null) {
            for (const gr of this.to.source.dr_groups) {
                if (gr.cm.transitive && Utils.isNullOrEmpty(this.from_prep)) {
                    let ok = false;
                    if (this.to.source.source instanceof VerbPhraseToken) {
                        if (frmorph._case.is_accusative) {
                            ok = true;
                            this.can_be_pacient = true;
                        }
                    }
                    else if (frmorph._case.is_genitive && this.from.order === (this.to.order + 1)) 
                        ok = true;
                    if (ok) {
                        this.coef = SemanticService.PARAMS.transitive_coef;
                        return;
                    }
                }
                if ((((gr.cm.questions.value()) & (QuestionType.WHATTODO.value()))) !== (QuestionType.UNDEFINED.value()) && (this.from.source.source instanceof VerbPhraseToken)) {
                    this.coef = SemanticService.PARAMS.transitive_coef;
                    return;
                }
                if (gr.cm.nexts !== null) {
                    if (gr.cm.nexts.containsKey(this.from_prep)) {
                        let cas = gr.cm.nexts.get(this.from_prep);
                        if (!(MorphCase.ooBitand(cas, frmorph._case)).is_undefined) {
                            if (Utils.isNullOrEmpty(this.from_prep) && this.from.order !== (this.to.order + 1) && (MorphCase.ooBitand(cas, frmorph._case)).is_genitive) {
                            }
                            else {
                                this.coef = SemanticService.PARAMS.next_model;
                                return;
                            }
                        }
                    }
                }
            }
        }
        if (non_gen_text || !Utils.isNullOrEmpty(this.from_prep)) 
            return;
        let cas0 = frmorph._case;
        if (cas0.is_genitive || cas0.is_instrumental || cas0.is_dative) {
            if ((this.to.source.source instanceof NumbersWithUnitToken) && cas0.is_genitive) 
                this.coef = SemanticService.PARAMS.transitive_coef;
            else {
                this.coef = SemanticService.PARAMS.ng_link;
                if (cas0.is_nominative || this.from.source.typ === SentItemType.PARTBEFORE) 
                    this.coef /= (2);
                if (!cas0.is_genitive) 
                    this.coef /= (2);
            }
        }
        else if (this.from.source.source instanceof VerbPhraseToken) 
            this.coef = 0.1;
        if ((this.to.source.source instanceof NumbersWithUnitToken) && this.to.source.end_token.is_value("ЧЕМ", null)) 
            this.coef = SemanticService.PARAMS.transitive_coef * (2);
    }
    
    _calc_be() {
        if (this.to.source.typ !== SentItemType.NOUN || this.from.source.typ !== SentItemType.NOUN) 
            return;
        let fm = this.from.source.source.morph;
        let tm = this.to.source.source.morph;
        if (!((tm._case.is_nominative))) 
            return;
        if (!Utils.isNullOrEmpty(this.from_prep)) 
            return;
        if (this.from.source.source instanceof NumbersWithUnitToken) {
            this.coef = SemanticService.PARAMS.transitive_coef;
            return;
        }
        if (!fm._case.is_undefined) {
            if (!fm._case.is_nominative) 
                return;
        }
        this.coef = 0;
    }
    
    _calc_name(noplural) {
        if (!Utils.isNullOrEmpty(this.from_prep)) 
            return;
        if (!((this.from.source.source instanceof NounPhraseToken)) || this.from.source.typ !== SentItemType.NOUN) 
            return;
        if (this.from.source.begin_token.chars.is_all_lower) 
            return;
        if (!((this.to.source.source instanceof NounPhraseToken)) || this.to.source.typ !== SentItemType.NOUN) 
            return;
        if (this.from.order !== (this.to.order + 1) && !noplural) 
            return;
        let fm = this.from.source.source.morph;
        let tm = this.to.source.source.morph;
        if (!fm._case.is_undefined && !tm._case.is_undefined) {
            if ((MorphCase.ooBitand(tm._case, fm._case)).is_undefined) 
                return;
        }
        if (fm.number === MorphNumber.PLURAL) {
            if (noplural) {
                if (this.from_is_plural) {
                }
                else if ((((tm.number.value()) & (MorphNumber.SINGULAR.value()))) !== (MorphNumber.UNDEFINED.value())) 
                    return;
            }
            this.plural = 1;
            this.coef = SemanticService.PARAMS.verb_plural;
        }
        else {
            if (fm.number === MorphNumber.SINGULAR) 
                this.plural = 0;
            if (NGLink._check_morph_accord(fm, false, tm)) 
                this.coef = SemanticService.PARAMS.morph_accord;
        }
    }
    
    _calc_adverb() {
        if (this.to_verb !== null) 
            this.coef = 1;
        else if (this.to === null) 
            return;
        else if (this.to.source.typ === SentItemType.ADVERB) 
            this.coef = 1;
        else 
            this.coef = 0.5;
    }
    
    _calc_list() {
        let cas0 = this.from_morph._case;
        if (this.to === null) {
            if (this.to_verb === null) 
                return;
            return;
        }
        if (this.from.source.typ !== this.to.source.typ) {
            if (this.from.source.prep === this.to.source.prep && ((this.from.source.typ === SentItemType.NOUN || this.from.source.typ === SentItemType.PARTBEFORE || this.from.source.typ === SentItemType.PARTAFTER)) && ((this.to.source.typ === SentItemType.NOUN || this.to.source.typ === SentItemType.PARTBEFORE || this.to.source.typ === SentItemType.PARTAFTER))) {
            }
            else 
                return;
        }
        let cas1 = this.to_morph._case;
        if (!(MorphCase.ooBitand(cas0, cas1)).is_undefined) {
            this.coef = SemanticService.PARAMS.list;
            if (Utils.isNullOrEmpty(this.from_prep) && !Utils.isNullOrEmpty(this.to.source.prep)) 
                this.coef /= (2);
            else if (!Utils.isNullOrEmpty(this.from_prep) && Utils.isNullOrEmpty(this.to.source.prep)) 
                this.coef /= (4);
        }
        else {
            if (!cas0.is_undefined && !cas1.is_undefined) 
                return;
            if (!Utils.isNullOrEmpty(this.from_prep) && Utils.isNullOrEmpty(this.to.source.prep)) 
                return;
            this.coef = SemanticService.PARAMS.list;
        }
        let t1 = Utils.as(this.from.source.end_token, TextToken);
        let t2 = Utils.as(this.to.source.end_token, TextToken);
        if (t1 !== null && t2 !== null) {
            if (t1.is_value(t2.get_normal_case_text(null, true, MorphGender.UNDEFINED, false), null)) 
                this.coef *= (10);
        }
        if (this.from.source.typ !== this.to.source.typ) 
            this.coef /= (2);
    }
    
    _calc_participle(noplural) {
        let fm = this.from.source.source.morph;
        let tm = this.to.source.source.morph;
        if (this.to.source.typ === SentItemType.PARTBEFORE) 
            return this.coef = -1;
        if (this.from.source.typ === SentItemType.DEEPART) {
            if (!Utils.isNullOrEmpty(this.to.source.prep)) 
                return this.coef = -1;
            if (tm._case.is_nominative) 
                return this.coef = SemanticService.PARAMS.morph_accord;
            if (tm._case.is_undefined) 
                return this.coef = 0;
            return this.coef = -1;
        }
        if (this.from.source.typ !== SentItemType.PARTBEFORE && this.from.source.typ !== SentItemType.SUBSENT) 
            return this.coef = -1;
        if (!fm._case.is_undefined && !tm._case.is_undefined) {
            if ((MorphCase.ooBitand(fm._case, tm._case)).is_undefined) {
                if (this.from.source.typ === SentItemType.PARTBEFORE) 
                    return this.coef = -1;
            }
        }
        if (fm.number === MorphNumber.PLURAL) {
            if (noplural) {
                if (this.from_is_plural) {
                }
                else if ((((tm.number.value()) & (MorphNumber.PLURAL.value()))) === (MorphNumber.UNDEFINED.value())) 
                    return this.coef = -1;
            }
            this.plural = 1;
            this.coef = SemanticService.PARAMS.verb_plural;
        }
        else {
            if (fm.number === MorphNumber.SINGULAR) 
                this.plural = 0;
            if (fm.items.length > 0) {
                for (const wf of fm.items) {
                    if (NGLink._check_morph_accord(tm, false, wf)) {
                        this.coef = SemanticService.PARAMS.morph_accord;
                        if (tm.gender !== MorphGender.UNDEFINED && wf.gender !== MorphGender.UNDEFINED) {
                            if ((((tm.gender.value()) & (wf.gender.value()))) === (MorphGender.UNDEFINED.value())) 
                                this.coef /= (2);
                        }
                        break;
                    }
                }
            }
        }
        return this.coef;
    }
    
    _calc_agent(noplural) {
        if (!Utils.isNullOrEmpty(this.from_prep)) 
            return this.coef = -1;
        let vf = this.to_verb.first_verb.verb_morph;
        if (vf === null) 
            return this.coef = -1;
        let vf2 = this.to_verb.last_verb.verb_morph;
        if (vf2 === null) 
            return this.coef = -1;
        if (vf.misc.mood === MorphMood.IMPERATIVE) 
            return this.coef = -1;
        let _morph = this.from_morph;
        if (vf2.misc.voice === MorphVoice.PASSIVE || this.to_verb.last_verb.morph.contains_attr("страд.з.", null)) {
            if (!_morph._case.is_undefined) {
                if (_morph._case.is_instrumental) {
                    this.coef = SemanticService.PARAMS.transitive_coef;
                    if (vf2._case.is_instrumental) 
                        this.coef /= (2);
                    return this.coef;
                }
                return this.coef = -1;
            }
            return this.coef = 0;
        }
        if (vf.misc.attrs.includes("инф.")) 
            return this.coef = -1;
        if (NGLink._is_rev_verb(vf2)) {
            let ag_case = MorphCase.UNDEFINED;
            let grs = Explanatory.find_derivates((vf2.normal_full != null ? vf2.normal_full : vf2.normal_case), true, null);
            if (grs !== null) {
                for (const gr of grs) {
                    if (gr.cm_rev.agent !== null) {
                        ag_case = gr.cm_rev.agent._case;
                        break;
                    }
                }
            }
            if (!_morph._case.is_undefined) {
                if (ag_case.is_dative) {
                    if (_morph._case.is_dative) {
                        this.coef = SemanticService.PARAMS.transitive_coef;
                        if (_morph._case.is_genitive) 
                            this.coef /= (2);
                        return this.coef;
                    }
                    return this.coef = -1;
                }
                if (ag_case.is_instrumental) {
                    if (_morph._case.is_instrumental) {
                        if (_morph._case.is_nominative) 
                            return this.coef = 0;
                        return this.coef = SemanticService.PARAMS.transitive_coef;
                    }
                    return this.coef = -1;
                }
                if (!_morph._case.is_nominative) 
                    return this.coef = -1;
            }
            else 
                return this.coef = 0;
        }
        if (vf.number === MorphNumber.PLURAL) {
            if (!_morph._case.is_undefined) {
                if (vf._case.is_undefined) {
                    if (!_morph._case.is_nominative) 
                        return this.coef = -1;
                }
                else if ((MorphCase.ooBitand(vf._case, _morph._case)).is_undefined) 
                    return this.coef = -1;
            }
            if (noplural) {
                if (this.from_is_plural) {
                }
                else if ((((_morph.number.value()) & (MorphNumber.PLURAL.value()))) === (MorphNumber.UNDEFINED.value())) 
                    return this.coef = -1;
                else if (!NGLink._check_morph_accord(_morph, false, vf)) 
                    return this.coef = -1;
                else if (_morph.items.length > 0 && !vf._case.is_undefined) {
                    let ok = false;
                    for (const it of _morph.items) {
                        if ((((it.number.value()) & (MorphNumber.PLURAL.value()))) === (MorphNumber.PLURAL.value())) {
                            if (!it._case.is_undefined && (MorphCase.ooBitand(it._case, vf._case)).is_undefined) 
                                continue;
                            ok = true;
                            break;
                        }
                    }
                    if (!ok) 
                        return this.coef = -1;
                }
            }
            this.plural = 1;
            this.coef = SemanticService.PARAMS.verb_plural;
            if (vf2.normal_case === "БЫТЬ") {
                if (_morph._case.is_undefined && this.from.source.begin_token.begin_char > this.to_verb.end_char) 
                    this.coef /= (2);
            }
        }
        else {
            if (vf.number === MorphNumber.SINGULAR) {
                this.plural = 0;
                if (this.from_is_plural) 
                    return this.coef = -1;
            }
            if (!NGLink._check_morph_accord(_morph, false, vf)) 
                return this.coef = -1;
            if (!_morph._case.is_undefined) {
                if (!_morph._case.is_nominative) {
                    if (this.to_verb.first_verb.is_participle) {
                    }
                    else 
                        return this.coef = -1;
                }
            }
            if (vf.misc.person !== MorphPerson.UNDEFINED) {
                if ((((vf.misc.person.value()) & (MorphPerson.THIRD.value()))) === (MorphPerson.UNDEFINED.value())) {
                    if ((((vf.misc.person.value()) & (MorphPerson.FIRST.value()))) === (MorphPerson.FIRST.value())) {
                        if (!_morph.contains_attr("1 л.", null)) 
                            return this.coef = -1;
                    }
                    if ((((vf.misc.person.value()) & (MorphPerson.SECOND.value()))) === (MorphPerson.SECOND.value())) {
                        if (!_morph.contains_attr("2 л.", null)) 
                            return this.coef = -1;
                    }
                }
            }
            this.coef = SemanticService.PARAMS.morph_accord;
            if (_morph._case.is_undefined) 
                this.coef /= (4);
        }
        return this.coef;
    }
    
    static _is_rev_verb(vf) {
        if (vf.misc.attrs.includes("возвр.")) 
            return true;
        if (vf.normal_case !== null) {
            if (vf.normal_case.endsWith("СЯ") || vf.normal_case.endsWith("СЬ")) 
                return true;
        }
        return false;
    }
    
    _calc_pacient(noplural) {
        if (!Utils.isNullOrEmpty(this.from_prep)) 
            return this.coef = -1;
        let vf = this.to_verb.first_verb.verb_morph;
        if (vf === null) 
            return -1;
        let vf2 = this.to_verb.last_verb.verb_morph;
        if (vf2 === null) 
            return -1;
        let _morph = this.from_morph;
        if (vf2.misc.voice === MorphVoice.PASSIVE || this.to_verb.last_verb.morph.contains_attr("страд.з.", null)) {
            if (vf.number === MorphNumber.PLURAL) {
                if (noplural) {
                    if (this.from_is_plural) {
                    }
                    else if (!NGLink._check_morph_accord(_morph, false, vf)) 
                        return -1;
                    else if (_morph.items.length > 0 && !vf._case.is_undefined) {
                        let ok = false;
                        for (const it of _morph.items) {
                            if ((((it.number.value()) & (MorphNumber.PLURAL.value()))) === (MorphNumber.PLURAL.value())) {
                                if (!it._case.is_undefined && (MorphCase.ooBitand(it._case, vf._case)).is_undefined) 
                                    continue;
                                ok = true;
                                break;
                            }
                        }
                        if (!ok) 
                            return this.coef = -1;
                    }
                }
                this.coef = SemanticService.PARAMS.verb_plural;
                this.plural = 1;
            }
            else {
                if (vf.number === MorphNumber.SINGULAR) {
                    this.plural = 0;
                    if (this.from_is_plural) 
                        return -1;
                }
                if (!NGLink._check_morph_accord(_morph, false, vf)) 
                    return -1;
                this.coef = SemanticService.PARAMS.morph_accord;
            }
            return this.coef;
        }
        let is_trans = false;
        let is_ref_dative = false;
        let grs = Explanatory.find_derivates((vf2.normal_full != null ? vf2.normal_full : vf2.normal_case), true, null);
        if (grs !== null) {
            for (const gr of grs) {
                if (gr.cm.transitive) 
                    is_trans = true;
                if (gr.cm_rev.agent !== null && !gr.cm_rev.agent._case.is_nominative) 
                    is_ref_dative = true;
            }
        }
        if (NGLink._is_rev_verb(vf2)) {
            if (!Utils.isNullOrEmpty(this.from_prep)) 
                return -1;
            if (!_morph._case.is_undefined) {
                if (is_ref_dative) {
                    if (_morph._case.is_nominative) 
                        return this.coef = SemanticService.PARAMS.transitive_coef;
                }
                else if (_morph._case.is_instrumental) 
                    return this.coef = SemanticService.PARAMS.transitive_coef;
                return -1;
            }
            return this.coef = 0;
        }
        if (vf2 !== vf && !is_trans) {
            grs = Explanatory.find_derivates((vf.normal_full != null ? vf.normal_full : vf.normal_case), true, null);
            if (grs !== null) {
                for (const gr of grs) {
                    if (gr.cm.transitive) 
                        is_trans = true;
                }
            }
        }
        if (is_trans) {
            if (!Utils.isNullOrEmpty(this.from_prep)) 
                return -1;
            if (!_morph._case.is_undefined) {
                if (_morph._case.is_accusative) {
                    this.coef = SemanticService.PARAMS.transitive_coef;
                    if (_morph._case.is_dative) 
                        this.coef /= (2);
                    if (_morph._case.is_genitive) 
                        this.coef /= (2);
                    if (_morph._case.is_instrumental) 
                        this.coef /= (2);
                    return this.coef;
                }
                else 
                    return -1;
            }
        }
        if (vf2.normal_case === "БЫТЬ") {
            if (!Utils.isNullOrEmpty(this.from_prep)) 
                return -1;
            if (_morph._case.is_instrumental) 
                return this.coef = SemanticService.PARAMS.transitive_coef;
            if (_morph._case.is_nominative) {
                if (this.from.source.begin_token.begin_char > this.to_verb.end_char) 
                    return this.coef = SemanticService.PARAMS.transitive_coef;
                else 
                    return this.coef = SemanticService.PARAMS.transitive_coef / (2);
            }
            if (_morph._case.is_undefined) 
                return this.coef = SemanticService.PARAMS.transitive_coef / (2);
        }
        return -1;
    }
    
    _calc_actant() {
        if (this.can_be_participle) 
            return this.coef = -1;
        let vf2 = this.to_verb.last_verb.verb_morph;
        if (vf2 === null) 
            return -1;
        if (this.from_prep === null) 
            return this.coef = 0;
        let fm = this.from.source.source.morph;
        let grs = Explanatory.find_derivates((vf2.normal_full != null ? vf2.normal_full : vf2.normal_case), true, null);
        if (grs !== null) {
            for (const gr of grs) {
                if (gr.cm.nexts === null || !gr.cm.nexts.containsKey(this.from_prep)) 
                    continue;
                let cas = gr.cm.nexts.get(this.from_prep);
                if (!(MorphCase.ooBitand(cas, fm._case)).is_undefined) {
                    this.coef = SemanticService.PARAMS.next_model;
                    if (Utils.isNullOrEmpty(this.from_prep)) {
                        if (fm._case.is_nominative) 
                            this.coef /= (2);
                        this.coef /= (2);
                    }
                    return this.coef;
                }
                if (this.from.source.source.morph._case.is_undefined) 
                    return this.coef = 0;
            }
        }
        return this.coef = 0.1;
    }
    
    static _check_morph_accord(m, _plural, vf) {
        let _coef = 0;
        if (vf.number === MorphNumber.PLURAL) {
            if (_plural) 
                _coef++;
            else if (m.number !== MorphNumber.UNDEFINED) {
                if ((((m.number.value()) & (MorphNumber.PLURAL.value()))) === (MorphNumber.PLURAL.value())) 
                    _coef++;
                else 
                    return false;
            }
        }
        else if (vf.number === MorphNumber.SINGULAR) {
            if (_plural) 
                return false;
            if (m.number !== MorphNumber.UNDEFINED) {
                if ((((m.number.value()) & (MorphNumber.SINGULAR.value()))) === (MorphNumber.SINGULAR.value())) 
                    _coef++;
                else 
                    return false;
            }
            if (m.gender !== MorphGender.UNDEFINED) {
                if (vf.gender !== MorphGender.UNDEFINED) {
                    if (m.gender === MorphGender.FEMINIE) {
                        if ((((vf.gender.value()) & (MorphGender.FEMINIE.value()))) !== (MorphGender.UNDEFINED.value())) 
                            _coef++;
                        else 
                            return false;
                    }
                    else if ((((m.gender.value()) & (vf.gender.value()))) !== (MorphGender.UNDEFINED.value())) 
                        _coef++;
                    else if (m.gender === MorphGender.MASCULINE && vf.gender === MorphGender.FEMINIE) {
                    }
                    else 
                        return false;
                }
            }
        }
        return _coef >= 0;
    }
    
    static _new2922(_arg1, _arg2, _arg3, _arg4) {
        let res = new NGLink();
        res.typ = _arg1;
        res.from = _arg2;
        res.to = _arg3;
        res.reverce = _arg4;
        return res;
    }
    
    static _new2924(_arg1) {
        let res = new NGLink();
        res.typ = _arg1;
        return res;
    }
    
    static _new2925(_arg1, _arg2) {
        let res = new NGLink();
        res.from = _arg1;
        res.typ = _arg2;
        return res;
    }
    
    static _new2933(_arg1, _arg2, _arg3) {
        let res = new NGLink();
        res.from = _arg1;
        res.to_verb = _arg2;
        res.typ = _arg3;
        return res;
    }
    
    static _new2949(_arg1, _arg2, _arg3) {
        let res = new NGLink();
        res.typ = _arg1;
        res.from = _arg2;
        res.to_verb = _arg3;
        return res;
    }
}


module.exports = NGLink