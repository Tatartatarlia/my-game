/**
 * story
 * - 存放你的剧情“节点图 / 状态机”数据
 * - 建议结构（示例概念，不是代码）：
 *   - nodes: { [nodeId]: { text, speaker, choices: [{ choiceId, label, nextNodeId, affectionDelta, failTrigger }] } }
 *   - 也可以区分：
 *     - dialogue nodes（对话节点）
 *     - choice nodes（选择节点）
 *     - failure nodes（失败节点，可选）
 *
 * 你当前需求依赖的能力：
 * - 错误选项导致失败（或好感过低导致失败）
 * - 每次选择要能回溯到“选择发生前”的 checkpoint
 * - 存档页展示已经经过的对话（history 来自节点推进）
 */
// src/data/story.js

export const storyGraph = {
    intro_1: {
      id: 'intro_1',
      type: 'dialogue',
      speaker: 'traveler',
      speakerName: '你',
      text: '（伸懒腰）哎——又是平静的一天啊。',
      nextId: 'intro_2',
    },
    intro_2: {
      id: 'intro_2',
      type: 'dialogue',
      speaker: 'paimon',
      speakerName: '派蒙',
      text: '（点点头）是啊。预言危机解除了，当然就是这样平静的生活啦。这样的生活真是太好了，没有乱七八糟的大麻烦要去解决，想吃什么美食就吃什么美食，嘿嘿！',
      nextId: 'intro_3',
    },
    intro_3: {
      id: 'intro_3',
      type: 'dialogue',
      speaker: 'traveler',
      speakerName: '你',
      text: '（白了派蒙一眼）还不是我在打工养着你这个贪吃鬼！',
      nextId: 'intro_4',
    },
    intro_4: {
      id: 'intro_4',
      type: 'dialogue',
      speaker: 'paimon',
      speakerName: '派蒙',
      text: '哎呀我肯定要谢谢你嘛！你是我最好的伙伴！而且枫丹如今能有这样的安宁，也有你的一份功劳呀。',
      nextId: 'intro_5',
    },
    intro_5: {
      id: 'intro_5',
      type: 'dialogue',
      speaker: 'traveler',
      speakerName: '你',
      text: '没错。不过嘛，这其中还有一个人的功劳，可惜他已经被大家遗忘了。',
      nextId: 'intro_6',
    },
    intro_6: {
      id: 'intro_6',
      type: 'dialogue',
      speaker: 'paimon',
      speakerName: '派蒙',
      text: '是谁呀？你先别说，让我想想……嗯，这个人是不是枫丹人？',
      nextId: 'intro_7',
    },
    intro_7: {
      id: 'intro_7',
      type: 'dialogue',
      speaker: 'traveler',
      speakerName: '你',
      text: '不是。知道是谁了吗，我已经暗示得挺明显的了。',
      nextId: 'intro_8',
    },
    intro_8: {
      id: 'intro_8',
      type: 'dialogue',
      speaker: 'paimon',
      speakerName: '派蒙',
      text: '你是说，「公子」？',
      nextId: 'intro_9',
    },
    intro_9: {
      id: 'intro_9',
      type: 'dialogue',
      speaker: 'traveler',
      speakerName: '你',
      text: '没错。因为有他拖住吞星之鲸几十天，我们才能争取到足够的时间。可是那家伙受了很严重的伤，我甚至都没有亲手将神之眼送回他手上……也不知道他现在恢复得怎么样了。',
      nextId: 'intro_10',
    },
    intro_10: {
      id: 'intro_10',
      type: 'dialogue',
      speaker: 'paimon',
      speakerName: '派蒙',
      text: '他确实起了很大作用呢。你这么一说确实，好像大家都忘记他了。本来「公子」是来枫丹度假的，结果莫名其妙被判有罪进了梅洛彼得堡，还在之后的战斗中受了重伤……我感觉这家伙还挺惨的。',
      nextId: 'intro_11',
    },
    intro_11: {
      id: 'intro_11',
      type: 'dialogue',
      speaker: 'traveler',
      speakerName: '你',
      text: '是啊。自从危机结束后我就一直在担心「公子」的状况。可是呢，有你这个家伙拦着我说“前面的区域，以后再来探索吧~”，不然我早就去至冬看望他的伤势了。',
      nextId: 'intro_12',
    },
    intro_12: {
      id: 'intro_12',
      type: 'dialogue',
      speaker: 'paimon',
      speakerName: '派蒙',
      text: '（不好意思）啊哈哈哈，这也是没办法嘛，毕竟我们的旅途还没到开启至冬的时候……哎不对旅行者，你居然这么关心「公子」这家伙，我怎么不知道呢~',
      nextId: 'intro_13',
    },
    intro_13: {
      id: 'intro_13',
      type: 'dialogue',
      speaker: 'traveler',
      speakerName: '你',
      text: '（脸红）只是正常的关心而已，我可不想见到有人的功劳被埋没的情况。时候不早了，我们该去解决今天的委托了。',
      nextId: 'intro_choice_1', // 开头剧情
    },
    intro_choice_1: {//第一个选项节点
        id: 'intro_choice_1',
        type: 'choice',
        speaker: 'narrator',        // 或 'paimon'，看你想谁说
        speakerName: '',            // 如果是旁白可以留空
        text: '接下来你会：',       // 对话框里的提示文字
        choices: [
          {
            id: 'intro_choice_1_a',
            label: '老老实实做委托',        // 选项1文案
            nextId: 'meet_1',             // 正常推进到后面的剧情节点
            failOnChoose: false,
          },
          {
            id: 'intro_choice_1_b',
            label: '我有好多历练点，直接用做啥委托！',  // 选项2文案
            nextId: 'intro_fail_1',                     // 直接跳到失败节点
            failOnChoose: true,                         // 标记为“这条路是失败”
          },
        ],
      },
      
      intro_fail_1: {//失败节点
        id: 'intro_fail_1',
        type: 'dialogue',          // 也可以用 'ending' 或 'fail'，看你之后怎么处理
        speaker: 'narrator',
        speakerName: '',
        text:
          '就这样，你使用了历练点，不用跑腿了。这一天不过是你往常无数普通日子的微不足道的一天。',
        nextId: null,              // 这里先不接别的，等你做失败页/回退时再处理
      },
      // 相遇剧情
      meet_1: {
        id: 'meet_1',
        type: 'dialogue',
        speaker: 'traveler',
        speakerName: '你',
        // 达达利亚好感度初始化：最大 5，初始 1
        affectionInit: {
          tartaglia: {
            value: 1,
            max: 5,
            failThreshold: 0,
          },
        },
        text: '（拿着讨伐手册）好嘞！做完这个委托就可以收工了！',
        nextId: 'meet_2',
      },
    meet_2: {
        id: 'meet_2',
        type: 'dialogue',
        speaker: 'fatui_soldier',
        speakerName: '愚人众士兵',
        text: '这样真的没问题吗，「公子」大人？',
        nextId: 'meet_3',
    },
    meet_3: {
        id: 'meet_3',
        type: 'dialogue',
        speaker: 'tartaglia',
        speakerName: '达达利亚',
        text: '没关系没关系！相信我的实力和眼光！',
        nextId: 'meet_4',
    },
    meet_4: {
        id: 'meet_4',
        type: 'narration', // 新增旁白类型，区分对话与叙述
        speaker: 'narration',
        speakerName: '',
        text: '你和派蒙到达了这里。隔老远你就看到一颗橘子似的脑袋，你心中有个猜想，不由得忐忑不安。你怀着急切的心情冲向营地，达达利亚这时候转过头来望向了你，验证了你的猜想。',
        nextId: 'meet_5',
    },
    meet_5: {
        id: 'meet_5',
        type: 'dialogue',
        speaker: 'tartaglia',
        speakerName: '达达利亚',
        text: '说旅行者，旅行者就到。（转向你）哟，好久不见，伙伴！我正准备待会去冒险家协会找你，没想到你直接来我这了。',
        nextId: 'meet_6',
    },
    meet_6: {
        id: 'meet_6',
        type: 'dialogue',
        speaker: 'traveler',
        speakerName: '你',
        text: '（抑制住激动的心情）达达利亚，你的伤没事了吗？',
        nextId: 'meet_7',
    },
    meet_7: {
        id: 'meet_7',
        type: 'dialogue',
        speaker: 'tartaglia',
        speakerName: '达达利亚',
        text: '放心，我已经完全好了。之前伤重，都没来得及和你好好道别，抱歉。',
        nextId: 'meet_8',
    },
    meet_8: {
        id: 'meet_8',
        type: 'dialogue',
        speaker: 'paimon',
        speakerName: '派蒙',
        text: '你这家伙，可把旅行者担心死了！今天吃早饭的时候，旅行者还说一直担心你的情况呢！',
        nextId: 'meet_9',
    },
    meet_9: {
        id: 'meet_9',
        type: 'dialogue',
        speaker: 'traveler',
        speakerName: '你',
        text: '（脸红）咳咳，派蒙！',
        nextId: 'meet_10',
    },
    meet_10: {
        id: 'meet_10',
        type: 'dialogue',
        speaker: 'paimon',
        speakerName: '派蒙',
        text: '（捂嘴）哦哈哈哈哈！你这家伙没事就好。不过话说回来，你之前说要去找我们，是有什么事吗？',
        nextId: 'meet_11',
    },
    meet_11: {
        id: 'meet_11',
        type: 'dialogue',
        speaker: 'tartaglia',
        speakerName: '达达利亚',
        text: '当然是正式委托旅行者，和我一同去枫丹一处遗迹调查。',
        nextId: 'meet_12',
    },
    meet_12: {
        id: 'meet_12',
        type: 'dialogue',
        speaker: 'traveler',
        speakerName: '你',
        text: '调查？你不是有手下吗，为什么要委托我？',
        nextId: 'meet_13',
    },
    meet_13: {
        id: 'meet_13',
        type: 'dialogue',
        speaker: 'tartaglia',
        speakerName: '达达利亚',
        text: '因为这座遗迹很危险，我的手下不足以在调查过程中帮助我，我需要一位实力强大的伙伴同行。思来想去，只有你最合适，旅行者。当然，我会支付丰厚的报酬的。（向你们展示报酬）',
        nextId: 'meet_14',
    },
    meet_14: {
        id: 'meet_14',
        type: 'dialogue',
        speaker: 'paimon',
        speakerName: '派蒙',
        text: '（星星眼）哇，好多好多摩拉！',
        nextId: 'meet_15',
    },
    meet_15: {
        id: 'meet_15',
        type: 'dialogue',
        speaker: 'traveler',
        speakerName: '你',
        text: '（星星眼）好多好多原石！（用力甩甩头）不对，至冬的愚人众执行官在枫丹的遗迹调查？不会是愚人众的阴谋吧？还有，我来这是为了完成每日委托的，让我先赶跑你们这些愚人众好交差！',
        nextId: 'meet_16',
    },
    meet_16: {
        id: 'meet_16',
        type: 'dialogue',
        speaker: 'tartaglia',
        speakerName: '达达利亚',
        text: '欸别别别，刚一见面就要赶跑我的手下？这怎么行，别这样，我叫他们撤走就是了，这样你也算完成任务了。至于我为什么能在枫丹调查遗迹，那就说来话长了。时间也快到中午了，午饭我在德波大饭店请你们，想吃什么尽管点。吃饭的时候我再慢慢细说这件事。',
        nextId: 'meet_17',
    },
    meet_17: {
        id: 'meet_17',
        type: 'dialogue',
        speaker: 'paimon',
        speakerName: '派蒙',
        text: '好耶！旅行者，可以白蹭他的饭！',
        nextId: 'meet_choice_1', // 预留后续剧情ID，可根据需要修改
    },
    meet_choice_1: {//第二个选项节点
        id: 'meet_choice_1',
        type: 'choice',
        speaker: 'narrator',        // 或 'paimon'，看你想谁说
        speakerName: '',            // 如果是旁白可以留空
        text: '接下来你会：',       // 对话框里的提示文字
        choices: [
          {
            id: 'meet_choice_1_a',
            label: '接受达达利亚的邀请，有饭吃还有1600原石！',        // 选项1文案
            nextId: 'meet_18',             // 正常推进到后面的剧情节点
            failOnChoose: false,
            affectionDelta: { // 新增：好感度变化 - 接受邀请+1
                tartaglia: +1 
              }
          },
          {
            id: 'meet_choice_1_b',
            label: '拒绝达达利亚的邀请，是愚人众的阴谋怎么办？',  // 选项2文案
            nextId: 'meet_fail_1',                     // 直接跳到失败节点
            failOnChoose: true,                         // 标记为“这条路是失败”
            affectionDelta: { // 新增：好感度变化 - 拒绝邀请-1
                tartaglia: -1 
              }
          },
        ],
      },
      
      meet_fail_1: {
        id: 'meet_fail_1',
        type: 'dialogue',
        speaker: 'narrator',
        speakerName: '',
        text:
          '就这样，你拒绝了达达利亚。达达利亚的好感度-1，当前好感度为0，失去了与他发展进一步关系的机会。',
        nextId: null,
        // 新增：标记这是好感度失败节点
        failType: 'affection',
        // 新增：失败对应的角色和阈值
        failAffection: {
          tartaglia: 0
        }
      },
      // 选择meet_choice_1后
    meet_18: {
        id: 'meet_18',
        type: 'dialogue',
        speaker: 'traveler',
        speakerName: '你',
        text: '那先谢谢你啦，达达利亚。那麻烦你先去饭店里等我，我去冒险家协会交个差。',
        nextId: 'meet_19',
        // 可选：标记当前好感度（接受邀请后从1→2）
        affectionTip: {
        tartaglia: 2
        }
    },
    meet_19: {
        id: 'meet_19',
        type: 'dialogue',
        speaker: 'tartaglia',
        speakerName: '达达利亚',
        text: '没问题。',
        nextId: 'lunch_1', // 预留后续剧情ID，可根据需要修改
    },
    //午餐对话节点
      lunch_1: {
        id: 'lunch_1',
        type: 'dialogue',
        speaker: 'tartaglia',
        speakerName: '达达利亚',
        text: '我的调查行动是经过至冬和枫丹两国都同意的。如果不信，可以待会来北国银行，我给你看两国高层批准的文件。',
        nextId: 'lunch_2',
      },
    lunch_2: {
        id: 'lunch_2',
        type: 'dialogue',
        speaker: 'traveler',
        speakerName: '你',
        text: '这样啊，但是为什么枫丹方面会同意呢？允许他国高层官员来调查本国遗迹，实在难以想象。对你们来说，肯定是因为能获取到某些好处，才会这么做吧。',
        nextId: 'lunch_3',
    },
    lunch_3: {
        id: 'lunch_3',
        type: 'dialogue',
        speaker: 'tartaglia',
        speakerName: '达达利亚',
        text: '大概是因为，这座遗迹其实很「危险」吧。这座雷穆利亚王朝留下来的遗迹，已经危险到了不能不管的地步，而枫丹方面并没有适合的人选来解决它。所以，即使我以这样的身份行动，枫丹高层也不得不接受。至于好处，你说的没错。我的目的，就是为了在这座遗迹中，取得女皇陛下想要的东西。这场行动要是成功了，双方都能得利。',
        nextId: 'lunch_4',
    },
    lunch_4: {
        id: 'lunch_4',
        type: 'dialogue',
        speaker: 'paimon',
        speakerName: '派蒙',
        text: '哦，到底能有多危险？我和旅行者也已经走过五国了，什么大大小小的危险旅程我们都经历过，区区一座遗迹有什么好怕的。而且，真有那么危险的话，万一你在里面出了什么意外，……我是说万一，枫丹方面该怎么应对至冬？上次你被冤枉入狱，枫丹方面都拿不出说辞。',
        nextId: 'lunch_5',
    },
    lunch_5: {
        id: 'lunch_5',
        type: 'dialogue',
        speaker: 'tartaglia',
        speakerName: '达达利亚',
        text: '这也就是为什么，我要请旅行者来与我一起调查遗迹了。你有实力，能在调查中充当我的得力助手，也能够应付可能遇到的各种危险。不过，你可以拒绝，遗迹的危险程度可能超出你的想象。至冬方面已经承诺，如果我真出事了，与枫丹无关。如果你不答应，也可以放心，我自己一个人去调查也没问题，毕竟这种类似的危险差事，我之前也没少做，而且做得很好。',
        nextId: 'lunch_6',
    },
    lunch_6: {
        id: 'lunch_6',
        type: 'dialogue',
        speaker: 'traveler',
        speakerName: '你',
        text: '怎么可能让你单打独斗！上次你一个人和吞星之鲸缠斗时受重伤的事情就忘了？你的委托我接了。为了报酬，更为了我不想看到这样的事重演！',
        nextId: 'lunch_7',
    },
    lunch_7: {
        id: 'lunch_7',
        type: 'dialogue',
        speaker: 'tartaglia',
        speakerName: '达达利亚',
        text: '好！明天一早我们就出发，记得准备好。今天下午，我们去野外切磋一下吧！我一直想和你再好好较量一次，今天可算是逮着机会了。',
        nextId: 'lunch_choice_1', // 预留后续剧情ID，可根据需要修改
    },
    // 新增切磋选项节点
    lunch_choice_1: {
        id: 'lunch_choice_1',
        type: 'choice',
        speaker: 'narrator',
        speakerName: '',
        text: '接下来你会：',
        choices: [
        {
            id: 'lunch_choice_1_a',
            label: '接受切磋邀请，满足达达利亚的战斗欲',
            nextId: 'lunch_8', // 正确选项，推进到后续剧情
            failOnChoose: false,
            affectionDelta: {
            tartaglia: +1 // 正确选项无好感度变化，也可根据需求设为+1
            }
        },
        {
            id: 'lunch_choice_1_b',
            label: '拒绝切磋邀请，这个家伙怎么尽想着打架？',
            nextId: 'lunch_fail_1', // 跳转到失败节点
            failOnChoose: true,
            affectionDelta: {
            tartaglia: -2 // 拒绝邀请好感度-2
            },
            // 可选：明确失败条件（好感度≤0触发）
            failCondition: {
            tartaglia: (value) => value <= 0
            }
        }
        ]
    },
    
    // 新增切磋失败节点
    lunch_fail_1: {
        id: 'lunch_fail_1',
        type: 'dialogue',
        speaker: 'narrator',
        speakerName: '',
        text: '你拒绝了和达达利亚打一架，他很失望，好感度-2。',
        nextId: null, // 失败后无后续剧情，可后续添加回退选项
        failType: 'affection',
        failAffection: {
        tartaglia: 0 // 失败阈值（好感度≤0）
        }
    },
    
    // 补充：接受切磋后的首个剧情节点（衔接lunch_choice_1_a）
    lunch_8: {
        id: 'lunch_8',
        type: 'dialogue',
        speaker: 'traveler',
        speakerName: '你',
        text: '（白眼）我就知道。',
        nextId: 'fight_1', // 预留后续切磋剧情ID
        affectionTip: {
        tartaglia: 2 // 接受切磋后好感度保持2（若之前是2）
        }
    },
    // 新增打斗相关剧情节点
    fight_1: {
        id: 'fight_1',
        type: 'dialogue',
        speaker: 'paimon',
        speakerName: '派蒙',
        text: '旅行者，加油！',
        nextId: 'fight_2',
    },
    fight_2: {
        id: 'fight_2',
        type: 'narration',
        speaker: 'narration',
        speakerName: '',
        text: '你们开始打斗。你和达达利亚的实力都有长足的进步。后面是达达利亚占上风，最后你被他按倒在地上，他的水形双刀抵住了你的脖子。他俯视着你。',
        nextId: 'fight_3',
    },
    fight_3: {
        id: 'fight_3',
        type: 'dialogue',
        speaker: 'tartaglia',
        speakerName: '达达利亚',
        text: '伙伴，你的实力应该也长进了不少，你是在故意让着我吧？',
        nextId: 'fight_4',
    },
    fight_4: {
        id: 'fight_4',
        type: 'narration',
        speaker: 'narration',
        speakerName: '',
        text: '他收起水刀，保持着俯视你的姿势。这姿势实在暧昧，一旁的派蒙惊讶地捂住嘴不敢出声，达达利亚的呼吸也不由得急促起来。你也红了脸，发现他越靠越近，不由得闭上双眼。但达达利亚在靠近你的脸之后却突然远离，起身把你拉起来。',
        nextId: 'fight_5',
    },
    fight_5: {
        id: 'fight_5',
        type: 'dialogue',
        speaker: 'tartaglia',
        speakerName: '达达利亚',
        text: '已经到了该吃晚饭的时间了。要不我们就地搭个锅做饭怎么样？',
        nextId: 'fight_6',
    },
    fight_6: {
        id: 'fight_6',
        type: 'dialogue',
        speaker: 'traveler',
        speakerName: '你',
        text: '（闷闷不乐）行啊，听你的。（一脸懊恼）',
        nextId: 'fight_7',
    },
    fight_7: {
        id: 'fight_7',
        type: 'narration',
        speaker: 'narration',
        speakerName: '',
        text: '达达利亚背对着你搭起锅来，其实是为了不让你看见他那通红的脸。你们之间沉默着，派蒙想要打破这尴尬的气氛。',
        nextId: 'fight_8',
    },
    fight_8: {
        id: 'fight_8',
        type: 'dialogue',
        speaker: 'paimon',
        speakerName: '派蒙',
        text: '啊哈哈哈，我们能吃上达达利亚做的饭了！还不知道你的厨艺怎么样呢。',
        nextId: 'fight_9',
    },
    fight_9: {
        id: 'fight_9',
        type: 'dialogue',
        speaker: 'tartaglia',
        speakerName: '达达利亚',
        text: '我做的是至冬特色的嘟嘟莲海鲜羹哦。旅行者，能麻烦你给我些嘟嘟莲、螃蟹和薄荷吗？我这儿不够用了。',
        nextId: 'fight_10',
    },
    fight_10: {
        id: 'fight_10',
        type: 'narration',
        speaker: 'narration',
        speakerName: '',
        text: '你给了。达达利亚做了三碗极致一钓，每人一碗。你和派蒙看着面前那卖相不佳的菜满头黑线。',
        nextId: 'fight_11', // 指向吃饭选项节点
    },
    
    fight_11: {
        id: 'fight_11',
        type: 'dialogue',
        speaker: 'paimon',
        speakerName: '派蒙',
        text: '呜哇，这是什么！',
        nextId: 'fight_12', // 预留后续剧情ID
        affectionTip: {
        tartaglia: 3 // 接受吃饭后好感度+1（从2→3）
        }
    },
    fight_12: {
        id: 'fight_12',
        type: 'dialogue',
        speaker: 'tartaglia',
        speakerName: '达达利亚',
        text: '（眯眼笑）只是在原来的基础上加了一些海钓的战利品和老家特产而已。',
        nextId: 'fight_13', // 预留后续剧情ID
    },
    fight_13: {
        id: 'fight_13',
        type: 'dialogue',
        speaker: 'paimon',
        speakerName: '派蒙',
        text: '呜，看起来就没胃口！旅行者你先吃！',
        nextId: 'fight_choice_1', // 预留后续剧情ID
    },
    // 新增吃饭选项节点
    fight_choice_1: {
        id: 'fight_choice_1',
        type: 'choice',
        speaker: 'narrator',
        speakerName: '',
        text: '接下来你会：',
        choices: [
        {
            id: 'fight_choice_1_a',
            label: '吃，这是达达利亚的心意！',
            nextId: 'fight_14', // 正确选项，推进后续剧情
            failOnChoose: false,
            affectionDelta: {
            tartaglia: +1 // 可选：接受吃饭+1好感度，也可设为0
            }
        },
        {
            id: 'fight_choice_1_b',
            label: '不吃，这看起来太怪了！',
            nextId: 'starnight_1', // 直接跳转到星夜节点
            failOnChoose: true,
            affectionDelta: {
            tartaglia: -1 // 拒绝吃饭好感度-1
            },
            failCondition: {
            tartaglia: (value) => value <= 0 // 好感度≤0触发失败
            }
        }
        ]
    },
    // 接续 fight_13 的后续节点
fight_14: {
    id: 'fight_14',
    type: 'dialogue',
    speaker: 'traveler',
    speakerName: '你',
    text: '（鼓起勇气）这可是达达利亚的心意啊，我吃！（努力吃下去）嗯，没想到味道居然相当不错呢！和原本的嘟嘟莲海鲜羹有着不同的风味！',
    nextId: 'fight_15',
  },
  fight_15: {
    id: 'fight_15',
    type: 'dialogue',
    speaker: 'paimon',
    speakerName: '派蒙',
    text: '真的？（吃了一口）好吃！',
    nextId: 'starnight_1', // 按要求指向 starnight_1
  },
  
  // 星夜剧情节点
  starnight_1: {
    id: 'starnight_1',
    type: 'dialogue',
    speaker: 'paimon',
    speakerName: '派蒙',
    text: '没想到你的厨艺真不错！',
    nextId: 'starnight_2',
  },
  starnight_2: {
    id: 'starnight_2',
    type: 'dialogue',
    speaker: 'tartaglia',
    speakerName: '达达利亚',
    text: '我可是在生活的方方面面也追求变强的人。做饭是，钓鱼也是。',
    nextId: 'starnight_3',
  },
  starnight_3: {
    id: 'starnight_3',
    type: 'dialogue',
    speaker: 'traveler',
    speakerName: '你',
    text: '钓鱼？钓鱼协会的人说，鱼线稳定器在至冬推广尤其顺利，据说是受到了某位执行官的喜爱，该不会就是你吧？',
    nextId: 'starnight_4',
  },
  starnight_4: {
    id: 'starnight_4',
    type: 'dialogue',
    speaker: 'tartaglia',
    speakerName: '达达利亚',
    text: '哈哈哈，没错。说起来，我还是从老爹那喜欢上的钓鱼呢。小时候，老爹经常带我去冰湖上钓鱼，虽然等鱼上钩的时间很漫长，但他会给我讲英雄阿贾克斯的冒险故事。在那些故事的陪伴下，钓鱼似乎也不那么无聊了呢。',
    nextId: 'starnight_5',
  },
  starnight_5: {
    id: 'starnight_5',
    type: 'dialogue',
    speaker: 'traveler',
    speakerName: '你',
    text: '阿贾克斯的故事？我好像听说过一些。',
    nextId: 'starnight_6',
  },
  starnight_6: {
    id: 'starnight_6',
    type: 'dialogue',
    speaker: 'tartaglia',
    speakerName: '达达利亚',
    text: '阿贾克斯可是我们那很有名的神话英雄。也是因为崇拜他，我的老爹也给我起了个阿贾克斯的名字。',
    nextId: 'starnight_7',
  },
  starnight_7: {
    id: 'starnight_7',
    type: 'dialogue',
    speaker: 'paimon',
    speakerName: '派蒙',
    text: '原来你的本名叫阿贾克斯？那我们以后可不可以直接这么称呼你呀？',
    nextId: 'starnight_8',
  },
  starnight_8: {
    id: 'starnight_8',
    type: 'dialogue',
    speaker: 'tartaglia',
    speakerName: '达达利亚',
    text: '当然可以，无论是代号「公子」，还是女皇陛下赐予我的名字达达利亚，抑或是我的本名阿贾克斯，都行，因为我们都是老熟人了嘛。',
    nextId: 'starnight_9',
  },
  starnight_9: {
    id: 'starnight_9',
    type: 'dialogue',
    speaker: 'traveler',
    speakerName: '你',
    text: '阿贾……（脸红）算了我还是不习惯直接喊你本名呢。说不定等我旅行到至冬，到你家去做客，才会在你家人面前这么喊吧。你大概不想让家里人和愚人众有过多关联。',
    nextId: 'starnight_10',
  },
  starnight_10: {
    id: 'starnight_10',
    type: 'dialogue',
    speaker: 'tartaglia',
    speakerName: '达达利亚',
    text: '我确实不希望他们接触到这些至冬国的阴暗面。不够光彩的事情，就由我来做好了。身为愚人众的执行官，这也是本职工作。',
    nextId: 'starnight_11',
  },
  starnight_11: {
    id: 'starnight_11',
    type: 'dialogue',
    speaker: 'traveler',
    speakerName: '你',
    text: '我曾读过一首至冬的诗歌，内容就是讲愚人众的。在里面作者把执行官比作「白夜极星」，挺浪漫的比喻。让我想象一下，你在愚人众里是极星一样的存在，嗯……还挺帅？',
    nextId: 'starnight_12',
  },
  starnight_12: {
    id: 'starnight_12',
    type: 'dialogue',
    speaker: 'tartaglia',
    speakerName: '达达利亚',
    text: '哈哈，可惜这里是枫丹，看不到极星是什么样子。如果是在至冬的晴朗的晚上，就能看见了。而且还有其他地方也看不到的极光呢。虽然至冬气候不怎么样，但是极光是真的美。等你来了至冬，我一定带你去看，我的老家就可以看到。',
    nextId: 'starnight_13',
  },
  starnight_13: {
    id: 'starnight_13',
    type: 'dialogue',
    speaker: 'traveler',
    speakerName: '你',
    text: '好，说话算话！',
    nextId: 'starnight_14', // 预留后续剧情ID
    // 可选：标记当前好感度（累计+1后，达达利亚好感度变为4）
    affectionTip: {
      tartaglia: 4
    }
  }
};