/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const RefOutArgWrapper = require("./../unisharp/RefOutArgWrapper");

const TextsCompareType = require("./core/internal/TextsCompareType");
const SerializerHelper = require("./core/internal/SerializerHelper");
const TextAnnotation = require("./TextAnnotation");
const MorphLang = require("./../morph/MorphLang");
const ProcessorService = require("./ProcessorService");
const ReferentEqualType = require("./ReferentEqualType");

/**
 * Базовый класс для всех сущностей
 */
class Referent {
    
    constructor(typ) {
        this.m_object_type = null;
        this._instanceof = null;
        this.ontology_items = null;
        this.m_slots = new Array();
        this.m_level = 0;
        this.m_occurrence = null;
        this._tag = null;
        this.int_ontology_item = null;
        this.m_ext_referents = null;
        this.m_object_type = typ;
    }
    
    /**
     * [Get] Имя типа (= InstanceOf.Name)
     */
    get type_name() {
        return this.m_object_type;
    }
    
    toString() {
        return this.to_string(false, MorphLang.UNKNOWN, 0);
    }
    
    /**
     * Специализированное строковое представление сущности
     * @param short_variant Сокращённый вариант
     * @param lang Язык
     * @return 
     */
    to_string(short_variant, lang = null, lev = 0) {
        return this.type_name;
    }
    
    /**
     * По этой строке можно осуществлять сортировку среди объектов одного типа
     * @return 
     */
    to_sort_string() {
        return this.to_string(false, MorphLang.UNKNOWN, 0);
    }
    
    /**
     * [Get] Ссылка на описание из модели данных
     */
    get instance_of() {
        return this._instanceof;
    }
    /**
     * [Set] Ссылка на описание из модели данных
     */
    set instance_of(value) {
        this._instanceof = value;
        return this._instanceof;
    }
    
    /**
     * [Get] Значения атрибутов
     */
    get slots() {
        return this.m_slots;
    }
    
    /**
     * Добавить значение атрибута
     * @param attr_name имя
     * @param attr_value значение
     * @param clear_old_value если true и слот существует, то значение перезапишется
     * @return 
     */
    add_slot(attr_name, attr_value, clear_old_value, stat_count = 0) {
        const Slot = require("./Slot");
        if (clear_old_value) {
            for (let i = this.slots.length - 1; i >= 0; i--) {
                if (this.slots[i].type_name === attr_name) 
                    this.slots.splice(i, 1);
            }
        }
        if (attr_value === null) 
            return null;
        for (const r of this.slots) {
            if (r.type_name === attr_name) {
                if (this.compare_values(r.value, attr_value, true)) {
                    r.count = r.count + stat_count;
                    return r;
                }
            }
        }
        let res = new Slot();
        res.owner = this;
        res.value = attr_value;
        res.type_name = attr_name;
        res.count = stat_count;
        this.slots.push(res);
        return res;
    }
    
    upload_slot(slot, new_val) {
        if (slot !== null) 
            slot.value = new_val;
    }
    
    /**
     * Найти слот
     * @param attr_name 
     * @param val 
     * @param use_can_be_equals_for_referents 
     * @return 
     */
    find_slot(attr_name, val = null, use_can_be_equals_for_referents = true) {
        if (this.m_level > 10) 
            return null;
        if (attr_name === null) {
            if (val === null) 
                return null;
            this.m_level++;
            for (const r of this.slots) {
                if (this.compare_values(val, r.value, use_can_be_equals_for_referents)) {
                    this.m_level--;
                    return r;
                }
            }
            this.m_level--;
            return null;
        }
        for (const r of this.slots) {
            if (r.type_name === attr_name) {
                if (val === null) 
                    return r;
                this.m_level++;
                if (this.compare_values(val, r.value, use_can_be_equals_for_referents)) {
                    this.m_level--;
                    return r;
                }
                this.m_level--;
            }
        }
        return null;
    }
    
