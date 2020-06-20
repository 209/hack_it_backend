/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");
const BusinessFactKind = require("./../BusinessFactKind");

class MetaBusinessFact extends ReferentClass {
    
    constructor() {
        super();
        this.kind_feature = null;
    }
    
    static initialize() {
        const BusinessFactReferent = require("./../BusinessFactReferent");
        MetaBusinessFact.GLOBAL_META = new MetaBusinessFact();
        let f = MetaBusinessFact.GLOBAL_META.add_feature(BusinessFactReferent.ATTR_KIND, "Класс", 0, 1);
        MetaBusinessFact.GLOBAL_META.kind_feature = f;
        f.add_value(BusinessFactKind.CREATE.toString(), "Создавать", null, null);
        f.add_value(BusinessFactKind.DELETE.toString(), "Удалять", null, null);
        f.add_value(BusinessFactKind.HAVE.toString(), "Иметь", null, null);
        f.add_value(BusinessFactKind.GET.toString(), "Приобретать", null, null);
        f.add_value(BusinessFactKind.SELL.toString(), "Продавать", null, null);
        f.add_value(BusinessFactKind.PROFIT.toString(), "Доход", null, null);
        f.add_value(BusinessFactKind.DAMAGES.toString(), "Убытки", null, null);
        f.add_value(BusinessFactKind.AGREEMENT.toString(), "Соглашение", null, null);
        f.add_value(BusinessFactKind.SUBSIDIARY.toString(), "Дочернее предприятие", null, null);
        f.add_value(BusinessFactKind.FINANCE.toString(), "Финансировать", null, null);
        f.add_value(BusinessFactKind.LAWSUIT.toString(), "Судебный иск", null, null);
        MetaBusinessFact.GLOBAL_META.add_feature(BusinessFactReferent.ATTR_TYPE, "Тип", 0, 1);
        MetaBusinessFact.GLOBAL_META.add_feature(BusinessFactReferent.ATTR_WHO, "Кто", 0, 1).show_as_parent = true;
        MetaBusinessFact.GLOBAL_META.add_feature(BusinessFactReferent.ATTR_WHOM, "Кого\\Кому", 0, 1).show_as_parent = true;
        MetaBusinessFact.GLOBAL_META.add_feature(BusinessFactReferent.ATTR_WHEN, "Когда", 0, 1).show_as_parent = true;
        MetaBusinessFact.GLOBAL_META.add_feature(BusinessFactReferent.ATTR_WHAT, "Что", 0, 0).show_as_parent = true;
        MetaBusinessFact.GLOBAL_META.add_feature(BusinessFactReferent.ATTR_MISC, "Дополнительная информация", 0, 0).show_as_parent = true;
    }
    
    get name() {
        const BusinessFactReferent = require("./../BusinessFactReferent");
        return BusinessFactReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Бизнес-факт";
    }
    
    get_image_id(obj = null) {
        return MetaBusinessFact.IMAGE_ID;
    }
    
    static static_constructor() {
        MetaBusinessFact.IMAGE_ID = "businessfact";
        MetaBusinessFact.GLOBAL_META = null;
    }
}


MetaBusinessFact.static_constructor();

module.exports = MetaBusinessFact