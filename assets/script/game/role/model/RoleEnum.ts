/*
 * @Author: dgflash
 * @Date: 2022-01-26 14:14:34
 * @LastEditors: dgflash
 * @LastEditTime: 2022-01-27 15:49:36
 */

/** 角色属性类型 */
export enum RoleAttributeType {
    /** 力量 */
    power = "power",
    /** 体质 */
    physical = "physical",
    /** 技巧 */
    skill = "skill",
    /** 精准 */
    precise = "precise",
    /** 敏捷 */
    agile = "agile",
    /** 意志 */
    will = "will",
    /** 行动次数最大值 */
    action = "action",
    /** 反击次数最大值 */
    catkNum = "catkNum",
    /** 能量 */
    sp = "sp",

    /** 当前反击次数 */
    catkNumc = "catkNumc",
    /** 当前行动次数 */
    actionc = "actionc",
    /** 当前能量 */
    spc = "spc",

    /** 生命最大值 */
    hp = "hp",
    /** 当前生命 */
    hpc = "hpc",
    /** 负重最大值 */
    weight = "weight",
    /** 当前负重 */
    weightc = "weightc",

    /** 攻击 */
    ad = "ad",
    /** 攻击力比例加成 */
    adPro = "adPro",
    /** 附加伤害值 */
    adAttach = "adAttach",
    /** 附加伤害率 */
    adProAttach = "adProAttach",
    /** 护甲 */
    ar = "ar",
    /** 移动力 */
    move = "move",
    /** 命中概率 */
    hitPro = "hitPro",
    /** 命中值 */
    hit = "hit",
    /** 偏斜值 */
    skew = "skew",
    /** 偏斜概率 */
    skewPro = "skewPro",
    /** 暴击概率 */
    critPro = "critPro",
    /** 暴击伤害 */
    critDps = "critDps",
    /** 坚韧 */
    tenacity = "tenacity",
    /** 坚韧率 */
    tenacityPro = "tenacityPro",
    /** 格挡概率 */
    blockPro = "blockPro",
    /** 格挡值（格挡护甲） */
    block = "block",
    /** 招架概率 */
    parryPro = "parryPro",
    /** 招架值（招架护甲） */
    parry = "parry",
    /** 穿甲 */
    ap = "ap",
    /** 穿甲百分比 */
    apPro = "apPro",
    /** 治疗效果 */
    curePro = "curePro",
    /** 真实伤害 */
    dps = "dps",
    /** 真实伤害附加值 */
    dpsAttach = "dpsAttach",
    /** 真实伤害附加率 */
    dpsProAttach = "dpsProAttach",
    /** 速度 */
    speed = "speed",
    /** 减伤值 */
    hurt = "hurt",
    /** 减伤百分比 */
    hurtPro = "hurtPro",

    /** ----------控制伤害流程属性---------- */
    /** 必命中 */
    certainHit = "certainHit",
    /** 必招架 */
    certainParry = "certainParry",
    /** 必格挡 */
    certainBlock = "certainBlock",
    /** 必暴击 */
    certainCriticalHit = "certainCriticalHit",
    /** 禁止招架 */
    unableParry = "unableParry",
    /** 禁止格挡 */
    unableBlock = "unableBlock",
    /** 禁止偏斜 */
    unableSkew = "unableSkew",

    /** ----------控制功能流程属性---------- */
    /** 无法行动 */
    unableAction = "unableAction",
    /** 无法被选中 */
    unableSelect = "unableSelect",
    /** 无法反击 */
    unableCounterattack = "unableCounterattack",

    /** ----------恢复功能流程属性---------- */
    /** 治疗点数 */
    replyTreatmentPoints = "replyTreatmentPoints",
    /** 治疗生命上限百分比 */
    replyHpcPro = "replyHpcPro",
    /** 治疗值是否使用释放者等级计算 */
    replyLevel = "replyLevel",
    /** 治疗某属性百分比 */
    replyAttributePro = "replyAttributePro",
    /** 治疗伤害 */
    replyHurt = "replyHurt",
    /** 受治疗效果 */
    replyResult = "replyResult"
}

/** 角色动作名 */
export enum RoleAnimatorType {
    /** 待机 */
    Idle = "Idle",
    /** 攻击 */
    Attack = "Attack",
    /** 受击 */
    Hurt = "Hurt",
    /** 死亡 */
    Dead = "Dead"
}

/** 武器名 */
export var WeaponName: any = {
    0: "Fist",
    1: "Katana",
    2: "CrossGun",
    3: "LongGun",
    4: "Razor",
    5: "Arch",
    6: "Crossbow",
    7: "IronCannon",
    8: "FireGun",
    9: "Wakizashi",
    10: "Kunai",
    11: "Dagger",
    12: "Kusarigama",
    13: "DanceFan",
    14: "Flag",
    15: "MilitaryFan",
    16: "Shield"
}