/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");

const MorphMiscInfo = require("./../morph/MorphMiscInfo");
const MorphGender = require("./../morph/MorphGender");
const MorphNumber = require("./../morph/MorphNumber");
const MorphCase = require("./../morph/MorphCase");
const MorphLang = require("./../morph/MorphLang");
const MorphBaseInfo = require("./../morph/MorphBaseInfo");
const MorphClass = require("./../morph/MorphClass");
const LanguageHelper = require("./../morph/LanguageHelper");
const MorphWordForm = require("./../morph/MorphWordForm");
const MorphVoice = require("./../morph/MorphVoice");

/**
 * Коллекция морфологических вариантов
 */
class MorphCollection extends MorphBaseInfo {
    
    constructor(source = null) {
        super(null);
        this.m_class = new MorphClass();
        this.m_gender = MorphGender.UNDEFINED;
        this.m_number = MorphNumber.UNDEFINED;
        this.m_case = new MorphCase();
        this.m_language = new MorphLang();
        this.m_voice = MorphVoice.UNDEFINED;
        this.m_need_recalc = true;
        this.m_items = null;
        if (source === null) 
            return;
        for (const it of source.items) {
            let mi = null;
            if (it instanceof MorphWordForm) 
                mi = Utils.as((it).clone(), MorphWordForm);
            else {
                mi = new MorphBaseInfo();
                it.copy_to(mi);
            }
            if (this.m_items === null) 
                this.m_items = new Array();
            this.m_items.push(mi);
        }
        this.m_class = new MorphClass(source.m_class);
        this.m_gender = source.m_gender;
        this.m_case = new MorphCase(source.m_case);
        this.m_number = source.m_number;
        this.m_language = new MorphLang(source.m_language);
        this.m_voice = source.m_voice;
        this.m_need_recalc = false;
    }
    
    toString() {
        let res = super.toString();
        if (this.voice !== MorphVoice.UNDEFINED) {
            if (this.voice === MorphVoice.ACTIVE) 
                res += " действ.з.";
            else if (this.voice === MorphVoice.PASSIVE) 
                res += " страд.з.";
            else if (this.voice === MorphVoice.MIDDLE) 
                res += " сред. з.";
        }
        return res;
    }
    
    /**
     * Создать копию
     * @return 
     */
    clone() {
        let res = new MorphCollection();
        if (this.m_items !== null) {
            res.m_items = new Array();
            try {
                res.m_items.splice(res.m_items.length, 0, ...this.m_items);
            } catch (ex) {
            }
        }
        if (!this.m_need_recalc) {
            res.m_class = new MorphClass(this.m_class);
            res.m_gender = this.m_gender;
            res.m_case = new MorphCase(this.m_case);
            res.m_number = this.m_number;
            res.m_language = new MorphLang(this.m_language);
            res.m_need_recalc = false;
            res.m_voice = this.m_voice;
        }
        return res;
    }
    
    /**
     * [Get] Количество морфологических вариантов
     */
    get items_count() {
        return (this.m_items === null ? 0 : this.m_items.length);
    }
    
    get_indexer_item(ind) {
        if (this.m_items === null || (ind < 0) || ind >= this.m_items.length) 
            return null;
        else 
            return this.m_items[ind];
    }
    
    /**
     * [Get] Морфологические варианты
     */
    get items() {
        return (this.m_items != null ? this.m_items : MorphCollection.m_empty_items);
    }
    
    add_item(item) {
        if (this.m_items === null) 
            this.m_items = new Array();
        this.m_items.push(item);
        this.m_need_recalc = true;
    }
    
    insert_item(ind, item) {
        if (this.m_items === null) 
            this.m_items = new Array();
        this.m_items.splice(ind, 0, item);
        this.m_need_recalc = true;
    }
    
    remove_item(o) {
        if ((typeof o === 'number' || o instanceof Number)) 
            this._remove_item_int(o);
        else if (o instanceof MorphBaseInfo) 
            this._remove_item_morph_base_info(Utils.as(o, MorphBaseInfo));
    }
    
    _remove_item_int(i) {
        if (this.m_items !== null && i >= 0 && (i < this.m_items.length)) {
            this.m_items.splice(i, 1);
            this.m_need_recalc = true;
        }
    }
    
    _remove_item_morph_base_info(item) {
        if (this.m_items !== null && this.m_items.includes(item)) {
            Utils.removeItem(this.m_items, item);
            this.m_need_recalc = true;
        }
    }
    