    compare_values(val1, val2, use_can_be_equals_for_referents) {
        if (val1 === null) 
            return val2 === null;
        if (val2 === null) 
            return val1 === null;
        if (val1 === val2) 
            return true;
        if ((val1 instanceof Referent) && (val2 instanceof Referent)) {
            if (use_can_be_equals_for_referents) 
                return (val1).can_be_equals(Utils.as(val2, Referent), ReferentEqualType.DIFFERENTTEXTS);
            else 
                return false;
        }
        if ((typeof val1 === 'string' || val1 instanceof String)) {
            if (!(((typeof val2 === 'string' || val2 instanceof String)))) 
                return false;
            let s1 = String(val1);
            let s2 = String(val2);
            let i = Utils.compareStrings(s1, s2, true);
            return i === 0;
        }
        return val1 === val2;
    }
    
    /**
     * Получить значение слота-атрибута (если их несколько, то вернёт первое)
     * @param attr_name имя слота
     * @return значение (поле Value)
     */
    get_slot_value(attr_name) {
        for (const v of this.slots) {
            if (v.type_name === attr_name) 
                return v.value;
        }
        return null;
    }
    
    /**
     * Получить строковое значение (если их несколько, то вернёт первое)
     * @param attr_name 
     * @return 
     */
    get_string_value(attr_name) {
        for (const v of this.slots) {
            if (v.type_name === attr_name) 
                return (v.value === null ? null : v.value.toString());
        }
        return null;
    }
    
    /**
     * Получить все строовые значения заданного атрибута
     * @param attr_name 
     * @return 
     */
    get_string_values(attr_name) {
        let res = new Array();
        for (const v of this.slots) {
            if (v.type_name === attr_name && v.value !== null) {
                if ((typeof v.value === 'string' || v.value instanceof String)) 
                    res.push(Utils.asString(v.value));
                else 
                    res.push(v.toString());
            }
        }
        return res;
    }
    
    /**
     * Получить числовое значение (если их несколько, то вернёт первое)
     * @param attr_name 
     * @param def_value 
     * @return 
     */
    get_int_value(attr_name, def_value) {
        let str = this.get_string_value(attr_name);
        if (Utils.isNullOrEmpty(str)) 
            return def_value;
        let res = 0;
        let wrapres2845 = new RefOutArgWrapper();
        let inoutres2846 = Utils.tryParseInt(str, wrapres2845);
        res = wrapres2845.value;
        if (!inoutres2846) 
            return def_value;
        return res;
    }
    
    /**
     * [Get] Привязка элемента к текстам (аннотации)
     */
    get occurrence() {
        if (this.m_occurrence === null) 
            this.m_occurrence = new Array();
        return this.m_occurrence;
    }
    
    find_near_occurence(t) {
        let min = -1;
        let res = null;
        for (const oc of this.occurrence) {
            if (oc.sofa === t.kit.sofa) {
                let len = oc.begin_char - t.begin_char;
                if (len < 0) 
                    len = -len;
                if ((min < 0) || (len < min)) {
                    min = len;
                    res = oc;
                }
            }
        }
        return res;
    }
    
    add_occurence_of_ref_tok(rt) {
        this.add_occurence(TextAnnotation._new723(rt.kit.sofa, rt.begin_char, rt.end_char, rt.referent));
    }
    
    /**
     * Добавить аннотацию
     * @param anno 
     */
    add_occurence(anno) {
        for (const l_ of this.occurrence) {
            let typ = l_.compare_with(anno);
            if (typ === TextsCompareType.NONCOMPARABLE) 
                continue;
            if (typ === TextsCompareType.EQUIVALENT || typ === TextsCompareType.CONTAINS) 
                return;
            if (typ === TextsCompareType.IN || typ === TextsCompareType.INTERSECT) {
                l_.merge(anno);
                return;
            }
        }
        if (anno.occurence_of !== this && anno.occurence_of !== null) 
            anno = TextAnnotation._new2848(anno.begin_char, anno.end_char, anno.sofa);
        if (this.m_occurrence === null) 
            this.m_occurrence = new Array();
        anno.occurence_of = this;
        if (this.m_occurrence.length === 0) {
            anno.essential_for_occurence = true;
            this.m_occurrence.push(anno);
            return;
        }
        if (anno.begin_char < this.m_occurrence[0].begin_char) {
            this.m_occurrence.splice(0, 0, anno);
            return;
        }
        if (anno.begin_char >= this.m_occurrence[this.m_occurrence.length - 1].begin_char) {
            this.m_occurrence.push(anno);
            return;
        }
        for (let i = 0; i < (this.m_occurrence.length - 1); i++) {
            if (anno.begin_char >= this.m_occurrence[i].begin_char && anno.begin_char <= this.m_occurrence[i + 1].begin_char) {
                this.m_occurrence.splice(i + 1, 0, anno);
                return;
            }
        }
        this.m_occurrence.push(anno);
    }
    
