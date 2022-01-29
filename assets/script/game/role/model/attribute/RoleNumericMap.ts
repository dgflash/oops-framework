/*
 * @Author: dgflash
 * @Date: 2022-01-21 09:33:44
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-29 16:52:49
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

/** 单一类型角色属性集合 */
export class RoleNumericMapSingle {
    private attributes: Map<RoleAttributeType, number> = new Map();

    /** 求和 */
    sum(type: RoleAttributeType, value: number) {
        var source = this.attributes.get(type);
        if (source == null) source = 0;
        this.attributes.set(type, source + value);
    }

    /** 重置属性值为零 */
    reset() {
        this.attributes.forEach((value: number, key: RoleAttributeType, map: Map<RoleAttributeType, number>) => {
            map.set(key, 0);
        });
    }

    /** 清除属性值 */
    clear() {
        this.attributes.clear();
    }

    /** 遍历每个属性执行指定回调函数 */
    forEach(callbackfn: (value: number, key: RoleAttributeType, map: Map<RoleAttributeType, number>) => void, thisArg?: any): void {
        this.attributes.forEach(callbackfn, thisArg);
    }
}

/** 所有模块角色属性集合 */
export class RoleNumericMap {
    private attributes: Map<RoleAttributeType, RoleNumeric> = new Map();
    private decorators: Map<RoleNumericDecorator, number> = new Map();
    private vm: any = null!;

    constructor(vm: any) {
        this.vm = vm;
    }

    /** 添加属性修饰器 */
    addDecorator(rnd: RoleNumericDecorator) {
        this.decorators.set(rnd, rnd.value);
        this.get(rnd.attribute).decorator += rnd.value;
    }

    /** 移除属性修饰器 */
    removeDecorator(rnd: RoleNumericDecorator) {
        this.decorators.delete(rnd);
        this.get(rnd.attribute).decorator -= rnd.value;
    }

    /** 获取角色属性 */
    get(type: RoleAttributeType): RoleNumeric {
        var attr = this.attributes.get(type);
        if (attr == null) {
            switch (type) {
                case RoleAttributeType.power:
                    attr = new RoleNumericPower(type, this);
                    break;
                case RoleAttributeType.physical:
                    attr = new RoleNumericPhysical(type, this);
                    break;
                case RoleAttributeType.agile:
                    attr = new RoleNumericAgile(type, this);
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
}

/** 力量属性 */
export class RoleNumericPower extends RoleNumeric {
    protected update(): void {
        super.update();

        // 每点力量 = 0.5 攻击力，武器需求力量，如果武器需求力量＞力量，则命中率=0%
        this.attributes.get(RoleAttributeType.ad).base = this.value * 0.5;
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

/** 敏捷属性 */
export class RoleNumericAgile extends RoleNumeric {
    protected update(): void {
        super.update();

        // 每点敏捷 = 1 点偏斜值 
        this.attributes.get(RoleAttributeType.skew).base = this.value;
    }
}
