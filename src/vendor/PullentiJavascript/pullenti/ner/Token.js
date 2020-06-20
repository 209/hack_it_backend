/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");

const LanguageHelper = require("./../morph/LanguageHelper");
const CharsInfo = require("./../morph/CharsInfo");
const MorphGender = require("./../morph/MorphGender");
const MorphCollection = require("./MorphCollection");

/**
 * Базовый класс для всех токенов
 */
class Token {
    
    constructor(_kit, begin, end) {
        this.kit = null;
        this.m_begin_char = 0;
        this.m_end_char = 0;
        this.tag = null;
        this.m_previous = null;
        this.m_next = null;
        this.m_morph = null;
        this.chars = null;
        this.m_attrs = 0;
        this.kit = _kit;
        this.m_begin_char = begin;
        this.m_end_char = end;
    }
    
    /**
     * [Get] Начальная позиция
     */
    get begin_char() {
        return this.m_begin_char;
    }
    
    /**
     * [Get] Конечная позиция
     */
    get end_char() {
        return this.m_end_char;
    }
    
    /**
     * [Get] Длина в исходных символах
     */
    get length_char() {
        return (this.end_char - this.begin_char) + 1;
    }
    
    /**
     * [Get] Предыдущий токен
     */
    get previous() {
        return this.m_previous;
    }
    /**
     * [Set] Предыдущий токен
     */
    set previous(value) {
        this.m_previous = value;
        if (value !== null) 
            value.m_next = this;
        this.m_attrs = 0;
        return value;
    }
    
    /**
     * [Get] Следующий токен
     */
    get next() {
        return this.m_next;
    }
    /**
     * [Set] Следующий токен
     */
    set next(value) {
        this.m_next = value;
        if (value !== null) 
            value.m_previous = this;
        this.m_attrs = 0;
        return value;
    }
    
    /**
     * [Get] Морфологическая информация
     */
    get morph() {
        if (this.m_morph === null) 
            this.m_morph = new MorphCollection();
        return this.m_morph;
    }
    /**
     * [Set] Морфологическая информация
     */
    set morph(value) {
        this.m_morph = value;
        return value;
    }
    
    toString() {
        return this.kit.sofa.text.substring(this.begin_char, this.begin_char + (this.end_char + 1) - this.begin_char);
    }
    
    get_attr(i) {
        let ch = null;
        if ((((this.m_attrs) & 1)) === 0) {
            this.m_attrs = 1;
            if (this.m_previous === null) {
                this.set_attr(1, true);
                this.set_attr(3, true);
            }
            else 
                for (let j = this.m_previous.end_char + 1; j < this.begin_char; j++) {
                    if (Utils.isWhitespace(((ch = this.kit.sofa.text[j])))) {
                        this.set_attr(1, true);
                        if ((ch.charCodeAt(0)) === 0xD || (ch.charCodeAt(0)) === 0xA || ch === '\f') 
                            this.set_attr(3, true);
                    }
                }
            if (this.m_next === null) {
                this.set_attr(2, true);
                this.set_attr(4, true);
            }
            else 
                for (let j = this.end_char + 1; j < this.m_next.begin_char; j++) {
                    if (Utils.isWhitespace((ch = this.kit.sofa.text[j]))) {
                        this.set_attr(2, true);
                        if ((ch.charCodeAt(0)) === 0xD || (ch.charCodeAt(0)) === 0xA || ch === '\f') 
                            this.set_attr(4, true);
                    }
                }
        }
        return (((((this.m_attrs) >> i)) & 1)) !== 0;
    }
    
    set_attr(i, val) {
        if (val) 
            this.m_attrs |= ((1 << i));
        else 
            this.m_attrs &= (~((1 << i)));
    }
    
    /**
     * [Get] Наличие пробельных символов перед
     */
    get is_whitespace_before() {
        return this.get_attr(1);
    }
    /**
     * [Set] Наличие пробельных символов перед
     */
    set is_whitespace_before(value) {
        this.set_attr(1, value);
        return value;
    }
    
    /**
     * [Get] Наличие пробельных символов после
     */
    get is_whitespace_after() {
        return this.get_attr(2);
    }
    /**
     * [Set] Наличие пробельных символов после
     */
    set is_whitespace_after(value) {
        this.set_attr(2, value);
        return value;
    }
    