    /**
     * Проверка, что ссылки на элемент имеются на заданном участке текста
     * @param begin_char 
     * @param end_char 
     * @return 
     */
    check_occurence(begin_char, end_char) {
        for (const loc of this.occurrence) {
            let cmp = loc.compare(begin_char, end_char);
            if (cmp !== TextsCompareType.EARLY && cmp !== TextsCompareType.LATER && cmp !== TextsCompareType.NONCOMPARABLE) 
                return true;
        }
        return false;
    }
    
    /**
     * [Get] Используется произвольным образом
     */
    get tag() {
        return this._tag;
    }
    /**
     * [Set] Используется произвольным образом
     */
    set tag(value) {
        this._tag = value;
        return this._tag;
    }
    
    clone() {
        const Slot = require("./Slot");
        let res = ProcessorService.create_referent(this.type_name);
        if (res === null) 
            res = new Referent(this.type_name);
        res.occurrence.splice(res.occurrence.length, 0, ...this.occurrence);
        res.ontology_items = this.ontology_items;
        for (const r of this.slots) {
            let rr = Slot._new2849(r.type_name, r.value, r.count);
            rr.owner = res;
            res.slots.push(rr);
        }
        return res;
    }
    
    /**
     * Проверка возможной тождественности объектов
     * @param obj другой объект
     * @param typ тип сравнения
     * @return результат
     */
    can_be_equals(obj, typ = ReferentEqualType.WITHINONETEXT) {
        if (obj === null || obj.type_name !== this.type_name) 
            return false;
        for (const r of this.slots) {
            if (r.value !== null && obj.find_slot(r.type_name, r.value, false) === null) 
                return false;
        }
        for (const r of obj.slots) {
            if (r.value !== null && this.find_slot(r.type_name, r.value, true) === null) 
                return false;
        }
        return true;
    }
    
    /**
     * Объединение значений атрибутов со значениями атрибутов другого объекта
     * @param obj Другой объект, считающийся эквивалентным
     */
    merge_slots(obj, merge_statistic = true) {
        if (obj === null) 
            return;
        for (const r of obj.slots) {
            let s = this.find_slot(r.type_name, r.value, true);
            if (s === null && r.value !== null) 
                s = this.add_slot(r.type_name, r.value, false, 0);
            if (s !== null && merge_statistic) 
                s.count = s.count + r.count;
        }
        this._merge_ext_referents(obj);
    }
    
    /**
     * [Get] Ссылка на родительский объект (для разных типов объектов здесь может быть свои объекты, 
     *  например, для организаций - вышестоящая организация, для пункта закона - сам закон и т.д.)
     */
    get parent_referent() {
        return null;
    }
    
    /**
     * Получить идентификатор иконки (саму иконку можно получить через функцию 
     *  GetImageById(imageId) статического класса ProcessorService
     * @return 
     */
    get_image_id() {
        if (this.instance_of === null) 
            return null;
        return this.instance_of.get_image_id(this);
    }
    
    /**
     * Проверка, может ли текущий объект быть обобщением для другого объекта
     * @param obj 
     * @return 
     */
    can_be_general_for(obj) {
        return false;
    }
    
    /**
     * [Get] Ссылка на объект-обобщение
     */
    get general_referent() {
        let res = Utils.as(this.get_slot_value(Referent.ATTR_GENERAL), Referent);
        if (res === null || res === this) 
            return null;
        return res;
    }
    /**
     * [Set] Ссылка на объект-обобщение
     */
    set general_referent(value) {
        if (value === this.general_referent) 
            return value;
        if (value === this) 
            return value;
        this.add_slot(Referent.ATTR_GENERAL, value, true, 0);
        return value;
    }
    
