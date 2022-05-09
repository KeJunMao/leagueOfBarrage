export interface ICMD {
  cmd: string;
  info: any[];
  data: any;
}

export interface IDanMu_MSGData extends ICMD {}
export interface ISendGiftData extends ICMD {}

export interface IParseGiftData {
  id: number;
  name: string;
  num: number;
  mid: number;
}

export function parseANMU_MSG(data: IDanMu_MSGData) {
  const { info } = data;
  const text: string = info[1];
  const user = info[2];
  const mid: number = user[0];
  const name: string = user[1];
  return { text, mid, name };
}

export function parseSEND_GIFT(data: ISendGiftData) {
  const { data: gift } = data;
  const { giftId, giftName, num, uid } = gift;
  const result: IParseGiftData = {
    id: giftId,
    name: giftName,
    num,
    mid: uid,
  };
  return result;
  // const test = {
  //   cmd: "SEND_GIFT",
  //   data: {
  //     action: "投喂",
  //     batch_combo_id: "",
  //     batch_combo_send: null,
  //     beatId: "",
  //     biz_source: "Live",
  //     blind_gift: null,
  //     broadcast_id: 0,
  //     coin_type: "silver",
  //     combo_resources_id: 1,
  //     combo_send: null,
  //     combo_stay_time: 3,
  //     combo_total_coin: 0,
  //     crit_prob: 0,
  //     demarcation: 1,
  //     discount_price: 0,
  //     dmscore: 56,
  //     draw: 0,
  //     effect: 0,
  //     effect_block: 1,
  //     face: "http://i2.hdslb.com/bfs/face/e442ad4a239c885b75b7b4f7f930387e7f77ce4e.jpg",
  //     float_sc_resource_id: 0,
  //     giftId: 1,
  //     giftName: "辣条",
  //     giftType: 5,
  //     gold: 0,
  //     guard_level: 0,
  //     is_first: true,
  //     is_special_batch: 0,
  //     magnification: 1,
  //     medal_info: {
  //       anchor_roomid: 0,
  //       anchor_uname: "",
  //       guard_level: 0,
  //       icon_id: 0,
  //       is_lighted: 0,
  //       medal_color: 0,
  //       medal_color_border: 0,
  //       medal_color_end: 0,
  //       medal_color_start: 0,
  //       medal_level: 0,
  //       medal_name: "",
  //       special: "",
  //       target_id: 0,
  //     },
  //     name_color: "",
  //     num: 1,
  //     original_gift_name: "",
  //     price: 100,
  //     rcost: 483,
  //     remain: 0,
  //     rnd: "1652106928120800021",
  //     send_master: null,
  //     silver: 0,
  //     super: 0,
  //     super_batch_gift_num: 0,
  //     super_gift_num: 0,
  //     svga_block: 0,
  //     tag_image: "",
  //     tid: "1652106928120800021",
  //     timestamp: 1652106928,
  //     top_list: null,
  //     total_coin: 100,
  //     uid: 77236988,
  //     uname: "话多起腻懂",
  //   },
  // };
}