    /**
     * [Get] Элемент начинается с новой строки. 
     *  Для 1-го элемента всегда true.
     */
    get is_newline_before() {
        return this.get_attr(3);
    }
    /**
     * [Set] Элемент начинается с новой строки. 
     *  Для 1-го элемента всегда true.
     */
    set is_newline_before(value) {
        this.set_attr(3, value);
        return value;
    }
    
    /**
     * [Get] Элемент заканчивает строку. 
     *  Для последнего элемента всегда true.
     */
    get is_newline_after() {
        return this.get_attr(4);
    }
    /**
     * [Set] Элемент заканчивает строку. 
     *  Для последнего элемента всегда true.
     */
    set is_newline_after(value) {
        this.set_attr(4, value);
        return value;
    }
    
    /**
     * [Get] Это используется внутренним образом
     */
    get inner_bool() {
        return this.get_attr(5);
    }
    /**
     * [Set] Это используется внутренним образом
     */
    set inner_bool(value) {
        this.set_attr(5, value);
        return value;
    }
    
    /**
     * [Get] Это используется внутренним образом  
     *  (признак того, что здесь не начинается именная группа, чтобы повторно не пытаться выделять)
     */
    get not_noun_phrase() {
        return this.get_attr(6);
    }
    /**
     * [Set] Это используется внутренним образом  
     *  (признак того, что здесь не начинается именная группа, чтобы повторно не пытаться выделять)
     */
    set not_noun_phrase(value) {
        this.set_attr(6, value);
        return value;
    }
    
    /**
     * [Get] Количество пробелов перед, переход на новую строку = 10, табуляция = 5
     */
    get whitespaces_before_count() {
        if (this.previous === null) 
            return 100;
        if ((this.previous.end_char + 1) === this.begin_char) 
            return 0;
        return this.calc_whitespaces(this.previous.end_char + 1, this.begin_char - 1);
    }
    
    /**
     * [Get] Количество переходов на новую строку перед
     */
    get newlines_before_count() {
        let ch0 = String.fromCharCode(0);
        let res = 0;
        let txt = this.kit.sofa.text;
        for (let p = this.begin_char - 1; p >= 0; p--) {
            let ch = txt[p];
            if ((ch.charCodeAt(0)) === 0xA) 
                res++;
            else if ((ch.charCodeAt(0)) === 0xD && (ch0.charCodeAt(0)) !== 0xA) 
                res++;
            else if (ch === '\f') 
                res += 10;
            else if (!Utils.isWhitespace(ch)) 
                break;
            ch0 = ch;
        }
        return res;
    }
    
    /**
     * [Get] Количество переходов на новую строку перед
     */
    get newlines_after_count() {
        let ch0 = String.fromCharCode(0);
        let res = 0;
        let txt = this.kit.sofa.text;
        for (let p = this.end_char + 1; p < txt.length; p++) {
            let ch = txt[p];
            if ((ch.charCodeAt(0)) === 0xD) 
                res++;
            else if ((ch.charCodeAt(0)) === 0xA && (ch0.charCodeAt(0)) !== 0xD) 
                res++;
            else if (ch === '\f') 
                res += 10;
            else if (!Utils.isWhitespace(ch)) 
                break;
            ch0 = ch;
        }
        return res;
    }
    
    /**
     * [Get] Количество пробелов перед, переход на новую строку = 10, табуляция = 5
     */
    get whitespaces_after_count() {
        if (this.next === null) 
            return 100;
        if ((this.end_char + 1) === this.next.begin_char) 
            return 0;
        return this.calc_whitespaces(this.end_char + 1, this.next.begin_char - 1);
    }
    
    calc_whitespaces(p0, p1) {
        if ((p0 < 0) || p0 > p1 || p1 >= this.kit.sofa.text.length) 
            return -1;
        let res = 0;
        for (let i = p0; i <= p1; i++) {
            let ch = this.kit.get_text_character(i);
            if (ch === '\r' || ch === '\n') {
                res += 10;
                let ch1 = this.kit.get_text_character(i + 1);
                if (ch !== ch1 && ((ch1 === '\r' || ch1 === '\n'))) 
                    i++;
            }
            else if (ch === '\t') 
                res += 5;
            else if (ch === '\u0007') 
                res += 100;
            else if (ch === '\f') 
                res += 100;
            else 
                res++;
        }
        return res;
    }
    
