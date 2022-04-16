import { ecs } from "../../../core/libs/ECS";
import { RoleAttributeType } from "../model/RoleEnum";
import { RoleModelLevelComp } from "../model/RoleModelLevelComp";
import { Role } from "../Role";

/**
 * 角色升级
 */
@ecs.register('RoleUpgrade')
export class RoleUpgradeComp extends ecs.Comp {
    /** 当前等级 */
    lv: number = 0;

    reset() {
        this.lv = 0;
    }
}

export class RoleUpgradeSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(RoleUpgradeComp, RoleModelLevelComp);
    }

    entityEnter(e: Role): void {
        let rm = e.RoleModel;
        let rlm = e.RoleModelLevel;
        let ru = e.RoleUpgrade;

        if (ru.lv == 0)
            rlm.vm.lv++;                   // 提升一级
        else
            rlm.vm.lv = ru.lv;             // 设置等级

        // 当前等级配置
        rlm.rtluCurrent.init(rlm.vm.lv);
        // 等级附加属性
        rm.attributes.get(RoleAttributeType.hp).level = rlm.rtluCurrent.hp;

        // 下个等级配置
        rlm.rtluNext.init(rlm.vm.lv + 1);
        rlm.vm.expNext = rlm.rtluNext.needexp;

        e.remove(RoleUpgradeComp);
    }
}