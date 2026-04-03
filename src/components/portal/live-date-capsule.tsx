"use client";

import {
  CalendarDays,
  Check,
  Clock3,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";

import type { Role } from "@/lib/data";
import { cn } from "@/lib/utils";

type CalendarTask = {
  id: string;
  title: string;
  dateKey: string;
  time: string;
  createdByRole: Role;
  createdAt: string;
  updatedAt: string;
};

type LiveDateCapsuleProps = {
  role: Role;
};

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

function buildMonthGrid(current: Date) {
  const year = current.getFullYear();
  const month = current.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const leading = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();
  const cells: Array<{ day: number | null; dateKey: string | null; isToday: boolean }> = [];

  for (let index = 0; index < leading; index += 1) {
    cells.push({ day: null, dateKey: null, isToday: false });
  }

  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(year, month, day);
    cells.push({
      day,
      dateKey: formatDateKey(date),
      isToday: day === current.getDate(),
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ day: null, dateKey: null, isToday: false });
  }

  return cells;
}

export function LiveDateCapsule({ role }: LiveDateCapsuleProps) {
  const [now, setNow] = useState(() => new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDateKey, setSelectedDateKey] = useState(() => formatDateKey(new Date()));
  const [draftTitle, setDraftTitle] = useState("");
  const [draftTime, setDraftTime] = useState("10:00");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const closeTimerRef = useRef<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelWidth = 396;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, 1000 * 30);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let isDisposed = false;

    async function loadTasks() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`/api/v1/calendar/tasks?role=${role}`, {
          method: "GET",
          cache: "no-store",
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error ?? "Unable to load calendar tasks.");
        }

        if (!isDisposed) {
          setTasks(Array.isArray(result.data) ? result.data : []);
        }
      } catch (error) {
        if (!isDisposed) {
          setErrorMessage(
            error instanceof Error ? error.message : "Unable to load calendar tasks.",
          );
        }
      } finally {
        if (!isDisposed) {
          setIsLoading(false);
        }
      }
    }

    void loadTasks();

    return () => {
      isDisposed = true;
    };
  }, [role]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const updatePosition = () => {
      const trigger = triggerRef.current;

      if (!trigger) {
        return;
      }

      const rect = trigger.getBoundingClientRect();
      const width = Math.min(panelWidth, window.innerWidth - 24);
      const left = Math.min(
        window.innerWidth - width - 12,
        Math.max(12, rect.right - width),
      );

      setPanelStyle({
        position: "fixed",
        top: rect.bottom + 12,
        left,
        width,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const dayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
      }).format(now),
    [now],
  );

  const dateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(now),
    [now],
  );

  const shortClock = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now),
    [now],
  );

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        month: "long",
        year: "numeric",
      }).format(now),
    [now],
  );

  const selectedDate = useMemo(() => parseDateKey(selectedDateKey), [selectedDateKey]);
  const selectedDateLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(selectedDate),
    [selectedDate],
  );

  const monthGrid = useMemo(() => buildMonthGrid(now), [now]);
  const weekdayChips = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const tasksByDay = useMemo(() => {
    return tasks.reduce<Record<string, number>>((accumulator, task) => {
      accumulator[task.dateKey] = (accumulator[task.dateKey] ?? 0) + 1;
      return accumulator;
    }, {});
  }, [tasks]);

  const selectedTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.dateKey === selectedDateKey)
        .sort((left, right) => left.time.localeCompare(right.time)),
    [selectedDateKey, tasks],
  );

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openPanel = () => {
    clearCloseTimer();
    setIsOpen(true);
  };

  const queueClose = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 160);
  };

  const resetComposer = () => {
    setDraftTitle("");
    setDraftTime("10:00");
    setEditingTaskId(null);
  };

  const upsertTaskInState = (task: CalendarTask) => {
    setTasks((currentTasks) => {
      const existing = currentTasks.some((entry) => entry.id === task.id);

      if (!existing) {
        return [...currentTasks, task];
      }

      return currentTasks.map((entry) => (entry.id === task.id ? task : entry));
    });
  };

  const handleTaskSubmit = async () => {
    const title = draftTitle.trim();

    if (!title || isSaving) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const endpoint = editingTaskId
        ? `/api/v1/calendar/tasks/${editingTaskId}?role=${role}`
        : `/api/v1/calendar/tasks?role=${role}`;
      const method = editingTaskId ? "PATCH" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          dateKey: selectedDateKey,
          time: draftTime,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to save the calendar task.");
      }

      upsertTaskInState(result.data as CalendarTask);
      resetComposer();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to save the calendar task.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTaskEdit = (task: CalendarTask) => {
    setEditingTaskId(task.id);
    setSelectedDateKey(task.dateKey);
    setDraftTitle(task.title);
    setDraftTime(task.time);
    setErrorMessage("");
  };

  const handleTaskDelete = async (taskId: string) => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      const response = await fetch(`/api/v1/calendar/tasks/${taskId}?role=${role}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to delete the calendar task.");
      }

      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));

      if (editingTaskId === taskId) {
        resetComposer();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to delete the calendar task.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative z-[120]">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          clearCloseTimer();
          setIsOpen((value) => !value);
        }}
        onMouseEnter={openPanel}
        onMouseLeave={queueClose}
        className="rounded-full border border-white/12 bg-white/8 px-4 py-3 text-sm text-slate-200 transition hover:border-cyan-300/20 hover:bg-white/10"
        aria-expanded={isOpen}
        aria-label="Open date and clock panel"
      >
        {dayLabel} sync - {dateLabel} - {shortClock}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[190] bg-transparent pointer-events-auto"
          onMouseEnter={clearCloseTimer}
          onMouseLeave={queueClose}
        >
          <div
            className="pointer-events-auto z-[200] origin-top-right rounded-[28px] border border-white/12 bg-slate-900/92 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.48)] backdrop-blur-xl"
            style={panelStyle}
          >
            <div className="absolute inset-x-6 top-0 h-28 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.18),transparent_70%)] blur-3xl" />

            <div className="relative z-10 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Live calendar
                  </div>
                  <p className="font-heading text-2xl text-white">{dayLabel}</p>
                  <p className="text-sm text-slate-300">{dateLabel}</p>
                </div>

                <div className="rounded-[22px] border border-cyan-300/18 bg-cyan-300/10 px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-cyan-100/70">
                    <Clock3 className="h-3.5 w-3.5" />
                    Time
                  </div>
                  <p className="mt-2 font-heading text-2xl text-white">{shortClock}</p>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/12 bg-white/8 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{monthLabel}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    {now.getDate().toString().padStart(2, "0")}
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-7 gap-2">
                  {weekdayChips.map((label) => (
                    <div
                      key={label}
                      className="text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500"
                    >
                      {label}
                    </div>
                  ))}

                  {monthGrid.map((cell, index) => {
                    const taskCount = cell.dateKey ? tasksByDay[cell.dateKey] ?? 0 : 0;
                    const isSelected = cell.dateKey === selectedDateKey;

                    return (
                      <button
                        key={`${cell.dateKey ?? "blank"}-${index}`}
                        type="button"
                        disabled={cell.day === null}
                        onClick={() => cell.dateKey && setSelectedDateKey(cell.dateKey)}
                        className={cn(
                          "relative flex h-10 items-center justify-center rounded-xl text-sm text-slate-300 transition",
                          cell.day === null && "cursor-default opacity-0",
                          cell.day !== null && "hover:bg-white/10",
                          cell.isToday &&
                            "border border-cyan-300/28 bg-cyan-300/14 font-semibold text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.18)]",
                          isSelected &&
                            !cell.isToday &&
                            "border border-white/14 bg-white/10 text-white",
                        )}
                      >
                        {cell.day}
                        {taskCount > 0 ? (
                          <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.45)]" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[24px] border border-white/12 bg-white/8 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">Scheduled tasks</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                        {selectedDateLabel}
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
                      {selectedTasks.length} items
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {isLoading ? (
                      <div className="rounded-2xl border border-dashed border-white/12 bg-slate-950/28 px-4 py-5 text-sm leading-7 text-slate-400">
                        Loading scheduled tasks...
                      </div>
                    ) : selectedTasks.length > 0 ? (
                      selectedTasks.map((task) => (
                        <div
                          key={task.id}
                          className="rounded-2xl border border-white/12 bg-slate-950/36 px-4 py-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-white">{task.title}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                                {task.time}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleTaskEdit(task)}
                                className="rounded-full border border-white/10 bg-white/8 p-2 text-slate-300 transition hover:border-cyan-300/25 hover:text-white"
                                aria-label={`Edit ${task.title}`}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => void handleTaskDelete(task.id)}
                                className="rounded-full border border-white/10 bg-white/8 p-2 text-slate-300 transition hover:border-rose-300/25 hover:text-rose-100"
                                aria-label={`Delete ${task.title}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/12 bg-slate-950/28 px-4 py-5 text-sm leading-7 text-slate-400">
                        No tasks scheduled yet for this day.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/12 bg-white/8 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {editingTaskId ? "Edit task" : "Add task"}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">
                        Planner mode
                      </p>
                    </div>
                    <div className="rounded-full border border-cyan-300/18 bg-cyan-300/10 p-2 text-cyan-50">
                      {editingTaskId ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <label className="block space-y-2">
                      <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        Task title
                      </span>
                      <input
                        value={draftTitle}
                        onChange={(event) => setDraftTitle(event.target.value)}
                        placeholder="Add a meeting, reminder, or task"
                        className="w-full rounded-2xl border border-white/12 bg-slate-950/40 px-4 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40"
                      />
                    </label>

                    <label className="block space-y-2">
                      <span className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        Time
                      </span>
                      <input
                        type="time"
                        value={draftTime}
                        onChange={(event) => setDraftTime(event.target.value)}
                        className="w-full rounded-2xl border border-white/12 bg-slate-950/40 px-4 py-3 text-sm text-slate-200 outline-none transition focus:border-cyan-300/40"
                      />
                    </label>

                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Selected date: {selectedDateLabel}
                    </p>

                    {errorMessage ? (
                      <div className="rounded-2xl border border-rose-300/18 bg-rose-300/10 px-4 py-3 text-sm text-rose-100">
                        {errorMessage}
                      </div>
                    ) : null}

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void handleTaskSubmit()}
                        disabled={isSaving}
                        className="flex-1 rounded-full border border-cyan-300/25 bg-cyan-300/12 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-50 transition hover:border-cyan-200/40 hover:bg-cyan-300/18 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSaving ? "Saving..." : editingTaskId ? "Save task" : "Add task"}
                      </button>
                      {editingTaskId ? (
                        <button
                          type="button"
                          onClick={resetComposer}
                          className="rounded-full border border-white/12 bg-white/8 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/12"
                        >
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