    /**
     * [Get] Это символ переноса
     */
    get is_hiphen() {
        let ch = this.kit.sofa.text[this.begin_char];
        return LanguageHelper.is_hiphen(ch);
    }
    
    /**
     * [Get] Это спец-символы для табличных элементов (7h, 1Eh, 1Fh)
     */
    get is_table_control_char() {
        let ch = this.kit.sofa.text[this.begin_char];
        return (ch.charCodeAt(0)) === 7 || (ch.charCodeAt(0)) === 0x1F || (ch.charCodeAt(0)) === 0x1E;
    }
    
    /**
     * [Get] Это соединительный союз И (на всех языках)
     */
    get is_and() {
        return false;
    }
    
    /**
     * [Get] Это соединительный союз ИЛИ (на всех языках)
     */
    get is_or() {
        return false;
    }
    
    /**
     * [Get] Это запятая
     */
    get is_comma() {
        return this.is_char(',');
    }
    
    /**
     * [Get] Это запятая или союз И
     */
    get is_comma_and() {
        return this.is_comma || this.is_and;
    }
    
    /**
     * Токен состоит из символа
     * @param ch проверяемый символ
     * @return 
     */
    is_char(ch) {
        if (this.begin_char !== this.end_char) 
            return false;
        return this.kit.sofa.text[this.begin_char] === ch;
    }
    
    /**
     * Токен состоит из одного символа, который есть в указанной строке
     * @param _chars строка возможных символов
     * @return 
     */
    is_char_of(_chars) {
        if (this.begin_char !== this.end_char) 
            return false;
        return _chars.indexOf(this.kit.sofa.text[this.begin_char]) >= 0;
    }
    
    is_value(term, termua = null) {
        return false;
    }
    
    /**
     * [Get] Признак того, что это буквенный текстовой токен (TextToken)
     */
    get is_letters() {
        return false;
    }
    
    /**
     * [Get] Это число (в различных вариантах задания)
     */
    get is_number() {
        return false;
    }
    
    /**
     * [Get] Это сущность (Referent)
     */
    get is_referent() {
        return false;
    }
    
    /**
     * Ссылка на сущность (для ReferentToken)
     */
    get_referent() {
        return null;
    }
    
    /**
     * Получить список ссылок на все сущности, скрывающиеся под элементом 
     *  (дело в том, что одни сущности могут поглощать дркгие, например, адрес поглотит город)
     * @return 
     */
    get_referents() {
        return null;
    }
    
    /**
     * Получить связанный с токеном текст в именительном падеже
     * @param mc 
     * @param single_number переводить ли в единственное число
     * @return 
     */
    get_normal_case_text(mc = null, single_number = false, gender = MorphGender.UNDEFINED, keep_chars = false) {
        return this.toString();
    }
    
    /**
     * Получить чистый фрагмент исходного текста
     * @return 
     */
    get_source_text() {
        let len = (this.end_char + 1) - this.begin_char;
        if ((len < 1) || (this.begin_char < 0)) 
            return null;
        if ((this.begin_char + len) > this.kit.sofa.text.length) 
            return null;
        return this.kit.sofa.text.substring(this.begin_char, this.begin_char + len);
    }
    
    /**
     * Проверка, что это текстовый токен и есть в словаре соотв. тип
     * @param cla 
     * @return 
     */
    get_morph_class_in_dictionary() {
        return this.morph.class0;
    }
    
    serialize(stream) {
        const SerializerHelper = require("./core/internal/SerializerHelper");
        SerializerHelper.serialize_int(stream, this.begin_char);
        SerializerHelper.serialize_int(stream, this.end_char);
        SerializerHelper.serialize_int(stream, this.m_attrs);
        SerializerHelper.serialize_int(stream, this.chars.value);
        if (this.m_morph === null) 
            this.m_morph = new MorphCollection();
        this.m_morph.serialize(stream);
    }
    
    deserialize(stream, _kit, vers) {
        const SerializerHelper = require("./core/internal/SerializerHelper");
        this.kit = _kit;
        this.m_begin_char = SerializerHelper.deserialize_int(stream);
        this.m_end_char = SerializerHelper.deserialize_int(stream);
        this.m_attrs = SerializerHelper.deserialize_int(stream);
        this.chars = CharsInfo._new2815(SerializerHelper.deserialize_int(stream));
        this.m_morph = new MorphCollection();
        this.m_morph.deserialize(stream);
    }
}


module.exports = Token