export { GoalForm } from './components/GoalForm'
export { GoalTagSelect } from './components/GoalTagSelect'
export { ProgressRing } from './components/ProgressRing'
export { StatusBadge } from './components/StatusBadge'
export { BurndownChart } from './components/BurndownChart'
export { Heatmap } from './components/Heatmap'
export { GoalMiniCard } from './components/GoalMiniCard'
export {
  computeGoalProgress,
  buildBurndownSeries,
  PACE_STATUS_LABEL,
  type GoalPaceStatus,
  type GoalProgress,
} from './lib/progress'
export {
  buildHeatmapGrid,
  HEATMAP_WEEKS,
  type DailyAggregate,
  type HeatmapMetric,
} from './lib/heatmap'
