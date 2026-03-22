import { slot, type Member } from "./scheduling";

/** Demo meeting title shown in invite / reschedule flows */
export const DEMO_MEETING_TITLE = "MeetFlow 產品同步會";

/** Default first common slot (Wed 9–10) — aligns with INITIAL_MEMBERS overlap */
export const DEFAULT_EVENT_SLOT = "2-9";

export const EVENT_STORAGE_KEY = "meetflow:eventSlot";

// 假資料：三人皆有「週三 9–11」共同空閒，方便展示
export const INITIAL_MEMBERS: Member[] = [
  {
    id: "me",
    name: "我",
    color: "bg-blue-500",
    availability: [
      slot(0, 9),
      slot(0, 10),
      slot(0, 11),
      slot(0, 14),
      slot(0, 15),
      slot(0, 16),
      slot(2, 9),
      slot(2, 10),
      slot(2, 11),
      slot(3, 14),
      slot(3, 15),
      slot(3, 16),
      slot(4, 9),
      slot(4, 10),
    ],
  },
  {
    id: "xiao-liang",
    name: "小梁",
    color: "bg-green-500",
    availability: [
      slot(0, 9),
      slot(0, 10),
      slot(0, 11),
      slot(2, 9),
      slot(2, 10),
      slot(2, 11),
      slot(2, 14),
      slot(2, 15),
      slot(2, 16),
      slot(4, 9),
      slot(4, 10),
    ],
  },
  {
    id: "lu-lu",
    name: "盧盧",
    color: "bg-purple-500",
    availability: [
      slot(1, 10),
      slot(1, 11),
      slot(1, 12),
      slot(2, 9),
      slot(2, 10),
      slot(2, 11),
      slot(3, 14),
      slot(3, 15),
    ],
  },
];
