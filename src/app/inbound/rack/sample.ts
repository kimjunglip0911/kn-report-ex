/** 빈 랙 로케이션. 같은 호출은 항상 같다. */

export type FloorId = "HG" | "HF" | "HA";

export type RackZone = {
  code: string;
  slots: string[];
};

export type RackFloor = {
  id: FloorId;
  label: string;
  zones: RackZone[];
};

type FloorSpec = { id: FloorId; label: string; zones: number };

const specs: FloorSpec[] = [
  { id: "HG", label: "지하", zones: 12 },
  { id: "HF", label: "1F", zones: 8 },
  { id: "HA", label: "2F", zones: 8 },
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** 구역 번호에 따라 번지 수를 바꾼다. 단은 2단이다. */
function baysOf(zone: number): number {
  return 6 + (zone % 4);
}

function zoneOf(id: FloorId, zone: number): RackZone {
  const zz = pad(zone);
  const bays = baysOf(zone);
  const slots: string[] = [];
  for (let bay = 1; bay <= bays; bay += 1) {
    slots.push(`${id}${zz}${pad(bay)}02`);
    slots.push(`${id}${zz}${pad(bay)}01`);
  }
  return { code: `${id}${zz}`, slots };
}

export function rackFloors(): RackFloor[] {
  return specs.map((spec) => ({
    id: spec.id,
    label: spec.label,
    zones: Array.from({ length: spec.zones }, (_, index) => zoneOf(spec.id, index + 1)),
  }));
}
