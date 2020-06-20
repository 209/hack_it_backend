/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */

const Utils = require("./../unisharp/Utils");
const Hashtable = require("./../unisharp/Hashtable");
const RefOutArgWrapper = require("./../unisharp/RefOutArgWrapper");

const Feature = require("./Feature");

/**
 * Описатель некоторого класса сущностей
 */
class ReferentClass {
    
    constructor() {
        this.m_features = new Array();
        this.m_attrs = new Hashtable();
        this.hide_in_graph = false;
    }
    
    /**
     * [Get] Строковый идентификатор
     */
    get name() {
        return "?";
    }
    
    /**
     * [Get] Заголовок (зависит от текущего языка)
     */
    get caption() {
        return null;
    }
    
    toString() {
        return Utils.notNull(this.caption, this.name);
    }
    
    /**
     * [Get] Атрибуты класса
     */
    get features() {
        return this.m_features;
    }
    
    /**
     * Добавить фичу
     * @param attr_name 
     * @param attr_caption 
     * @param low_bound 
     * @param up_bound 
     * @return 
     */
    add_feature(attr_name, attr_caption, low_bound = 0, up_bound = 0) {
        let res = Feature._new2851(attr_name, attr_caption, low_bound, up_bound);
        this.m_features.push(res);
        if (!this.m_attrs.containsKey(attr_name)) 
            this.m_attrs.put(attr_name, res);
        else 
            this.m_attrs.put(attr_name, res);
        return res;
    }
    
    /**
     * Найти атрибут по его системному имени
     * @param _name 
     * @return 
     */
    find_feature(_name) {
        let res = null;
        let wrapres2852 = new RefOutArgWrapper();
        let inoutres2853 = this.m_attrs.tryGetValue(_name, wrapres2852);
        res = wrapres2852.value;
        if (!inoutres2853) 
            return null;
        else 
            return res;
    }
    
    /**
     * Вычислить картинку
     * @param obj если null, то общая картинка для типа
     * @return идентификатор картинки, саму картинку можно будет получить через ProcessorService.GetImageById
     */
    get_image_id(obj = null) {
        return null;
    }
}


module.exports = ReferentClass