import type { RepairTracking } from "./public-api";

type ProgressStep = RepairTracking["tracking_progress"]["steps"][number];

export function nearbyRepairProgressSteps(steps: ProgressStep[], currentStepCode: string): ProgressStep[] {
  if (!steps.length) return [];
  let current = steps.findIndex((step) => step.state === "current");
  if (current < 0) current = steps.findIndex((step) => step.code === currentStepCode);
  if (current < 0) {
    current = steps.reduce((latest, step, index) => step.state === "completed" ? index : latest, -1);
  }
  if (current < 0) current = 0;
  return steps.slice(Math.max(0, current - 2), current + 2);
}

export function latestRepairUpdate(events: RepairTracking["timeline"]) {
  return events.reduce<(typeof events)[number] | undefined>((latest, event) => {
    const timestamp = Date.parse(event.occurred_at);
    const latestTimestamp = latest ? Date.parse(latest.occurred_at) : NaN;
    return !latest || (Number.isFinite(timestamp) && (!Number.isFinite(latestTimestamp) || timestamp >= latestTimestamp)) ? event : latest;
  }, undefined);
}

export function repairProgressSteps(tracking: RepairTracking): ProgressStep[] {
  const steps = tracking.tracking_progress.steps;
  // Leave independently supplied testing stages intact if the API adds them.
  if (steps.some((step) => ["testing", "qa_pending", "qa_in_progress"].includes(step.code))) return steps;

  return steps.flatMap((step): ProgressStep[] => {
    if (step.code !== "in_repair") return [step];
    const status = tracking.job.status;
    const testing = ["qa_pending", "qa_in_progress"].includes(status);
    const finished = ["ready_for_dispatch", "out_for_delivery", "completed"].includes(status) ||
      (step.state === "completed" && tracking.tracking_progress.current_step_code !== "in_repair");
    const repairing = ["in_repair", "rework_required"].includes(status);
    return [
      {
        ...step,
        title: "Repair",
        description: finished || testing ? "Your device has been repaired" : "Your device is being repaired",
        state: finished || testing ? "completed" : repairing ? "current" : "upcoming",
        status_label: finished || testing ? "Done" : repairing ? "Active" : step.status_label,
      },
      {
        code: "testing",
        title: "Testing",
        description: finished ? "Your device has passed quality checks" : testing ? "Your device is awaiting or undergoing quality checks" : "Quality checks after repair",
        state: finished ? "completed" : testing ? "current" : "upcoming",
        status_label: finished ? "Done" : status === "qa_pending" ? "Awaiting testing" : testing ? "Active" : "After repair",
        occurred_at: finished ? latestRepairUpdate(tracking.timeline.filter((event) => event.event_code === "qa_completed"))?.occurred_at : undefined,
      },
    ];
  });
}
