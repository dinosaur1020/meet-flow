"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  commonSlotsForMembers,
  formatSlotLabel,
  type TimeSlot,
} from "@/lib/scheduling";
import {
  DEMO_MEETING_TITLE,
  EVENT_STORAGE_KEY,
  INITIAL_MEMBERS,
} from "@/lib/demo-data";
import {
  notifyEventSlotChange,
  useEventSlotFromStorage,
} from "@/lib/use-event-slot";

export default function ReschedulePage() {
  const members = INITIAL_MEMBERS;
  const eventSlot = useEventSlotFromStorage();
  const [successOpen, setSuccessOpen] = useState(false);

  const common = useMemo(
    () => commonSlotsForMembers(members),
    [members]
  );

  const suggested = useMemo(
    () =>
      common.find((s) => s !== eventSlot) ?? common[0] ?? null,
    [common, eventSlot]
  );

  const [picked, setPicked] = useState<TimeSlot | null>(null);
  const selected = picked ?? suggested;

  function confirmReschedule() {
    if (!selected) return;
    try {
      localStorage.setItem(EVENT_STORAGE_KEY, selected);
      notifyEventSlotChange();
    } catch {
      /* ignore */
    }
    setSuccessOpen(true);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <CalendarCheck className="w-5 h-5" />
          <h1 className="text-lg font-semibold tracking-tight">MeetFlow</h1>
          <Badge variant="secondary" className="text-xs font-normal">
            Beta
          </Badge>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回首頁
        </Link>

        <div className="mb-8">
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <CalendarClock className="w-6 h-6" />
            重新排程
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            系統已比對所有參與者最新日曆空檔，請選擇新的會議時間。
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                目前會議
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="font-medium">{DEMO_MEETING_TITLE}</p>
              <p className="text-sm text-muted-foreground">
                原訂時間：{" "}
                <span className="text-foreground font-medium">
                  {formatSlotLabel(eventSlot)}
                </span>
              </p>
              <div>
                <p className="text-xs text-muted-foreground mb-2">參與者</p>
                <div className="flex flex-wrap gap-2">
                  {members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-1.5 rounded-full border bg-muted/40 px-2 py-1 text-xs"
                    >
                      <Avatar className="w-5 h-5">
                        <AvatarFallback
                          className={`${m.color} text-white text-[10px]`}
                        >
                          {m.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {m.name}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4" />
                改期後
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                確認後將更新日曆事件，並寄送改期通知給所有參與者。
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              可選時段（共同空閒）
            </CardTitle>
            <p className="text-sm text-muted-foreground font-normal">
              以下時段為所有人日曆交集；點選一個時段後按「確認改期」。
            </p>
          </CardHeader>
          <CardContent>
            {common.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                目前沒有任何共同空閒，請成員更新時間表後再試。
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {common.map((s) => {
                  const active = selected === s;
                  const isCurrent = s === eventSlot;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPicked(s)}
                      className={`text-left text-sm px-4 py-3 rounded-xl border transition-colors ${
                        active
                          ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                          : "border-border hover:bg-muted/60"
                      }`}
                    >
                      <span className="font-medium block">
                        {formatSlotLabel(s)}
                      </span>
                      {isCurrent && (
                        <span className="text-xs text-muted-foreground">
                          目前預訂
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="gap-2"
                disabled={!selected || common.length === 0}
                onClick={confirmReschedule}
              >
                <CheckCircle2 className="w-4 h-4" />
                確認改期
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">取消</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              已更新會議時間
            </DialogTitle>
            <DialogDescription asChild>
              <div className="text-sm text-muted-foreground space-y-2 pt-2">
                <p>
                  已將「{DEMO_MEETING_TITLE}」改為{" "}
                  <strong className="text-foreground">
                    {selected ? formatSlotLabel(selected) : ""}
                  </strong>
                  。
                </p>
                <p>
                  日曆事件已同步更新，改期通知已寄送給 {members.length}{" "}
                  位參與者。
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <Button className="w-full" asChild>
            <Link href="/" onClick={() => setSuccessOpen(false)}>
              回到首頁
            </Link>
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