    _recalc() {
        this.m_need_recalc = false;
        if (this.m_items === null || this.m_items.length === 0) 
            return;
        this.m_class = new MorphClass();
        this.m_gender = MorphGender.UNDEFINED;
        let g = this.m_gender === MorphGender.UNDEFINED;
        this.m_number = MorphNumber.UNDEFINED;
        let n = this.m_number === MorphNumber.UNDEFINED;
        this.m_case = new MorphCase();
        let ca = this.m_case.is_undefined;
        let la = this.m_language === null || this.m_language.is_undefined;
        this.m_voice = MorphVoice.UNDEFINED;
        let verb_has_undef = false;
        if (this.m_items !== null) {
            for (const it of this.m_items) {
                this.m_class.value |= it.class0.value;
                if (g) 
                    this.m_gender = MorphGender.of((this.m_gender.value()) | (it.gender.value()));
                if (ca) 
                    this.m_case = MorphCase.ooBitor(this.m_case, it._case);
                if (n) 
                    this.m_number = MorphNumber.of((this.m_number.value()) | (it.number.value()));
                if (la) 
                    this.m_language.value |= it.language.value;
                if (it.class0.is_verb) {
                    if (it instanceof MorphWordForm) {
                        let v = (it).misc.voice;
                        if (v === MorphVoice.UNDEFINED) 
                            verb_has_undef = true;
                        else 
                            this.m_voice = MorphVoice.of((this.m_voice.value()) | (v.value()));
                    }
                }
            }
        }
        if (verb_has_undef) 
            this.m_voice = MorphVoice.UNDEFINED;
    }
    
    get class0() {
        if (this.m_need_recalc) 
            this._recalc();
        return this.m_class;
    }
    set class0(value) {
        this.m_class = value;
        return value;
    }
    
    get _case() {
        if (this.m_need_recalc) 
            this._recalc();
        return this.m_case;
    }
    set _case(value) {
        this.m_case = value;
        return value;
    }
    
    get gender() {
        if (this.m_need_recalc) 
            this._recalc();
        return this.m_gender;
    }
    set gender(value) {
        this.m_gender = value;
        return value;
    }
    
    get number() {
        if (this.m_need_recalc) 
            this._recalc();
        return this.m_number;
    }
    set number(value) {
        this.m_number = value;
        return value;
    }
    
    get language() {
        if (this.m_need_recalc) 
            this._recalc();
        return this.m_language;
    }
    set language(value) {
        this.m_language = value;
        return value;
    }
    
    /**
     * [Get] Залог (для глаголов)
     */
    get voice() {
        if (this.m_need_recalc) 
            this._recalc();
        return this.m_voice;
    }
    /**
     * [Set] Залог (для глаголов)
     */
    set voice(value) {
        if (this.m_need_recalc) 
            this._recalc();
        this.m_voice = value;
        return value;
    }
    
    contains_attr(attr_value, cla = null) {
        for (const it of this.items) {
            if (cla !== null && cla.value !== (0) && (((it.class0.value) & (cla.value))) === 0) 
                continue;
            if (it.contains_attr(attr_value, cla)) 
                return true;
        }
        return false;
    }
    
    check_accord(v, ignore_gender = false, ignore_number = false) {
        for (const it of this.items) {
            if (it.check_accord(v, ignore_gender, ignore_number)) 
                return true;
        }
        return super.check_accord(v, ignore_gender, ignore_number);
    }
    
    check(cl) {
        return (((this.class0.value) & (cl.value))) !== 0;
    }
    
    /**
     * Удалить элементы, не соответствующие элементу
     * @param it 
     */
    remove_items(it, eq = false) {
        if (it instanceof MorphCase) 
            this._remove_items_morph_case(it);
        else if (it instanceof MorphClass) 
            this._remove_items_morph_class(it, eq);
        else if (it instanceof MorphBaseInfo) 
            this._remove_items_morph_base_info(it);
        else if (it instanceof MorphNumber) 
            this._remove_items_morph_number(MorphNumber.of(it));
        else if (it instanceof MorphGender) 
            this._remove_items_morph_gender(MorphGender.of(it));
    }
    
