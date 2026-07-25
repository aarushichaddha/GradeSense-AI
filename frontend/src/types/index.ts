export type StatusLevel = 'NORMAL' | 'WARNING' | 'CRITICAL' | 'STANDBY';

export type UserRole = 'OPERATOR' | 'PROCESS_ENGINEER' | 'PLANT_MANAGER' | 'ADMIN';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  plantSection: string;
}

export interface PaperGrade {
  code: string;
  name: string;
  targetBasisWeightGsm: number;
  targetMoisturePercent: number;
  targetTensileMd: number;
  targetCaliperMicrons: number;
}

export interface GradeSense {
  id: string;
  paperMachineId: string; // e.g., 'PM-01', 'PM-02'
  sourceGrade: PaperGrade;
  targetGrade: PaperGrade;
  status: 'SCHEDULED' | 'IN_TRANSITION' | 'STABILIZING' | 'COMPLETED' | 'ABORTED';
  startTime: string;
  estimatedCompletionTime: string;
  actualCompletionTime?: string;
  transitionProgressPercent: number;
  predictedWasteTons: number;
}

export interface QualityDeviation {
  id: string;
  transitionId: string;
  parameterName: 'MOISTURE' | 'BASIS_WEIGHT' | 'TENSILE_MD' | 'CALIPER' | 'ASH_CONTENT';
  targetValue: number;
  predictedValue: number;
  deviationPercentage: number;
  severity: StatusLevel;
  timeToDeviationMinutes: number;
  rootCauseTag: string; // e.g., 'DRYER_SECTION_3_STEAM_VALVE'
  status: 'DETECTED' | 'ACKNOWLEDGED' | 'MITIGATED';
}

export interface AIRecommendation {
  id: string;
  transitionId: string;
  deviationId?: string;
  parameterToAdjust: string; // e.g., 'Wet End Vacuum Press #2'
  currentSetting: string;
  recommendedSetting: string;
  unit: string;
  confidenceScore: number; // 0 - 100%
  predictedImpact: string; // e.g., 'Reduces moisture spike by 1.8% in 4 mins'
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'AUTO_APPLIED';
  timestamp: string;
}

export interface TelemetryDataPoint {
  tag: string;
  name: string;
  value: number;
  unit: string;
  minLimit: number;
  maxLimit: number;
  status: StatusLevel;
  timestamp: string;
}

export interface PaperMachineStatus {
  id: string;
  name: string;
  currentSpeedMpm: number; // Meters per minute
  currentGradeCode: string;
  reelTonnage: number;
  activeAlarmsCount: number;
  overallStatus: StatusLevel;
}
