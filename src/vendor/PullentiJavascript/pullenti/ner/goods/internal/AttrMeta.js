/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");
const GoodAttrType = require("./../GoodAttrType");

class AttrMeta extends ReferentClass {
    
    constructor() {
        super();
        this.typ_attr = null;
    }
    
    static initialize() {
        const GoodAttributeReferent = require("./../GoodAttributeReferent");
        AttrMeta.GLOBAL_META = new AttrMeta();
        AttrMeta.GLOBAL_META.typ_attr = AttrMeta.GLOBAL_META.add_feature(GoodAttributeReferent.ATTR_TYPE, "Тип", 0, 1);
        AttrMeta.GLOBAL_META.typ_attr.add_value(GoodAttrType.KEYWORD.toString(), "Ключевое слово", null, null);
        AttrMeta.GLOBAL_META.typ_attr.add_value(GoodAttrType.CHARACTER.toString(), "Качеств.свойство", null, null);
        AttrMeta.GLOBAL_META.typ_attr.add_value(GoodAttrType.MODEL.toString(), "Модель", null, null);
        AttrMeta.GLOBAL_META.typ_attr.add_value(GoodAttrType.NUMERIC.toString(), "Колич.свойство", null, null);
        AttrMeta.GLOBAL_META.typ_attr.add_value(GoodAttrType.PROPER.toString(), "Имя собственное", null, null);
        AttrMeta.GLOBAL_META.typ_attr.add_value(GoodAttrType.REFERENT.toString(), "Ссылка", null, null);
        AttrMeta.GLOBAL_META.add_feature(GoodAttributeReferent.ATTR_VALUE, "Значение", 1, 0);
        AttrMeta.GLOBAL_META.add_feature(GoodAttributeReferent.ATTR_ALTVALUE, "Значание (альт.)", 0, 0);
        AttrMeta.GLOBAL_META.add_feature(GoodAttributeReferent.ATTR_UNIT, "Единица измерения", 0, 1);
        AttrMeta.GLOBAL_META.add_feature(GoodAttributeReferent.ATTR_NAME, "Название", 0, 1);
        AttrMeta.GLOBAL_META.add_feature(GoodAttributeReferent.ATTR_REF, "Ссылка", 0, 1);
    }
    
    get name() {
        const GoodAttributeReferent = require("./../GoodAttributeReferent");
        return GoodAttributeReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Атрибут товара";
    }
    
    get_image_id(obj = null) {
        return AttrMeta.ATTR_IMAGE_ID;
    }
    
    static static_constructor() {
        AttrMeta.ATTR_IMAGE_ID = "attr";
        AttrMeta.GLOBAL_META = null;
    }
}


AttrMeta.static_constructor();

module.exports = AttrMeta