    _remove_items_morph_case(cas) {
        if (this.m_items === null) 
            return;
        if (this.m_items.length === 0) 
            this.m_case = MorphCase.ooBitand(this.m_case, cas);
        for (let i = this.m_items.length - 1; i >= 0; i--) {
            if ((MorphCase.ooBitand(this.m_items[i]._case, cas)).is_undefined) {
                this.m_items.splice(i, 1);
                this.m_need_recalc = true;
            }
            else if (MorphCase.ooNoteq((MorphCase.ooBitand(this.m_items[i]._case, cas)), this.m_items[i]._case)) {
                this.m_items[i] = Utils.as(this.m_items[i].clone(), MorphBaseInfo);
                this.m_items[i]._case = MorphCase.ooBitand(this.m_items[i]._case, cas);
                this.m_need_recalc = true;
            }
        }
        this.m_need_recalc = true;
    }
    
    _remove_items_morph_class(cl, eq) {
        if (this.m_items === null) 
            return;
        for (let i = this.m_items.length - 1; i >= 0; i--) {
            let ok = false;
            if ((((this.m_items[i].class0.value) & (cl.value))) === 0) 
                ok = true;
            else if (eq && this.m_items[i].class0.value !== cl.value) 
                ok = true;
            if (ok) {
                this.m_items.splice(i, 1);
                this.m_need_recalc = true;
            }
        }
        this.m_need_recalc = true;
    }
    
    _remove_items_morph_base_info(inf) {
        if (this.m_items === null) 
            return;
        if (this.m_items.length === 0) {
            if (inf.gender !== MorphGender.UNDEFINED) 
                this.m_gender = MorphGender.of((this.m_gender.value()) & (inf.gender.value()));
            if (inf.number !== MorphNumber.UNDEFINED) 
                this.m_number = MorphNumber.of((this.m_number.value()) & (inf.number.value()));
            if (!inf._case.is_undefined) 
                this.m_case = MorphCase.ooBitand(this.m_case, inf._case);
            return;
        }
        for (let i = this.m_items.length - 1; i >= 0; i--) {
            let ok = true;
            let it = this.m_items[i];
            if (inf.gender !== MorphGender.UNDEFINED) {
                if ((((it.gender.value()) & (inf.gender.value()))) === (MorphGender.UNDEFINED.value())) 
                    ok = false;
            }
            let ch_num = false;
            if (inf.number !== MorphNumber.PLURAL) {
                if ((((it.number.value()) & (inf.number.value()))) === (MorphNumber.UNDEFINED.value())) 
                    ok = false;
                ch_num = true;
            }
            if (!inf._case.is_undefined) {
                if ((MorphCase.ooBitand(inf._case, it._case)).is_undefined) 
                    ok = false;
            }
            if (!ok) {
                this.m_items.splice(i, 1);
                this.m_need_recalc = true;
            }
            else {
                if (!inf._case.is_undefined) {
                    if (MorphCase.ooNoteq(it._case, (MorphCase.ooBitand(inf._case, it._case)))) {
                        it._case = (MorphCase.ooBitand(inf._case, it._case));
                        this.m_need_recalc = true;
                    }
                }
                if (inf.gender !== MorphGender.UNDEFINED) {
                    if ((it.gender.value()) !== (((inf.gender.value()) & (it.gender.value())))) {
                        it.gender = MorphGender.of(((inf.gender.value()) & (it.gender.value())));
                        this.m_need_recalc = true;
                    }
                }
                if (ch_num) {
                    if ((it.number.value()) !== (((inf.number.value()) & (it.number.value())))) {
                        it.number = MorphNumber.of(((inf.number.value()) & (it.number.value())));
                        this.m_need_recalc = true;
                    }
                }
            }
        }
    }
    
    /**
     * Убрать элементы, не соответствующие по падежу предлогу
     * @param prep 
     */
    remove_items_by_preposition(prep) {
        const TextToken = require("./TextToken");
        if (!((prep instanceof TextToken))) 
            return;
        let mc = LanguageHelper.get_case_after_preposition((prep).lemma);
        if ((MorphCase.ooBitand(mc, this._case)).is_undefined) 
            return;
        this.remove_items(mc, false);
    }
    
    /**
     * Удалить элементы не из словаря (если все не из словаря, то ничего не удаляется). 
     *  То есть оставить только словарный вариант.
     */
    remove_not_in_dictionary_items() {
        if (this.m_items === null) 
            return;
        let has_in_dict = false;
        for (let i = this.m_items.length - 1; i >= 0; i--) {
            if ((this.m_items[i] instanceof MorphWordForm) && (this.m_items[i]).is_in_dictionary) {
                has_in_dict = true;
                break;
            }
        }
        if (has_in_dict) {
            for (let i = this.m_items.length - 1; i >= 0; i--) {
                if ((this.m_items[i] instanceof MorphWordForm) && !(this.m_items[i]).is_in_dictionary) {
                    this.m_items.splice(i, 1);
                    this.m_need_recalc = true;
                }
            }
        }
    }
    
