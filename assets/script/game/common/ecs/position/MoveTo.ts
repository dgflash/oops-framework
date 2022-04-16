/*
 * @Author: dgflash
 * @Date: 2021-08-11 16:41:12
 * @LastEditors: dgflash
 * @LastEditTime: 2022-04-15 11:36:40
 */
import { Node, Vec3 } from "cc";
import { Timer } from "../../../../core/common/manager/TimerManager";
import { ecs } from "../../../../core/libs/ECS";
import { Vec3Util } from "../../../../core/utils/Vec3Util";

/** 向目标移动，移动过程中目标位置变化会自动修正移动目标点，直到未修正前移动到目标点停止 */
@ecs.register('MoveTo')
export class MoveToComp extends ecs.Comp {
    /** 移动节点 */
    node: Node = null!;
    /** 移动方向 */
    velocity: Vec3 = Vec3Util.zero;
    /** 移动速度（每秒移动的像素距离） */
    speed: number = 0;
    /** 目标实体ECS编号、目标位置 */
    target: Vec3 | Node | null = null;

    /** 坐标标（默认本地坐标） */
    ns: number = Node.NodeSpace.LOCAL;
    /** 偏移距离 */
    offset: number = 0;
    /** 偏移向量 */
    offsetVector: Vec3 | null = null;
    /** 移动完成回调 */
    onComplete: Function | null = null;
    /** 距离变化时 */
    onChange: Function | null = null;

    reset() {
        this.ns = Node.NodeSpace.LOCAL;
        this.offset = 0;
        this.target = null;
        this.offsetVector = null;
        this.onComplete = null;
        this.onChange = null;
    }
}

@ecs.register('VariableMoveTo')
class VariableMoveToComponent extends ecs.Comp {
    /** 延时触发器 */
    timer: Timer = new Timer();
    /** 终点备份 */
    end: Vec3 | null = null;
    /** 目标位置 */
    target!: Vec3;

    reset() {
        this.end = null;
        this.timer.reset();
    }
}

/** 跟踪移动到目标位置 */
export class MoveToSystem extends ecs.ComblockSystem<ecs.Entity> implements ecs.IEntityEnterSystem, ecs.IEntityRemoveSystem, ecs.ISystemUpdate {
    filter(): ecs.IMatcher {
        return ecs.allOf(MoveToComp);
    }

    entityEnter(e: ecs.Entity): void {
        e.add(VariableMoveToComponent);
    }

    entityRemove(e: ecs.Entity): void {
        e.remove(VariableMoveToComponent);
    }

    update(e: ecs.Entity) {
        let move = e.get(MoveToComp);
        let mtv = e.get(VariableMoveToComponent);
        let end: Vec3;

        console.assert(move.speed > 0, "移动速度必须要大于零");

        if (move.target instanceof Node) {
            end = move.ns == Node.NodeSpace.WORLD ? move.target.worldPosition : move.target.position;
        }
        else {
            end = move.target as Vec3;
        }

        // 目标移动后，重计算移动方向与移动到目标点的速度
        if (mtv.end == null || !mtv.end.strictEquals(end)) {
            let target = end.clone();
            if (move.offsetVector) {
                target = target.add(move.offsetVector);           // 这里的问题
            }

            // 移动方向与移动数度
            let start = move.ns == Node.NodeSpace.WORLD ? move.node.worldPosition : move.node.position;
            move.velocity = Vec3Util.sub(target, start).normalize();

            // 移动时间与目标偏位置计算
            let distance = Vec3.distance(start, target) - move.offset;

            move.onChange?.call(this);

            if (distance - move.offset <= 0) {
                this.exit(e);
            }
            else {
                mtv.timer.step = distance / move.speed;
                mtv.end = end.clone();
                mtv.target = move.velocity.clone().multiplyScalar(distance).add(start);
            }
        }

        if (move.speed > 0) {
            let trans = Vec3Util.mul(move.velocity, move.speed * this.dt);
            move.node.translate(trans, Node.NodeSpace.LOCAL);
        }

        // 移动完成事件
        if (mtv.timer.update(this.dt)) {
            if (move.ns == Node.NodeSpace.WORLD)
                move.node.worldPosition = mtv.target;
            else
                move.node.position = mtv.target;

            this.exit(e);
        }
    }

    private exit(e: ecs.Entity) {
        let move = e.get(MoveToComp);
        move.onComplete?.call(this);
        e.remove(VariableMoveToComponent);
        e.remove(MoveToComp);
    }
}