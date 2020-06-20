/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const ReferentClass = require("./../../ReferentClass");

class MetaBank extends ReferentClass {
    
    static initialize() {
        const BankDataReferent = require("./../BankDataReferent");
        MetaBank.global_meta = new MetaBank();
        MetaBank.global_meta.add_feature(BankDataReferent.ATTR_ITEM, "Элемент", 0, 0).show_as_parent = true;
        MetaBank.global_meta.add_feature(BankDataReferent.ATTR_BANK, "Банк", 0, 1);
        MetaBank.global_meta.add_feature(BankDataReferent.ATTR_CORBANK, "Банк К/С", 0, 1);
        MetaBank.global_meta.add_feature(BankDataReferent.ATTR_MISC, "Разное", 0, 0);
    }
    
    get name() {
        const BankDataReferent = require("./../BankDataReferent");
        return BankDataReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Банковские реквизиты";
    }
    
    get_image_id(obj = null) {
        return MetaBank.IMAGE_ID;
    }
    
    static static_constructor() {
        MetaBank.IMAGE_ID = "bankreq";
        MetaBank.global_meta = null;
    }
}


MetaBank.static_constructor();

module.exports = MetaBank