    remove_proper_items() {
        if (this.m_items === null) 
            return;
        for (let i = this.m_items.length - 1; i >= 0; i--) {
            if (this.m_items[i].class0.is_proper) {
                this.m_items.splice(i, 1);
                this.m_need_recalc = true;
            }
        }
    }
    
    _remove_items_morph_number(num) {
        if (this.m_items === null) 
            return;
        for (let i = this.m_items.length - 1; i >= 0; i--) {
            if ((((this.m_items[i].number.value()) & (num.value()))) === (MorphNumber.UNDEFINED.value())) {
                this.m_items.splice(i, 1);
                this.m_need_recalc = true;
            }
        }
    }
    
    _remove_items_morph_gender(gen) {
        if (this.m_items === null) 
            return;
        for (let i = this.m_items.length - 1; i >= 0; i--) {
            if ((((this.m_items[i].gender.value()) & (gen.value()))) === (MorphGender.UNDEFINED.value())) {
                this.m_items.splice(i, 1);
                this.m_need_recalc = true;
            }
        }
    }
    
    /**
     * Удалить элементы, не соответствующие заданным параметрам
     * @param bis 
     * @param cla 
     */
    remove_items_list_cla(bis, cla) {
        if (this.m_items === null) 
            return;
        for (let i = this.m_items.length - 1; i >= 0; i--) {
            if (cla !== null && !cla.is_undefined) {
                if ((((this.m_items[i].class0.value) & (cla.value))) === 0) {
                    if (((this.m_items[i].class0.is_proper || this.m_items[i].class0.is_noun)) && ((cla.is_proper || cla.is_noun))) {
                    }
                    else {
                        this.m_items.splice(i, 1);
                        this.m_need_recalc = true;
                        continue;
                    }
                }
            }
            let ok = false;
            for (const it of bis) {
                if (!it._case.is_undefined && !this.m_items[i]._case.is_undefined) {
                    if ((MorphCase.ooBitand(this.m_items[i]._case, it._case)).is_undefined) 
                        continue;
                }
                if (it.gender !== MorphGender.UNDEFINED && this.m_items[i].gender !== MorphGender.UNDEFINED) {
                    if ((((it.gender.value()) & (this.m_items[i].gender.value()))) === (MorphGender.UNDEFINED.value())) 
                        continue;
                }
                if (it.number !== MorphNumber.UNDEFINED && this.m_items[i].number !== MorphNumber.UNDEFINED) {
                    if ((((it.number.value()) & (this.m_items[i].number.value()))) === (MorphNumber.UNDEFINED.value())) 
                        continue;
                }
                ok = true;
                break;
            }
            if (!ok) {
                this.m_items.splice(i, 1);
                this.m_need_recalc = true;
            }
        }
    }
    
    /**
     * Удалить элементы, не соответствующие другой морфологической коллекции
     * @param col 
     */
    remove_items_ex(col, cla) {
        this.remove_items_list_cla(col.items, cla);
    }
    
    find_item(cas, num = MorphNumber.UNDEFINED, gen = MorphGender.UNDEFINED) {
        if (this.m_items === null) 
            return null;
        let res = null;
        let max_coef = 0;
        for (const it of this.m_items) {
            if (!cas.is_undefined) {
                if ((MorphCase.ooBitand(it._case, cas)).is_undefined) 
                    continue;
            }
            if (num !== MorphNumber.UNDEFINED) {
                if ((((num.value()) & (it.number.value()))) === (MorphNumber.UNDEFINED.value())) 
                    continue;
            }
            if (gen !== MorphGender.UNDEFINED) {
                if ((((gen.value()) & (it.gender.value()))) === (MorphGender.UNDEFINED.value())) 
                    continue;
            }
            let wf = Utils.as(it, MorphWordForm);
            if (wf !== null && wf.undef_coef > (0)) {
                if (wf.undef_coef > max_coef) {
                    max_coef = wf.undef_coef;
                    res = it;
                }
                continue;
            }
            return it;
        }
        return res;
    }
    
