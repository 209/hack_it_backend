/*
 * Copyright (c) 2013, Pullenti. All rights reserved. Non-Commercial Freeware.
 * This class is generated using the converter UniSharping (www.unisharping.ru) from Pullenti C#.NET project (www.pullenti.ru).
 * See www.pullenti.ru/downloadpage.aspx.
 */


const AddressDetailType = require("./../AddressDetailType");
const ReferentClass = require("./../../ReferentClass");
const AddressHouseType = require("./../AddressHouseType");
const AddressBuildingType = require("./../AddressBuildingType");

class MetaAddress extends ReferentClass {
    
    constructor() {
        super();
        this.detail_feature = null;
        this.house_type_feature = null;
        this.building_type_feature = null;
    }
    
    static initialize() {
        const AddressReferent = require("./../AddressReferent");
        MetaAddress.global_meta = new MetaAddress();
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_STREET, "Улица", 0, 2);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_HOUSE, "Дом", 0, 1);
        MetaAddress.global_meta.house_type_feature = MetaAddress.global_meta.add_feature(AddressReferent.ATTR_HOUSETYPE, "Тип дома", 0, 1);
        MetaAddress.global_meta.house_type_feature.add_value(AddressHouseType.ESTATE.toString(), "Владение", null, null);
        MetaAddress.global_meta.house_type_feature.add_value(AddressHouseType.HOUSE.toString(), "Дом", null, null);
        MetaAddress.global_meta.house_type_feature.add_value(AddressHouseType.HOUSEESTATE.toString(), "Домовладение", null, null);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_BUILDING, "Строение", 0, 1);
        MetaAddress.global_meta.building_type_feature = MetaAddress.global_meta.add_feature(AddressReferent.ATTR_BUILDINGTYPE, "Тип строения", 0, 1);
        MetaAddress.global_meta.building_type_feature.add_value(AddressBuildingType.BUILDING.toString(), "Строение", null, null);
        MetaAddress.global_meta.building_type_feature.add_value(AddressBuildingType.CONSTRUCTION.toString(), "Сооружение", null, null);
        MetaAddress.global_meta.building_type_feature.add_value(AddressBuildingType.LITER.toString(), "Литера", null, null);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_CORPUS, "Корпус", 0, 1);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_PORCH, "Подъезд", 0, 1);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_FLOOR, "Этаж", 0, 1);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_FLAT, "Квартира", 0, 1);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_CORPUSORFLAT, "Корпус или квартира", 0, 1);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_OFFICE, "Офис", 0, 1);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_PLOT, "Участок", 0, 1);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_BLOCK, "Блок", 0, 1);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_BOX, "Бокс", 0, 1);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_KILOMETER, "Километр", 0, 1);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_GEO, "Город\\Регион\\Страна", 0, 1);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_ZIP, "Индекс", 0, 1);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_POSTOFFICEBOX, "Абоненский ящик", 0, 1);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_CSP, "ГСП", 0, 1);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_METRO, "Метро", 0, 1);
        let detail = MetaAddress.global_meta.add_feature(AddressReferent.ATTR_DETAIL, "Дополнительный указатель", 0, 1);
        MetaAddress.global_meta.detail_feature = detail;
        detail.add_value(AddressDetailType.CROSS.toString(), "На пересечении", null, null);
        detail.add_value(AddressDetailType.NEAR.toString(), "Вблизи", null, null);
        detail.add_value(AddressDetailType.HOSTEL.toString(), "Общежитие", null, null);
        detail.add_value(AddressDetailType.NORTH.toString(), "Севернее", null, null);
        detail.add_value(AddressDetailType.SOUTH.toString(), "Южнее", null, null);
        detail.add_value(AddressDetailType.EAST.toString(), "Восточнее", null, null);
        detail.add_value(AddressDetailType.WEST.toString(), "Западнее", null, null);
        detail.add_value(AddressDetailType.NORTHEAST.toString(), "Северо-восточнее", null, null);
        detail.add_value(AddressDetailType.NORTHWEST.toString(), "Северо-западнее", null, null);
        detail.add_value(AddressDetailType.SOUTHEAST.toString(), "Юго-восточнее", null, null);
        detail.add_value(AddressDetailType.SOUTHWEST.toString(), "Юго-западнее", null, null);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_MISC, "Разное", 0, 0);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_DETAILPARAM, "Параметр детализации", 0, 1);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_FIAS, "Объект ФИАС", 0, 1);
        MetaAddress.global_meta.add_feature(AddressReferent.ATTR_BTI, "Объект БТИ", 0, 1);
    }
    
    get name() {
        const AddressReferent = require("./../AddressReferent");
        return AddressReferent.OBJ_TYPENAME;
    }
    
    get caption() {
        return "Адрес";
    }
    
    get_image_id(obj = null) {
        return MetaAddress.ADDRESS_IMAGE_ID;
    }
    
    static static_constructor() {
        MetaAddress.ADDRESS_IMAGE_ID = "address";
        MetaAddress.global_meta = null;
    }
}


MetaAddress.static_constructor();

module.exports = MetaAddress