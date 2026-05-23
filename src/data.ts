/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chapter, Question } from "./types";

export const CHAPTERS: Chapter[] = [
  {
    id: "earthquake",
    title: "EARTHQUAKE",
    titleZh: "地震",
    emoji: "🌍",
    color: "#ff7043",
    glow: "rgba(255,112,67,0.12)",
    cls: "eq",
    questions: [
      {
        scenario: "強震瞬間應變",
        q: "地震發生正在搖晃時，正確的避難保命三步驟是什麼？",
        opts: [
          "趕快跑出家門",
          "先去開門和關瓦斯",
          "趴下、掩護、穩住，並保護頭部",
          "立刻搭電梯下樓"
        ],
        ans: 2,
        slogan: "趴掩穩，護頭頸",
        exp: "地震搖晃時，首要目標是保護頭頸部免於受傷，應躲在堅固桌子下抓牢桌腳。"
      },
      {
        scenario: "家具固定防範",
        q: "為了防止地震時家具翻倒傷人，下列哪種做法是正確的？",
        opts: [
          "將重物放在櫃子的最高處",
          "使用 L 型金屬架或固定帶將大型家具固定在牆上",
          "滾輪家具不需要加裝托盤",
          "櫃子的門應該隨時敞開"
        ],
        ans: 1,
        slogan: "大型家具防傾倒",
        exp: "固定家具能避免地震時家具傾倒或移動造成受傷。"
      },
      {
        scenario: "震度與規模觀念",
        q: "關於地震的「震度」與「規模」，下列敘述何者正確？",
        opts: [
          "規模是指各觀測點感受到的搖晃程度",
          "同一次地震，不同地區的震度會相同",
          "震度是表示地震釋放能量的多寡",
          "規模是指震源釋放能量的多寡，同一次地震數值會相同"
        ],
        ans: 3,
        slogan: "規模單一，震度看地區",
        exp: "地震規模代表地震釋放能量，數值只有一個；而震度則是地面受搖晃的劇烈程度，會隨地區不同。"
      },
      {
        scenario: "震後避難撤離",
        q: "地震停止搖晃後，如果要離開室內避難，下列哪項做法不正確？",
        opts: [
          "穿上鞋子防止被玻璃碎片割傷",
          "為了求快，應搭乘電梯",
          "隨手關閉電源開關與瓦斯",
          "戴上安全帽或防護頭套保護頭部"
        ],
        ans: 1,
        slogan: "嚴禁搭乘電梯",
        exp: "地震後嚴禁搭乘電梯以免受困，應走樓梯並注意掉落物。"
      },
      {
        scenario: "海邊地震避險",
        q: "在海邊遊玩時如果感覺到地震搖晃，該怎麼辦？",
        opts: [
          "繼續留在沙灘看是否有海嘯發生",
          "趕快跳入海中游泳",
          "應儘速遠離海岸線往高處避難",
          "站在堤防上觀察海面變化"
        ],
        ans: 2,
        slogan: "預防海嘯奔高處",
        exp: "近海地震可能引發海嘯，應在感覺搖晃後立即往內陸高處撤離。"
      }
    ]
  },
  {
    id: "fire",
    title: "FIRE",
    titleZh: "火災",
    emoji: "🔥",
    color: "#ef5350",
    glow: "rgba(239,83,80,0.12)",
    cls: "fi",
    questions: [
      {
        scenario: "滅火器口訣與操作",
        q: "正確使用滅火器的口訣「拉、瞄、壓、掃」中，「拉」是指什麼？",
        opts: [
          "拉開與火源的距離",
          "拉出皮管",
          "拔掉安全插梢",
          "拉起手把"
        ],
        ans: 2,
        slogan: "拉瞄壓掃，拔安全插梢",
        exp: "滅火器操作首步為「拉」，即拔出安全插梢。"
      },
      {
        scenario: "濃煙避難誤區",
        q: "火災發生時，如果門外已有濃煙，下列避難行為何者錯誤？",
        opts: [
          "趕快用濕毛巾摀住口鼻並衝出濃煙區",
          "關門室內避難，並用衣物或濕布塞住門縫",
          "到有窗戶的空間向外求救",
          "採低姿勢爬行（離地 30~50 公分處仍有空氣）"
        ],
        ans: 0,
        slogan: "切勿嘗試穿濃煙",
        exp: "切勿嘗試穿越濃煙，若無法逃生應關門避難以阻絕煙霧擴散。"
      },
      {
        scenario: "火災緊急報案",
        q: "發生火災報案時，應撥打哪一個緊急電話？",
        opts: [
          "110",
          "119",
          "123",
          "104"
        ],
        ans: 1,
        slogan: "消防救護撥 119",
        exp: "119 為消防及緊急救護專線。"
      },
      {
        scenario: "初期火災預警",
        q: "為了及早發現家中的火災，住家應安裝什麼設備？",
        opts: [
          "地震警報器",
          "住宅用火災警報器（住警器）",
          "一氧化碳探測器",
          "空氣清淨機"
        ],
        ans: 1,
        slogan: "裝設住警器爭取時間",
        exp: "住警器能在火災初期偵測煙霧或高溫，為家人爭取逃生時間。"
      },
      {
        scenario: "電線走火處置",
        q: "電線走火時，絕對不可以用什麼來撲滅？",
        opts: [
          "乾粉滅火器",
          "二氧化碳滅火器",
          "水",
          "專用的防火毯"
        ],
        ans: 2,
        slogan: "電線走火嚴禁潑水",
        exp: "電氣火災（C 類火災）若用水撲滅會導致觸電危險。"
      }
    ]
  },
  {
    id: "typhoon",
    title: "TYPHOON",
    titleZh: "颱風與土石流",
    emoji: "🌀",
    color: "#26c6da",
    glow: "rgba(38,198,218,0.12)",
    cls: "ty",
    questions: [
      {
        scenario: "防颱事前準備",
        q: "下列哪一項是颱風來臨前的正確準備工作？",
        opts: [
          "到海邊觀察浪花",
          "檢查並清理陽台排水口及家中排水溝",
          "準備到山上露營",
          "不需要特別固定招牌或盆栽"
        ],
        ans: 1,
        slogan: "清空排水溝防積水",
        exp: "颱風前應清理排水系統防止積淹水，並加固門窗。"
      },
      {
        scenario: "土石流預兆識別",
        q: "居住在山區如果發現哪種現象，可能是土石流要發生了？",
        opts: [
          "溪水變清澈且流量減少",
          "聽到像火車撞擊或雷鳴的巨響（山鳴）",
          "發現附近有許多漂亮的蝴蝶飛舞",
          "天空出現彩虹"
        ],
        ans: 1,
        slogan: "山鳴巨響防土石流",
        exp: "土石流徵兆包括溪水異常混濁、出現山鳴聲 or 石頭摩擦聲。"
      },
      {
        scenario: "土石流逃生求生",
        q: "遇到土石流發生時，應該朝哪個方向逃生才正確？",
        opts: [
          "順著土石流流動的方向往下跑",
          "往土石流兩側高地移動（與流向垂直）",
          "躲在河床邊的樹木後",
          "往土石流上游的方向跑"
        ],
        ans: 1,
        slogan: "垂直流向往兩側逃",
        exp: "遇到土石流絕對不能順著流向跑，必須立即往兩側高處撤離。"
      },
      {
        scenario: "災後衛生管理",
        q: "淹水過後，關於住家環境與飲水的處理，何者錯誤？",
        opts: [
          "食物應煮熟，水需煮沸後才可飲用",
          "淹過水的餐具與家具要清洗消毒",
          "停電過後冰箱內的食物仍可放心食用",
          "清除容器積水，避免蚊蟲（如登革熱）孳生"
        ],
        ans: 2,
        slogan: "過期或停電食物勿食用",
        exp: "停電後冰箱無法保溫，食物易變質腐壞，不宜再食用。"
      }
    ]
  },
  {
    id: "flood",
    title: "PREPAREDNESS",
    titleZh: "救護與備災",
    emoji: "🎒",
    color: "#5c6bc0",
    glow: "rgba(92,107,192,0.12)",
    cls: "fl",
    questions: [
      {
        scenario: "備災避難包收納",
        q: "「緊急避難包」應該放置在哪裡最合適？",
        opts: [
          "儲藏室的最深處",
          "床底下",
          "家門口或玄關等隨手可拿到的地方",
          "鎖進保險箱裡"
        ],
        ans: 2,
        slogan: "避難包置隨手拿取處",
        exp: "避難包應放在隨手可得處，災害發生需撤離時能立即攜帶。"
      },
      {
        scenario: "備災物資更新",
        q: "「緊急避難包」內的必需品，應間隔多久檢查更新一次？",
        opts: [
          "每個月一次",
          "每半年一次",
          "每年一次",
          "只要準備一次，永遠不用檢查"
        ],
        ans: 1,
        slogan: "每半年檢查更新",
        exp: "應至少每半年檢查一次避難包，更新食物、藥品與電池。"
      },
      {
        scenario: "異物梗塞急救",
        q: "當同伴吃東西噎住，無法咳嗽或說話時，應採取哪種急救法？",
        opts: [
          "心肺復甦術(CPR)",
          "哈姆立克法",
          "壓迫止血法",
          "沖脫泡蓋送"
        ],
        ans: 1,
        slogan: "噎住採取哈姆立克法",
        exp: "哈姆立克法可用於排除呼吸道異物梗塞。"
      },
      {
        scenario: "心肺復甦術定位",
        q: "實施新版 CPR 的按壓部位是在哪裡？",
        opts: [
          "左邊胸部（心臟位置）",
          "兩乳頭連線中央處的胸骨上",
          "肚子中央",
          "脖子喉嚨處"
        ],
        ans: 1,
        slogan: "兩乳頭連線胸骨中央",
        exp: "CPR 按壓位置為胸部正中央，即兩乳頭連線中點的胸骨處。"
      },
      {
        scenario: "割傷出血止血",
        q: "手臂嚴重割傷出血時，初步處置應如何進行？",
        opts: [
          "把手放低，加速血液流出清洗傷口",
          "直接壓迫傷口止血，並將患肢抬高於心臟",
          "不斷沖水",
          "塗抹醬油或牙膏"
        ],
        ans: 1,
        slogan: "壓迫傷口並抬高患肢",
        exp: "應先進行直接壓迫止血，並配合抬高傷處以減少出血量。"
      }
    ]
  }
];

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function prepareChapterQuestions(questions: Question[]): Question[] {
  // 1. Shuffle original questions randomly to make questions appear in random order
  const shuffledQuestions = shuffleArray(questions);
  
  // 2. Shuffle options for each question independently, tracking new ans index
  return shuffledQuestions.map((q) => {
    const originalAnswerText = q.opts[q.ans];
    const shuffledOptions = shuffleArray(q.opts);
    const newAnswerIndex = shuffledOptions.indexOf(originalAnswerText);
    return {
      ...q,
      opts: shuffledOptions,
      ans: newAnswerIndex === -1 ? q.ans : newAnswerIndex,
    };
  });
}