    serialize(stream) {
        const SerializerHelper = require("./core/internal/SerializerHelper");
        SerializerHelper.serialize_short(stream, this.m_class.value);
        SerializerHelper.serialize_short(stream, this.m_case.value);
        SerializerHelper.serialize_short(stream, this.m_gender.value());
        SerializerHelper.serialize_short(stream, this.m_number.value());
        SerializerHelper.serialize_short(stream, this.m_voice.value());
        SerializerHelper.serialize_short(stream, this.m_language.value);
        if (this.m_items === null) 
            this.m_items = new Array();
        SerializerHelper.serialize_int(stream, this.m_items.length);
        for (const it of this.m_items) {
            this.serialize_item(stream, it);
        }
    }
    
    deserialize(stream) {
        const SerializerHelper = require("./core/internal/SerializerHelper");
        this.m_class = MorphClass._new63(SerializerHelper.deserialize_short(stream));
        this.m_case = MorphCase._new48(SerializerHelper.deserialize_short(stream));
        this.m_gender = MorphGender.of(SerializerHelper.deserialize_short(stream));
        this.m_number = MorphNumber.of(SerializerHelper.deserialize_short(stream));
        this.m_voice = MorphVoice.of(SerializerHelper.deserialize_short(stream));
        this.m_language = MorphLang._new75(SerializerHelper.deserialize_short(stream));
        let cou = SerializerHelper.deserialize_int(stream);
        this.m_items = new Array();
        for (let i = 0; i < cou; i++) {
            let it = this.deserialize_item(stream);
            if (it !== null) 
                this.m_items.push(it);
        }
        this.m_need_recalc = false;
    }
    
    serialize_item(stream, bi) {
        const SerializerHelper = require("./core/internal/SerializerHelper");
        let ty = 0;
        if (bi instanceof MorphWordForm) 
            ty = 1;
        stream.writeByte(ty);
        SerializerHelper.serialize_short(stream, bi.class0.value);
        SerializerHelper.serialize_short(stream, bi._case.value);
        SerializerHelper.serialize_short(stream, bi.gender.value());
        SerializerHelper.serialize_short(stream, bi.number.value());
        SerializerHelper.serialize_short(stream, bi.language.value);
        let wf = Utils.as(bi, MorphWordForm);
        if (wf === null) 
            return;
        SerializerHelper.serialize_string(stream, wf.normal_case);
        SerializerHelper.serialize_string(stream, wf.normal_full);
        SerializerHelper.serialize_short(stream, wf.undef_coef);
        SerializerHelper.serialize_int(stream, (wf.misc === null ? 0 : wf.misc.attrs.length));
        if (wf.misc !== null) {
            for (const a of wf.misc.attrs) {
                SerializerHelper.serialize_string(stream, a);
            }
        }
    }
    
    deserialize_item(stream) {
        const SerializerHelper = require("./core/internal/SerializerHelper");
        let ty = stream.readByte();
        let res = (ty === 0 ? new MorphBaseInfo() : new MorphWordForm());
        res.class0 = MorphClass._new63(SerializerHelper.deserialize_short(stream));
        res._case = MorphCase._new48(SerializerHelper.deserialize_short(stream));
        res.gender = MorphGender.of(SerializerHelper.deserialize_short(stream));
        res.number = MorphNumber.of(SerializerHelper.deserialize_short(stream));
        res.language = MorphLang._new75(SerializerHelper.deserialize_short(stream));
        if (ty === 0) 
            return res;
        let wf = Utils.as(res, MorphWordForm);
        wf.normal_case = SerializerHelper.deserialize_string(stream);
        wf.normal_full = SerializerHelper.deserialize_string(stream);
        wf.undef_coef = SerializerHelper.deserialize_short(stream);
        let cou = SerializerHelper.deserialize_int(stream);
        for (let i = 0; i < cou; i++) {
            if (wf.misc === null) 
                wf.misc = new MorphMiscInfo();
            wf.misc.attrs.push(SerializerHelper.deserialize_string(stream));
        }
        return res;
    }
    
    static _new585(_arg1) {
        let res = new MorphCollection();
        res.class0 = _arg1;
        return res;
    }
    
    static _new2353(_arg1) {
        let res = new MorphCollection();
        res.gender = _arg1;
        return res;
    }
    
    static _new2439(_arg1) {
        let res = new MorphCollection();
        res._case = _arg1;
        return res;
    }
    
    static static_constructor() {
        MorphCollection.m_empty_items = new Array();
    }
}


MorphCollection.static_constructor();

module.exports = MorphCollection