    /**
     * Создать элемент отнологии
     * @return 
     */
    create_ontology_item() {
        return null;
    }
    
    /**
     * Используется внутренним образом
     * @return 
     */
    get_compare_strings() {
        let res = new Array();
        res.push(this.toString());
        let s = this.to_string(true, MorphLang.UNKNOWN, 0);
        if (s !== res[0]) 
            res.push(s);
        return res;
    }
    
    add_ext_referent(rt) {
        if (rt === null) 
            return;
        if (this.m_ext_referents === null) 
            this.m_ext_referents = new Array();
        if (!this.m_ext_referents.includes(rt)) 
            this.m_ext_referents.push(rt);
        if (this.m_ext_referents.length > 100) {
        }
    }
    
    move_ext_referent(target, r) {
        if (this.m_ext_referents !== null) {
            for (const rt of this.m_ext_referents) {
                if (rt.referent === r) {
                    target.add_ext_referent(rt);
                    Utils.removeItem(this.m_ext_referents, rt);
                    break;
                }
            }
        }
    }
    
    _merge_ext_referents(obj) {
        if (obj.m_ext_referents !== null) {
            for (const rt of obj.m_ext_referents) {
                this.add_ext_referent(rt);
            }
        }
    }
    
    serialize(stream) {
        SerializerHelper.serialize_string(stream, this.type_name);
        SerializerHelper.serialize_int(stream, this.m_slots.length);
        for (const s of this.m_slots) {
            SerializerHelper.serialize_string(stream, s.type_name);
            SerializerHelper.serialize_int(stream, s.count);
            if ((s.value instanceof Referent) && ((typeof (s.value).tag === 'number' || (s.value).tag instanceof Number))) 
                SerializerHelper.serialize_int(stream, -((s.value).tag));
            else if ((typeof s.value === 'string' || s.value instanceof String)) 
                SerializerHelper.serialize_string(stream, Utils.asString(s.value));
            else if (s.value === null) 
                SerializerHelper.serialize_int(stream, 0);
            else 
                SerializerHelper.serialize_string(stream, s.value.toString());
        }
        if (this.m_occurrence === null) 
            SerializerHelper.serialize_int(stream, 0);
        else {
            SerializerHelper.serialize_int(stream, this.m_occurrence.length);
            for (const o of this.m_occurrence) {
                SerializerHelper.serialize_int(stream, o.begin_char);
                SerializerHelper.serialize_int(stream, o.end_char);
                let attr = 0;
                if (o.essential_for_occurence) 
                    attr = 1;
                SerializerHelper.serialize_int(stream, attr);
            }
        }
    }
    
    deserialize(stream, all, sofa) {
        let typ = SerializerHelper.deserialize_string(stream);
        let cou = SerializerHelper.deserialize_int(stream);
        for (let i = 0; i < cou; i++) {
            typ = SerializerHelper.deserialize_string(stream);
            let c = SerializerHelper.deserialize_int(stream);
            let id = SerializerHelper.deserialize_int(stream);
            let val = null;
            if ((id < 0) && all !== null) {
                let id1 = (-id) - 1;
                if (id1 < all.length) 
                    val = all[id1];
            }
            else if (id > 0) {
                stream.position = stream.position - (4);
                val = SerializerHelper.deserialize_string(stream);
            }
            this.add_slot(typ, val, false, c);
        }
        cou = SerializerHelper.deserialize_int(stream);
        this.m_occurrence = new Array();
        for (let i = 0; i < cou; i++) {
            let a = TextAnnotation._new2850(sofa, this);
            this.m_occurrence.push(a);
            a.begin_char = SerializerHelper.deserialize_int(stream);
            a.end_char = SerializerHelper.deserialize_int(stream);
            let attr = SerializerHelper.deserialize_int(stream);
            if (((attr & 1)) !== 0) 
                a.essential_for_occurence = true;
        }
    }
    
    static static_constructor() {
        Referent.ATTR_GENERAL = "GENERAL";
    }
}


Referent.static_constructor();

module.exports = Referent