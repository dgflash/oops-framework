/*
 * @Author: dgflash
 * @Date: 2022-01-21 09:33:44
 * @LastEditors: dgflash
 * @LastEditTime: 2022-02-09 12:16:28
 */
import { RoleAttributeType } from "../RoleEnum";
import { RoleNumeric } from "./RoleNumeric";

/** 角色数值装饰器 */
export class RoleNumericDecorator {
    /** 属性类型 */
    attribute: RoleAttributeType = null!;
    /** 属性数值 */
    value: number = 0;
}

/** 所有模块角色属性集合 */
export class RoleNumericMap {
    /** 角色属性 */
    private attributes: Map<RoleAttributeType, RoleNumeric> = new Map();
    /** 角色属性修饰器 */
    private decorators: Map<RoleNumericDecorator, number> = new Map();
    /** ＶＭ组件数据 */
    private vm: any = null!;

    constructor(vm: any) {
        this.vm = vm;
    }

    /** 添加属性修饰器 */
    addDecorator(rnd: RoleNumericDecorator) {
        this.decorators.set(rnd, rnd.value);
        var rn = this.get(rnd.attribute);
        rn.decorator += rnd.value;
    }

    /** 移除属性修饰器 */
    removeDecorator(rnd: RoleNumericDecorator) {
        this.decorators.delete(rnd);
        var rn = this.get(rnd.attribute);
        rn.decorator -= rnd.value;
    }

    /** 获取角色属性 */
    get(type: RoleAttributeType): RoleNumeric {
        var attr = this.attributes.get(type);
        if (attr == null) {
            switch (type) {
                case RoleAttributeType.physical:
                    attr = new RoleNumericPhysical(type, this);
                    break;
                default:
                    attr = new RoleNumeric(type, this);
                    break;
            }
            this.attributes.set(type, attr);

            attr.onUpdate = (rn: RoleNumeric) => {
                this.vm[rn.type] = rn.value;
            };
        }
        return attr;
    }

    forEach(callbackfn: (value: RoleNumeric, key: RoleAttributeType, map: Map<RoleAttributeType, RoleNumeric>) => void, thisArg?: any): void {
        this.attributes.forEach(callbackfn, thisArg);
    }

    /** 重置属性值为零 */
    reset() {
        this.decorators.clear();
        this.attributes.forEach((value: RoleNumeric, key: RoleAttributeType, map: Map<RoleAttributeType, RoleNumeric>) => {
            value.reset();
        });
    }
}

/** 体质属性 */
export class RoleNumericPhysical extends RoleNumeric {
    protected update(): void {
        super.update();

        // 每点体质 = 0.5 生命
        this.attributes.get(RoleAttributeType.hp).base = Math.floor(this.value * 0.5);
    }
}